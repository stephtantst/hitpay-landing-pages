import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const HTML_MODEL = 'claude-sonnet-4-6'

// Sonnet pricing (per million tokens)
const SONNET_INPUT_PRICE  = 3.00
const SONNET_OUTPUT_PRICE = 15.00
const SONNET_CACHE_WRITE  = 3.75   // +25% over input on cache write
const SONNET_CACHE_READ   = 0.30   // 90% cheaper on cache hit

export type UsageStats = {
  html: { input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number }
  totalCostUsd: number
  cacheHit: boolean
}

function calcCost(
  input: number, output: number, cacheRead: number, cacheWrite: number,
  prices: { input: number; output: number; cacheRead: number; cacheWrite: number }
) {
  return (
    (input     * prices.input   +
     output    * prices.output  +
     cacheRead * prices.cacheRead +
     cacheWrite * prices.cacheWrite) / 1_000_000
  )
}

// `web/` is deployed as a self-contained unit (no access to the parent repo at
// runtime), so these are read from committed copies under web/content/ — kept
// in sync with the repo-root originals by the predev/prebuild script in
// package.json. Falls back to the repo-root originals for local runs where
// that copy step hasn't happened yet.
function loadFile(filename: string, rootRelativePath: string): string {
  const contentPath = path.join(process.cwd(), 'content', filename)
  try { return fs.readFileSync(contentPath, 'utf-8') } catch { /* fall through */ }
  const rootPath = path.join(process.cwd(), '..', rootRelativePath)
  try { return fs.readFileSync(rootPath, 'utf-8') } catch { return '' }
}

// Memoize at module level — only read from disk once per process lifetime
let _systemPrompt: string | null = null
export function getSystemPrompt(): string {
  if (!_systemPrompt) _systemPrompt = loadFile('GENERATOR-PROMPT.md', 'generator/GENERATOR-PROMPT.md')
  return _systemPrompt!
}

export function getResearchContext(vertical: string): string {
  const research = loadFile('RESEARCH.md', 'RESEARCH.md')
  if (!research) return ''
  const lines = research.split('\n')
  const relevantLines: string[] = []
  let inRelevantSection = false
  const verticalLower = vertical.toLowerCase()
  for (const line of lines) {
    if (line.startsWith('##') && line.toLowerCase().includes(verticalLower)) {
      inRelevantSection = true
    } else if (line.startsWith('## ') && inRelevantSection) {
      inRelevantSection = false
    }
    if (inRelevantSection) relevantLines.push(line)
  }
  return relevantLines.length > 0
    ? relevantLines.join('\n').slice(0, 3000)
    : research.slice(0, 2000)
}

// A generation stream that goes silent for this long is almost certainly a dead
// connection, not genuinely slow output — Claude streams continuously once it starts.
// Left unguarded, a stalled stream silently eats the whole request budget (a Vercel
// function timeout kills the process outright with nothing saved) instead of failing
// fast enough to retry within it.
// Overridable via env so stall/retry behavior can be exercised locally in seconds
// instead of waiting out the real 60s (see MOCK_STALL below) — never set this in prod.
const STALL_TIMEOUT_MS = Number(process.env.STALL_TIMEOUT_MS) || 60_000

// partialChars carries however much output had already streamed before the stall, so a
// retry can be sized against what's actually left of the per-generation cost budget
// instead of getting a full fresh budget on top of what the failed attempt already spent.
class StreamStallError extends Error {
  partialChars: number
  constructor(message: string, partialChars: number = 0) {
    super(message)
    this.partialChars = partialChars
  }
}

// Thrown when a request's own soft time budget (see SOFT_DEADLINE_MS in the API routes)
// runs out before Claude finished — NOT a failure. Vercel's maxDuration hard-kills the
// whole function with zero chance to save partial output, so instead of racing that wall,
// generation deliberately stops a bit early and hands back whatever streamed so far; the
// caller turns this into a "continue in a fresh request" round instead of an error.
class StreamDeadlineError extends Error {
  html: string
  constructor(html: string) {
    super('Soft deadline reached before generation finished')
    this.html = html
  }
}

