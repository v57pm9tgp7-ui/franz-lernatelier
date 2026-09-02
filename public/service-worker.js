const CACHE = 'franz-lernatelier-v0-4';
const FILES = [
  './',
  './index.html',
  './assets/app.css',
  './assets/app.js',
  './assets/cloud-account.js',
  './assets/cloud-sync.js',
  './assets/module-france.css',
  './assets/module-bridge.js',
  './data/modules.js',
  './module/woche-36/index.html',
  './manifest.webmanifest'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(event.request.method !== 'GET' || url.pathname.startsWith('/api/')) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
