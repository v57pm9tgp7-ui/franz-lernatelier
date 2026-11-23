const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../public');
const key='franzoesischLernatelierW48_v1:gast';
const tick=()=>new Promise(r=>setTimeout(r,35));
class Local extends ResourceLoader{fetch(url){const f=path.join(root,decodeURIComponent(new URL(url).pathname));if(f.endsWith('.css'))return Promise.resolve(Buffer.alloc(0));return fs.existsSync(f)&&fs.statSync(f).isFile()?Promise.resolve(fs.readFileSync(f)):null;}}
async function page(hash='#start',seed={}){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(e.type==='unhandled exception')errors.push(e.message);});
 const dom=new JSDOM(fs.readFileSync(path.join(root,'module/woche-48/index.html'),'utf8'),{url:'https://atelier.test/module/woche-48/'+hash,runScripts:'dangerously',resources:new Local(),pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.CSS={escape:s=>s};w.localStorage.setItem(key,JSON.stringify(seed));}});
 await new Promise(r=>dom.window.addEventListener('load',r,{once:true}));
 const w=dom.window,d=w.document;
 return {w,d,errors,close:()=>w.close(),run:()=>JSON.parse(w.sessionStorage.getItem(key+':runde')),state:()=>JSON.parse(w.localStorage.getItem(key)),async go(hash){w.location.hash=hash;await tick();},async click(sel){const el=d.querySelector(sel);assert.ok(el,sel);el.click();await tick();},input(sel,value){const el=d.querySelector(sel);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));},async answer(value){this.input('#answer',value);d.querySelector('#answer-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await tick();}};
}
test('W48 integrates into shared navigation and every activity loads without script errors',async()=>{
 const p=await page();try{
  assert.equal(p.d.querySelectorAll('atelier-lernweg a').length,6);
  assert.equal(p.w.FRANZ_MODULES.filter(m=>m.status==='current')[0].week,48);
  for(const route of ['vorbereitung','test','verben','pause','pause/raetsel','pause/comic','pause/musik','kalender','kalender/partner','projekt','projekt/plan','projekt/kriterien','abschluss','material','training','lernstand','lernziele']){await p.go('#'+route);assert.ok(p.d.querySelector('main h1'),route);}
  assert.deepEqual(p.errors,[]);
 }finally{p.close();}
});
test('Diagnostic samples all four trained goals and does not count corrected guesses as mastery',async()=>{
 const p=await page('#vorbereitung');try{
  await p.click('[data-action="diagnostic"]');
  let run=p.run();const bank=p.w.W48Testing.bank;
  assert.deepEqual(Array.from(run.ids,id=>bank.find(q=>q.id===id).goal),['G1','G2','G3','G4']);
  const id=run.ids[0],q=bank.find(q=>q.id===id);
  await p.answer('definitely wrong');assert.equal(p.run().e.locked,false);
  await p.answer(q.answers[0]);assert.equal(p.run().outcomes[0].independent,false);assert.equal(p.state().items[id].review,true);
  await p.click('[data-action="next"]');
  while(!p.run().done){run=p.run();await p.answer(bank.find(q=>q.id===run.ids[run.i]).answers[0]);await p.click('[data-action="next"]');}
  assert.match(p.d.querySelector('main').textContent,/3 von 4/);
  await p.click('[data-action="retry-run"]');await p.answer(q.answers[0]);assert.equal(p.state().items[id].review,false);
 }finally{p.close();}
});
test('Verbs combine three task types; assisted answers return after intervening tasks',async()=>{
 const p=await page('#verben');try{
  assert.equal(p.w.W48Data.verbs.length,58);assert.equal(new Set(p.w.W48Data.verbs.map(q=>q.verb)).size,25);
  await p.click('[data-action="verbs-run"]');const run=p.run();assert.equal(run.ids.length,6);assert.equal(run.ids.filter(id=>id.includes('fix')).length,2);
  const id=run.ids[0];await p.click('[data-action="hint"]');await p.answer(p.w.W48Testing.bank.find(q=>q.id===id).answers[0]);
  assert.equal(p.run().ids.at(-1),id);assert.equal(p.run().ids.length,7);assert.equal(p.state().items[id].review,true);
  await p.go('#pause');await p.go('#runde');assert.equal(p.run().ids[0],id);assert.ok(p.d.querySelector('[data-action="next"]'));
 }finally{p.close();}
});
test('Calendar categories each supply six valid tasks and term cards conceal the other role',async()=>{
 const p=await page('#kalender');try{
  for(const group of ['jours','mois','saisons','journee']){await p.go('#kalender');await p.click('[data-action="calendar-run"][data-group="'+group+'"]');assert.equal(p.run().ids.length,6);for(const id of p.run().ids){const q=p.w.W48Data.calendar.find(q=>q.id===id);assert.equal(q.group,group);if(q.kind==='choice')assert.ok(q.options.includes(q.answers[0]));}}
  await p.go('#kalender/partner');assert.equal(p.d.querySelector('main table'),null);await p.click('[data-role="A"]');assert.equal(p.d.querySelector('main table'),null);await p.click('[data-action="role-open"]');assert.equal(p.d.querySelectorAll('main tbody tr').length,5);await p.click('[data-role="B"]');assert.equal(p.d.querySelector('main table'),null);
 }finally{p.close();}
});
test('All twelve ideas offer language support and a safely persisted project plan',async()=>{
 const p=await page('#projekt');try{
  assert.equal(p.d.querySelectorAll('.w48-project').length,12);assert.equal(p.d.querySelectorAll('.w48-project .w48-phrase').length,48);
  await p.click('[data-action="choose-idea"]');const idea=p.state().plan.idea;assert.ok(idea);
  const draft='<img src=x onerror=alert(1)> Notre idée';p.input('#plan-title',draft);p.input('#plan-dialogue','A: Bonjour !\nB: Salut !');await p.go('#start');await p.go('#projekt/plan');assert.equal(p.d.querySelector('#plan-title').value,draft);assert.equal(p.d.querySelector('main img'),null);assert.equal(p.state().plan.idea,idea);assert.match(p.d.querySelector('#plan-dialogue').value,/B: Salut/);
  assert.deepEqual(p.errors,[]);
 }finally{p.close();}
});
test('Material links resolve to learning documents; graded test and keys remain unpublished',async()=>{
 const p=await page('#material');try{
  const links=Array.from(p.d.querySelectorAll('main a[href*="material/"]'));assert.equal(links.length,4);
  for(const a of links){const file=path.join(root,new URL(a.href).pathname);assert.ok(fs.statSync(file).size>1000);}
  const files=fs.readdirSync(path.join(root,'module/woche-48/material'));assert.ok(files.every(f=>/^(Lernheft|Projektideen)Woche48\.(pdf|docx)$/.test(f)));
  const c=p.w.W48Testing.correct;assert.equal(c({goal:'G1',answers:['420018']},'420’018'),true);assert.equal(c({goal:'G1',answers:['420018']},'42.018'),false);assert.equal(c({goal:'V',answers:['écrit']},'ecrit'),false);
 }finally{p.close();}
});