// Consumes an Anthropic message stream chunk-by-chunk. Throws StreamStallError if no
// event arrives within STALL_TIMEOUT_MS (a dead connection), or StreamDeadlineError once
// deadlineAt passes (this request is running out of its own time budget, independent of
// whether the stream is healthy) — whichever comes first. Either way stream.abort() is
// called so the abandoned request actually stops (and stops being billed for output
// we'll never see) instead of continuing to run on Anthropic's side after we've moved on.
async function consumeStreamWithGuards(
  stream: AsyncIterable<Anthropic.MessageStreamEvent> & { abort: () => void },
  onChunk: (chunk: string) => void,
  deadlineAt: number
): Promise<string> {
  let fullHtml = ''
  const iterator = stream[Symbol.asyncIterator]()
  while (true) {
    const msUntilDeadline = deadlineAt - Date.now()
    if (msUntilDeadline <= 0) {
      stream.abort()
      throw new StreamDeadlineError(fullHtml)
    }
    let timer!: ReturnType<typeof setTimeout>
    const raceMs = Math.min(STALL_TIMEOUT_MS, msUntilDeadline)
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        stream.abort()
        if (Date.now() >= deadlineAt) {
          reject(new StreamDeadlineError(fullHtml))
        } else {
          reject(new StreamStallError('Stream stalled — no data received for 60s', fullHtml.length))
        }
      }, raceMs)
    })
    let result: IteratorResult<Anthropic.MessageStreamEvent>
    try {
      result = await Promise.race([iterator.next(), timeout])
    } finally {
      clearTimeout(timer)
    }
    if (result.done) break
    const chunk = result.value
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullHtml += chunk.delta.text
      onChunk(chunk.delta.text)
    }
  }
  return fullHtml
}

// ─── Per-generation cost cap ────────────────────────────────────────────────
// max_tokens alone bounds a single attempt's worst-case output cost, but a stall-then-
// retry runs a second full attempt on top of whatever the first one already spent —
// so a bounded max_tokens per attempt doesn't bound the *generation's* total cost.
// This sizes each attempt's max_tokens off a shared dollar budget instead: the first
// attempt gets (budget - its estimated input cost); a retry after a stall gets the
// remainder after subtracting what the failed attempt is estimated to have already cost.
const MAX_GENERATION_COST_USD = 0.50
const MIN_OUTPUT_TOKENS = 1_000    // floor — a near-exhausted retry budget still needs a valid max_tokens
const MAX_OUTPUT_TOKENS = 32_000   // existing ceiling — the budget only ever lowers this, never raises it
const MIN_RETRY_BUDGET_USD = 0.05  // below this, a retry isn't worth the spend — fail fast instead

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Worst-case (cache-write-rate) estimate of an attempt's input cost from its actual
// prompt content, used only to size that attempt's output budget — not for billing.
function estimateInputCostUsd(systemPrompt: string, userContent: Anthropic.MessageParam['content']): number {
  const userText = typeof userContent === 'string'
    ? userContent
    : userContent.map((block) => ('text' in block ? block.text : '')).join('')
  const tokens = estimateTokens(systemPrompt) + estimateTokens(userText)
  return (tokens * SONNET_CACHE_WRITE) / 1_000_000
}

function maxTokensForBudget(remainingUsd: number): number {
  const tokens = Math.floor(Math.max(remainingUsd, 0) / (SONNET_OUTPUT_PRICE / 1_000_000))
  return Math.max(MIN_OUTPUT_TOKENS, Math.min(tokens, MAX_OUTPUT_TOKENS))
}

// ─── Multi-round continuation ───────────────────────────────────────────────
// A generation that's genuinely still healthy (steadily streaming, not stalled) can take
// longer than a single request's maxDuration to finish — Vercel hard-kills the function
// at that point with zero chance to save anything. Rather than lose the whole attempt,
// generateHtml/refineHtml stop themselves a bit early (see StreamDeadlineError) and hand
// back partial HTML for the caller (the API route + frontend) to resume in a fresh
// request, which gets its own full time budget. MAX_CONTINUATION_ROUNDS bounds how many
// times that can happen so a pathological case can't loop forever.
export const MAX_CONTINUATION_ROUNDS = 6

export type ContinuationState = {
  partialHtml: string
  usage: UsageStats['html'] // cumulative usage across every round so far
  round: number
}

const ZERO_USAGE: UsageStats['html'] = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, costUsd: 0 }

export type GenerationRoundResult = {
  done: boolean              // true once Claude actually finished (stop_reason: end_turn) — false means call again with `html`/`usage` as the next continuation
  html: string                // HTML accumulated so far across all rounds
  usage: UsageStats['html']   // cumulative usage across all rounds, for budget tracking and billing display
}

