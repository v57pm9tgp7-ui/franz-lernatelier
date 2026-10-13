(() => {
'use strict';
const $=s=>document.querySelector(s);
const goals=window.FRANZ42_GOALS.goals;
const spec=window.FRANZ42_GOALS.officialTest;
const catalog=(window.FRANZ_TOPIC_CATALOG?.vocabulary||[]).filter(c=>spec.ids.includes(c.id));
const byId=Object.fromEntries(catalog.map(c=>[c.id,c]));
const enc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let plan=null;
function shuffle(items){
 const arr=[...items];
 for(let i=arr.length-1;i>0;i--){
  const bytes=new Uint32Array(1); if(globalThis.crypto?.getRandomValues)crypto.getRandomValues(bytes);else bytes[0]=Math.floor(Math.random()*4294967296);
  const j=bytes[0]%(i+1);[arr[i],arr[j]]=[arr[j],arr[i]];
 }
 return arr;
}
function balancedDraw(){
 const pools=goals.map(g=>shuffle(g.ids.map(id=>byId[id]).filter(Boolean)));
 if(pools.some(p=>!p.length))throw Error('Unvollständiger Prüfungswortschatz: Mindestens ein Lernziel hat keine Aufgaben.');
 // Acht Schreibaufgaben: mindestens eine je Lernziel, die übrigen zwei verteilt.
 const write=pools.map(p=>p.shift());
 const rest=shuffle(pools.flat());
 write.push(...rest.splice(0,2));
 const used=new Set(write.map(c=>c.id));
 const read=shuffle(catalog.filter(c=>!used.has(c.id))).slice(0,4);
 return {read:shuffle(read),write:shuffle(write)};
}
// Alle sechs Ziele müssen als Kompetenzen geübt werden; im Test können zwei der
// sechs als offene Situationsaufgabe erscheinen, neben den zwölf Wortschatzaufgaben.
const SITUATIONS=[
 {goal:'fragen',prompt:'Fragen Sie eine neue Person nach dem Namen und nach dem Wohnort. Schreiben Sie zwei Fragen.',answer:'Comment tu t’appelles ? Tu habites où ?'},
 {goal:'person',prompt:'Sie heissen Léa und sind 16 Jahre alt. Stellen Sie sich in zwei Sätzen vor.',answer:'Je m’appelle Léa. J’ai seize ans.'},
 {goal:'beruf',prompt:'Sie möchten einen Beruf erlernen und gern Menschen helfen. Formulieren Sie einen Berufswunsch und eine kurze Begründung. (Beruf vorgegeben: assistant en soins et santé communautaire)',answer:'Je voudrais devenir assistant en soins et santé communautaire parce que je veux aider les gens.'},
 {goal:'schnuppern',prompt:'Schreiben Sie zwei Aussagen: Sie haben eine Schnupperlehre gemacht. Sie haben dabei beobachtet. (das Team = l’équipe)',answer:'J’ai fait un stage. J’ai observé l’équipe.'},
 {goal:'staerken',prompt:'Nennen Sie eine eigene Stärke und schreiben Sie, dass Sie gut im Team arbeiten. (Ich bin = Je suis)',answer:'Je suis fiable. Je travaille bien en équipe.'},
 {goal:'gespraech',prompt:'Eine Person fragt nach Ihren Sprachen. Sagen Sie, dass Sie Deutsch sprechen, und geben Sie die Frage zurück.',answer:'Je parle allemand. Et toi ?'}
];
function buildPlan(ids,variant){
 const valid=new Set(spec.ids);
 if(!Array.isArray(ids)||ids.length!==spec.count||new Set(ids).size!==spec.count||ids.some(id=>!valid.has(id)))throw Error('Es dürfen ausschliesslich die 28 verbindlichen Einträge verwendet werden.');
 const selected=balancedDraw();
 let scenarios=shuffle(SITUATIONS).slice(0,2);
 return {...selected,react:scenarios,points:4+8*2+2*2,variant,scope:spec.ids};
}
function student(solution=false){
 if(!plan)return '';
 const head=`<p class="eyebrow">BFF BERN · FRANZÖSISCH · WOCHE 43</p><h1>${solution?'Lösungen und Beurteilung':'Lernkontrolle · Se présenter'}</h1><p>Variante ${plan.variant} · ${spec.minutes} Minuten · ${plan.points} Punkte</p><p class="test-scope">Prüfungsstoff: <strong>28 verbindliche Wörter und Wendungen · sechs Lernziele</strong></p>`;
 const item=(q,a,i)=>`<div class="test-item"><p><strong>${i+1}.</strong> ${enc(q)}</p>${solution?`<p class="test-answer" lang="fr">${enc(a)}</p>`:'<div class="answerline"></div>'}</div>`;
 const a='<h2>A · Französisch verstehen (4 Punkte)</h2><p>Schreiben Sie die Bedeutung auf Deutsch. Je 1 Punkt.</p>';
 const b='<h2>B · Französisch schreiben (16 Punkte)</h2><p>Schreiben Sie die französische Form ohne Hilfsmittel. Je 2 Punkte.</p>';
 const c='<h2>C · Lernziele anwenden (4 Punkte)</h2><p>Schreiben Sie die passenden Fragen oder Sätze. Je 2 Punkte. Sinngleiche korrekte Antworten sind möglich.</p>';
 return `<section class="test-page paper">${head}${solution?'':'<p>Name: __________________________________ &nbsp; Klasse: __________</p>'}${a}${plan.read.map((x,i)=>item(x.fr,x.de,i)).join('')}${b}${plan.write.slice(0,4).map((x,i)=>item(x.de,x.fr,i)).join('')}</section><section class="test-page paper"><h1>${solution?'Lösungsvorschlag':'Lernkontrolle'} · Variante ${plan.variant}</h1><p>Seite 2 · ${plan.points} Punkte insgesamt</p>${b}${plan.write.slice(4).map((x,i)=>item(x.de,x.fr,i+4)).join('')}${c}${plan.react.map((x,i)=>item(x.prompt,x.answer,i)).join('')}${solution?'<p><strong>Bewertung:</strong> A: Bedeutung 1 Punkt. B: Bedeutung 1, Form 0.5, korrekte Schreibweise 0.5. C: passende Aussage/Absicht 1, verständliche sprachliche Umsetzung 1. Eigene Angaben und sinngleiche korrekte Lösungen gelten; eine Abweichung nur einmal werten. Feste Satzanfänge mit … dürfen ergänzt werden.</p>':'<p>Lesen Sie Ihre Antworten noch einmal durch: Inhalt, Wörter, Apostrophe und Akzente.</p>'}</section>`;
}
const out=$('#testOutput'),make=$('#makeTest'),config=$('#configStatus');
const valid=catalog.length===28&&goals.length===6&&new Set(catalog.map(c=>c.id)).size===28;
if(!valid){config.textContent='Achtung: Prüfungswortschatz nicht vollständig geladen. Bitte die Dateien kontrollieren.';make.disabled=true;}
else{config.textContent='Bereit: genau 28 verbindliche Einträge und sechs Lernziele. Der Prüfungsumfang ist für alle Gruppen gleich.';make.disabled=false;}
make.addEventListener('click',()=>{try{plan=buildPlan(spec.ids,$('#variant').value);out.innerHTML=student(false);$('#printStudent').disabled=false;$('#printTeacher').disabled=false;config.textContent='Variante '+plan.variant+' erstellt. 25 Minuten · 24 Punkte · alle sechs Lernziele kommen im Wortschatzteil vor.';}catch(e){config.textContent='Test konnte nicht erstellt werden: '+e.message;}});
$('#variant').addEventListener('change',()=>{plan=null;out.innerHTML='';$('#printStudent').disabled=true;$('#printTeacher').disabled=true;});
$('#printStudent').addEventListener('click',()=>{out.innerHTML=student(false);window.print();});
$('#printTeacher').addEventListener('click',()=>{out.innerHTML=student(true);window.print();});
window.Franz42Test={buildPlan,scenarios:SITUATIONS,coreIds:spec.ids};
})();
