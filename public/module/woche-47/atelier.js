(() => {
  'use strict';
  const main = document.querySelector('main');
  const numbers = globalThis.W47Numbers || [];
  const times = globalThis.W47Times || [];
  const verbs = globalThis.W47Verbs || [];
  const bank = [...numbers, ...times, ...verbs];
  const byId = new Map(bank.map(q => [q.id, q]));
  const goals = {
    G0: ['Verben im présent', 'Ich bilde die passende Präsensform zu Person und Infinitiv.'],
    G1: ['Zahlwerte verstehen', 'Ich erkenne gehörte und gelesene Zahlen von 0 bis 1’000’000 und notiere sie in Ziffern.'],
    G2: ['Zahlen bilden und schreiben', 'Ich gliedere grosse Zahlen bei mille und schreibe Zahlwörter mit cent und quatre-vingts korrekt.'],
    G3: ['Uhrzeiten verstehen', 'Ich lese die analoge Uhr und notiere gehörte Uhrzeiten mit Tageszeit im 24-Stunden-Format.'],
    G4: ['Uhrzeiten ausdrücken', 'Ich gebe eine Uhrzeit in der Fahrplansprache und im Gespräch an, auch mit et quart, et demie und moins le quart.']
  };
  const examGoals = ['G1','G2','G3','G4'];
  const levels = ['Alle Stufen','Basis','Aufbau','Vertiefung'];
  const types = {choice:'Auswählen',input:'Schreiben',listen:'Hören',order:'Bausteine ordnen'};
  const labels = {zahlen:'Zahlen',zeiten:'Uhrzeiten',verben:'Verben',fehler:'Schwierige Aufgaben'};
  const steps = [
    ['Verben repetieren','0–15 Min.','Wärmen Sie sich mit vier kurzen Abrufaufgaben auf. Nehmen Sie dann die Verbkarten für die drei Partnerrunden.'],
    ['Lernkontrolle schreiben','15–52 Min.','Legen Sie die digitalen Hilfen weg. Sie schreiben die Lernkontrolle auf Papier.'],
    ['Uhrzeiten üben','52–63 Min.','Hören und lesen Sie Uhrzeiten. Wechseln Sie zwischen einer Zeit im Fahrplan und einer Formulierung im Gespräch.'],
    ['Zahlen üben','63–75 Min.','Hören, zerlegen und schreiben Sie Zahlen. Achten Sie bei grossen Zahlen besonders auf die Stellen nach mille.'],
    ['Am Festivalschalter','75–85 Min.','Arbeiten Sie zu zweit. Erfragen und bestätigen Sie gegenseitig drei Angaben zum Festival.'],
    ['Persönlichen Lerncheck machen','85–90 Min.','Im Unterricht lösen Sie den kurzen Schlusscheck auf Seite 4 des Lernhefts. Für eine ausführliche Standortbestimmung können Sie anschliessend den digitalen Lerncheck bearbeiten.']
  ];
  function parseStore(storage, key) { try {return JSON.parse(storage.getItem(key)) || {};} catch {return {};} }
  function accountId() {
    try {
      const a = parseStore(localStorage,'franzLernatelierLearner_v1');
      if (localStorage.getItem('franzLernatelierLocalOnly_v1') === '1' || a.localOnly) return 'gast';
      return (typeof a.email === 'string' && a.email.trim().toLowerCase()) || 'gast';
    } catch {return 'gast';}
  }
  const key = 'franzoesischLernatelierW47_v1:' + accountId();
  const sessionKey = key + ':runde';
  function initial() {
    try {const old = parseStore(localStorage,key);return {...old,items:old.items||{},missionDone:old.missionDone||{}};}
    catch {return {items:{},missionDone:{}};}
  }
  let state = initial(), run = null, role = '', roleOpen = false, roleCheck = false, didRoute = false;
  let difficulty = ({support:1,standard:2,challenge:3})[state.globalLevel] || 0;
  let focusGoal = '', focusKind = '';
  try {const old = parseStore(sessionStorage, sessionKey);if (Array.isArray(old.ids) && old.ids.length && old.ids.every(id=>byId.has(id)) && Array.isArray(old.outcomes) && Number.isInteger(old.index) && old.index>=0 && old.index<=old.ids.length) run = old;} catch {}
  function save() {
    try {
      const existing=parseStore(localStorage,key);
      localStorage.setItem(key,JSON.stringify({...existing,...state,globalLevel:existing.globalLevel||state.globalLevel,missionDone:{...existing.missionDone,...state.missionDone}}));
    } catch {}
  }
  function storeRun() {try {if(run)sessionStorage.setItem(sessionKey,JSON.stringify(run));else sessionStorage.removeItem(sessionKey);}catch{}}
  const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const $ = selector => main.querySelector(selector);
  const action = (name,title,cls='primary',opts='') => '<button type="button" class="btn '+cls+'" data-do="'+name+'" '+opts+'>'+title+'</button>';
  const link = (hash,title,cls='primary') => '<a class="btn '+cls+'" href="#'+esc(hash)+'">'+title+'</a>';
  const shuffle = arr => {const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const topicPool = topic => topic==='zahlen'?numbers:topic==='zeiten'?times:topic==='verben'?verbs:bank.filter(q=>state.items[q.id]?.needsRetry);
  const current = () => run && byId.get(run.ids[run.index]);
  const stored = q => state.items[q.id] || {};
  const mark = n => {state.missionDone[n]=true;save();};
  const nextStage = () => steps.findIndex((_,i)=>!state.missionDone[i+1])+1 || 6;
  function navigate(to) {if(location.hash.slice(1)===to)refresh();else location.hash=to;}
  function clockIcon() {return '<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="14" cy="14" r="11"/><path d="M14 7v7l5 3"/></svg>';}
  function paused(){return run && !run.done ? '<div class="panel soft top-space linkrow"><div><b>Ihre Runde ist unterbrochen.</b><p class="small">'+esc(run.label)+' · Aufgabe '+(run.index+1)+' von '+run.ids.length+'</p></div>'+link('runde','Runde fortsetzen','ghost')+'</div>':'';}
  function header(k,title,copy) {return '<div class="pagehead"><a class="breadcrumb-back" href="#start">← Woche 47</a><div class="eyebrow">'+esc(k)+'</div><h1>'+esc(title)+'</h1><p>'+esc(copy)+'</p></div>';}
  function goalList(){return '<div class="goalgrid">'+examGoals.map(g=>'<div class="goal"><b>'+g.slice(1)+'</b><div><strong>'+goals[g][0]+'</strong><p>'+goals[g][1]+'</p></div></div>').join('')+'</div>';}
  function learningCards(){return '<div class="grid training-grid">'+[
    ['zahlen','0–9','', 'Zahlen bis eine Million','Hören, Zahlwörter zusammensetzen, Stellenwerte erkennen und selbst schreiben.','Zahlen üben'],
    ['zeiten',clockIcon(),'sand','Uhrzeiten','Zifferblätter lesen, Durchsagen verstehen und zwischen Fahrplan und Gespräch wechseln.','Uhrzeiten üben'],
    ['lerncheck','✓','blue','Gemischter Lerncheck','Prüfen Sie alle vier Lernziele mit zwölf Aufgaben und erhalten Sie danach eine persönliche Auswertung.','Lerncheck öffnen']
  ].map(([t,i,c,h,p,a])=>'<article class="card"><span class="typeicon '+c+'" aria-hidden="true">'+i+'</span><h3>'+h+'</h3><p>'+p+'</p>'+(t==='zahlen'||t==='zeiten'?'<span class="small">'+(t==='zahlen'?numbers.length:times.length)+' Aufgaben in drei Stufen</span>':'')+'<a class="tile-link" href="#'+(t==='lerncheck'?t:'training/'+t)+'">'+a+' →</a></article>').join('')+'</div>';}
  function home(){
    return '<section class="hero"><div class="hero-copy"><span class="eyebrow">Français A2 · Semaine 47</span><h1>Zahlen und Uhrzeiten</h1><p>Wann öffnet das Festival? Wie viele Tickets gibt es? Üben Sie, französische Angaben sicher zu verstehen und selbst Auskunft zu geben.</p><div class="actions">'+link('lernweg/'+nextStage(),Object.keys(state.missionDone).length?'Lernweg fortsetzen →':'Lernweg beginnen →')+link('training','Frei üben','ghost')+'</div></div><div class="hero-photo" role="img" aria-label="Bühne beim Festival des Rives"><div class="ticket" aria-hidden="true"><small>Festival des Rives</small><span>Au guichet</span></div></div></section>'+paused()+
    '<section class="section"><div class="linkrow"><h2>Für die Lernkontrolle üben</h2><a href="#lernstand">Mein Lernstand →</a></div>'+learningCards()+'</section>'+
    '<section class="section" aria-labelledby="learning"><h2 id="learning">Lernziele für Woche 48</h2>'+goalList()+'</section>'+
    '<section class="section panel sandpanel"><div class="linkrow"><div><h3>Material für die Doppellektion</h3><p class="small">Lernheft, Verbkarten und beide Rollenblätter als Druckvorlagen.</p></div><div class="actions"><a class="btn ghost" href="./material/Lernheft.pdf">Lernheft (PDF)</a><a class="btn ghost" href="./material/Partnerkarten.pdf">Partnerkarten (PDF)</a></div></div></section>';
  }
  function coach(n) {
    n=Math.max(1,Math.min(6,Number(n)||nextStage()));const s=steps[n-1];
    const sidebar=steps.map((x,i)=>'<a class="stepbtn '+(i+1===n?'active':'')+'" '+(i+1===n?'aria-current="step"':'')+' href="#lernweg/'+(i+1)+'"><span class="stepnum">'+(state.missionDone[i+1]?'✓':i+1)+'</span>'+x[0]+'</a>').join('');
    let body='';
    if(n===1)body='<ul><li>Starten Sie mit vier Aufgaben aus dem Verbenpool.</li><li>Arbeiten Sie zu zweit mit den Verbkarten. Wechseln Sie die Rollen nach jeder Frage.</li><li>Schreiben Sie zwei unsichere Formen nochmals aus dem Kopf.</li></ul><div class="actions">'+action('coachrun','Verbenrepetition starten','primary','data-step="1"')+action('stage','Auf Papier erledigt','ghost','data-step="1"')+'</div>';
    if(n===2)body='<ul><li><b>35 Minuten</b> Einzelarbeit ohne Hilfsmittel. Kontrollieren Sie auch die Rückseite.</li><li>Geben Sie den Test ab. Öffnen Sie nach dem Signal der Lehrperson das Lernheft auf Seite 2.</li></ul>'+action('stage','Nach der Abgabe weiter →','primary','data-step="2"');
    if(n===3||n===4)body='<ul><li>'+ (n===3?'Lösen Sie die Aufgaben auf Heftseite 2. Sprechen Sie die vier Schritte der Zeitkette zu zweit.':'Arbeiten Sie mit Heftseite 3. Diktieren Sie danach zu zweit die Zahlen auf Partnerblatt A und B.')+'</li><li>Im digitalen Training bearbeiten Sie vier Aufgaben mit Rückmeldung.</li></ul><div class="actions">'+action('coachrun',n===3?'Uhrzeitenrunde starten':'Zahlenrunde starten','primary','data-step="'+n+'"')+action('stage','Auf Papier erledigt','ghost','data-step="'+n+'"')+'</div>';
    if(n===5)body=festival();
    if(n===6)body='<ul><li><b>Im Unterricht</b> lösen Sie den kurzen Schlusscheck auf Heftseite 4 und notieren Ihr persönliches Übungsziel.</li><li><b>Digital</b> bearbeiten Sie zwölf gemischte Aufgaben. Planen Sie dafür etwa 10–15 Minuten ein.</li></ul><div class="actions">'+link('lerncheck','Digitalen Lerncheck öffnen')+action('stage','Schlusscheck im Heft erledigt','ghost','data-step="6"')+'</div>';
    return header('Geführter Lernweg','Ihre Doppellektion','Arbeiten Sie mit der Klasse im gleichen Schritt. Über die Liste können Sie jederzeit an einer anderen Stelle einsteigen.')+'<div class="coach"><nav class="panel steps" aria-label="Schritte der Doppellektion">'+sidebar+'</nav><section class="panel stepinfo"><span class="eyebrow">Schritt '+n+' von 6 · '+s[1]+'</span><h2>'+s[0]+'</h2><p>'+s[2]+'</p>'+body+'</section></div>'+paused();
  }
  // A digital alternative to the two printed role sheets, with separate partner information.
  const roles={
    A:{facts:[['Ouverture des portes','17 h 20'],['Entrée','24 francs'],['Visiteurs hier','2’800']],questions:['À quelle heure commence le concert ?','À quelle heure se termine le concert ?','Combien de billets sont en vente ?']},
    B:{facts:[['Début du concert','19 h 05'],['Fin du concert','22 h 40'],['Billets en vente','9’650']],questions:['À quelle heure ouvrent les portes ?','Combien coûte l’entrée ?','Combien de visiteurs y a-t-il eu hier ?']}
  };
  function festival(){
    const r=roles[role];
    let html='<p class="top-space"><b>Festival des Rives · digitale Partnerrunde</b></p><p>Öffnen Sie auf zwei Geräten je eine andere Rolle oder geben Sie ein Gerät mit verdeckter Rolle weiter. A beginnt. Fragen Sie abwechselnd und notieren Sie die Antworten auf Papier.</p><div class="actions top-space">'+['A','B'].map(x=>action('role','Rolle '+x,'ghost role','data-role="'+x+'" aria-pressed="'+(role===x)+'"')).join('')+'</div>';
    if(r)html+='<div class="panel soft hidebox">'+action('roleopen',roleOpen?'Meine Angaben verdecken':'Meine Angaben zeigen','ghost')+(roleOpen?'<ul class="rolefacts">'+r.facts.map(f=>'<li><span lang="fr">'+f[0]+'</span><b>'+f[1]+'</b></li>').join('')+'</ul><strong>Ihre Fragen</strong><ol>'+r.questions.map(q=>'<li lang="fr">'+q+'</li>').join('')+'</ol><p lang="fr">Vous avez dit …, c’est bien ça ?</p>':'')+'</div>';
    html+='<div class="actions top-space">'+action('rolecheck',roleCheck?'Kontrolle schliessen':'Nach dem Gespräch vergleichen','lite')+action('stage','Gespräch abgeschlossen →','primary','data-step="5"')+'</div>';
    if(roleCheck)html+='<div class="panel top-space"><h3>Vergleich</h3><ul class="rolefacts">'+[...roles.A.facts,...roles.B.facts].map(f=>'<li><span lang="fr">'+f[0]+'</span><b>'+f[1]+'</b></li>').join('')+'</ul></div>';return html;
  }
  function config(topic) {
    if(!labels[topic])return header('Freies Training','Womit möchten Sie beginnen?','Wählen Sie ein Thema. Sie können anschliessend nach Stufe, Lernziel und Aufgabenart auswählen.')+learningCards()+'<div class="actions top-space">'+link('training/verben','Verben repetieren','ghost')+link('lernstand','Schwierige Aufgaben wiederholen','ghost')+'</div>'+paused();
    const source=topicPool(topic);const possibleGoals=[...new Set(source.map(q=>q.goal))];if(!possibleGoals.includes(focusGoal))focusGoal='';
    const filtered=source.filter(q=>(!difficulty||q.level===difficulty)&&(!focusGoal||q.goal===focusGoal)&&(!focusKind||q.kind===focusKind));
    const n=filtered.length;
    return header('Freies Training',labels[topic],topic==='fehler'?'Hier üben Sie Aufgaben, bei denen Sie einen weiteren Versuch gebraucht haben.':'Stellen Sie eine Runde aus bis zu sechs Aufgaben zusammen. Sie erhalten nach jeder Antwort eine Rückmeldung.')+
    '<section class="panel"><div class="subhead"><h2>Meine Übungsrunde</h2></div><fieldset class="flat"><legend>Stufe</legend><div class="chips">'+levels.map((t,l)=>'<button type="button" class="chip" data-do="level" data-level="'+l+'" aria-pressed="'+(l===difficulty)+'">'+t+'</button>').join('')+'</div></fieldset>'+
    '<div class="tray top-space"><fieldset><label for="goal">Lernziel</label><select id="goal"><option value="">Alle Lernziele</option>'+possibleGoals.map(g=>'<option value="'+g+'" '+(g===focusGoal?'selected':'')+'>'+esc(goals[g][0])+'</option>').join('')+'</select></fieldset><fieldset><label for="kind">Aufgabenart</label><select id="kind"><option value="">Alle Aufgabenarten</option>'+Object.entries(types).filter(([k])=>source.some(q=>q.kind===k)).map(([k,t])=>'<option value="'+k+'" '+(k===focusKind?'selected':'')+'>'+t+'</option>').join('')+'</select></fieldset></div>'+
    '<div class="actions top-space">'+(n?action('practice','Runde starten →','primary','data-topic="'+topic+'"'):'')+'<span class="small" role="status">'+(n?n+' passende Aufgaben · '+Math.min(n,6)+' pro Runde':'Zu dieser Auswahl gibt es keine Aufgaben. Wählen Sie eine andere Stufe oder Aufgabenart.')+'</span></div></section>'+paused();
  }
  function checkPage(){return header('Vorbereitung auf Woche 48','Gemischter Lerncheck','Finden Sie heraus, welche der vier Lernziele Sie schon sicher beherrschen. Sie bearbeiten zwölf Aufgaben, je drei pro Ziel.')+
    '<div class="grid"><section class="panel"><h2>So läuft der Check</h2><ol class="instructions"><li>Planen Sie etwa 10–15 Minuten ein. Papier für eigene Notizen ist hilfreich.</li><li>Geben Sie für jede Aufgabe eine eigene Antwort ab. Bei Höraufgaben können Sie nochmals anhören oder den Text lesen.</li><li>Am Schluss sehen Sie Punkte, Lösungen und die passende nächste Übung.</li></ol>'+action('exam','Lerncheck starten →')+'</section><section class="panel soft"><h2>Das wird geprüft</h2><ul class="instructions">'+examGoals.map(g=>'<li>'+goals[g][0]+'</li>').join('')+'</ul><p class="small">Eine richtige Antwort zählt einen Punkt. Ihr Ergebnis unterstützt die Vorbereitung auf die Lernkontrolle.</p></section></div>'+paused();}
  function summarise(g) {const all=bank.filter(q=>q.goal===g).map(stored);return {n:all.filter(x=>x.n>0).length,ok:all.filter(x=>x.n>0&&!x.needsRetry).length};}
  function statusPage(){const difficult=bank.filter(q=>stored(q).needsRetry);
    return header('Persönliche Übersicht','Mein Lernstand','Hier sehen Sie Ihre zuletzt bearbeiteten Aufgaben auf diesem Gerät. Ein richtiger neuer Erstversuch entfernt eine Aufgabe aus der Wiederholung.')+
    '<div class="grid"><section class="panel"><h2>Meine Lernziele</h2><div class="statlist">'+examGoals.map(g=>{const s=summarise(g);return '<div class="stat"><b>'+goals[g][0]+'</b><small>'+(s.n?s.ok+' von '+s.n+' zuletzt sicher':'Noch offen')+'</small></div>';}).join('')+'</div>'+link('lerncheck','Zum Lerncheck','ghost')+'</section><section class="panel soft"><h2>Gezielt wiederholen</h2><p class="top-space">'+(difficult.length?difficult.length+' Aufgaben sind für die Wiederholung vorgemerkt.':'Zurzeit ist keine Wiederholung vorgemerkt. Beginnen Sie mit einer Zahlen- oder Uhrzeitenrunde.')+'</p><div class="actions top-space">'+(difficult.length?action('retry','Schwierige Aufgaben wiederholen'):link('training','Training wählen'))+'</div></section></div>'+paused();}
  // Select a mix of formats; within each format favour fresh or long-unseen items.
  function pick(source, n) {const remaining=shuffle(source);const chosen=[];const count=new Map();
    while(chosen.length<n&&remaining.length){remaining.sort((a,b)=>{
      const ca=count.get(a.kind)||0, cb=count.get(b.kind)||0;return ca-cb || (stored(a).last||0)-(stored(b).last||0);
    });const q=remaining.shift();chosen.push(q);count.set(q.kind,(count.get(q.kind)||0)+1);}
    return chosen;
  }
  function initRun(pool,label,mode='practice',stage=0) {if(!pool.length)return;run={ids:pool.map(q=>q.id),label,mode,stage,index:0,outcomes:[],entry:null,done:false};newEntry();storeRun();navigate('runde');}
  function newEntry(){const q=current();run.entry={typed:'',chosen:'',order:[],usedHint:false,failed:false,locked:false,feedback:false,transcript:false,list:shuffle(q.options||q.tokens||[])};}
  function startExam(){
    const chosen=examGoals.flatMap(g=>{
      const group=bank.filter(q=>q.goal===g), result=[];
      const formats = g==='G3'?shuffle(['listen','clock','otherInput']):g==='G1'?shuffle(['listen','input','choice']):shuffle(['input','choice','order']);
      for(const level of [1,2,3]){
        const options=group.filter(q=>q.level===level);
        const format=formats[level-1];
        const suitable=options.filter(q=>format==='clock'?!!q.clock:format==='otherInput'?q.kind==='input'&&!q.clock:q.kind===format);
        result.push(...pick(suitable.length?suitable:options,1));
      }
      return result;
    });
    initRun(shuffle(chosen),'Gemischter Lerncheck','exam',6);
  }
  function startPractice(topic){const pool=topicPool(topic).filter(q=>(!difficulty||q.level===difficulty)&&(!focusGoal||q.goal===focusGoal)&&(!focusKind||q.kind===focusKind));initRun(pick(pool,6),labels[topic]);}
  function normalFr(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[’‘ʼ']/g,' ').replace(/[-‐‑–—]/g,' ').replace(/[.,!?;:«»“”"]/g,' ').replace(/\s+/g,' ').trim();}
  function timeDigits(v){const match=String(v).trim().match(/^(\d{1,2})\s*(?:h|:|\.)\s*(\d{1,2})$/i);if(!match||+match[1]>23||+match[2]>59)return null;return +match[1]*60 + +match[2];}
  function numberDigits(v){const str=String(v).trim();if(!/^\d+$/.test(str)&&!/^\d{1,3}(?:[’'\u00a0\u202f .,]\d{3})+$/.test(str))return null;return Number(str.replace(/\D/g,''));}
  function correct(q,raw){
    // Choice responses must match the selected spelling, including an assessed accent, hyphen or ending.
    if(q.kind==='choice')return q.answers.includes(raw);
    return q.answers.some(a=>{if(a===raw)return true;const x=timeDigits(a),y=timeDigits(raw);if(x!==null&&y!==null)return x===y;
      const n=numberDigits(a),m=numberDigits(raw);if(n!==null&&m!==null)return n===m;return normalFr(a)===normalFr(raw);});
  }
  function analogue(time){const [h,m]=time.split(':').map(Number);let nums='';for(let t=0;t<60;t++){const a=t*Math.PI/30;nums+='<i aria-hidden="true" class="tick '+(t%5===0?'major':'')+'" style="left:'+(50+48*Math.sin(a))+'%;top:'+(50-48*Math.cos(a))+'%;transform:translate(-50%,-50%) rotate('+(t*6)+'deg)"></i>';}for(let n=1;n<=12;n++){const angle=n*Math.PI/6;nums+='<span class="numeral" style="left:'+(50+42*Math.sin(angle))+'%;top:'+(50-42*Math.cos(angle))+'%">'+n+'</span>';}
    const desc='Langer Zeiger auf Minute '+m+', kurzer Zeiger '+(m?'zwischen '+(h%12||12)+' und '+((h+1)%12||12):'auf '+(h%12||12))+'.';return '<div class="clockface" role="img" aria-label="'+desc+'">'+nums+'<i class="hand hour" style="transform:rotate('+((h%12+m/60)*30)+'deg)"></i><i class="hand minute" style="transform:rotate('+(m*6)+'deg)"></i><i class="pin"></i></div>';}
  function synth(){try{return window.speechSynthesis;}catch{return null;}}
  function frenchVoice(){try{const list=synth()?.getVoices()||[];const voices=list.filter(v=>/^fr(?:[-_]|$)/i.test(v.lang));return voices.find(v=>v.localService) || voices[0] || null;}catch{return null;}}
  let audioError=false,speaking=null;
  function quiet(){if(speaking){speaking.onerror=null;speaking.onend=null;speaking=null;}try{synth()?.cancel();}catch{}}
  function audioBlock(q){const enable=frenchVoice()&&!audioError;return '<div class="audio">'+(enable?action('audio','▶ Anhören','ghost','data-rate="0.93"')+action('audio','Langsamer','lite','data-rate="0.72"'):'')+action('transcript',run.entry.transcript?'Text verdecken':'Text anzeigen','ghost','aria-controls="spoken" aria-expanded="'+run.entry.transcript+'"')+'</div><p class="small audio-note">'+(enable?'Sie können die Angabe erneut anhören.':'Auf diesem Gerät steht gerade keine französische Vorlesestimme bereit. Öffnen Sie den Text und lesen Sie die Angabe.')+'</p><p class="phrase" lang="fr" id="spoken" '+(run.entry.transcript?'':'hidden')+'>'+esc(q.speech)+'</p>';}
  function getAnswer(){const q=current(),e=run.entry;if(q.kind==='order')return e.order.map(i=>e.list[i]).join(' ');return q.kind==='choice'?e.chosen:e.typed.trim();}
  function controls(q){const e=run.entry;
    if(q.kind==='choice')return '<div aria-label="Antwortmöglichkeiten" role="group" class="choices">'+e.list.map((v,i)=>'<button type="button" data-do="choose" data-i="'+i+'" class="choice" aria-pressed="'+(e.chosen===v)+'" '+(e.locked?'disabled':'')+'>'+esc(v)+'</button>').join('')+'</div>';
    if(q.kind==='order')return '<p><b>Ihre Reihenfolge</b></p><div class="composition"><div class="tokens">'+(e.order.length?e.order.map((i,n)=>'<button class="token" type="button" data-do="untoken" data-i="'+n+'" '+(e.locked?'disabled':'')+' aria-label="'+esc(e.list[i])+' entfernen">'+esc(e.list[i])+' ×</button>').join(''):'<span class="small">Wählen Sie unten den ersten Baustein.</span>')+'</div></div><div class="tokens">'+e.list.map((v,i)=>'<button class="token" data-do="token" type="button" data-i="'+i+'" '+(e.locked||e.order.includes(i)?'disabled':'')+'>'+esc(v)+'</button>').join('')+'</div><p class="small top-space">Ein Klick auf einen gewählten Baustein legt ihn zurück.</p>';
    return '<label for="reply">Ihre Antwort</label><input id="reply" name="reply" autocomplete="off" spellcheck="false" autocapitalize="off" value="'+esc(e.typed)+'" '+(e.locked?'readonly':'')+'><p class="small">Mit der Eingabetaste können Sie Ihre Antwort abgeben.</p>';
  }
  function feedback(){if(!run.entry.feedback)return '';const e=run.entry,q=current();if(run.mode==='exam')return '<div class="feedback" role="status">Antwort gespeichert. Die Auswertung folgt am Schluss.</div>';
    if(!e.locked)return '<div class="feedback bad" role="status"><strong>Versuchen Sie es nochmals.</strong><span>'+esc(q.hint)+'</span></div>';
    return '<div class="feedback '+(e.solved?'':'bad')+'" role="status"><strong>'+(e.solved?'Richtig.':'Lösung')+'</strong><span>'+esc(q.answers[0])+'</span><span>'+esc(q.explain)+'</span></div>';
  }
  function work(){if(!run||run.done)return result();const q=current(),e=run.entry, isExam=run.mode==='exam';
    return '<div class="narrow"><div class="worktop"><div><b>'+esc(run.label)+'</b><div class="small">Aufgabe '+(run.index+1)+' von '+run.ids.length+'</div></div>'+link(run.stage&&run.mode!=='exam'?'lernweg/'+run.stage:'start','Pausieren','ghost')+'</div><div class="track"><span style="width:'+Math.round(run.index/run.ids.length*100)+'%"></span></div><article class="sheet"><div class="qmeta">'+esc(goals[q.goal][0])+' · '+types[q.kind]+'</div><h1>'+esc(q.title)+'</h1><p id="qprompt">'+esc(q.prompt)+'</p>'+(q.stimulus?'<div class="stim">'+esc(q.stimulus)+'</div>':'')+(q.clock?analogue(q.clock):'')+(q.speech?audioBlock(q):'')+
    '<form id="answer-form" class="answers">'+controls(q)+'<div class="qbuttons">'+(e.locked?action('next',run.index+1===run.ids.length?'Auswertung ansehen →':'Weiter →'):'<button class="btn primary" type="submit">'+(isExam?'Antwort abgeben':'Antwort prüfen')+'</button>'+(isExam?action('skip','Weiss ich noch nicht','link'):action('hint',e.usedHint?'Tipp schliessen':'Tipp öffnen','link')+action('reveal','Lösung zeigen','link')))+'</div></form><div id="err" class="formerror" role="alert"></div>'+(!isExam&&e.usedHint&&!e.locked?'<p class="hint">'+esc(q.hint)+'</p>':'')+feedback()+'</article></div>';
  }
  function locked(answer,solved,skipped=false){
    const e=run.entry,q=current();e.locked=true;e.feedback=true;e.solved=solved;e.submitted=answer;
    const ok=solved&&!e.failed&&!e.gotHelp&&!skipped;
    const outcome={id:q.id,ok,solved,answer,skipped,textUsed:!!e.readText};
    run.outcomes.push(outcome);
    const prev=stored(q);state.items[q.id]={n:(prev.n||0)+1,last:Date.now(),needsRetry:!ok,ok:(prev.ok||0)+(ok?1:0)};
    save();storeRun();renderWork('next');
  }
  function submit(){
    if(!current()||run.entry.locked)return;const q=current(),e=run.entry,answer=getAnswer();
    if(!answer||q.kind==='order'&&e.order.length!==e.list.length){$('#err').textContent=q.kind==='order'?'Verwenden Sie alle Bausteine.':'Wählen oder schreiben Sie zuerst eine Antwort.';return;}
    const ok=correct(q,answer);
    if(ok||run.mode==='exam')locked(answer,ok);else{e.failed=true;e.feedback=true;storeRun();renderWork(q.kind==='input'||q.kind==='listen'?'input':'answers');}
  }
  function recordEnd(){run.done=true;if(run.stage)mark(run.stage);if(run.mode==='exam')state.lastExam={at:Date.now(),ok:run.outcomes.filter(r=>r.ok).length,total:run.ids.length};save();storeRun();navigate('auswertung');}
  function result(){
    if(!run?.done)return header('Ihre Übungen','Hier beginnt Ihre nächste Runde','Wählen Sie Zahlen oder Uhrzeiten. Im Lerncheck erscheinen beide Themen.')+'<div class="actions">'+link('training','Training öffnen')+link('lerncheck','Lerncheck öffnen','ghost')+'</div>';
    const scores=run.outcomes.reduce((a,r)=>{const g=byId.get(r.id).goal;a[g]??={ok:0,n:0};a[g].n++;if(r.ok)a[g].ok++;return a;},{});
    const weak=Object.entries(scores).filter(([,s])=>s.ok<s.n).sort((a,b)=>a[1].ok/a[1].n-b[1].ok/b[1].n)[0]?.[0];
    const ok=run.outcomes.filter(v=>v.ok).length;
    return header(run.label,'Ihre Auswertung',run.mode==='exam'?'So haben Sie bei den vier Lernzielen abgeschnitten. Öffnen Sie unten eine Aufgabe, um Ihre Antwort zu vergleichen.':'Als sicher zählen hier Aufgaben, die Sie beim ersten Versuch ohne Tipp oder Musterlösung gelöst haben.')+
    '<div class="grid"><section class="panel"><div class="result-head"><span class="score">'+ok+' / '+run.ids.length+'</span><b>'+(run.mode==='exam'?'Punkte':'beim ersten Versuch sicher')+'</b></div><div class="statlist">'+Object.entries(scores).sort().map(([g,s])=>'<div class="stat"><span>'+esc(goals[g][0])+'</span><b>'+s.ok+' / '+s.n+'</b></div>').join('')+'</div>'+(run.outcomes.some(r=>r.textUsed)?'<p class="small">Bei mindestens einer Höraufgabe haben Sie den Text geöffnet. Üben Sie diese Angabe nochmals nach Gehör.</p>':'')+'</section><section class="panel soft"><h2>Ihr nächster Schritt</h2><p class="top-space">'+(weak?'Wiederholen Sie «'+goals[weak][0]+'». Sie können zuerst die schwierigen Aufgaben dieser Runde erneut lösen.':'Sie haben diese Runde sicher gelöst. Mit einer neuen Runde lernen Sie weitere Beispiele kennen.')+'</p><div class="actions top-space">'+(weak?action('retryrun','Diese Aufgaben wiederholen'):'')+(weak?action('target','Lernziel trainieren','ghost','data-goal="'+weak+'"'):link('training','Neue Runde wählen','ghost'))+'</div></section></div>'+
    (run.stage&&run.stage<6?'<div class="actions top-space">'+link('lernweg/'+(run.stage+1),'Im Lernweg weiter →')+'</div>':'')+
    '<section class="section review"><h2>Aufgaben im Rückblick</h2>'+run.outcomes.map(r=>{const q=byId.get(r.id);return '<details><summary>'+(r.ok?'✓':'↻')+' '+esc(q.title)+'</summary><p>'+esc(q.prompt)+'</p>'+(q.stimulus||q.speech||q.clock?'<p><b>Angabe</b> '+esc(q.stimulus||q.speech||q.clock)+'</p>':'')+'<p><b>Ihre Antwort</b> '+esc(r.answer||'Ausgelassen')+'</p><p><b>Lösung</b> '+esc(q.answers[0])+'</p><p>'+esc(q.explain)+'</p></details>';}).join('')+'</section>';
  }
  function renderWork(where){
    main.innerHTML=work();const target=where==='next'?$('[data-do="next"]'):where==='input'?$('#reply'):where==='answers'?$('.choice, .token'):null;if(target)target.focus({preventScroll:true});
  }
  let activeRoute='',lastTopic='';
  function refresh(routeChange=false){
    const path=location.hash.slice(1).split('/'), route=path[0]||'start';
    if(route==='main'){main.focus();return;}
    if(routeChange) {quiet();audioError=false;}
    if(route==='training'&&path[1]!==lastTopic){focusGoal='';focusKind='';lastTopic=path[1];}
    const views={start:home,lernweg:()=>coach(path[1]),training:()=>config(path[1]),lernziele:()=>header('Woche 48','Lernziele für die Lernkontrolle','Diese vier Ziele bestimmen das Training und den gemischten Lerncheck.')+goalList()+'<div class="actions top-space">'+link('training','Passende Übungen öffnen')+'</div>',lernstand:statusPage,lerncheck:checkPage,runde:work,auswertung:result};
    main.innerHTML=(views[route]||home)();activeRoute=route;
    document.querySelectorAll('.mast nav a').forEach(a=>{if(a.hash.slice(1)===route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(routeChange){window.scrollTo(0,0);if(didRoute)main.focus({preventScroll:true});}
    didRoute=true;
  }
  main.addEventListener('input',e=>{if(e.target.id==='reply'&&run){run.entry.typed=e.target.value;storeRun();}});
  main.addEventListener('change',e=>{if(e.target.id==='goal'||e.target.id==='kind'){if(e.target.id==='goal')focusGoal=e.target.value;else focusKind=e.target.value;refresh();$('#'+e.target.id)?.focus();}});
  main.addEventListener('submit',e=>{if(e.target.id==='answer-form'){e.preventDefault();submit();}});
  main.addEventListener('click',ev=>{
    const b=ev.target.closest('button[data-do]');if(!b||b.disabled)return;
    const d=b.dataset, cmd=d.do, e=run?.entry, q=current();
    if(cmd==='level'){difficulty=+d.level;refresh();$('[data-level="'+d.level+'"]')?.focus();return;}
    if(cmd==='practice'){startPractice(d.topic);return;}
    if(cmd==='coachrun'){const st=+d.step;initRun(pick(st===1?verbs:st===3?times:numbers,4),steps[st-1][0],'practice',st);return;}
    if(cmd==='stage'){const n=+d.step;mark(n);if(n===6)navigate('lernstand');else navigate('lernweg/'+(n+1));return;}
    if(cmd==='role'){role=d.role;roleOpen=true;roleCheck=false;refresh();$('[data-role="'+role+'"]')?.focus();return;}
    if(cmd==='roleopen'||cmd==='rolecheck'){if(cmd==='roleopen')roleOpen=!roleOpen;else roleCheck=!roleCheck;refresh();$('[data-do="'+cmd+'"]')?.focus();return;}
    if(cmd==='exam'){startExam();return;}
    if(cmd==='retry'){initRun(pick(topicPool('fehler'),6),labels.fehler);return;}
    if(cmd==='retryrun'){initRun(run.outcomes.filter(r=>!r.ok).map(r=>byId.get(r.id)),labels.fehler);return;}
    if(cmd==='target'){const g=d.goal;initRun(pick(bank.filter(item=>item.goal===g),6),goals[g][0]);return;}
    if(!q||!e)return;
    if(cmd==='audio'){
      quiet();const voice=frenchVoice();if(!voice)return;try{const utter=new SpeechSynthesisUtterance(q.speech);utter.voice=voice;utter.lang=voice.lang;utter.rate=+d.rate;speaking=utter;utter.onerror=err=>{if(speaking!==utter||['interrupted','canceled'].includes(err.error))return;audioError=true;renderWork();};synth().speak(utter);}catch{audioError=true;renderWork();}return;
    }
    if(cmd==='transcript'){e.transcript=!e.transcript;if(e.transcript)e.readText=true;storeRun();renderWork();$('[data-do="transcript"]')?.focus();return;}
    if(cmd==='next'&&e.locked){quiet();audioError=false;run.index++;if(run.index>=run.ids.length)recordEnd();else{newEntry();storeRun();renderWork();main.focus();window.scrollTo(0,0);}return;}
    if(e.locked)return;
    if(cmd==='choose'){e.chosen=e.list[+d.i];storeRun();renderWork();$('[data-do="choose"][data-i="'+d.i+'"]')?.focus();return;}
    if(cmd==='token'||cmd==='untoken'){const i=+d.i;if(cmd==='token'&&!e.order.includes(i))e.order.push(i);else if(cmd==='untoken')e.order.splice(i,1);storeRun();renderWork();const focus=$('[data-do="token"]:not([disabled])')||$('button[type="submit"]');focus?.focus();return;}
    if(cmd==='hint'){e.usedHint=!e.usedHint;if(e.usedHint)e.gotHelp=true;storeRun();renderWork();$('[data-do="hint"]')?.focus();return;}
    if(cmd==='skip'||cmd==='reveal')locked(getAnswer(),false,true);
  });
  const engine=synth();if(engine){try{engine.getVoices();engine.addEventListener?.('voiceschanged',()=>{if(activeRoute==='runde'&&current()?.speech&&!run.entry.locked&&!document.activeElement?.matches('input'))renderWork();});}catch{}}
  window.addEventListener('hashchange',()=>refresh(true));
  refresh(true);
})();
