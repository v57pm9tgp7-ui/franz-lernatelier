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
  assert.match(src,/v0-19-4-w38-continuation/);
  assert.match(src,/module\/woche-38\/index\.html/);
  assert.match(src,/week38-home\.js/);
  assert.match(src,/week38-module\.js/);
});
