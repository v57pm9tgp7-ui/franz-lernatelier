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
  for(const route of ['vorbereitung','test','verben','pause','pause/raetsel','pause/comic','pause/musik','kalender','kalender/partner','projekt','projekt/formate','projekt/beispiele','projekt/beispiel/film','projekt/beispiel/chatstory','projekt/plan','projekt/kriterien','abschluss','material','training','lernstand','lernziele']){await p.go('#'+route);assert.ok(p.d.querySelector('main h1'),route);}
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
  const links=Array.from(p.d.querySelectorAll('main a[href*="material/"]'));assert.equal(links.length,6);
  for(const a of links){const file=path.join(root,new URL(a.href).pathname);assert.ok(fs.statSync(file).size>1000);}
  const files=fs.readdirSync(path.join(root,'module/woche-48/material'));assert.ok(files.every(f=>/^(Lernheft|Projektideen|Projektkompass)Woche48\.(pdf|docx)$/.test(f)));
  const c=p.w.W48Testing.correct;assert.equal(c({goal:'G1',answers:['420018']},'420’018'),true);assert.equal(c({goal:'G1',answers:['420018']},'42.018'),false);assert.equal(c({goal:'V',answers:['écrit']},'ecrit'),false);
 }finally{p.close();}
});
test('The quiet break filters real activities without making them an assessed task',async()=>{
 const p=await page('#pause');try{
  assert.equal(p.d.querySelectorAll('.w48-discovery').length,5);
  await p.click('[data-action="pause-filter"][data-filter="silent"]');assert.equal(p.d.querySelectorAll('.w48-discovery').length,3);
  for(const a of p.d.querySelectorAll('.w48-discovery a')){assert.equal(new URL(a.href).protocol,'https:');assert.equal(a.target,'_blank');assert.match(a.rel,/noopener/);}
  assert.match(p.d.querySelector('main').textContent,/keine Bewertung/);assert.doesNotMatch(p.d.querySelector('main').textContent,/Vier kleine Bilderrätsel/);
 }finally{p.close();}
});
test('Nine formats have complete models and selecting one preserves a previous project draft',async()=>{
 const p=await page('#projekt/formate',{plan:{title:'Unser eigener Titel',dialogue:'A: Notre idée.',format:'Mini-Film'}});try{
  assert.equal(p.d.querySelectorAll('.w48-format').length,9);
  await p.click('[data-action="format-filter"][data-filter="voice"]');assert.equal(p.d.querySelectorAll('.w48-format').length,2);
  await p.click('[data-action="choose-format"][data-format="podcast"]');assert.equal(p.state().plan.format,'Mini-Podcast / Interview');assert.equal(p.state().plan.title,'Unser eigener Titel');
  await p.go('#projekt/plan');assert.equal(p.d.querySelector('#plan-format').value,'Mini-Podcast / Interview');assert.equal(p.d.querySelector('#plan-dialogue').value,'A: Notre idée.');
  assert.equal(p.w.W48Models.length,9);
  for(const m of p.w.W48Models){await p.go('#projekt/beispiel/'+m.id);assert.equal(p.d.querySelector('.wm-gallery').dataset.modelId,m.id);assert.equal(m.scenes.length,6);const turns=m.scenes.flatMap(s=>s.turns);assert.equal(turns.length,12);assert.equal(turns.filter(t=>t.speaker==='A').length,6);assert.ok(m.verbs.length>=5);assert.ok(p.d.querySelector('main h1'));}
  assert.deepEqual(p.errors,[]);
 }finally{p.close();}
});
test('Model playback is opt-in, changes scenes, exposes translations, and stops when leaving',async()=>{
 const p=await page('#projekt/beispiel/film');try{
  let spoken=0,cancelled=0;p.w.SpeechSynthesisUtterance=function(text){this.text=text;};p.w.speechSynthesis={getVoices:()=>[{lang:'fr-FR'}],speak:()=>spoken++,cancel:()=>cancelled++};
  assert.equal(spoken,0);assert.equal(p.d.querySelector('.wm-playing'),null);
  await p.click('[data-model-action="scene"][data-scene="3"]');assert.match(p.d.querySelector('[data-model-stage]').textContent,/Szene 4 von 6/);
  const box=p.d.querySelector('[data-model-translation]');box.checked=true;box.dispatchEvent(new p.w.Event('change',{bubbles:true}));assert.ok(p.d.querySelector('.wm-show-de'));
  await p.click('[data-model-action="voice"]');assert.equal(spoken,1);
  await p.go('#projekt');assert.ok(cancelled>0);assert.equal(p.d.querySelector('.wm-gallery'),null);
  await p.go('#projekt/beispiel/chatstory');delete p.w.speechSynthesis;await p.click('[data-model-action="voice"]');assert.match(p.d.querySelector('[data-model-status]').textContent,/keine Vorlesestimme/);assert.equal(p.d.querySelectorAll('.wm-chat-body>section').length,6);
  assert.deepEqual(p.errors,[]);
 }finally{p.close();}
});
