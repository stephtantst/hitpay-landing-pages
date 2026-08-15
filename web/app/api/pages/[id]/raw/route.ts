import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Serves a page's stored HTML directly (no dashboard/tool chrome) — the "View"
// destination for AI-generated pages, mirroring how a static page's "View" opens
// the raw file.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('generated_pages')
    .select('html')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Page not found' }, { status: 404 })

  return new NextResponse(data.html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
