'use client'

import { useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Strips an uploaded HTML document down to its readable text — inline CSS/JS and
// markup tags are pure noise for the brief (Claude reads the copy, not the styling),
// so this keeps only what's worth spending brief-context tokens on. Block-level
// elements get a blank line after them so paragraph/heading/list structure survives
// as plain text.
const BLOCK_TAGS = new Set([
  'P', 'DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'MAIN', 'ASIDE',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TR', 'UL', 'OL', 'TABLE', 'BLOCKQUOTE',
])

function htmlToPlainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style').forEach((el) => el.remove())

  let text = ''
  const walk = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? ''
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const el = node as HTMLElement
    if (el.tagName === 'BR') { text += '\n'; return }
    el.childNodes.forEach(walk)
    if (BLOCK_TAGS.has(el.tagName)) text += '\n\n'
  }
  doc.body.childNodes.forEach(walk)

  return text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

const HTML_FILE_RE = /\.html?$/i

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

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

const MARKETS = ['SG', 'MY', 'PH']
const BRIEF_MIN = 100
// Soft threshold only (turns the counter amber past this point) — Sonnet's 200K-token
// context window comfortably fits far more than this, so there's no hard cap here.
// The server (web/app/api/generate/route.ts) enforces a generous sanity ceiling instead.
const BRIEF_SOFT_WARN = 100_000

type FormFields = { vertical: string; markets: string[]; rawBrief: string }
type FormErrors = Partial<Record<keyof FormFields, string>>

function validate(f: FormFields): FormErrors {
  const e: FormErrors = {}
  if (f.markets.length === 0) e.markets = 'Select at least one market'
  if (f.rawBrief.trim().length < BRIEF_MIN) {
    e.rawBrief = `Add more context — minimum ${BRIEF_MIN} characters (currently ${f.rawBrief.trim().length})`
  }
  return e
}

function slugify(label: string): string {
  return label.toLowerCase().replace(/[\s/+&]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '')
}

// The user never types a filename directly — it's always derived. Falls back to the
// brief's first line when industry is left blank, so there's still a sane default.
function deriveVerticalLabel(vertical: string, rawBrief: string): string {
  if (vertical.trim()) return vertical.trim()
  const firstLine = rawBrief.trim().split('\n')[0].trim()
  return firstLine.slice(0, 60) || 'Landing Page'
}

function deriveFilename(vertical: string): string {
  const slug = slugify(vertical)
  return `${slug || 'landing-page'}.html`
}

export function CreatePageForm({ initialData, onSubmit, loading }: {
  initialData: InitialCreatePageData | null
  onSubmit: (data: CreatePageFormData) => void
  loading: boolean
}) {
  const [form, setForm] = useState<FormFields>({
    vertical: initialData?.vertical ?? '',
    markets: initialData?.markets ?? ['SG', 'MY', 'PH'],
    rawBrief: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof FormFields>(k: K, v: FormFields[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    // Snapshot into a plain array up front — input.files is a live view tied to the
    // DOM element, and resetting the input's value in `finally` below (so the same
    // file can be re-selected later) would otherwise empty it out from under any
    // state updater React defers running until after that reset happens.
    const files = Array.from(fileList)
    setUploadError(null)
    try {
      const additions: string[] = []
      for (const file of files) {
        const raw = await readFileAsText(file)
        const text = HTML_FILE_RE.test(file.name) ? htmlToPlainText(raw) : raw
        additions.push(`## Uploaded: ${file.name}\n\n${text}`)
      }
      setForm((f) => ({
        ...f,
        rawBrief: [f.rawBrief.trim(), ...additions].filter(Boolean).join('\n\n'),
      }))
      setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)])
    } catch {
      setUploadError('Could not read that file — try pasting its content instead.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const toggleMarket = (m: string) =>
    set('markets', form.markets.includes(m)
      ? form.markets.filter((x) => x !== m)
      : [...form.markets, m])

  const handleSubmit = () => {
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length === 0) {
      const vertical = deriveVerticalLabel(form.vertical, form.rawBrief)
      onSubmit({
        vertical,
        markets: form.markets,
        outputFilename: deriveFilename(vertical),
        keyProducts: [],
        rawBrief: form.rawBrief,
      })
    }
  }

  const briefLen = form.rawBrief.length
  const briefCountColor = briefLen > BRIEF_SOFT_WARN ? 'text-amber-500' : 'text-[#61667C]'

  const canSubmit =
    form.markets.length > 0 &&
    form.rawBrief.trim().length >= BRIEF_MIN

  const previewFilename = deriveFilename(deriveVerticalLabel(form.vertical, form.rawBrief))

  return (
    <Card className="p-6 space-y-5">

      <div>
        <Label htmlFor="brief">Brief *</Label>
        <p className="text-xs text-[#61667C] mt-0.5 mb-2">
          Paste anything — a PRD, GTM brief, product docs, feature notes, raw copy, a help article, even a messy Slack thread.
          Claude will extract what it needs and apply the HitPay GEO + AEO rules on top. Once the page is generated, you can
          keep refining it with follow-up instructions from its detail page — no need to get everything right here.
        </p>
        <div className="flex items-start gap-2 rounded-lg bg-[#EBF1FC] px-3 py-2 mb-2">
          <span className="text-sm leading-none mt-0.5">💡</span>
          <p className="text-xs text-[#1B4FB8] leading-relaxed">
            <strong>Combining multiple references?</strong> Paste them all into this one box — e.g. a GTM doc, then a
            product doc below it — or upload the files directly below. There&apos;s no meaningful length limit, so
            don&apos;t trim for space. Label each one with a heading like{' '}
            <code className="font-mono bg-white/60 px-1 rounded">## GTM Strategy</code> and{' '}
            <code className="font-mono bg-white/60 px-1 rounded">## Product Doc</code> so Claude can tell the sources
            apart — and say explicitly if one should take priority over the other.
          </p>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm,.txt,.md"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#61667C] hover:text-[#03102F] border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
          >
            📎 Upload document(s)
          </button>
          <span className="text-xs text-[#61667C]">HTML, TXT, or MD — merged into the brief below</span>
        </div>
        {uploadError && <p className="text-xs text-red-500 mb-2">{uploadError}</p>}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {uploadedFiles.map((name, i) => (
              <span key={`${name}-${i}`} className="inline-flex items-center gap-1 text-[11px] font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full">
                ✓ {name}
              </span>
            ))}
          </div>
        )}
        <Textarea
          id="brief"
          placeholder="Paste a PRD, brief, or any product context here…"
          value={form.rawBrief}
          onChange={(e) => set('rawBrief', e.target.value)}
          className={`mt-1 text-sm leading-relaxed ${errors.rawBrief ? 'border-red-400' : ''}`}
          rows={32}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.rawBrief
            ? <p className="text-xs text-red-500">{errors.rawBrief}</p>
            : <p className="text-xs text-[#61667C]">Minimum {BRIEF_MIN} characters</p>
          }
          <p className={`text-xs ${briefCountColor}`}>{briefLen.toLocaleString()} characters</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vertical">Industry or use case</Label>
          <Input
            id="vertical"
            placeholder="e.g. Restaurants, Beauty & Wellness, SaaS… (optional)"
            value={form.vertical}
            onChange={(e) => set('vertical', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-[#61667C] mt-1">
            Optional — will save as <code className="font-mono">{previewFilename}</code>
          </p>
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
