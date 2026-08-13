import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET: lightweight revision history (no html — kept small for the list view)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('page_revisions')
    .select('id, instruction, created_at')
    .eq('page_id', id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ revisions: data ?? [] })
}

// POST { restoreId }: restore a previous revision's html.
// The current html is snapshotted first, so restoring is itself undoable.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json() as { restoreId?: string }
  if (!body.restoreId) {
    return NextResponse.json({ error: 'restoreId is required' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: revision, error: revisionErr } = await supabase
    .from('page_revisions')
    .select('id, html, instruction')
    .eq('id', body.restoreId)
    .eq('page_id', id)
    .single()

  if (revisionErr || !revision) {
    return NextResponse.json({ error: 'Revision not found' }, { status: 404 })
  }

  const { data: current, error: currentErr } = await supabase
    .from('generated_pages')
    .select('html')
    .eq('id', id)
    .single()

  if (currentErr || !current) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 })
  }

  const { error: snapshotErr } = await supabase.from('page_revisions').insert({
    page_id: id,
    html: current.html,
    instruction: `Restored to earlier version (before: "${revision.instruction.slice(0, 100)}")`,
  })
  if (snapshotErr) {
    return NextResponse.json({ error: 'Failed to snapshot current version: ' + snapshotErr.message }, { status: 500 })
  }

  const { error: updateErr } = await supabase
    .from('generated_pages')
    .update({ html: revision.html, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: 'Failed to restore: ' + updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, html: revision.html })
}
