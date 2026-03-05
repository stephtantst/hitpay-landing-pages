#!/usr/bin/env node
// HitPay LP local server — serves static files + proxies Anthropic API
// Usage: node server.js
// No npm install needed — uses only built-in Node.js modules

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const PORT = 3001;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // ── Health check ─────────────────────────────────────────────────────────
  if (req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  // ── Anthropic API proxy ──────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/api/messages') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const apiKey = req.headers['x-api-key'] || '';
      if (!apiKey) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'Missing x-api-key header' } }));
        return;
      }

      console.log(`  → proxying to Anthropic (key: ${apiKey.slice(0, 12)}…)`);

      const opts = {
        hostname: 'api.anthropic.com',
        path:     '/v1/messages',
        method:   'POST',
        headers: {
          'Content-Type':      'application/json',
          'Content-Length':    Buffer.byteLength(body),
          'anthropic-version': '2023-06-01',
          'x-api-key':         apiKey,
        },
      };

      const proxy = https.request(opts, upstream => {
        console.log(`  ← Anthropic responded: ${upstream.statusCode}`);
        res.writeHead(upstream.statusCode, {
          'Content-Type': upstream.headers['content-type'] || 'application/json',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        });
        upstream.pipe(res, { end: true });
      });

      proxy.on('error', err => {
        console.error(`  ✗ proxy error: ${err.message}`);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: `Proxy error: ${err.message}` } }));
        }
      });

      proxy.write(body);
      proxy.end();
    });
    return;
  }

  // ── Static file server ───────────────────────────────────────────────────
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(__dirname, urlPath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext  = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });

}).listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ✦ HitPay LP server running');
  console.log(`  → Open http://localhost:${PORT} in your browser`);
  console.log('');
});
