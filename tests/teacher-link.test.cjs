const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Startseite zeigt den Lehrpersonen-Link nur für Christoph',()=>{
  const src=read('public/data/modules.js');
  assert.match(src,/christoph\.marti@bffbern\.ch/);
  assert.match(src,/Lehrpersonenbereich/);
  assert.match(src,/link\.hidden = getEmail\(\) !== TEACHER_EMAIL/);
  assert.match(src,/href = 'lehrperson\/'/);
});

test('Lehrpersonenbereich bleibt separat durch Cloudflare Access geschützt',()=>{
  const src=read('src/index.js');
  assert.match(src,/verifyTeacherAccess/);
  assert.match(src,/\/api\/teacher\//);
});
