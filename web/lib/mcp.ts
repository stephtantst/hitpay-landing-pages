const MCP_URL = 'https://hitpay-knowledge-mcp.vercel.app/api/mcp'

interface McpResult {
  content?: Array<{ type: string; text: string }>
  error?: string
}

async function mcpCall(method: string, params: Record<string, unknown>): Promise<string> {
  try {
    const res = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) return `{"error": "MCP returned ${res.status}"}`
    const data = await res.json() as { result?: McpResult }
    const result = data.result
    if (!result) return '{"error": "No result from MCP"}'
    if (result.error) return JSON.stringify({ error: result.error })
    const text = result.content?.find((c) => c.type === 'text')?.text ?? ''
    return text
  } catch {
    return '{"error": "MCP unavailable"}'
  }
}

export async function searchKnowledge(query: string, category = 'all'): Promise<string> {
  return mcpCall('tools/call', {
    name: 'search_knowledge',
    arguments: { query, category, limit: 5 },
  })
}

export async function getChangelog(): Promise<string> {
  return mcpCall('tools/call', { name: 'get_changelog', arguments: { limit: 5 } })
}

export async function enrichBriefContext(vertical: string, rawBrief: string): Promise<string> {
  // Extract first meaningful line from raw brief as secondary search term
  const briefSnippet = rawBrief.split('\n').find((l) => l.trim().length > 10)?.slice(0, 60) ?? vertical

  const [general, specific, changelog] = await Promise.all([
    searchKnowledge(`${vertical} payments`),
    searchKnowledge(briefSnippet),
    getChangelog(),
  ])
  return [
    `### Knowledge: ${vertical} payments\n${general}`,
    `### Knowledge: brief context\n${specific}`,
    `### Recent changelog\n${changelog}`,
  ].join('\n\n')
}
