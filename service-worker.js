// DIÊGOBOTELHOMUSIC — service worker
// Caches only the static shell (HTML/CSS/JS/local images) so repeat visits load faster.
// Does NOT cache Spotify/YouTube/Instagram/TikTok embeds — those always need a live connection,
// and this worker never pretends otherwise.

const CACHE_NAME = 'diegobotelhomusic-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './historia.html',
  './musicas.html',
  './lancamentos.html',
  './videos.html',
  './galeria.html',
  './redes.html',
  './contato.html',
  './css/style.css',
  './js/script.js',
  './assets/images/favicon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests for the shell; let everything else (embeds, APIs) pass through normally.
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
