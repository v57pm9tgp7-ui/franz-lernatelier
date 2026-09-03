const CACHE = 'franz-lernatelier-v0-7';
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

  const isWeek36 = /\/module\/woche-36(?:\/index\.html|\/)?$/.test(url.pathname);
  event.respondWith(isWeek36 ? networkFirst(event.request) : cacheFirst(event.request));
});
