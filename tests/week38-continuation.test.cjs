const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Woche 38 ist aktuell und übernimmt denselben Lernstand wie Woche 37',()=>{
  const src=read('public/data/modules.js');
  assert.match(src,/id:'woche-38-2026',week:38/);
  assert.match(src,/status:'current'/);
  assert.match(src,/sharedProgressWith:'woche-37-2026'/);
  const occurrences=(src.match(/storageKey:'franzoesischLernatelierW37_v1'/g)||[]).length;
  assert.equal(occurrences,2);
});

test('Woche 38 lädt die Übungen von Woche 37 als eigene Wochenansicht',()=>{
  const src=read('public/module/woche-38/index.html');
  assert.match(src,/fetch\('\.\.\/woche-37\/index\.html'/);
  assert.match(src,/week38-module\.js/);
  assert.match(src,/Woche 38 · Weiterarbeiten/);
});

test('Die Hauptseite führt zur zuletzt bearbeiteten Übung',()=>{
  const src=read('public/assets/week38-home.js');
  assert.match(src,/Zuletzt bearbeitete Übung/);
  assert.match(src,/lastMission/);
  assert.match(src,/data-open-next/);
});

test('Online bleibt Woche 38 mit dem Lernstand von Woche 37 verbunden',()=>{
  const src=read('public/assets/week38-home.js');
  assert.match(src,/CURRENT_ID = 'woche-38-2026'/);
  assert.match(src,/SHARED_ID = 'woche-37-2026'/);
  assert.match(src,/moduleId: SHARED_ID/);
});

test('Die Sprechkarte funktioniert auch in Woche 38',()=>{
  const access=read('public/assets/atelier-accessibility.js');
  const card=read('public/assets/week37-card-print-upgrade.js');
  assert.match(access,/woche-\(\?:37\|38\)/);
  assert.match(card,/DISPLAY_WEEK/);
});

test('Offline-Cache enthält Woche 38',()=>{
  const src=read('public/service-worker.js');
  assert.match(src,/v0-20-0-topic-training/);
  assert.match(src,/module\/woche-38\/index\.html/);
  assert.match(src,/week38-home\.js/);
  assert.match(src,/week38-module\.js/);
});


test('Die Rückseite der Druckkarte steht rechts und trägt den Titel Je me présente',()=>{
  const card=read('public/assets/week37-card-print-upgrade.js');
  assert.match(card,/w37-print-back\{display:flex;flex-direction:column;align-items:flex-end\}/);
  assert.match(card,/max-width:82mm/);
  assert.match(card,/>Je me présente<\/h1>/);
});


test('Training ist themenbasiert und nicht mehr nur wochenbasiert',()=>{
  const modules=read('public/data/modules.js');
  const training=read('public/assets/topic-training.js');
  assert.match(modules,/window\.FRANZ_TOPICS/);
  assert.match(modules,/weeks":\[36,37,38\]/);
  assert.match(training,/Trainieren Sie den Stoff des ganzen Themas/);
  assert.match(training,/Testvorbereitung/);
});

test('Vocabulaire-Testvorbereitung teilt den Lernstand mit Cartes',()=>{
  const modules=read('public/data/modules.js');
  const training=read('public/assets/topic-training.js');
  assert.match(modules,/progressStorageKey":"franzoesischLernatelierW37_v1"/);
  assert.match(modules,/\"id\":\"cards\.0\"/);
  assert.match(training,/practiceV2/);
  assert.match(training,/vocab-check/);
  assert.match(training,/Zuverlässig/);
  assert.match(training,/Noch unsicher/);
  assert.match(training,/Noch lernen/);
});

test('Testvorbereitung hat Liste, Druck und Probe-Check mit Detailauswertung',()=>{
  const training=read('public/assets/topic-training.js');
  assert.match(training,/Gesamtliste/);
  assert.match(training,/Liste drucken/);
  assert.match(training,/Probe-Check/);
  assert.match(training,/Detaillierte Auswertung/);
  assert.match(training,/topic-vocab-print/);
});

test('Themenmodell ist fuer spaetere Grammatik-Bereiche vorbereitet',()=>{
  const modules=read('public/data/modules.js');
  assert.match(modules,/"type":"grammar","enabled":false/);
  assert.match(modules,/"type":"speaking","enabled":false/);
});

test('Woche 38 verwendet fuer Cartes weiterhin den vollstaendigen Woche-37-Pool',()=>{
  const w38=read('public/module/woche-38/index.html');
  assert.doesNotMatch(w38,/FranzPractice\\\.create.*\$138/);
});
