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

test('Woche 38 enthält sieben bekannte Übungen und lässt Übung 4 aus',()=>{
  const src=read('public/data/modules.js');
  assert.match(src,/const FRANZ_MISSIONS_38 = FRANZ_MISSIONS_37/);
  assert.match(src,/filter\(mission => mission\.id !== 4\)/);
  assert.match(src,/duration:'Weiterarbeit · individuell',missions:7/);
  assert.match(src,/Übung 4 ausgelassen/);
});

test('Woche 38 lädt die Übungen von Woche 37 als eigene Wochenansicht und filtert Übung 4',()=>{
  const src=read('public/module/woche-38/index.html');
  assert.match(src,/fetch\('\.\.\/woche-37\/index\.html'/);
  assert.match(src,/week38-module\.js/);
  assert.match(src,/Woche 38 · Weiterarbeiten/);
  assert.match(src,/Number\(mission\.id\) !== 4/);
  assert.match(src,/Répéter à deux/);
});

test('Die Navigation bietet Woche 36, 37 und 38 an',()=>{
  const nav=read('public/assets/atelier-navigation.js');
  assert.match(nav,/const weekOptions = \[36,37,38\]/);
  assert.match(nav,/config\.week === 37 \? 38/);
  assert.match(nav,/`\.\.\/woche-\$\{e\.target\.value\}\/index\.html/);
});

test('Woche-38-Adapter lässt Übung 4 nicht zu und führt 3 direkt zu 5',()=>{
  const src=read('public/assets/week38-module.js');
  assert.match(src,/\[3,'Je donne des détails'\]/);
  assert.match(src,/\[5,'Mon expérience et mon projet'\]/);
  assert.doesNotMatch(src,/\[4,'Écouter quatre profils'\]/);
  assert.match(src,/const before = index > 0 \? IDS\[index - 1\]/);
  assert.match(src,/const after = index < IDS\.length - 1 \? IDS\[index \+ 1\]/);
});

test('Répéter en groupes ist in Woche 38 eine Generalprobe zu zweit',()=>{
  const src=read('public/assets/week38-module.js');
  assert.match(src,/Répéter à deux/);
  assert.match(src,/Person A spricht 60 Sekunden/);
  assert.match(src,/Person B hört nur zu/);
  assert.match(src,/Rollen wechseln/);
  assert.match(src,/direkt zu Übung 8/);
  assert.doesNotMatch(src,/Dreiergruppe/);
});

test('Woche 38 zeigt statt der Sprechkarte den vollständigen editierbaren Text und liest genau diesen vor',()=>{
  const access=read('public/assets/atelier-accessibility.js');
  const card=read('public/assets/week37-card-print-upgrade.js');
  const module=read('public/assets/week38-module.js');
  assert.match(access,/woche-\(\?:37\|38\)/);
  assert.match(module,/Mon texte final/);
  assert.match(module,/data-w38-final-text/);
  assert.match(module,/Sprechkarte drucken/);
  assert.match(module,/data-print/);
  assert.match(module,/ändern, ergänzen oder streichen/);
  assert.match(module,/Text aus meinen bisherigen Angaben neu erstellen/);
  assert.match(card,/answer\(state, 'w38.finalText'\)/);
  assert.match(card,/data-w38-final-text/);
  assert.match(module,/weibliche Stimme/);
  assert.match(module,/männliche Stimme/);
  assert.match(module,/langsamer/);
});

test('Offline-Cache enthält die neue Woche-38-Version',()=>{
  const src=read('public/service-worker.js');
  assert.match(src,/v0-22-3-w38-print-visible/);
  assert.match(src,/module\/woche-38\/index\.html/);
  assert.match(src,/week38-home\.js/);
  assert.match(src,/week38-module\.js/);
  assert.match(src,/week37-card-print-upgrade\.js/);
});

test('Die Rückseite der Druckkarte steht auf der Duplex-Rückseite und trägt den Titel Je me présente',()=>{
  const card=read('public/assets/week37-card-print-upgrade.js');
  assert.match(card,/w37-print-sheet-back\{display:flex;justify-content:flex-end;align-items:flex-start\}/);
  assert.match(card,/w37-print-card-back/);
  assert.match(card,/>Je me présente<\/h1>/);
});

test('Training ist themenbasiert und nicht mehr nur wochenbasiert',()=>{
  const modules=read('public/data/modules.js');
  assert.match(modules,/window\.FRANZ_TOPICS/);
  assert.match(modules,/weeks":\[36,37,38\]/);
});

test('Woche 38 verwendet für das Training weiterhin den vollständigen Woche-37-Pool',()=>{
  const w38=read('public/module/woche-38/index.html');
  assert.doesNotMatch(w38,/FranzPractice\\\.create.*\$138/);
});
