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
- `generated_pages` — stores output (html, figma_plugin_js, filename, status)

RLS is enabled; API routes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). Browser client uses anon key (read-only for the dashboard).

## Generation pipeline (`web/`)

The core flow lives in `web/app/api/generate/route.ts` and runs as a server-sent events (SSE) stream:

1. **Save brief** → `briefs` table
2. **MCP enrichment** (`lib/mcp.ts`) → calls `https://hitpay-knowledge-mcp.vercel.app/api/mcp` (HitPay knowledge base, 30s timeout, non-blocking on failure)
3. **HTML generation** (`lib/anthropic.ts: generateHtml`) → Claude Sonnet streams HTML; system prompt and research context are prompt-cached
4. **Figma JS generation** (`lib/anthropic.ts: generateFigmaJs`) → Claude Haiku generates Figma Plugin API JavaScript
5. **Save generated page** → `generated_pages` table with html + figma_plugin_js
6. **Publish** (`POST /api/pages/[id]/publish`) → writes HTML file to repo root

SSE events emitted: `status`, `chunk`, `usage`, `done`, `error`. The frontend (`app/new/page.tsx`) buffers and parses these.

## Mock mode

`MOCK_LLM=true` short-circuits both LLM calls:
- HTML → streams `restaurants.html` from disk in 200-char chunks
- Figma JS → returns a hardcoded but fully functional Figma Plugin API script that creates a real frame (Nav → Hero → Trust Bar → Features → Stats → CTA → Footer)

The complete end-to-end flow (brief → Supabase save → MCP → HTML → Figma JS → page detail view) runs with zero API cost.

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

- `app/page.tsx` — dashboard listing all generated pages (client component, fetches `/api/pages`)
- `app/new/page.tsx` — brief form + SSE stream consumer
- `app/pages/[id]/page.tsx` — page detail: iframe preview, HTML source tab, Figma JS copy panel, publish button
- `components/BriefForm/` — controlled form; auto-derives filename from vertical name on blur
- `components/GenerationStream/` — renders the SSE log entries during generation
- `lib/supabase.ts` — `createServerClient()` (service role, for API routes) and `createBrowserClient()` (anon, for client components)
- `lib/anthropic.ts` — both LLM calls with prompt caching; exports `UsageStats` type; cost tracking per model
- `lib/mcp.ts` — three parallel MCP queries (general, brief-specific, changelog) merged into a single context string

UI components are from **shadcn/ui** (`components.json` at `web/components.json`). Add new components with `npx shadcn@latest add <component>` from the `web/` directory.
