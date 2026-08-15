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

type PatchBody = {
  status?: string
  url_slug?: string | null
  meta_title?: string | null
  meta_description?: string | null
  final_url?: string | null
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json() as PatchBody
  const update: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!PAGE_STATUSES.includes(body.status as typeof PAGE_STATUSES[number])) {
      return NextResponse.json({ error: `status must be one of: ${PAGE_STATUSES.join(', ')}` }, { status: 400 })
    }
    update.status = body.status
  }
  for (const field of ['url_slug', 'meta_title', 'meta_description', 'final_url'] as const) {
    if (body[field] !== undefined) update[field] = body[field]
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No recognized fields to update' }, { status: 400 })
  }
  update.updated_at = new Date().toISOString()

  const supabase = createServerClient()
  const { error } = await supabase
    .from('generated_pages')
    .update(update)
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
