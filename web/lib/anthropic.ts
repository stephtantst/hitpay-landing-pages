import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { getFigmaScaffold } from './figma-scaffold'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Sonnet for HTML (quality-critical), Haiku for Figma JS (structured code gen)
const HTML_MODEL = 'claude-sonnet-4-6'
const FIGMA_MODEL = 'claude-haiku-4-5-20251001'

// Sonnet pricing (per million tokens)
const SONNET_INPUT_PRICE  = 3.00
const SONNET_OUTPUT_PRICE = 15.00
const SONNET_CACHE_WRITE  = 3.75   // +25% over input on cache write
const SONNET_CACHE_READ   = 0.30   // 90% cheaper on cache hit

// Haiku pricing (per million tokens)
const HAIKU_INPUT_PRICE   = 0.80
const HAIKU_OUTPUT_PRICE  = 4.00
const HAIKU_CACHE_WRITE   = 1.00
const HAIKU_CACHE_READ    = 0.08

export type UsageStats = {
  html: { input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number }
  figma: { input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number }
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

function loadFile(relativePath: string): string {
  const absPath = path.join(process.cwd(), '..', relativePath)
  try { return fs.readFileSync(absPath, 'utf-8') } catch { return '' }
}

// Memoize at module level — only read from disk once per process lifetime
let _systemPrompt: string | null = null
export function getSystemPrompt(): string {
  if (!_systemPrompt) _systemPrompt = loadFile('generator/GENERATOR-PROMPT.md')
  return _systemPrompt!
}

export function getResearchContext(vertical: string): string {
  const research = loadFile('RESEARCH.md')
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

export async function generateHtml(
  systemPrompt: string,
  brief: string,
  mcpContext: string,
  researchContext: string,
  markets: string[],
  onChunk: (chunk: string) => void
): Promise<{ html: string; usage: UsageStats['html'] }> {
  // Mock mode: skip API call, stream an existing page file
  if (process.env.MOCK_LLM === 'true') {
    const mockHtml = loadFile('restaurants.html') || '<html><body><h1>Mock page</h1></body></html>'
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

  let fullHtml = ''

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

  console.log('[HTML]', usage)
  return { html: fullHtml, usage }
}

const FIGMA_SYSTEM_PROMPT = `You are converting a HitPay landing page into a Figma frame.
A scaffold of validated helper functions is pre-written and will be prepended automatically — DO NOT redefine any functions.

## CRITICAL RULES
1. Use the EXACT content from the provided HTML page text. Do NOT invent new copy.
   Copy headlines, subtext, bullets, stats, testimonial quotes, FAQ questions and answers verbatim from the HTML text.
2. All JS strings use single quotes. Escape ANY apostrophe inside a string with a backslash: don\'t, HitPay\'s, Touch \'n Go.
3. Never put a literal newline inside a string. Keep every string value on a single line.

The function declaration, Page constructor, and \`const ac = C.hpAction;\` are ALREADY written in the prefill.
Write ONLY the page.add() section calls and the required ending, starting directly with:
  page.add(mkNavbar(C.hpAction), 64);

## SECTION ORDER (follow exactly)
mkNavbar → mkHeroGeneric → mkTrustBar → mkIntro → mkFeature×4 → mkStats → mkTestimonial → mkGrid → mkRelated → mkCTA → mkFAQ → mkFooter

## BUILDERS (height is the second arg to page.add):

page.add(mkNavbar(C.hpAction), 64)

page.add(mkHeroGeneric(badge, h1, sub, btn1, btn2, finePrint), 560)
  badge: vertical label from the hero badge/pill in the HTML
  h1: exact hero headline from the HTML, use \\n to split at the natural line break
  sub: exact hero subtext from the HTML
  btn1, btn2: PLAIN STRINGS only — copy exact CTA button labels from the HTML
  finePrint: fine print text under buttons, or null

page.add(mkTrustBar(label, items), 120)
  IMPORTANT: TWO separate args — label is a STRING, items is an ARRAY. Never merge into one arg.
  label: ALL-CAPS trust bar label from the HTML (e.g. "TRUSTED BY ... ACROSS SOUTHEAST ASIA")
  items: array of 6–9 payment method or business type strings from the HTML trust bar

page.add(mkIntro(h2, p), 240)
  h2, p: copy the intro section headline and paragraph from the HTML exactly

page.add(mkFeature({ label, h2, p, bullets, mockUI, bg, textSide, accent }), 480)
  label: copy UPPERCASE feature label from the HTML
  h2: copy feature headline from the HTML
  p: copy feature paragraph from the HTML
  bullets: copy the bullet points from the HTML (3-4 strings)
  bg: C.hpBlue50 for features 1&3, C.white for features 2&4
  textSide: 'left' for 1&3, 'right' for 2&4
  accent: C.hpAction
  mockUI: choose the most relevant from mockCheckout(), mockPOS(), mockPOSDashboard(),
    mockTapToPay(), mockPaymentLink(), mockSubscriptions(), mockOmnichannel(),
    mockDonation(), mockRecurringDonors(), mockQR(), mockInvoice() — or null

page.add(mkStats([{value,label}×4], C.hpDeepBlue, C.white, C.hpBlue100), 192)
  Copy the 4 stats (value + label pairs) from the HTML stats bar exactly

page.add(mkTestimonial(quote, name, company, C.hpAction), 380)
  Copy the testimonial quote, name, and company from the HTML exactly

page.add(mkGrid(title, subtitle, cards), 660)
  Copy the grid section title, subtitle, and all 6 feature cards from the HTML exactly

page.add(mkRelated(sectionTitle, items, C.hpAction), 380)
  Copy the 3 related product items (emoji, title, desc) from the HTML exactly

page.add(mkCTA(h2, p, btn1, btn2, C.hpAction), 300)
  Copy the CTA headline, paragraph, and button labels from the HTML
  btn1, btn2: PLAIN STRINGS only

page.add(mkFAQ(items, C.hpAction), 0)  ← pass 0 — height is auto-calculated
  Copy ALL FAQ questions and answers from the HTML (include all of them)

page.add(mkFooter(C.hpAction, footerProducts, footerSolutions), 280)
  footerProducts: array of 4–5 PLAIN STRINGS — product names only, no objects, no href
  footerSolutions: array of 4–5 PLAIN STRINGS — solution/vertical names only, no objects, no href

## REQUIRED ENDING
Always close with:
  figma.currentPage.appendChild(page.f);
  figma.viewport.scrollAndZoomIntoView([page.f]);
}`

export async function generateFigmaJs(
  brief: string,
  html: string
): Promise<{ js: string; usage: UsageStats['figma'] }> {
  if (process.env.MOCK_LLM === 'true') {
    // Mock uses the same scaffold pattern — calls all validated section builders.
    const mockBody = `page.add(mkNavbar(ac), 64);
  page.add(mkHeroGeneric(
    'Restaurant Payments',
    'Accept payments the way\\nyour guests prefer',
    'From PayNow QR on your table to card terminals at the counter — HitPay connects every payment channel in one dashboard. Zero monthly fees.',
    'Start for free',
    'Request a demo',
    'Free to sign up · No setup fees · Pay per transaction'
  ), 560);
  page.add(mkTrustBar(
    'TRUSTED BY F&B BUSINESSES ACROSS SOUTHEAST ASIA',
    ['Fine Dining', 'Cafes', 'Food Courts', 'Bubble Tea', 'Catering', 'Bars & Nightlife']
  ), 120);
  page.add(mkIntro(
    'One platform for every payment channel',
    'Whether your customers eat in, take away, or order online, HitPay handles checkout so your team can focus on delivering great experiences.'
  ), 240);
  page.add(mkFeature({
    label: 'QR TABLE ORDERING',
    h2: 'Let guests scan, order\\nand pay at the table',
    p: 'Eliminate queues with QR ordering. Customers scan a code, browse your menu, and pay — no app download required.',
    bullets: ['Zero commission on every QR order', 'Menu updates in real-time, no reprinting required', 'Multiple payment methods per table', 'Orders flow directly to your kitchen display'],
    mockUI: mockQR(),
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 480);
  page.add(mkFeature({
    label: 'POINT OF SALE',
    h2: 'A POS built for fast-moving F&B',
    p: 'Process dine-in, takeaway and delivery orders from a single terminal. Works on iPad, Android or PC — no proprietary hardware required.',
    bullets: ['Table management and split-bill support', 'Works offline — syncs when connection resumes', 'End-of-day reports with full revenue breakdown'],
    mockUI: mockPOS(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);
  page.add(mkFeature({
    label: 'PAYMENT METHODS',
    h2: 'Accept every payment method\\nyour guests use',
    p: 'PayNow, GrabPay, cards, Atome, ShopeePay — all from a single terminal or QR code. No extra hardware or accounts needed.',
    bullets: ['PayNow, GrabPay, ShopeePay, FavePay in Singapore', 'DuitNow, TNG eWallet, Boost in Malaysia', 'GCash, Maya, QR Ph in the Philippines'],
    mockUI: null,
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 480);
  page.add(mkFeature({
    label: 'DELIVERY & ONLINE ORDERS',
    h2: 'Take delivery orders without\\nplatform commissions',
    p: 'Create a branded order page with your full menu and share via WhatsApp or Instagram. Customers pay directly — you keep 100% of revenue.',
    bullets: ['Commission-free orders direct to your restaurant', 'Accept advance orders and time-slot bookings', 'Automatic payment receipts and order confirmations'],
    mockUI: mockPaymentLink(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);
  page.add(mkStats([
    { value: 'SGD/MYR/PHP 0', label: 'Monthly fees' },
    { value: '50+', label: 'Payment methods' },
    { value: 'Next business day', label: 'Payouts in SG, MY & PH' },
    { value: '10,000+', label: 'F&B businesses on HitPay' },
  ], C.hpDeepBlue, C.white, C.hpBlue100), 192);
  page.add(mkTestimonial(
    'HitPay transformed how we handle payments. Our customers can now pay via QR, card, or GrabPay without friction. Settlement the next business day keeps our cash flow healthy.',
    'Wei Lin Tan',
    'Owner, Nasi Lemak Specialist — Singapore',
    ac
  ), 380);
  page.add(mkGrid(
    'Everything a restaurant needs',
    'HitPay covers your payments end to end, from the kitchen to the customer.',
    [
      { title: 'Instant PayNow QR', desc: 'Print and display anywhere — counters, tables, or delivery bags.' },
      { title: 'Real-time reports', desc: 'See revenue by payment method, channel, and time period instantly.' },
      { title: 'Staff management', desc: 'Multiple logins, shift reports, and role-based permissions.' },
      { title: 'Multi-outlet', desc: 'Manage payments across multiple branches from one account.' },
      { title: 'Accounting sync', desc: 'Push transactions to Xero, QuickBooks, or Bukku automatically.' },
      { title: 'Customer receipts', desc: 'Automated email and SMS receipts after every transaction.' },
    ]
  ), 660);
  page.add(mkRelated(
    'Explore related solutions',
    [
      { emoji: '🛒', title: 'E-commerce', desc: 'Accept online payments across your website and social media.' },
      { emoji: '🏪', title: 'Retail', desc: 'Unified POS and online payments for physical retail stores.' },
      { emoji: '📅', title: 'Events', desc: 'Sell tickets, manage registrations, and accept donations.' },
    ],
    ac
  ), 380);
  page.add(mkCTA(
    'Start accepting payments today',
    'Join thousands of F&B businesses already growing with HitPay. Free to sign up — no credit card required.',
    'Start for free',
    'Talk to sales',
    ac
  ), 300);
  page.add(mkFAQ([
    { q: 'Does HitPay charge monthly fees?', a: 'No. HitPay charges zero monthly fees. Merchants pay only a small transaction fee per successful payment.' },
    { q: 'How quickly are payouts settled?', a: 'Payouts are settled the next business day in Singapore, Malaysia, and the Philippines.' },
    { q: 'Which payment methods does HitPay support for F&B?', a: 'HitPay supports PayNow, GrabPay, ShopeePay, Atome, Visa, Mastercard, Amex, and 50+ other payment methods.' },
    { q: 'Does HitPay work for delivery orders?', a: 'Yes. HitPay payment links allow restaurants to take online orders directly via WhatsApp or Instagram without paying platform commissions.' },
    { q: 'Is there a hardware requirement for in-store payments?', a: 'No. Card payments can be accepted using just a smartphone with Tap to Pay, or with HitPay card terminals and Payment Soundbox.' },
  ], ac), 0);
  page.add(mkFooter(
    ac,
    ['Payment Gateway', 'POS System', 'Payment Links', 'Subscriptions'],
    ['Restaurants', 'Retail', 'E-commerce', 'Events']
  ), 280);

  figma.currentPage.appendChild(page.f);
  figma.viewport.scrollAndZoomIntoView([page.f]);
}`
    const mockPrefill = buildFigmaPrefill('Restaurants Landing Page')
    return { js: `${getFigmaScaffold()}\n\n${mockPrefill}${mockBody}\nbuildPage();`, usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, costUsd: 0 } }
  }

  // Extract vertical name from brief for the Page constructor.
  // Prefill locks in constructor with numeric xOffset=0 — Claude never touches it.
  const pageName = brief.match(/Vertical:\s*(.+)/i)?.[1]?.trim() || 'HitPay Landing Page'
  const FIGMA_PREFILL = buildFigmaPrefill(pageName)

  // Strip HTML tags to get the actual page text so Haiku can copy content verbatim.
  // Raw HTML is ~90KB of markup; stripped text is ~8KB of actual copy.
  const pageText = htmlToText(html)

  const msg = await anthropic.messages.create({
    model: FIGMA_MODEL,
    max_tokens: 8000,
    system: [
      {
        type: 'text',
        text: FIGMA_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Brief:\n${brief.slice(0, 400)}\n\nFull page text (copy content from this):\n${pageText}`,
      },
      // Prefill locks in constructor — Claude outputs section calls only
      { role: 'assistant', content: FIGMA_PREFILL },
    ],
  })

  const u = msg.usage as unknown as Record<string, number>
  const cacheRead  = u.cache_read_input_tokens     ?? 0
  const cacheWrite = u.cache_creation_input_tokens ?? 0
  const input      = u.input_tokens                ?? 0
  const output     = u.output_tokens               ?? 0

  const usage = {
    input, output, cacheRead, cacheWrite,
    costUsd: calcCost(input, output, cacheRead, cacheWrite, {
      input: HAIKU_INPUT_PRICE, output: HAIKU_OUTPUT_PRICE,
      cacheRead: HAIKU_CACHE_READ, cacheWrite: HAIKU_CACHE_WRITE,
    }),
  }

  console.log('[Figma]', usage)

  // Claude's output is section calls only — prefill already has constructor + ac alias.
  const raw = sanitizeFigmaJs(msg.content[0].type === 'text' ? msg.content[0].text : '')
  return { js: `${getFigmaScaffold()}\n\n${FIGMA_PREFILL}${raw}\nbuildPage();`, usage }
}

// Builds the async function declaration + Page constructor with a locked numeric xOffset.
// Claude only writes section calls after this — it cannot corrupt the constructor args.
function buildFigmaPrefill(pageName: string): string {
  return `async function buildPage() {\n  await loadFonts();\n  const page = new Page('${pageName}', 0);\n  const ac = C.hpAction;`
}

// Strips HTML tags, scripts, and styles to extract readable page copy.
// Uses spaces (not newlines) to collapse whitespace — prevents literal newlines
// ending up inside Haiku-generated JS string literals.
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "\\'").replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// Post-processes raw Haiku JS output to fix common string literal issues.
function sanitizeFigmaJs(raw: string): string {
  // Escape bare apostrophes between word characters (e.g. "doesn't", "Touch 'n Go")
  return raw.replace(/(\w)'(\w)/g, "$1\\'$2")
}
