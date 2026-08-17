# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

```
/                    ← Static HTML landing pages (served directly)
/web/                ← Next.js 16 generator app (the main tool)
/figma-plugin/       ← Figma Plugin (code.js + manifest.json)
/generator/          ← GENERATOR-PROMPT.md, BRIEF-TEMPLATE.md, supabase-schema.sql
/server.js           ← Minimal Node.js static server + Anthropic API proxy (no deps)
/RESEARCH.md         ← Full competitive research, product details, per-market data
```

## Running the web app

> **Next.js 16 note:** `web/AGENTS.md` warns that this version has breaking changes from earlier Next.js — APIs, conventions, and file structure may differ from training data. Check `node_modules/next/dist/docs/` before writing Next.js-specific code.

```bash
cd web
npm run dev     # starts on :3000 by default (auto-increments if port is taken)
npm run build
npm run lint
```

**Required** `web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
MOCK_LLM=true    # set to skip all Anthropic calls — zero token cost
```

## Running the static pages (no build needed)

```bash
node server.js   # serves HTML pages at http://localhost:3001
```

## Supabase schema

Run `generator/supabase-schema.sql` in the Supabase SQL editor to provision the two tables:
- `briefs` — stores form inputs (vertical, markets, rawBrief, status)
- `generated_pages` — stores output (html, filename, status, SEO fields)

RLS is enabled; API routes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). Browser client uses anon key (read-only for the dashboard).

## Generation pipeline (`web/`)

The core flow lives in `web/app/api/generate/route.ts` and runs as a server-sent events (SSE) stream:

1. **Save brief** → `briefs` table
2. **MCP enrichment** (`lib/mcp.ts`) → calls `https://hitpay-knowledge-mcp.vercel.app/api/mcp` (HitPay knowledge base, 30s timeout, non-blocking on failure)
3. **HTML generation** (`lib/anthropic.ts: generateHtml`) → Claude Sonnet streams HTML; system prompt and research context are prompt-cached
4. **Save generated page** → `generated_pages` table with html + auto-derived SEO fields (`lib/seo.ts`)

SSE events emitted: `status`, `chunk`, `usage`, `done`, `error`. The frontend (`app/new/page.tsx`) buffers and parses these.

**Reliability**: `/api/generate` has `maxDuration = 300` — the hard ceiling on this project's current Vercel plan (Hobby; confirmed via a failed deploy attempt at 800s: "maxDuration must be between 1 and 300 for plan hobby"). Raising it requires upgrading to Pro first (Pro/Enterprise support up to 800s GA, 1800s in beta, via Fluid Compute). Vercel hard-kills the function at 300s with no chance for app code to run (no error event, no DB update), which can leave a brief stuck at `status: 'generating'` forever with the page never saved. Hardening in place:
- `generateHtml` detects a stalled stream (no data for 60s — a dead connection, not genuinely slow output) and auto-retries once within the same request.
- Any failure that reaches the route's catch block (or a failed page save) now marks `briefs.status = 'error'`.
- `app/new/page.tsx` has its own client-side backstop — a 90s no-data stall timer plus an absolute ~5.5-minute ceiling — since a Vercel hard-kill can leave the connection silently dead with no error event ever arriving.
- **Per-generation cost cap**: `max_tokens` for each attempt is sized off a shared `MAX_GENERATION_COST_USD` (0.50) budget in `lib/anthropic.ts`, estimated from the actual prompt content rather than hardcoded — a stall-triggered retry gets whatever's left of that budget after subtracting the failed attempt's estimated spend, and skips the retry entirely once the remaining budget drops below `MIN_RETRY_BUDGET_USD` (0.05). This bounds total spend per user-initiated generation (including its one retry) independently of `maxDuration`.
- `STALL_TIMEOUT_MS` and `MOCK_STALL` (`'once'` / `'always'`) let the stall-guard/retry path be exercised locally under `MOCK_LLM=true` for free, through the real production code path — see `mockStreamWithStallSim` in `lib/anthropic.ts`.

