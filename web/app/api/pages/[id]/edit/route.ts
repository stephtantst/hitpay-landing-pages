import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { extractMetaFromHtml } from '@/lib/seo'

// Direct manual save of the HTML — no AI call, no cost. Used by the editable
// HTML source tab on the page detail view. Snapshots the prior version into
// page_revisions first, same as refine, so manual edits show up in — and are
// undoable from — the same version history.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json() as { html?: string }
  const html = body.html

  if (typeof html !== 'string' || !html.trim()) {
    return NextResponse.json({ error: 'html is required' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: current, error: currentErr } = await supabase
    .from('generated_pages')
    .select('html')
    .eq('id', id)
    .single()

  if (currentErr || !current) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 })
  }

  if (current.html === html) {
    return NextResponse.json({ ok: true, unchanged: true })
  }

  const { error: revisionErr } = await supabase.from('page_revisions').insert({
    page_id: id,
    html: current.html,
    instruction: 'Manual edit',
  })
  if (revisionErr) {
    return NextResponse.json({ error: 'Failed to save revision snapshot: ' + revisionErr.message }, { status: 500 })
  }

  const { metaTitle, metaDescription } = extractMetaFromHtml(html)
  const { error: updateErr } = await supabase
    .from('generated_pages')
    .update({ html, meta_title: metaTitle, meta_description: metaDescription, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: 'Failed to save: ' + updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
