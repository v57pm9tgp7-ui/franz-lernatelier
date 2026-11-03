(function (root) {
  'use strict';
  const SMALL = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize'];
  const TENS = {20:'vingt',30:'trente',40:'quarante',50:'cinquante',60:'soixante'};
  const KEY = 'franzW45Practice_v1';
  const MODULE_KEY = 'franzoesischLernatelierW45_v1';
  const DAY = 86400000;
  const norm = s => String(s).toLowerCase().trim().replace(/[’‘]/g,"'").replace(/[-–—]/g,' ').replace(/[.!?]/g,'').replace(/\s+/g,' ');
  const noAccent = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const uniq = a => [...new Set(a)];
  const digital = (h,m) => `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;

  function number(n, variant = 'fr', beforeMille = false) {
    if (!Number.isInteger(n) || n < 0 || n > 999999999) throw new RangeError('Integer 0–999999999 required');
    if (n < 17) return SMALL[n];
    if (n < 20) return 'dix-' + SMALL[n-10];
    if (n < 100) {
      if (variant === 'fr' && n >= 70 && n < 80) return n === 71 ? 'soixante et onze' : 'soixante-' + number(n-60,variant);
      if (n >= 80 && (variant !== 'huit' || n >= 90 && variant === 'fr')) {
        if (n >= 90 && variant !== 'fr') return n === 91 ? 'nonante et un' : 'nonante' + (n%10 ? '-' + SMALL[n%10] : '');
        return 'quatre-vingt' + (n === 80 ? (beforeMille ? '' : 's') : '-' + number(n-80,variant));
      }
      const t = Math.floor(n/10)*10, r=n%10;
      const base = TENS[t] || ({70:'septante',80:'huitante',90:'nonante'})[t];
      return base + (r === 1 ? ' et un' : r ? '-' + SMALL[r] : '');
    }
    if (n < 1000) {
      const h=Math.floor(n/100), r=n%100;
      return (h === 1 ? '' : SMALL[h]+' ') + 'cent' + (h > 1 && !r && !beforeMille ? 's' : '') + (r ? ' '+number(r,variant,beforeMille) : '');
    }
    if (n < 1000000) {
      const t=Math.floor(n/1000), r=n%1000;
      return (t === 1 ? '' : number(t,variant,true)+' ')+'mille'+(r ? ' '+number(r,variant) : '');
    }
    const millions=Math.floor(n/1000000), r=n%1000000;
    return number(millions,variant)+' million'+(millions > 1 ? 's' : '')+(r ? ' '+number(r,variant) : '');
  }
  const numberVariants = n => uniq(['fr','ch','huit'].map(v => number(n,v)));
  function compare(a,variants) {
    const input=norm(a), targets=variants.map(norm);
    if (targets.includes(input)) return {ok:true,accent:false};
    if (targets.some(s => noAccent(s) === noAccent(input))) return {ok:true,accent:true};
    return {ok:false,accent:false};
  }
  const numberAnswer = (n,a) => compare(a,numberVariants(n));
  const hourWord = h => h === 0 ? 'zéro heure' : h === 1 ? 'une heure' : h === 21 ? 'vingt et une heures' : number(h)+' heures';
  const official = (h,m) => hourWord(h)+(m ? ' '+number(m) : '');
  function timeVariants(h,m) {
    const h12=h%12 || 12, base=hourWord(h12), special=h === 0 ? 'minuit' : h === 12 ? 'midi' : '';
    const a=[official(h,m),base+(m ? ' '+number(m) : '')];
    if (special) a.push(special+(m ? ' '+number(m) : ''));
    if (m === 15) a.push(base+' et quart',hourWord(h)+' et quart',...(special ? [special+' et quart'] : []));
    if (m === 30) a.push(base+' et demie',hourWord(h)+' et demie',...(special ? [special+' et demi'] : []));
    if (m > 30) {
      const next=(h12%12)+1;
      const remainder=60-m;
      a.push(hourWord(next)+' moins '+number(remainder));
      if (remainder === 15) a.push(hourWord(next)+' moins le quart');
      if ((h+1)%24 === 12 || (h+1)%24 === 0) {
        const word=(h+1)%24 === 12 ? 'midi' : 'minuit';
        a.push(word+' moins '+number(remainder));
        if (remainder === 15) a.push(word+' moins le quart');
      }
    }
    const suffix=h < 12 ? ' du matin' : h < 18 ? " de l'après-midi" : ' du soir';
    return uniq(a.concat(a.map(s=>s+suffix)));
  }
  const timeAnswer = (h,m,a) => compare(norm(a).replace(/^(il est|à|a) /,''),timeVariants(h,m));
  function digitAnswer(h,m,a) {
    const match=String(a).trim().replace(/\s/g,'').match(/^(\d{1,2})(?:[:hH](\d{2})|[hH])$/);
    return {ok:!!match && +match[1]===h && +(match[2]||0)===m,accent:false};
  }
  function clockExplanation(h,m) {
    const hour=h%12||12,next=hour%12+1,mark=m/5||12;
    const minuteText=m%5===0?`Der lange Zeiger zeigt auf ${mark}: ${m} Minuten.`:`Der lange Zeiger steht beim ${m}. Minutenstrich.`;
    return minuteText+' '+(m===0?`Der kurze Zeiger zeigt genau auf ${hour}.`:`Der kurze Zeiger steht zwischen ${hour} und ${next}; die Stunde ist noch ${hour}.`)+(h>=12?` Hier ist ${h>=18?'Abend':'Nachmittag'}: Schreiben Sie ${h} als Stunde.`:h===0?' Nachts um zwölf schreiben Sie 00 als Stunde.':'');
  }
  function explanation(q,answer) {
    if(['analog','timeRead','timeListen'].includes(q.kind)) {
      const format=/^(\d{1,2})(?:[:hH](\d{2})|[hH])$/.test(String(answer).trim().replace(/\s/g,''));
      if(!format)return 'Schreiben Sie Stunden und Minuten mit Doppelpunkt, z. B. 08:15. Verwenden Sie das 24-Stunden-System.';
      if(q.kind==='analog')return clockExplanation(q.h,q.m);
      return `«${q.spoken}» bedeutet ${q.h} Stunde${q.h===1?'':'n'} und ${q.m} Minuten. Im 24-Stunden-System: ${digital(q.h,q.m)}.`;
    }
    return q.hint;
  }
  function numericAnswer(n,a) {
    const s=String(a).trim();
    const valid=/^\d+$/.test(s) || /^\d{1,3}(?:[ '’.,]\d{3})+$/.test(s);
    return {ok:valid && Number(s.replace(/[ '’.,]/g,''))===n,accent:false};
  }
  function grade(q,a) {
    if (q.kind==='numberWrite') return numberAnswer(q.n,a);
    if (q.kind==='numberRead'||q.kind==='numberListen') return numericAnswer(q.n,a);
    if (q.kind==='timeWrite'||q.kind==='later') return timeAnswer(q.h,q.m,a);
    if (q.kind==='preposition') return compare(a,[q.answer]);
    return digitAnswer(q.h,q.m,a);
  }
  function clock(h,m) {
    const labels=Array.from({length:12},(_,i)=>{const n=i+1,a=n*Math.PI/6;return `<text x="${110+79*Math.sin(a)}" y="${116-79*Math.cos(a)}" text-anchor="middle">${n}</text>`;}).join('');
    const hand=(length,angle,width)=>{const a=angle*Math.PI/180;return `<line x1="110" y1="110" x2="${110+length*Math.sin(a)}" y2="${110-length*Math.cos(a)}" stroke="#14364b" stroke-width="${width}" stroke-linecap="round"/>`;};
    return `<svg class="clock" viewBox="0 0 220 220" role="img" aria-label="Analoge Uhr. Die kurze Linie ist der Stundenzeiger, die lange der Minutenzeiger."><circle cx="110" cy="110" r="105" fill="#f4f8f3" stroke="#afcbc2" stroke-width="2"/>${labels}${hand(47,h%12*30+m*.5,7)}${hand(68,m*6,4)}<circle cx="110" cy="110" r="6" fill="#087b78"/></svg>`;
  }
  function makeQuestion(kind,n=0,h=8,m=0,delta=15) {
    if (kind.startsWith('number')) {
      const block=n >= 1000 ? 'Bilden Sie Tausender und den Rest getrennt. Mille bleibt unverändert.' : n>=100 ? 'Bilden Sie Hunderter und den Rest getrennt. Deux cents, aber deux cent trois.' : 'Zerlegen Sie in Zehner und Einer. 70: septante; 80: quatre-vingts; 90: nonante.';
      return {id:`${kind}:${n}`,topic:'numbers',kind,n,prompt:kind==='numberWrite'?`${n.toLocaleString('de-CH')} → auf Französisch`:kind==='numberListen'?'Welche Zahl hören Sie?':number(n,'ch'),answer:kind==='numberWrite'?number(n,'ch'):String(n),spoken:number(n,'ch'),hint:block,label:kind==='numberWrite'?'Die Zahl ausgeschrieben':'Die Zahl in Ziffern'};
    }
    const q={id:`${kind}:${h}:${m}:${delta}`,topic:'times',kind,h,m,answer:official(h,m),spoken:official(h,m),label:'Die Uhrzeit auf Französisch',hint:'Denken Sie an heure / heures. 15 = et quart; 30 = et demie; 45 = moins le quart bei der nächsten Stunde.'};
    if (kind==='preposition') {
      const appointment=h%2===0;
      q.prompt=appointment?`Le rendez-vous est ___ ${official(h,m)}.`:`Quelle heure est-il ? ___ ${official(h,m)}.`;
      q.answer=appointment?'à':'Il est'; q.label='Ergänzen Sie «Il est» oder «à»'; q.hint='Wie spät? Il est … / Zu welcher Zeit? à …';
    } else if (kind==='later') {
      const original=(h*60+m-delta+1440)%1440;
      q.prompt=`${digital(Math.floor(original/60),original%60)} · ${Math.abs(delta)} Minuten ${delta>0?'später':'früher'}`;
      q.hint=`Rechnen Sie zuerst in Minuten. Die gesuchte Zeit ist ${digital(h,m)}. Schreiben Sie sie nun auf Französisch.`;
    } else if (kind==='timeWrite') q.prompt=digital(h,m)+' → auf Französisch';
    else {
      q.label='Uhrzeit in Ziffern, z. B. 18:30'; q.answer=digital(h,m);
      const context=h<5?'nachts':h<12?'am Vormittag':h<18?'am Nachmittag':'am Abend';
      q.prompt=kind==='analog'?`Wie spät ist es ${context}?`:kind==='timeListen'?'Welche Uhrzeit hören Sie?':official(h,m);
      q.hint=kind==='analog'?clockExplanation(h,m):'Schreiben Sie Stunden und Minuten mit Doppelpunkt. Nutzen Sie das 24-Stunden-System; am Abend z. B. 18:30.';
    }
    return q;
  }
  function pool(topic,range=100,kind='mixed') {
    const small=[0,1,5,10,11,12,13,14,15,16,17,18,19,20,21,30,31,40,42,50,60,61,70,71,75,80,81,90,91,99,100];
    const medium=[100,101,110,121,180,200,201,221,280,300,305,380,400,450,500,550,600,620,700,710,777,800,810,880,900,901,980,999,1000];
    const big=[1000,1001,1010,1200,2000,2800,3200,10000,12000,20000,21000,80000,81000,100000,200000,200100,280000,500000,900000,999999,1000000];
    const times=[[6,0],[7,10],[8,15],[8,30],[9,45],[10,20],[11,50],[12,0],[12,30],[13,5],[14,15],[14,40],[15,30],[16,45],[17,10],[18,30],[19,15],[20,0],[21,45],[23,50],[0,0],[1,30]];
    let a=[];
    if(topic==='numbers'||topic==='quiet') {
      const list=topic==='quiet'||+range===100?small:+range===1000?medium:big;
      const kinds=topic==='quiet'?['numberRead']:kind==='mixed'?['numberRead','numberWrite']:[kind];
      a=list.flatMap(n=>kinds.map(k=>makeQuestion(k,n)));
    }
    if(topic==='times'||topic==='quiet') {
      const kinds=topic==='quiet'?['timeRead','analog']:kind==='mixed'?['timeRead','timeWrite','analog','preposition','later']:[kind];
      a=a.concat(times.flatMap(([h,m])=>kinds.map(k=>makeQuestion(k,0,h,m,m%2?15:-10))));
    }
    return a;
  }
  function record(state,q,result,now=Date.now()) {
    if(q.repair) return;
    const today=new Date(now).toISOString().slice(0,10);
    const old=state.items[q.id]||{attempts:0,successes:0,days:[],needsWork:false,q};
    old.attempts++;old.lastOk=result.ok;old.lastHelp=!!result.helped;
    if(result.ok&&!result.helped) {
      old.successes++;
      if(!old.days.includes(today)) old.days.push(today);
      if(old.lastDay!==today) old.needsWork=false;
      old.due=now+DAY*(old.days.length>=3?7:old.days.length>=2?3:1);
    } else {old.needsWork=true;old.due=now+DAY;}
    old.lastDay=today;state.items[q.id]=old;
  }
  const API={number,numberVariants,numberAnswer,timeVariants,timeAnswer,digitAnswer,numericAnswer,grade,makeQuestion,pool,record,clock,clockExplanation,explanation,KEY};
  if(typeof module!=='undefined'&&module.exports) module.exports=API;
  root.W45Practice=API;
  if(typeof document==='undefined') return;

  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state={items:{},rounds:0},storageOK=true;
  try {const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&saved.items&&typeof saved.items==='object'&&!Array.isArray(saved.items)) {state.items=Object.fromEntries(Object.entries(saved.items).filter(([,v])=>v&&v.q&&typeof v.q.id==='string'&&Array.isArray(v.days)&&Number.isFinite(v.attempts)));state.rounds=Number(saved.rounds)||0;}}catch(e){storageOK=false;}
  let topic='quiet',questions=[],results=[],index=0,answered=false,helped=false,started=false;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){storageOK=false;}if(!storageOK)$('saveStatus').textContent='Speichern nicht möglich · diese Runde bleibt offen';}
  const weakItems=()=>Object.values(state.items).filter(v=>v.needsWork&&(topic==='quiet'? !v.q.kind.endsWith('Listen')&&(v.q.topic==='times'||v.q.topic==='numbers'&&v.q.n<=100) :v.q.topic===topic));
  function renderStats(){
    const all=Object.values(state.items);
    $('stats').innerHTML=`<div><b>${all.length}</b><span>Aufgaben geübt</span></div><div><b>${all.filter(v=>v.needsWork).length}</b><span>Lernstellen</span></div><div><b>${all.filter(v=>v.days.length>=3&&!v.needsWork).length}</b><span>an 3 Tagen sicher</span></div>`;
    const weak=weakItems();$('weak').disabled=!weak.length;
    $('weakInfo').textContent=weak.length?`${weak.length} persönliche Lernstelle${weak.length===1?'':'n'} in diesem Bereich. Eine spätere Wiederholung hilft beim Behalten.`:'Ihre persönlichen Lernstellen erscheinen nach der ersten Runde.';
    $('weakList').innerHTML=weak.length?`<h3>Noch einmal anschauen</h3>`+weak.slice(0,4).map(v=>`<p class="weak-item">${esc(v.q.prompt)}<b>${esc(v.q.answer)}</b></p>`).join(''):'';
  }
  function setup(){
    const hash=location.hash.slice(1);topic=['quiet','numbers','times'].includes(hash)?hash:'quiet';started=false;
    document.querySelectorAll('[data-topic]').forEach(a=>{if(a.dataset.topic===topic)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    $('setup').hidden=false;$('exercise').hidden=true;$('result').hidden=true;$('rangeWrap').hidden=topic!=='numbers';$('kindWrap').hidden=topic==='quiet';
    const text={quiet:['NACH DER LERNKONTROLLE','Ruhig starten. Still üben.','Arbeiten Sie leise und allein. Eine kurze Runde mischt Zahlen bis 100 und Uhrzeiten. Sobald die Lehrperson startet, können Sie jederzeit beenden.'],numbers:['LES NOMBRES','Zahlen werden vertraut.','Beginnen Sie bei 0 bis 100. Lesen und schreiben Sie Marktpreise. Grössere Zahlen wählen Sie bewusst als Zusatz.'],times:['L’HEURE','Zur richtigen Zeit.','Lesen, schreiben und verschieben Sie Uhrzeiten. Eine kurze Runde genügt für einen klaren nächsten Lernschritt.']}[topic];
    [$('modeKicker').textContent,$('setupTitle').textContent,$('setupInfo').textContent]=text;
    const options=topic==='numbers'?[['mixed','Lesen & schreiben'],['numberRead','Wörter → Ziffern'],['numberWrite','Ziffern → Wörter'],['numberListen','Hören → Ziffern · mit Kopfhörern']]:[['mixed','Alles gemischt'],['timeRead','Wörter → digitale Uhrzeit'],['timeWrite','Digitale Uhrzeit → Wörter'],['analog','Analoge Uhr lesen'],['preposition','Il est oder à?'],['later','Früher oder später'],['timeListen','Hören → digitale Uhrzeit · mit Kopfhörern']];
    $('kind').innerHTML=options.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
    $('beforeHelp').innerHTML=topic==='numbers'?'<p>21 = vingt et un · 70 = septante / soixante-dix · 80 = quatre-vingts / huitante · 90 = nonante / quatre-vingt-dix.</p><p>Schweizer und französische Varianten sowie beide Bindestrichschreibweisen sind willkommen.</p>':'<p>08:15 → huit heures et quart · 08:30 → huit heures et demie · 08:45 → neuf heures moins le quart.</p><p>Wie spät? <b>Il est</b> … · Termin? <b>à</b> … · Geben Sie Ziffern im 24-Stunden-System ein.</p>';
    renderStats();
  }
  const shuffled=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
  function start(weakOnly){
    const available=weakOnly?weakItems().map(v=>v.q):pool(topic,Number($('range').value),$('kind').value);
    if(!available.length)return;
    const due=available.filter(q=>state.items[q.id]&&state.items[q.id].due<=Date.now());
    let ordered=shuffled(due).concat(shuffled(available.filter(q=>!due.includes(q))));
    if(topic==='quiet'&&!weakOnly){const ns=ordered.filter(q=>q.topic==='numbers'),ts=ordered.filter(q=>q.topic==='times');ordered=[];while(ns.length||ts.length){if(ns.length)ordered.push(ns.pop());if(ts.length)ordered.push(ts.pop());}}
    questions=ordered.slice(0,Number($('amount').value)).map(q=>({...q,repair:false}));results=[];index=0;started=true;
    $('setup').hidden=true;$('result').hidden=true;$('exercise').hidden=false;renderQ();$('exercise').scrollIntoView({block:'start',behavior:'smooth'});
  }
  function renderQ(){
    answered=false;helped=false;const q=questions[index];
    $('counter').textContent=`Aufgabe ${index+1} von ${questions.length}${q.repair?' · Wiederholung':''}`;
    $('progress').max=questions.length;$('progress').value=index;
    $('questionType').textContent=q.repair?'Noch einmal mit Abstand':q.topic==='numbers'?'Les nombres':'L’heure';
    $('prompt').textContent=q.prompt;$('visual').innerHTML=q.kind==='analog'?clock(q.h,q.m):'';
    $('listenArea').hidden=!q.kind.endsWith('Listen');$('voiceNotice').textContent='Audio startet nur auf Knopfdruck. Verwenden Sie Kopfhörer.';
    $('readText').hidden=true;$('readText').textContent=q.spoken||q.answer;
    $('answerLabel').textContent=q.label;$('answer').value='';$('answer').readOnly=false;$('answer').inputMode=(q.kind==='numberRead'||q.kind==='numberListen')?'numeric':'text';
    $('check').disabled=false;$('hint').disabled=false;$('hintText').hidden=true;$('feedback').textContent='';$('feedback').className='feedback';$('next').hidden=true;
    $('answer').focus();
  }
  function check(event){
    event.preventDefault();if(!started)return;if(answered){next();return;}
    if(!$('answer').value.trim()){$('feedback').textContent='Geben Sie zuerst eine Antwort ein. Oder öffnen Sie einen Tipp.';return;}
    const q=questions[index],result={...grade(q,$('answer').value),helped,repair:!!q.repair};answered=true;results.push(result);record(state,q,result);save();
    $('check').disabled=true;$('answer').readOnly=true;$('hint').disabled=true;
    $('feedback').className='feedback '+(result.ok?'correct':'retry');
    let headline=result.ok?(q.repair?'Richtig wiederholt.':helped?'Richtig mit Unterstützung.':'Richtig – selbständig gelöst.'):'Noch nicht ganz. Schauen Sie genau hin.';
    const extra=result.accent?' Achten Sie beim nächsten Mal noch auf die Akzente.':'';
    $('feedback').innerHTML=`<strong>${headline}</strong><p>${result.ok?'Eine passende Lösung:':'Die Lösung:'} <b>${esc(q.answer)}</b>${extra}</p>${!result.ok?`<p>${esc(explanation(q,$('answer').value))}</p>`:''}`;
    if((!result.ok||helped)&&!q.repair&&questions.filter(v=>v.repair).length<3&&index<questions.length-1){questions.splice(Math.min(index+3,questions.length),0,{...q,repair:true});$('feedback').innerHTML+='<p>Diese Aufgabe kommt nach anderen Aufgaben noch einmal.</p>';}
    $('next').hidden=false;$('next').textContent=index===questions.length-1?'Runde auswerten →':'Weiter →';$('next').focus();renderStats();
  }
  function next(){if(!answered||!started)return;index++;if(index>=questions.length)finish(false);else renderQ();}
  function finish(stopped){
    if(!started)return;started=false;if(root.speechSynthesis)root.speechSynthesis.cancel();
    $('exercise').hidden=true;$('result').hidden=false;
    const first=results.filter(r=>!r.repair),solo=first.filter(r=>r.ok&&!r.helped).length,help=first.filter(r=>r.ok&&r.helped).length,errors=first.filter(r=>!r.ok).length;
    if(!stopped){state.rounds++;save();if(topic==='quiet'){try{const module=JSON.parse(localStorage.getItem(MODULE_KEY)||'{}');if(!module.missionDone||typeof module.missionDone!=='object')module.missionDone={};module.missionDone[1]=true;localStorage.setItem(MODULE_KEY,JSON.stringify(module));}catch(e){}}}
    $('result').innerHTML=`<p class="eyebrow">${stopped?'PAUSE · IHR ZWISCHENSTAND':'RONDE TERMINÉE'}</p><h2 class="result-title">${stopped?'Gut bis hierher.':'Ein Schritt weiter.'}</h2><p>${first.length} Aufgabe${first.length===1?'':'n'} im ersten Versuch beantwortet. Wiederholungen zählen separat.</p><div class="result-grid"><div><b>${solo}</b><span>selbständig richtig</span></div><div><b>${help}</b><span>mit Hilfe richtig</span></div><div><b>${errors}</b><span>noch zu festigen</span></div></div><p class="small">${results.filter(r=>r.repair&&r.ok).length} Wiederholung(en) richtig. Hilfe zu nutzen gehört zum Lernen. Prüfen Sie Ihre Lernstellen an einem späteren Tag noch einmal ohne Tipp.</p><div class="actions"><button id="again" class="primary">Neue Runde →</button><button id="choose" class="secondary">Training wählen</button></div><p style="margin-top:1rem"><a href="index.html${topic==='quiet'?'#mission-1':'#mission-4'}">Zurück zu Woche 45 →</a></p>`;
    $('again').addEventListener('click',()=>start(false));$('choose').addEventListener('click',setup);renderStats();$('result').scrollIntoView({block:'start',behavior:'smooth'});
  }
  function showHint(){if(!started||answered)return;helped=true;$('hintText').textContent=questions[index].hint;$('hintText').hidden=false;$('hint').disabled=true;}
  function speak(){
    if(!started)return;const synth=root.speechSynthesis;
    const voices=synth?synth.getVoices():[],voice=voices.find(v=>/^fr[-_]/i.test(v.lang))||voices.find(v=>v.lang==='fr');
    if(!synth||!voice||!root.SpeechSynthesisUtterance){$('voiceNotice').textContent='Hier ist keine französische Stimme verfügbar. Wählen Sie «Als Leseaufgabe lösen» oder eine andere Trainingsart.';return;}
    synth.cancel();const utter=new root.SpeechSynthesisUtterance(questions[index].spoken);utter.voice=voice;utter.lang=voice.lang;utter.rate=.85;utter.onerror=()=>{$('voiceNotice').textContent='Die Wiedergabe hat nicht geklappt. Sie können die Aufgabe als Leseaufgabe lösen.';};synth.speak(utter);
  }
  $('start').addEventListener('click',()=>start(false));$('weak').addEventListener('click',()=>start(true));$('answerForm').addEventListener('submit',check);$('next').addEventListener('click',next);$('hint').addEventListener('click',showHint);$('stop').addEventListener('click',()=>finish(true));$('listen').addEventListener('click',speak);
  $('audioText').addEventListener('click',()=>{helped=true;$('readText').hidden=false;$('voiceNotice').textContent='Sie lösen diese Aufgabe lesend. Dies wird als Antwort mit Unterstützung gezählt.';});
  $('answer').addEventListener('keydown',e=>{if(e.key==='Enter'&&answered){e.preventDefault();next();}});
  $('font').addEventListener('click',()=>{$('font').setAttribute('aria-pressed',String(document.body.classList.toggle('large')));});
  root.addEventListener('hashchange',()=>{if(root.speechSynthesis)root.speechSynthesis.cancel();setup();});
  $('range').addEventListener('change',renderStats);setup();save();
})(typeof window!=='undefined'?window:globalThis);
