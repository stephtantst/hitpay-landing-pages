import { NextRequest } from 'next/server'
import { getSystemPrompt, getResearchContext, refineHtml, proposeEdits, applyEdits, EditApplyError } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase'
import { extractMetaFromHtml } from '@/lib/seo'

export const maxDuration = 300

function validateInstruction(instruction: unknown): string | null {
  if (typeof instruction !== 'string' || !instruction.trim()) return 'instruction is required'
  if (instruction.trim().length < 3) return 'instruction is too short'
  if (instruction.length > 5_000) return 'instruction exceeds 5,000 character limit'
  return null
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json() as { instruction: string }

  const validationError = validateInstruction(body.instruction)
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const instruction = body.instruction.trim()

  const supabase = createServerClient()
  const { data: page, error: pageErr } = await supabase
    .from('generated_pages')
    .select('id, html, briefs(vertical, market)')
    .eq('id', id)
    .single()

  if (pageErr || !page) {
    return new Response(JSON.stringify({ error: 'Page not found' }), {
      status: 404,
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
      const briefInfo = page.briefs as unknown as { vertical?: string; market?: string[] } | null
      const vertical = briefInfo?.vertical ?? ''
      const markets = briefInfo?.market?.length ? briefInfo.market : ['SG', 'MY', 'PH']

      const systemPrompt = getSystemPrompt()
      const researchContext = getResearchContext(vertical)
      const previousHtml = page.html as string

      let html: string
      let usage: Awaited<ReturnType<typeof proposeEdits>>['usage']
      let editCount: number | null = null

      // Try the cheap path first: a handful of precise find-and-replace edits,
      // applied locally, instead of re-emitting the entire page as output.
      try {
        await send('status', { step: 'editing', message: 'Determining the minimal edit…' })
        const { edits, usage: editUsage } = await proposeEdits(
          systemPrompt, previousHtml, instruction, researchContext, markets
        )
        if (edits.length === 0) throw new EditApplyError('No edits proposed')
        await send('status', { step: 'applying', message: `Applying ${edits.length} edit${edits.length === 1 ? '' : 's'}…` })
        html = applyEdits(previousHtml, edits)
        usage = editUsage
        editCount = edits.length
      } catch (editErr) {
        // Fall back to a full regeneration if an edit couldn't be matched cleanly
        const reason = editErr instanceof Error ? editErr.message : String(editErr)
        console.warn('[Refine] edit-based path failed, falling back to full regeneration:', reason)
        await send('status', { step: 'refining', message: 'Falling back to full regeneration…' })
        const { html: refinedHtml, usage: regenUsage } = await refineHtml(
          systemPrompt,
          previousHtml,
          instruction,
          researchContext,
          markets,
          async (chunk) => {
            await send('chunk', { text: chunk })
          }
        )
        html = refinedHtml
        usage = regenUsage
      }

      await send('usage', {
        html: usage,
        totalCostUsd: usage.costUsd,
        cacheHit: usage.cacheRead > 0,
        editCount,
      })

      await send('status', { step: 'saving_page', message: 'Saving revision…' })

      // Snapshot the pre-refine state so this instruction can be undone later
      const { error: revisionErr } = await supabase.from('page_revisions').insert({
        page_id: id,
        html: previousHtml,
        instruction,
      })
      if (revisionErr) {
        await send('error', { message: 'Failed to save revision snapshot: ' + revisionErr.message })
        await writer.close()
        return
      }

      const { metaTitle, metaDescription } = extractMetaFromHtml(html)
      const { error: updateErr } = await supabase
        .from('generated_pages')
        .update({ html, meta_title: metaTitle, meta_description: metaDescription, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (updateErr) {
        await send('error', { message: 'Failed to save refined page: ' + updateErr.message })
        await writer.close()
        return
      }

      await send('done', { pageId: id })
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
