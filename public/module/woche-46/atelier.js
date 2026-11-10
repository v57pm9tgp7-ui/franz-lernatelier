'use strict';
const units = 'zéro un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize dix-sept dix-huit dix-neuf'.split(' ');
const decades = ['', '', 'vingt','trente','quarante','cinquante','soixante','septante','huitante','nonante'];
function numberWords(n, style='ch') {
  if(n===1000000) return 'un million';
  if(n>=1000) {
    const k=Math.floor(n/1000), rest=n%1000;
    const prefix=k===1?'':numberWords(k,style).replace(/cents$|vingts$/,v=>v.slice(0,-1))+' ';
    return prefix+'mille'+(rest?' '+numberWords(rest,style):'');
  }
  if(n>=100) {
    const h=Math.floor(n/100),rest=n%100;
    return (h===1?'':units[h]+' ')+'cent'+(!rest&&h>1?'s':'')+(rest?' '+numberWords(rest,style):'');
  }
  if(n<20) return units[n];
  if(style==='fr' && n>=70 && n<80) return 'soixante'+(n===71?' et ':'-')+units[n-60];
  if(style!=='ch' && n>=80 && (n<90||style==='fr')) return n===80?'quatre-vingts':'quatre-vingt-'+units[n-80];
  const d=Math.floor(n/10),rest=n%10;
  return decades[d]+(rest===1?' et un':rest?'-'+units[rest]:'');
}
const suffixes=['',' cinq',' dix',' et quart',' vingt',' vingt-cinq',' et demie',' moins vingt-cinq',' moins vingt',' moins le quart',' moins dix',' moins cinq'];
function clockWords(h,m,withDay=false) {
  const ref=(h+(m>30?1:0))%24,hr=ref%12;
  const base=hr===0?(ref===0?'minuit':'midi'):hr===1?'une heure':units[hr]+' heures';
  const suffix=hr===0&&m===30?' et demi':suffixes[m/5];
  return base+suffix+(withDay&&hr!==0?' '+(ref<12?'du matin':ref<18?'de l’après-midi':'du soir'):'');
}
const clock=(h,m)=>String(h).padStart(2,'0')+' h '+String(m).padStart(2,'0');
const norm=x=>String(x).toLowerCase().normalize('NFC').replace(/[’‘]/g,"'").replace(/[-‐‑]/g,' ').replace(/[.!?]$/,'').replace(/\s+/g,' ').trim();
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const choose=a=>a[Math.floor(Math.random()*a.length)];
const rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const format=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'’');
function numberRound(level){
  const limits=[[1,100],[101,999],[1000,9999],[10000,999999]], [lo,hi]=limits[level];
  const seeds=[[71,80,91],[200,201,480,509],[1000,1040,2001,8200],[10020,350004,999999,1000000]][level];
  const values=new Set(shuffle(seeds).slice(0,3));while(values.size<8)values.add(rand(lo,hi));
  return shuffle(values).map((n,i)=> {
    const dialects=['ch','be','fr'];
    const words=[...new Set(dialects.flatMap(style=>{
      if(n<1000||n===1000000||n%1000===0)return [numberWords(n,style)];
      const thousands=numberWords(n-n%1000,style);
      return dialects.map(endStyle=>thousands+' '+numberWords(n%1000,endStyle));
    }))];
    return i%2?{prompt:choose(words),cue:'Schreiben Sie die Zahl in Ziffern.',answers:[String(n)],digit:true}
    :{prompt:format(n),cue:'Schreiben Sie die Zahl auf Französisch.',answers:words,hint:n===1000000?'Eine Million ist im Französischen ein Substantiv und braucht einen Artikel.':n>=1000?'Lesen Sie zuerst '+Math.floor(n/1000)+', dann «mille»'+(n%1000?', dann '+n%1000: '')+'.':n>=100?'Bauen Sie die Zahl aus '+Math.floor(n/100)+' Hundertern'+(n%100?' und '+n%100:'')+'.':'Vergleichen Sie Zehner und Einer.'};
  });
}
function timeRound(mode){
  const qs=[],used=new Set();while(qs.length<8){
    const i=qs.length,h=choose(mode==='day'?[7,8,9,14,15,19,20,21]:[1,3,5,7,8,10,12,14,16,17,20,22]);
    const m=mode==='day'&&i<2?0:choose(mode==='minus'?[35,40,45,50,55]:mode==='plus'?[0,5,10,15,20,25,30]:[0,5,10,15,20,25,30,35,40,45,50,55]);
    if(used.has(h+':'+m))continue;used.add(h+':'+m);
    const day=mode==='day',phrase=clockWords(h,m,day);
    if(day&&i%2)qs.push({prompt:'Il est '+phrase+'.',cue:'Schreiben Sie die digitale Uhrzeit, z. B. 20:15.',answers:[clock(h,m),h+':'+String(m).padStart(2,'0'),String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')]});
    else qs.push({prompt:clock(h,m),cue:'Sagen Sie die Uhrzeit auf Französisch und tippen Sie sie ein.'+(day?' Ergänzen Sie die Tageszeit.':' Nutzen Sie die gesprochene Form aus der Übersicht.'),answers:['Il est '+phrase,phrase]});
  }return qs;
}
function verbRound(mode){
  const catalog=window.VERB_CATALOG.verbs,people=['je / j’','tu','il / elle','nous','vous','ils / elles'];
  const persons=shuffle([0,1,2,3,4,5]); let conjugations=0;
  return shuffle(catalog).slice(0,mode==='all'?25:8).map((v,i)=>{
    const kind=mode==='all'?['de-fr','fr-de','present'][i%3]:mode;
    if(kind==='de-fr')return {verbTask:{v,type:kind},prompt:v.de,cue:'Geben Sie den französischen Infinitiv ein.',answers:[v.fr]};
    if(kind==='fr-de') return {verbTask:{v,type:kind},prompt:v.fr,cue:'Nennen Sie eine passende deutsche Bedeutung.',answers:v.meanings};
    const p=persons[conjugations++%6];return {verbTask:{v,type:'present',p},prompt:v.fr+'   ·   '+people[p],cue:'Schreiben Sie die Verbform im présent.',answers:[v.forms[p],(p===0?(/^[aeéioûu]/.test(v.forms[p])?'j’':'je '):['','tu ','il ','nous ','vous ','ils '][p])+v.forms[p],...(p===2?['elle '+v.forms[p],'on '+v.forms[p]]:p===5?['elles '+v.forms[p]]:[])]};
  });
}
function installQuiz(id,make){
  const box=document.getElementById(id),select=box.querySelector('select'),area=box.querySelector('.round');
  let qs,pos,correct,missed,first;
  function begin(list){qs=list;pos=0;correct=0;missed=[];show();}
  function report(attempted){
    area.innerHTML='<h3>Ihre Runde</h3><p>'+correct+' von '+attempted+' bearbeiteten Aufgaben beim ersten Versuch richtig.</p>';
    if(missed.length){
      const repeat=document.createElement('button');
      repeat.textContent='Schwierige Aufgaben nochmals lösen';
      repeat.onclick=()=>begin([...missed]);area.append(repeat);
    }
  }
  function show(){
    first=true;const q=qs[pos];area.innerHTML='<p class="eyebrow"></p><h3></h3><form><label></label><input type="text" autocomplete="off" spellcheck="false" required><div class="actions"><button>Prüfen</button><button class="secondary" type="button" data-solve>Lösung ansehen</button></div></form><p role="status"></p><button hidden data-next>Weiter</button>';
    const get=s=>area.querySelector(s),field=get('input'),feedback=get('[role=status]');field.id=id+'-answer';get('label').htmlFor=field.id;get('.eyebrow').textContent='Aufgabe '+(pos+1)+' von '+qs.length;get('h3').textContent=q.prompt;get('label').textContent=q.cue;
    function done(ok){if(ok&&first)correct++;else missed.push(q);
      const finish=document.createElement('button');finish.className='secondary finish';finish.textContent='Runde auswerten';finish.onclick=()=>report(pos+1);area.append(finish);field.readOnly=true;get('.actions').hidden=true;get('[data-next]').hidden=false;get('[data-next]').focus();}
    get('form').onsubmit=e=>{e.preventDefault();if(field.readOnly)return;const val=q.digit?field.value.replace(/[ ’']/g,''):field.value;const ok=q.verbTask?window.VerbLearning.grade(q.verbTask,val).ok:q.answers.some(a=>norm(a)===norm(val));if(ok){feedback.textContent='Richtig. '+q.answers[0];done(true);}else{first=false;feedback.textContent='Versuchen Sie es nochmals. '+(q.hint||(q.digit?'Prüfen Sie die Tausender- und Hundertergruppen.':id==='timeQuiz'?'Prüfen Sie Stunde, Minuten und gegebenenfalls die Tageszeit.':id==='verbQuiz'?'Achten Sie auf Person, Endung und Akzent.':'Vergleichen Sie die Zahlengruppen mit der Übersicht.'));field.select();}};
    get('[data-solve]').onclick=()=>{feedback.textContent='Lösung: '+q.answers[0];done(false);};
    get('[data-next]').onclick=()=>{if(++pos<qs.length){show();area.querySelector('input').focus();}else report(qs.length);};
  }
  box.querySelector('[data-start]').onclick=()=>begin(make(select.value));select.onchange=()=>{area.replaceChildren();};
}
function renderClock(){
  const tbody=document.querySelector('#clocktable');for(let i=1;i<=12;i++){
    const m=i*5%60,h=i===12?18:17,phrase=clockWords(h,m),base=m>30||!m?'six heures':'cinq heures';
    const tr=document.createElement('tr');tr.innerHTML='<td>'+clock(h,m)+'</td><td><span class="hour">'+base+'</span> '+(m>30?'<span class="minus">moins</span> ':'')+'<b class="minute">'+phrase.slice(base.length).replace('moins','').trim()+'</b></td>';tbody.append(tr);
  }
}
const trainingCases=[
 ['une lampe',38,28,32,'16:15','17:30','18:45','devant la bibliothèque'],
 ['un sac de sport',54,40,46,'15:45','16:30','19:00','à la gare'],
 ['une enceinte',86,65,72,'17:20','15:10','18:30','devant le cinéma'],
 ['un vélo',195,150,168,'14:40','16:15','17:50','à l’entrée du parc'],
 ['un appareil photo',260,210,235,'16:35','14:30','17:15','devant la poste'],
 ['une table',135,95,110,'15:55','17:25','18:20','devant le magasin']
];
function roleStudio(){
 const select=document.querySelector('#scenario'),card=document.querySelector('#roleCard'),response=document.querySelector('#agreementResult');
 const hide=()=>card.replaceChildren();
 trainingCases.forEach((c,i)=>select.add(new Option(c[0],i)));
 function reveal(side){const [item,ask,min,max,match,b,s,place]=trainingCases[+select.value];
 const times=(side==='buy'?[match,b]:[s,match]).sort();
 card.style.setProperty('--role-bg',side==='buy'?'#edf5fc':'#fff2e6');
 card.style.setProperty('--role-color',side==='buy'?'#175a89':'#963f11');
 card.innerHTML='<strong>'+(side==='buy'?'Kaufen':'Verkaufen')+' · '+item+'</strong><p>'+(side==='buy'?'Ihr Budget beträgt höchstens '+max+' CHF.':'Ihr Angebot beträgt '+ask+' CHF. Sie akzeptieren mindestens '+min+' CHF.')+'</p><p>Sie können um '+times.join(' oder ')+' Uhr. '+(side==='buy'?'Fragen Sie nach dem Treffpunkt.':'Treffpunkt: '+place+'.')+'</p><button type="button">Karte verdecken</button>';card.querySelector('button').onclick=hide;}
 select.onchange=()=>{hide();response.textContent='';document.querySelector('#agreement').reset();};
 document.querySelector('#buyer').onclick=()=>reveal('buy');document.querySelector('#seller').onclick=()=>reveal('sell');
 document.querySelector('#agreement').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),c=trainingCases[+select.value],price=Number(f.get('price')),time=f.get('time'),place=norm(f.get('place'));
 const errors=[];if(price<c[2]||price>c[3])errors.push('Verhandeln Sie den Preis nochmals.');if(time!==c[4])errors.push('Vergleichen Sie Ihre freien Zeiten.');if(place!==norm(c[7]))errors.push('Prüfen Sie den Treffpunkt auf Ihrer Karte und geben Sie ihn auf Französisch ein.');response.textContent=errors.join(' ')||'Die Abmachung passt zu beiden Karten. Wiederholen Sie den Schluss jetzt frei.';};
}
function partner(){
 const values=document.querySelector('#partnerValues'),out=document.querySelector('#partnerSolution');let data=[];
 function generate(){const easy=rand(40,99),medium=rand(101,999),big=rand(1,90)*1000+rand(1,900),h=choose([7,8,14,15,19,20]),m=choose([5,15,30,35,40,45,50,55]);
 data=[[format(easy),numberWords(easy)],[format(medium),numberWords(medium)],[format(big),numberWords(big)],[clock(h,m),'Il est '+clockWords(h,m,true)+'.']];values.innerHTML=data.map(v=>'<b>'+v[0]+'</b>').join(' · ');out.textContent='';}
 document.querySelector('#partnerNew').onclick=generate;document.querySelector('#partnerCheck').onclick=()=>{out.innerHTML=data.map(([k,v])=>k+' → '+v).join('<br>');};generate();
}
const destinations=['start','zahlen','zeiten','partner','verben','rollen','aufnahme'];
function route(){const id=location.hash.slice(1)||'start',view=destinations.includes(id)?id:'start';for(const s of document.querySelectorAll('main > section'))s.hidden=s.id!==view;for(const a of document.querySelectorAll('nav a')){if(a.hash==='#'+view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}window.scrollTo(0,0);}
function mountProgress(){
  const key='franzoesischLernatelierW46_v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{return {};}};
  destinations.slice(1).forEach((view,index)=>{
    const section=document.getElementById(view),label=document.createElement('label'),box=document.createElement('input');
    const mission=index+1;box.type='checkbox';box.checked=!!read().missionDone?.[mission];
    label.className='progressControl';label.append(box,'Diesen Bereich als bearbeitet markieren');
    section.insertBefore(label,section.querySelector('.next'));
    box.onchange=()=>{const state=read();state.missionDone={...state.missionDone,[mission]:box.checked};
      state.currentMission=destinations.slice(1).findIndex((_,i)=>!state.missionDone[i+1])+1||6;
      try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
  });
}
mountProgress();
renderClock();installQuiz('numberQuiz',v=>numberRound(+v));installQuiz('timeQuiz',timeRound);installQuiz('verbQuiz',verbRound);partner();roleStudio();window.addEventListener('hashchange',route);route();
