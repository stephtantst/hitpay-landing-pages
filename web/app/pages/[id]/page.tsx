'use client'

import { useEffect, useState, use } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type PageDetail = {
  id: string
  filename: string
  status: 'ready' | 'published'
  created_at: string
  html: string
  figma_plugin_js: string | null
  briefs: {
    vertical: string
    market: string[]
    brief: Record<string, unknown>
  } | null
}

export default function PageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [page, setPage] = useState<PageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/pages/${id}`)
      .then((r) => r.json())
      .then((data) => { setPage(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handlePublish = async () => {
    setPublishing(true)
    const res = await fetch(`/api/pages/${id}/publish`, { method: 'POST' })
    if (res.ok) {
      setPublished(true)
      setPage((p) => p ? { ...p, status: 'published' } : p)
    }
    setPublishing(false)
  }

  const handleCopyFigmaJs = async () => {
    if (!page?.figma_plugin_js) return
    await navigator.clipboard.writeText(page.figma_plugin_js)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-[#61667C]">Loading…</span>
    </div>
  )
  if (!page) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-red-500">Page not found.</span>
    </div>
  )

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#61667C] hover:text-[#03102F] transition-colors mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All pages
            </a>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-[#2465DE] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="font-semibold text-sm text-[#61667C]">HitPay</span>
            </div>
            <h1 className="text-2xl font-bold text-[#03102F] capitalize">
              {page.briefs?.vertical ?? 'Landing page'}
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-mono text-[#61667C]">{page.filename}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-[#EBF1FC] text-[#2465DE]'
              }`}>
                {page.status}
              </span>
              {(page.briefs?.market ?? []).length > 0 && (
                <span className="text-xs text-[#61667C]">{(page.briefs?.market ?? []).join(', ')}</span>
              )}
            </div>
          </div>
          <button
            onClick={handlePublish}
            disabled={publishing || page.status === 'published'}
            className="shrink-0 px-4 py-2 text-sm font-semibold bg-[#2465DE] text-white rounded-xl hover:bg-[#1B4FB8] disabled:opacity-40 transition-colors"
          >
            {publishing ? 'Publishing…' : published ? '✓ Published' : 'Publish to repo'}
          </button>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-3 gap-5">

          {/* Preview — 2/3 width */}
          <div className="col-span-2">
            <Tabs defaultValue="preview">
              <TabsList className="mb-3 bg-white border border-slate-200 rounded-xl p-1 h-auto">
                <TabsTrigger value="preview" className="rounded-lg px-4 py-1.5 text-sm font-medium data-[state=active]:bg-[#03102F] data-[state=active]:text-white">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="html" className="rounded-lg px-4 py-1.5 text-sm font-medium data-[state=active]:bg-[#03102F] data-[state=active]:text-white">
                  HTML source
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white" style={{ height: '75vh' }}>
                  <iframe
                    srcDoc={page.html}
                    title={page.filename}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </TabsContent>
              <TabsContent value="html">
                <div className="rounded-2xl overflow-auto border border-slate-200 bg-white p-4" style={{ height: '75vh' }}>
                  <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap break-words">
                    {page.html}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Actions — 1/3 width */}
          <div className="space-y-4">

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-[#03102F] mb-3 text-sm">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const blob = new Blob([page.html], { type: 'text/html' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url; a.download = page.filename; a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="w-full text-sm font-medium text-[#03102F] border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-[#F9F9F6] transition-colors text-left"
                >
                  ↓ Download HTML
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(page.html)}
                  className="w-full text-sm font-medium text-[#03102F] border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-[#F9F9F6] transition-colors text-left"
                >
                  Copy HTML
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing || page.status === 'published'}
                  className="w-full text-sm font-semibold bg-[#2465DE] text-white rounded-xl px-4 py-2.5 hover:bg-[#1B4FB8] disabled:opacity-40 transition-colors text-left"
                >
                  {page.status === 'published' ? '✓ Published to repo' : 'Publish to repo root'}
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-[#03102F] mb-1 text-sm">Push to Figma</h3>
              <p className="text-xs text-[#61667C] mb-3">
                Copy this code, then run it in the HitPay Figma plugin (Plugins → Development → Run) to create the frame.
              </p>
              {page.figma_plugin_js ? (
                <>
                  <div className="rounded-xl bg-[#03102F] p-3 mb-3 overflow-auto max-h-40">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                      {page.figma_plugin_js.slice(0, 500)}
                      {page.figma_plugin_js.length > 500 && '\n…'}
                    </pre>
                  </div>
                  <button
                    onClick={handleCopyFigmaJs}
                    className="w-full text-sm font-semibold text-white bg-[#03102F] rounded-xl px-4 py-2.5 hover:bg-slate-800 transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy plugin code'}
                  </button>
                </>
              ) : (
                <p className="text-xs text-[#61667C]">No Figma code generated.</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-[#03102F] mb-3 text-sm">Page info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#61667C]">Created</dt>
                  <dd className="text-[#03102F] font-medium">{new Date(page.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#61667C]">HTML size</dt>
                  <dd className="text-[#03102F] font-medium">{Math.round(page.html.length / 1024)} kb</dd>
                </div>
                {(page.briefs?.market ?? []).length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[#61667C]">Markets</dt>
                    <dd className="text-[#03102F] font-medium">{(page.briefs?.market ?? []).join(', ')}</dd>
                  </div>
                )}
              </dl>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
