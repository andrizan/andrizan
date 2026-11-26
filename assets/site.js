// Content and TOC are pre-rendered by scripts/build.mjs; this script only enhances them.

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

trackActiveSection();
