import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('generated_pages')
    .select('figma_plugin_js, filename')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS })
  if (!data.figma_plugin_js) return NextResponse.json({ error: 'No Figma code generated' }, { status: 404, headers: CORS })

  return NextResponse.json({ js: data.figma_plugin_js, filename: data.filename }, { headers: CORS })
}