function addUsage(a: UsageStats['html'], b: UsageStats['html']): UsageStats['html'] {
  return {
    input: a.input + b.input,
    output: a.output + b.output,
    cacheRead: a.cacheRead + b.cacheRead,
    cacheWrite: a.cacheWrite + b.cacheWrite,
    costUsd: a.costUsd + b.costUsd,
  }
}

// Appends a continuation round's output onto the HTML accumulated so far, trimming a
// naive leading overlap in case the model echoes back a few words of what it was just
// shown before continuing — a "pick up exactly where this left off" prompt occasionally
// does this despite being told not to.
function appendContinuation(partial: string, next: string): string {
  const maxOverlap = Math.min(200, partial.length, next.length)
  for (let k = maxOverlap; k >= 20; k--) {
    if (partial.slice(-k) === next.slice(0, k)) return partial + next.slice(k)
  }
  return partial + next
}

// Simulates a real Anthropic stream (same async-iterable + abort() shape consumeStreamWithGuards
// expects) so MOCK_LLM mode can exercise the actual stall-guard/retry code path for free instead of
// spending real API cost to test it. Controlled by MOCK_STALL:
//   unset        → normal fast mock, no stall (existing behavior)
//   'once'       → this attempt hangs past STALL_TIMEOUT_MS, then the caller's retry goes through clean
//   'always'     → every attempt hangs — exercises the double-stall → surfaced-error path
function createMockStream(fullText: string, opts: { stall: boolean; chunkSize?: number; chunkDelayMs?: number }) {
  const { stall, chunkSize = 200, chunkDelayMs = 5 } = opts
  let aborted = false
  async function* generate(): AsyncGenerator<Anthropic.MessageStreamEvent> {
    if (stall) {
      // Hang well past STALL_TIMEOUT_MS so consumeStreamWithStallGuard's race always loses,
      // but stop early if aborted so this doesn't leak a dangling timer/generator.
      const hangMs = STALL_TIMEOUT_MS + 5_000
      const start = Date.now()
      while (Date.now() - start < hangMs) {
        if (aborted) return
        await new Promise((r) => setTimeout(r, 200))
      }
    }
    for (let i = 0; i < fullText.length; i += chunkSize) {
      if (aborted) return
      yield { type: 'content_block_delta', delta: { type: 'text_delta', text: fullText.slice(i, i + chunkSize) } } as Anthropic.MessageStreamEvent
      await new Promise((r) => setTimeout(r, chunkDelayMs))
    }
  }
  const iterable = generate()
  return {
    [Symbol.asyncIterator]: () => iterable,
    abort: () => { aborted = true },
  }
}

// Shared by generateHtml/refineHtml's mock branches — mirrors the real round structure
// (stall retry within a round via StreamStallError/onStall, continuation across rounds
// via `done`/round/partialHtml) so mock mode exercises the same code paths as production
// instead of a parallel simulation. Controlled by:
//   MOCK_STALL ('once' | 'always')     — this/every round's first attempt hangs past STALL_TIMEOUT_MS
//   MOCK_CONTINUE_ROUNDS (integer > 1) — splits fullText into this many rounds, forcing a
//                                        real continuation round-trip through the API route + frontend
async function mockRunGeneration(
  fullText: string,
  continuation: ContinuationState | undefined,
  onChunk: (chunk: string) => void,
  onStall?: () => void
): Promise<GenerationRoundResult> {
  const partialHtml = continuation?.partialHtml ?? ''
  const priorUsage = continuation?.usage ?? ZERO_USAGE
  const round = continuation?.round ?? 0

  const totalRounds = Math.max(1, Number(process.env.MOCK_CONTINUE_ROUNDS) || 1)
  const chunkSize = Math.ceil(fullText.length / totalRounds)
  const roundText = fullText.slice(round * chunkSize, (round + 1) * chunkSize)
  const isLastRound = (round + 1) * chunkSize >= fullText.length

  const stallMode = process.env.MOCK_STALL
  let attemptNum = 0
  const attempt = async () => {
    attemptNum++
    const shouldStall = stallMode === 'always' || (stallMode === 'once' && attemptNum === 1)
    const stream = createMockStream(roundText, { stall: shouldStall })
    return consumeStreamWithGuards(stream, onChunk, Date.now() + 999_999_999) // no real deadline to simulate in mock mode
  }

  let roundHtml: string
  try {
    roundHtml = await attempt()
  } catch (err) {
    if (!(err instanceof StreamStallError)) throw err
    onStall?.()
    roundHtml = await attempt()
  }

  return {
    done: isLastRound,
    html: appendContinuation(partialHtml, roundHtml),
    usage: addUsage(priorUsage, ZERO_USAGE),
  }
}

