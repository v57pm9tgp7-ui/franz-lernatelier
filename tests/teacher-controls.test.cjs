const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Lehrpersonenbereich verlinkt auf Unterrichtskontrollen',()=>{
 const home=read('public/lehrperson/index.html');
 assert.match(home,/href="kontrollen\.html"/);
 const controls=read('public/lehrperson/kontrollen.html');
 for(const id of ['overviewView','attendanceView','homeworkView','testView','rosterView']){
  assert.match(controls,new RegExp('id="'+id+'"'));
 }
 assert.match(controls,/controls\.js/);
 assert.match(controls,/controls\.css/);
});

test('D1-Kontrollen verwenden geschützten Teacher-API-Pfad und erlaubte Gruppen',()=>{
 const worker=read('src/index.js');
 for(const table of ['teacher_control_events','teacher_control_marks','teacher_control_members'])
  assert.ok(worker.includes(table));
 for(const route of ['controls','controls/mark','controls/bulk','controls/member'])
  assert.ok(worker.includes("'/api/teacher/"+route+"'"));
 assert.match(worker,/getGroup\(String\(groupId/);
 assert.match(worker,/group\.students\.some\(s=>s\.email===email\)/);
 assert.match(worker,/ON CONFLICT\(event_id,student_email\)/);
 assert.match(worker,/teacher_control_marks\.status='open'/);
 const wrangler=read('wrangler.jsonc');
 assert.match(wrangler,/\/lehrperson\/api\/teacher\/\*/);
});

test('Französisch-Kurslisten entsprechen den mitgelieferten Kontrollen',()=>{
 const roster=read('src/roster.js');
 assert.equal((roster.match(/@stud\.bffbern\.ch/g)||[]).length,37);
 assert.match(roster,/"GS1CD"/);
 assert.match(roster,/"GS1AF"/);
 assert.match(roster,/"label": "GS1BF"/);
});

test('UI: Kurstag erstellen, Abwesenheit erfassen, nur Offene gesammelt als Da markieren',async()=>{
 const dom=new JSDOM(read('public/lehrperson/kontrollen.html'),{
  url:'https://franzatelier.com/lehrperson/kontrollen.html',runScripts:'outside-only',
  pretendToBeVisual:true
 });
 const {window}=dom,doc=window.document;
 window.confirm=()=>true;
 const p1={firstName:'Lara',lastName:'Fehr',classCode:'GS1C',email:'lara.fehr@stud.bffbern.ch'};
 const p2={firstName:'Nelli',lastName:'Dudnik',classCode:'GS1C',email:'nelli.dudnik@stud.bffbern.ch'};
 const roster={ok:true,groups:[{id:'GS1CD',label:'GS1CD',sourceLabel:'GS1C + GS1D',count:2,students:[p1,p2]}]};
 const events=[];
 const json=(data)=>({ok:true,json:async()=>data});
 window.fetch=async(url,opt={})=>{
  const path=String(url),body=opt.body?JSON.parse(opt.body):null;
  if(path.endsWith('/teacher/me'))return json({ok:true,email:'lehrperson@bffbern.ch'});
  if(path.endsWith('/teacher/roster'))return json(roster);
  if(path.includes('/teacher/controls?'))return json({ok:true,events:JSON.parse(JSON.stringify(events)),inactiveEmails:[]});
  if(path.endsWith('/teacher/controls')&&opt.method==='POST'){
   const event={id:'event1',groupId:body.groupId,kind:body.kind,date:body.date,title:body.title,details:body.details,createdAt:1,marks:{}};
   events.push(event);return json({ok:true,id:event.id});
  }
  if(path.endsWith('/controls/mark')&&opt.method==='PUT'){
   const event=events.find(e=>e.id===body.id);
   event.marks[body.email]={status:body.status,note:body.note};
   return json({ok:true});
  }
  if(path.endsWith('/controls/bulk')&&opt.method==='POST'){
   const event=events.find(e=>e.id===body.id);
   for(const email of body.emails){if(!event.marks[email]||event.marks[email].status==='open')event.marks[email]={status:body.status,note:''};}
   return json({ok:true,count:body.emails.length});
  }
  throw new Error('Unexpected request '+path);
 };
 window.eval(read('public/assets/controls.js'));
 doc.dispatchEvent(new window.Event('DOMContentLoaded'));
 const settle=()=>new Promise(resolve=>setTimeout(resolve,15));
 await settle();
 assert.match(doc.querySelector('#courseInfo').textContent,/2 von 2 Lernenden/);
 doc.querySelector('[data-view=attendance]').click();
 doc.querySelector('#attendanceDate').value='2026-10-22';
 doc.querySelector('#openAttendanceBtn').click();
 await settle();
 assert.equal(events.length,1);
 assert.ok(doc.querySelector('[data-status=absent]'));
 doc.querySelector('[data-mark="nelli.dudnik@stud.bffbern.ch"][data-status=absent]').click();
 await settle();
 assert.equal(events[0].marks[p2.email].status,'absent');
 doc.querySelector('[data-bulk-kind=attendance]').click();
 await settle();
 assert.equal(events[0].marks[p1.email].status,'present');
 assert.equal(events[0].marks[p2.email].status,'absent');
 doc.querySelector('[data-view=overview]').click();
 assert.match(doc.querySelector('#attendanceMatrix').textContent,/Lara Fehr/);
 dom.window.close();
});
