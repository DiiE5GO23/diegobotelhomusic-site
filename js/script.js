// DIÊGOBOTELHOMUSIC — site global script

// register service worker (static shell caching only)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // footer year, always current — never hardcode
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ---------- cinematic chapter experience (index.html only) ----------
  const chapters = document.querySelectorAll('.chapter');
  const container = document.getElementById('chapters');
  if (chapters.length && container) {
    const dots = document.querySelectorAll('.chapter-progress .dot');
    const counter = document.getElementById('chapter-current');

    // reveal-on-scroll
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.25 });
    document.querySelectorAll('.chapter-reveal').forEach(el => revealObserver.observe(el));

    // progress dots sync
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = Array.from(chapters).indexOf(e.target);
          dots.forEach(d => d.classList.remove('active'));
          if (dots[idx]) dots[idx].classList.add('active');
          if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
        }
      });
    }, { threshold: 0.5, root: container });
    chapters.forEach(ch => chapterObserver.observe(ch));

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        document.getElementById(dot.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // left/right arrow keys move between chapters
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const activeIdx = Array.from(dots).findIndex(d => d.classList.contains('active'));
      const nextIdx = e.key === 'ArrowRight'
        ? Math.min(activeIdx + 1, chapters.length - 1)
        : Math.max(activeIdx - 1, 0);
      chapters[nextIdx]?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------- gallery lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const full = item.dataset.full;
      const alt = item.querySelector('img')?.alt || '';
      if (lightbox && lightboxImg && full) {
        lightboxImg.src = full;
        lightboxImg.alt = alt;
        lightbox.classList.add('open');
      }
    });
  });
  lightboxClose?.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox?.classList.remove('open'); });

  // copy Pix key to clipboard
  const copyPixBtn = document.getElementById('copy-pix');
  if (copyPixBtn) {
    copyPixBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('27992372617');
        const original = copyPixBtn.textContent;
        copyPixBtn.textContent = 'Chave copiada!';
        setTimeout(() => { copyPixBtn.textContent = original; }, 2000);
      } catch (err) {
        alert('Chave Pix: 27992372617');
      }
    });
  }
});
