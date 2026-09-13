const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Lehrpersonen-Frontend verwendet APIs innerhalb des geschützten Lehrpersonenpfads',()=>{
  const src=read('public/assets/teacher.js');
  assert.match(src,/\/lehrperson\/api\/teacher\/me/);
  assert.match(src,/\/lehrperson\/api\/teacher\/dashboard/);
  assert.match(src,/\/lehrperson\/api\/teacher\/vocabulary/);
});

test('Worker akzeptiert verschachtelte Lehrpersonen-API',()=>{
  const src=read('src/index.js');
  assert.match(src,/\/lehrperson\/api\/teacher\//);
  assert.match(src,/replace\(\/\^\\\\\/lehrperson/);
});
