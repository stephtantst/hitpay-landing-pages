import { createClient } from '@supabase/supabase-js'

export type Brief = {
  vertical: string
  markets: string[]
  outputFilename: string
  keyProducts: string[]
  rawBrief: string
}

export type GeneratedPage = {
  id: string
  brief_id: string
  created_at: string
  html: string
  filename: string
  figma_frame_id: string | null
  figma_plugin_js: string | null
  mcp_context: Record<string, unknown> | null
  status: 'ready' | 'published'
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
