(() => {
'use strict';
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => Array.from(root.querySelectorAll(s));
const h = (value) => String(value == null ? '' : value).replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLocal = () => {const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
const niceDate = (d,short=false) => {try{return new Date(d+'T12:00:00').toLocaleDateString('de-CH',short?{day:'2-digit',month:'2-digit'}:{weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'});}catch(_){return d;}};
const kindText = {attendance:'Anwesenheit',homework:'Hausaufgabe',test:'Lernkontrolle'};
const kinds = {
 attendance:[['present','Da'],['absent','Fehlt'],['late','Verspätet'],['excused','Entschuldigt'],['open','Offen']],
 homework:[['done','Erledigt'],['partial','Teilweise'],['missing','Fehlt'],['excused','Entschuldigt'],['open','Offen']],
 test:[['done','Geschrieben'],['makeup','Nachholen'],['excused','Entschuldigt'],['open','Offen']]
};
const shortStatus={present:'✓',absent:'✕',late:'V',excused:'E',done:'✓',partial:'½',missing:'✕',makeup:'N',open:'–'};
const labelFor=(kind,status)=>(kinds[kind]||[]).find(x=>x[0]===status)?.[1]||'Offen';
const state={groups:[],groupId:'GS1CD',view:'overview',events:[],inactive:new Set(),
  chosen:{attendance:null,homework:null,test:null},filters:{attendance:'all',homework:'all',test:'all'},
  searches:{attendance:'',homework:'',test:''},editing:null,requestCount:0};
let toastTimer;
const markQueues=new Map();
function toast(message){const node=$('#controlsToast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3300);}
function connection(text){$('#syncState').textContent=text;}
function saving(start){state.requestCount+=start?1:-1;connection(state.requestCount?'Speichern …':'Online gespeichert');}
async function api(path,options={}){
 const response=await fetch(path,{...options,cache:'no-store',headers:{'content-type':'application/json',...(options.headers||{})}});
 const data=await response.json().catch(()=>({}));
 if(!response.ok||!data.ok)throw new Error(data.message||({'INVALID_DATE':'Ungültiges Datum','INVALID_STATUS':'Status ungültig','DATE_ALREADY_EXISTS':'Für diesen Tag besteht schon ein Eintrag','TEXT_TOO_LONG':'Text ist zu lang','DB_NOT_CONFIGURED':'Cloudflare-Datenbank ist nicht verbunden'}[data.error])||data.error||('HTTP '+response.status));
 return data;
}
const currentGroup=()=>state.groups.find(g=>g.id===state.groupId);
const students=()=>currentGroup()?.students||[];
const activeStudents=()=>students().filter(s=>!state.inactive.has(s.email));
const sortStudents=(a,b)=>a.lastName.localeCompare(b.lastName,'de-CH')||a.firstName.localeCompare(b.firstName,'de-CH');
const eventsOf=kind=>state.events.filter(e=>e.kind===kind);
const selectedEvent=kind=>eventsOf(kind).find(e=>e.id===state.chosen[kind])||eventsOf(kind)[0]||null;
const mark=(e,s)=>e.marks[s.email]||{status:'open',note:''};
const statusOf=(e,s)=>mark(e,s).status||'open';
function counts(e){const result={open:0};activeStudents().forEach(s=>{const v=statusOf(e,s);result[v]=(result[v]||0)+1;});return result;}
const sortedEvents=()=>[...state.events].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt-a.createdAt);
function eventCompletion(e){const c=counts(e),n=activeStudents().length;return n?(n-(c.open||0))/n*100:0;}
function setView(view){
 if(!['overview','attendance','homework','test','roster'].includes(view))return;
 state.view=view;$$('#controlTabs [data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));
 $$('.control-view').forEach(section=>section.hidden=section.id!==view+'View');
 if(view==='overview')renderOverview();
 else if(view==='roster')renderRoster();
 else renderKind(view);
}
function renderCourse(){
 const group=currentGroup();const all=students().length,active=activeStudents().length;
 $('#courseButtons').innerHTML=state.groups.map(g=>'<button type="button" data-course="'+h(g.id)+'" class="'+(g.id===state.groupId?'active':'')+'">'+h(g.id==='GS1AF'?'GS1BF':g.label)+'<span>'+h(g.sourceLabel||g.label)+'</span></button>').join('');
 $('#courseInfo').textContent=group?active+' von '+all+' Lernenden aktiv · '+group.sourceLabel+' · Kursliste bei Bedarf unter «Kursliste» anpassen.':'';
}
async function fetchControls(){
 connection('Daten werden geladen …');
 const result=await api('/lehrperson/api/teacher/controls?group='+encodeURIComponent(state.groupId));
 state.events=(result.events||[]).sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt-a.createdAt);
 state.inactive=new Set(result.inactiveEmails||[]);
 for(const kind of ['attendance','homework','test']){
  if(!eventsOf(kind).some(e=>e.id===state.chosen[kind]))state.chosen[kind]=eventsOf(kind)[0]?.id||null;
 }
 connection('Online gespeichert');renderAll();
}
function renderAll(){renderCourse();renderOverview();renderKind('attendance');renderKind('homework');renderKind('test');renderRoster();setView(state.view);}
function overviewMetrics(){
 const active=activeStudents(),att=eventsOf('attendance'),latest=att[0],latestC=latest?counts(latest):{};
 let homework=0,tests=0,unmarked=0;
 state.events.forEach(e=>active.forEach(s=>{
  const st=statusOf(e,s);
  if(e.kind==='homework'&&['missing','partial'].includes(st))homework++;
  if(e.kind==='test'&&st==='makeup')tests++;
  if(e.kind!=='attendance'&&st==='open')unmarked++;
 }));
 const metrics=[
  {label:'Kurstage erfasst',value:att.length,sub:'Bisher dokumentiert',cls:''},
  {label:'Letzter Kurstag: anwesend',value:latest?(latestC.present||0)+' / '+active.length:'–',sub:latest?niceDate(latest.date):'Noch kein Kurstag',cls:'good'},
  {label:'Hausaufgaben nacharbeiten',value:homework,sub:'Fehlt oder teilweise',cls:homework?'warning':''},
  {label:'Tests nachholen',value:tests,sub:unmarked+' noch ungeprüfte Abgaben/Testeinträge',cls:tests?'danger':''}
 ];
 $('#summaryMetrics').innerHTML=metrics.map(m=>'<article class="control-metric '+m.cls+'"><small>'+h(m.label)+'</small><strong>'+h(m.value)+'</strong><em>'+h(m.sub)+'</em></article>').join('');
}
function renderFollowups(){
 const followups=[];const all=activeStudents().sort(sortStudents);
 sortedEvents().forEach(e=>{
  if(!['homework','test'].includes(e.kind))return;
  all.forEach(s=>{const st=statusOf(e,s);
   if((e.kind==='homework'&&['missing','partial'].includes(st))||(e.kind==='test'&&st==='makeup'))
    followups.push({e,s,st});
  });
 });
 const node=$('#followups');
 if(!followups.length){node.innerHTML='<div class="empty-state">Noch keine Nacharbeiten markiert.</div>';return;}
 node.innerHTML=followups.slice(0,35).map(v=>'<div class="followup-item"><div><strong>'+h(v.s.firstName+' '+v.s.lastName)+'</strong><small>'+h(v.e.title)+' · '+niceDate(v.e.date,true)+'</small></div><span class="small-tag '+(v.e.kind==='test'?'red':'')+'">'+h(labelFor(v.e.kind,v.st))+'</span></div>').join('')+(followups.length>35?'<p class="control-subtle">Weitere '+(followups.length-35)+' Einträge vorhanden. Öffnen Sie die jeweilige Kontrolle.</p>':'');
}
function renderRecent(){
 const list=sortedEvents().slice(0,9);
 $('#recentEvents').innerHTML=!list.length?'<div class="empty-state">Noch keine Kurstage oder Aufträge erfasst.</div>':
 list.map(e=>{const c=counts(e),done=activeStudents().length-(c.open||0);
  return '<div class="recent-item"><div><strong>'+h(e.title)+'</strong><small>'+h(kindText[e.kind])+' · '+niceDate(e.date)+'</small></div><span class="small-tag teal">'+done+'/'+activeStudents().length+' erfasst</span></div>';
 }).join('');
}
function renderMatrix(){
 const days=eventsOf('attendance').slice(0,12).reverse();
 const list=[...activeStudents()].sort(sortStudents);
 if(!days.length){$('#attendanceMatrix').innerHTML='<div class="empty-state">Sobald Sie den ersten Kurstag erfassen, erscheint hier die Wochenübersicht.</div>';return;}
 let html='<table class="matrix"><thead><tr><th>Lernende</th>';
 days.forEach(e=>html+='<th title="'+h(niceDate(e.date))+'">'+niceDate(e.date,true)+'</th>');
 html+='<th title="Alle erfassten Kurstage">Da</th><th title="Alle erfassten Kurstage">Fehlt</th><th title="Alle erfassten Kurstage">Versp.</th><th title="Alle erfassten Kurstage">Entsch.</th></tr></thead><tbody>';
 list.forEach(s=>{
  html+='<tr><td><strong>'+h(s.firstName+' '+s.lastName)+'</strong><span class="person-sub">'+h(s.classCode)+'</span></td>';
  days.forEach(e=>{const st=statusOf(e,s);
   html+='<td><span class="matrix-chip is-'+h(st)+'" title="'+h(niceDate(e.date)+' · '+labelFor('attendance',st))+'">'+h(shortStatus[st]||'–')+'</span></td>';
  });
  const totals=eventsOf('attendance').reduce((acc,e)=>{const st=statusOf(e,s);acc[st]=(acc[st]||0)+1;return acc;},{});
  for(const st of ['present','absent','late','excused'])html+='<td><strong>'+(totals[st]||0)+'</strong></td>';
  html+='</tr>';
 });
 html+='</tbody></table>';
 $('#attendanceMatrix').innerHTML=html;
}
function renderOverview(){overviewMetrics();renderFollowups();renderRecent();renderMatrix();}
function renderEventPicker(kind){
 const list=eventsOf(kind),node=$('#'+kind+'Events'),sel=selectedEvent(kind);
 if(!list.length){node.innerHTML='';return;}
 node.innerHTML=list.map(e=>{
  const pct=eventCompletion(e),done=Math.round(pct);
  return '<button type="button" data-event-id="'+h(e.id)+'" data-event-kind="'+kind+'" class="'+(e.id===sel?.id?'active':'')+'"><strong>'+h(e.title)+'</strong><small>'+niceDate(e.date)+' · '+done+'% erfasst</small><span class="tiny-progress"><i style="width:'+Math.min(100,done)+'%"></i></span></button>';
 }).join('');
}
function statusCountsHtml(kind,e){
 const c=counts(e),mapping={attendance:[['present','Da','ok'],['absent','Fehlt','no'],['late','Verspätet','warn'],['excused','Entschuldigt',''],['open','Offen','']],homework:[['done','Erledigt','ok'],['partial','Teilweise','warn'],['missing','Fehlt','no'],['open','Offen','']],test:[['done','Geschrieben','ok'],['makeup','Nachholen','no'],['open','Offen','']]};
 return (mapping[kind]||[]).map(a=>'<span class="'+a[2]+'">'+(c[a[0]]||0)+' '+a[1]+'</span>').join('');
}
function renderEditor(kind){
 const node=$('#'+kind+'Editor'),e=selectedEvent(kind);
 if(!e){node.innerHTML='<div class="editor-empty">Noch '+(kind==='attendance'?'kein Kurstag':'keine '+(kind==='homework'?'Hausaufgabe':'Lernkontrolle'))+' vorhanden. Oben können Sie einen neuen Eintrag erstellen.</div>';return;}
 const active=activeStudents().slice().sort(sortStudents),filter=state.filters[kind],term=state.searches[kind].toLocaleLowerCase('de-CH');
 const list=active.filter(s=>(filter==='all'||statusOf(e,s)===filter)&&(!term||(s.firstName+' '+s.lastName+' '+s.classCode).toLocaleLowerCase('de-CH').includes(term)));
 const open=active.filter(s=>statusOf(e,s)==='open');
 let html='<section class="control-editor"><div class="editor-top"><div><span class="eyebrow">'+h(kindText[kind])+' · '+niceDate(e.date)+'</span><h3>'+h(e.title)+'</h3>'+(e.details?'<p>'+h(e.details)+'</p>':'')+'</div><div class="editor-top-actions"><button type="button" class="control-btn" data-edit-event="'+h(e.id)+'">Bearbeiten</button><button type="button" class="control-btn danger" data-delete-event="'+h(e.id)+'">Löschen</button></div></div>';
 if(state.editing===e.id){
  html+='<form class="event-edit-form" data-event-form="'+h(e.id)+'"><label>Titel<input name="title" maxlength="100" required value="'+h(e.title)+'"></label><label>Datum<input name="date" type="date" value="'+h(e.date)+'" required></label><label>Hinweis<input name="details" maxlength="350" value="'+h(e.details)+'"></label><button type="submit" class="primary-button">Änderungen speichern</button><button type="button" class="control-btn" data-cancel-edit>Abbrechen</button></form>';
 }
 html+='<div class="editor-metrics">'+statusCountsHtml(kind,e)+'</div>';
 const bulkStatus={attendance:'present',homework:'done',test:'done'}[kind];
 const bulkText={attendance:'Alle offenen als anwesend',homework:'Alle offenen als erledigt',test:'Alle offenen als geschrieben'}[kind];
 html+='<div class="editor-tools"><input type="search" data-student-search="'+kind+'" placeholder="Lernende suchen …" aria-label="Lernende suchen" value="'+h(term)+'"><select data-filter-kind="'+kind+'" aria-label="Status filtern"><option value="all">Alle anzeigen</option>'+kinds[kind].map(pair=>'<option value="'+pair[0]+'" '+(filter===pair[0]?'selected':'')+'>'+pair[1]+'</option>').join('')+'</select><button type="button" class="primary-button" data-bulk="'+bulkStatus+'" data-bulk-kind="'+kind+'" '+(!open.length?'disabled':'')+'>'+bulkText+' ('+open.length+')</button></div>';
 html+='<div class="editor-table-wrap"><table class="editor-table"><thead><tr><th>Lernende</th><th>Status</th><th>Bemerkung</th></tr></thead><tbody>';
 list.forEach(s=>{
  const m=mark(e,s);
  html+='<tr><td class="student-cell"><strong>'+h(s.firstName+' '+s.lastName)+'</strong><small>'+h(s.classCode)+'</small></td><td><div class="status-actions">';
  kinds[kind].forEach(pair=>{
   html+='<button type="button" class="'+(m.status===pair[0]?'active ':'')+'is-'+pair[0]+'" data-mark="'+h(s.email)+'" data-status="'+pair[0]+'" data-kind="'+kind+'" aria-pressed="'+(m.status===pair[0]?'true':'false')+'">'+h(pair[1])+'</button>';
  });
  html+='</div></td><td><input class="note" type="text" maxlength="300" data-note-email="'+h(s.email)+'" data-note-kind="'+kind+'" aria-label="Notiz für '+h(s.firstName+' '+s.lastName)+'" placeholder="Kurze Notiz (optional)" value="'+h(m.note)+'"></td></tr>';
 });
 if(!list.length)html+='<tr><td colspan="3" class="empty-state">Keine passenden Lernenden.</td></tr>';
 html+='</tbody></table></div><p class="save-line">Änderungen werden direkt online gespeichert. «Offen» bedeutet noch nicht geprüft – nicht automatisch «fehlt».</p></section>';
 node.innerHTML=html;
}
function renderKind(kind){
 renderEventPicker(kind);renderEditor(kind);
}
function renderRoster(){
 const all=[...students()].sort(sortStudents),node=$('#rosterEditor');
 node.innerHTML=all.map(s=>'<div class="roster-row '+(state.inactive.has(s.email)?'inactive':'')+'"><div><strong>'+h(s.firstName+' '+s.lastName)+'</strong><small>'+h(s.classCode)+'</small></div><label><input type="checkbox" data-member="'+h(s.email)+'" '+(!state.inactive.has(s.email)?'checked':'')+'> Im Kurs</label></div>').join('');
}
async function switchCourse(groupId){
 if(!state.groups.some(g=>g.id===groupId)||groupId===state.groupId)return;
 state.groupId=groupId;
 try{localStorage.setItem('franz-teacher-controls-course',groupId);}catch(_){}
 state.editing=null;
 for(const k of Object.keys(state.chosen))state.chosen[k]=null;
 try{await fetchControls();}catch(err){connection('Verbindungsfehler');toast('Laden fehlgeschlagen: '+err.message);}
}
async function createEvent(kind,title,date,details){
 saving(true);
 try{
  const result=await api('/lehrperson/api/teacher/controls',{method:'POST',body:JSON.stringify({groupId:state.groupId,kind,title,date,details})});
  state.chosen[kind]=result.id;
  await fetchControls();
  setView(kind);
  toast(result.existing?'Dieser Kurstag ist bereits vorhanden.':'Eintrag angelegt.');
 }catch(err){connection('Speicherfehler');toast('Anlegen fehlgeschlagen: '+err.message);}
 finally{saving(false);}
}
async function saveMark(kind,email,status,note){
 const e=selectedEvent(kind);if(!e)return;
 const original={...mark(e,{email})};
 e.marks[email]={status,note};
 renderKind(kind);renderOverview();saving(true);
 const key=e.id+':'+email;
 const previous=markQueues.get(key)||Promise.resolve();
 const operation=previous.catch(()=>{}).then(()=>api('/lehrperson/api/teacher/controls/mark',{method:'PUT',body:JSON.stringify({groupId:e.groupId,id:e.id,email,status,note})}));
 markQueues.set(key,operation);
 try{await operation;}
 catch(err){if(mark(e,{email}).status===status&&mark(e,{email}).note===note){e.marks[email]=original;renderKind(kind);renderOverview();}connection('Speicherfehler');toast('Nicht gespeichert: '+err.message);}
 finally{if(markQueues.get(key)===operation)markQueues.delete(key);saving(false);}
}
async function saveBulk(kind,status){
 const e=selectedEvent(kind);if(!e)return;
 const targets=activeStudents().filter(s=>statusOf(e,s)==='open').map(s=>s.email);
 if(!targets.length)return;
 if(!confirm('Alle '+targets.length+' ungeklärten Einträge als «'+labelFor(kind,status)+'» markieren? Bereits gesetzte Status bleiben unverändert.'))return;
 const previous=targets.map(email=>[email,{...mark(e,{email})}]);
 targets.forEach(email=>e.marks[email]={...mark(e,{email}),status});
 renderKind(kind);renderOverview();saving(true);
 try{await api('/lehrperson/api/teacher/controls/bulk',{method:'POST',body:JSON.stringify({groupId:state.groupId,id:e.id,status,emails:targets})});toast(targets.length+' Einträge gespeichert.');}
 catch(err){previous.forEach(([email,m])=>e.marks[email]=m);renderKind(kind);renderOverview();connection('Speicherfehler');toast('Nicht gespeichert: '+err.message);}
 finally{saving(false);}
}
async function deleteEvent(kind,id){
 const e=eventsOf(kind).find(x=>x.id===id);
 if(!e||!confirm('«'+e.title+'» und ALLE zugehörigen Markierungen dauerhaft löschen?'))return;
 saving(true);
 try{await api('/lehrperson/api/teacher/controls',{method:'DELETE',body:JSON.stringify({groupId:state.groupId,id})});state.chosen[kind]=null;state.editing=null;await fetchControls();toast('Eintrag gelöscht.');}
 catch(err){connection('Speicherfehler');toast(err.message);}finally{saving(false);}
}
async function editEvent(form,id){
 const kind=state.view,e=eventsOf(kind).find(x=>x.id===id);if(!e)return;
 const data=new FormData(form);
 saving(true);
 try{await api('/lehrperson/api/teacher/controls',{method:'PUT',body:JSON.stringify({groupId:state.groupId,id,title:data.get('title'),date:data.get('date'),details:data.get('details')})});state.editing=null;await fetchControls();toast('Änderungen gespeichert.');}
 catch(err){connection('Speicherfehler');toast(err.message);}finally{saving(false);}
}
async function changeMember(email,active){
 const had=state.inactive.has(email);
 if(active)state.inactive.delete(email);else state.inactive.add(email);
 renderAll();saving(true);
 try{await api('/lehrperson/api/teacher/controls/member',{method:'PUT',body:JSON.stringify({groupId:state.groupId,email,active})});toast(active?'Person wieder aktiviert.':'Person für Kontrollen deaktiviert.');}
 catch(err){if(had)state.inactive.add(email);else state.inactive.delete(email);renderAll();connection('Speicherfehler');toast(err.message);}
 finally{saving(false);}
}
function download(name,content,type){
 const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function exportData(asJson){
 const group=currentGroup();if(!group)return;
 const name='Französisch '+(state.groupId==='GS1AF'?'GS1BF':state.groupId)+' Unterrichtskontrollen '+dateLocal();
 if(asJson){
  if(!confirm('Die JSON-Datei enthält Namen, Status und Notizen. Bitte ausschliesslich an einem geschützten, von der Schule freigegebenen Ort speichern. Fortfahren?'))return;
  const content=JSON.stringify({type:'franz-teacher-controls',version:1,exportDate:dateLocal(),
   group:{id:group.id,label:group.label},students:students(),inactiveEmails:[...state.inactive],events:state.events},null,2);
  download(name+'.json',content,'application/json;charset=utf-8');return;
 }
 const rows=[['Datum','Art','Titel','Klasse','Nachname','Vorname','Status','Bemerkung','Im Kurs']];
 sortedEvents().forEach(e=>students().slice().sort(sortStudents).forEach(s=>{
  const m=mark(e,s);
  rows.push([e.date,kindText[e.kind],e.title,s.classCode,s.lastName,s.firstName,labelFor(e.kind,m.status),m.note,state.inactive.has(s.email)?'Nein':'Ja']);
 }));
 const sanitize=v=>{let s=String(v??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const csv='\uFEFF'+rows.map(row=>row.map(sanitize).join(';')).join('\r\n');
 download(name+'.csv',csv,'text/csv;charset=utf-8');
}

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de-CH').replace(/[^a-z0-9]/g,'');}
function csvRecords(csv){
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<csv.length;i++){
  const ch=csv[i];
  if(ch==='"'){if(quoted&&csv[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(ch===';'&&!quoted){row.push(cell);cell='';}
  else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&csv[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}
  else cell+=ch;
 }
 if(cell||row.length){row.push(cell);rows.push(row);}
 return rows;
}
function importDate(date){
 const value=String(date||'').trim();
 if(/^\d{4}-\d{2}-\d{2}$/.test(value))return value;
 const m=value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
 return m?m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0'):null;
}
function importStatus(value){
 const v=String(value||'').trim().toLocaleLowerCase('de-CH');
 return ({'da':'present','anwesend':'present','present':'present','absent':'absent','fehlt':'absent','abwesend':'absent',
  'verspätet':'late','late':'late','entschuldigt':'excused','excused':'excused',
  'erledigt':'done','geschrieben':'done','done':'done','teilweise':'partial','partial':'partial',
  'missing':'missing','nachholen':'makeup','makeup':'makeup','offen':'open','ungeklärt':'open','open':'open'})[v]||'open';
}
function fromCsv(text){
 const rows=csvRecords(text.replace(/^\uFEFF/,''));
 if(rows.length<2)throw new Error('Keine CSV-Daten gefunden.');
 const headers=rows.shift().map(v=>norm(v)),get=(r,key)=>r[headers.indexOf(norm(key))]||'';
 if(!headers.includes('nachname')||!headers.includes('datum'))throw new Error('Das CSV-Format wird nicht erkannt.');
 const groups=new Map();
 for(const row of rows){
  const date=importDate(get(row,'Datum')),cls=get(row,'Klasse');
  const groupId=['GS1B','GS1F'].includes(cls)?'GS1AF':(['GS1C','GS1D'].includes(cls)?'GS1CD':null);
  if(!date||!groupId)continue;
  const group=groups.get(groupId)||{groupId,events:[]};groups.set(groupId,group);
  const kind=({hausaufgabe:'homework',lernkotrolle:'test',lernkontrolle:'test'})[get(row,'Art').toLocaleLowerCase('de-CH')]||'attendance';
  const title=get(row,'Titel')||'Unterricht';
  let event=group.events.find(e=>e.date===date&&e.kind===kind&&e.title===title);
  if(!event){event={kind,date,title,details:'Aus CSV übernommen',marks:[]};group.events.push(event);}
  event.marks.push({firstName:get(row,'Vorname'),lastName:get(row,'Nachname'),classCode:cls,
   status:importStatus(get(row,'Status')),note:get(row,'Notiz')||get(row,'Bemerkung')});
 }
 return {groups:[...groups.values()]};
}
function fromOldJson(data){
 if(!Array.isArray(data.people)||!data.days)throw new Error('Das alte Format wird nicht erkannt.');
 const groups=[{groupId:'GS1AF',events:[]}];
 Object.entries(data.days).forEach(([date,records])=>{
  const event={kind:'attendance',title:'Unterricht',date,details:'Aus älterer Absenzenverwaltung übernommen',marks:[]};
  Object.entries(records||{}).forEach(([id,item])=>{
   const person=data.people.find(p=>String(p.id)===String(id));
   if(person)event.marks.push({firstName:person.first,lastName:person.last,classCode:person.group,
    status:importStatus(item.status),note:item.note||''});
  });
  groups[0].events.push(event);
 });
 return {groups};
}
function singleQuoteArray(raw){
 // Es wird ausschliesslich ein begrenzter Datenabschnitt als JSON gelesen, kein HTML ausgeführt.
 return JSON.parse(raw.replace(/'((?:\\'|[^'])*)'/g,(_,v)=>JSON.stringify(v.replace(/\\'/g,"'"))));
}
function fromOldHtml(text){
 if(text.includes('const persons=')){
  const matched=text.match(/const persons=(\[\[.*?\]\])\.map\(/s),date=text.match(/franz-anwesenheit-(\d{4}-\d{2}-\d{2})/);
  if(!matched||!date)throw new Error('Diese alte HTML-Kontrolle lässt sich nicht lesen.');
  const people=singleQuoteArray(matched[1]);
  return {groups:[{groupId:'GS1CD',events:[{kind:'attendance',date:date[1],title:'Unterricht',
   details:'Aus alter HTML-Datei: nur Vorbelegungen',marks:people.map(p=>({classCode:p[0],lastName:p[1],firstName:p[2],status:importStatus(p[3]),note:p[4]||''})).filter(m=>m.status!=='open')}]}]};
 }
 if(text.includes('const PEOPLE=')){
  const match=text.match(/const PEOPLE=(\[\[.*?\]\])\.map\(/s);
  const initial=text.match(/const INITIAL=(\{.*?\});/s);
  if(!match||!initial)throw new Error('Diese alte HTML-Kontrolle lässt sich nicht lesen.');
  const people=singleQuoteArray(match[1]).map((p,i)=>({id:String(i+1),first:p[0],last:p[1],group:p[2]}));
  const initialJson=initial[1].replace(/'((?:\\'|[^'])*)'/g,(_,v)=>JSON.stringify(v.replace(/\\'/g,"'")))
    .replace(/\b(status|note)\s*:/g,(_,k)=>'"'+k+'":');
  return fromOldJson({people,days:JSON.parse(initialJson)});
 }
 throw new Error('HTML-Format nicht erkannt. Bitte eine alte Absenzenverwaltung auswählen.');
}
function normaliseImport(text,fileName){
 if(/\.csv$/i.test(fileName))return fromCsv(text);
 if(/\.html?$/i.test(fileName))return fromOldHtml(text);
 const data=JSON.parse(text);
 if(data.type==='franz-teacher-legacy-import'&&Array.isArray(data.groups))return data;
 if(data.type==='franz-teacher-controls'){
  return {groups:[{groupId:data.group.id,inactiveEmails:data.inactiveEmails||[],
   events:(data.events||[]).map(e=>({kind:e.kind,date:e.date,title:e.title,details:e.details||'',
    marks:Object.entries(e.marks||{}).map(([email,m])=>({email,status:m.status,note:m.note||''}))}))}]};
 }
 if(Array.isArray(data.people)&&data.days)return fromOldJson(data);
 throw new Error('Unbekanntes Sicherungsformat.');
}
function studentForImport(group,row){
 if(row.email){
  const email=String(row.email).toLowerCase();
  return group.students.find(s=>s.email===email);
 }
 return group.students.find(s=>norm(s.firstName)===norm(row.firstName)&&norm(s.lastName)===norm(row.lastName)
  &&(!row.classCode||s.classCode===row.classCode));
}
async function importControls(file){
 const text=await file.text();
 const data=normaliseImport(text,file.name);
 let eventCount=0,markCount=0;
 for(const group of data.groups||[])for(const event of group.events||[]){
  eventCount++;markCount+=(event.marks||[]).filter(m=>m.status!=='open').length;
 }
 if(!eventCount)throw new Error('Keine Einträge zum Importieren gefunden.');
 if(eventCount>400||markCount>4000)throw new Error('Die Datei enthält zu viele Einträge für einen einzelnen Import.');
 const warning=/\.html?$/i.test(file.name)?'\n\nBei HTML-Dateien sind nur die Vorbelegungen enthalten, nicht spätere im Browser gespeicherte Änderungen.':'';
 if(!confirm(eventCount+' Kurstage/Aufträge und bis zu '+markCount+' Markierungen übernehmen? Bestehende, bereits erfasste Status werden nicht überschrieben.'+warning))return;
 saving(true);let written=0,skipped=0,created=0;
 try{
  for(const importGroup of data.groups||[]){
   const group=state.groups.find(g=>g.id===importGroup.groupId);
   if(!group){skipped+=(importGroup.events||[]).length;continue;}
   const existing=(await api('/lehrperson/api/teacher/controls?group='+encodeURIComponent(group.id))).events||[];
   for(const incoming of importGroup.events||[]){
    if(!['attendance','homework','test'].includes(incoming.kind)||!importDate(incoming.date)){skipped++;continue;}
    const title=String(incoming.title||'Unterricht').slice(0,100),date=importDate(incoming.date);
    const old=existing.find(e=>e.date===date&&e.kind===incoming.kind&&(incoming.kind==='attendance'||e.title===title));
    let eventId=old?.id;
    if(!eventId){
     const added=await api('/lehrperson/api/teacher/controls',{method:'POST',body:JSON.stringify({groupId:group.id,kind:incoming.kind,date,title,details:String(incoming.details||'').slice(0,350)})});
     eventId=added.id;created++;
    }
    for(const m of incoming.marks||[]){
     const student=studentForImport(group,m),status=importStatus(m.status);
     if(!student||status==='open'||!kinds[incoming.kind].some(pair=>pair[0]===status)){skipped++;continue;}
     if(old&&old.marks?.[student.email]&&old.marks[student.email].status!=='open'){skipped++;continue;}
     await api('/lehrperson/api/teacher/controls/mark',{method:'PUT',body:JSON.stringify({
      groupId:group.id,id:eventId,email:student.email,status,note:String(m.note||'').slice(0,300)
     })});
     if(old)old.marks[student.email]={status,note:m.note||''};
     written++;
    }
   }
   for(const email of importGroup.inactiveEmails||[]){
    if(group.students.some(s=>s.email===email)){
     await api('/lehrperson/api/teacher/controls/member',{method:'PUT',body:JSON.stringify({groupId:group.id,email,active:false})});
    }
   }
  }
  await fetchControls();
  toast(created+' neue Einträge, '+written+' Markierungen übernommen'+(skipped?' · '+skipped+' übersprungen':'')+'.');
 }finally{saving(false);}
}

function bind(){
 document.addEventListener('click',ev=>{
  const t=ev.target.closest('button');if(!t)return;
  if(t.dataset.course){switchCourse(t.dataset.course);return;}
  if(t.dataset.view){setView(t.dataset.view);return;}
  if(t.dataset.nav){setView(t.dataset.nav);return;}
  if(t.dataset.eventId){state.chosen[t.dataset.eventKind]=t.dataset.eventId;state.editing=null;renderKind(t.dataset.eventKind);return;}
  if(t.dataset.mark){const kind=t.dataset.kind,e=selectedEvent(kind),email=t.dataset.mark;saveMark(kind,email,t.dataset.status,mark(e,{email}).note);return;}
  if(t.dataset.bulk){saveBulk(t.dataset.bulkKind,t.dataset.bulk);return;}
  if(t.dataset.editEvent){state.editing=state.editing===t.dataset.editEvent?null:t.dataset.editEvent;renderKind(state.view);return;}
  if(t.dataset.deleteEvent){deleteEvent(state.view,t.dataset.deleteEvent);return;}
  if(t.hasAttribute('data-cancel-edit')){state.editing=null;renderKind(state.view);return;}
 });
 document.addEventListener('input',ev=>{
  const input=ev.target;
  if(input.dataset.studentSearch){
   const kind=input.dataset.studentSearch;state.searches[kind]=input.value;
   const event=selectedEvent(kind),term=input.value.toLocaleLowerCase('de-CH');
   $$('#'+kind+'Editor .editor-table tbody tr').forEach(tr=>{
    const person=$('.student-cell',tr)?.textContent||'';
    tr.hidden=!person.toLocaleLowerCase('de-CH').includes(term) || (state.filters[kind]!=='all'&&statusOf(event,{email:$('.note',tr)?.dataset.noteEmail})!==state.filters[kind]);
   });
  }
 });
 document.addEventListener('change',ev=>{
  const t=ev.target;
  if(t.dataset.filterKind){state.filters[t.dataset.filterKind]=t.value;renderKind(t.dataset.filterKind);return;}
  if(t.dataset.noteEmail){const kind=t.dataset.noteKind,e=selectedEvent(kind),email=t.dataset.noteEmail;saveMark(kind,email,mark(e,{email}).status,t.value);return;}
  if(t.dataset.member){changeMember(t.dataset.member,t.checked);return;}
 });
 document.addEventListener('submit',ev=>{
  const f=ev.target;if(f.dataset.eventForm){ev.preventDefault();editEvent(f,f.dataset.eventForm);return;}
  if(f.id==='homeworkCreate'||f.id==='testCreate'){
   ev.preventDefault();const kind=f.id==='homeworkCreate'?'homework':'test',data=new FormData(f);
   const title=String(data.get('title')||'').trim(),date=data.get('date'),details=data.get('details');
   if(!title||!date)return;
   createEvent(kind,title,date,details);f.querySelector('[name=title]').value='';f.querySelector('[name=details]').value='';
  }
 });
 $('#openAttendanceBtn').onclick=()=>{
  const day=$('#attendanceDate').value;
  if(!day){toast('Bitte ein Datum auswählen.');return;}
  createEvent('attendance','Unterricht',day,'');
 };
 $('#refreshBtn').onclick=()=>fetchControls().then(()=>toast('Daten aktualisiert.')).catch(err=>toast(err.message));
 $('#exportCsvBtn').onclick=()=>exportData(false);
 $('#exportJsonBtn').onclick=()=>exportData(true);
 $('#printControlsBtn').onclick=()=>window.print();
 $('#importControlsBtn').onclick=()=>$('#importControlsFile').click();
 $('#importControlsFile').addEventListener('change',async ev=>{
  const file=ev.target.files?.[0];if(!file)return;
  try{await importControls(file);}catch(err){connection('Import fehlgeschlagen');toast('Import nicht abgeschlossen: '+err.message);}
  finally{ev.target.value='';}
 });
}
async function init(){
 $('#todayLabel').textContent=new Date().toLocaleDateString('de-CH',{weekday:'long',day:'numeric',month:'long'});
 ['attendanceDate','#homeworkCreate [name=date]','#testCreate [name=date]'].forEach(selector=>{
  const element=selector==='attendanceDate'?$('#attendanceDate'):$(selector);
  if(element)element.value=dateLocal();
 });
 bind();
 try{
  await api('/lehrperson/api/teacher/me');
  const roster=await api('/lehrperson/api/teacher/roster');
  state.groups=roster.groups||[];
  if(!state.groups.length)throw new Error('Keine Kurslisten verfügbar');
  const previous=localStorage.getItem('franz-teacher-controls-course');
  state.groupId=state.groups.some(g=>g.id===previous)?previous:state.groups[0].id;
  await fetchControls();
 }catch(err){
  connection('Verbindung nicht verfügbar');
  toast('Der Lehrpersonenbereich konnte nicht geladen werden: '+err.message);
  $('#summaryMetrics').innerHTML='<article class="control-metric danger"><small>Laden fehlgeschlagen</small><strong>!</strong><em>'+h(err.message)+'</em></article>';
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();