/* Franz Lernatelier | Woche 42 | Selbstlernatelier zur Lernkontrolle in Woche 43.
   Ergänzt den vorhandenen Kurs; keine personenbezogenen Daten verlassen den Browser
   ausser über die bereits bestehende, schulseitige Fortschrittssynchronisation. */
(() => {
'use strict';
const DATA=window.FRANZ42_GOALS||{goals:[],choices:[]};
const BASE=window.FRANZ_TOPIC_CATALOG?.vocabulary||[];
const allById=Object.fromEntries(BASE.map(x=>[x.id,x]));
const enc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const textOnly=x=>String(x??'').replace(/\s+/g,' ').trim();
const stripAccents=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function normal(s,fold=false){
 let v=String(s??'').toLocaleLowerCase('fr').replace(/[’‘`´]/g,"'").replace(/[‐‑‒–—]/g,'-').replace(/\u2026|\.\.\./g,' ').replace(/[?!.,;:«»„“”]/g,' ').replace(/\s+/g,' ').trim();
 if(fold)v=stripAccents(v);
 return v;
}
function variants(fr){
 const s=String(fr||'');
 if(!s.includes('/'))return [s];
 const [a,b]=s.split(/\s*\/\s*/);
 if(!b)return[s];
 // The catalogue uses the slash exclusively for gender alternatives.
 const words=a.trim().split(/\s+/), stem=words.slice(0,-1).join(' ');
 return [...new Set([s,a,stem?stem+' '+b:b])];
}
function judge(input,card){
 const given=normal(input),fold=normal(input,true);
 if(!given)return {kind:'empty',message:'Schreiben Sie zuerst eine Antwort.'};
 if(given==='?'||given==='ich weiss es noch nicht'||given==='ich weiß es noch nicht')return {kind:'unknown',message:'Noch nicht gelernt – genau dafür ist das Training da.'};
 const isOpen=/…|\.\.\./.test(card.fr);
 const forms=variants(card.fr).map(v=>normal(v));
 const match=(v,target)=>isOpen?(v===target||v.startsWith(target+' ')):v===target;
 if(forms.some(form=>match(given,form)))return{kind:'correct',message:'Richtig und sauber geschrieben.'};
 if(forms.some(form=>match(fold,stripAccents(form))))return{kind:'accent',message:'Die Form stimmt fast. Kontrollieren Sie die Akzente und schreiben Sie nochmals ohne Hilfe.'};
 return {kind:'wrong',message:'Noch nicht ganz. Lesen Sie die korrekte Wendung und versuchen Sie sie später ohne Vorlage erneut.'};
}
const lookup=id=>allById[id];
const STAGES=[['kennen','01','Verstehen','Alle Ausdrücke und Bedeutungen kennenlernen.'],['zuordnen','02','Zuordnen','Französisch lesen und die richtige deutsche Bedeutung wählen.'],['schreiben','03','Selber schreiben','Aus einer deutschen Vorgabe die französische Form abrufen.'],['anwenden','04','Anwenden','In einer kleinen Situation den passenden Ausdruck schreiben.'],['festigen','05','Sichern','Unsichere Ausdrücke ein zweites Mal ohne Hilfe schreiben.']];
const byGoal=id=>DATA.goals.find(g=>g.id===id);
const byChoice=id=>DATA.choices.find(c=>c.id===id);
const estimatedDuty=36;
function createCoach(ctx){
 const $=s=>document.querySelector(s);
 let shadow='';
 function store(){let p=ctx.getState().prep;if(!p||typeof p!=='object'||Array.isArray(p))p=ctx.getState().prep={};for(const k of ['words','stages','cursors','inputs','hints','responses'])if(!p[k]||typeof p[k]!=='object'||Array.isArray(p[k]))p[k]={};if(!Array.isArray(p.choices))p.choices=[];if(!Array.isArray(p.focus))p.focus=[];return p;}
 function persist(){ctx.save();}
 function cards(){return ctx.getCards()||[];}
 function official(){return !!ctx.official();}
 function wordset(){return cards().length?cards():BASE;}
 function goalCards(g){const ids=new Set(g.ids);return wordset().filter(c=>ids.has(c.id));}
 function cardStatus(id){const w=store().words[id]||{};const passes=w.passes||{};return Object.values(passes).filter(Boolean).length>=2?'sicher':Object.values(passes).some(Boolean)?'im Aufbau':'noch üben';}
 function secureCount(){return wordset().filter(c=>cardStatus(c.id)==='sicher').length;}
 function subtitle(){return official()?`<span class="scope-approved">Verbindliche Liste geladen${ctx.groupLabel()?' · '+enc(ctx.groupLabel()):''}</span>`:`<span class="scope-pending">Basisliste zur Orientierung · verbindliche Auswahl noch nicht bestätigt</span>`;}
 function info(){const n=wordset().length;const r=secureCount();return `<div class="goal-metrics"><div><strong>${n}</strong><span>${official()?'verbindliche':'Basis-'}Einträge</span></div><div><strong>${r}</strong><span>zweimal sicher geschrieben</span></div><div><strong>${Math.max(0,n-r)}</strong><span>noch festigen</span></div></div>`;}
 function cover(title,eyebrow,lead){return `<div class="coach-heading"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p class="lead">${lead}</p></div>`;}
 function panel(title,body,klass=''){return `<section class="coach-panel ${klass}"><h2>${title}</h2>${body}</section>`;}
 const btn=(label,target,secondary=false)=>`<button class="btn ${secondary?'secondary':''}" data-route="${target}">${label}</button>`;
 function goalTried(g){const p=store();const n=goalCards(g).length;const count=Object.keys(p.responses).filter(key=>key.startsWith(g.id+':schreiben:')).length;return Math.min(count,n)>=Math.min(3,n);}
 function trainedFocus(){return store().focus.map(byGoal).filter(Boolean).filter(g=>goalCards(g).length&&goalTried(g)).length;}
 function progressText(){const p=store();const d=p.diagnosis?.submitted?'✓':'○';const s=p.final?.submitted?'✓':'○';const f=trainedFocus();return `${d} Standort · ${f}/2 Lernziele trainiert · ${s} Schlusscheck`;}


function nav(route){
  const current=route==='start'?'start':route==='pass'?'pass':route==='wahl'||route==='training'||route==='wordbank'||route.startsWith('mission-')?'wahl':'pflicht';
  const p=store();
  const numberDone=Number(!!p.examReady)+Number(!!p.diagnosis?.submitted)+Number(trainedFocus()>=2)+Number(!!p.final?.submitted);
  const items=[
    ['start','Start','Überblick',''],
    ['pflicht','Pflicht','Schritt für Schritt',`${numberDone}/4`],
    ['wahl','Wahl','Eigene Aufgaben',`${p.choices.length} gewählt`],
    ['pass','Mein Stand','Lernfortschritt','']
  ];
  return items.map(([id,title,subtitle,info],i)=>`<button type="button" data-route="${id}" class="journey-tab ${current===id?'active':''}" aria-current="${current===id?'page':'false'}"><span class="journey-tab-icon" aria-hidden="true">${['⌂','1','2','✓'][i]}</span><span class="journey-tab-text"><strong>${title}</strong><small>${subtitle}</small></span>${info?`<span class="journey-tab-meta">${info}</span>`:''}</button>`).join('');
}


function foot(route){
 const isGoal=route.startsWith('goal-');
 const isChoice=route.startsWith('mission-')||route==='training'||route==='wordbank';
 const back=isGoal?'ziele':isChoice?'wahl':route==='pflicht'||route==='pass'?'start':'pflicht';
 const backLabel=isGoal?'Alle sechs Lernziele':isChoice?'Zum Wahlbereich':back==='start'?'Zur Startseite':'Zur Pflichtübersicht';
 const nextRoute=route==='start'?'pflicht':route==='pruefung'?'diagnose':route==='diagnose'?'ziele':route==='ziele'?'wahl':route==='wahl'?'schluss':route==='schluss'?'pass':route==='pflicht'?'wahl':route==='pass'?'pflicht':'wahl';
 const nextLabel=route==='start'?'Mit Pflicht beginnen':route==='pruefung'?'Zum Standortcheck':route==='diagnose'?'Zwei Lernziele üben':route==='ziele'?'Zum Wahlbereich':route==='wahl'?'Zum Schlusscheck':route==='schluss'?'Meinen Stand ansehen':route==='pflicht'?'Zum Wahlbereich':route==='pass'?'Zur Pflichtübersicht':'Zur Wahlübersicht';
 return `<div class="footnav-inner">${route==='start'?'':`<button class="btn secondary" data-route="${back}">← ${backLabel}</button>`}<button class="btn" data-route="${nextRoute}">${nextLabel} →</button></div>`;
}

 function titleWord(c){return `<span lang="fr">${enc(c.fr)}</span>`;}
 function goalRows(g){const arr=goalCards(g);return arr.length?arr.map((c,i)=>`<tr><td>${i+1}</td><td lang="fr">${enc(c.fr)}</td><td>${enc(c.de)}</td><td>${cardStatus(c.id)}</td></tr>`).join(''):'<tr><td colspan="4">Für dieses Lernziel sind aktuell keine Wörter freigegeben.</td></tr>';}

function scopeNote(){
  if(official())return `<div class="scope-note scope-note-approved" role="status"><strong>Ihre verbindliche Wörterliste ist geladen.</strong><p>Genau diese Ausdrücke gehören zur angekündigten Lernkontrolle in Woche 43${ctx.groupLabel()?' ('+enc(ctx.groupLabel())+')':''}. Jeden französischen Ausdruck sollen Sie auch ohne Vorlage schreiben können.</p><button class="btn secondary" data-route="wortliste">Meine Wörterliste öffnen →</button></div>`;
  return `<div class="scope-note" role="status"><strong>Achtung: Die genaue Prüfungsliste ist noch nicht bestätigt.</strong><p>Sie sehen momentan <strong>44 Basiswendungen</strong> zum Üben. Das bedeutet <strong>nicht</strong>, dass alle 44 Wendungen an der Lernkontrolle vorkommen. Verbindlich ist nur die Liste, die Herr Marti Ihrer Klasse freigegeben hat.</p><div class="actions"><button class="btn secondary" data-route="wortliste">Basisliste ansehen</button><a href="../../index.html#home" class="btn secondary online-only">Mit Schulkonto anmelden</a></div></div>`;
}

 function testFacts(){return `<div class="requirements"><div><strong>Teil A</strong><span>4 Wendungen Französisch → Deutsch</span></div><div><strong>Teil B</strong><span>8 Vorgaben Deutsch → Französisch</span></div><div><strong>Teil C</strong><span>2 Situationen auf Französisch beantworten</span></div></div><p class="notice">Standard-Testvorlage: 12 Minuten, maximal 24 Punkte. Falls die offiziell freigegebene Gruppenliste weniger als 14 Einträge enthält, erzeugt der Testgenerator einen entsprechend kürzeren Test mit angepasster Punktzahl. Entscheidend sind die Angaben auf dem Testblatt.</p>`;}

function renderStart(){
  const p=store(),done=Number(!!p.examReady)+Number(!!p.diagnosis?.submitted)+Number(trainedFocus()>=2)+Number(!!p.final?.submitted);
  const selected=p.choices.map(byChoice).filter(Boolean);
  return `<section class="hero coach-hero"><img class="hero-img" src="../../assets/retour.jpg" alt="" loading="eager"><div class="hero-copy"><span class="eyebrow">Französisch · Woche 42 · 90 Minuten</span><h1>Bonjour!<br>Sie schaffen das.</h1><p>Sie beginnen bei den Grundlagen und bestimmen dann selbst, was Sie üben.</p><div class="hero-keynote">Heute wird <strong>noch kein Test</strong> geschrieben. Die Lernkontrolle ist erst in <strong>Woche 43</strong>.</div><div class="actions"><button class="btn hero-action" data-route="pflicht">Jetzt mit Pflicht starten →</button><button class="btn secondary" data-route="wahl">Wahlaufträge entdecken</button></div></div></section>
  <section class="entry-two" aria-label="Ihre zwei Arbeitsbereiche"><article class="entry-card entry-must"><div class="entry-card-head"><span class="section-token">1 · PFLICHT</span><strong>35–40 Minuten</strong></div><h2>Das machen alle.</h2><p>Was kommt im Test? Wie gut kann ich die Wörter bereits? Was übe ich zuerst?</p><ol><li>Prüfungsstoff verstehen</li><li>Ohne Druck ausprobieren</li><li>Zwei Lernziele trainieren</li><li>Am Ende: Schlusscheck</li></ol><button class="btn" data-route="pflicht">Meine Pflichtaufträge →</button></article><article class="entry-card entry-choice"><div class="entry-card-head"><span class="section-token secondary">2 · WAHL</span><strong>45–50 Minuten</strong></div><h2>Sie entscheiden.</h2><p>Lieber allein üben, sich testen oder mit jemandem sprechen? Sie wählen die passenden Aufträge.</p><ol><li>Neun verschiedene Angebote</li><li>Aufträge selbst zusammenstellen</li><li>Eigene Reihenfolge bestimmen</li><li>Weiterarbeiten, wo Sie möchten</li></ol><button class="btn secondary" data-route="wahl">Alle Wahlaufträge ansehen →</button></article></section>
  ${panel('So gelingt Ihnen der Einstieg',`<div class="starter-steps"><div><b>1</b><span><strong>Öffnen Sie Pflicht.</strong><small>Die Webseite sagt Ihnen, was Sie zuerst machen.</small></span></div><div><b>2</b><span><strong>Versuchen Sie die Aufgaben.</strong><small>Sie brauchen keine Vorkenntnisse. Hilfen und Lösungen sind vorhanden.</small></span></div><div><b>3</b><span><strong>Gestalten Sie Ihren Wahlteil.</strong><small>Speichern müssen Sie nichts extra: Die Antworten bleiben auf diesem Gerät.</small></span></div></div><div class="actions"><button class="btn" data-route="pflicht">Schritt 1 beginnen →</button></div>`)}
  <section class="home-progress"><div><strong>Ihr bisheriger Stand</strong><p>${done} von 4 Pflichtteilen erledigt · ${selected.length} Wahlaufträge ausgesucht</p></div><button class="btn secondary" data-route="pass">Mein Lernstand →</button></section>`;
}


function renderDuty(){
 const p=store(),exam=!!p.examReady,diag=!!p.diagnosis?.submitted,focus=trainedFocus()>=2,final=!!p.final?.submitted;
 const tasks=[
  ['01','Prüfung verstehen','5 Min.','Welche Wörter müssen Sie schreiben? Was genau wird geprüft?','pruefung',exam,'Prüfungsstoff ansehen'],
  ['02','Standortcheck','7 Min.','Sechs kleine Schreibfragen. Wenn Sie etwas noch nicht wissen, ist das völlig in Ordnung.','diagnose',diag,'Check ausprobieren'],
  ['03','Zwei Lernziele üben','15–20 Min.','Wählen Sie zwei Lernziele und üben Sie zu beiden mindestens drei schriftliche Aufgaben.','ziele',focus,'Training auswählen'],
  ['04','Schlusscheck & Lernplan','8 Min. · am Ende','Nach den Wahlaufträgen prüfen Sie erneut und planen drei Wörter für Woche 43.','schluss',final,'Schlusscheck starten']
 ];

 return cover('Ihre Pflichtaufträge','Pflicht · Woche 42','Gehen Sie die vier Schritte nacheinander durch. Die Webseite zeigt, was bereits erledigt ist. Sie dürfen bei null beginnen.')
 +`<div class="duty-progress"><strong>${tasks.filter(t=>t[5]).length} / 4 erledigt</strong><div class="meter"><span style="width:${tasks.filter(t=>t[5]).length*25}%"></span></div><span>Richtwert: 35–40 Minuten. Dazwischen gehört der Wahlbereich.</span></div>`
 +`<div class="duty-grid">${tasks.map(([nr,title,time,desc,id,done,action])=>`<article class="duty-card ${done?'is-done':''}"><div class="duty-card-top"><span class="duty-nr">${nr}</span><span class="duty-state">${done?'✓ Erledigt':'Noch offen'}</span></div><h2>${title}</h2><p>${desc}</p><div class="duty-card-bottom"><span>${time}</span><button class="btn ${done?'secondary':''}" data-route="${id}">${done?'Nochmals öffnen':'Jetzt: '+action} →</button></div></article>`).join('')}</div>`
 +panel('Wichtig: Wann kommt die Lernkontrolle?',`<div class="test-postpone"><strong>Woche 42 = Lernen und Üben</strong><span>Woche 43 = schriftliche Lernkontrolle</span></div><p>Heute geht es darum, sicherer zu werden. Fehler helfen Ihnen zu erkennen, was Sie als Nächstes trainieren sollen.</p><div class="actions">${btn('Prüfungsstoff und Wörter ansehen','pruefung',true)}${btn('Wahlbereich ansehen','wahl',true)}</div>`);
}
function renderExam(){
 const p=store();
 return cover('Was kommt in der Lernkontrolle?','Pflicht · Schritt 1 von 4 · ca. 5 Minuten','Die Lernkontrolle ist in Woche 43. Heute schauen Sie genau an, welche Wörter und Aufgaben wichtig sind.')
 +panel('Das werden Sie schriftlich machen',`<div class="exam-readiness"><div><span class="exam-pict">A</span><h3>Französisch verstehen</h3><p>Sie lesen einen Ausdruck auf Französisch und schreiben auf Deutsch, was er bedeutet.</p><div class="exam-example"><span lang="fr">Comment tu t’appelles ?</span><strong>Wie heisst du?</strong></div></div><div><span class="exam-pict">B</span><h3>Selbst Französisch schreiben</h3><p>Sie lesen einen deutschen Ausdruck und schreiben den französischen Satz ohne Vorlage.</p><div class="exam-example"><span>Ich wohne in Bern.</span><strong lang="fr">J’habite à Berne.</strong></div></div><div><span class="exam-pict">C</span><h3>Passend reagieren</h3><p>Sie lesen eine einfache Situation und formulieren eine passende französische Frage oder Antwort.</p><div class="exam-example"><span>Sie möchten den Namen wissen.</span><strong lang="fr">Comment tu t’appelles ?</strong></div></div></div><details class="exam-detail"><summary>So sieht die Musterprüfung aus (Zeit und Punkte)</summary>${testFacts()}</details>`)
 +panel('Welche Wörter muss ich kennen?',`${scopeNote()}<p><strong>Für die schriftliche Lernkontrolle zählt nur Ihre verbindliche Gruppenliste.</strong> Sie üben die französische Schreibweise der Wendungen vollständig: Wörter, Fragen, Apostrophe und Akzente. Bei «…» schreiben Sie den gelernten Satzanfang und ergänzen passend.</p><div class="actions">${btn('Die vollständige Wörterliste öffnen →','wortliste')}${btn('Meine sechs Lernziele ansehen','ziele',true)}</div>`)
 +panel('Was kommt NICHT zusätzlich im Test?',`<p>Die neue Grammatik aus dem Wahlauftrag «Le labo des phrases» und Ihre Geschichte «Mon moment» sind <strong>zusätzliche Übungen</strong> – keine neue Wortliste für diese Lernkontrolle.</p><div class="exam-confirm"><label><input type="checkbox" data-coach-confirm-scope="1" ${p.examReady?'checked':''}><span>Ich weiss: <strong>Der Test ist erst in Woche 43.</strong> Ich muss die freigegebenen Wendungen auch ohne Vorlage schreiben können.</span></label></div><div class="actions">${btn('Weiter: Standortcheck →','diagnose')}</div>`);
}


function renderGoals(){
 const p=store();
 return cover('Meine sechs Lernziele','Pflicht · Schritt 3 von 4','Jedes Lernziel beginnt mit Erklärungen und Beispielen. Wählen Sie zwei Lernziele, die Sie heute üben möchten. Sie dürfen bei Stufe 1 starten.')
 +`<div class="goals-intro"><div><span class="goal-intro-icon">✓</span><strong>So lernen Sie Schritt für Schritt:</strong><p>1. Verstehen → 2. Erkennen → 3. Schreiben → 4. Anwenden → 5. Wiederholen</p></div><p><strong>Für den Pflichtteil:</strong> Wählen Sie zwei Lernziele und bearbeiten Sie zu jedem mindestens drei Schreibaufgaben. Sie müssen heute nicht alle Wörter können.</p></div>`
 +`<section class="coach-goalgrid">${DATA.goals.map((g,i)=>{const rows=goalCards(g),num=rows.filter(c=>cardStatus(c.id)==='sicher').length,example=rows[0],selected=p.focus.includes(g.id);return `<article class="goal-tile"><div class="goal-top"><span class="goal-number">LERNZIEL ${i+1}</span><span>${rows.length} Wörter/Wendungen</span></div><h2>${g.name}</h2><p>${g.goal}</p>${example?`<div class="goal-preview"><span lang="fr">${enc(example.fr)}</span><small>${enc(example.de)}</small></div>`:''}<div class="goal-progress"><span>${num} von ${rows.length} sicher geschrieben</span><div class="meter"><span style="width:${rows.length?Math.round(100*num/rows.length):0}%"></span></div></div><div class="goal-actions"><button class="btn" data-route="goal-${g.id}">Hier üben →</button><button class="btn secondary ${selected?'is-selected':''}" data-coach-focus="${g.id}">${selected?'✓ Für Pflicht gewählt':'Für Pflicht auswählen'}</button></div></article>`}).join('')}</section>`
 +panel('Ihre Auswahl für den Pflichtteil',`<p class="focus-count"><strong>${p.focus.length} von mindestens 2 Lernzielen ausgewählt.</strong> ${trainedFocus()} davon bereits mit mindestens drei Schreibaufgaben bearbeitet.</p><p>Beginnen Sie beim ersten Lernziel mit <strong>Stufe 1: Verstehen</strong>. Wenn Sie es schon gut können, gehen Sie zu Stufe 3: Schreiben.</p><div class="actions">${btn('Zur Pflichtübersicht','pflicht',true)}${btn('Zu den Wahlaufträgen →','wahl')}</div>`);
}

 function renderList(){
  const cols=DATA.goals.map((g,i)=>`<section class="word-list-group"><h2>Lernziel ${i+1}: ${g.name}</h2><p>${g.goal}</p><table class="coach-table"><thead><tr><th>Nr.</th><th>Französisch – schreiben</th><th>Deutsch – verstehen</th><th>Stand</th></tr></thead><tbody>${goalRows(g)}</tbody></table></section>`).join('');
  const head=cover('Meine vollständige Wörterliste','Prüfungsstoff · aus Woche 38','Alle Ausdrücke sind nach Lernzielen geordnet. Die französische Schreibweise steht immer vollständig dabei.');
  const intro=panel('Gültigkeit der Liste',scopeNote()+info()+`<div class="actions"><button class="btn" data-coach-print="1">Diese Liste drucken / als PDF speichern</button>${btn('Schreibtraining starten','ziele',true)}</div><p class="notice">Im Druck sind alle Wörter und Übersetzungen enthalten. Trainieren Sie zusätzlich mit abgedeckter französischer Spalte.</p><p class="scope-info">Der offizielle Gruppenumfang wird aus dem Lernatelier übernommen. Ohne bestätigte Gruppenzuordnung sehen Sie alle 44 vorhandenen Basiseinträge, nicht automatisch die Prüfungsfreigabe.</p>`);
  return head+intro+`<div class="print-head">FRANZ LERNATELIER · WOCHE 42 · LERNKONTROLLE WOCHE 43</div>`+cols+`<div class="actions">${btn('Zur Vorbereitung','pruefung')}</div>`;
 }


function renderChoice(){
 const p=store(),sel=p.choices.map(byChoice).filter(Boolean),total=sel.reduce((a,x)=>a+x.minutes,0);
 const cards=DATA.choices.map((c,i)=>{const selected=p.choices.includes(c.id);return `<article class="choice-card ${selected?'chosen':''}"><div class="choice-top"><span class="choice-number">${String(i+1).padStart(2,'0')}</span><span class="choice-time">${c.minutes} Minuten · ${c.mode}</span></div><h3>${c.title}</h3><p>${c.description}</p><p class="choice-value">${c.value}</p><div class="choice-buttons"><button class="btn" data-route="${c.id}">Auftrag starten →</button><button class="btn secondary" data-coach-plan="${c.id}">${selected?'✓ Im Plan · entfernen':'Für später auswählen'}</button></div></article>`;}).join('');
 return cover('Wahlbereich: Sie entscheiden','Wahl · ca. 45–50 Minuten','Suchen Sie sich die Aufträge aus, die Ihnen helfen oder Freude machen. Sie müssen nicht alles bearbeiten.')
 +`<div class="choice-planner"><div><span class="section-token secondary">MEIN PLAN</span><h2>${sel.length} ausgewählt · ${total} Minuten</h2><p>${total===0?'Suchen Sie sich zwei oder drei passende Aufträge aus.':total<35?'Ihr Plan hat noch Platz. Sie können später weitere Aufträge ergänzen.':total>55?'Das ist mehr, als in der Lektion Platz hat. Lassen Sie bei Bedarf etwas weg.':'Gut: Ihre Auswahl passt zur verfügbaren Wahlzeit.'}</p><div class="meter"><span style="width:${Math.min(100,Math.round(total/50*100))}%"></span></div></div><button class="btn secondary" data-coach-plan-clear="1">Auswahl löschen</button></div>`
 +`<div class="choice-tip"><strong>So funktioniert der Wahlbereich:</strong> Klicken Sie auf <em>Auftrag starten</em>, wenn Sie direkt beginnen möchten. Mit <em>Für später auswählen</em> merken Sie sich einen Auftrag in Ihrem Plan.</div>`
 +`<section class="choice-grid">${cards}</section><div class="choice-workbook"><div><strong>Lieber mit Stift und Papier arbeiten?</strong><p>Öffnen Sie das Wahlheft. Dort können Sie Ihre Antworten von Hand notieren.</p></div><a class="btn secondary" href="carnet.html" target="_blank" rel="noopener">Wahlheft öffnen / drucken ↗</a></div>`
 +panel('Sie möchten vor allem für die Lernkontrolle üben?',`<p>Dann sind die fünf Trainingsstufen Ihrer Lernziele besonders hilfreich. Sie können dieselben Wörter später nochmals schreiben und direkt kontrollieren.</p><div class="actions">${btn('Schreibtraining zu meinen Lernzielen','ziele')}${btn('Meine Testwörter als Liste ansehen','wortliste',true)}</div><div class="choice-last"><strong>Am Ende der Lektion ist der Schlusscheck Pflicht.</strong>${btn('Zum Schlusscheck','schluss',true)}</div>`)
 +`<p class="choice-week38 online-only">Noch offene Arbeiten aus früheren Wochen? <a href="../woche-38/index.html">Woche 38 öffnen</a> – danach kommen Sie hierher zurück.</p>`;
}

 function calcPlan(){const p=store(),sel=p.choices.map(byChoice).filter(Boolean),total=sel.reduce((s,x)=>s+x.minutes,0);return {selected:sel,minutes:total};}
 function stageOf(gid){return store().stages[gid]||'kennen';}
 function cursor(gid,stage){return Math.max(0,Number(store().cursors[gid+':'+stage])||0);}
 function inputKey(gid,stage,key){return gid+':'+stage+':'+key;}
 function getFeedback(key){return store().responses[key];}
 function wordState(id){const p=store();return p.words[id]||(p.words[id]={passes:{},attempts:0,mistakes:0});}
 function register(id,phase,verdict,hint){const w=wordState(id);w.attempts++;if(verdict==='correct'&&!hint){w.passes[phase]=true;w.lastSuccess=Date.now();}else if(verdict!=='correct'){w.mistakes++;w.lastIssue=verdict;}persist();}
 function lineMeter(now,total){return `<div class="progress-line"><strong>${Math.min(now+1,total)} von ${total}</strong><div class="meter"><span style="width:${total?Math.round(Math.min(now,total)/total*100):0}%"></span></div></div>`;}
 function currentCard(g,stage){const list=goalCards(g);return list[cursor(g.id,stage)%Math.max(1,list.length)]||null;}
 function keysStage(g,stage){const p=store(),a=goalCards(g);if(stage==='anwenden')return g.situations.filter(s=>a.some(c=>c.id===s.answerId));if(stage==='festigen'){const todo=a.filter(c=>cardStatus(c.id)!=='sicher');return todo.length?todo:a;}return a;}
 function stageMenu(g){const current=stageOf(g.id);return `<nav class="coach-stage-tabs" aria-label="Trainingsstufen">${STAGES.map(([id,num,title])=>`<button data-coach-stage="${g.id}|${id}" class="${current===id?'active':''}" ${current===id?'aria-current="step"':''}><small>${num}</small><span>${title}</span></button>`).join('')}</nav>`;}
 function feedbackFor(key){const fb=getFeedback(key);return fb?`<div class="coach-feedback ${fb.kind==='correct'?'positive':fb.kind==='accent'?'almost':'needs-work'}" role="status"><strong>${enc(fb.message)}</strong>${fb.example?`<p>Beispiellösung: <span lang="fr">${enc(fb.example)}</span></p>`:''}${fb.helpUsed?'<p>Mit Hilfe gelöst. Für «sicher» schreiben Sie die Wendung später erneut ohne Hilfe.</p>':''}</div>`:'';}
 function renderStage(g){const stage=stageOf(g.id),list=keysStage(g,stage),p=store();if(!goalCards(g).length)return `<p>In der aktuell geladenen Liste gibt es für dieses Lernziel keine Einträge. Wählen Sie ein anderes Lernziel.</p>`;
  if(stage==='kennen')return `<div class="stage-guide"><span class="stage-label">STUFE 1 VON 5</span><h3>Verstehen: So sehen die Wörter aus.</h3><p>Sie müssen noch nichts wissen. Lesen Sie die französische Wendung und gleich darunter die deutsche Übersetzung. Hören Sie die französische Aussprache an, wenn Sie möchten.</p></div><div class="coach-knowledge">${goalCards(g).map((c,i)=>`<article class="knowledge-card"><span class="knowledge-num">${String(i+1).padStart(2,'0')}</span><div><strong lang="fr">${enc(c.fr)}</strong><p>${enc(c.de)}</p></div><button class="btn secondary small" data-coach-speak="${c.id}">Anhören</button></article>`).join('')}</div><p class="learning-note">Merktipp: Lesen – laut sprechen – kurz wegschauen – nochmals erinnern. In der nächsten Stufe üben Sie ohne die deutsche Übersetzung.</p><div class="actions"><button class="btn" data-coach-stage="${g.id}|zuordnen">Ich bin bereit: Stufe 2 →</button></div>`;
 if(stage==='zuordnen'){
 const at=cursor(g.id,stage);if(at>=list.length)return stageEnd(g,'zuordnen','schreiben');const c=list[at],key=inputKey(g.id,stage,c.id),fb=getFeedback(key);const other=[...BASE].filter(x=>x.id!==c.id && normal(x.de)!==normal(c.de));const seed=Number(c.id.split('.')[1]);const selected=[c,...other.slice((seed*3)%Math.max(other.length-3,1)).concat(other).slice(0,3)];const options=selected.slice(0,4).sort((a,b)=>((parseInt(a.id.split('.')[1],10)*7+seed)%13)-((parseInt(b.id.split('.')[1],10)*7+seed)%13));
 return `<h3>Stufe 2 · Bedeutung zuordnen</h3>${lineMeter(at,list.length)}<p>Was bedeutet diese französische Wendung? Entscheiden Sie sich, bevor Sie die Rückmeldung öffnen.</p><div class="challenge-word"><span lang="fr">${enc(c.fr)}</span><button class="btn secondary small" data-coach-speak="${c.id}">Anhören</button></div><fieldset class="meaning-options"><legend class="sr-only">Deutsche Bedeutung wählen</legend>${options.map(o=>`<label class="${p.inputs[key]===o.id?'chosen':''}"><input type="radio" name="coachMeaning" data-coach-meaning="${key}" value="${o.id}" ${p.inputs[key]===o.id?'checked':''} ${fb?'disabled':''}>${enc(o.de)}</label>`).join('')}</fieldset>${feedbackFor(key)}<div class="actions">${fb?`<button class="btn" data-coach-next="${g.id}|${stage}">Nächste Karte</button>`:`<button class="btn" data-coach-check="${g.id}|${stage}|${c.id}">Antwort prüfen</button>`}</div>`;
 }
 if(stage==='schreiben'||stage==='festigen'){
 const at=cursor(g.id,stage);if(stage==='festigen'&&keysStage(g,stage).every(c=>cardStatus(c.id)==='sicher'))return `<div class="coach-complete"><h3>Dieses Lernziel ist gesichert.</h3><p>Sie haben alle zugeordneten Ausdrücke mindestens zweimal ohne Hilfe korrekt geschrieben. Wiederholen Sie sie nach einem zeitlichen Abstand nochmals, damit sie sicher bleiben.</p><div class="actions">${btn('Andere Lernziele trainieren','ziele')}${btn('Schlusscheck','schluss',true)}</div></div>`;
 if(!list.length)return `<p>Kein Wort muss in dieser Stufe wiederholt werden.</p>`;
 const idx=stage==='festigen'?at%list.length:at;
 if(stage==='schreiben'&&at>=list.length)return stageEnd(g,'schreiben','anwenden');
 const c=list[idx],key=inputKey(g.id,stage,stage==='festigen'?c.id+'-'+at:c.id),fb=getFeedback(key),hint=!!p.hints[key];
 return `<h3>Stufe ${stage==='schreiben'?'3 · Selber schreiben':'5 · Sichern'}</h3>${lineMeter(idx,list.length)}<p>${stage==='schreiben'?'Schreiben Sie die französische Wendung aus dem Gedächtnis. Prüfen Sie danach Ihre Schreibweise.':'Wiederholen Sie die noch unsicheren Wörter ohne Vorlage. Für «sicher» brauchen Sie zwei unabhängige richtige Abrufe.'}</p><div class="challenge-word"><small>Deutsch → Französisch</small><strong>${enc(c.de)}</strong></div><label class="answer-label" for="coachAnswer">Ihre französische Antwort</label><input class="coach-writing" id="coachAnswer" data-coach-input="${key}" value="${enc(p.inputs[key]||'')}" placeholder="Schreiben Sie hier auf Französisch …" autocomplete="off" autocapitalize="off" spellcheck="false" ${fb?'readonly':''}><p class="notice">Bei «…» muss die Satzstruktur stimmen; eigene Ergänzungen dürfen variieren. Bei Schrägstrichformen reicht die passende Variante.</p>${hint?`<div class="coach-hint">Starthilfe: <strong lang="fr">${enc(c.fr.split(/\s+/).slice(0,2).join(' '))}</strong> … <span>Für diese Runde zählt die Lösung nicht als «ohne Hilfe».</span></div>`:''}${feedbackFor(key)}<div class="actions">${fb?`<button class="btn" data-coach-next="${g.id}|${stage}">${stage==='festigen'?'Nächstes unsicheres Wort':'Nächste Aufgabe'}</button>`:`<button class="btn" data-coach-check="${g.id}|${stage}|${c.id}">Schreibweise prüfen</button>`}${!fb&&!hint?`<button class="btn secondary" data-coach-hint="${key}">Kleine Starthilfe</button>`:''}<button class="btn secondary" data-coach-stage="${g.id}|${stage==='festigen'?'kennen':'zuordnen'}">Andere Übung</button></div>`;
 }
 if(stage==='anwenden'){
 const at=cursor(g.id,stage);if(at>=list.length)return stageEnd(g,'anwenden','festigen');if(!list.length)return stageEnd(g,'anwenden','festigen');const t=list[at],c=lookup(t.answerId),key=inputKey(g.id,stage,t.answerId+'-'+at),fb=getFeedback(key);
 return `<h3>Stufe 4 · Anwenden</h3>${lineMeter(at,list.length)}<p>Lesen Sie die Situation. Schreiben Sie eine passende französische Formulierung. Mehrere sprachlich korrekte Antworten sind möglich.</p><div class="challenge-word context-prompt"><small>Situation ${at+1}</small><strong>${enc(t.prompt)}</strong></div><label class="answer-label" for="coachAnswer">Ihre Antwort</label><input class="coach-writing" id="coachAnswer" data-coach-input="${key}" value="${enc(p.inputs[key]||'')}" placeholder="Votre réponse …" autocomplete="off" spellcheck="false" ${fb?'readonly':''}>${feedbackFor(key)}${fb&&fb.kind!=='correct'?`<p class="notice">Die automatische Rückmeldung vergleicht mit der gelernten Musterform. Wenn Sie eine andere korrekte Formulierung gewählt haben, kontrollieren Sie diese mit der Lehrperson.</p>`:''}<div class="actions">${fb?`<button class="btn" data-coach-next="${g.id}|${stage}">Nächste Situation</button>`:`<button class="btn" data-coach-check="${g.id}|${stage}|${c.id}">Mit Muster vergleichen</button>`}</div>`;
 }
 return '';
 }
 function stageEnd(g,stage,nextStage){return `<div class="coach-complete"><h3>Diese Runde ist abgeschlossen.</h3><p>Sie haben alle Aufgaben der aktuellen Stufe bearbeitet. Unsichere Wörter bleiben in Ihrem persönlichen Training erhalten.</p><div class="actions"><button class="btn secondary" data-coach-reset="${g.id}|${stage}">Diese Stufe erneut üben</button><button class="btn" data-coach-stage="${g.id}|${nextStage}">Weiter: ${STAGES.find(s=>s[0]===nextStage)?.[2]||nextStage}</button>${btn('Anderes Lernziel','ziele',true)}</div></div>`;}
 function renderGoal(id){const g=byGoal(id);if(!g)return renderGoals();const list=goalCards(g),known=list.filter(c=>cardStatus(c.id)==='sicher').length,selected=store().focus.includes(g.id);return cover(g.name,`Lernziel ${DATA.goals.indexOf(g)+1} · ${g.time}` ,g.goal)+`<div class="goal-detail-intro"><div><strong>Das kann ich nach dem Training</strong><p>${g.success}</p><p class="muted">${g.why}</p></div><div><strong>${known} / ${list.length}</strong><small>Ausdrücke sicher geschrieben</small><div class="meter"><span style="width:${list.length?known/list.length*100:0}%"></span></div></div></div><div class="actions coach-inline-start"><button class="btn secondary" data-coach-focus="${g.id}">${selected?'Aus meinem Lernfokus nehmen':'In meinen Lernfokus aufnehmen'}</button>${btn('Alle Lernziele','ziele',true)}</div>${stageMenu(g)}${panel('',renderStage(g),'stage-panel')}`;
 }
 function diagnosticIds(phase){const p=store();const record=p[phase]||(p[phase]={ids:[],inputs:{},submitted:false});const possible=DATA.goals.map(g=>goalCards(g)).filter(a=>a.length).map(a=>a[(phase==='final'?a.length-1:0)]?.id);const valid=new Set(wordset().map(c=>c.id));if(record.ids.length!==possible.length||record.ids.some(id=>!valid.has(id))){record.ids=possible;record.inputs={};record.submitted=false;record.verdicts={};}return record;}
 function renderCheck(phase){const end=phase==='final',p=store(),check=diagnosticIds(end?'final':'diagnosis'),cardsHere=check.ids.map(lookup).filter(Boolean),n=cardsHere.length,correct=cardsHere.filter(c=>check.verdicts?.[c.id]?.kind==='correct').length;
 return cover(end?'Mein Schlusscheck':'Mein Standortcheck',end?'Pflicht · Abschliessen · 8 Min.':'Pflicht · Standort bestimmen · 7 Min.',end?'Eine zweite Abrufrunde zeigt, was schon sicherer geworden ist. Danach nehmen Sie drei konkrete Wörter mit in Woche 43.':'Sie beginnen bei null? Kein Problem. Wenn Sie etwas nicht wissen, klicken Sie auf «Ich weiss es noch nicht». Hier gibt es keine Note.')+panel(n+' kurze Schreibaufgaben',`<p>Schreiben Sie die französische Form zur deutschen Vorgabe. Arbeiten Sie aus dem Gedächtnis. Alle Aufgaben beziehen sich auf die ${official()?'für Ihre Gruppe freigegebene':'momentan verfügbare Basis-'}Liste.</p>${!official()?`<p class="scope-note">Ihre Gruppenliste ist noch nicht bestätigt. Die Auswertung ist nur eine Übung und keine verbindliche Prüfungsprognose.</p>`:''}<div class="diag-grid">${cardsHere.map((c,i)=>{const fb=check.verdicts?.[c.id];return `<div class="diag-item"><label for="diag-${end?'f':'d'}-${i}"><strong>${i+1}. ${enc(c.de)}</strong><small>${enc(byGoal(DATA.goals.find(g=>g.ids.includes(c.id))?.id)?.short||'')}</small></label><input id="diag-${end?'f':'d'}-${i}" data-coach-check-input="${phase}|${c.id}" value="${enc(check.inputs[c.id]||'')}" placeholder="Auf Französisch schreiben" autocomplete="off" spellcheck="false" ${check.submitted?'readonly':''}>${!check.submitted?`<button type="button" class="btn secondary small dontknow" data-coach-dontknow="${phase}|${c.id}">Ich weiss es noch nicht</button>`:''}${check.submitted?`<div class="answer-result ${fb?.kind==='correct'?'good':'needs'}">${fb?.kind==='correct'?'Richtig':fb?.kind==='accent'?'Akzente prüfen':fb?.kind==='unknown'?'Jetzt lernen':'Noch üben'} · <span lang="fr">${enc(c.fr)}</span></div>`:''}</div>`}).join('')}</div>${check.submitted?`<div class="check-summary"><h3>${correct} von ${n} Mustern unmittelbar richtig geschrieben</h3><p>${correct===n?'Sehr gut: Auch hier hilft eine spätere Wiederholung, damit Sie die Wendungen behalten.':'Die Rückmeldung zeigt genau, welche Ausdrücke Sie nochmals aus dem Gedächtnis abrufen sollten. Das ist ein Lernsignal, keine Note.'}</p>${end?`<div class="next"><strong>Mein nächster Lernschritt für Woche 43</strong>${nextPlan(check)}</div>`:`<div class="next"><strong>Weiterarbeiten</strong>Wählen Sie jetzt zwei Lernziele. Bearbeiten Sie dort zuerst Stufe 2 und 3, später die gezielte Wiederholung.</div>`}</div>`:''}<div class="actions">${!check.submitted?`<button class="btn" data-coach-submit="${phase}">Antworten prüfen</button>`:`<button class="btn secondary" data-coach-retry-check="${phase}">Neue Runde beginnen</button>`}${btn(end?'Zum persönlichen Lernstand':'Lernziele auswählen',end?'pass':'ziele',true)}</div>`);
 }
 function nextPlan(r){const missed=r.ids.map(lookup).filter(c=>r.verdicts[c.id]?.kind!=='correct').slice(0,3);const sample=missed.length?missed:r.ids.map(lookup).filter(Boolean).slice(0,3);return `<p>Diese drei Ausdrücke kommen morgen noch einmal dran: <strong>${sample.map(c=>enc(c.de)).join(' · ')}</strong>.</p><p>5 Minuten: Deutsch ansehen, Französisch ohne Vorlage schreiben, sofort kontrollieren und nach einer Pause wiederholen.</p>`;}
 function dashboard(){const p=store(),secure=secureCount(),n=wordset().length,counts=DATA.goals.map(g=>({g,c:goalCards(g)})),focus=p.focus.map(byGoal).filter(Boolean),choices=calcPlan();return cover('Mein Stand & Weiterarbeiten','Lernpass · Woche 42','Sie sehen, welche Bereiche Sie bearbeitet haben, was Sie bereits schreiben können und was noch offen ist.')+panel('Meine Vorbereitung auf Woche 43',`${scopeNote()}${info()}<div class="pass-steps"><div><strong>${p.diagnosis?.submitted?'Erledigt':'Noch offen'}</strong><span>Standortcheck</span>${btn('Öffnen','diagnose',true)}</div><div><strong>${trainedFocus()>=2?'Mindestens zwei Lernziele trainiert':trainedFocus()+' von 2 Lernzielen trainiert'}</strong><span>Mindestens drei Schreibaufgaben in zwei Lernzielen</span>${btn('Öffnen','ziele',true)}</div><div><strong>${p.final?.submitted?'Erledigt':'Noch offen'}</strong><span>Schlusscheck und Lernplan</span>${btn('Öffnen','schluss',true)}</div></div><p class="notice">Es geht um sichere Fortschritte, nicht um eine künstliche Punktzahl. Eine gute Vorbereitung entsteht durch wiederholtes Abrufen, insbesondere ohne Hilfen.</p>`)+panel('Fortschritt je Lernziel',`<div class="pass-goals">${counts.map(({g,c},i)=>{const good=c.filter(w=>cardStatus(w.id)==='sicher').length;return `<div><div><strong>LZ ${i+1} · ${g.name}</strong><small>${good} / ${c.length} sicher</small></div><div class="meter"><span style="width:${c.length?good/c.length*100:0}%"></span></div><button data-route="goal-${g.id}" class="btn secondary small">Weitertrainieren</button></div>`}).join('')}</div>`)+panel('Meine Wahlaufträge',`<p>${choices.selected.length} vorgemerkt, ungefähr ${choices.minutes} Minuten.</p>${choices.selected.length?`<ul>${choices.selected.map(c=>`<li>${enc(c.title)} · ${c.minutes} Min.</li>`).join('')}</ul>`:'<p>Noch nichts ausgewählt.</p>'}<div class="actions">${btn('Wahlbereich','wahl')}</div>`)+panel('Sicherung',`<p>Ihre Arbeit wird auf diesem Gerät gespeichert. Nutzen Sie bei Gerätewechsel den Export; die bereits vorhandene Cloud-Synchronisation des Lernateliers bleibt aktiv, sofern Sie mit Ihrem Konto angemeldet sind.</p><div class="actions"><button class="btn secondary" data-export="1">Lernstand exportieren</button><button class="btn secondary" data-import="1">Sicherung importieren</button></div><input type="file" id="importFile" accept=".json,application/json" hidden><p class="notice">Aufnahmen bleiben getrennte Dateien und sind nicht Teil der JSON-Sicherung.</p>`);
 }
 function acknowledgeChoice(id){const p=store();if(p.choices.includes(id))p.choices=p.choices.filter(x=>x!==id);else p.choices.push(id);persist();ctx.render();}
 function processCheck(phase){const end=phase==='final',r=diagnosticIds(end?'final':'diagnosis');if(r.submitted)return;const empty=r.ids.filter(id=>!String(r.inputs[id]||'').trim());if(empty.length){ctx.toast(`Es fehlen noch ${empty.length} Antworten. Schreiben Sie zu jeder Vorgabe etwas auf.`);return;}r.verdicts={};for(const id of r.ids){const v=judge(r.inputs[id],lookup(id));r.verdicts[id]={kind:v.kind};if(v.kind==='correct')register(id,end?'abschluss':'standort','correct',false);else register(id,end?'abschluss':'standort',v.kind,false);}r.submitted=true;persist();ctx.render();}
 function markAnswer(payload){const [gid,stage,id]=payload.split('|');const g=byGoal(gid);if(!g||!['zuordnen','schreiben','anwenden','festigen'].includes(stage))return;const p=store(),at=cursor(gid,stage),t=stage==='anwenden'?keysStage(g,stage)[at]:keysStage(g,stage)[stage==='festigen'?at%keysStage(g,stage).length:at];if(!t)return;const key=inputKey(gid,stage,stage==='anwenden'||stage==='festigen'?id+'-'+at:id),raw=p.inputs[key];if(p.responses[key])return;
 if(stage==='zuordnen'){
 if(!raw){ctx.toast('Wählen Sie zuerst eine deutsche Bedeutung.');return;}
 const target=lookup(id),ok=raw===id;
 p.responses[key]={kind:ok?'correct':'wrong',message:ok?'Genau. Sie haben die Bedeutung erkannt.':'Noch nicht. Die richtige Bedeutung lautet: '+target.de,example:target.fr};
 if(!ok)wordState(id).mistakes++;
 }else{
 const target=lookup(id),hint=!!p.hints[key],v=judge(raw,target);
 if(v.kind==='empty'){ctx.toast(v.message);return;}
 p.responses[key]={kind:v.kind,message:v.message,example:target.fr,helpUsed:hint};register(id,stage,v.kind,hint);
 }
 persist();ctx.render();}
 function advance(payload){const [gid,stage]=payload.split('|'),p=store(),g=byGoal(gid);if(!g)return;const at=cursor(gid,stage);p.cursors[gid+':'+stage]=at+1;
 if(stage==='festigen'&&p.cursors[gid+':'+stage]>1000)p.cursors[gid+':'+stage]=0;
 if(stage!=='festigen'&&p.cursors[gid+':'+stage]>=keysStage(g,stage).length){const next={zuordnen:'schreiben',schreiben:'anwenden',anwenden:'festigen'}[stage];if(next)p.stages[gid]=next;}
 persist();ctx.render();}
 function stageChange(payload){const [gid,stage]=payload.split('|');if(!byGoal(gid)||!STAGES.some(x=>x[0]===stage))return;store().stages[gid]=stage;persist();ctx.render();}
 function onClick(event){const el=event.target.closest('[data-coach-confirm-scope],[data-coach-dontknow],[data-coach-plan],[data-coach-plan-clear],[data-coach-focus],[data-coach-stage],[data-coach-check],[data-coach-next],[data-coach-hint],[data-coach-submit],[data-coach-retry-check],[data-coach-print],[data-coach-speak],[data-coach-reset]');if(!el)return;
 if(el.dataset.coachDontknow){const [phase,id]=el.dataset.coachDontknow.split('|');const r=diagnosticIds(phase==='final'?'final':'diagnosis');if(!r.submitted){r.inputs[id]='?';persist();ctx.render();}return;}
 if(el.dataset.coachPlan){acknowledgeChoice(el.dataset.coachPlan);return;}
 if(el.hasAttribute('data-coach-plan-clear')){store().choices=[];persist();ctx.render();return;}
 if(el.dataset.coachFocus){const p=store(),id=el.dataset.coachFocus;if(!byGoal(id))return;p.focus=p.focus.includes(id)?p.focus.filter(x=>x!==id):[...p.focus,id];persist();ctx.render();return;}
 if(el.dataset.coachStage){stageChange(el.dataset.coachStage);return;}
 if(el.dataset.coachReset){const [g,stage]=el.dataset.coachReset.split('|'),p=store();if(!byGoal(g))return;p.cursors[g+':'+stage]=0;for(const k of Object.keys(p.responses))if(k.startsWith(g+':'+stage+':')){delete p.responses[k];delete p.inputs[k];delete p.hints[k];}persist();ctx.render();return;}
 if(el.dataset.coachCheck){markAnswer(el.dataset.coachCheck);return;}
 if(el.dataset.coachNext){advance(el.dataset.coachNext);return;}
 if(el.dataset.coachHint){store().hints[el.dataset.coachHint]=true;persist();ctx.render();return;}
 if(el.dataset.coachSubmit){processCheck(el.dataset.coachSubmit);return;}
 if(el.dataset.coachRetryCheck){const key=el.dataset.coachRetryCheck;const p=store();p[key==='final'?'final':'diagnosis']={ids:[],inputs:{},submitted:false,verdicts:{}};persist();ctx.render();return;}
 if(el.hasAttribute('data-coach-print')){window.print();return;}
 if(el.dataset.coachSpeak){ctx.speakWord(lookup(el.dataset.coachSpeak)?.fr||'');return;}
 }
 function onInput(event){const el=event.target;if(el.dataset.coachInput){store().inputs[el.dataset.coachInput]=el.value;persist();}if(el.dataset.coachCheckInput){const [phase,id]=el.dataset.coachCheckInput.split('|');const r=diagnosticIds(phase==='final'?'final':'diagnosis');if(!r.submitted)r.inputs[id]=el.value;persist();}}
 function onChange(event){const el=event.target;if(el.dataset.coachMeaning){store().inputs[el.dataset.coachMeaning]=el.value;persist();}
 if(el.hasAttribute('data-coach-confirm-scope')){store().examReady=el.checked;persist();ctx.render();}}
 document.addEventListener('click',onClick);
 document.addEventListener('input',onInput);
 document.addEventListener('change',onChange);
 return {nav,foot,renderStart,renderDuty,renderExam,renderGoals,renderList,renderChoice,renderGoal,renderCheck,dashboard,info,goalCards,cardStatus,scopeNote,subtitle,judge,secureCount};
}
window.FRANZ42_COACH_DATA=DATA;
window.createFranz42Coach=createCoach;
window.FRANZ42_JUDGE=judge;
})();