export async function generateHtml(
  systemPrompt: string,
  brief: string,
  mcpContext: string,
  researchContext: string,
  markets: string[],
  onChunk: (chunk: string) => void,
  onStall?: () => void,
  continuation?: ContinuationState,
  deadlineAt?: number
): Promise<GenerationRoundResult> {
  const partialHtml = continuation?.partialHtml ?? ''
  const priorUsage = continuation?.usage ?? ZERO_USAGE
  const effectiveDeadline = deadlineAt ?? Date.now() + 260_000

  // Mock mode: skip API call, stream an existing page file
  if (process.env.MOCK_LLM === 'true') {
    const mockHtml = loadFile('restaurants.html', 'restaurants.html') || '<html><body><h1>Mock page</h1></body></html>'
    return mockRunGeneration(mockHtml, continuation, onChunk, onStall)
  }

  // Build a market directive when fewer than 3 markets are selected
  const allMarkets = ['SG', 'MY', 'PH']
  const missingMarkets = allMarkets.filter(m => !markets.includes(m))
  const marketDirective = missingMarkets.length > 0
    ? `\n\n## MARKET OVERRIDE (takes precedence over all GEO rules)\nGenerate ONLY for: ${markets.join(', ')}.\n` +
      `Do NOT mention these markets anywhere: ${missingMarkets.join(', ')}.\n` +
      `- Payment methods, stats, FAQ, CTAs: only cover ${markets.join(' and ')}\n` +
      `- Replace "SGD/MYR/PHP 0" with "${markets.map(m => ({ SG: 'SGD', MY: 'MYR', PH: 'PHP' }[m])).join('/')} 0"\n` +
      `- Replace "SG, MY & PH" with "${markets.join(' & ')}"\n` +
      `- Entity paragraph: only name cities/landmarks in ${markets.join(' and ')}`
    : ''

  // A continuation round replaces the "generate now" instruction with a "finish what's
  // already there" one — the partial HTML from prior rounds is shown so Claude picks up
  // exactly where it left off instead of restarting the document.
  const continuationBlock = partialHtml
    ? '\n\n## Continuation Notice\nA time limit cut generation off before the page was complete — NOT because it was finished. ' +
      'Everything inside PARTIAL_HTML below has ALREADY been generated and streamed to the user; do not repeat, restate, or ' +
      'rewrite any of it.\n\n<PARTIAL_HTML>\n' + partialHtml + '\n</PARTIAL_HTML>\n\n' +
      'Your entire response will be appended DIRECTLY after PARTIAL_HTML with no separator — output nothing but the ' +
      'continuation (no markdown fences, no commentary, no repeated headers). If PARTIAL_HTML ends mid-tag, mid-attribute, ' +
      'or mid-word, complete it naturally as your very first characters, then continue writing the remaining sections ' +
      'through to a complete, valid closing </html>.'
    : ''

  // Dynamic part only — brief + MCP context. Research + system prompt are cached.
  const dynamicContent = [
    '## HitPay Knowledge Base\n',
    mcpContext || '(MCP unavailable — use system prompt knowledge)',
    '\n\n## Brief and Context\n',
    brief,
    marketDirective,
    continuationBlock,
    partialHtml ? '' : '\n\nGenerate the complete HTML landing page now. Output ONLY the HTML — no markdown fences, no explanation.',
  ].join('')

  // Structure for caching:
  //   system[0]   → system prompt       (static, CACHED — biggest block)
  //   user[0]     → research context    (static per vertical, CACHED)
  //   user[1]     → MCP + brief         (dynamic, NOT cached)
  const userContent: Anthropic.MessageParam['content'] = researchContext
    ? [
        {
          type: 'text' as const,
          text: `## Research Context\n${researchContext}`,
          cache_control: { type: 'ephemeral' as const },
        },
        { type: 'text' as const, text: dynamicContent },
      ]
    : dynamicContent

  const attempt = async (maxTokens: number, deadline: number) => {
    const stream = anthropic.messages.stream({
      model: HTML_MODEL,
      max_tokens: maxTokens,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }, // Cache the large static system prompt
        },
      ],
      messages: [{ role: 'user', content: userContent }],
    })

    const roundHtml = await consumeStreamWithGuards(stream, onChunk, deadline)

    const final = await stream.finalMessage()
    const u = final.usage as unknown as Record<string, number>
    const cacheRead  = u.cache_read_input_tokens       ?? 0
    const cacheWrite = u.cache_creation_input_tokens   ?? 0
    const input      = u.input_tokens                  ?? 0
    const output     = u.output_tokens                 ?? 0

    const usage = {
      input, output, cacheRead, cacheWrite,
      costUsd: calcCost(input, output, cacheRead, cacheWrite, {
        input: SONNET_INPUT_PRICE, output: SONNET_OUTPUT_PRICE,
        cacheRead: SONNET_CACHE_READ, cacheWrite: SONNET_CACHE_WRITE,
      }),
    }

    console.log('[HTML]', usage, 'stop_reason:', final.stop_reason)
    return { roundHtml, usage, stopReason: final.stop_reason }
  }

  const inputCostEst = estimateInputCostUsd(systemPrompt, userContent)
  const remainingBudget = MAX_GENERATION_COST_USD - priorUsage.costUsd

  const finalizeSuccess = (result: { roundHtml: string; usage: UsageStats['html']; stopReason: string | null }): GenerationRoundResult => ({
    done: result.stopReason === 'end_turn',
    html: appendContinuation(partialHtml, result.roundHtml),
    usage: addUsage(priorUsage, result.usage),
  })

  // Not a failure — this request simply ran out of its own time budget. Estimate what
  // this cut-off round cost (we never get real usage back for an aborted stream) so the
  // next round's budget stays honest, and hand back the partial HTML for the caller to
  // resume in a fresh request.
  const finalizeDeadline = (err: StreamDeadlineError): GenerationRoundResult => {
    const estimatedUsage: UsageStats['html'] = {
      input: 0, output: estimateTokens(err.html), cacheRead: 0, cacheWrite: 0,
      costUsd: inputCostEst + (estimateTokens(err.html) * SONNET_OUTPUT_PRICE) / 1_000_000,
    }
    return {
      done: false,
      html: appendContinuation(partialHtml, err.html),
      usage: addUsage(priorUsage, estimatedUsage),
    }
  }

  // A stalled stream almost always means a dead connection to the API, not genuinely
  // slow output — one automatic retry catches that within this round's time budget
  // instead of silently burning the whole thing on a single hung attempt. Any other
  // error (or a second stall) propagates immediately; we only retry this one failure mode.
  // A deadline hit on either the first attempt OR the retry is handled the same way —
  // it's not an error, just "out of time for this request" — so both are caught here.
  try {
    return finalizeSuccess(await attempt(maxTokensForBudget(remainingBudget - inputCostEst), effectiveDeadline))
  } catch (err) {
    if (err instanceof StreamDeadlineError) return finalizeDeadline(err)
    if (!(err instanceof StreamStallError)) throw err

    // The failed attempt already spent (at least) its own input cost plus whatever
    // output it streamed before stalling — size the retry off what's actually left of
    // the per-generation budget instead of giving it a full budget on top of that.
    const spentOnFailedAttempt = inputCostEst + (Math.ceil(err.partialChars / 4) * SONNET_OUTPUT_PRICE) / 1_000_000
    const remaining = remainingBudget - spentOnFailedAttempt - inputCostEst

    if (remaining < MIN_RETRY_BUDGET_USD || Date.now() >= effectiveDeadline) {
      console.warn('[HTML] stream stalled and no room to retry (budget or time):', err.message)
      throw err
    }

    console.warn('[HTML] stream stalled, retrying once:', err.message)
    onStall?.()
    try {
      return finalizeSuccess(await attempt(maxTokensForBudget(remaining), effectiveDeadline))
    } catch (retryErr) {
      if (retryErr instanceof StreamDeadlineError) return finalizeDeadline(retryErr)
      throw retryErr
    }
  }
}

