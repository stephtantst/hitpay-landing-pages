'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type CreatePageFormData = {
  vertical: string
  markets: string[]
  outputFilename: string
  keyProducts: string[]
  rawBrief: string
}

export type InitialCreatePageData = {
  vertical: string
  markets: string[]
  filename: string
}

type Chip = { label: string; emoji: string; brief: string }

const CHIPS: Chip[] = [
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
const BRIEF_MIN = 100
const BRIEF_MAX = 30_000

type FormFields = { vertical: string; markets: string[]; outputFilename: string; rawBrief: string }
type FormErrors = Partial<Record<keyof FormFields, string>>

function validate(f: FormFields): FormErrors {
  const e: FormErrors = {}
  if (!f.vertical.trim()) e.vertical = 'Required'
  if (f.markets.length === 0) e.markets = 'Select at least one market'
  if (!f.outputFilename.trim()) {
    e.outputFilename = 'Required'
  } else if (!/^[a-z0-9][a-z0-9-]*\.html$/.test(f.outputFilename)) {
    e.outputFilename = 'Lowercase letters, numbers, hyphens only — must end in .html'
  }
  if (f.rawBrief.trim().length < BRIEF_MIN) {
    e.rawBrief = `Add more context — minimum ${BRIEF_MIN} characters (currently ${f.rawBrief.trim().length})`
  } else if (f.rawBrief.length > BRIEF_MAX) {
    e.rawBrief = `Too long — trim to under ${BRIEF_MAX.toLocaleString()} characters (currently ${f.rawBrief.length.toLocaleString()})`
  }
  return e
}

function slugify(label: string): string {
  return label.toLowerCase().replace(/[\s/+&]+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function CreatePageForm({ initialData, onSubmit, loading }: {
  initialData: InitialCreatePageData | null
  onSubmit: (data: CreatePageFormData) => void
  loading: boolean
}) {
  const [form, setForm] = useState<FormFields>({
    vertical: initialData?.vertical ?? '',
    markets: initialData?.markets ?? ['SG', 'MY', 'PH'],
    outputFilename: initialData?.filename ?? '',
    rawBrief: '',
  })
  const [selectedChip, setSelectedChip] = useState<Chip | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const set = <K extends keyof FormFields>(k: K, v: FormFields[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const toggleMarket = (m: string) =>
    set('markets', form.markets.includes(m)
      ? form.markets.filter((x) => x !== m)
      : [...form.markets, m])

  const handleVerticalBlur = () => {
    if (form.vertical.trim() && !form.outputFilename) {
      set('outputFilename', slugify(form.vertical) + '.html')
    }
  }

  const selectChip = (chip: Chip) => {
    if (selectedChip?.label === chip.label) {
      setSelectedChip(null)
      set('vertical', '')
      set('outputFilename', '')
    } else {
      setSelectedChip(chip)
      set('vertical', chip.label)
      set('outputFilename', slugify(chip.label) + '.html')
      set('rawBrief', chip.brief)
    }
  }

  const handleSubmit = () => {
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length === 0) {
      onSubmit({
        vertical: form.vertical.trim(),
        markets: form.markets,
        outputFilename: form.outputFilename.trim(),
        keyProducts: [],
        rawBrief: form.rawBrief,
      })
    }
  }

  const briefLen = form.rawBrief.length
  const briefCountColor =
    briefLen > BRIEF_MAX ? 'text-red-500' :
    briefLen > BRIEF_MAX * 0.8 ? 'text-amber-500' :
    'text-[#61667C]'

  const canSubmit =
    form.vertical.trim().length > 0 &&
    form.markets.length > 0 &&
    /^[a-z0-9][a-z0-9-]*\.html$/.test(form.outputFilename) &&
    form.rawBrief.trim().length >= BRIEF_MIN &&
    form.rawBrief.length <= BRIEF_MAX

  return (
    <Card className="p-6 space-y-5">

      <div>
        <Label>Quick pick</Label>
        <p className="text-xs text-[#61667C] mt-0.5 mb-2">
          Optional — prefills the industry, filename, and brief below with a starting template you can edit freely.
        </p>
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip) => (
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vertical">Industry or use case *</Label>
          <Input
            id="vertical"
            placeholder="e.g. Restaurants, Beauty & Wellness, SaaS…"
            value={form.vertical}
            onChange={(e) => set('vertical', e.target.value)}
            onBlur={handleVerticalBlur}
            className={`mt-1 ${errors.vertical ? 'border-red-400' : ''}`}
          />
          {errors.vertical && <p className="text-xs text-red-500 mt-1">{errors.vertical}</p>}
        </div>
        <div>
          <Label>Target markets *</Label>
          <div className="flex gap-2 mt-2">
            {MARKETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMarket(m)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                  form.markets.includes(m)
                    ? 'bg-[#2465DE] text-white border-[#2465DE]'
                    : 'bg-white text-[#61667C] border-slate-200 hover:border-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {errors.markets && <p className="text-xs text-red-500 mt-1">{errors.markets}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="filename">Output filename *</Label>
        <Input
          id="filename"
          placeholder="e.g. ai-shoppers.html"
          value={form.outputFilename}
          onChange={(e) => set('outputFilename', e.target.value)}
          className={`mt-1 font-mono ${errors.outputFilename ? 'border-red-400' : ''}`}
        />
        {errors.outputFilename
          ? <p className="text-xs text-red-500 mt-1">{errors.outputFilename}</p>
          : <p className="text-xs text-[#61667C] mt-1">Lowercase, hyphens, must end in .html</p>
        }
      </div>

      <div>
        <Label htmlFor="brief">Brief *</Label>
        <p className="text-xs text-[#61667C] mt-0.5 mb-2">
          Paste anything — a PRD, GTM brief, product docs, feature notes, raw copy, a help article, even a messy Slack thread.
          Claude will extract what it needs and apply the HitPay GEO + AEO rules on top. Once the page is generated, you can
          keep refining it with follow-up instructions from its detail page — no need to get everything right here.
        </p>
        <Textarea
          id="brief"
          placeholder="Paste a PRD, brief, or any product context here…"
          value={form.rawBrief}
          onChange={(e) => set('rawBrief', e.target.value)}
          className={`mt-1 text-sm leading-relaxed ${errors.rawBrief ? 'border-red-400' : ''}`}
          rows={16}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.rawBrief
            ? <p className="text-xs text-red-500">{errors.rawBrief}</p>
            : <p className="text-xs text-[#61667C]">Minimum {BRIEF_MIN} characters</p>
          }
          <p className={`text-xs ${briefCountColor}`}>{briefLen.toLocaleString()} / {BRIEF_MAX.toLocaleString()}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full py-3 text-sm font-semibold bg-[#2465DE] text-white rounded-xl hover:bg-[#1B4FB8] disabled:opacity-40 transition-colors"
      >
        {loading ? 'Generating…' : 'Generate landing page'}
      </button>
    </Card>
  )
}
