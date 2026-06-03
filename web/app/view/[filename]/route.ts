import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params
  const sanitized = path.basename(filename)

  if (!sanitized.endsWith('.html')) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const filePath = path.join(process.cwd(), '..', sanitized)
    const html = await readFile(filePath, 'utf-8')

    // Rewrite relative asset paths so fonts/CSS load correctly via /assets/
    const rewritten = html
      .replace(/href="assets\//g, 'href="/assets/')
      .replace(/src="assets\//g, 'src="/assets/')

    return new Response(rewritten, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
