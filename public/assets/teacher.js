(() => {
'use strict';
const TOPIC_ID='se-presenter-2026';
const catalog=window.FRANZ_TOPIC_CATALOG || {vocabulary:[]};
const vocab=catalog.vocabulary || [];
let groupId='GS1CD', tab='progress', roster=null, dashboard=null, config=null;
let learnSet=new Set(), testSet=new Set(), vocabSearch='', studentSearch='', classFilter='all';
let toastTimer=null;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normal=(v='')=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

async function api(path,options={}){
  const response=await fetch(path,{...options,headers:{'content-type':'application/json',...(options.headers||{})},cache:'no-store'});
  let data={}; try{data=await response.json();}catch(_){}
  if(!response.ok||!data.ok){const err=new Error(data.message||data.error||`HTTP ${response.status}`);err.code=data.error;throw err;}
  return data;
}
function toast(message){const el=$('#teacherToast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}
function fmtDate(ts){if(!ts)return 'Noch keine Daten';return new Intl.DateTimeFormat('de-CH',{dateStyle:'short',timeStyle:'short'}).format(new Date(ts));}
function activeGroup(){return roster?.groups?.find(g=>g.id===groupId)||null;}

function renderTabs(){
  $$('[data-tab]').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.tab===tab));
  $('#progressPanel').hidden=tab!=='progress';
  $('#vocabularyPanel').hidden=tab!=='vocabulary';
}
function renderGroupHeader(){
  $$('[data-group]').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.group===groupId));
  const group=activeGroup();
  $('#sourceNote').textContent=group ? `${group.label}: ${group.sourceLabel} · ${group.count} Lernende` : '';
  const classes=[...new Set((group?.students||[]).map(s=>s.classCode))];
  $('#classFilter').innerHTML='<option value="all">Alle</option>'+classes.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
  classFilter='all';
}
function renderMetrics(){
  const students=dashboard?.students||[];
  const active=students.filter(s=>s.hasProgress).length;
  const completed=students.length?Math.round(students.reduce((sum,s)=>sum+s.missionCount,0)/students.length*10)/10:0;
  const checks=students.map(s=>s.lastCheck).filter(Boolean);
  const checkAvg=checks.length?Math.round(checks.reduce((sum,c)=>sum+c.percent,0)/checks.length):0;
  const secure=students.reduce((sum,s)=>sum+(s.vocab?.secure||0),0);
  const vocabSlots=students.length*(dashboard?.config?.learnIds?.length||0);
  const securePct=vocabSlots?Math.round(secure/vocabSlots*100):0;
  $('#metrics').innerHTML=`
    <article class="${active===students.length?'good':''}"><small>Mit Arbeitsstand</small><strong>${active}/${students.length}</strong></article>
    <article><small>Ø erledigte Übungen</small><strong>${completed}/8</strong></article>
    <article class="${securePct>=70?'good':'warn'}"><small>Vocabulaire zuverlässig</small><strong>${securePct}%</strong></article>
    <article><small>Ø letzter Probe-Check</small><strong>${checks.length?checkAvg+'%':'—'}</strong></article>`;
}
function renderStudents(){
  const rows=$('#studentRows');
  const group=activeGroup();
  const list=(dashboard?.students||[]).filter(s=>{
    if(classFilter!=='all'&&s.classCode!==classFilter)return false;
    const term=normal(studentSearch);
    if(term&&!normal(`${s.firstName} ${s.lastName} ${s.email}`).includes(term))return false;
    return true;
  });
  if(!list.length){rows.innerHTML='<tr><td colspan="5">Keine Lernenden in dieser Auswahl.</td></tr>';return;}
  rows.innerHTML=list.map(s=>{
    const done=new Set(s.missionDone||[]);
    return `<tr>
      <td class="student-name"><strong>${esc(s.firstName)} ${esc(s.lastName)}</strong><small>${esc(s.classCode)} · ${esc(s.email)}</small></td>
      <td><div class="mission-chips">${Array.from({length:8},(_,i)=>i+1).map(id=>`<i class="${done.has(id)?'done':''} ${s.currentMission===id?'current':''}">${done.has(id)?'✓':id}</i>`).join('')}</div><small class="muted">${s.missionCount}/8 erledigt</small></td>
      <td><div class="mastery-mini"><span class="secure">${s.vocab?.secure||0} sicher</span><span class="uncertain">${s.vocab?.uncertain||0} unsicher</span><span class="learn">${s.vocab?.learn||0} lernen</span></div></td>
      <td>${s.lastCheck?`<span class="check-badge">${s.lastCheck.percent}% · ${s.lastCheck.correct}/${s.lastCheck.total}</span><small class="muted">${fmtDate(s.lastCheck.at)}</small>`:'<span class="muted">Noch kein Check</span>'}</td>
      <td>${s.lastSeenAt?fmtDate(s.lastSeenAt):'<span class="muted">Noch nie online</span>'}</td>
    </tr>`;
  }).join('');
}
function renderConfigSummary(){
  $('#learnCount').textContent=String(learnSet.size);
  $('#testCount').textContent=String(testSet.size);
  $('#configStatus').textContent=config?.configured?`Gespeichert ${fmtDate(config.updatedAt)}`:'Standard: alle Wörter';
}
function renderVocabulary(){
  const term=normal(vocabSearch);
  const rows=vocab.filter(item=>!term||normal(`${item.fr} ${item.de} ${item.category}`).includes(term));
  $('#vocabRows').innerHTML=rows.map(item=>{
    const learn=learnSet.has(item.id),test=testSet.has(item.id);
    return `<tr class="${test?'is-test':''} ${learn?'':'is-off'}" data-vocab-row="${item.id}">
      <td lang="fr">${esc(item.fr)}</td><td>${esc(item.de)}</td><td><small>${esc(item.category)}</small></td>
      <td><input type="checkbox" data-learn-id="${item.id}" ${learn?'checked':''} aria-label="${esc(item.fr)} lernen"></td>
      <td><input type="checkbox" data-test-id="${item.id}" ${test?'checked':''} aria-label="${esc(item.fr)} Lernkontrolle"></td>
    </tr>`;
  }).join('');
  renderConfigSummary();
}
async function loadRoster(){
  roster=await api('/api/teacher/roster');
  renderGroupHeader();
}
async function loadProgress(){
  $('#studentRows').innerHTML='<tr><td colspan="5">Arbeitsstand wird geladen …</td></tr>';
  dashboard=await api(`/api/teacher/dashboard?group=${encodeURIComponent(groupId)}&topicId=${encodeURIComponent(TOPIC_ID)}`,{headers:{}});
  renderMetrics();renderStudents();
}
async function loadConfig(){
  config=await api(`/api/teacher/vocabulary?group=${encodeURIComponent(groupId)}&topicId=${encodeURIComponent(TOPIC_ID)}`,{headers:{}});
  learnSet=new Set(config.learnIds||[]);
  testSet=new Set(config.testIds||[]);
  renderVocabulary();
}
async function switchGroup(id){
  groupId=id;renderGroupHeader();
  await Promise.all([loadProgress(),loadConfig()]);
}
async function saveFor(group){
  const body={groupId:group,topicId:TOPIC_ID,learnIds:[...learnSet],testIds:[...testSet]};
  return api('/api/teacher/vocabulary',{method:'PUT',body:JSON.stringify(body)});
}
async function saveCurrent(){
  $('#saveVocabulary').disabled=true;
  try{config=await saveFor(groupId);renderConfigSummary();toast(`Wortschatz für ${groupId} gespeichert.`);await loadProgress();}
  catch(e){toast(`Speichern fehlgeschlagen: ${e.message}`);}
  finally{$('#saveVocabulary').disabled=false;}
}
async function saveBoth(){
  $('#saveBoth').disabled=true;
  try{await Promise.all(['GS1CD','GS1AF'].map(saveFor));toast('Wortschatz für beide Gruppen gespeichert.');await loadProgress();}
  catch(e){toast(`Speichern fehlgeschlagen: ${e.message}`);}
  finally{$('#saveBoth').disabled=false;}
}
function bulk(action){
  if(action==='learn-all')vocab.forEach(v=>learnSet.add(v.id));
  if(action==='learn-none'){learnSet.clear();testSet.clear();}
  if(action==='test-all'){vocab.forEach(v=>{if(learnSet.has(v.id))testSet.add(v.id);});}
  if(action==='test-none')testSet.clear();
  renderVocabulary();
}
function bind(){
  document.addEventListener('click',event=>{
    const g=event.target.closest('[data-group]');if(g){switchGroup(g.dataset.group);return;}
    const t=event.target.closest('[data-tab]');if(t){tab=t.dataset.tab;renderTabs();return;}
    const b=event.target.closest('[data-bulk]');if(b){bulk(b.dataset.bulk);return;}
  });
  document.addEventListener('change',event=>{
    const learn=event.target.dataset.learnId;
    if(learn){if(event.target.checked)learnSet.add(learn);else{learnSet.delete(learn);testSet.delete(learn);}renderVocabulary();return;}
    const test=event.target.dataset.testId;
    if(test){if(event.target.checked){testSet.add(test);learnSet.add(test);}else testSet.delete(test);renderVocabulary();return;}
    if(event.target.id==='classFilter'){classFilter=event.target.value;renderStudents();}
  });
  $('#studentSearch').addEventListener('input',e=>{studentSearch=e.target.value;renderStudents();});
  $('#vocabSearch').addEventListener('input',e=>{vocabSearch=e.target.value;renderVocabulary();});
  $('#refreshProgress').addEventListener('click',()=>loadProgress().then(()=>toast('Arbeitsstand aktualisiert.')).catch(e=>toast(e.message)));
  $('#saveVocabulary').addEventListener('click',saveCurrent);
  $('#saveBoth').addEventListener('click',saveBoth);
}
async function init(){
  bind();
  try{
    const me=await api('/api/teacher/me',{headers:{}});
    $('#teacherEmail').textContent=me.email;
    await loadRoster();
    await Promise.all([loadProgress(),loadConfig()]);
  }catch(error){
    $('#teacherEmail').textContent='Zugriff nicht verfügbar';
    $('#studentRows').innerHTML=`<tr><td colspan="5">Der Lehrpersonenbereich konnte nicht geladen werden: ${esc(error.message)}</td></tr>`;
    toast(error.message);
  }
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();