import { NextRequest } from 'next/server'
import { enrichBriefContext } from '@/lib/mcp'
import { generateHtml, getSystemPrompt, getResearchContext, MAX_CONTINUATION_ROUNDS, type ContinuationState } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase'
import { deriveUrlSlug, extractMetaFromHtml, buildFinalUrl } from '@/lib/seo'
import type { CreatePageFormData } from '@/components/CreatePageForm'

// 300s is the hard ceiling on this project's current Vercel plan (Hobby) — raising it
// (e.g. to 800s, the GA Fluid Compute ceiling) requires upgrading to Pro first; Vercel
// rejects the deploy outright otherwise ("maxDuration must be between 1 and 300 for
// plan hobby"). Output cost is bounded independently via generateHtml's per-generation
// budget cap, not by this duration limit.
export const maxDuration = 300

// A generation that's genuinely still healthy (steadily streaming, not stalled) can take
// longer than maxDuration to finish. Rather than race Vercel's hard kill — which leaves
// zero chance to save anything — generateHtml stops itself a bit before this soft
// deadline and hands back partial progress; this route turns that into a `continue`
// SSE event, and the frontend automatically issues a fresh request (its own full 300s
// budget) to resume. The margin below 300s covers the brief save, MCP enrichment, page
// save, and response finalization that also happen inside this same request.
const SOFT_DEADLINE_MS = 250_000

type ContinuationPayload = ContinuationState & { briefId: string }

const VALID_MARKETS = new Set(['SG', 'MY', 'PH'])
const FILENAME_RE = /^[a-z0-9][a-z0-9-]*\.html$/
// Sanity backstop only — not a real product limit. Sonnet's 200K-token context window
// comfortably fits a brief many times this size alongside the system prompt, research
// context, and MCP enrichment; this just guards against a truly pathological payload.
const BRIEF_SANITY_MAX = 500_000

function validateBrief(brief: CreatePageFormData): string | null {
  if (!brief.vertical?.trim()) return 'vertical is required'
  if (!Array.isArray(brief.markets) || brief.markets.length === 0) return 'at least one market is required'
  if (brief.markets.some((m) => !VALID_MARKETS.has(m))) return 'invalid market — must be SG, MY, or PH'
  if (!brief.outputFilename?.trim()) return 'outputFilename is required'
  if (!FILENAME_RE.test(brief.outputFilename)) return 'outputFilename must be lowercase letters, numbers, and hyphens ending in .html'
  if (!brief.rawBrief?.trim() || brief.rawBrief.trim().length < 100) return 'rawBrief must be at least 100 characters'
  if (brief.rawBrief.length > BRIEF_SANITY_MAX) return `rawBrief exceeds ${BRIEF_SANITY_MAX.toLocaleString()} character sanity limit`
  return null
}