export async function refineHtml(
  systemPrompt: string,
  currentHtml: string,
  instruction: string,
  researchContext: string,
  markets: string[],
  onChunk: (chunk: string) => void,
  onStall?: () => void,
  continuation?: ContinuationState,
  deadlineAt?: number
): Promise<GenerationRoundResult> {
  const partialHtml = continuation?.partialHtml ?? ''
  const priorUsage = continuation?.usage ?? ZERO_USAGE
  const effectiveDeadline = deadlineAt ?? Date.now() + 260_000

  // Mock mode: skip API call, tag the existing HTML so the UI has something to show
  if (process.env.MOCK_LLM === 'true') {
    const marker = `<!-- Refined: ${instruction.slice(0, 80).replace(/-->/g, '')} -->`
    const mockHtml = currentHtml.includes('</head>')
      ? currentHtml.replace('</head>', `${marker}\n</head>`)
      : `${marker}\n${currentHtml}`
    return mockRunGeneration(mockHtml, continuation, onChunk, onStall)
  }

  // Same market-override directive as generateHtml, reworded as a reminder for a revision pass
  const allMarkets = ['SG', 'MY', 'PH']
  const missingMarkets = allMarkets.filter(m => !markets.includes(m))
  const marketDirective = missingMarkets.length > 0
    ? `\n\nMarket constraint still applies: this page covers ONLY ${markets.join(', ')} — never introduce or leave in mentions of ${missingMarkets.join(', ')}.`
    : ''

  // A continuation round replaces the "output the complete page" instruction with a
  // "finish the revised page you were writing" one. partialHtml here is the NEW revised
  // output generated so far in THIS refine — distinct from currentHtml, the original
  // page being revised, which stays in context throughout for reference.
  const continuationBlock = partialHtml
    ? '\n\n## Continuation Notice\nA time limit cut off the REVISED page below before it was complete — NOT because it was ' +
      'finished. Everything inside PARTIAL_REVISED_HTML has ALREADY been generated and streamed to the user; do not repeat, ' +
      'restate, or rewrite any of it.\n\n<PARTIAL_REVISED_HTML>\n' + partialHtml + '\n</PARTIAL_REVISED_HTML>\n\n' +
      'Your entire response will be appended DIRECTLY after PARTIAL_REVISED_HTML with no separator — output nothing but the ' +
      'continuation (no markdown fences, no commentary, no repeated headers). If PARTIAL_REVISED_HTML ends mid-tag, ' +
      'mid-attribute, or mid-word, complete it naturally as your very first characters, then continue writing the ' +
      'remaining sections through to a complete, valid closing </html>.'
    : ''

  const dynamicContent = [
    '## Current Page HTML (revise this in place — do not start over)\n',
    currentHtml,
    '\n\n## Refinement Instructions\n',
    instruction,
    marketDirective,
    continuationBlock,
    partialHtml ? '' : '\n\nApply the refinement instructions to the HTML above and output the COMPLETE revised HTML page. ' +
    'Preserve everything the instructions did not ask you to change — same structure, copy, and styling elsewhere. ' +
    'Output ONLY the HTML — no markdown fences, no explanation.',
  ].join('')

  // Structure for caching:
  //   system[0]   → system prompt       (static, CACHED — shared with generateHtml)
  //   user[0]     → research context    (static per vertical, CACHED)
  //   user[1]     → current HTML + instruction (dynamic, NOT cached)
  const userContent: Anthropic.MessageParam['content'] = researchContext
    ? [
        {
          type: 'text' as const,
          text: `## Research Context\n${researchContext}`,
          cache_control: { type: 'ephemeral' as const },
        },
        { type: 'text' as const, text: dynamicContent },
      ]
    : dynamicContent

  const attempt = async (maxTokens: number, deadline: number) => {
    const stream = anthropic.messages.stream({
      model: HTML_MODEL,
      max_tokens: maxTokens,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userContent }],
    })

    const roundHtml = await consumeStreamWithGuards(stream, onChunk, deadline)

    const final = await stream.finalMessage()
    const u = final.usage as unknown as Record<string, number>
    const cacheRead  = u.cache_read_input_tokens       ?? 0
    const cacheWrite = u.cache_creation_input_tokens   ?? 0
    const input      = u.input_tokens                  ?? 0
    const output     = u.output_tokens                 ?? 0

    const usage = {
      input, output, cacheRead, cacheWrite,
      costUsd: calcCost(input, output, cacheRead, cacheWrite, {
        input: SONNET_INPUT_PRICE, output: SONNET_OUTPUT_PRICE,
        cacheRead: SONNET_CACHE_READ, cacheWrite: SONNET_CACHE_WRITE,
      }),
    }

    console.log('[Refine]', usage, 'stop_reason:', final.stop_reason)
    return { roundHtml, usage, stopReason: final.stop_reason }
  }

  const inputCostEst = estimateInputCostUsd(systemPrompt, userContent)
  const remainingBudget = MAX_GENERATION_COST_USD - priorUsage.costUsd

  const finalizeSuccess = (result: { roundHtml: string; usage: UsageStats['html']; stopReason: string | null }): GenerationRoundResult => ({
    done: result.stopReason === 'end_turn',
    html: appendContinuation(partialHtml, result.roundHtml),
    usage: addUsage(priorUsage, result.usage),
  })

  const finalizeDeadline = (err: StreamDeadlineError): GenerationRoundResult => {
    const estimatedUsage: UsageStats['html'] = {
      input: 0, output: estimateTokens(err.html), cacheRead: 0, cacheWrite: 0,
      costUsd: inputCostEst + (estimateTokens(err.html) * SONNET_OUTPUT_PRICE) / 1_000_000,
    }
    return {
      done: false,
      html: appendContinuation(partialHtml, err.html),
      usage: addUsage(priorUsage, estimatedUsage),
    }
  }

  // Same stall/retry/deadline/cost-cap treatment as generateHtml — refine regenerates
  // the whole page over the same kind of long-lived stream and is exposed to the same
  // dead-connection and out-of-time failure modes.
  try {
    return finalizeSuccess(await attempt(maxTokensForBudget(remainingBudget - inputCostEst), effectiveDeadline))
  } catch (err) {
    if (err instanceof StreamDeadlineError) return finalizeDeadline(err)
    if (!(err instanceof StreamStallError)) throw err

    const spentOnFailedAttempt = inputCostEst + (Math.ceil(err.partialChars / 4) * SONNET_OUTPUT_PRICE) / 1_000_000
    const remaining = remainingBudget - spentOnFailedAttempt - inputCostEst

    if (remaining < MIN_RETRY_BUDGET_USD || Date.now() >= effectiveDeadline) {
      console.warn('[Refine] stream stalled and no room to retry (budget or time):', err.message)
      throw err
    }

    console.warn('[Refine] stream stalled, retrying once:', err.message)
    onStall?.()
    try {
      return finalizeSuccess(await attempt(maxTokensForBudget(remaining), effectiveDeadline))
    } catch (retryErr) {
      if (retryErr instanceof StreamDeadlineError) return finalizeDeadline(retryErr)
      throw retryErr
    }
  }
}

