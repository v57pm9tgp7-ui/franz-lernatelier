const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../public');
const keys={36:'franzoesischLernatelierEinstieg_v1',37:'franzoesischLernatelierW37_v1'};
const tick=(ms=220)=>new Promise(resolve=>setTimeout(resolve,ms));
class LocalResources extends ResourceLoader {
  fetch(url){const pathname=new URL(url).pathname;const file=path.join(root,decodeURIComponent(pathname));if(pathname.endsWith('.css'))return Promise.resolve(Buffer.from(''));if(fs.existsSync(file)&&fs.statSync(file).isFile())return Promise.resolve(fs.readFileSync(file));return null;}
}
async function page(week,hash='',seed={}){
  const file=week?`module/woche-${week}/index.html`:'index.html';
  const errors=[],voices=[],observers=[];const console=new VirtualConsole();
  console.on('jsdomError',e=>{if(e.type!=='css parsing'&&!/navigation \(except hash changes\)/.test(e.message))errors.push(e);});
  const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8').replace(/<style>[\s\S]*?<\/style>/g,''),{url:`https://atelier.test/${file}${hash}`,runScripts:'dangerously',resources:new LocalResources(),pretendToBeVisual:true,virtualConsole:console,beforeParse(w){
    const NativeObserver=w.MutationObserver;w.MutationObserver=class extends NativeObserver{constructor(cb){super(cb);observers.push(this);}};
    w.CSS={escape:s=>String(s).replace(/[^a-zA-Z0-9_-]/g,c=>'\\'+c)};
    w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
    w.scrollTo=(a,b)=>{w.scrollY=typeof a==='object'?a.top:b||0;};
    w.SpeechSynthesisUtterance=function(text){this.text=text;};w.speechSynthesis={cancel(){},speak(u){voices.push(u.text)}};
    w.fetch=async()=>({ok:false,status:503,json:async()=>({ok:false})});
    w.localStorage.setItem('franzLernatelierLocalOnly_v1','1');
    for(const [key,value]of Object.entries(seed))w.localStorage.setItem(key,JSON.stringify(value));
  }});
  await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));await tick(120);
  const w=dom.window,d=w.document;
  function click(selector){const e=d.querySelector(selector);assert.ok(e,'Missing control '+selector);assert.ok(!e.disabled,'Disabled control '+selector);e.click();return e;}
  function input(selector,value){const e=d.querySelector(selector);assert.ok(e,selector);e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));return e;}
  function choose(selector,value){const e=d.querySelector(selector);e.value=value;e.dispatchEvent(new w.Event('change',{bubbles:true}));}
  function state(){return JSON.parse(w.localStorage.getItem(keys[week])||'{}');}
  return {w,d,errors,voices,click,input,choose,state,close(){observers.forEach(o=>o.disconnect());w.close();}};
}
test('Every shipped script parses and local HTML assets exist',()=>{
  function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
  for(const file of walk(root)){
    if(file.endsWith('.js'))new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
    if(file.endsWith('.html')&&!file.endsWith('Designvorschau.html')){
      const html=fs.readFileSync(file,'utf8');
      for(const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:file});
      for(const m of html.matchAll(/<(?:script|link|img)\b[^>]*(?:src|href)="([^"#]+)"/g)){
        if(/^(?:https?:|data:)/.test(m[1]))continue;
        assert.ok(fs.existsSync(path.resolve(path.dirname(file),m[1].split('?')[0])),`${file}: ${m[1]}`);
      }
    }
  }
});
test('Week 37 opens all eight exercises with both weeks unfinished',async()=>{
  const p=await page(37);try{
    for(const id of [8,2,6,1,7,3,5,4]){p.choose('[data-nav-exercise]',`mission-${id}`);await tick(25);assert.equal(p.w.location.hash,`#mission-${id}`);assert.match(p.d.querySelector('#missionMount h1').textContent,/\S/);}
    p.w.dispatchEvent(new p.w.Event("pagehide"));assert.deepEqual(p.state().missionDone,{});
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('Week 37 returns from training to the same field, scroll position and input',async()=>{
  const p=await page(37,'#mission-2');try{
    const field=p.input('[data-answer="m2.hobby"]','faire du sport');field.focus();field.setSelectionRange(4,9);p.w.scrollY=1370;
    const trigger=p.d.querySelector('.atelier-nav [data-nav-route="training"]');
    trigger.dispatchEvent(new p.w.MouseEvent('pointerdown',{bubbles:true}));trigger.focus();
    p.click('.atelier-nav [data-nav-route="training"]');await tick();
    assert.equal(p.w.location.hash,'#training');
    p.click('[data-nav-return]');await tick();
    assert.equal(p.w.location.hash,'#mission-2');assert.equal(p.w.scrollY,1370);
    assert.equal(p.d.querySelector('[data-answer="m2.hobby"]').value,'faire du sport');
    assert.equal(p.d.activeElement.dataset.answer,'m2.hobby');
    assert.equal(p.d.activeElement.selectionStart,4);
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('Week 36 return, independent exercises and next week navigation are preserved',async()=>{
  const p=await page(36,'#mission-5');try{
    p.w.scrollY=950;p.click('.atelier-nav [data-nav-route="training"]');await tick();p.click('[data-nav-return]');await tick();
    assert.equal(p.w.location.hash,'#mission-5');assert.equal(p.w.scrollY,950);
    for(const id of [7,5,8,1,2,3,4]){p.choose('[data-nav-exercise]',`mission-${id}`);await tick(30);assert.equal(p.w.location.hash,`#mission-${id}`);}
    p.choose('[data-nav-exercise]','mission-8');await tick();assert.ok(p.d.querySelector('.atelier-nav [data-nav-next-week]'));
    p.w.dispatchEvent(new p.w.Event("pagehide"));assert.deepEqual(p.state().missionDone,{});assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('All four training deep links select the requested mode in both weeks',async()=>{
  for(const week of [36,37])for(const mode of ['cards','dictation','reaction','expert']){
    const p=await page(week,`#training/${mode}`);try{
      const selector=week===36?`[data-training-tab="${mode}"].is-active`:`[data-training="${mode}"].is-selected`;
      assert.ok(p.d.querySelector(selector),`${week} ${mode}`);assert.deepEqual(p.errors.map(e=>e.message),[]);
    }finally{p.close();}
  }
});
test('Week 37 cards reveal, speak, retain favorites, repeat difficult cards, undo and finish',async()=>{
  const p=await page(37,'#training/cards');try{
    const first=p.d.querySelector('.vocab-flash strong').textContent;
    p.click('[data-reveal]');assert.equal(p.d.querySelector('#vocabAnswer').hidden,false);
    p.click('[data-vocab-favorite]');assert.match(p.d.querySelector('[data-vocab-filter="favorites"]').textContent,/1/);
    p.click('#trainerMain [data-speak]');assert.equal(p.voices.at(-1),first);
    p.click('[data-vocab-rate="again"]');assert.notEqual(p.d.querySelector('.vocab-flash strong').textContent,first);
    p.click('#trainingPrevious');assert.equal(p.d.querySelector('.vocab-flash strong').textContent,first);
    p.click('[data-vocab-rate="again"]');
    for(let i=0;i<7;i++)p.click('[data-vocab-rate="known"]');
    assert.equal(p.d.querySelector('.vocab-flash strong').textContent,first);
    p.click('[data-vocab-rate="known"]');assert.match(p.d.querySelector('#trainerMain h2').textContent,/geschafft/);
    await tick(220);assert.equal(p.state().vocabulary.known,8);assert.equal(p.state().vocabulary.again,1);
    p.click('[data-vocab-filter="favorites"]');assert.equal(p.d.querySelector('.vocab-flash strong').textContent,first);
    p.click('[data-training="dictation"]');assert.equal(p.d.querySelector('#trainingNext').disabled,false);
    p.click('[data-training="cards"]');assert.match(p.d.querySelector('[data-vocab-filter="favorites"]').textContent,/1/);
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('No favorites shows an actionable empty state; dictation feedback still works',async()=>{
  const p=await page(37,'#training/cards');try{
    p.click('[data-vocab-filter="favorites"]');assert.match(p.d.querySelector('#trainerMain h2').textContent,/keine gemerkten/);
    assert.equal(p.d.querySelector('#trainingNext').disabled,true);p.click('[data-vocab-filter="all"]');assert.ok(p.d.querySelector('.vocab-flash'));
    p.click('[data-training="dictation"]');p.input('#dictationInput','Je m’appelle Lina et j’habite à Berne.');p.click('[data-check-dictation]');assert.match(p.d.querySelector('#dictationFeedback').textContent,/vollständig/);
    p.click('[data-speak-slow]');assert.ok(p.voices.at(-1).includes('Lina'));
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('Browser Back returns to the exercise, and overview resumes the last visited exercise',async()=>{
  const p=await page(37,'#mission-4');try{
    p.w.scrollY=720;p.click('.atelier-nav [data-nav-route="training"]');await tick();p.w.history.back();await tick();
    assert.equal(p.w.location.hash,'#mission-4');assert.equal(p.w.scrollY,720);
    p.click('.atelier-nav [data-nav-route="start"]');await tick();p.click('[data-nav-return]');await tick();assert.equal(p.w.location.hash,'#mission-4');
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('Existing answers, checks, ratings and completed exercises survive navigation and page leave',async()=>{
  for(const week of [36,37]){
    const saved={currentScreen:'mission-5',currentMission:5,answers:{'m5.job':'laborant','m5.why':'parce que cela me plaît'},choices:{'kept':'yes'},checks:{'m5.done':true},ratings:{flow:3},missionDone:{1:true,3:true},globalLevel:'expert',missionLevels:{5:'challenge'}};
    const p=await page(week,'#mission-5',{[keys[week]]:saved});try{
      p.click('.atelier-nav [data-nav-route="training"]');await tick();p.click('[data-nav-return]');p.w.dispatchEvent(new p.w.Event('pagehide'));
      const actual=p.state();for(const k of ['answers','choices','ratings','missionDone','missionLevels'])assert.deepEqual(actual[k],saved[k],`${week} ${k}`);
      assert.equal(actual.checks['m5.done'],true);assert.equal(actual.globalLevel,'expert');assert.deepEqual(p.errors.map(e=>e.message),[]);
    }finally{p.close();}
  }
});
test('Home page exposes all eight exercise links and binds each week to its own training',async()=>{
  const p=await page(null);try{
    assert.equal(p.d.querySelectorAll('.home-exercise').length,8);
    assert.ok(p.d.querySelector('[data-open-current]').href.includes('woche-37'));
    assert.equal(p.d.querySelectorAll('[data-training-module]').length,2);
    assert.deepEqual([...p.d.querySelectorAll('[data-training-module]')].map(b=>b.dataset.trainingModule),['woche-37-2026','woche-36-2026']);
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