export async function POST(req: NextRequest) {
  const requestStart = Date.now()
  const deadlineAt = requestStart + SOFT_DEADLINE_MS

  const body = await req.json() as { brief: CreatePageFormData; continuation?: ContinuationPayload }
  const { brief, continuation } = body

  // Server-side validation — reject before touching Supabase or Claude
  const validationError = validateBrief(brief)
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = createServerClient()

  // Duplicate filename check — prevent accidental overwrites. Only relevant on the first
  // round: a continuation resumes an in-progress generation whose page hasn't been
  // created yet (that only happens once generation is actually done), so there's nothing
  // new to collide with.
  if (!continuation) {
    const { data: existing } = await supabase
      .from('generated_pages')
      .select('id')
      .eq('filename', brief.outputFilename)
      .limit(1)

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({
        error: `A page named "${brief.outputFilename}" already exists. Rename it or delete the existing page first.`,
        existingId: existing[0].id,
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  const send = async (event: string, data: unknown) => {
    await writer.write(
      encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    )
  }


  // Hoisted so the catch block below can mark the brief as errored even if the
  // exception happens after the brief row was created (e.g. a stalled/failed
  // generation) — otherwise it's stuck showing "generating" forever with no signal.
  let briefId: string | null = null

  ;(async () => {
    try {
      // On a continuation round, reuse the brief row the first round already created —
      // otherwise every round would create a duplicate briefs row for the same generation.
      if (continuation) {
        briefId = continuation.briefId
      } else {
        await send('status', { step: 'saving', message: 'Saving brief…' })
        const { data: briefRow, error: briefErr } = await supabase
          .from('briefs')
          .insert({
            vertical: brief.vertical,
            market: brief.markets,
            brief: brief,
            status: 'generating',
          })
          .select()
          .single()

        if (briefErr || !briefRow) {
          await send('error', { message: 'Failed to save brief: ' + briefErr?.message })
          await writer.close()
          return
        }
        briefId = briefRow.id
      }

      // MCP enrichment — re-run each round; it's cheap, non-blocking on failure, and the
      // brief doesn't change between rounds, so recomputing is simpler than threading it
      // through the continuation payload.
      await send('status', { step: 'mcp', message: 'Querying HitPay knowledge base…' })
      const mcpContext = await enrichBriefContext(brief.vertical, brief.rawBrief)

      // HTML generation (streaming)
      await send('status', {
        step: 'generating',
        message: continuation ? `Continuing landing page HTML (round ${continuation.round + 1})…` : 'Generating landing page HTML…',
      })
      const systemPrompt = getSystemPrompt()
      const researchContext = getResearchContext(brief.vertical)

      let html = ''
      const result = await generateHtml(
        systemPrompt,
        brief.rawBrief,
        mcpContext,
        researchContext,
        brief.markets ?? ['SG', 'MY', 'PH'],
        async (chunk) => {
          html += chunk
          await send('chunk', { text: chunk })
        },
        () => { send('status', { step: 'generating', message: 'Stream stalled — retrying…' }) },
        continuation,
        deadlineAt
      )

      // Emit usage stats so the UI can display cost + cache info (cumulative across
      // every round so far).
      await send('usage', {
        html: result.usage,
        totalCostUsd: result.usage.costUsd,
        cacheHit: result.usage.cacheRead > 0,
      })

      const nextRound = (continuation?.round ?? 0) + 1
      if (!result.done && nextRound < MAX_CONTINUATION_ROUNDS) {
        // Not a failure — this request is out of its own time budget with more page left
        // to generate. Hand the partial state back so the frontend can resume in a fresh
        // request. briefs.status stays 'generating', which is still accurate.
        await send('continue', {
          briefId,
          partialHtml: result.html,
          usage: result.usage,
          round: nextRound,
        })
        await writer.close()
        return
      }

      if (!result.done) {
        // Hit the round cap without Claude ever signaling it was actually finished —
        // still save what was generated rather than discard real, already-paid-for
        // output, but flag it so it's not mistaken for a normal complete generation.
        await send('status', {
          step: 'saving_page',
          message: `Reached the ${MAX_CONTINUATION_ROUNDS}-round generation limit — saving the page as generated so far (may be incomplete).`,
        })
      }
      html = result.html

      // Save generated page
      await send('status', { step: 'saving_page', message: 'Saving generated page…' })
      const urlSlug = deriveUrlSlug(brief.outputFilename)
      const { metaTitle, metaDescription } = extractMetaFromHtml(html)
      const { data: pageRow, error: pageErr } = await supabase
        .from('generated_pages')
        .insert({
          brief_id: briefId,
          html,
          filename: brief.outputFilename,
          mcp_context: { raw: mcpContext, usage: { html: result.usage } },
          status: 'draft',
          url_slug: urlSlug,
          meta_title: metaTitle,
          meta_description: metaDescription,
          final_url: buildFinalUrl(urlSlug),
        })
        .select()
        .single()

      if (pageErr || !pageRow) {
        await supabase.from('briefs').update({ status: 'error' }).eq('id', briefId)
        await send('error', { message: 'Failed to save page: ' + pageErr?.message })
        await writer.close()
        return
      }

      // Update brief status
      await supabase.from('briefs').update({ status: 'done' }).eq('id', briefId)

      await send('done', { pageId: pageRow.id, filename: brief.outputFilename })
    } catch (err) {
      // Mark the brief as errored so it doesn't sit in "generating" forever with no
      // signal — that silent-stuck state (rather than the failure itself) was the
      // actual complaint: no error, no saved page, just an indefinite wait.
      if (briefId) {
        await supabase.from('briefs').update({ status: 'error' }).eq('id', briefId).then(
          () => {},
          () => {} // best-effort — don't let a status-update failure mask the real error
        )
      }
      await send('error', { message: String(err) })
    } finally {
      await writer.close()
    }
  })()

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
