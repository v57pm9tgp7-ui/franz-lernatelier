const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const base=path.join(__dirname,'../public/module/woche-45');
function boot(hash='start',initial={}) {
  const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
  const dom=new JSDOM(html,{url:'https://franzatelier.com/module/woche-45/#'+hash,runScripts:'outside-only'});
  dom.window.scrollTo=()=>{};
  dom.window.localStorage.setItem('franzoesischLernatelierW45_v1',JSON.stringify(initial));
  dom.window.eval(fs.readFileSync(path.join(base,'content.js'),'utf8'));
  dom.window.eval(fs.readFileSync(path.join(base,'woche45.js'),'utf8'));
  return dom;
}
const click=(d,s)=>d.window.document.querySelector(s).click();
const change=(d,s,v)=>{const x=d.window.document.querySelector(s);x.value=v;x.dispatchEvent(new d.window.Event('change',{bubbles:true}));};
const submit=(d,s)=>d.window.document.querySelector(s).dispatchEvent(new d.window.Event('submit',{bubbles:true,cancelable:true}));
test('W45 routes offer the intended four phases, class game, checks and downloads',()=>{
  for(const hash of ['start','mission-1','mission-2','mission-3','mission-4','classe','bilan','material','check-numbers','check-times','check-verbs']){
    const d=boot(hash);assert.ok(d.window.document.querySelector('main h1')?.textContent);assert.equal(d.window.document.querySelectorAll('.mainnav a').length,5);d.window.close();
  }
  const d=boot();assert.equal(d.window.document.querySelectorAll('.flowcard').length,4);d.window.close();
});
test('Every market case has a feasible price, shared time and exact place; boundaries reject impossible deals',()=>{
  const d=boot('mission-2');
  for(const c of d.window.W45_CONTENT.market.cases){
    assert.ok(c.solution.times.length>0);assert.ok(c.solution.price_min<=c.solution.price_max);
    const check=d.window.W45.evaluateAgreement;
    for(const price of [c.solution.price_min,c.solution.price_max])assert.ok(Object.values(check(c,price,c.solution.times[0],c.solution.place_fr)).every(Boolean));
    assert.equal(check(c,c.solution.price_min-1,c.solution.times[0],c.solution.place_fr).price,false);
    assert.equal(check(c,c.solution.price_max+1,c.solution.times[0],c.solution.place_fr).price,false);
    assert.equal(check(c,'',c.solution.times[0],c.solution.place_fr).price,false);
    assert.equal(check(c,c.solution.price_min,'01:00',c.solution.place_fr).time,false);
    assert.equal(check(c,c.solution.price_min,c.solution.times[0],'ailleurs').place,false);
    for(const t of c.solution.times){assert.ok(c.seller.available_times.includes(t));assert.ok(c.buyer.available_times.includes(t));}
  }d.window.close();
});
test('Role switching renders only the active private card; coach and case change reveal no secret boundaries',()=>{
  const d=boot('mission-2'),doc=d.window.document;
  assert.equal(doc.querySelector('.rolecard'),null);
  click(d,'[data-role=buyer]');assert.match(doc.querySelector('.rolecard').textContent,/höchstes Budget/);assert.doesNotMatch(doc.querySelector('.rolecard').textContent,/Mindestpreis/);
  click(d,'[data-role=seller]');assert.match(doc.querySelector('.rolecard').textContent,/Mindestpreis/);assert.doesNotMatch(doc.querySelector('.rolecard').textContent,/höchstes Budget/);
  click(d,'[data-role=coach]');assert.doesNotMatch(doc.querySelector('.rolecard').textContent,/CHF|16:30|17:15|18:00/);
  change(d,'#marketCase','M2');assert.equal(doc.querySelector('.rolecard'),null);d.window.close();
});
test('Agreement draft survives viewing the role and returns concrete feedback without disclosing price ranges',()=>{
  const d=boot('mission-2'),doc=d.window.document;
  doc.querySelector('#dealPrice').value='50';doc.querySelector('#dealTime').value='16:30';doc.querySelector('#dealPlace').value='à la gare';
  click(d,'[data-role=buyer]');assert.equal(doc.querySelector('#dealPrice').value,'50');
  submit(d,'#agreementForm');assert.match(doc.querySelector('#dealFeedback').textContent,/passt zu beiden/);
  doc.querySelector('#dealPrice').value='20';submit(d,'#agreementForm');assert.match(doc.querySelector('#dealFeedback').textContent,/Preisgrenzen/);assert.doesNotMatch(doc.querySelector('#dealFeedback').textContent,/45|50/);d.window.close();
});
test('Partner plans each have three differences and reveal the comparison only after three choices',()=>{
  const d=boot('mission-3'),doc=d.window.document;
  for(const set of d.window.W45_CONTENT.partner.sets){
    assert.equal(set.events.filter(e=>e.time_A!==e.time_B).length,3);
    change(d,'#partnerSet',set.id);assert.equal(doc.querySelector('#partnerSolution').textContent,'');
    click(d,'[data-partner-role=A]');assert.equal(doc.querySelectorAll('tbody time').length,6);
    submit(d,'#partnerCheck');assert.equal(doc.querySelector('#partnerSolution').textContent,'');
    for(const n of set.different_rows)doc.querySelector(`input[name=different][value="${n}"]`).checked=true;
    submit(d,'#partnerCheck');assert.match(doc.querySelector('#partnerFeedback').textContent,/Alle drei/);assert.match(doc.querySelector('#partnerSolution').textContent,/Plan A/);assert.equal(doc.querySelectorAll('#partnerSolution tbody tr').length,3);
  }d.window.close();
});
test('Class game hides the price words until reveal and resets them on the next round',()=>{
  const d=boot('classe'),doc=d.window.document;
  for(let i=0;i<4;i++){
    assert.equal(doc.querySelector('.reveal'),null);click(d,'[data-action=price-reveal]');assert.match(doc.querySelector('.reveal').textContent,new RegExp(d.window.W45_CONTENT.price_game.rounds[i].price_fr));
    if(i<3)click(d,'[data-action=price-next]');
  }d.window.close();
});
test('Local state updates preserve existing mission and unrelated fields; check grading accepts Swiss variants and time notation',()=>{
  const d=boot('mission-4',{missionDone:{1:true},custom:'keep'}),doc=d.window.document;
  const box=doc.querySelector('[data-complete="4"]');box.checked=true;box.dispatchEvent(new d.window.Event('change',{bubbles:true}));
  const saved=JSON.parse(d.window.localStorage.getItem(d.window.W45.KEY));assert.equal(saved.custom,'keep');assert.equal(saved.missionDone[1],true);assert.equal(saved.missionDone[4],true);
  const check=d.window.W45.checkAnswer;assert.equal(check({answer:'16:30'},'16h30'),true);assert.equal(check({answer:'16:30'},'16.30'),true);assert.equal(check({accepted:['soixante-quinze','septante-cinq']},'septante-cinq'),true);assert.equal(check({answer:'finissons'},'finons'),false);d.window.close();
});
test('Learning check freezes the first attempt after showing answers',()=>{
  const d=boot('check-verbs'),doc=d.window.document;
  for(const [i,q] of d.window.W45_CONTENT.checks.verbs.entries())doc.querySelector('#answer-'+i).value=(q.accepted||[q.answer])[0];
  submit(d,'#learningCheck');assert.match(doc.querySelector('#checkSummary').textContent,/6 von 6/);assert.ok(doc.querySelector('#answer-0').readOnly);assert.ok(doc.querySelector('button[type=submit]').disabled);d.window.close();
});
