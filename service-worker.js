// DIÊGOBOTELHOMUSIC — PWA service worker v2
const CACHE_NAME = 'diegobotelhomusic-v2';
const SHELL_FILES = [
  './','./index.html','./historia.html','./musicas.html','./lancamentos.html','./videos.html','./galeria.html','./redes.html','./contato.html','./privacidade.html','./404.html',
  './manifest.json','./css/style.css','./css/enhancements.css','./js/script.js',
  './assets/images/favicon-192.png','./assets/images/favicon-512.png'
];
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL_FILES).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate', event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));return response;}).catch(()=>caches.match('./index.html'))));
});
