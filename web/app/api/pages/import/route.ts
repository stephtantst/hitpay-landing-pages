import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { deriveUrlSlug, extractMetaFromHtml, buildFinalUrl } from '@/lib/seo'

// Brings a static repo-root *.html page into the same system used for
// AI-generated pages (generated_pages table), so it gets refine + version
// history like any other page. brief_id stays null — there's no brief,
// this page was written directly.
export async function POST(req: NextRequest) {
  const body = await req.json() as { filename?: string }
  const filename = body.filename ?? ''

  const basename = filename.replace(/^\/+/, '')
  if (!basename || basename !== filename.replace(/^\/+/, '') || basename.includes('/') || !basename.endsWith('.html')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Already imported? Reuse the existing row instead of creating a duplicate.
  const { data: existing } = await supabase
    .from('generated_pages')
    .select('id')
    .eq('filename', basename)
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ id: existing[0].id })
  }

  // Fetch the page's current live HTML via its own public URL — avoids reading
  // the filesystem directly, which doesn't work for a dynamic filename in a
  // deployed serverless function (see web/scripts/sync-content.sh).
  const pageUrl = new URL(`/${basename}`, req.url)
  const pageRes = await fetch(pageUrl)
  if (!pageRes.ok) {
    return NextResponse.json({ error: `Could not find ${basename}` }, { status: 404 })
  }
  const html = await pageRes.text()
  const urlSlug = deriveUrlSlug(basename)
  const { metaTitle, metaDescription } = extractMetaFromHtml(html)

  const { data: inserted, error } = await supabase
    .from('generated_pages')
    .insert({
      brief_id: null,
      html,
      filename: basename,
      status: 'published',
      url_slug: urlSlug,
      meta_title: metaTitle,
      meta_description: metaDescription,
      final_url: buildFinalUrl(urlSlug),
    })
    .select('id')
    .single()

  if (error || !inserted) {
    return NextResponse.json({ error: error?.message ?? 'Import failed' }, { status: 500 })
  }

  return NextResponse.json({ id: inserted.id })
}
