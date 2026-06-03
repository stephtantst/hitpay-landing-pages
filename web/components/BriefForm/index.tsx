'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type BriefFormData = {
  vertical: string
  markets: string[]
  outputFilename: string
  keyProducts: string[]
  rawBrief: string
}

type FormErrors = Partial<Record<keyof BriefFormData | 'markets', string>>

const MARKETS = ['SG', 'MY', 'PH']
const BRIEF_MIN = 100
const BRIEF_MAX = 30_000

function validate(f: BriefFormData): FormErrors {
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

export function BriefForm({ onSubmit, loading }: {
  onSubmit: (data: BriefFormData) => void
  loading: boolean
}) {
  const [form, setForm] = useState<BriefFormData>({
    vertical: '',
    markets: ['SG', 'MY', 'PH'],
    outputFilename: '',
    keyProducts: [],
    rawBrief: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const set = (k: keyof BriefFormData, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }))

  const toggleMarket = (m: string) =>
    set('markets', form.markets.includes(m)
      ? form.markets.filter((x) => x !== m)
      : [...form.markets, m])

  const handleVerticalBlur = () => {
    if (form.vertical && !form.outputFilename) {
      set('outputFilename', form.vertical.toLowerCase().replace(/[\s/+]+/g, '-') + '.html')
    }
  }

  const handleSubmit = () => {
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length === 0) onSubmit(form)
  }

  const briefLen = form.rawBrief.length
  const briefCountColor =
    briefLen > BRIEF_MAX ? 'text-red-500' :
    briefLen > BRIEF_MAX * 0.8 ? 'text-amber-500' :
    'text-[#61667C]'

  const canSubmit =
    form.vertical.trim().length > 0 &&
    form.markets.length > 0 &&
    form.rawBrief.trim().length >= BRIEF_MIN &&
    form.rawBrief.length <= BRIEF_MAX

  return (
    <Card className="p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vertical">Page name *</Label>
          <Input
            id="vertical"
            placeholder="e.g. bukku-hitpay, restaurants, beauty"
            value={form.vertical}
            onChange={(e) => set('vertical', e.target.value)}
            onBlur={handleVerticalBlur}
            className={`mt-1 ${errors.vertical ? 'border-red-400' : ''}`}
          />
          {errors.vertical
            ? <p className="text-xs text-red-500 mt-1">{errors.vertical}</p>
            : <p className="text-xs text-[#61667C] mt-1">Used as slug and MCP search term</p>
          }
        </div>
        <div>
          <Label htmlFor="filename">Output filename *</Label>
          <Input
            id="filename"
            placeholder="e.g. bukku-hitpay.html"
            value={form.outputFilename}
            onChange={(e) => set('outputFilename', e.target.value)}
            className={`mt-1 ${errors.outputFilename ? 'border-red-400' : ''}`}
          />
          {errors.outputFilename
            ? <p className="text-xs text-red-500 mt-1">{errors.outputFilename}</p>
            : <p className="text-xs text-[#61667C] mt-1">Lowercase, hyphens, must end in .html</p>
          }
        </div>
      </div>

      <div>
        <Label>Target markets</Label>
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

      <div>
        <Label htmlFor="context">Context *</Label>
        <p className="text-xs text-[#61667C] mt-0.5 mb-2">
          Paste anything — product docs, a feature brief, a help article, raw notes, competitor copy.
          Claude will extract what it needs and apply the HitPay GEO + AEO rules on top.
        </p>
        <Textarea
          id="context"
          placeholder={`Paste your context here. Examples:\n\n• A product page or feature doc ("Automate your accounting with Bukku + HitPay…")\n• Raw notes on a vertical ("Restaurants need PayNow, Soundbox, low card rates…")\n• A help centre article\n• Copy from another page to adapt\n• Just a topic ("HitPay for freelancers in Malaysia")`}
          value={form.rawBrief}
          onChange={(e) => set('rawBrief', e.target.value)}
          className={`mt-1 text-sm leading-relaxed ${errors.rawBrief ? 'border-red-400' : ''}`}
          rows={18}
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
