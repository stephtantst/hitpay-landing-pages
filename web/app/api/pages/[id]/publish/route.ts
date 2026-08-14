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

  // Write HTML to repo root (one level up from web/) — only possible when running
  // locally against a real checkout. Deployed serverless functions have a read-only
  // filesystem, so this always fails there; callers should download the HTML and
  // commit it manually instead.
  const repoRoot = path.join(process.cwd(), '..')
  const outputPath = path.join(repoRoot, data.filename)

  // Validate filename to prevent path traversal
  const basename = path.basename(data.filename)
  if (basename !== data.filename || !basename.endsWith('.html')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  try {
    fs.writeFileSync(outputPath, data.html, 'utf-8')
  } catch {
    return NextResponse.json({
      error: 'Publishing directly to the repo isn\'t available in this deployment. Download the HTML from the page detail view and commit it manually instead.',
    }, { status: 501 })
  }

  await supabase
    .from('generated_pages')
    .update({ status: 'published' })
    .eq('id', id)

  return NextResponse.json({ ok: true, path: data.filename })
}
