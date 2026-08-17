import { NextRequest } from 'next/server'
import { getSystemPrompt, getResearchContext, refineHtml, proposeEdits, applyEdits, EditApplyError, MAX_CONTINUATION_ROUNDS, type ContinuationState, type UsageStats, type GenerationRoundResult } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase'
import { extractMetaFromHtml } from '@/lib/seo'

// Same reasoning as web/app/api/generate/route.ts — 300s is the hard ceiling on this
// project's current Vercel plan (Hobby); raising it requires upgrading to Pro first.
// Cost stays capped independently via refineHtml's budget.
export const maxDuration = 300

// Same reasoning as web/app/api/generate/route.ts's SOFT_DEADLINE_MS.
const SOFT_DEADLINE_MS = 250_000

type RefineOutcome =
  | { status: 'continue'; payload: ContinuationState }
  | { status: 'final'; html: string; usage: UsageStats['html']; editCount: number | null; incomplete: boolean }

function toOutcome(result: GenerationRoundResult, round: number, editCount: number | null = null): RefineOutcome {
  const nextRound = round + 1
  if (!result.done && nextRound < MAX_CONTINUATION_ROUNDS) {
    return { status: 'continue', payload: { partialHtml: result.html, usage: result.usage, round: nextRound } }
  }
  return { status: 'final', html: result.html, usage: result.usage, editCount, incomplete: !result.done }
}

function validateInstruction(instruction: unknown): string | null {
  if (typeof instruction !== 'string' || !instruction.trim()) return 'instruction is required'
  if (instruction.trim().length < 3) return 'instruction is too short'
  if (instruction.length > 5_000) return 'instruction exceeds 5,000 character limit'
  return null
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestStart = Date.now()
  const deadlineAt = requestStart + SOFT_DEADLINE_MS

  const { id } = await params
  const body = await req.json() as { instruction: string; continuation?: ContinuationState }
  const { continuation } = body

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
      const onChunk = async (chunk: string) => { await send('chunk', { text: chunk }) }
      const onStall = () => { send('status', { step: 'refining', message: 'Stream stalled — retrying…' }) }

      let outcome: RefineOutcome
      if (continuation) {
        // Already committed to the full-regen path in a prior round (that's the only
        // path continuation applies to) — resume it directly, skip proposeEdits entirely.
        await send('status', { step: 'refining', message: `Continuing revision (round ${continuation.round + 1})…` })
        const result = await refineHtml(
          systemPrompt, previousHtml, instruction, researchContext, markets,
          onChunk, onStall, continuation, deadlineAt
        )
        outcome = toOutcome(result, continuation.round)
      } else {
        // Try the cheap path first: a handful of precise find-and-replace edits,
        // applied locally, instead of re-emitting the entire page as output.
        try {
          await send('status', { step: 'editing', message: 'Determining the minimal edit…' })
          const { edits, usage: editUsage } = await proposeEdits(
            systemPrompt, previousHtml, instruction, researchContext, markets
          )
          if (edits.length === 0) throw new EditApplyError('No edits proposed')
          await send('status', { step: 'applying', message: `Applying ${edits.length} edit${edits.length === 1 ? '' : 's'}…` })
          const html = applyEdits(previousHtml, edits)
          outcome = { status: 'final', html, usage: editUsage, editCount: edits.length, incomplete: false }
        } catch (editErr) {
          // Fall back to a full regeneration if an edit couldn't be matched cleanly
          const reason = editErr instanceof Error ? editErr.message : String(editErr)
          console.warn('[Refine] edit-based path failed, falling back to full regeneration:', reason)
          await send('status', { step: 'refining', message: 'Falling back to full regeneration…' })
          const result = await refineHtml(
            systemPrompt, previousHtml, instruction, researchContext, markets,
            onChunk, onStall, undefined, deadlineAt
          )
          outcome = toOutcome(result, 0)
        }
      }

      if (outcome.status === 'continue') {
        // Not a failure — out of time budget with more revision left to generate. Hand
        // the partial state back so the frontend can resume in a fresh request.
        await send('continue', outcome.payload)
        await writer.close()
        return
      }

      const { html, usage, editCount, incomplete } = outcome
      await send('usage', {
        html: usage,
        totalCostUsd: usage.costUsd,
        cacheHit: usage.cacheRead > 0,
        editCount,
      })

      if (incomplete) {
        await send('status', {
          step: 'saving_page',
          message: `Reached the ${MAX_CONTINUATION_ROUNDS}-round generation limit — saving the revision as generated so far (may be incomplete).`,
        })
      }

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
