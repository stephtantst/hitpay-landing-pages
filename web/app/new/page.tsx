'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CreatePageForm, type CreatePageFormData } from '@/components/CreatePageForm'
import { GenerationStream } from '@/components/GenerationStream'
import { parseSSEEvents } from '@/lib/sse'

type TokenUsage = {
  input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number
}
type UsageStats = {
  html: TokenUsage; totalCostUsd: number; cacheHit: boolean
}
type LogEntry = {
  type: 'status' | 'error' | 'done' | 'chunk' | 'usage'
  message?: string
  step?: string
  usage?: UsageStats
}

export default function NewPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [generatedPageId, setGeneratedPageId] = useState<string | null>(null)

  const addLog = (entry: LogEntry) => setLogs((l) => [...l, entry])

  const handleSubmit = async (brief: CreatePageFormData) => {
    setLoading(true)
    setLogs([])
    setGeneratedPageId(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Generation failed' }))
        addLog({ type: 'error', message: err.error || 'Generation failed' })
        return
      }

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let donePageId: string | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE blocks (separated by double newline)
        const lastDoubleLF = buffer.lastIndexOf('\n\n')
        if (lastDoubleLF === -1) continue
        const toProcess = buffer.slice(0, lastDoubleLF + 2)
        buffer = buffer.slice(lastDoubleLF + 2)

        for (const { event, data } of parseSSEEvents(toProcess)) {
          try {
            const payload = JSON.parse(data)
            if (event === 'done' && payload.pageId) {
              donePageId = payload.pageId
              setGeneratedPageId(payload.pageId)
              addLog({ type: 'done', message: payload.filename })
            } else if (event === 'error') {
              addLog({ type: 'error', message: payload.message })
            } else if (event === 'usage') {
              addLog({ type: 'usage', usage: payload as UsageStats })
            } else if (event === 'status') {
              addLog({ type: 'status', step: payload.step, message: payload.message })
            } else if (event === 'chunk') {
              addLog({ type: 'chunk', message: payload.text })
            }
          } catch {
            // ignore parse errors on individual events
          }
        }
      }

      // Brief pause so the "done" state + usage panel are visible before navigating away
      if (donePageId) {
        await new Promise((r) => setTimeout(r, 600))
        router.push(`/pages/${donePageId}`)
      }
    } catch (err) {
      addLog({ type: 'error', message: String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-[#61667C] hover:text-[#03102F] transition-colors">← Back</Link>
        <h1 className="text-2xl font-bold text-[#03102F] mt-2">Create New Landing Page</h1>
        <p className="text-[#61667C] mt-1">Fill in the brief — Claude will generate AEO-optimized HTML.</p>
      </div>

      <CreatePageForm initialData={null} onSubmit={handleSubmit} loading={loading} />

      {logs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-[#03102F] mb-2">Generation log</h2>
          <GenerationStream logs={logs} />
        </div>
      )}

      {generatedPageId && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
          <span className="text-sm font-medium text-green-800">Page generated — opening it now…</span>
          <Link
            href={`/pages/${generatedPageId}`}
            className="text-sm font-semibold text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            View page →
          </Link>
        </div>
      )}
    </div>
  )
}
