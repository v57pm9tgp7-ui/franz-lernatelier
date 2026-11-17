const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, ResourceLoader, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname, '../public');
const site = 'https://franzatelier.test';
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const wait = () => new Promise(resolve => setTimeout(resolve, 30));

class Sources extends ResourceLoader {
  fetch(url) {
    const file = path.join(root, decodeURIComponent(new URL(url).pathname));
    if (file.endsWith('.css')) return Promise.resolve(Buffer.alloc(0));
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return Promise.resolve(fs.readFileSync(file));
    return null;
  }
}
async function page(file, fragment='', setup=()=>{}, referrer) {
  const errors = [];
  const logs = new VirtualConsole();
  logs.on('jsdomError', err => {if (err.type === 'unhandled exception') errors.push(err.message);});
  const dom = new JSDOM(read(file), {
    url:site+'/'+file+fragment, referrer, resources:new Sources(), runScripts:'dangerously', pretendToBeVisual:true, virtualConsole:logs,
    beforeParse(w) {
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.CSS = {escape:s=>String(s)};
      setup(w);
    }
  });
  await new Promise(resolve => dom.window.addEventListener('load',resolve,{once:true}));
  assert.deepEqual(errors,[]);
  return dom;
}
test('The module catalogue connects each published week, mission and companion to a real page', async () => {
  const dom = await page('module/woche-47/index.html');
  try {
    const {weeks, overview, training, mission, more} = dom.window.FranzWeekRoutes;
    const folders = fs.readdirSync(path.join(root,'module')).filter(n=>/^woche-\d+$/.test(n)).map(s=>Number(s.slice(6))).sort((a,b)=>a-b);
    assert.deepEqual(Array.from(weeks,w=>w.week),folders);
    for (const w of weeks) {
      const targets = [overview(w),training(w),...w.missionList.map(m=>mission(w,m)),...w.training.map(t=>training(w,t.id)),...more(w).map(m=>m.url)];
      for (const url of targets) {
        assert.equal(url.origin,site);
        const file = path.join(root, url.pathname, url.pathname.endsWith('/') ? 'index.html' : '');
        assert.ok(fs.statSync(file).isFile(),url.href);
      }
    }
    assert.equal(dom.window.document.querySelector('[data-af-week]').options.length,folders.length);
    assert.equal(dom.window.document.querySelector('[data-teacher-entry]'),null);
  } finally {dom.window.close();}
});
test('The week 47 roadmap links to the six lessons, preserves checks, and updates the selection on browser history', async () => {
  const stored = {missionDone:{1:true}, items:{existing:{n:3}}};
  const dom = await page('module/woche-47/index.html','#start', w=>w.localStorage.setItem('franzoesischLernatelierW47_v1:gast',JSON.stringify(stored)));
  const w = dom.window, d = w.document;
  try {
    const links = d.querySelectorAll('atelier-lernweg a');
    assert.equal(links.length,6);
    assert.equal(links[0].className,'af-complete');
    links[2].click(); await wait();
    assert.equal(d.querySelector('[data-af-place]').textContent,'Schritt 3 von 6');
    assert.match(d.querySelector('[data-af-exercise]').selectedOptions[0].text,/Uhrzeiten/);
    d.querySelector('[data-af-directions] a:last-child').click(); await wait();
    assert.equal(w.location.hash,'#lernweg/4');
    w.history.back(); await wait();
    assert.equal(d.querySelector('[data-af-place]').textContent,'Schritt 3 von 6');
    d.querySelector('[data-do="coachrun"]').click(); await wait();
    assert.equal(w.location.hash,'#runde');
    assert.equal(d.querySelector('[data-af-return]').hash,'#lernweg/3');
    d.querySelector('[data-af-return]').click(); await wait();
    assert.equal(w.location.hash,'#lernweg/3');
    assert.deepEqual(JSON.parse(w.localStorage.getItem('franzoesischLernatelierW47_v1:gast')),stored);
  } finally {w.close();}
});
test('Companion pages have week context and a directly opened trainer has its own identity', async () => {
  const cases = [
    ['module/woche-42/proben/loesungen.html','Lösungen',42],
    ['module/woche-43/vertiefung.html','Zusatztraining',43],
    ['module/woche-44/heure.html','Uhrzeiten',44],
    ['module/woche-46/dialogue.html','Verkaufsdialog',46],
    ['verbentrainer/index.html','Verbentrainer',null]
  ];
  for (const [file,title,week] of cases) {
    const dom = await page(file);
    try {
      const d=dom.window.document;
      assert.ok(d.querySelector('[data-af-place]').textContent.startsWith(title),file);
      assert.equal(d.querySelector('[data-af-week]').value,week ? String(week) : '');
      assert.equal(d.querySelector('[data-af-return]'),null);
    } finally {dom.window.close();}
  }
});
test('The verb trainer returns to the week that actually opened it', async () => {
  const url='/module/woche-46/index.html#verben';
  const setup = w=>w.sessionStorage.setItem('franzAtelierTrainingReturn_v1', JSON.stringify({week:46,url,label:'Alle 25 Verben',target:'/verbentrainer/?set=all'}));
  for (const origin of [site+url,'https://example.org/']) {
    const dom = await page('verbentrainer/index.html','?set=all',setup,origin);
    try {
      const link=dom.window.document.querySelector('[data-af-return]');
      assert.equal(link?.href,origin.startsWith(site) ? site+url : undefined);
    } finally {dom.window.close();}
  }
});
