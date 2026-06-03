'use client'

import { useState, useEffect } from 'react'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

// ─── Static pages ──────────────────────────────────────────────────────────

const STATIC_PAGES = [
  { href: 'ecommerce.html',            emoji: '🛒', label: 'E-commerce',                          desc: 'Online checkout, integrations, payment links, and subscriptions' },
  { href: 'retail.html',               emoji: '🏪', label: 'Retail',                               desc: 'POS system, Tap to Pay, card terminals, and omnichannel dashboard' },
  { href: 'nonprofits.html',           emoji: '💜', label: 'Nonprofits',                           desc: 'Donation pages, recurring giving, event QR codes, and grant invoicing' },
  { href: 'landing.html',              emoji: '🌏', label: 'General (SEO/AEO)',                    desc: 'Cross-channel overview — QR aggregation, cross-border payments, FAQ-optimised' },
  { href: 'landing-plaininspired.html',emoji: '⚡', label: 'General v2 (Plain-inspired)',          desc: 'Punchy copy, pain-first flow, "Speed meet power" comparison section' },
  { href: 'travel.html',               emoji: '✈️', label: 'Travel Agencies & Tour Operators',     desc: 'Cross-border tourist payments, deposit invoicing, payment links, POS' },
  { href: 'education.html',            emoji: '🎓', label: 'Educational Services',                 desc: 'Recurring tuition billing, parent WhatsApp payment links, invoicing, online store' },
  { href: 'computers.html',            emoji: '💻', label: 'Computers, Peripherals & Software',   desc: 'Multi-location POS + inventory, BNPL for big-ticket items, B2B invoicing' },
  { href: 'restaurants.html',          emoji: '🍜', label: 'Fast Food Restaurants & F&B',         desc: 'POS + Soundbox, 2% F&B card rate, cross-border tourist QR payments' },
  { href: 'beauty.html',               emoji: '💆', label: 'Health, Beauty & Spas',               desc: 'Monthly memberships, deposit collection via WhatsApp, package invoicing' },
  { href: 'furniture.html',            emoji: '🛋️', label: 'Furniture & Home Furnishings',        desc: 'POS + inventory, BNPL for big-ticket items, B2B trade invoicing' },
  { href: 'fitness.html',              emoji: '🏋️', label: 'Gyms & Fitness Studios',             desc: 'Automated memberships, class pass payment links, POS at reception' },
  { href: 'events.html',               emoji: '🎪', label: 'Event Management & Wedding Planning', desc: 'Milestone invoicing, deposit links via WhatsApp, online ticket sales' },
  { href: 'wholesale.html',            emoji: '📦', label: 'Wholesale & B2B Trade',               desc: 'B2B invoicing, cross-border APAC collections, recurring supply contracts' },
  { href: 'healthcare.html',           emoji: '🏥', label: 'Healthcare & Clinics',                desc: 'Session invoicing, post-consult payment links, recurring health plan billing' },
  { href: 'mpp.html',                  emoji: '🔗', label: 'Multi-Party Payments',                desc: 'Split payments, marketplace payouts, platform billing with automated splits' },
]

// ─── Generator chips ───────────────────────────────────────────────────────

