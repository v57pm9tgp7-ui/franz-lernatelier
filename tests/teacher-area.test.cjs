const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Lehrpersonenbereich und Teacher-API sind vorhanden',()=>{
  assert.ok(fs.existsSync(path.join(root,'public/lehrperson/index.html')));
  const worker=read('src/index.js');
  assert.match(worker,/\/api\/teacher\/dashboard/);
  assert.match(worker,/\/api\/teacher\/vocabulary/);
  assert.match(worker,/verifyTeacherAccess/);
});

test('Roster enthält beide Kursgruppen mit 18 und 19 Lernenden',()=>{
  const roster=read('src/roster.js');
  assert.match(roster,/"GS1CD"/);
  assert.match(roster,/"GS1AF"/);
  const emails=roster.match(/@stud\.bffbern\.ch/g)||[];
  assert.equal(emails.length,37);
});

test('Benutzernamen mit Umlauten und Doppelnamen sind korrekt hinterlegt',()=>{
  const roster=read('src/roster.js');
  assert.match(roster,/robinsean\.klaus@stud\.bffbern\.ch/);
  assert.match(roster,/nahlaashley\.bigler@stud\.bffbern\.ch/);
  assert.match(roster,/luangian\.keller@stud\.bffbern\.ch/);
  assert.match(roster,/sarahrachel\.schranz@stud\.bffbern\.ch/);
  assert.match(roster,/eyluel\.mutlu@stud\.bffbern\.ch/);
  assert.match(roster,/jael\.wuethrich@stud\.bffbern\.ch/);
  assert.match(roster,/ida\.luethi@stud\.bffbern\.ch/);
});

test('Lehrperson kann Lern- und Testwortschatz je Gruppe getrennt speichern',()=>{
  const worker=read('src/index.js');
  assert.match(worker,/teacher_vocab_config/);
  assert.match(worker,/learn_json/);
  assert.match(worker,/test_json/);
  assert.match(worker,/group_id/);
});

test('Lernenden-App lädt die gruppenspezifische Konfiguration',()=>{
  const training=read('public/assets/topic-training.js');
  const practice=read('public/assets/practice-vocab-config.js');
  assert.match(training,/\/api\/topic-config/);
  assert.match(training,/testVocabulary/);
  assert.match(practice,/learnIds/);
});

test('Probe-Check speichert eine auswertbare Zusammenfassung für die Lehrperson',()=>{
  const training=read('public/assets/topic-training.js');
  assert.match(training,/topicAssessments/);
  assert.match(training,/vocabulaire/);
  assert.match(training,/checks/);
});

test('Cloudflare-Setup beschreibt OTP, Pfade, AUD und Worker-Variablen',()=>{
  const setup=read('CLOUDFLARE-LEHRPERSON-EINRICHTUNG.txt');
  assert.match(setup,/One-time PIN/);
  assert.match(setup,/franzatelier\.com\/lehrperson\/\*/);
  assert.match(setup,/franzatelier\.com\/api\/teacher\/\*/);
  assert.match(setup,/ACCESS_TEAM_DOMAIN/);
  assert.match(setup,/ACCESS_AUD/);
  assert.match(setup,/TEACHER_EMAIL/);
});
