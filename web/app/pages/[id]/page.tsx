'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { GenerationStream } from '@/components/GenerationStream'
import { StatusSelect } from '@/components/StatusSelect'
import { parseSSEEvents } from '@/lib/sse'
import type { PageStatus } from '@/lib/supabase'

type PageDetail = {
  id: string
  filename: string
  status: PageStatus
  created_at: string
  html: string
  figma_plugin_js: string | null
  url_slug: string | null
  meta_title: string | null
  meta_description: string | null
  final_url: string | null
  briefs: {
    vertical: string
    market: string[]
    brief: Record<string, unknown>
  } | null
}

type TokenUsage = {
  input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number
}
type UsageStats = {
  html: TokenUsage; figma: TokenUsage; totalCostUsd: number; cacheHit: boolean
}
type LogEntry = {
  type: 'status' | 'error' | 'done' | 'chunk' | 'usage'
  message?: string
  step?: string
  usage?: UsageStats
}
type Revision = {
  id: string
  instruction: string
  created_at: string
}

function CopyField({
  label,
  value,
  mono,
  href,
  copied,
  onCopy,
}: {
  label: string
  value: string
  mono?: boolean
  href?: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-[#61667C]">{label}</span>
        <button
          onClick={onCopy}
          className="text-[11px] text-[#2465DE] hover:text-[#1B4FB8] font-semibold flex-shrink-0"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs text-[#2465DE] hover:underline break-all ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </a>
      ) : (
        <p className={`text-xs text-[#03102F] break-words ${mono ? 'font-mono' : ''}`}>{value}</p>
      )}
    </div>
  )
}

