const CACHE = 'franz-lernatelier-v0-33-lerntraining';
const FILES = [
  './module/woche-44/material/Französisch Lerntraining Kurzanleitung.pdf',
  './verbentrainer/training.css',
  './verbentrainer/insights.js',
  './verbentrainer/training.js',
  './module/woche-44/atelier.html',
  './module/woche-44/practice-bank.js',
  './module/woche-44/practice.js',
  './verbentrainer/pdf/Französisch Verben Woche 44.pdf',
  './verbentrainer/pdf/Französisch Verben Übungsheft.pdf',
  './verbentrainer/pdf/Französisch Verben Wochen 43 und 44.pdf',
  './verbentrainer/pdf/Französisch Verben Woche 43.pdf',
  './verbentrainer/pdf/Französisch Verben Lösungen.pdf',
  './module/woche-44/material/Französisch Zahlen Uhrzeiten Meinungen Lösungen.pdf',
  './module/woche-44/material/Französisch Zahlen Uhrzeiten Meinungen Übungsheft.pdf',

  './module/woche-44/material/Französisch Woche 44 Zahlenkarten.pdf',
  './module/woche-44/material/Französisch Woche 44 Plakatvorlage A3.pdf',
  './module/woche-44/material/Französisch Woche 44 Reserve.pdf',
  './module/woche-44/material/Französisch Woche 44 Lernplan zu Hause.pdf',

  './module/woche-44/material/Französisch Woche 44 Lösungen.pdf',
  './module/woche-44/material/Französisch Woche 44 Lernmaterialien.pdf',
  './module/woche-44/material/Französisch Woche 44 Rollenkarten.pdf',
  './verbentrainer/engine.js',
  './module/woche-44/assets/BFF.png',
  './module/woche-44/reserve.html',
  './module/woche-44/maison.html',
  './module/woche-44/ui.js',
  './module/woche-44/accueil.js',
  './module/woche-44/assets/Un après midi.jpg',
  './assets/app.js?v=20261027-44',
  "./module/woche-44/index.html",
  "./module/woche-44/style.css",
  "./module/woche-44/partenaire.html",
  "./module/woche-44/plan.html",
  "./module/woche-44/parler.html",
  "./module/woche-44/nombres.html",
  "./module/woche-44/heure.html",
  "./module/woche-44/mini.html",
  "./module/woche-44/mini.js",
  "./module/woche-44/mission.js",
  "./module/woche-44/exercices.js",
  "./module/woche-44/cartes.html",
  "./verbentrainer/index.html",
  "./verbentrainer/data.js",
  "./verbentrainer/trainer.js",
  "./data/modules.js?v=20261027-44",

  './',
  './index.html',
  './pruefungsvorbereitung/index.html',
  './pruefungsvorbereitung/app.css?v=1',
  './pruefungsvorbereitung/app.js?v=1',
  './assets/week42-data.js?v=20261013-w43fix28',
  './assets/week42-goals.js?v=20261013-w43fix28',
  './assets/week42-coach.js?v=20261013-plan80',
  './assets/week42-program.js?v=20261013-plan80',
  './assets/week42-program.css?v=20261013-plan80',
  './assets/week42.js?v=20261013-plan80',
  './assets/week42.css?v=20261013-w43fix28',
  './assets/week42-ux.css?v=20261013-plan80',
  './assets/retour.jpg',
  './data/modules.js?v=20261013-w43fix28',
  './module/woche-42/index.html',
  './module/woche-42/Carnet de parole Woche 42.pdf',
  './module/woche-42/carnet.html',
  './module/woche-42/Prüfungsstoff Woche 43 28 Einträge.pdf',
  './module/woche-42/proben/index.html',
  './module/woche-42/proben/loesungen.html',
  './module/woche-42/proben/proben.css',
  './module/woche-42/proben/Probelernkontrolle 1 ausfüllbar.pdf',
  './module/woche-42/proben/Lösungen Probelernkontrolle 1.pdf',
  './module/woche-42/proben/Probelernkontrolle 2 ausfüllbar.pdf',
  './module/woche-42/proben/Lösungen Probelernkontrolle 2.pdf',
  './module/woche-42/proben/Probelernkontrolle 3 ausfüllbar.pdf',
  './module/woche-42/proben/Lösungen Probelernkontrolle 3.pdf',
  './data/topic-vocabulary.js',
  './assets/app.css',
  './assets/atelier.css?v=20260909-ux14',
  './assets/atelier-navigation.js?v=20260909-ux14',
  './assets/atelier-navigation.js?v=20260917-w38nav1',
  './assets/atelier-accessibility.js?v=20260909-ux14',
  './assets/atelier-accessibility.js?v=20260917-card12',
  './assets/week37-card-print-upgrade.js?v=20260917-card12',
  './assets/teams-video-guide.js?v=20260916-teams1',
  './assets/week38-home.js?v=20260913-w38-1',
  './assets/week38-home.js?v=20260917-w38-2',
  './assets/week38-module.js?v=20260917-w38-8',
  './assets/topic-training.js?v=20260913-topic2',
  './assets/topic-training-module.js?v=20260913-topic1',
  './assets/practice-vocab-config.js?v=20260913-teacher1',
  './assets/app.js?v=20260909-ux14',
  './data/modules.js?v=20260909-ux14',
  './assets/app.js',
  './assets/cloud-account.js',
  './assets/cloud-sync.js',
  './assets/module-france.css',
  './assets/module-bridge.js?v=20260909-ux14',
  './assets/ui-workspace.css',
  './assets/ui-workspace.js?v=20260909-ux14',
  './assets/ui-typography-v3.css?v=20260910-type31',
  './assets/logo-se-presenter-christoph.png',
  './data/modules.js',
  './module/woche-36/index.html',
  './module/woche-37/index.html',
  './module/woche-38/index.html',
  './assets/learning-upgrade.css?v=20260909-ux14',
  './assets/practice-studio.css?v=20260909-ux14',
  './assets/practice-studio.js?v=20260910-connectors',
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
    .then(cache => Promise.all(FILES.map(file => cache.add(file).catch(() => null))))
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
  if(event.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/lehrperson/')) return;
  if(url.origin !== self.location.origin) return;
  const isInterface = event.request.mode === 'navigate' || /\.(?:html|css|js)$/.test(url.pathname);
  event.respondWith(isInterface ? networkFirst(event.request) : cacheFirst(event.request));
});


