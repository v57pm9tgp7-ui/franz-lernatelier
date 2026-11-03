const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const P=require('../public/module/woche-45/training.js');
const dir=path.resolve(__dirname,'../public/module/woche-45');

test('Number grammar handles cent, vingt, mille and million boundaries',()=>{
  const expected={0:'zéro',21:'vingt et un',71:'soixante et onze',80:'quatre-vingts',81:'quatre-vingt-un',91:'quatre-vingt-onze',200:'deux cents',201:'deux cent un',280:'deux cent quatre-vingts',1000:'mille',2000:'deux mille',80000:'quatre-vingt mille',200000:'deux cent mille',280000:'deux cent quatre-vingt mille',200100:'deux cent mille cent',1000000:'un million',80000000:'quatre-vingts millions',200000000:'deux cents millions'};
  for(const [n,text] of Object.entries(expected)) assert.equal(P.number(+n),text,n);
  assert.equal(P.number(71,'ch'),'septante et un');
  assert.equal(P.number(91,'ch'),'nonante et un');
  assert.equal(P.number(81,'huit'),'huitante et un');
  for(const n of [-1,1.5,NaN,1e9]) assert.throws(()=>P.number(n),RangeError);
});
test('French and Swiss forms, hyphen conventions and accent feedback are distinguished from spelling errors',()=>{
  for(const a of ['quatre-vingt-un','huitante et un','huitante-et-un'])assert.equal(P.numberAnswer(81,a).ok,true,a);
  for(const a of ['deux cent trois','deux-cent-trois'])assert.equal(P.numberAnswer(203,a).ok,true,a);
  assert.deepEqual(P.numberAnswer(0,'zero'),{ok:true,accent:true});
  for(const [n,a] of [[81,'quatre-vingts-un'],[203,'deux cents trois'],[200000,'deux cents mille'],[2000,'deux milles'],[1000000,'un millions']])assert.equal(P.numberAnswer(n,a).ok,false,a);
});
test('Numeric answers allow thousands separators without silently removing decimal points',()=>{
  for(const a of ['1000',"1'000",'1 000','1.000','1,000'])assert.equal(P.numericAnswer(1000,a).ok,true,a);
  for(const a of ['1.5','1,5','1 5','15 francs','-15','1e1'])assert.equal(P.numericAnswer(15,a).ok,false,a);
  assert.equal(P.numericAnswer(0,'').ok,false);
});
test('Time answers handle gender, midnight, midday, quarters and day context',()=>{
  const examples=[[0,0,'Il est minuit.'],[0,0,'zéro heure'],[12,30,'Il est midi et demi.'],[0,30,'minuit et demi'],[1,30,'une heure et demie'],[18,30,'six heures et demie du soir'],[18,30,'dix-huit heures trente'],[18,30,'dix-huit heures et demie'],[21,15,'vingt et une heures et quart'],[8,45,'neuf heures moins le quart'],[11,45,'midi moins le quart'],[23,50,'minuit moins dix']];
  for(const [h,m,a] of examples)assert.equal(P.timeAnswer(h,m,a).ok,true,a);
  for(const [h,m,a] of [[18,30,'six heures et demi'],[12,30,'midi et demie'],[8,30,'huit heures et quart'],[18,30,'six heures et demie du matin'],[21,15,'vingt et un heures quinze']])assert.equal(P.timeAnswer(h,m,a).ok,false,a);
  for(const a of ['8:05','08:05','8h05','08 h 05'])assert.equal(P.digitAnswer(8,5,a).ok,true,a);
  assert.equal(P.digitAnswer(18,30,'6:30').ok,false);
  assert.equal(P.digitAnswer(8,5,'8:5').ok,false);
});
test('Each generator yields unique questions and accepts its displayed solution',()=>{
  for(const [topic,range,kinds] of [['quiet',100,['mixed']],['numbers',100,['mixed','numberRead','numberWrite','numberListen']],['numbers',1000,['mixed']],['numbers',1000000,['mixed']],['times',100,['mixed','timeRead','timeWrite','analog','preposition','later','timeListen']]]){
    for(const kind of kinds){const qs=P.pool(topic,range,kind);assert.ok(qs.length>=6);assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);for(const q of qs){assert.equal(P.grade(q,q.answer).ok,true,`${q.id}: ${q.answer}`);assert.equal(P.grade(q,'unrelated').ok,false,q.id);}}
  }
  const quiet=P.pool('quiet');assert.ok(quiet.some(q=>q.topic==='numbers'));assert.ok(quiet.some(q=>q.topic==='times'));
  assert.ok(quiet.every(q=>!q.kind.endsWith('Listen')&&(q.topic!=='numbers'||q.n<=100)));
  for(let n=0;n<=1000;n++) for(const v of ['fr','ch','huit'])assert.equal(P.numberAnswer(n,P.number(n,v)).ok,true,`${n} ${v}`);
});
test('Later/earlier arithmetic crosses midnight accurately',()=>{
  const later=P.makeQuestion('later',0,0,5,15);assert.match(later.prompt,/23:50/);assert.equal(P.grade(later,'minuit cinq').ok,true);
  const earlier=P.makeQuestion('later',0,23,50,-15);assert.match(earlier.prompt,/00:05/);assert.equal(P.grade(earlier,'minuit moins dix').ok,true);
});
test('Clock feedback explains content errors; syntax hints are reserved for malformed answers',()=>{
  const q=P.makeQuestion('analog',0,1,30);
  assert.match(P.explanation(q,'02:30'),/lange Zeiger zeigt auf 6: 30 Minuten/);
  assert.match(P.explanation(q,'02:30'),/zwischen 1 und 2; die Stunde ist noch 1/);
  assert.doesNotMatch(P.explanation(q,'02:30'),/Doppelpunkt/);
  assert.match(P.explanation(q,'0230'),/Doppelpunkt/);
  const read=P.makeQuestion('timeRead',0,18,30);
  assert.match(P.explanation(read,'06:30'),/18 Stunden und 30 Minuten/);
});
test('Help and immediate repairs do not create mastery; a later day clears a learning point',()=>{
  const s={items:{}},q=P.makeQuestion('numberWrite',71),day=Date.UTC(2026,10,3);
  P.record(s,q,{ok:false,helped:false},day);assert.equal(s.items[q.id].needsWork,true);
  P.record(s,{...q,repair:true},{ok:true,helped:false},day+100);assert.equal(s.items[q.id].attempts,1);assert.equal(s.items[q.id].days.length,0);
  P.record(s,q,{ok:true,helped:true},day+200);assert.equal(s.items[q.id].days.length,0);
  P.record(s,q,{ok:true,helped:false},day+300);assert.equal(s.items[q.id].needsWork,true);
  P.record(s,q,{ok:true,helped:false},day+400);assert.equal(s.items[q.id].days.length,1);
  P.record(s,q,{ok:true,helped:false},day+86400000);assert.equal(s.items[q.id].needsWork,false);assert.equal(s.items[q.id].days.length,2);
});

