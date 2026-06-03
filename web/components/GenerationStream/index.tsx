'use client'

import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'

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

const STEP_ICONS: Record<string, string> = {
  saving: '💾', mcp: '🔍', generating: '✍️', figma: '🎨', saving_page: '📦',
}

function fmt(n: number) { return n.toLocaleString() }
function usd(n: number) { return `$${n.toFixed(4)}` }

function UsagePanel({ usage }: { usage: UsageStats }) {
  const { html, figma, totalCostUsd, cacheHit } = usage
  return (
    <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Token usage & cost</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div className="text-slate-500">HTML (Sonnet 4.6)</div>
        <div className="text-green-300 text-right">{usd(html.costUsd)}</div>

        <div className="text-slate-600 pl-2">› input</div>
        <div className="text-slate-400 text-right">{fmt(html.input)} tok</div>

        <div className="text-slate-600 pl-2">› output</div>
        <div className="text-slate-400 text-right">{fmt(html.output)} tok</div>

        {html.cacheRead > 0 && (
          <>
            <div className="text-slate-600 pl-2">› cache read ⚡</div>
            <div className="text-blue-400 text-right">{fmt(html.cacheRead)} tok saved</div>
          </>
        )}
        {html.cacheWrite > 0 && (
          <>
            <div className="text-slate-600 pl-2">› cache write</div>
            <div className="text-slate-400 text-right">{fmt(html.cacheWrite)} tok</div>
          </>
        )}

        <div className="text-slate-500 mt-1">Figma JS (Haiku 4.5)</div>
        <div className="text-green-300 text-right mt-1">{usd(figma.costUsd)}</div>

        <div className="text-slate-600 pl-2">› input + output</div>
        <div className="text-slate-400 text-right">{fmt(figma.input + figma.output)} tok</div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">Total</span>
          {cacheHit && (
            <span className="text-xs bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded">
              ⚡ cache hit
            </span>
          )}
        </div>
        <span className="text-white font-semibold text-sm">{usd(totalCostUsd)}</span>
      </div>
    </div>
  )
}

export function GenerationStream({ logs }: { logs: LogEntry[] }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  const visibleLogs = logs.filter((l) => l.type !== 'chunk')
  const charCount = logs
    .filter((l) => l.type === 'chunk')
    .reduce((acc, l) => acc + (l.message?.length ?? 0), 0)
  const usageLog = logs.find((l) => l.type === 'usage')

  return (
    <Card className="p-4 bg-[#03102F] text-green-400 font-mono text-xs overflow-auto max-h-96">
      {visibleLogs.map((log, i) => {
        if (log.type === 'usage') return null
        return (
          <div key={i} className={`mb-1 ${
            log.type === 'error'
              ? 'text-red-400'
              : log.type === 'done'
              ? 'text-green-300 font-semibold'
              : 'text-green-400'
          }`}>
            {log.type === 'status' && `${STEP_ICONS[log.step ?? ''] ?? '›'} ${log.message}`}
            {log.type === 'error'  && `✖ ERROR: ${log.message}`}
            {log.type === 'done'   && `✔ Done`}
          </div>
        )
      })}
      {charCount > 0 && (
        <div className="text-slate-500 mb-1">
          › Streaming HTML… {charCount.toLocaleString()} chars
        </div>
      )}
      {usageLog?.usage && <UsagePanel usage={usageLog.usage} />}
      <div ref={endRef} />
    </Card>
  )
}
