import { NextRequest } from 'next/server'
import { enrichBriefContext } from '@/lib/mcp'
import { generateHtml, generateFigmaJs, getSystemPrompt, getResearchContext } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase'
import type { BriefFormData } from '@/components/BriefForm'

export const maxDuration = 300

const VALID_MARKETS = new Set(['SG', 'MY', 'PH'])
const FILENAME_RE = /^[a-z0-9][a-z0-9-]*\.html$/

function validateBrief(brief: BriefFormData): string | null {
  if (!brief.vertical?.trim()) return 'vertical is required'
  if (!Array.isArray(brief.markets) || brief.markets.length === 0) return 'at least one market is required'
  if (brief.markets.some((m) => !VALID_MARKETS.has(m))) return 'invalid market — must be SG, MY, or PH'
  if (!brief.outputFilename?.trim()) return 'outputFilename is required'
  if (!FILENAME_RE.test(brief.outputFilename)) return 'outputFilename must be lowercase letters, numbers, and hyphens ending in .html'
  if (!brief.rawBrief?.trim() || brief.rawBrief.trim().length < 100) return 'rawBrief must be at least 100 characters'
  if (brief.rawBrief.length > 30_000) return 'rawBrief exceeds 30,000 character limit'
  return null
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { brief: BriefFormData }
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
        }
      )
      html = generatedHtml

      // Figma JS generation
      await send('status', { step: 'figma', message: 'Generating Figma frame code (Haiku)…' })
      const { js: figmaJs, usage: figmaUsage } = await generateFigmaJs(brief.rawBrief, html)

      // Emit usage stats so the UI can display cost + cache info
      const totalCostUsd = htmlUsage.costUsd + figmaUsage.costUsd
      await send('usage', {
        html: htmlUsage,
        figma: figmaUsage,
        totalCostUsd,
        cacheHit: htmlUsage.cacheRead > 0,
      })

      // Save generated page
      await send('status', { step: 'saving_page', message: 'Saving generated page…' })
      const { data: pageRow, error: pageErr } = await supabase
        .from('generated_pages')
        .insert({
          brief_id: briefRow.id,
          html,
          filename: brief.outputFilename,
          figma_plugin_js: figmaJs,
          mcp_context: { raw: mcpContext, usage: { html: htmlUsage, figma: figmaUsage } },
          status: 'ready',
        })
        .select()
        .single()

      if (pageErr || !pageRow) {
        await send('error', { message: 'Failed to save page: ' + pageErr?.message })
        await writer.close()
        return
      }

      // Update brief status
      await supabase.from('briefs').update({ status: 'done' }).eq('id', briefRow.id)

      await send('done', { pageId: pageRow.id, filename: brief.outputFilename })
    } catch (err) {
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
