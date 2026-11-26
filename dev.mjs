// Minimal dev server: serves this folder and reloads the browser when a file changes.
// Usage: node dev.mjs [port]   (default 8080)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}`));

let timer;
watch(root, { recursive: true }, (_event, name) => {
  if (!name || name.startsWith('.git')) return;
  clearTimeout(timer);
  timer = setTimeout(() => clients.forEach(client => client.write('data: reload\n\n')), 100);
});
