const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname,'..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');

test('alle geänderten JavaScript-Dateien sind syntaktisch gültig', () => {
  for (const file of [
    'public/data/modules.js',
    'public/assets/atelier-navigation.js',
    'public/assets/week38-module.js',
    'public/assets/week37-card-print-upgrade.js',
    'public/assets/atelier-accessibility.js',
    'public/service-worker.js'
  ]) new vm.Script(read(file), {filename:file});
});

test('der Woche-38-Loader enthält gültiges Inline-JavaScript', () => {
  const html = read('public/module/woche-38/index.html');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  assert.equal(scripts.length, 1);
  new vm.Script(scripts[0], {filename:'woche-38/index.html'});
});

test('Woche 38 enthält sieben Übungen und lässt Übung 4 aus', () => {
  const modules = read('public/data/modules.js');
  assert.match(modules,/const FRANZ_MISSIONS_38 = FRANZ_MISSIONS_37/);
  assert.match(modules,/\.filter\(mission => mission\.id !== 4\)/);
  assert.match(modules,/duration:'Weiterarbeit · individuell',missions:7/);
  assert.match(modules,/missionList:FRANZ_MISSIONS_38/);
  assert.match(modules,/Übung 4 ausgelassen/);

  const loader = read('public/module/woche-38/index.html');
  assert.match(loader,/filter\(mission => Number\(mission\.id\) !== 4\)/);

  const module = read('public/assets/week38-module.js');
  assert.doesNotMatch(module,/\[4,'Écouter quatre profils'\]/);
  assert.match(module,/const IDS = MISSIONS\.map/);
});

test('das Wochenmenü kennt Woche 38 und wechselt 36 → 37 → 38', () => {
  const nav = read('public/assets/atelier-navigation.js');
  assert.match(nav,/\[36,37,38\]/);
  assert.match(nav,/config\.week === 36 \? 37 : config\.week === 37 \? 38 : null/);
  assert.match(nav,/Woche \$\{week\}/);
});

test('Répéter en groupes ist in Woche 38 eine direkte Partner-Generalprobe', () => {
  const modules = read('public/data/modules.js');
  const module = read('public/assets/week38-module.js');
  assert.match(modules,/title:'Répéter à deux'/);
  assert.match(modules,/form:'Partnerarbeit'/);
  assert.match(module,/Person A spricht 60 Sekunden/);
  assert.match(module,/Person B hört nur zu/);
  assert.match(module,/Rollen wechseln/);
  assert.match(module,/Wechseln Sie direkt zu Übung 8 und nehmen Sie das Video auf/);
});

test('Woche 38 ersetzt die Stichwortansicht durch den vollständigen editierbaren Text', () => {
  const module = read('public/assets/week38-module.js');
  const modules = read('public/data/modules.js');
  assert.match(modules,/title:'Mon texte final'/);
  assert.match(module,/Mein kompletter Text/);
  assert.match(module,/data-w38-final-text/);
  assert.match(module,/data-learn-field="\$\{FINAL_TEXT_KEY\}"/);
  assert.match(module,/ändern, ergänzen oder streichen/);
  assert.match(module,/Text aus meinen bisherigen Angaben neu erstellen/);
  assert.doesNotMatch(module,/Meine Stichwörter/);
});

test('Vorlesen bietet weibliche/männliche Stimme und langsameres Tempo', () => {
  const card = read('public/assets/week37-card-print-upgrade.js');
  assert.match(card,/weibliche Stimme/);
  assert.match(card,/männliche Stimme/);
  assert.match(card,/value="0\.72"/);
  assert.match(card,/data-w37-speak-full/);
  assert.match(card,/SpeechSynthesisUtterance/);
  assert.match(card,/utterance\.lang = 'fr-FR'/);
});

test('Stimmenauswahl bevorzugt passende französische Windows-Stimmen', () => {
  global.speechSynthesis = {getVoices:() => [
    {name:'Microsoft Denise Online (Natural) - French (France)',lang:'fr-FR'},
    {name:'Microsoft Henri Online (Natural) - French (France)',lang:'fr-FR'}
  ]};
  const upgrade = require(path.join(root,'public/assets/week37-card-print-upgrade.js'));
  assert.match(upgrade.chooseVoice('female').name,/Denise/);
  assert.match(upgrade.chooseVoice('male').name,/Henri/);
  delete global.speechSynthesis;
});

test('der vollständige persönliche Text bleibt Grundlage für Vorlesen und Druck', () => {
  const upgrade = require(path.join(root,'public/assets/week37-card-print-upgrade.js'));
  const state = {answers:{
    'profile.name':'Lina','profile.age':'16','profile.city':'Berne',
    'profile.hobbyClause':'je joue au football','profile.school':'la BFF à Berne',
    'profile.job':'assistante médicale','profile.jobStatus':'want',
    'career.reason':'J’aime aider les gens.','career.strength':'Je suis fiable.',
    'career.stageStatus':'none'
  }};
  const text = upgrade.speechText(state);
  assert.match(text,/Je m’appelle Lina/);
  assert.match(text,/J’ai 16 ans/);
  assert.match(text,/J’habite à Berne/);
  assert.match(text,/assistante médicale/);
  assert.match(text,/Je n’ai pas encore fait de stage/);
  assert.match(text,/Merci de m’avoir écouté\./);
  assert.doesNotMatch(text,/écouté\s*\/\s*écoutée/);
  const edited = upgrade.speechText({answers:{'w38.finalText':'Bonjour. Ceci est mon texte personnel. Merci.'}}, true);
  assert.equal(edited,'Bonjour. Ceci est mon texte personnel. Merci.');
});

test('Service Worker erzwingt einen neuen Cache und enthält die neuen Asset-Versionen', () => {
  const sw = read('public/service-worker.js');
  assert.match(sw,/franz-lernatelier-v0-22-1-w38-final-text/);
  assert.match(sw,/atelier-navigation\.js\?v=20260917-w38nav1/);
  assert.match(sw,/week37-card-print-upgrade\.js\?v=20260917-card7/);
  assert.match(sw,/week38-module\.js\?v=20260917-w38-3/);
});
