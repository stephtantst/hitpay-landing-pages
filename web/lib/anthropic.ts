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
const STALL_TIMEOUT_MS = 60_000

class StreamStallError extends Error {}

// Consumes an Anthropic message stream chunk-by-chunk, throwing StreamStallError if
// no event arrives within STALL_TIMEOUT_MS.
async function consumeStreamWithStallGuard(
  stream: AsyncIterable<Anthropic.MessageStreamEvent>,
  onChunk: (chunk: string) => void
): Promise<string> {
  let fullHtml = ''
  const iterator = stream[Symbol.asyncIterator]()
  while (true) {
    let timer!: ReturnType<typeof setTimeout>
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new StreamStallError('Stream stalled — no data received for 60s')), STALL_TIMEOUT_MS)
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

export async function generateHtml(
  systemPrompt: string,
  brief: string,
  mcpContext: string,
  researchContext: string,
  markets: string[],
  onChunk: (chunk: string) => void,
  onStall?: () => void
): Promise<{ html: string; usage: UsageStats['html'] }> {
  // Mock mode: skip API call, stream an existing page file
  if (process.env.MOCK_LLM === 'true') {
    const mockHtml = loadFile('restaurants.html', 'restaurants.html') || '<html><body><h1>Mock page</h1></body></html>'
    for (let i = 0; i < mockHtml.length; i += 200) {
      onChunk(mockHtml.slice(i, i + 200))
      await new Promise((r) => setTimeout(r, 10))
    }
    return { html: mockHtml, usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, costUsd: 0 } }
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

  // Dynamic part only — brief + MCP context. Research + system prompt are cached.
  const dynamicContent = [
    '## HitPay Knowledge Base\n',
    mcpContext || '(MCP unavailable — use system prompt knowledge)',
    '\n\n## Brief and Context\n',
    brief,
    marketDirective,
    '\n\nGenerate the complete HTML landing page now. Output ONLY the HTML — no markdown fences, no explanation.',
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

  const attempt = async (): Promise<{ html: string; usage: UsageStats['html'] }> => {
    const stream = anthropic.messages.stream({
      model: HTML_MODEL,
      max_tokens: 32000,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }, // Cache the large static system prompt
        },
      ],
      messages: [{ role: 'user', content: userContent }],
    })

    const fullHtml = await consumeStreamWithStallGuard(stream, onChunk)

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

    console.log('[HTML]', usage)
    return { html: fullHtml, usage }
  }

  // A stalled stream almost always means a dead connection to the API, not genuinely
  // slow output — one automatic retry catches that within the request's time budget
  // instead of silently burning the whole thing on a single hung attempt. Any other
  // error (or a second stall) propagates immediately; we only retry this one failure mode.
  try {
    return await attempt()
  } catch (err) {
    if (!(err instanceof StreamStallError)) throw err
    console.warn('[HTML] stream stalled, retrying once:', err.message)
    onStall?.()
    return await attempt()
  }
}

export async function refineHtml(
  systemPrompt: string,
  currentHtml: string,
  instruction: string,
  researchContext: string,
  markets: string[],
  onChunk: (chunk: string) => void
): Promise<{ html: string; usage: UsageStats['html'] }> {
  // Mock mode: skip API call, tag the existing HTML so the UI has something to show
  if (process.env.MOCK_LLM === 'true') {
    const marker = `<!-- Refined: ${instruction.slice(0, 80).replace(/-->/g, '')} -->`
    const mockHtml = currentHtml.includes('</head>')
      ? currentHtml.replace('</head>', `${marker}\n</head>`)
      : `${marker}\n${currentHtml}`
    for (let i = 0; i < mockHtml.length; i += 200) {
      onChunk(mockHtml.slice(i, i + 200))
      await new Promise((r) => setTimeout(r, 5))
    }
    return { html: mockHtml, usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, costUsd: 0 } }
  }

  // Same market-override directive as generateHtml, reworded as a reminder for a revision pass
  const allMarkets = ['SG', 'MY', 'PH']
  const missingMarkets = allMarkets.filter(m => !markets.includes(m))
  const marketDirective = missingMarkets.length > 0
    ? `\n\nMarket constraint still applies: this page covers ONLY ${markets.join(', ')} — never introduce or leave in mentions of ${missingMarkets.join(', ')}.`
    : ''

  const dynamicContent = [
    '## Current Page HTML (revise this in place — do not start over)\n',
    currentHtml,
    '\n\n## Refinement Instructions\n',
    instruction,
    marketDirective,
    '\n\nApply the refinement instructions to the HTML above and output the COMPLETE revised HTML page. ' +
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

  const stream = anthropic.messages.stream({
    model: HTML_MODEL,
    max_tokens: 32000,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userContent }],
  })

  let fullHtml = ''
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullHtml += chunk.delta.text
      onChunk(chunk.delta.text)
    }
  }

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

  console.log('[Refine]', usage)
  return { html: fullHtml, usage }
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
  // Mock mode: propose a trivial, always-matchable edit so the apply path is exercised locally
  if (process.env.MOCK_LLM === 'true') {
    const marker = `<!-- Refined: ${instruction.slice(0, 80).replace(/-->/g, '')} -->`
    return {
      edits: currentHtml.includes('</head>')
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

  const msg = await anthropic.messages.create({
    model: HTML_MODEL,
    max_tokens: 4096,
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
  })

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

  console.log('[ProposeEdits]', usage, `${edits.length} edit(s)`)
  return { edits, usage }
}