const CHIPS = [
  { label: 'Restaurants', emoji: '🍜', brief: `HitPay for F&B, Restaurants, and Food Businesses.\n\nPain points: Fake PayNow screenshots, slow reconciliation, cash handling, tourist payments.\n\nKey products: POS Software, Soundbox (instant PayNow alerts, no WiFi), Static QR at 0.4%, Card Terminal, Cross-Border (WeChat Pay / Alipay / UPI for tourists).\n\nSpecial: 2% + S$0.20 F&B card rate. Best testimonial: Bob the Baker Boy or the Bakery quote.` },
  { label: 'Hospitality', emoji: '🏨', brief: `HitPay for Hotels, Resorts, and Hospitality Businesses.\n\nPain points: Multi-currency tourist payments, fragmented channels, slow check-in, managing deposits.\n\nKey products: Cross-Border Payments (WeChat/Alipay/UPI/GrabPay for tourists), Card Terminal, POS, Invoicing for deposits, Recurring for loyalty programs.\n\nHighlight: 12 APAC markets, mid-market FX, 700+ local payment options. Best testimonial: Hotels & Resorts Philippines.` },
  { label: 'Beauty', emoji: '💅', brief: `HitPay for Beauty Salons, Spas, and Wellness Businesses.\n\nPain points: Chasing deposits, managing packages manually, no easy WhatsApp payment links, manual membership billing.\n\nKey products: Recurring Billing for memberships/packages, Payment Links via WhatsApp/Instagram, Invoicing with partial payments, SimplyBook.me integration.\n\nBest testimonials: The Senses Therapy (wellness) and Nodspark (beauty brand) case study.` },
  { label: 'Education', emoji: '📚', brief: `HitPay for Educational Services — tuition centres, schools, online courses, enrichment classes.\n\nPain points: Manual tuition tracking, chasing late payments, managing multiple billing schedules, no professional invoicing.\n\nKey products: Recurring Billing for automated tuition, Payment Links to parents via WhatsApp/email, Invoicing with auto-reminders, Online Store for merch/events, GIRO support.\n\nBest testimonial: Escape Room Experience (automated invoicing).` },
  { label: 'Healthcare', emoji: '🏥', brief: `HitPay for Healthcare Clinics, Medical Practices, and Health Services.\n\nPain points: Manual post-consultation billing, chasing payments, managing multi-session packages, no remote payment collection.\n\nKey products: Invoicing with partial payments for health packages, Payment Links post-consultation via SMS/WhatsApp, Recurring Billing for health plans, SimplyBook.me integration.\n\nHighlight: MAS licensed, PCI DSS Level 1. Best testimonial: The Senses Therapy.` },
  { label: 'Travel', emoji: '✈️', brief: `HitPay for Travel Agencies and Tour Operators.\n\nPain points: Multi-currency international clients, deposit management for group tours, reconciliation overhead, accounting sync.\n\nKey products: Cross-Border Payments (12 markets, 150+ currencies, mid-market FX), Invoicing with partial payments (deposit then balance), Payment Links, Xero/QuickBooks sync.\n\nBest testimonial: Travel Agency — "HitPay POS has saved us lots of time and resources."` },
  { label: 'SaaS', emoji: '🖥️', brief: `HitPay for SaaS and Software Companies needing recurring billing and payment APIs.\n\nPain points: Multi-market billing complexity, subscription management at scale, engineering overhead, all plan types needed.\n\nKey products: Payment APIs (RESTful, Python/Java/PHP/JS, 25+ countries, PCI DSS), Recurring Billing (all schedules + self-serve portal + shareable subscription links + GIRO), global 25+ countries.\n\nBest testimonial: Custom PC Brand — "The HitPay platform is simple with everything we need."` },
  { label: 'Freelancers', emoji: '💼', brief: `HitPay for Freelancers, Consultants, and Independent Service Providers.\n\nPain points: Getting paid late, no professional system, collecting deposits, manual follow-ups on overdue invoices.\n\nKey products: Payment Links (create and share instantly, no website needed), Invoicing with auto-reminders, Partial Payments for deposits, Recurring Billing for retainer clients, Mobile app.\n\nKey stat: $0 monthly fees — only pay when you get paid.` },
  { label: 'Subscriptions', emoji: '🔄', brief: `HitPay for Subscription Businesses needing automated recurring billing.\n\nPain points: Managing subscription lifecycles, customers needing to update payment details, complex billing schedules, no self-serve portal, churn from failed payments.\n\nKey products: Recurring Billing (all schedules), customer self-serve portal (update card, cancel, upgrade), shareable subscription plan links, branded email templates, GIRO support, billing dashboard.` },
  { label: 'Cross-border', emoji: '🌏', brief: `HitPay for Businesses Accepting International and Cross-Border Payments across APAC.\n\nPain points: Accepting payments from different countries, high conversion costs, supporting regional wallets, reconciling multi-currency transactions.\n\nKey products: Cross-Border Payments (12 APAC markets: AU/CN/HK/ID/IN/JP/KR/MY/SG/TH/PH/VN), 700+ local payment options (ShopeePay/GrabPay/GCash/TnG/WeChat/Alipay), mid-market FX, Borderless QR for tourist in-store payments.\n\nKey stats: 12 markets, 700+ options, 150+ currencies.` },
]

const MARKETS = ['SG', 'MY', 'PH']

const STEP_LABELS: Record<string, string> = {
  saving: 'Saving brief…',
  mcp: 'Fetching HitPay knowledge…',
  generating: 'Generating HTML…',
  figma: 'Generating Figma code…',
  saving_page: 'Saving page…',
}

// ─── Types ─────────────────────────────────────────────────────────────────