function dom(hash='quiet',seed){
  const d=new JSDOM(fs.readFileSync(path.join(dir,'training.html'),'utf8'),{url:`https://franzatelier.com/module/woche-45/training.html#${hash}`,runScripts:'outside-only'});
  d.window.HTMLElement.prototype.scrollIntoView=function(){};
  if(seed!==undefined)d.window.localStorage.setItem(P.KEY,seed);
  d.window.eval(fs.readFileSync(path.join(dir,'training.js'),'utf8'));return d;
}
function submit(d,answer){const w=d.window;w.document.getElementById('answer').value=answer;w.document.getElementById('answerForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));}
function currentNumber(d){const text=d.window.document.getElementById('prompt').textContent;return P.pool('numbers',100,'numberRead').find(q=>q.prompt===text);}
test('Correct answers cannot be counted twice by repeated clicks or repeated submissions',()=>{
  const d=dom('numbers'),w=d.window,doc=w.document;doc.getElementById('kind').value='numberRead';doc.getElementById('start').click();
  const q=currentNumber(d);assert.ok(q);submit(d,q.answer);doc.getElementById('check').click();
  let state=JSON.parse(w.localStorage.getItem(P.KEY));assert.equal(state.items[q.id].attempts,1);
  doc.getElementById('answerForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  state=JSON.parse(w.localStorage.getItem(P.KEY));assert.equal(state.items[q.id].attempts,1);assert.equal(doc.getElementById('answer').value,'');d.window.close();
});
test('A tip marks a correct answer assisted and excludes it from successful days',()=>{
  const d=dom('numbers'),doc=d.window.document;doc.getElementById('kind').value='numberRead';doc.getElementById('start').click();const q=currentNumber(d);doc.getElementById('hint').click();submit(d,q.answer);
  const state=JSON.parse(d.window.localStorage.getItem(P.KEY));assert.equal(state.items[q.id].lastHelp,true);assert.equal(state.items[q.id].needsWork,true);assert.equal(state.items[q.id].days.length,0);assert.match(doc.getElementById('feedback').textContent,/Unterstützung/);d.window.close();
});
test('Empty responses do not count, stopping preserves completed attempts, corrupt storage does not block startup',()=>{
  const d=dom('quiet','{broken'),doc=d.window.document;doc.getElementById('start').click();submit(d,'');assert.match(doc.getElementById('feedback').textContent,/zuerst eine Antwort/);assert.deepEqual(JSON.parse(d.window.localStorage.getItem(P.KEY)).items,{});doc.getElementById('stop').click();assert.equal(doc.getElementById('result').hidden,false);assert.equal(d.window.localStorage.getItem('franzoesischLernatelierW45_v1'),null);d.window.close();
});
test('Completing a quiet round marks only quiet mission and preserves other module state',()=>{
  const d=dom(),w=d.window,doc=w.document;
  w.localStorage.setItem('franzoesischLernatelierW45_v1',JSON.stringify({missionDone:{2:true},globalLevel:'support',agreements:['saved']}));
  doc.getElementById('start').click();
  for(let i=0;i<6;i++){
    const prompt=doc.getElementById('prompt').textContent;const qs=P.pool('quiet');let q=qs.find(x=>x.prompt===prompt);
    if(q&&q.kind==='analog') {submit(d,'wrong');} else {assert.ok(q,prompt);submit(d,q.answer);}
    doc.getElementById('next').click();
  }
  // Any repair questions also require completion; feedback provides the model answer.
  let guard=0;while(doc.getElementById('result').hidden&&guard++<5){submit(d,'wrong');doc.getElementById('next').click();}
  const state=JSON.parse(w.localStorage.getItem('franzoesischLernatelierW45_v1'));assert.equal(state.missionDone[1],true);assert.equal(state.missionDone[2],true);assert.equal(state.missionDone[4],undefined);assert.equal(state.globalLevel,'support');assert.deepEqual(state.agreements,['saved']);d.window.close();
});
