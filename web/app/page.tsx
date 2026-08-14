'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  { href: 'adaptive-pricing.html',      emoji: '💱', label: 'Adaptive Pricing',                     desc: 'Auto local-currency checkout for overseas customers — avg. 10%+ revenue lift' },
  { href: 'cross-border-payments.html', emoji: '🌏', label: 'Cross-Border Payments',                desc: 'Hub — Borderless QR, Multi-Currency Products, Adaptive Pricing, Payment Links' },
  { href: 'customers.html',             emoji: '🤝', label: 'Customers',                            desc: 'Customer logos & social proof — powering 20,000+ businesses across SEA' },
  { href: 'customer-stories.html',      emoji: '📖', label: 'Customer Stories',                     desc: 'Index of all customer story case studies' },
  { href: 'mickey-leotards.html',       emoji: '🛍️', label: 'Mickey Leotards (Customer Story)',     desc: 'Case study — stopped losing sales to unsupported card payments' },
  { href: 'the-durian-bakery.html',     emoji: '🍰', label: 'The Durian Bakery (Customer Story)',    desc: 'Case study — sped up payouts and simplified checkout' },
  { href: 'billpay v2.html',            emoji: '🧾', label: 'BillPay',                               desc: 'Pay suppliers locally & internationally, synced to Xero' },
  { href: 'platforms.html',             emoji: '🔌', label: 'Platforms',                             desc: 'Offer payments to every business you serve, without becoming a PSP' },
  { href: 'multi-currency-collections-account.html', emoji: '💰', label: 'Multi-Currency Collections Account', desc: 'Multi-currency collections account for business receivables' },
  { href: 'virtual-accounts-philippines.html', emoji: '🏦', label: 'Business Collections Account (Philippines)', desc: 'Local receiving account for Philippine business collections' },
  { href: 'virtual-accounts-global-business-collections.html', emoji: '🏦', label: 'Virtual Accounts (Singapore)', desc: 'Global business collections — SWIFT reach to 13 currencies' },
  { href: 'wechat-pay-philippines.html', emoji: '💬', label: 'WeChat Pay (Philippines)',             desc: 'Accept WeChat Pay payments in the Philippines' },
  { href: 'affiliate.html',             emoji: '🎁', label: 'Affiliate Program',                     desc: 'Earn 0.1% commission from every business referred' },
  { href: 'refer-and-earn.html',        emoji: '🎁', label: 'Refer and Earn',                        desc: 'Earn 0.1% from every business you refer' },
  { href: 'asia-art-craft-fair.html',   emoji: '🎨', label: 'Asia Art & Craft Fair SG 2026',         desc: 'Collect payments at Asia Art & Craft Fair Singapore 2026' },
  { href: 'asia-art-craft-fair-slide.html', emoji: '🎨', label: 'Asia Art & Craft Fair SG 2026 (Slide)', desc: 'Asia Art & Craft Fair SG 2026 — slide deck version' },
  { href: 'art-craft-fair.html',        emoji: '🎨', label: 'Art & Craft Fair Singapore 2026',       desc: 'Accept payments at Art & Craft Fair Singapore 2026' },
  { href: 'ai-shoppers.html',          emoji: '🤖', label: 'AI Shoppers',                          desc: 'ChatGPT product discovery, agentic checkout, AI-readiness — automatic for every Online Store merchant' },
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
  { href: 'brand-test.html',           emoji: '🧪', label: 'Brand Test',                           desc: 'Brand rebrand visual test — internal only' },
]

// ─── Types ─────────────────────────────────────────────────────────────────

type GeneratedPage = {
  id: string
  filename: string
  status: string
  created_at: string
  briefs: { vertical: string; market: string[] } | null
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
          href={`/${page.href}`}
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
  onDelete,
}: {
  page: GeneratedPage
  publishingId: string | null
  onPublish: (page: GeneratedPage) => void
  onDelete: (page: GeneratedPage) => void
}) {
  const router = useRouter()
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
          <Link
            href={`/pages/${page.id}`}
            className="text-xs font-semibold text-[#2465DE] hover:text-[#1B4FB8] px-2.5 py-1.5 rounded-lg hover:bg-[#EBF1FC] transition-colors"
          >
            View
          </Link>
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
              <DropdownMenuItem onClick={() => router.push(`/new?edit=${page.id}`)}>
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
  const [deleteTarget, setDeleteTarget] = useState<GeneratedPage | null>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/pages')
      .then(r => r.json())
      .then(data => { setGeneratedPages(Array.isArray(data) ? data : []); setLoadingPages(false) })
      .catch(() => setLoadingPages(false))
  }, [])

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
          <Link
            href="/new"
            className="flex items-center gap-1.5 text-sm font-semibold bg-[#2465DE] text-white px-4 py-2 rounded-xl hover:bg-[#1B4FB8] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Landing Page
          </Link>
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
