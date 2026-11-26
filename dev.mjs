// Minimal dev server: serves this folder, re-renders the pages when a README changes, and reloads
// the browser when a file changes.
// Usage: pnpm install, then pnpm dev (or node dev.mjs [port], default 8080)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './scripts/build.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.argv[2]) || 8080;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};
const reloadScript = '<script>new EventSource("/__reload").onmessage = () => location.reload();</script>';
const clients = new Set();

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (pathname === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  try {
    let file = join(root, decodeURIComponent(pathname));
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');

    const type = types[extname(file)] ?? 'application/octet-stream';
    let body = await readFile(file);
    if (type.startsWith('text/html')) body = body.toString().replace('</body>', reloadScript + '</body>');

    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    // Like Cloudflare Pages: missing paths get 404.html with a 404 status
    const notFound = await readFile(join(root, '404.html')).catch(() => null);
    res.writeHead(404, { 'Content-Type': notFound ? types['.html'] : 'text/plain; charset=utf-8' });
    res.end(notFound ?? 'Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}`));

console.log((await build()).length ? 'Pages re-rendered from the READMEs' : 'Pages up to date');

// A changed README is rebuilt into its page; the page write then triggers the reload
let timer;
const changed = new Set();
watch(root, { recursive: true }, (_event, name) => {
  if (!name || name.startsWith('.git') || name.startsWith('node_modules')) return;
  changed.add(name);
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const names = [...changed];
    changed.clear();
    if (names.some(n => n.endsWith('.md'))) {
      try {
        await build();
      } catch (err) {
        console.error(err);
      }
    }
    if (names.some(n => !n.endsWith('.md'))) clients.forEach(client => client.write('data: reload\n\n'));
  }, 100);
});