// ─── Edit-based refine ──────────────────────────────────────────────────────
// Refining by regenerating the whole page (refineHtml above) re-emits every
// output token of the page even for a one-word change — output tokens are the
// dominant cost of a generation. This proposes a small set of precise
// find-and-replace edits instead (the same model Claude Code's own Edit tool
// uses), applied locally with no further API cost. refineHtml is kept as an
// automatic fallback for when an edit can't be matched cleanly.

export type ProposedEdit = { old_string: string; new_string: string }

export class EditApplyError extends Error {}

// Mirrors Claude Code's Edit tool semantics: old_string must match exactly once.
export function applyEdits(html: string, edits: ProposedEdit[]): string {
  let result = html
  edits.forEach((edit, i) => {
    if (edit.old_string === edit.new_string) return
    const occurrences = result.split(edit.old_string).length - 1
    if (occurrences === 0) {
      throw new EditApplyError(`Edit ${i + 1}: old_string not found verbatim in the page.`)
    }
    if (occurrences > 1) {
      throw new EditApplyError(`Edit ${i + 1}: old_string matches ${occurrences} places — not unique.`)
    }
    result = result.replace(edit.old_string, edit.new_string)
  })
  return result
}

const PROPOSE_EDITS_TOOL: Anthropic.Tool = {
  name: 'propose_edits',
  description: 'Propose the minimal set of precise find-and-replace edits to the current HTML that satisfy the refinement instruction. Prefer as few, as small edits as possible.',
  input_schema: {
    type: 'object',
    properties: {
      edits: {
        type: 'array',
        description: 'Ordered list of edits. Keep this as small as possible — only touch what the instruction asks for.',
        items: {
          type: 'object',
          properties: {
            old_string: {
              type: 'string',
              description: 'Exact, verbatim substring of the current HTML to find, including exact whitespace. Must occur exactly once in the whole document — include a few surrounding words for uniqueness if the text alone would repeat elsewhere.',
            },
            new_string: {
              type: 'string',
              description: 'The replacement text for old_string.',
            },
          },
          required: ['old_string', 'new_string'],
        },
      },
    },
    required: ['edits'],
  },
}

