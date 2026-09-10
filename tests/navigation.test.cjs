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
    w.HTMLElement.prototype.scrollIntoView=function(){};
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
test('Every public page loads the final readability layer last',()=>{
  const entries=['index.html','module/woche-36/index.html','module/woche-37/index.html','Designvorschau.html'];
  for(const entry of entries){
    const html=fs.readFileSync(path.join(root,entry),'utf8');
    const typography=html.lastIndexOf('ui-typography-v3.css?v=20260910-type31');
    assert.ok(typography>=0,`${entry}: verbindlicher Typografiestandard fehlt`);
    assert.ok(typography>html.lastIndexOf('practice-studio.css'),`${entry}: Typografiestandard muss zuletzt geladen werden`);
  }
  const css=fs.readFileSync(path.join(root,'assets/ui-typography-v3.css'),'utf8');
  assert.match(css,/--fr-type-copy:18px/);
  assert.match(css,/\.write-help-step,\s*\.writing-help-step\s*\{[^}]*font-size:var\(--fr-type-copy\)!important/s);
  assert.match(css,/@media \(max-width:760px\)\s*\{[\s\S]*--fr-type-copy:17\.5px/);
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
    const field=p.input('[data-learn-field="profile.school"]','Je suis à la BFF.');field.focus();field.setSelectionRange(4,9);p.w.scrollY=1370;
    const trigger=p.d.querySelector('.atelier-nav [data-nav-route="training"]');
    trigger.dispatchEvent(new p.w.MouseEvent('pointerdown',{bubbles:true}));trigger.focus();
    p.click('.atelier-nav [data-nav-route="training"]');await tick();
    assert.equal(p.w.location.hash,'#training');
    p.click('[data-nav-return]');await tick();
    assert.equal(p.w.location.hash,'#mission-2');assert.equal(p.w.scrollY,1370);
    assert.equal(p.d.querySelector('[data-learn-field="profile.school"]').value,'Je suis à la BFF.');
    assert.equal(p.d.activeElement.dataset.learnField,'profile.school');
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
test('Week 36 speaking tasks explain the revised classroom flow without seeded profile answers',async()=>{
  const seed={profile:{name:'Christoph Marti',className:''},answers:{},checks:{},ratings:{}};
  const p=await page(36,'#mission-5',{[keys[36]]:seed});try{
    const fields=[...p.d.querySelectorAll('#mission-5 [data-bind^="m5.line."]')];
    assert.equal(fields.length,8);assert.ok(fields.every(field=>field.value===''));
    assert.equal(p.d.querySelector('#m5ProfileList li').textContent,'Je m’appelle …');
    assert.equal(p.d.querySelectorAll('#mission-5 .activity-card').length,3);
    assert.match(p.d.querySelector('#mission-5').textContent,/Je pense que la phrase … est fausse/);
    assert.match(p.d.querySelector('#mission-5').textContent,/Oui, c’est ça/);

    p.choose('[data-nav-exercise]','mission-7');await tick(60);
    assert.match(p.d.querySelector('#mission-7').textContent,/heruntergeladene Präsentation «20 Questions»/);
    assert.match(p.d.querySelector('#mission-7').textContent,/nicht direkt in Teams/);
    assert.match(p.d.querySelector('#mission-7').textContent,/Ein Computer pro Dreiergruppe genügt/);

    p.choose('[data-nav-exercise]','mission-8');await tick(60);
    assert.equal(p.d.querySelector('[data-timer-start="m8Prep"]').dataset.seconds,'120');
    assert.equal(p.d.querySelector('[data-timer-start="m8Talk"]').dataset.seconds,'60');
    assert.ok(p.d.querySelector('[data-check="m8.round1.done"]'));
    assert.ok(p.d.querySelector('[data-check="m8.round2.done"]'));
    assert.ok(p.d.querySelector('[data-bind="m8.feedback1"]'));
    assert.ok(p.d.querySelector('[data-bind="m8.feedback2"]'));
    assert.doesNotMatch(p.d.querySelector('#mission-8').textContent,/Exit-Ticket/);
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('All four training deep links select the requested mode in both weeks',async()=>{
  for(const week of [36,37])for(const mode of ['cards','dictation','reaction','expert']){
    const p=await page(week,`#training/${mode}`);try{
      const selector=`[data-p-mode="${mode}"][aria-pressed="true"]`;
      assert.ok(p.d.querySelector(selector),`${week} ${mode}`);assert.deepEqual(p.errors.map(e=>e.message),[]);
    }finally{p.close();}
  }
});
test('Both weeks train all eight connector words with translations and sentence practice',async()=>{
  const connectors=[['et','und'],['aussi','auch'],['mais','aber'],['parce que','weil'],['surtout','vor allem'],['avec','mit'],['souvent','oft'],['par exemple','zum Beispiel']];
  const sentence='Je fais souvent du sport, par exemple le week-end.';
  for(const week of [36,37]){
    const p=await page(week,'#training/cards');try{
      assert.match(p.d.querySelector('.practice-task-top').textContent,/Verbindungswörter/);
      p.click('[data-p-history]');
      for(const [fr,de] of connectors){
        const open=[...p.d.querySelectorAll('[data-p-open]')].find(button=>button.textContent.trim()===fr);
        assert.ok(open,`${fr} fehlt in Woche ${week}`);open.click();
        assert.equal(p.d.querySelector('.practice-prompt').textContent.trim(),fr);
        assert.match(p.d.querySelector('.practice-task-top').textContent,/Verbindungswörter/);
        p.click('[data-p-reveal]');
        assert.equal(p.d.querySelector('.practice-answer').textContent.trim(),de);
      }
      assert.match(p.d.querySelector('.practice-table-wrap').textContent,new RegExp(sentence.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
      assert.deepEqual(p.errors.map(e=>e.message),[]);
    }finally{p.close();}
  }
});
test('Practice tracks recall, favorites, repetition, previous tasks and listening',async()=>{
  const p=await page(37,'#training/cards');try{
    const first=p.d.querySelector('.practice-prompt').textContent;
    p.click('[data-p-reveal]');assert.ok(p.d.querySelector('.practice-answer'));
    p.click('[data-p-favorite]');p.click('[data-p-listen]');assert.equal(p.voices.at(-1),first);
    p.click('[data-p-rate="again"]');p.click('[data-p-next]');assert.notEqual(p.d.querySelector('.practice-prompt').textContent,first);
    p.click('[data-p-previous]');assert.equal(p.d.querySelector('.practice-prompt').textContent,first);
    p.click('[data-p-next]');
    for(let i=0;i<3;i++){p.click('[data-p-reveal]');p.click('[data-p-rate="known"]');p.click('[data-p-next]');}
    assert.equal(p.d.querySelector('.practice-prompt').textContent,first);
    p.click('[data-p-next]');assert.notEqual(p.d.querySelector('.practice-prompt').textContent,first);
    await tick();assert.ok(Object.values(p.state().practiceV2.items).some(item=>item.assisted===1));
    p.choose('[data-p-filter]','favorites');assert.equal(p.d.querySelector('.practice-prompt').textContent,first);
    p.click('[data-p-mode="dictation"]');assert.match(p.d.querySelector('#practice-task-title').textContent,/keine/);
    p.click('[data-p-all]');assert.ok(p.d.querySelector('#practice-draft'));
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('Diktat assesses word order, provides help, and saves draft and counts',async()=>{
  const p=await page(37,'#training/dictation');try{
    p.click('[data-p-listen]');const target=p.voices.at(-1);
    p.input('#practice-draft',target);p.click('[data-p-check]');assert.match(p.d.querySelector('#practice-feedback').textContent,/Wortlaut und Reihenfolge stimmen/);
    await tick();assert.equal(p.state().practiceV2.items['dictation.0'].independent,1);
    p.click('[data-p-next]');p.click('[data-p-slow]');assert.ok(p.voices.at(-1));
    p.click('[data-p-hint]');p.input('#practice-draft',p.voices.at(-1));p.click('[data-p-check]');
    await tick();assert.equal(p.state().practiceV2.items['dictation.1'].assisted,1);
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
      const actual=p.state();for(const k of ['answers','choices','ratings','missionDone','missionLevels'])for(const entry of Object.keys(saved[k]))assert.deepEqual(actual[k][entry],saved[k][entry],`${week} ${k}.${entry}`);
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

test('W37 reuses real Marseille clauses and preserves corrections and intentional blanks',async()=>{
  const prev={answers:{'m5.line.0':'Samira','m5.line.1':'17','m5.line.2':'Bienne','m5.line.4':'je fais du sport','m5.line.7':'visiter le Canada'}};
  const saved={answers:{'profile.city':'Bern','profile.age':''}};
  const p=await page(37,'#mission-1',{[keys[36]]:prev,[keys[37]]:saved});try{
    assert.equal(p.d.querySelector('[data-learn-field="profile.name"]').value,'Samira');
    assert.equal(p.d.querySelector('[data-learn-field="profile.age"]').value,'');
    assert.equal(p.d.querySelector('[data-learn-field="profile.city"]').value,'Bern');
    assert.match(p.d.querySelector('[data-profile-line="4"]').textContent,/Dans mon temps libre, je fais du sport/);
    p.choose('[data-nav-exercise]','mission-2');assert.equal(p.d.querySelector('[data-learn-field="profile.job"]').value,'');
    p.input('[data-job-search]','MPA');assert.equal(p.d.querySelectorAll('[data-job-select] option').length,2);
    const select=p.d.querySelector('[data-job-select]');p.choose('[data-job-select]',select.options[1].value);p.click('[data-translate-job]');
    p.click('[data-job-form="frFemale"]');assert.equal(p.d.querySelector('[data-learn-field="profile.job"]').value,'assistante médicale');
    p.choose('[data-nav-exercise]','mission-5');assert.equal(p.d.querySelector('[data-learn-field="profile.job"]').value,'assistante médicale');
    p.choose('[data-learn-field="career.stageStatus"]','none');assert.match(p.d.querySelector('#missionMount').textContent,/Je n’ai pas encore fait de stage/);
    assert.ok(p.d.querySelector('[data-learn-field="career.liked"]'));
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('Sentence blocks retain personal text and undo; edited cue words persist',async()=>{
  const p=await page(37,'#mission-3',{[keys[36]]:{answers:{'m5.line.4':'je joue au football'}}});try{
    p.input('[data-learn-field="m3.hobby"]','Mon texte personnel');
    p.click('[data-insert="avec mes amis"]');assert.match(p.d.querySelector('[data-learn-field="m3.hobby"]').value,/Mon texte personnel/);
    p.click('[data-undo="m3.hobby"]');assert.equal(p.d.querySelector('[data-learn-field="m3.hobby"]').value,'Mon texte personnel');
    p.choose('[data-nav-exercise]','mission-6');p.input('[data-learn-field="cue.1"]','football · samedi');
    p.click('[data-card-view="hidden"]');assert.doesNotMatch(p.d.querySelector('#learning-cue').textContent,/football/);
    p.click('[data-card-view="words"]');assert.match(p.d.querySelector('#learning-cue').textContent,/football · samedi/);
    assert.deepEqual(p.errors.map(e=>e.message),[]);
  }finally{p.close();}
});
test('Four listening profiles have six questions, real audio, and checked results',async()=>{
 const p=await page(37,'#mission-4');try{
  for(const name of ['nora','yanis','leila','luca']){
   p.click(`[data-listen-profile="${name}"]`);assert.equal(p.d.querySelectorAll('.listening-question').length,6);
   const audio=p.d.querySelector('#profile-audio');assert.ok(fs.statSync(path.join(root,new URL(audio.src).pathname)).size>100000);
   for(let i=0;i<6;i++)p.input(`[data-learning-listen="${name}"][data-question-index="${i}"]`,'0');
   p.click('[data-learning-check-listen]');assert.match(p.d.querySelector('#listening-total').textContent,/6 richtig/);
  }
  assert.deepEqual(p.errors.filter(e=>!/HTMLMediaElement/.test(e.message)).map(e=>e.message),[]);
 }finally{p.close();}
});
test('Video assessment states full-body, independent speech and real Teams hand-in on every level',async()=>{
 const p=await page(37,'#mission-8');try{
   const text=p.d.querySelector('#missionMount').textContent;
   for(const phrase of ['60 Sekunden','Kopf bis Fuss','ohne sprachliche Hilfe','Abgabebestätigung in Teams'])assert.ok(text.includes(phrase),phrase);
   assert.ok(p.d.querySelector('[data-video="camera"]'));assert.ok(p.d.querySelector('[data-check="m8.submitted"]'));
   assert.equal(p.d.querySelector('#learning-cue'),null);
   assert.deepEqual(p.errors.map(e=>e.message),[]);
 }finally{p.close();}
});
test('Spaced practice advances only on distinct days and caps points without erasing effort',()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/practice-studio.js'),'utf8'),context);
 const core=context.window.FranzPractice,p=core.initial(),now=new Date('2026-09-09T12:00:00').getTime();
 core.record(p,'cards.1','known','self',now);core.record(p,'cards.1','known','self',now+1000);core.record(p,'cards.1','known','self',now+2000);
 assert.equal(p.xp,15);assert.equal(p.items['cards.1'].attempts,3);assert.equal(p.items['cards.1'].level,1);
 core.record(p,'cards.1','known','self',now+86400000);assert.equal(p.items['cards.1'].level,2);
 core.record(p,'cards.1','again','self',now+2*86400000);assert.equal(p.items['cards.1'].level,0);assert.equal(p.items['cards.1'].assisted,1);
});

test('Older internship answers and changed career intentions stay consistent in the spoken profile',async()=>{
 const saved={answers:{'m5.job':'assistant médical','m5.stageLike':'J’ai aimé le contact avec les clients.','m3.job':'Je voudrais devenir assistant médical parce que j’aime aider les gens.'}};
 const p=await page(37,'#mission-5',{[keys[37]]:saved});try{
  assert.equal(p.d.querySelector('[data-learn-field="career.liked"]').value,saved.answers['m5.stageLike']);
  p.input('[data-learn-field="profile.job"]','cuisinière');
  p.choose('[data-learn-field="profile.jobStatus"]','undecided');
  const text=p.d.querySelector('[data-live-career]').textContent;
  assert.match(text,/Je n’ai pas encore choisi/);assert.match(text,/cuisinière/);assert.doesNotMatch(text,/assistant médical/);
  assert.doesNotMatch(text,/Je voudrais devenir/);
  p.choose('[data-learn-field="career.stageStatus"]','none');
  assert.equal(p.d.querySelector('[data-learn-field="career.liked"]').placeholder,'Je voudrais découvrir … parce que …');
  assert.deepEqual(p.errors.map(e=>e.message),[]);
 }finally{p.close();}
});
test('Occupation catalogue is complete, unique and linked to official bilingual profiles',()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/berufe-de-fr.js'),'utf8'),context);
 const jobs=context.window.FranzOccupations;assert.equal(jobs.length,246);assert.equal(new Set(jobs.map(j=>j.id)).size,246);
 for(const j of jobs){assert.ok(j.frMale&&j.frFemale);assert.match(j.sourceDe,/^https:\/\/www.berufsberatung.ch\/de\/berufe\//);assert.match(j.sourceFr,/^https:\/\/www.orientation.ch\/fr\/professions\//);assert.equal(j.qualificationFr,j.qualification==='EFZ'?'CFC':'AFP');}
});
test('Video camera is permitted by production headers; recorder stops tracks and offers a local file',async()=>{
 const worker=fs.readFileSync(path.resolve(root,'../src/index.js'),'utf8');assert.match(worker,/camera=\(self\)/);
 const p=await page(37,'#mission-8');try{
  let stopped=0,recorder;
  Object.defineProperty(p.w.navigator,'mediaDevices',{value:{getUserMedia:async()=>({getTracks:()=>[{stop:()=>stopped++}]})},configurable:true});
  p.w.HTMLMediaElement.prototype.play=async()=>{};
  p.w.URL.createObjectURL=()=> 'blob:local-recording';p.w.URL.revokeObjectURL=()=>{};
  p.w.MediaRecorder=class{static isTypeSupported(type){return type==='video/webm';}constructor(){this.state='inactive';this.mimeType='video/webm';recorder=this;}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable({data:new p.w.Blob(['test recording'],{type:'video/webm'})});this.onstop();}};
  p.click('[data-video="camera"]');await tick(20);p.click('[data-video="start"]');assert.equal(recorder.state,'recording');
  p.click('[data-video="stop"]');assert.ok(stopped>0);assert.equal(p.d.querySelector('#video-download').hidden,false);assert.match(p.d.querySelector('#video-download').download,/webm$/);
  p.choose('[data-nav-exercise]','mission-7');p.choose('[data-nav-exercise]','mission-8');assert.equal(p.d.querySelector('#video-download').hidden,false);
  assert.deepEqual(p.errors.map(e=>e.message),[]);
 }finally{p.close();}
});
