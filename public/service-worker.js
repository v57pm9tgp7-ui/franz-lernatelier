const CACHE = 'franz-lernatelier-v0-12';
const FILES = [
  './',
  './index.html',
  './assets/app.css',
  './assets/app.js',
  './assets/cloud-account.js',
  './assets/cloud-sync.js',
  './assets/module-france.css',
  './assets/module-bridge.js',
  './assets/ui-workspace.css',
  './assets/ui-workspace.js',
  './data/modules.js',
  './module/woche-36/index.html',
  './module/woche-37/index.html',
  './manifest.webmanifest'
];

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .then(() => self.skipWaiting())
));

self.addEventListener('activate', event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));

async function cacheFirst(request){
  const cached = await caches.match(request);
  if(cached) return cached;
  try{
    const response = await fetch(request);
    if(response && response.ok){
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
  }catch(_error){
    return caches.match('./index.html');
  }
}

async function networkFirst(request){
  try{
    const freshRequest = new Request(request, {cache:'no-store'});
    const response = await fetch(freshRequest);
    if(response && response.ok){
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
  }catch(_error){
    return (await caches.match(request)) || (await caches.match('./index.html'));
  }
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(event.request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  // Wochenmodule werden zuerst frisch vom Netz geladen, damit neue Lernatelier-
  // Inhalte nach einer Veröffentlichung sofort sichtbar sind. Bei Netzproblemen
  // greift weiterhin die Offline-Kopie.
  const isWeekModule = /\/module\/woche-\d+(?:\/index\.html|\/)?$/.test(url.pathname);
  event.respondWith(isWeekModule ? networkFirst(event.request) : cacheFirst(event.request));
});
