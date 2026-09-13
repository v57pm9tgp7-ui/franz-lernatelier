const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
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

test('Drucklayout isoliert die Lernkarte und setzt A6', () => {
  const fs = require('node:fs');
  const source = fs.readFileSync(path.join(__dirname,'..','public','assets','week37-card-print-upgrade.js'),'utf8');
  assert.match(source, /@page\{size:A6 portrait;margin:0\}/);
  assert.match(source, /body > \*:not\(#franz-w37-print-root\)\{display:none!important\}/);
  assert.match(source, /w37-print-front/);
  assert.match(source, /w37-print-back/);
});

test('Loader und Service Worker binden das Kartenupgrade ein', () => {
  const fs = require('node:fs');
  const loader = fs.readFileSync(path.join(__dirname,'..','public','assets','atelier-accessibility.js'),'utf8');
  const sw = fs.readFileSync(path.join(__dirname,'..','public','service-worker.js'),'utf8');
  assert.match(loader, /week37-card-print-upgrade\.js/);
  assert.match(sw, /week37-card-print-upgrade\.js/);
});