export async function proposeEdits(
  systemPrompt: string,
  currentHtml: string,
  instruction: string,
  researchContext: string,
  markets: string[]
): Promise<{ edits: ProposedEdit[]; usage: UsageStats['html'] }> {
  // Mock mode: propose a trivial, always-matchable edit so the apply path is exercised locally.
  // When MOCK_STALL is set, propose nothing instead — the refine route already treats "no edits
  // proposed" as a signal to fall back to refineHtml, which is where the actual stall simulation
  // lives (see mockStreamWithStallSim) — so this exercises the real edit→fallback→stall path.
  if (process.env.MOCK_LLM === 'true') {
    const marker = `<!-- Refined: ${instruction.slice(0, 80).replace(/-->/g, '')} -->`
    return {
      edits: currentHtml.includes('</head>') && !process.env.MOCK_STALL
        ? [{ old_string: '</head>', new_string: `${marker}\n</head>` }]
        : [],
      usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, costUsd: 0 },
    }
  }

  const allMarkets = ['SG', 'MY', 'PH']
  const missingMarkets = allMarkets.filter(m => !markets.includes(m))
  const marketDirective = missingMarkets.length > 0
    ? `\n\nMarket constraint still applies: this page covers ONLY ${markets.join(', ')} — never introduce or leave in mentions of ${missingMarkets.join(', ')}.`
    : ''

  const dynamicContent = [
    '## Current Page HTML\n',
    currentHtml,
    '\n\n## Refinement Instructions\n',
    instruction,
    marketDirective,
    '\n\nCall propose_edits with the smallest set of find-and-replace edits that satisfies the instructions above. ' +
    'Do not touch anything the instructions did not ask you to change. Each old_string must be copied VERBATIM ' +
    'from the current HTML, including exact whitespace, and must occur exactly once in the document.',
  ].join('')

  const userContent: Anthropic.MessageParam['content'] = researchContext
    ? [
        {
          type: 'text' as const,
          text: `## Research Context\n${researchContext}`,
          cache_control: { type: 'ephemeral' as const },
        },
        { type: 'text' as const, text: dynamicContent },
      ]
    : dynamicContent

  // Non-streaming call — a dead connection here would otherwise hang for the SDK's
  // full default timeout with nothing surfaced. A capped request timeout throws
  // promptly instead, and the caller (the refine route) already treats any
  // proposeEdits failure as a signal to fall back to the full-regeneration path.
  const attempt = async (maxTokens: number) => {
    const msg = await anthropic.messages.create({
      model: HTML_MODEL,
      max_tokens: maxTokens,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools: [PROPOSE_EDITS_TOOL],
      tool_choice: { type: 'tool', name: 'propose_edits' },
      messages: [{ role: 'user', content: userContent }],
    }, { timeout: STALL_TIMEOUT_MS })

    const toolUse = msg.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    )
    if (!toolUse) throw new Error('Claude did not return a propose_edits tool call')
    const input = toolUse.input as { edits?: ProposedEdit[] }
    const edits = input.edits ?? []

    const u = msg.usage as unknown as Record<string, number>
    const cacheRead  = u.cache_read_input_tokens       ?? 0
    const cacheWrite = u.cache_creation_input_tokens   ?? 0
    const inputTok   = u.input_tokens                  ?? 0
    const outputTok  = u.output_tokens                 ?? 0

    const usage = {
      input: inputTok, output: outputTok, cacheRead, cacheWrite,
      costUsd: calcCost(inputTok, outputTok, cacheRead, cacheWrite, {
        input: SONNET_INPUT_PRICE, output: SONNET_OUTPUT_PRICE,
        cacheRead: SONNET_CACHE_READ, cacheWrite: SONNET_CACHE_WRITE,
      }),
    }

    return { edits, usage, stopReason: msg.stop_reason }
  }

  // An instruction touching many scattered occurrences (e.g. "remove every mention of
  // X and Y") can need more edits than fit in a modest max_tokens budget — the tool call
  // gets cut off mid-JSON and parses out to effectively zero usable edits, which used to
  // silently trigger the expensive full-regen fallback despite this being the cheap path
  // failing for a fixable reason. Retry once with a much bigger budget before giving up.
  let result = await attempt(4096)
  if (result.stopReason === 'max_tokens') {
    console.warn('[ProposeEdits] truncated at max_tokens with', result.edits.length, 'edit(s) parsed — retrying with a larger budget')
    const retryResult = await attempt(16_000)
    result = { ...retryResult, usage: addUsage(result.usage, retryResult.usage) }
  }

  const { edits, usage, stopReason } = result
  console.log('[ProposeEdits]', usage, `${edits.length} edit(s)`, 'stop_reason:', stopReason)
  return { edits, usage }
}
