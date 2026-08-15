'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PAGE_STATUSES, PAGE_STATUS_LABELS, type PageStatus } from '@/lib/supabase'

const STATUS_STYLES: Record<PageStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  design: 'bg-violet-50 text-violet-700',
  web_dev: 'bg-amber-50 text-amber-700',
  published: 'bg-green-100 text-green-700',
}

export function StatusSelect({
  status,
  onChange,
  disabled,
}: {
  status: PageStatus
  onChange: (status: PageStatus) => void
  disabled?: boolean
}) {
  return (
    <Select
      value={status}
      onValueChange={(v) => onChange(v as PageStatus)}
      disabled={disabled}
    >
      <SelectTrigger
        size="sm"
        className={`h-auto rounded-full border-none py-0.5 pl-2.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
      >
        <SelectValue>{PAGE_STATUS_LABELS[status]}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        {PAGE_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>{PAGE_STATUS_LABELS[s]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
