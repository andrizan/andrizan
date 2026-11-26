// Pre-render each README into its page, so crawlers and visitors without JavaScript get the full
// content and TOC. Updates the sitemap lastmod of every page whose content changed.
// Usage: pnpm build   (dev.mjs also runs it whenever a .md file changes)
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { Marked } from 'marked';

const root = new URL('..', import.meta.url);
const pages = [
  { md: 'README.md', html: 'index.html', url: 'https://www.andrizan.com/' },
  { md: 'id/README.md', html: 'id/index.html', url: 'https://www.andrizan.com/id/' },
];

// "Databases & Storage" -> "databases-storage"
const slug = text => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

function render(markdown) {
  const toc = [];
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        const id = slug(text);
        if (depth === 2 || depth === 3) {
          toc.push(`<li data-level="${depth}"><a href="#${id}">${inner.replace(/<[^>]*>/g, '')}</a></li>`);
        }
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
    },
  });

  // The profile-views badge belongs to the GitHub profile only
  const tokens = marked.lexer(markdown)
    .filter(t => !(t.type === 'html' && t.raw.includes('komarev.com/ghpvc')));

  // Intro -> <header>, each h2 -> <section>
  const groups = [{ open: '<header>', close: '</header>', tokens: [] }];
  for (const t of tokens) {
    if (t.type === 'heading' && t.depth === 2) {
      groups.push({ open: `<section aria-labelledby="${slug(t.text)}">`, close: '</section>', tokens: [] });
    }
    groups.at(-1).tokens.push(t);
  }
  const content = groups.map(g => `${g.open}\n${marked.parser(g.tokens)}${g.close}`).join('\n');
  return { content, toc: toc.join('\n') };
}

function inject(html, name, value) {
  const eol = html.includes('\r\n') ? '\r\n' : '\n';
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?([ \\t]*<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`Missing <!-- build:${name} --> markers`);
  return html.replace(re, (_, open, close) => open + eol + value.replace(/\r?\n/g, eol) + eol + close);
}

function today() {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(n => String(n).padStart(2, '0')).join('-');
}

export async function build() {
  const changed = [];
  for (const page of pages) {
    const htmlUrl = new URL(page.html, root);
    const before = await readFile(htmlUrl, 'utf8');
    const { content, toc } = render(await readFile(new URL(page.md, root), 'utf8'));
    const after = inject(inject(before, 'content', content), 'toc', toc);
    if (after !== before) {
      await writeFile(htmlUrl, after);
      changed.push(page);
    }
  }

  if (changed.length) {
    const sitemapUrl = new URL('sitemap.xml', root);
    let sitemap = await readFile(sitemapUrl, 'utf8');
    for (const page of changed) {
      const loc = page.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      sitemap = sitemap.replace(new RegExp(`(<loc>${loc}</loc>\\s*<lastmod>)[^<]*(</lastmod>)`), `$1${today()}$2`);
    }
    await writeFile(sitemapUrl, sitemap);
  }
  return changed.map(p => p.html);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const changed = await build();
  console.log(changed.length ? `Rendered: ${changed.join(', ')}` : 'Up to date');
}
