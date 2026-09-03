const CACHE = 'franz-lernatelier-v0-5';
const FILES = [
  './',
  './index.html',
  './assets/app.css',
  './assets/app.js',
  './assets/cloud-account.js',
  './assets/cloud-sync.js',
  './assets/module-france.css',
  './assets/module-bridge.js',
  './assets/mission4-hotfix.js',
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

async function cachedOrNetwork(request){
  const cached = await caches.match(request);
  if(cached) return cached;
  try{
    const response = await fetch(request);
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(request, copy));
    return response;
  }catch(_error){
    return caches.match('./index.html');
  }
}

async function injectMission4Hotfix(response){
  if(!response) return response;
  const html = await response.text();
  if(html.includes('mission4-hotfix.js')){
    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }

  const injected = html.replace(
    '</body>',
    '<script src="../../assets/mission4-hotfix.js"></script>\n</body>'
  );
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');

  return new Response(injected, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(event.request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  const isWeek36 = url.pathname.endsWith('/module/woche-36/index.html') || url.pathname.endsWith('/module/woche-36/');

  event.respondWith((async () => {
    const response = await cachedOrNetwork(event.request);
    return isWeek36 ? injectMission4Hotfix(response) : response;
  })());
});