export default function PageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [page, setPage] = useState<PageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopyField = (field: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField((f) => (f === field ? null : f)), 2000)
  }

  const [refineInstruction, setRefineInstruction] = useState('')
  const [refining, setRefining] = useState(false)
  const [refineLogs, setRefineLogs] = useState<LogEntry[]>([])
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [loadingRevisions, setLoadingRevisions] = useState(true)
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const [panelOpen, setPanelOpen] = useState(true)

  const [editedHtml, setEditedHtml] = useState('')
  const [syncedHtml, setSyncedHtml] = useState<string | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [saveEditError, setSaveEditError] = useState<string | null>(null)

  // Keep the editable draft in sync with the loaded/refined/restored page — resets
  // whenever page.html changes (new load, refine, or restore) so the editor never
  // shows a stale draft. Adjusting state during render (React's recommended pattern
  // for "reset state when a prop changes") rather than in an effect.
  if (page && page.html !== syncedHtml) {
    setSyncedHtml(page.html)
    setEditedHtml(page.html)
  }

  const editDirty = page ? editedHtml !== page.html : false

  // The preview renders via srcDoc, whose document URL is the opaque "about:srcdoc" —
  // a path-only <base href="/"> resolves against that instead of the real origin, so
  // relative asset URLs still 404. Using the full absolute origin fixes it.
  const previewOrigin = typeof window !== 'undefined' ? window.location.origin : ''
  const previewHtml = page
    ? page.html.replace(/<head[^>]*>/i, (match) => `${match}<base href="${previewOrigin}/">`)
    : ''

  // Reusable refetch — safe to call synchronously from event handlers (handleRefine, handleRestore).
  const fetchRevisions = () => {
    setLoadingRevisions(true)
    fetch(`/api/pages/${id}/revisions`)
      .then((r) => r.json())
      .then((data) => setRevisions(data.revisions ?? []))
      .catch(() => {})
      .finally(() => setLoadingRevisions(false))
  }

  useEffect(() => {
    fetch(`/api/pages/${id}`)
      .then((r) => r.json())
      .then((data) => { setPage(data); setLoading(false) })
      .catch(() => setLoading(false))

    // Inline (not fetchRevisions()) — loadingRevisions already starts true, avoids a
    // synchronous setState call in the effect body.
    fetch(`/api/pages/${id}/revisions`)
      .then((r) => r.json())
      .then((data) => setRevisions(data.revisions ?? []))
      .catch(() => {})
      .finally(() => setLoadingRevisions(false))
  }, [id])

  const addRefineLog = (entry: LogEntry) => setRefineLogs((l) => [...l, entry])

  const handleRefine = async () => {
    if (!refineInstruction.trim() || refining) return
    setRefining(true)
    setRefineLogs([])

    try {
      const res = await fetch(`/api/pages/${id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: refineInstruction.trim() }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Refine failed' }))
        addRefineLog({ type: 'error', message: err.error || 'Refine failed' })
        return
      }
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let refinedDone = false

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
            if (event === 'done') {
              refinedDone = true
              addRefineLog({ type: 'done' })
            } else if (event === 'error') {
              addRefineLog({ type: 'error', message: payload.message })
            } else if (event === 'usage') {
              addRefineLog({ type: 'usage', usage: payload as UsageStats })
            } else if (event === 'status') {
              addRefineLog({ type: 'status', step: payload.step, message: payload.message })
            } else if (event === 'chunk') {
              addRefineLog({ type: 'chunk', message: payload.text })
            }
          } catch {
            // ignore parse errors on individual events
          }
        }
      }

      if (refinedDone) {
        setRefineInstruction('')
        const fresh = await fetch(`/api/pages/${id}`).then((r) => r.json())
        setPage(fresh)
        fetchRevisions()
      }
    } catch (err) {
      addRefineLog({ type: 'error', message: String(err) })
    } finally {
      setRefining(false)
    }
  }

  const handleRestore = async (revisionId: string) => {
    setRestoringId(revisionId)
    try {
      const res = await fetch(`/api/pages/${id}/revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restoreId: revisionId }),
      })
      if (res.ok) {
        const data = await res.json()
        setPage((p) => p ? { ...p, html: data.html } : p)
        fetchRevisions()
      }
    } finally {
      setRestoringId(null)
    }
  }

  const handleSaveEdit = async () => {
    setSavingEdit(true)
    setSaveEditError(null)
    try {
      const res = await fetch(`/api/pages/${id}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: editedHtml }),
      })
      if (res.ok) {
        setPage((p) => p ? { ...p, html: editedHtml } : p)
        fetchRevisions()
      } else {
        const err = await res.json().catch(() => ({ error: 'Save failed' }))
        setSaveEditError(err.error || 'Save failed')
      }
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDiscardEdit = () => {
    if (page) setEditedHtml(page.html)
    setSaveEditError(null)
  }

  // Drops an HTML comment at the cursor position — a quick way to leave a note
  // for whoever (e.g. a designer) opens this HTML file next, right next to the
  // section it's about. Falls back to appending at the end if nothing's focused.
  const handleInsertComment = () => {
    const template = '<!-- NOTE:  -->'
    const el = document.getElementById('html-editor') as HTMLTextAreaElement | null
    if (!el) {
      setEditedHtml((prev) => prev + `\n${template}\n`)
      return
    }
    const start = el.selectionStart ?? editedHtml.length
    const end = el.selectionEnd ?? editedHtml.length
    const next = `${editedHtml.slice(0, start)}\n${template}\n${editedHtml.slice(end)}`
    setEditedHtml(next)
    // Restore focus and place the cursor right inside the comment, ready to type
    requestAnimationFrame(() => {
      const cursor = start + 1 + template.indexOf('  ') + 1
      el.focus()
      el.setSelectionRange(cursor, cursor)
    })
  }

  const handlePublish = async () => {
    setPublishing(true)
    setPublishError(null)
    const res = await fetch(`/api/pages/${id}/publish`, { method: 'POST' })
    if (res.ok) {
      setPublished(true)
      setPage((p) => p ? { ...p, status: 'published' } : p)
    } else {
      const err = await res.json().catch(() => ({ error: 'Publish failed' }))
      setPublishError(err.error || 'Publish failed')
    }
    setPublishing(false)
  }

  const handleStatusChange = async (status: PageStatus) => {
    const prevStatus = page?.status
    setPage((p) => p ? { ...p, status } : p)
    const res = await fetch(`/api/pages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok && prevStatus) setPage((p) => p ? { ...p, status: prevStatus } : p)
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
    <div className="h-screen flex flex-col overflow-hidden">

      {/* Header — condensed, full width */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#61667C] hover:text-[#03102F] transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All pages
          </Link>
          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-bold text-[#03102F] capitalize truncate">
              {page.briefs?.vertical ?? page.filename.replace(/\.html$/, '').replace(/-/g, ' ')}
            </h1>
            <span className="text-xs font-mono text-[#61667C] truncate">{page.filename}</span>
            <StatusSelect status={page.status} onChange={handleStatusChange} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#61667C] hover:text-[#03102F] border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-[#F9F9F6] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v16m6-16v16M4 8h4m8 0h4M4 16h4m8 0h4" />
            </svg>
            {panelOpen ? 'Hide panel' : 'Edit'}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing || page.status === 'published'}
            className="px-4 py-1.5 text-sm font-semibold bg-[#2465DE] text-white rounded-xl hover:bg-[#1B4FB8] disabled:opacity-40 transition-colors"
          >
            {publishing ? 'Publishing…' : published ? '✓ Published' : 'Publish to repo'}
          </button>
        </div>
      </div>

      {/* Main — full-page preview + collapsible editing panel */}
      <div className="flex-1 flex overflow-hidden">

        {/* Preview / HTML source — fills all available space */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 px-5 py-3">
          <Tabs defaultValue="preview" className="flex-1 min-h-0">
            <TabsList className="mb-3 bg-white border border-slate-200 rounded-xl p-1 h-auto flex-shrink-0">
              <TabsTrigger value="preview" className="rounded-lg px-4 py-1.5 text-sm font-medium data-[state=active]:bg-[#03102F] data-[state=active]:text-white">
                Preview
              </TabsTrigger>
              <TabsTrigger value="html" className="rounded-lg px-4 py-1.5 text-sm font-medium data-[state=active]:bg-[#03102F] data-[state=active]:text-white">
                HTML source
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="flex flex-col min-h-0">
              <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-white min-h-0">
                <iframe
                  srcDoc={previewHtml}
                  title={page.filename}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </TabsContent>
            <TabsContent value="html" className="flex flex-col min-h-0">
              <div className="flex items-center justify-between gap-3 mb-2 flex-shrink-0">
                <p className="text-xs text-[#61667C]">
                  Edit the HTML directly — drop in <code className="bg-slate-100 px-1 rounded">&lt;!-- NOTE: ... --&gt;</code> comments
                  anywhere for a designer to see when they open this file.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleInsertComment}
                    className="text-xs font-medium text-[#03102F] border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-[#F9F9F6] transition-colors"
                  >
                    + Insert comment
                  </button>
                  {editDirty && (
                    <button
                      onClick={handleDiscardEdit}
                      disabled={savingEdit}
                      className="text-xs font-medium text-[#61667C] hover:text-[#03102F] px-3 py-1.5 transition-colors disabled:opacity-40"
                    >
                      Discard
                    </button>
                  )}
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editDirty || savingEdit}
                    className="text-xs font-semibold bg-[#2465DE] text-white rounded-lg px-3 py-1.5 hover:bg-[#1B4FB8] disabled:opacity-40 transition-colors"
                  >
                    {savingEdit ? 'Saving…' : editDirty ? 'Save changes' : 'Saved'}
                  </button>
                </div>
              </div>
              {saveEditError && <p className="text-xs text-red-500 mb-2 flex-shrink-0">{saveEditError}</p>}
              <Textarea
                id="html-editor"
                value={editedHtml}
                onChange={(e) => setEditedHtml(e.target.value)}
                spellCheck={false}
                className="flex-1 text-xs font-mono text-slate-700 leading-relaxed resize-none min-h-0"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Collapsible editing panel */}
        {panelOpen && (
          <div className="w-[380px] flex-shrink-0 border-l border-slate-200 bg-[#F9F9F6] overflow-y-auto p-4 space-y-4">

            {/* Refine */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-[#03102F] mb-1 text-sm">Refine this page</h3>
              <p className="text-xs text-[#61667C] mb-3">
                Tell Claude what to change — e.g. &ldquo;shorten the hero headline&rdquo;, &ldquo;add a stat about virtual accounts&rdquo;, &ldquo;swap the testimonial for a Malaysia-based merchant&rdquo;. The rest of the page stays as-is.
              </p>
              <Textarea
                value={refineInstruction}
                onChange={(e) => setRefineInstruction(e.target.value)}
                placeholder="What should change?"
                rows={4}
                className="text-sm mb-3"
                disabled={refining}
              />
              <button
                onClick={handleRefine}
                disabled={refining || refineInstruction.trim().length < 3}
                className="w-full text-sm font-semibold bg-[#2465DE] text-white rounded-xl px-4 py-2.5 hover:bg-[#1B4FB8] disabled:opacity-40 transition-colors"
              >
                {refining ? 'Refining…' : 'Refine page'}
              </button>
              {refineLogs.length > 0 && (
                <div className="mt-3">
                  <GenerationStream logs={refineLogs} />
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#03102F] text-sm">Version history</h3>
                {revisions.length > 0 && (
                  <span className="text-xs text-[#61667C]">{revisions.length} revision{revisions.length === 1 ? '' : 's'}</span>
                )}
              </div>
              {loadingRevisions ? (
                <p className="text-xs text-[#61667C]">Loading…</p>
              ) : revisions.length === 0 ? (
                <p className="text-xs text-[#61667C]">No revisions yet — refine the page above to start a history.</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-auto">
                  {revisions.map((rev) => (
                    <li key={rev.id} className="flex items-start justify-between gap-2 text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-[#03102F] truncate" title={rev.instruction}>{rev.instruction}</p>
                        <p className="text-[#61667C] mt-0.5">
                          {new Date(rev.created_at).toLocaleString('en-SG', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRestore(rev.id)}
                        disabled={restoringId === rev.id}
                        className="shrink-0 text-[#2465DE] font-semibold hover:text-[#1B4FB8] disabled:opacity-40 transition-colors"
                      >
                        {restoringId === rev.id ? 'Restoring…' : 'Restore'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
                {publishError && (
                  <p className="text-xs text-red-500 mt-1">{publishError}</p>
                )}
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
              <h3 className="font-semibold text-[#03102F] mb-3 text-sm">SEO &amp; URL</h3>
              <div className="space-y-3">
                <CopyField
                  label="URL slug"
                  value={page.url_slug || '—'}
                  mono
                  copied={copiedField === 'slug'}
                  onCopy={() => handleCopyField('slug', page.url_slug || '')}
                />
                <CopyField
                  label="Meta title"
                  value={page.meta_title || '—'}
                  copied={copiedField === 'title'}
                  onCopy={() => handleCopyField('title', page.meta_title || '')}
                />
                <CopyField
                  label="Meta description"
                  value={page.meta_description || '—'}
                  copied={copiedField === 'description'}
                  onCopy={() => handleCopyField('description', page.meta_description || '')}
                />
                <CopyField
                  label="Final URL"
                  value={page.final_url || '—'}
                  href={page.final_url || undefined}
                  copied={copiedField === 'url'}
                  onCopy={() => handleCopyField('url', page.final_url || '')}
                />
              </div>
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
        )}
      </div>
    </div>
  )
}
