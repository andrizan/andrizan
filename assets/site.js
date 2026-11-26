async function loadMarkdown() {
  const contentEl = document.getElementById('content');
  try {
    // Each page names its own markdown and error message, so this script stays language-neutral
    const res = await fetch(contentEl.dataset.src);
    if (!res.ok) throw new Error('Failed to load README (' + res.status + ')');
    const mdText = await res.text();
    // Parse into an inert template so the profile-views badge is dropped before it loads
    const tpl = document.createElement('template');
    tpl.innerHTML = marked.parse(mdText);
    const badge = tpl.content.querySelector('img[src^="https://komarev.com/ghpvc/"]');
    (badge?.closest('p') || badge)?.remove();
    contentEl.replaceChildren(tpl.content);
    assignIds();
    structure(contentEl);
    buildToc();
    trackActiveSection();
  } catch (err) {
    contentEl.replaceChildren(document.getElementById('load-error').content.cloneNode(true));
    console.error(err);
  } finally {
    contentEl.removeAttribute('aria-busy');
  }
}

function assignIds() {
  document.querySelectorAll('#content h1, #content h2, #content h3').forEach(h => {
    h.id = h.textContent.trim().toLowerCase().replace(/\s+/g, '-');
  });
}

// Wrap rendered markdown: intro -> <header>, each h2 -> <section>
function structure(root) {
  const header = document.createElement('header');
  const frag = document.createDocumentFragment();
  frag.append(header);
  let section = null;

  for (const el of [...root.children]) {
    if (el.tagName === 'H2') {
      section = document.createElement('section');
      section.setAttribute('aria-labelledby', el.id);
      frag.append(section);
    }
    (section || header).append(el);
  }
  root.replaceChildren(frag);
}

function buildToc() {
  const headings = document.querySelectorAll('#content h2, #content h3');
  const tocUl = document.querySelector('#toc ul');
  tocUl.innerHTML = "";

  headings.forEach(h => {
    const li = document.createElement('li');
    li.dataset.level = h.tagName[1];
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    tocUl.appendChild(li);
  });
}

// Mark the TOC link of the section being read with aria-current
function trackActiveSection() {
  const root = document.documentElement;
  const headings = [...document.querySelectorAll('#content h2, #content h3')];
  const tocList = document.getElementById('toc-list');
  const links = new Map([...tocList.querySelectorAll('a')].map(a => [a.getAttribute('href').slice(1), a]));
  let current = null, lockUntil = 0, queued = false;

  function setCurrent(id) {
    if (id === current) return;
    current = id;
    links.forEach((a, key) => {
      if (key === id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  function update() {
    queued = false;
    if (performance.now() < lockUntil) return;
    const rem = parseFloat(getComputedStyle(root).fontSize);
    const vh = window.innerHeight;
    const top = (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0) + 3 * rem;
    // Headings near the page end can't reach the top line, so over the last
    // half viewport of scrolling the line moves down to the viewport bottom
    const max = root.scrollHeight - vh;
    const ramp = max > 0 ? Math.min(1, Math.max(0, 1 - (max - window.scrollY) / (vh / 2))) : 0;
    const line = top + ramp * (vh - top);
    let active = null;
    for (const h of headings) {
      if (h.getBoundingClientRect().top > line) break;
      active = h;
    }
    setCurrent(active && active.id);
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  // A clicked link stays current while the page scrolls to its section
  tocList.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    setCurrent(a.getAttribute('href').slice(1));
    lockUntil = performance.now() + 1200;
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
}

// Toggle for mobile
function setTocCollapsed(collapsed) {
  const toc = document.getElementById('toc');
  toc.classList.toggle('collapsed', collapsed);
  toc.querySelector('button').setAttribute('aria-expanded', String(!collapsed));
}

const tocEl = document.getElementById('toc');
tocEl.querySelector('button').addEventListener('click', () => {
  setTocCollapsed(!tocEl.classList.contains('collapsed'));
});
tocEl.querySelector('ul').addEventListener('click', e => {
  if (e.target.closest('a')) setTocCollapsed(true);
});

window.addEventListener('DOMContentLoaded', loadMarkdown);
