import { NextRequest } from 'next/server'
import { enrichBriefContext } from '@/lib/mcp'
import { generateHtml, getSystemPrompt, getResearchContext } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase'
import { deriveUrlSlug, extractMetaFromHtml, buildFinalUrl } from '@/lib/seo'
import type { CreatePageFormData } from '@/components/CreatePageForm'

export const maxDuration = 300

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
  const body = await req.json() as { brief: CreatePageFormData }
  const { brief } = body

  // Server-side validation — reject before touching Supabase or Claude
  const validationError = validateBrief(brief)
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Duplicate filename check — prevent accidental overwrites
  const supabase = createServerClient()
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
      // Save brief
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

      // MCP enrichment
      await send('status', { step: 'mcp', message: 'Querying HitPay knowledge base…' })
      const mcpContext = await enrichBriefContext(brief.vertical, brief.rawBrief)

      // HTML generation (streaming)
      await send('status', { step: 'generating', message: 'Generating landing page HTML…' })
      const systemPrompt = getSystemPrompt()
      const researchContext = getResearchContext(brief.vertical)

      let html = ''
      const { html: generatedHtml, usage: htmlUsage } = await generateHtml(
        systemPrompt,
        brief.rawBrief,
        mcpContext,
        researchContext,
        brief.markets ?? ['SG', 'MY', 'PH'],
        async (chunk) => {
          html += chunk
          await send('chunk', { text: chunk })
        },
        () => { send('status', { step: 'generating', message: 'Stream stalled — retrying…' }) }
      )
      html = generatedHtml

      // Emit usage stats so the UI can display cost + cache info
      await send('usage', {
        html: htmlUsage,
        totalCostUsd: htmlUsage.costUsd,
        cacheHit: htmlUsage.cacheRead > 0,
      })

      // Save generated page
      await send('status', { step: 'saving_page', message: 'Saving generated page…' })
      const urlSlug = deriveUrlSlug(brief.outputFilename)
      const { metaTitle, metaDescription } = extractMetaFromHtml(html)
      const { data: pageRow, error: pageErr } = await supabase
        .from('generated_pages')
        .insert({
          brief_id: briefRow.id,
          html,
          filename: brief.outputFilename,
          mcp_context: { raw: mcpContext, usage: { html: htmlUsage } },
          status: 'draft',
          url_slug: urlSlug,
          meta_title: metaTitle,
          meta_description: metaDescription,
          final_url: buildFinalUrl(urlSlug),
        })
        .select()
        .single()

      if (pageErr || !pageRow) {
        await supabase.from('briefs').update({ status: 'error' }).eq('id', briefRow.id)
        await send('error', { message: 'Failed to save page: ' + pageErr?.message })
        await writer.close()
        return
      }

      // Update brief status
      await supabase.from('briefs').update({ status: 'done' }).eq('id', briefRow.id)

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
