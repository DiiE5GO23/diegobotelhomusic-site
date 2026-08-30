// DIÊGOBOTELHOMUSIC — site global script v5
(() => {
  'use strict';
  const base = './';
  let deferredInstallPrompt = null;

  // PT-BR is always the primary language. English is an optional secondary mode.
  const translations = {
    'Início':'Home','História':'Story','Música':'Music','Lançamentos':'Releases','Vídeos':'Videos','Galeria':'Gallery','Redes':'Socials','Contato':'Contact','Privacidade':'Privacy','Termos':'Terms',
    'Cantor e Compositor':'Singer and Songwriter','Redes oficiais':'Official social media','Discografia':'Discography','Músicas':'Songs','Assista':'Watch','Retratos, capas e artes':'Portraits, covers and artwork',
    'Toque em qualquer imagem para ampliar.':'Tap any image to enlarge.','Todos os links abaixo levam diretamente aos perfis oficiais do artista.':'All links below go directly to the artist’s official profiles.',
    'Todos os lançamentos oficiais, em ordem cronológica.':'All official releases, in chronological order.','Toque direto no player abaixo — sem sair do site — ou abra na plataforma de sua preferência.':'Play directly below without leaving the site, or open it on your preferred platform.',
    'Ouça em todo lugar':'Listen everywhere','Perfil completo do artista':'Full artist profile','Seguir no Spotify':'Follow on Spotify','Seguir na Apple Music':'Follow on Apple Music','Todas as letras no Letras.mus.br':'All lyrics on Letras.mus.br',
    'Também disponível em':'Also available on','Primeira composição':'First composition','Antes de tudo':'Before everything','Leia a história completa →':'Read the full story →','Destaque':'Featured','Em breve':'Coming soon','Single':'Single',
    'Abrir no Spotify':'Open on Spotify','Ver letra no Letras.mus.br':'View lyrics on Letras.mus.br','Abrir perfil':'Open profile','Enviar mensagem direta':'Send direct message',
    'Reels, bastidores e novidades do dia a dia.':'Reels, behind the scenes and daily updates.','Canal oficial — clipes, sets e conteúdo autoral.':'Official channel — music videos, sets and original content.',
    'Catálogo oficial de músicas.':'Official music catalog.','Faixas e demos publicadas.':'Published tracks and demos.','Letras oficiais das músicas publicadas.':'Official lyrics for published songs.',
    'Origem':'Origin','Linha do tempo':'Timeline','Identidade':'Identity','Conversa':'Conversation','História':'Story','Ideia':'Idea','Incentivo':'Encouragement','Novas músicas':'New songs','Novos estilos':'New styles','Nova fase':'New phase',
    'Tudo começou com uma conversa.':'It all started with a conversation.','Quem é Diêgobotelhomusic?':'Who is Diêgobotelhomusic?','De uma conversa real à primeira composição':'From a real conversation to the first composition',
    'Da conversa ao canal':'From conversation to channel','Antes da música':'Before music','Interesse por jogos e conteúdo digital':'Interest in games and digital content','A conversa':'The conversation','Uma história real vira ponto de partida':'A real story becomes the starting point',
    'Experimentação':'Experimentation','Novas músicas, novos gêneros':'New songs, new genres','Inteligência artificial como ferramenta':'Artificial intelligence as a tool','Apoio ao processo, não substituição':'Support for the process, not replacement','Conteúdo musical':'Music content','Expansão para as plataformas':'Expansion to platforms','Projeto atual':'Current project','Uma identidade artística mais organizada':'A more organized artistic identity',
    'Uma identidade, dois identificadores':'One identity, two handles','Fale com':'Talk to','Fale por lá também':'Talk there too','Canal oficial':'Official channel','Perfil oficial':'Official profile','Fechar ✕':'Close ✕',
    'E-mail comercial':'Business email','WhatsApp profissional':'Professional WhatsApp','Falar pelo WhatsApp':'Chat on WhatsApp','Formulário ativo':'Active form','Nome':'Name','Seu e-mail':'Your email','Telefone / WhatsApp':'Phone / WhatsApp','Assunto':'Subject','Mensagem':'Message','Enviar mensagem':'Send message',
    'Composição':'Songwriting','Parcerias':'Partnerships','Publicidade':'Advertising','Shows / apresentações':'Shows / performances','Imprensa':'Press','Outro':'Other','Apoie o trabalho':'Support the work','Contribua via Pix':'Support via Pix','Copiar chave Pix':'Copy Pix key','Abrir link de doação':'Open donation link',
    'Instale o site como aplicativo no Android ou computador.':'Install the site as an app on Android or computer.','Instalar':'Install','Agora não':'Not now','Modo offline — conteúdo disponível em cache':'Offline mode — cached content available','Tema: Auto':'Theme: Auto','Tema: Claro':'Theme: Light','Tema: Escuro':'Theme: Dark',
    'Ouça agora':'Listen now','Discografia':'Discography','Acompanhe a jornada':'Follow the journey','Imagens':'Images','Ver todos os vídeos':'See all videos','Ver galeria completa':'See full gallery','Ver discografia completa':'See full discography','Conhecer a história':'Learn the story','Acompanhar':'Follow','Ler história completa':'Read the full story'
  };
  const reverse = Object.fromEntries(Object.entries(translations).map(([pt,en]) => [en,pt]));

  const pageMeta = {
    'index.html':['Diêgobotelhomusic | Diêgo Botelho','Official website of Diêgo Botelho — singer, songwriter and independent artist. Music, releases, videos, gallery and official social media.'],
    'historia.html':['Diêgo Botelho | Story of Diêgobotelhomusic','The real story behind Diêgobotelhomusic’s first composition and musical journey.'],
    'musicas.html':['Diêgobotelhomusic | Songs and Compositions','Listen to Diêgobotelhomusic songs directly on the official website.'],
    'lancamentos.html':['Diêgobotelhomusic | Releases and Discography','Official Diêgobotelhomusic releases, singles and upcoming music.'],
    'videos.html':['Diêgobotelhomusic | Official Videos','Official videos from Diêgobotelhomusic.'],
    'galeria.html':['Diêgobotelhomusic | Gallery','Official portraits, covers and artwork.'],
    'redes.html':['Diêgobotelhomusic | Official Social Media','Official Diêgobotelhomusic social media and streaming links.'],
    'contato.html':['Diêgobotelhomusic | Contact','Professional contact for songwriting, partnerships, shows, advertising and press.']
  };

  const addCSS = () => {
    if (!document.querySelector('link[data-enhancements]')) {
      const l = document.createElement('link'); l.rel='stylesheet'; l.href=base+'css/enhancements.css'; l.dataset.enhancements='1'; document.head.appendChild(l);
    }
  };
  const registerSW = () => { if ('serviceWorker' in navigator) navigator.serviceWorker.register(base+'service-worker.js').catch(()=>{}); };

  const translateText = (root, dict) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>{ if(n.parentElement?.closest('script,style,textarea,select,option')) return; const raw=n.nodeValue; const value=raw.trim(); if(!value) return; const replacement=dict[value]; if(replacement) n.nodeValue=raw.replace(value,replacement); });
    root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>['placeholder','title','aria-label'].forEach(a=>{const v=el.getAttribute(a); if(v&&dict[v]) el.setAttribute(a,dict[v]);}));
  };

  const applyLanguage = (lang) => {
    const isEN = lang === 'en';
    document.documentElement.lang = isEN ? 'en' : 'pt-BR';
    document.documentElement.dataset.language = isEN ? 'en' : 'pt';
    localStorage.setItem('db-language', isEN ? 'en' : 'pt');
    translateText(document.body, isEN ? translations : reverse);
    const key = location.pathname.split('/').pop() || 'index.html';
    const meta = pageMeta[key];
    if (isEN && meta) { document.title=meta[0]; const d=document.querySelector('meta[name="description"]'); if(d) d.content=meta[1]; }
    document.querySelectorAll('[data-language]').forEach(b=>{ b.textContent=isEN?'PT':'EN'; b.setAttribute('aria-label',isEN?'Voltar para português':'Switch to English'); });
  };

  const injectControls = () => {
    if (!document.querySelector('.offline-note')) { const n=document.createElement('div'); n.className='offline-note'; n.setAttribute('role','status'); n.textContent='Modo offline — conteúdo disponível em cache'; document.body.appendChild(n); }
    if (!document.querySelector('.pwa-install-banner')) { const b=document.createElement('div'); b.className='pwa-install-banner'; b.setAttribute('role','dialog'); b.innerHTML='<div><strong>Leve o Diêgo no seu dispositivo</strong><p>Instale o site como aplicativo no Android ou computador.</p></div><div class="pwa-install-actions"><button class="install-confirm" data-install-app type="button">Instalar</button><button data-dismiss-install type="button">Agora não</button></div>'; document.body.appendChild(b); }
    if (!document.querySelector('[data-language]') && document.querySelector('.nav')) {
      const t=document.createElement('div'); t.className='utility-bar'; t.innerHTML='<button class="theme-toggle" data-theme-toggle type="button">Tema: Escuro</button><button class="language-toggle" data-language type="button">EN</button>'; document.querySelector('.nav').appendChild(t);
    }
  };

  const setTheme = t => { const actual=t==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):t; document.documentElement.dataset.theme=actual; localStorage.setItem('db-theme',t); document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.textContent=t==='auto'?'Tema: Auto':t==='light'?'Tema: Claro':'Tema: Escuro'); };

  const setup = () => {
    addCSS(); injectControls(); setTheme(localStorage.getItem('db-theme')||'dark'); applyLanguage(localStorage.getItem('db-language')||'pt');
    document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{const c=localStorage.getItem('db-theme')||'dark'; setTheme(c==='dark'?'light':c==='light'?'auto':'dark');}));
    document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>applyLanguage(document.documentElement.dataset.language==='en'?'pt':'en')));
    document.querySelectorAll('[data-install-app]').forEach(b=>b.addEventListener('click',async()=>{if(!deferredInstallPrompt){alert('No Chrome/Edge, abra o menu e escolha “Instalar aplicativo” ou “Adicionar à tela inicial”.');return;} deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt=null; document.querySelector('.pwa-install-banner')?.classList.remove('show');}));
    document.querySelectorAll('[data-dismiss-install]').forEach(b=>b.addEventListener('click',()=>b.closest('.pwa-install-banner')?.classList.remove('show')));
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;document.querySelector('.pwa-install-banner')?.classList.add('show');});
    window.addEventListener('appinstalled',()=>document.querySelector('.pwa-install-banner')?.classList.remove('show'));
    const net=()=>document.querySelector('.offline-note')?.classList.toggle('show',!navigator.onLine); addEventListener('online',net); addEventListener('offline',net); net();
  };

  addEventListener('load',registerSW);
  document.addEventListener('DOMContentLoaded',()=>{
    setup();
    const toggle=document.querySelector('.nav-toggle'),links=document.querySelector('.nav-links');
    if(toggle&&links){toggle.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));}
    document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
    const chapters=document.querySelectorAll('.chapter'),container=document.getElementById('chapters');
    if(chapters.length&&container){const dots=document.querySelectorAll('.chapter-progress .dot'),counter=document.getElementById('chapter-current');const rev=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view');}),{threshold:.25});document.querySelectorAll('.chapter-reveal').forEach(e=>rev.observe(e));const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=[...chapters].indexOf(e.target);dots.forEach(d=>d.classList.remove('active'));dots[i]?.classList.add('active');if(counter)counter.textContent=String(i+1).padStart(2,'0');}}),{threshold:.5,root:container});chapters.forEach(c=>obs.observe(c));dots.forEach(d=>d.addEventListener('click',()=>document.getElementById(d.dataset.target)?.scrollIntoView({behavior:'smooth'})));}
    const lb=document.getElementById('lightbox'),im=document.getElementById('lightbox-img'),cl=document.getElementById('lightbox-close');document.querySelectorAll('.gallery-item').forEach(i=>i.addEventListener('click',()=>{if(lb&&im&&i.dataset.full){im.src=i.dataset.full;im.alt=i.querySelector('img')?.alt||'';lb.classList.add('open');}}));cl?.addEventListener('click',()=>lb.classList.remove('open'));lb?.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')lb?.classList.remove('open')});
  });
})();
