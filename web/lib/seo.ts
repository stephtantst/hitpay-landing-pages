// Derives the SEO/tracking fields the growth team keeps in the "Website SEO_AEO"
// spreadsheet (URL Slug, Meta Title, Meta Description, Final URL) straight from a
// generated page — no separate LLM call needed, since GENERATOR-PROMPT.md already
// mandates <title>/<meta name="description"> on every generated page.

const SITE_ROOT = 'https://hitpayapp.com'

export function deriveUrlSlug(filename: string): string {
  return '/' + filename.replace(/\.html$/, '')
}

export function buildFinalUrl(slug: string): string {
  return `${SITE_ROOT}${slug}`
}

const HTML_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", '#8217': '’', '#8211': '–', '#8212': '—',
}

function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#\d+|[a-z]+);/gi, (match, entity) => HTML_ENTITIES[entity.toLowerCase()] ?? match)
}

export function extractMetaFromHtml(html: string): { metaTitle: string | null; metaDescription: string | null } {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i)
  const descMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i)

  return {
    metaTitle: titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : null,
    metaDescription: descMatch ? decodeHtmlEntities(descMatch[1].trim().replace(/\s+/g, ' ')) : null,
  }
}