type GeneratedPage = {
  id: string
  filename: string
  status: string
  created_at: string
  briefs: { vertical: string; market: string[] } | null
}

type InitialBrief = { vertical: string; markets: string[]; filename: string }
type LogEntry = { type: string; message?: string; step?: string }

// ─── Utils ─────────────────────────────────────────────────────────────────

function parseSSEEvents(buffer: string): Array<{ event: string; data: string }> {
  const events: Array<{ event: string; data: string }> = []
  for (const block of buffer.split('\n\n')) {
    if (!block.trim()) continue
    let event = '', data = ''
    for (const line of block.split('\n')) {
      if (line.startsWith('event: ')) event = line.slice(7).trim()
      else if (line.startsWith('data: ')) data = line.slice(6)
    }
    if (event && data) events.push({ event, data })
  }
  return events
}

function bumpFilename(filename: string): string {
  const base = filename.replace(/\.html$/, '')
  const match = base.match(/^(.*)-v(\d+)$/)
  if (match) return `${match[1]}-v${parseInt(match[2]) + 1}.html`
  return `${base}-v2.html`
}

// ─── GenerateForm (key-resetable) ──────────────────────────────────────────

function GenerateForm({
  initialBrief,
  onGenerated,
}: {
  initialBrief: InitialBrief | null
  onGenerated: (page: GeneratedPage) => void
}) {
  const [vertical, setVertical] = useState(initialBrief?.vertical ?? '')
  const [selectedChip, setSelectedChip] = useState<typeof CHIPS[0] | null>(null)
  const [extraContext, setExtraContext] = useState('')
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(initialBrief?.markets ?? ['SG', 'MY', 'PH'])
  const [outputFilename, setOutputFilename] = useState(
    initialBrief ? bumpFilename(initialBrief.filename) : ''
  )
  const [phase, setPhase] = useState<'idle' | 'generating' | 'done' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [donePageId, setDonePageId] = useState<string | null>(null)
  const [genError, setGenError] = useState<string | null>(null)

  const handleVerticalBlur = () => {
    if (vertical.trim() && !outputFilename) {
      setOutputFilename(vertical.trim().toLowerCase().replace(/[\s/+&]+/g, '-').replace(/[^a-z0-9-]/g, '') + '.html')
    }
  }

  const selectChip = (chip: typeof CHIPS[0]) => {
    if (selectedChip?.label === chip.label) {
      setSelectedChip(null); setVertical(''); setOutputFilename('')
    } else {
      setSelectedChip(chip)
      setVertical(chip.label)
      setOutputFilename(chip.label.toLowerCase().replace(/[\s/+&]+/g, '-') + '.html')
    }
  }

  const toggleMarket = (m: string) =>
    setSelectedMarkets(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const computedBrief = selectedChip
    ? selectedChip.brief + (extraContext.trim() ? '\n\nAdditional context:\n' + extraContext.trim() : '')
    : extraContext.trim()

  const canGenerate =
    vertical.trim().length > 0 &&
    /^[a-z0-9][a-z0-9-]*\.html$/.test(outputFilename) &&
    selectedMarkets.length > 0 &&
    computedBrief.length >= 100

  const handleGenerate = async () => {
    if (!canGenerate) return
    setPhase('generating')
    setStatusMsg('Starting…')
    setCharCount(0)

    const brief = {
      vertical: vertical.trim(),
      markets: selectedMarkets,
      outputFilename: outputFilename.trim(),
      keyProducts: [],
      rawBrief: computedBrief,
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Generation failed' }))
        setGenError(err.error || 'Generation failed')
        setPhase('error')
        return
      }
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let chars = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lastDoubleLF = buffer.lastIndexOf('\n\n')
        if (lastDoubleLF === -1) continue
        const toProcess = buffer.slice(0, lastDoubleLF + 2)
        buffer = buffer.slice(lastDoubleLF + 2)

        for (const { event, data } of parseSSEEvents(toProcess)) {
          try {
            const payload = JSON.parse(data)
            if (event === 'done' && payload.pageId) {
              setDonePageId(payload.pageId)
              setPhase('done')
              onGenerated({
                id: payload.pageId,
                filename: payload.filename,
                status: 'ready',
                created_at: new Date().toISOString(),
                briefs: { vertical: vertical.trim(), market: selectedMarkets },
              })
            } else if (event === 'error') {
              setGenError(payload.message)
              setPhase('error')
            } else if (event === 'status') {
              setStatusMsg(STEP_LABELS[payload.step] ?? payload.message)
            } else if (event === 'chunk') {
              chars += payload.text?.length ?? 0
              setCharCount(chars)
            }
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (err) {
      setGenError(String(err))
      setPhase('error')
    }
  }

  // ── Done state ──
  if (phase === 'done' && donePageId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center gap-5">
        <div className="w-16 h-16 bg-[#D6E3F9] rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-[#2465DE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#03102F]">Page generated</h3>
          <p className="text-sm text-[#61667C] mt-1">Your new landing page is ready to preview and publish.</p>
        </div>
        <a
          href={`/pages/${donePageId}`}
          className="w-full flex items-center justify-center gap-2 bg-[#2465DE] hover:bg-[#1B4FB8] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Open page →
        </a>
      </div>
    )
  }

  // ── Generating state ──
  if (phase === 'generating') {
    return (
      <div className="flex-1 flex flex-col px-6 py-8 gap-6">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#2465DE] animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <div>
            <div className="text-sm font-semibold text-[#03102F]">{statusMsg}</div>
            {charCount > 0 && (
              <div className="text-xs text-[#61667C] mt-0.5">{charCount.toLocaleString()} characters generated</div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          {(['Saving brief', 'Fetching HitPay knowledge', 'Generating HTML', 'Generating Figma code', 'Saving page'] as const).map((step, i) => {
            const stepKeys = ['Saving brief…', 'Fetching HitPay knowledge…', 'Generating HTML…', 'Generating Figma code…', 'Saving page…']
            const currentIdx = stepKeys.indexOf(statusMsg)
            const done = i < currentIdx
            const active = i === currentIdx
            return (
              <div key={step} className={`flex items-center gap-3 text-sm ${done ? 'text-[#61667C]' : active ? 'text-[#03102F]' : 'text-slate-300'}`}>
                <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                  done ? 'bg-[#D6E3F9]' : active ? 'bg-[#EBF1FC]' : 'bg-slate-100'
                }`}>
                  {done ? (
                    <svg className="w-2.5 h-2.5 text-[#2465DE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : active ? (
                    <div className="w-1.5 h-1.5 bg-[#2465DE] rounded-full animate-pulse" />
                  ) : null}
                </div>
                {step}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Error state ──
  if (phase === 'error') {
    return (
      <div className="flex-1 flex flex-col px-6 py-8 gap-4">
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="text-sm font-semibold text-red-700">Generation failed</div>
            <div className="text-xs text-red-600 mt-1">{genError}</div>
          </div>
        </div>
        <button
          onClick={() => { setPhase('idle'); setGenError(null) }}
          className="text-sm font-medium text-[#2465DE] hover:underline text-left"
        >
          ← Try again
        </button>
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

      {/* Quick-pick chips */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          Quick pick
        </label>
        <div className="flex flex-wrap gap-2">
          {CHIPS.map(chip => (
            <button
              key={chip.label}
              type="button"
              onClick={() => selectChip(chip)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                selectedChip?.label === chip.label
                  ? 'bg-[#03102F] text-white border-[#03102F]'
                  : 'border-slate-200 bg-[#F9F9F6] hover:bg-white hover:border-slate-400 text-[#61667C]'
              }`}
            >
              <span>{chip.emoji}</span><span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vertical input */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="gen-vertical">
          Industry or use case
        </label>
        <input
          id="gen-vertical"
          type="text"
          placeholder="e.g. Restaurants, Beauty & Wellness, SaaS…"
          value={vertical}
          onChange={e => setVertical(e.target.value)}
          onBlur={handleVerticalBlur}
          className="w-full bg-[#F9F9F6] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#03102F] placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      {/* Context */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="gen-context">
          Additional context
          <span className="normal-case font-normal text-slate-400 ml-1">
            — {selectedChip ? 'optional' : 'required, min 100 chars'}
          </span>
        </label>
        <textarea
          id="gen-context"
          rows={5}
          placeholder={selectedChip
            ? 'Add more context — product docs, specific features, competitor notes…'
            : 'Paste anything — product docs, a feature brief, raw notes, competitor copy. Minimum 100 characters.'}
          value={extraContext}
          onChange={e => setExtraContext(e.target.value)}
          className="w-full bg-[#F9F9F6] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#03102F] placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition-colors resize-none"
        />
        {!selectedChip && (
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${extraContext.trim().length >= 100 ? 'text-green-600' : 'text-slate-400'}`}>
              {extraContext.trim().length} / 100+
            </span>
          </div>
        )}
      </div>

      {/* Markets */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Target markets
        </label>
        <div className="flex gap-2">
          {MARKETS.map(m => (
            <button
              key={m} type="button"
              onClick={() => toggleMarket(m)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                selectedMarkets.includes(m)
                  ? 'bg-[#2465DE] text-white border-[#2465DE]'
                  : 'bg-white text-[#61667C] border-slate-200 hover:border-slate-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Filename */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="gen-filename">
          Output filename
        </label>
        <input
          id="gen-filename"
          type="text"
          placeholder="e.g. restaurants.html"
          value={outputFilename}
          onChange={e => setOutputFilename(e.target.value)}
          className="w-full bg-[#F9F9F6] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#03102F] font-mono placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition-colors"
        />
        <p className="text-xs text-slate-400 mt-1">Lowercase, hyphens only, must end in .html</p>
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full bg-[#03102F] hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Generate Landing Page
      </button>

      {initialBrief && (
        <p className="text-xs text-[#61667C] text-center">
          Regenerating from <span className="font-mono">{initialBrief.filename}</span> — update the filename to avoid a duplicate error.
        </p>
      )}
    </div>
  )
}

// ─── Delete confirmation dialog ────────────────────────────────────────────

function DeleteDialog({
  page,
  open,
  onOpenChange,
  onDeleted,
}: {
  page: GeneratedPage | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!page) return
    setDeleting(true)
    await fetch(`/api/pages/${page.id}`, { method: 'DELETE' })
    onDeleted(page.id)
    onOpenChange(false)
    setDeleting(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => onOpenChange(v)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete page?</DialogTitle>
          <DialogDescription>
            <strong className="text-[#03102F]">{page?.briefs?.vertical ?? page?.filename}</strong> will be removed from the database.
            {page?.status === 'published' && ' The published HTML file in the repo will remain.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-[#61667C] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting…' : 'Delete page'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Row components ─────────────────────────────────────────────────────────

function StaticRow({ page }: { page: typeof STATIC_PAGES[0] }) {
  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg w-7 text-center flex-shrink-0">{page.emoji}</span>
          <div>
            <div className="font-medium text-[#03102F] text-sm">{page.label}</div>
            <div className="text-xs text-[#61667C] font-mono mt-0.5">{page.href}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <span className="inline-flex items-center text-[11px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
          Static
        </span>
      </td>
      <td className="px-5 py-3 text-slate-300 text-sm">—</td>
      <td className="px-5 py-3 text-slate-300 text-sm">—</td>
      <td className="px-5 py-3 text-slate-300 text-sm">—</td>
      <td className="px-5 py-3 text-right">
        <a
          href={`/view/${page.href}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2465DE] hover:text-[#1B4FB8] transition-colors"
        >
          View
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </td>
    </tr>
  )
}

function GeneratedRow({
  page,
  publishingId,
  onPublish,
  onEdit,
  onDelete,
}: {
  page: GeneratedPage
  publishingId: string | null
  onPublish: (page: GeneratedPage) => void
  onEdit: (page: GeneratedPage) => void
  onDelete: (page: GeneratedPage) => void
}) {
  const isPublishing = publishingId === page.id
  const isPublished = page.status === 'published'

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#EBF1FC] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-[#2465DE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-[#03102F] text-sm capitalize">
              {page.briefs?.vertical ?? page.filename.replace('.html', '')}
            </div>
            <div className="text-xs text-[#61667C] font-mono mt-0.5">{page.filename}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <span className="inline-flex items-center text-[11px] font-semibold bg-[#EBF1FC] text-[#2465DE] px-2 py-0.5 rounded-full uppercase tracking-wide">
          AI
        </span>
      </td>
      <td className="px-5 py-3">
        <div className="flex gap-1 flex-wrap">
          {(page.briefs?.market ?? []).map(m => (
            <span key={m} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              {m}
            </span>
          ))}
        </div>
      </td>
      <td className="px-5 py-3">
        <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
          isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {isPublished ? 'Published' : 'Ready'}
        </span>
      </td>
      <td className="px-5 py-3 text-xs text-[#61667C]">
        {new Date(page.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-1">
          <a
            href={`/pages/${page.id}`}
            className="text-xs font-semibold text-[#2465DE] hover:text-[#1B4FB8] px-2.5 py-1.5 rounded-lg hover:bg-[#EBF1FC] transition-colors"
          >
            View
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-[#03102F] focus:outline-none"
              aria-label="More actions"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
              <DropdownMenuItem onClick={() => onEdit(page)}>
                <svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </DropdownMenuItem>
              {!isPublished && (
                <DropdownMenuItem onClick={() => onPublish(page)} disabled={isPublishing}>
                  <svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {isPublishing ? 'Publishing…' : 'Publish to repo'}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(page)}>
                <svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [generatedPages, setGeneratedPages] = useState<GeneratedPage[]>([])
  const [loadingPages, setLoadingPages] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<GeneratedPage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GeneratedPage | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [publishingId, setPublishingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/pages')
      .then(r => r.json())
      .then(data => { setGeneratedPages(Array.isArray(data) ? data : []); setLoadingPages(false) })
      .catch(() => setLoadingPages(false))
  }, [])

  const openNewSheet = () => {
    setEditTarget(null)
    setFormKey(k => k + 1)
    setSheetOpen(true)
  }

  const openEditSheet = (page: GeneratedPage) => {
    setEditTarget(page)
    setFormKey(k => k + 1)
    setSheetOpen(true)
  }

  const handlePublish = async (page: GeneratedPage) => {
    setPublishingId(page.id)
    const res = await fetch(`/api/pages/${page.id}/publish`, { method: 'POST' })
    if (res.ok) setGeneratedPages(prev => prev.map(p => p.id === page.id ? { ...p, status: 'published' } : p))
    setPublishingId(null)
  }

  const handleDeleted = (id: string) => {
    setGeneratedPages(prev => prev.filter(p => p.id !== id))
    setDeleteTarget(null)
  }

  const handleGenerated = (page: GeneratedPage) => {
    setGeneratedPages(prev => [page, ...prev])
  }

  const totalCount = STATIC_PAGES.length + generatedPages.length

  return (
    <div className="min-h-screen bg-[#F9F9F6]">

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#2465DE] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-[#03102F]">HitPay</span>
            <span className="text-slate-300 select-none">/</span>
            <span className="text-[#61667C] font-medium">LP Generator</span>
          </div>
          <button
            onClick={openNewSheet}
            className="flex items-center gap-1.5 text-sm font-semibold bg-[#2465DE] text-white px-4 py-2 rounded-xl hover:bg-[#1B4FB8] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New page
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page title */}
        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-lg font-bold text-[#03102F]">Landing Pages</h1>
          <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            {totalCount}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F9F9F6]/60">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Page</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Markets</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody>

              {loadingPages && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-[#61667C]">
                    Loading…
                  </td>
                </tr>
              )}

              {!loadingPages && generatedPages.map(page => (
                <GeneratedRow
                  key={page.id}
                  page={page}
                  publishingId={publishingId}
                  onPublish={handlePublish}
                  onEdit={openEditSheet}
                  onDelete={setDeleteTarget}
                />
              ))}

              {!loadingPages && STATIC_PAGES.map(page => (
                <StaticRow key={page.href} page={page} />
              ))}

            </tbody>
          </table>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">HitPay Growth Team · Internal use only</p>
      </main>

      {/* ── Generate sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={(v) => setSheetOpen(v)}>
        <SheetContent
          side="right"
          className="sm:max-w-lg flex flex-col p-0 gap-0"
          showCloseButton={true}
        >
          <SheetHeader className="px-6 py-4 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2.5 pr-8">
              <div className="w-7 h-7 bg-[#03102F] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <SheetTitle className="text-sm font-semibold text-[#03102F] leading-tight">
                  {editTarget
                    ? `Regenerate: ${editTarget.briefs?.vertical ?? editTarget.filename}`
                    : 'Generate new page'}
                </SheetTitle>
                <p className="text-xs text-slate-400 mt-0.5">Powered by Claude · HitPay knowledge base</p>
              </div>
            </div>
          </SheetHeader>
          <GenerateForm
            key={formKey}
            initialBrief={editTarget ? {
              vertical: editTarget.briefs?.vertical ?? '',
              markets: editTarget.briefs?.market ?? ['SG', 'MY', 'PH'],
              filename: editTarget.filename,
            } : null}
            onGenerated={handleGenerated}
          />
        </SheetContent>
      </Sheet>

      {/* ── Delete dialog ── */}
      <DeleteDialog
        page={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}
        onDeleted={handleDeleted}
      />

    </div>
  )
}