The refine flow (`app/api/pages/[id]/refine/route.ts`, also `maxDuration = 300`) gets the same treatment: `refineHtml`'s full-regen fallback has the same stall-detect-and-retry and cost cap as `generateHtml`; `proposeEdits`' non-streaming call gets a capped request timeout (a timeout there is just treated as a normal failure, since the route already falls back to `refineHtml` on any edit-proposal error); and `app/pages/[id]/page.tsx`'s refine handler has the same 90s-stall/~5.5min-ceiling client-side backstop as `app/new/page.tsx`.

**Multi-round continuation** (`lib/anthropic.ts`, both API routes, both frontend pages): a generation that's genuinely still healthy — steadily streaming, not stalled — can still take longer than `maxDuration` to finish; Vercel's hard kill at that point gives zero chance to save anything. Rather than race that wall in a single request, `generateHtml`/`refineHtml` stop themselves a bit before a soft deadline (`SOFT_DEADLINE_MS = 250_000`, computed per-route from the request's own start time) and return `{ done: false, html, usage }` — the accumulated partial HTML and cumulative usage so far — instead of throwing. The API routes turn that into a `continue` SSE event (`{ briefId, partialHtml, usage, round }` for generate; `{ partialHtml, usage, round }` for refine, since the page id is already in the URL), and the frontend (`app/new/page.tsx`, `app/pages/[id]/page.tsx`) automatically issues a fresh request carrying that state as `continuation` in the body — each round gets its own full `maxDuration` budget, since Vercel's clock resets per invocation. `stop_reason` from the Anthropic response (`'end_turn'` vs `'max_tokens'`) is what actually decides `done`, not just whether the deadline was reached. Key pieces:
- `MAX_CONTINUATION_ROUNDS` (6) bounds how many times this can happen; hitting the cap without Claude ever signaling `end_turn` still saves whatever was generated (flagged as possibly incomplete) rather than discarding real, already-paid-for output.
- The per-generation `$0.50` cost budget spans the *entire* continuation chain — each round's `max_tokens` is sized off `MAX_GENERATION_COST_USD - <cumulative usage so far>`, so a multi-round generation doesn't multiply the cap by the number of rounds.
- `appendContinuation` trims a naive leading overlap when stitching a round's output onto the accumulated HTML, in case the model echoes back a bit of what it was just shown despite being told not to.
- `MOCK_CONTINUE_ROUNDS` (integer > 1) forces mock mode to split its canned HTML into that many rounds, exercising the real route + frontend continuation round-trip for free — see `mockRunGeneration` in `lib/anthropic.ts`.

Both routes' early-return paths (brief/page save failure, the `continue` event) must NOT call `writer.close()` themselves — the `finally` block already closes it unconditionally on every exit path (including `return`), so an extra explicit close throws `TypeError: Invalid state: WritableStream is closed`, which escapes as an unhandled rejection and crashes the whole function (`Node.js process exited with exit status: 128`). This existed latently before continuation (the rare error-only early-returns), but the `continue` path hits it on every multi-round generation, which is what surfaced it.

**`proposeEdits` truncation retry**: an instruction touching many scattered occurrences across a page (e.g. "remove every mention of X and Y") can need more edits than fit in a modest `max_tokens` budget. When the tool call gets cut off mid-JSON, it parses out to effectively zero usable edits — indistinguishable from Claude genuinely deciding no edit was needed unless `stop_reason` is checked. `proposeEdits` now retries once with a much larger budget (4096 → 16,000) specifically when `stop_reason === 'max_tokens'`, before falling through to the edit→fallback→full-regen path — since a bigger propose-edits call is still far cheaper than a full page regen. Usage across both attempts is summed for accurate cost reporting.

## Mock mode

`MOCK_LLM=true` short-circuits the LLM call — HTML streams `restaurants.html` from disk in 200-char chunks.

The complete end-to-end flow (brief → Supabase save → MCP → HTML → page detail view) runs with zero API cost.

## Figma plugin (`figma-plugin/`)

The plugin uses the **Figma Plugin API** (not REST — REST is read-only for design nodes). To run it: Figma → Plugins → Development → Import plugin from manifest → select `figma-plugin/manifest.json`.

`code.js` builds frames using primitive helpers (`mkRect`, `mkText`, `mkH`, `mkV`, `mkFrame`) then section builders then full page builders. Each page is 1440px wide; sections stack vertically with a running `y` offset.

HitPay brand tokens — source: Payment-Features Figma file, Orchid UI design system:

**Colors (RGB fractions):**
- `hpAction` `{r:0.141, g:0.396, b:0.871}` — #2465DE — CTA buttons, highlights
- `hpDeepBlue` `{r:0.000, g:0.153, b:0.443}` — #002771 — logo, footer, dark sections
- `hpTextPri` `{r:0.012, g:0.063, b:0.184}` — #03102F — primary body text
- `hpTextSec` `{r:0.380, g:0.400, b:0.486}` — #61667C — secondary/muted text
- `hpBeige` `{r:0.976, g:0.976, b:0.965}` — #F9F9F6 — hero + section backgrounds (not white)
- `hpBeige200` `{r:0.953, g:0.953, b:0.929}` — #F3F3ED — alternating feature section bg
- `hpBlue50` `{r:0.922, g:0.945, b:0.988}` — #EBF1FC — pill/chip backgrounds

**Fonts (Orchid design system):**
- `MD Nichrome Trial` — display/hero headings; style `Dark` (weight 500) for h1/h2, `Regular` (weight 400) for smaller headings
- `Hauora` — all body, UI, labels, nav, buttons; styles Regular/Medium/SemiBold/Bold
- `Inter` — fallback only (not the brand font)
- **Note:** These are not Google Fonts. For HTML pages use `Plus Jakarta Sans` (Hauora substitute) from Google Fonts.

## Static HTML pages

All pages use Tailwind CDN + `assets/brand.css` (local woff2 fonts: Hauora for body/UI, MD Nichrome Trial for headings). Each follows this section order: Navbar → Hero → Trust bar → Intro/Problem → USP 1–4 (alternating layout) → Stats bar → Testimonial → Feature Grid (3×2) → Related products → CTA → Footer.

Each page links fonts with:
```html
<link rel="preload" href="assets/fonts/Hauora-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/brand.css">
```

GEO rules enforced in `generator/GENERATOR-PROMPT.md` (must be followed for all generated pages):
- Stats bar always opens with `SGD/MYR/PHP 0 — Monthly fees`
- Payouts stat: "Next business day in SG, MY & PH" (not "T+1")
- Payment methods: "50+ payment methods" (not "700+" — that's wallets)
- Feature section intros: 80–120-word prose, not bullet leads
- FAQs in third person

## Web app architecture

- `app/page.tsx` — dashboard listing all generated + static pages (client component, fetches `/api/pages`); list-only, no embedded create form
- `app/new/page.tsx` — the "Create New Landing Page" flow: brief form + SSE stream consumer. Auto-navigates to `/pages/[id]` once generation finishes.
- `app/pages/[id]/page.tsx` — page detail: iframe preview, HTML source tab, refine-by-re-prompting with version history, editable SEO & URL fields
- `components/CreatePageForm/` — the brief form (free-text brief with HTML/TXT/MD file upload, optional industry/vertical, markets) used by `app/new/page.tsx`. Output filename is fully auto-derived (from vertical, or the brief's first line if vertical is blank) — never user-entered; `app/new/page.tsx` retries under a bumped filename (`-v2`, `-v3`, …) if the derived name collides with an existing page.
- `components/GenerationStream/` — renders the SSE log entries during generation
- `lib/supabase.ts` — `createServerClient()` (service role, for API routes) and `createBrowserClient()` (anon, for client components)
- `lib/anthropic.ts` — both LLM calls with prompt caching; exports `UsageStats` type; cost tracking per model
- `lib/mcp.ts` — three parallel MCP queries (general, brief-specific, changelog) merged into a single context string
- `lib/sse.ts` — shared SSE event parser used by both `app/new/page.tsx` and the refine flow in `app/pages/[id]/page.tsx`

UI components are from **shadcn/ui** (`components.json` at `web/components.json`). Add new components with `npx shadcn@latest add <component>` from the `web/` directory.
