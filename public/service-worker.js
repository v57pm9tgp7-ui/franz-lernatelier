const CACHE = 'franz-lernatelier-v0-19-learning';
const FILES = [
  './',
  './index.html',
  './assets/app.css',
  './assets/atelier.css?v=20260909-ux14',
  './assets/atelier-navigation.js?v=20260909-ux14',
  './assets/atelier-accessibility.js?v=20260909-ux14',
  './assets/app.js?v=20260909-ux14',
  './data/modules.js?v=20260909-ux14',
  './assets/app.js',
  './assets/cloud-account.js',
  './assets/cloud-sync.js',
  './assets/module-france.css',
  './assets/module-bridge.js?v=20260909-ux14',
  './assets/ui-workspace.css',
  './assets/ui-workspace.js?v=20260909-ux14',
  './assets/ui-typography-v3.css',
  './assets/logo-se-presenter-christoph.png',
  './data/modules.js',
  './module/woche-36/index.html',
  './module/woche-37/index.html',
  './assets/learning-upgrade.css?v=20260909-ux14',
  './assets/practice-studio.css?v=20260909-ux14',
  './assets/practice-studio.js?v=20260909-ux14',
  './assets/week37-learning.js?v=20260909-ux14',
  './assets/listening-profiles.js?v=20260909-ux14',
  './assets/berufe-de-fr.js?v=20260909-ux14',
  './assets/audio/nora.mp3',
  './assets/audio/yanis.mp3',
  './assets/audio/leila.mp3',
  './assets/audio/luca.mp3',
  './manifest.webmanifest'
];

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .then(() => self.skipWaiting())
));

self.addEventListener('activate', event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('franz-lernatelier-') && key !== CACHE).map(key => caches.delete(key))))
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
  if(url.origin !== self.location.origin) return;
  const isInterface = event.request.mode === 'navigate' || /\.(?:html|css|js)$/.test(url.pathname);
  event.respondWith(isInterface ? networkFirst(event.request) : cacheFirst(event.request));
});
