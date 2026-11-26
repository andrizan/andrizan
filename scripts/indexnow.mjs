// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver; DuckDuckGo follows Bing) that the
// sitemap URLs changed. Run it after the deploy is live: pnpm indexnow
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const host = 'www.andrizan.com';
const timeout = () => AbortSignal.timeout(15000);

// The key file is public by design: engines fetch it to prove we own the host
const keyFile = (await readdir(root)).find(f => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('IndexNow key file (<32 hex chars>.txt) not found in the repo root');
const key = (await readFile(new URL(keyFile, root), 'utf8')).trim();
const keyLocation = `https://${host}/${keyFile}`;

const live = await fetch(keyLocation, { signal: timeout() }).then(r => (r.ok ? r.text() : ''));
if (live.trim() !== key) {
  console.error(`${keyLocation} does not serve the key yet. Deploy first, then run this again.`);
  process.exit(1);
}

const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
  signal: timeout(),
});
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s): ${urlList.join(', ')}`);
if (!res.ok) process.exit(1);
