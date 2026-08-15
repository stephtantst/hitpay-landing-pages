import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, PAGE_STATUSES } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('generated_pages')
    .select('*, briefs(*)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json() as { status?: string }

  if (!body.status || !PAGE_STATUSES.includes(body.status as typeof PAGE_STATUSES[number])) {
    return NextResponse.json({ error: `status must be one of: ${PAGE_STATUSES.join(', ')}` }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase
    .from('generated_pages')
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()
  const { error } = await supabase.from('generated_pages').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
