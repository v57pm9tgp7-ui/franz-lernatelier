const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const upgrade = require(path.join('..','public','assets','week37-card-print-upgrade.js'));

const state = {answers:{
  'profile.name':'Lina','profile.age':'16','profile.city':'Berne','profile.mood':'très bien',
  'profile.hobbyClause':'je joue au football','profile.food':'la pizza','profile.schoolLike':'j’aime les langues',
  'profile.school':'la BFF à Berne','profile.languages':'allemand, français et arabe',
  'profile.job':'assistante médicale','profile.jobStatus':'want','profile.wish':'travailler dans un cabinet médical',
  'm3.hobby':'Dans mon temps libre, je joue au football avec mes amis deux fois par semaine.',
  'm3.school':'Je suis à la BFF à Berne. J’y apprends le français et je prépare mon apprentissage.',
  'm3.job':'Je voudrais devenir assistante médicale parce que j’aime aider les gens.',
  'career.reason':'J’aime aider les gens.','career.strength':'Je suis fiable. Par exemple, j’arrive à l’heure.',
  'career.stageStatus':'done','career.stage':'J’ai fait un stage dans une pharmacie.',
  'career.task':'J’ai aidé à préparer le matériel.','career.liked':'J’ai aimé le contact avec les clients.'
}};

test('Stichwortkarte deckt alle fünf Bereiche und zentrale Woche-37-Inhalte ab', () => {
  const s = upgrade.buildKeywordSections(state);
  assert.equal(s.length, 5);
  const joined = s.map(x => x.parts.join(' · ')).join(' | ');
  for (const needle of ['Lina','16 ans','Berne','football','pizza','allemand','BFF','assistante médicale','qualité','stage','activité','impression','projet','merci']) {
    assert.match(joined, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
  }
});

test('Rückseite enthält den vollständigen erarbeiteten persönlichen Text', () => {
  const text = upgrade.buildFullText(state).join(' ');
  for (const needle of ['Bonjour','Je m’appelle Lina','J’ai 16 ans','J’habite à Berne','football','pizza','Je parle allemand, français et arabe','BFF','assistante médicale','Je suis fiable','stage dans une pharmacie','préparer le matériel','contact avec les clients','Plus tard, je veux travailler dans un cabinet médical','Merci']) {
    assert.match(text, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
  }
});

test('Benutzer-Stichwörter werden beim Druck nicht verworfen', () => {
  const merged = upgrade.mergeKeywordText('mon mot · pharmacie', ['stage: pharmacie', 'qualité: fiable']);
  assert.match(merged, /mon mot/);
  assert.match(merged, /pharmacie/);
  assert.match(merged, /qualité: fiable/);
});

test('Drucklayout isoliert die Lernkarte und setzt A4-Duplex mit A6-Karte', () => {
  const source = fs.readFileSync(path.join(__dirname,'..','public','assets','week37-card-print-upgrade.js'),'utf8');
  assert.match(source, /@page\{size:A4 portrait;margin:0\}/);
  assert.match(source, /body > \*:not\(#franz-w37-print-root\)\{display:none!important\}/);
  assert.match(source, /w37-print-sheet-front/);
  assert.match(source, /w37-print-sheet-back/);
  assert.match(source, /width:105mm;height:148mm/);
});

test('Sprechkarten-Upgrade erklärt die Funktion einmal klar statt Vorschläge zu duplizieren', () => {
  const source = fs.readFileSync(path.join(__dirname,'..','public','assets','week37-card-print-upgrade.js'),'utf8');
  assert.match(source, /So funktioniert Ihre Stichwortkarte/);
  assert.match(source, /Automatische Stichwörter neu erstellen/);
  assert.doesNotMatch(source, /Vollständiger Vorschlag aus Ihren Angaben/);
});

test('Ganzer persönlicher Text kann mit Stimme und Tempo vorgelesen werden', () => {
  const source = fs.readFileSync(path.join(__dirname,'..','public','assets','week37-card-print-upgrade.js'),'utf8');
  assert.match(source, /Meinen ganzen Text anhören/);
  assert.match(source, /value="female"/);
  assert.match(source, /value="male"/);
  assert.match(source, /value="0\.72"/);
  assert.match(source, /SpeechSynthesisUtterance/);
  const spoken = upgrade.speechText(state);
  assert.match(spoken, /Je m’appelle Lina/);
  assert.match(spoken, /assistante médicale/);
  assert.doesNotMatch(spoken, /écouté\s*\/\s*écoutée/);
});

test('Stimmauswahl bevorzugt französische weibliche bzw. männliche Stimmen', () => {
  const voices = [
    {name:'Microsoft Denise Online (Natural) - French (France)',lang:'fr-FR'},
    {name:'Microsoft Henri Online (Natural) - French (France)',lang:'fr-FR'},
    {name:'English Voice',lang:'en-GB'}
  ];
  const previous = globalThis.speechSynthesis;
  globalThis.speechSynthesis = {getVoices:()=>voices};
  try {
    assert.match(upgrade.chooseVoice('female').name,/Denise/);
    assert.match(upgrade.chooseVoice('male').name,/Henri/);
  } finally {
    if (previous === undefined) delete globalThis.speechSynthesis; else globalThis.speechSynthesis = previous;
  }
});

test('Loader und Service Worker binden das Kartenupgrade ein', () => {
  const loader = fs.readFileSync(path.join(__dirname,'..','public','assets','atelier-accessibility.js'),'utf8');
  const sw = fs.readFileSync(path.join(__dirname,'..','public','service-worker.js'),'utf8');
  assert.match(loader, /week37-card-print-upgrade\.js/);
  assert.match(sw, /week37-card-print-upgrade\.js/);
});
