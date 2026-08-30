// DIÊGOBOTELHOMUSIC — site global script v2
(() => {
  'use strict';

  // PWA service worker
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));

  let deferredInstallPrompt = null;

  function setTheme(theme) {
    const root = document.documentElement;
    const resolved = theme === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : theme;
    root.dataset.theme = resolved;
    localStorage.setItem('db-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(b => b.textContent = theme === 'auto' ? 'Tema: Auto' : theme === 'light' ? 'Tema: Claro' : 'Tema: Escuro');
  }

  function setupEnhancements() {
    const savedTheme = localStorage.getItem('db-theme') || 'dark';
    setTheme(savedTheme);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
      const current = localStorage.getItem('db-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark');
    }));

    document.querySelectorAll('[data-install-app]').forEach(button => button.addEventListener('click', async () => {
      if (!deferredInstallPrompt) { alert('Se a instalação não aparecer automaticamente, abra o menu do navegador e escolha “Instalar aplicativo” ou “Adicionar à tela inicial”.'); return; }
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      document.querySelectorAll('.pwa-install-banner').forEach(el => el.classList.remove('show'));
    }));

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault(); deferredInstallPrompt = event;
      document.querySelectorAll('.pwa-install-banner').forEach(el => el.classList.add('show'));
    });
    window.addEventListener('appinstalled', () => document.querySelectorAll('.pwa-install-banner').forEach(el => el.classList.remove('show')));

    const offline = document.querySelector('.offline-note');
    const updateNetwork = () => offline?.classList.toggle('show', !navigator.onLine);
    window.addEventListener('online', updateNetwork); window.addEventListener('offline', updateNetwork); updateNetwork();

    // language shortcut: preserves current page while adding a visible language preference
    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
      const lang = button.dataset.language; localStorage.setItem('db-language', lang);
      document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
      alert(lang === 'en' ? 'Versão em inglês preparada. As páginas serão traduzidas progressivamente.' : 'Idioma definido como Português.');
    }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupEnhancements();
    const toggle = document.querySelector('.nav-toggle'), links = document.querySelector('.nav-links');
    if (toggle && links) { toggle.addEventListener('click', () => { const open=links.classList.toggle('open'); toggle.setAttribute('aria-expanded', open?'true':'false'); }); links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open'))); }
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

    const chapters=document.querySelectorAll('.chapter'), container=document.getElementById('chapters');
    if(chapters.length&&container){
      const dots=document.querySelectorAll('.chapter-progress .dot'), counter=document.getElementById('chapter-current');
      const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view');}),{threshold:.25});
      document.querySelectorAll('.chapter-reveal').forEach(el=>revealObserver.observe(el));
      const chapterObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const idx=[...chapters].indexOf(e.target);dots.forEach(d=>d.classList.remove('active'));if(dots[idx])dots[idx].classList.add('active');if(counter)counter.textContent=String(idx+1).padStart(2,'0');}}),{threshold:.5,root:container});
      chapters.forEach(ch=>chapterObserver.observe(ch)); dots.forEach(dot=>dot.addEventListener('click',()=>document.getElementById(dot.dataset.target)?.scrollIntoView({behavior:'smooth'})));
      document.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;const i=[...dots].findIndex(d=>d.classList.contains('active'));chapters[Math.max(0,Math.min(chapters.length-1,i+(e.key==='ArrowRight'?1:-1)))]?.scrollIntoView({behavior:'smooth'});});
    }

    const lightbox=document.getElementById('lightbox'), lightboxImg=document.getElementById('lightbox-img'), close=document.getElementById('lightbox-close');
    document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{const full=item.dataset.full,alt=item.querySelector('img')?.alt||'';if(lightbox&&lightboxImg&&full){lightboxImg.src=full;lightboxImg.alt=alt;lightbox.classList.add('open');}}));
    close?.addEventListener('click',()=>lightbox.classList.remove('open')); lightbox?.addEventListener('click',e=>{if(e.target===lightbox)lightbox.classList.remove('open')}); document.addEventListener('keydown',e=>{if(e.key==='Escape')lightbox?.classList.remove('open')});

    const copyPixBtn=document.getElementById('copy-pix');
    if(copyPixBtn)copyPixBtn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('27992372617');const original=copyPixBtn.textContent;copyPixBtn.textContent='Chave copiada!';setTimeout(()=>copyPixBtn.textContent=original,2000);}catch{alert('Chave Pix: 27992372617');}});
  });
})();
