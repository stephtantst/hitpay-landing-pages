// Push a generated HTML file directly to Supabase so it shows in the web UI
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8')
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim()
const SERVICE_KEY  = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()

const filename = process.argv[2] || 'healthcare.html'
const vertical = process.argv[3] || path.basename(filename, '.html')

const html = fs.readFileSync(path.join(ROOT, filename), 'utf-8')

const headers = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Prefer': 'return=representation',
}

// 1. Insert brief
const briefRes = await fetch(`${SUPABASE_URL}/rest/v1/briefs`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    vertical,
    market: ['SG', 'MY', 'PH'],
    brief: { vertical, markets: ['SG', 'MY', 'PH'], rawBrief: `Direct push: ${filename}`, outputFilename: filename },
    status: 'done',
  }),
})
const [brief] = await briefRes.json()
console.log('Brief inserted:', brief.id)

// 2. Insert generated page
const pageRes = await fetch(`${SUPABASE_URL}/rest/v1/generated_pages`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    brief_id: brief.id,
    html,
    filename,
    figma_plugin_js: null,
    mcp_context: null,
    status: 'ready',
  }),
})
const [page] = await pageRes.json()
console.log('Page inserted:', page.id)
console.log(`\nView at: http://localhost:3000/pages/${page.id}`)
