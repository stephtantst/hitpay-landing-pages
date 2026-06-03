// Generate Figma JS for an existing Supabase page and patch it in
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8')
const apiKey       = env.match(/ANTHROPIC_API_KEY=(.+)/)?.[1]?.trim()
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim()
const SERVICE_KEY  = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()

const PAGE_ID = process.argv[2]
if (!PAGE_ID) { console.error('Usage: node generate-figma.mjs <page-id>'); process.exit(1) }

const sbHeaders = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Prefer': 'return=representation',
}

// Fetch the page record
const res = await fetch(`${SUPABASE_URL}/rest/v1/generated_pages?id=eq.${PAGE_ID}&select=html,filename`, { headers: sbHeaders })
const [page] = await res.json()
if (!page) { console.error('Page not found:', PAGE_ID); process.exit(1) }

console.log('Generating Figma JS for:', page.filename)

// Load the scaffold (everything up to hero builders + mkHeroGeneric)
const codeJs = fs.readFileSync(path.join(ROOT, 'figma-plugin/code.js'), 'utf-8')
const heroMarker = '// ── HERO BUILDERS'
const scaffoldBase = codeJs.slice(0, codeJs.indexOf(heroMarker)).trimEnd()
const mkHeroGeneric = `
function mkHeroGeneric(badge, h1Text, subText, btn1Label, btn2Label, finePrint) {
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);
  const badgePill = mkPill(badge, C.hpBlue100, C.hpAction, 16, 8, 100);
  badgePill.x = 144; badgePill.y = 80; sec.appendChild(badgePill);
  const h1Node = mkH2(h1Text, 56, C.hpTextPri, 'LEFT', 560);
  h1Node.lineHeight = { value: 64, unit: 'PIXELS' };
  h1Node.x = 144; h1Node.y = 126; sec.appendChild(h1Node);
  const subNode = mkText(subText, 20, W.regular, C.hpTextSec, 'LEFT', 540);
  subNode.lineHeight = { value: 30, unit: 'PIXELS' };
  subNode.x = 144; subNode.y = 290; sec.appendChild(subNode);
  const b1 = mkBtn(btn1Label, C.hpAction, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 390; sec.appendChild(b1);
  const b2 = mkBtn(btn2Label, null, C.slate800, 24, 14, 12, true);
  b2.x = 320; b2.y = 390; sec.appendChild(b2);
  if (finePrint) { const fine = mkText(finePrint, 14, W.regular, C.slate500); fine.x = 144; fine.y = 450; sec.appendChild(fine); }
  return sec;
}
`
const scaffold = scaffoldBase + '\n' + mkHeroGeneric

// Page name derived from filename — prefill locks in constructor with xOffset=0
// so Claude cannot write the second argument at all.
const vertical = page.filename.replace('.html', '')
const pageName = vertical.charAt(0).toUpperCase() + vertical.slice(1) + ' Landing Page'
const PREFILL = `async function buildPage() {\n  await loadFonts();\n  const page = new Page('${pageName}', 0);\n  const ac = C.hpAction;`

const SYSTEM = `You are converting a HitPay landing page into a Figma frame.
A scaffold of validated helper functions is pre-written and will be prepended automatically — DO NOT redefine any functions.

## CRITICAL RULES
1. Use the EXACT content from the provided HTML page text. Do NOT invent new copy.
   Copy headlines, subtext, bullets, stats, testimonial quotes, FAQ questions and answers verbatim from the HTML text.
2. All JS strings use single quotes. Escape ANY apostrophe inside a string with a backslash: don\'t, HitPay\'s, Touch \'n Go.
3. Never put a literal newline inside a string. Keep every string value on a single line.

The function declaration, Page constructor, and \`const ac = C.hpAction;\` are ALREADY written.
Write ONLY the page.add() section calls and the required ending, starting directly with:
  page.add(mkNavbar(C.hpAction), 64);

## SECTION ORDER
mkNavbar → mkHeroGeneric → mkTrustBar → mkIntro → mkFeature×4 → mkStats → mkTestimonial → mkGrid → mkRelated → mkCTA → mkFAQ → mkFooter

## BUILDERS (height is second arg to page.add):
page.add(mkNavbar(C.hpAction), 64)
page.add(mkHeroGeneric(badge, h1, sub, btn1, btn2, finePrint), 560)
  btn1, btn2: PLAIN STRINGS only — copy exact button labels from the HTML
page.add(mkFeature({ label, h2, p, bullets, mockUI, bg, textSide, accent }), 480)
  Copy label, h2, p, bullets verbatim from the HTML feature sections
  bg: C.hpBlue50 (1&3) / C.white (2&4) | textSide: 'left'(1&3) / 'right'(2&4)
  mockUI: mockCheckout()|mockPOS()|mockPOSDashboard()|mockTapToPay()|mockPaymentLink()|mockSubscriptions()|mockOmnichannel()|mockDonation()|mockRecurringDonors()|mockQR()|mockInvoice()|null
page.add(mkStats([{value,label}×4], C.hpDeepBlue, C.white, C.hpBlue100), 192)
  Copy all 4 stat value+label pairs from the HTML stats bar
page.add(mkTestimonial(quote, name, company, C.hpAction), 380)
  Copy the exact testimonial quote, name, company from the HTML
page.add(mkGrid(title, subtitle, cards), 660)  — Copy all 6 cards from HTML
page.add(mkRelated(sectionTitle, items, C.hpAction), 380)  — Copy 3 items from HTML
page.add(mkCTA(h2, p, btn1, btn2, C.hpAction), 300)  — btn1, btn2: PLAIN STRINGS only
page.add(mkFAQ(items, C.hpAction), 0)  — Copy ALL FAQ q+a pairs from the HTML
page.add(mkFooter(C.hpAction, footerProducts, footerSolutions), 280)

## REQUIRED ENDING
  figma.currentPage.appendChild(page.f);
  figma.viewport.scrollAndZoomIntoView([page.f]);
}`

// Strip HTML to readable text so Haiku sees the actual copy, not 90KB of markup.
// Use spaces (not newlines) to prevent literal newlines ending up in JS string literals.
const pageText = page.html
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "\\'").replace(/&quot;/g, '"')
  .replace(/\s{2,}/g, ' ')
  .trim()

const client = new Anthropic({ apiKey })
const brief = `Vertical: ${page.filename.replace('.html', '')}`

console.log('Calling Haiku...')
const msg = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 8000,
  system: SYSTEM,
  messages: [
    { role: 'user', content: `Brief:\n${brief}\n\nFull page text (copy content from this):\n${pageText}` },
    { role: 'assistant', content: PREFILL },
  ],
})

const rawOutput = msg.content[0].type === 'text' ? msg.content[0].text : ''
// Escape bare apostrophes between word chars (e.g. "doesn't", "Touch 'n Go")
const raw = rawOutput.replace(/(\w)'(\w)/g, "$1\\'$2")
const figmaJs = `${scaffold}\n\n${PREFILL}${raw}\nbuildPage();`

console.log(`Generated ${figmaJs.length} chars of Figma JS`)

// Patch Supabase
const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/generated_pages?id=eq.${PAGE_ID}`, {
  method: 'PATCH',
  headers: sbHeaders,
  body: JSON.stringify({ figma_plugin_js: figmaJs }),
})
console.log('Patch status:', patchRes.status)
console.log('Done — reload the page detail view to copy the Figma JS')
