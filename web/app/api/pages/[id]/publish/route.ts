import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('generated_pages')
    .select('html, filename')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Page not found' }, { status: 404 })

  // Write HTML to repo root (one level up from web/)
  const repoRoot = path.join(process.cwd(), '..')
  const outputPath = path.join(repoRoot, data.filename)

  // Validate filename to prevent path traversal
  const basename = path.basename(data.filename)
  if (basename !== data.filename || !basename.endsWith('.html')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  fs.writeFileSync(outputPath, data.html, 'utf-8')

  await supabase
    .from('generated_pages')
    .update({ status: 'published' })
    .eq('id', id)

  return NextResponse.json({ ok: true, path: data.filename })
}
