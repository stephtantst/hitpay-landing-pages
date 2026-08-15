import { createClient } from '@supabase/supabase-js'

export type Brief = {
  vertical: string
  markets: string[]
  outputFilename: string
  keyProducts: string[]
  rawBrief: string
}

export type PageStatus = 'draft' | 'design' | 'web_dev' | 'published'

export const PAGE_STATUSES: PageStatus[] = ['draft', 'design', 'web_dev', 'published']

export const PAGE_STATUS_LABELS: Record<PageStatus, string> = {
  draft: 'Draft',
  design: 'Design',
  web_dev: 'Web Dev',
  published: 'Published',
}

export type GeneratedPage = {
  id: string
  brief_id: string
  created_at: string
  html: string
  filename: string
  mcp_context: Record<string, unknown> | null
  status: PageStatus
  url_slug: string | null
  meta_title: string | null
  meta_description: string | null
  final_url: string | null
}

export type BriefRow = {
  id: string
  created_at: string
  created_by: string | null
  vertical: string
  market: string[]
  brief: Brief
  status: 'draft' | 'generating' | 'done' | 'error'
}

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
