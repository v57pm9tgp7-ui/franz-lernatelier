const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const root='public/';
function shell(){
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://franzatelier.com/',runScripts:'outside-only'});
 const w=dom.window;w.scrollTo=()=>{};w.document.write=()=>{};w.FranzNavigation={restoreIncoming(){},rememberTraining(){}};
 w.localStorage.setItem('franzW44Poster_v2',JSON.stringify({missionDone:{1:true},answers:{old:'kept'}}));
 w.localStorage.setItem('franzoesischLernatelierW45_v1',JSON.stringify({missionDone:{1:true,2:true},currentMission:3,globalLevel:'standard'}));
 w.eval(fs.readFileSync(root+'data/modules.js','utf8'));w.eval(fs.readFileSync(root+'assets/app.js','utf8'));
 w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 return dom;
}
test('W46 is the single current module and earlier progress is preserved',()=>{
 const d=shell(),w=d.window;const current=w.FRANZ_MODULES.filter(m=>m.status==='current');
 assert.equal(current.length,1);assert.equal(current[0].week,46);
 assert.equal(w.FRANZ_MODULES.find(m=>m.week===45).status,'previous');
 assert.equal(JSON.parse(w.localStorage.getItem('franzoesischLernatelierW45_v1')).currentMission,3);
 assert.equal(w.FRANZ_MODULES.find(m=>m.week===44).status,'previous');
 assert.equal(JSON.parse(w.localStorage.getItem('franzW44Poster_v2')).answers.old,'kept');
 assert.equal(w.document.querySelector('#headingWeek').textContent,'46');
 assert.equal(w.document.querySelector('#progressValue').textContent,'0%');
 assert.equal(w.document.querySelector('.next-card [data-open-next]').getAttribute('href'),'module/woche-46/index.html#zahlen');d.window.close();
});
test('The current week exposes three focused trainings and six visible lesson steps',()=>{
 const d=shell(),w=d.window,m=w.FRANZ_MODULES.find(m=>m.week===46);
 assert.deepEqual(Array.from(m.missionList,x=>x.id),[1,2,3,4,5,6]);
 assert.deepEqual(Array.from(m.training,x=>x.id),['verbs','numbers','times']);
 assert.equal(w.document.querySelector('#quickTrainingGrid').querySelectorAll('[data-start-training]').length,3);
 assert.ok(fs.existsSync(root+m.href));
 assert.doesNotMatch(w.document.querySelector('[data-view="home"]').textContent,/Vorbereitung auf den Verbentest Woche 44/);d.window.close();
});
