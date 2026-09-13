const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Woche 38 zeigt das Herbstferien-Kapitel getrennt von den acht Missionen',()=>{
  const src=read('public/assets/week38-module.js');
  assert.match(src,/Zusätzliches Kapitel · nach dem Video/);
  assert.match(src,/Mes vacances d’automne/);
  assert.match(src,/herbstferien\.html/);
  assert.doesNotMatch(src,/\[9\s*,\s*['"]/);
});

test('Das Herbstferien-Kapitel ist auf 60 Minuten Einzelarbeit ausgelegt',()=>{
  const src=read('public/module/woche-38/herbstferien.html');
  assert.match(src,/≈ 60 Minuten/);
  assert.match(src,/nur Einzelarbeit/);
  assert.match(src,/Sie brauchen keine Partnerperson/);
  assert.match(src,/data-step="1"/);
  assert.match(src,/data-step="7"/);
});

test('Das Kapitel hat Hilfen, Beispiele, Selbstkontrolle und Sprechprobe',()=>{
  const src=read('public/module/woche-38/herbstferien.html');
  assert.match(src,/Viel Hilfe/);
  assert.match(src,/Etwas Hilfe/);
  assert.match(src,/Ganzer Text/);
  assert.match(src,/Kurz prüfen/);
  assert.match(src,/Schlusscheck/);
  assert.match(src,/45 Sekunden starten/);
});

test('Futur proche wird mit je vais plus Infinitiv aufgebaut',()=>{
  const src=read('public/module/woche-38/herbstferien.html');
  assert.match(src,/JE VAIS/);
  assert.match(src,/INFINITIF/);
  assert.match(src,/Je vais rester à la maison\./);
  assert.match(src,/Je vais rencontrer mes amis\./);
  assert.match(src,/Je vais voyager avec ma famille\./);
  assert.match(src,/Je vais faire un stage\./);
});

test('Der persönliche Ferienplan wird im gemeinsamen Lernstand gespeichert',()=>{
  const src=read('public/module/woche-38/herbstferien.html');
  assert.match(src,/franzoesischLernatelierW37_v1/);
  assert.match(src,/week38Holidays/);
  assert.match(src,/cloud-sync\.js/);
  assert.match(src,/data-module-id="woche-37-2026"/);
});
