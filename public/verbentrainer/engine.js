(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VerbLearning=api;})(typeof window!=='undefined'?window:globalThis,()=>{
'use strict';
const DAY=86400000,INTERVALS=[1,3,7,14,30],PERSONS=['je / j’','tu','il / elle / on','nous','vous','ils / elles'];
const norm=s=>String(s??'').toLowerCase().trim().replace(/ß/g,'ss').replace(/[’‘]/g,"'").replace(/[-–]/g,' ').replace(/\s+/g,' ');
const plain=s=>norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const day=ts=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(ts));
const empty=()=>({schema:2,items:{},history:[]});
function validateCatalog(c){if(!c||!Array.isArray(c.verbs)||!Array.isArray(c.sets))throw Error('Ungültiger Verbkatalog');const ids=new Set();for(const v of c.verbs){if(!v.id||ids.has(v.id)||!v.fr||!v.de||!Array.isArray(v.forms)||v.forms.length!==6||v.forms.some(f=>typeof f!=='string'||!f.trim())||!Array.isArray(v.meanings)||!v.meanings.length)throw Error('Unvollständiger oder doppelter Verbeintrag');ids.add(v.id);}for(const s of c.sets)if(!s.id||!Array.isArray(s.verbIds)||s.verbIds.some(id=>!ids.has(id)))throw Error('Unbekanntes Verb in einer Woche');return true;}
function pool(c,scope='all',mode='mixed',person='all'){
 const selected=scope==='all'?null:c.sets.find(s=>s.id===scope)?.verbIds;if(scope!=='all'&&!selected)return[];
 return c.verbs.filter(v=>!selected||selected.includes(v.id)).flatMap(v=>['de-fr','fr-de','present'].filter(t=>mode==='mixed'||mode===t).flatMap(type=>(type==='present'?(person==='all'?[0,1,2,3,4,5]:[Number(person)]):[-1]).map(p=>({id:v.id+'|'+type+'|'+p,v,type,p}))));
}
function expected(q){return q.type==='de-fr'?[q.v.fr]:q.type==='fr-de'?q.v.meanings:[q.v.forms[q.p]];}
function grade(q,raw){let got=norm(raw);if(q.type==='present'){const rx=[/^(je |j')/,/^tu /,/^(il |elle |on )/,/^nous /,/^vous /,/^(ils |elles )/];if(q.p===0&&/^je [aeioué]/.test(got))return{ok:false,accent:false,answer:expected(q)[0]};got=got.replace(rx[q.p],'');}const vals=expected(q).map(norm),answers=q.type==='fr-de'?got.split(/\s*[/,;]\s*/).filter(Boolean):[got];const ok=answers.length>0&&answers.every(a=>vals.includes(a));return{ok,accent:!ok&&q.type!=='fr-de'&&vals.some(a=>plain(a)===plain(got)),answer:expected(q)[0]};}
function record(state,id,{ok,help=false,guess=false,repair=false,now=Date.now()}={}){
 const old=state.items[id]||{attempts:0,stage:0,due:0,days:[],lapses:0};const item={...old,days:[...(old.days||[])],attempts:old.attempts+1,last:now};
 if(repair){item.repairs=(old.repairs||0)+1;state.items[id]=item;return item;}
 if(!ok||help||guess){item.stage=0;item.due=now;item.needsWork=true;item.lapses=(old.lapses||0)+1;item.lastProblemDay=day(now);}
 else if(!item.days.includes(day(now))&&item.lastProblemDay!==day(now)&&(!old.due||now>=old.due)){
  item.days.push(day(now));item.days=item.days.slice(-30);item.stage=Math.min(5,(old.stage||0)+1);item.due=now+INTERVALS[item.stage-1]*DAY;item.needsWork=false;
 }else if(item.lastProblemDay===day(now)){item.due=now+DAY;item.needsWork=true;} // a repaired form needs a later independent retrieval
 state.items[id]=item;return item;
}
function stats(questions,state,now=Date.now()){
 const out={total:questions.length,unseen:0,due:0,stable:0,practised:0};for(const q of questions){const s=state.items[q.id];if(!s?.attempts)out.unseen++;else{out.practised++;if(s.due<=now)out.due++;if(s.stage>=3&&s.days?.length>=3)out.stable++;}}return out;
}
function queue(questions,state,kind='recommended',size=10,now=Date.now(),rng=Math.random){
 let q=[...questions];if(kind==='unseen')q=q.filter(x=>!state.items[x.id]?.attempts);if(kind==='errors')q=q.filter(x=>state.items[x.id]?.needsWork);if(kind==='due')q=q.filter(x=>state.items[x.id]?.attempts&&state.items[x.id].due<=now);
 q=q.map(x=>({q:x,tie:rng(),rank:!state.items[x.id]?.attempts?1:state.items[x.id].due<=now?0:2})).sort((a,b)=>a.rank-b.rank||a.tie-b.tie).map(x=>x.q);
 if(kind==='mixed'){const picked=[];for(const[t,n]of [['de-fr',2],['fr-de',2],['present',Math.max(0,size-4)]])picked.push(...q.filter(x=>x.type===t).slice(0,n));const have=new Set(picked.map(x=>x.id));picked.push(...q.filter(x=>!have.has(x.id)).slice(0,size-picked.length));const shuffled=picked.slice(0,size);for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}return shuffled;}
 return q.slice(0,size);
}
function addRepair(list,index,q,cap=16){if(list.length>=cap||list.length-index-1<2||list.some((x,i)=>i>index&&x.id===q.id)||q.repair)return false;const position=Math.min(list.length,index+4);list.splice(position,0,{...q,repair:true});return true;}
function migrate(old){const s=empty();for(const[id,n]of Object.entries(old?.errors||{}))if(n>0)s.items[id]={attempts:1,stage:0,due:0,days:[],lapses:n,needsWork:true};return s;}
function prompt(q,context=false){if(q.type==='de-fr')return q.v.de;if(q.type==='fr-de')return q.v.fr;return PERSONS[q.p]+' … ('+q.v.fr+')'+(context?' '+q.v.tail:'');}
const probes={
 A:['être|de-fr|-1','dire|de-fr|-1','savoir|fr-de|-1','mettre|fr-de|-1','avoir|present|0','être|present|1','aller|present|2','venir|present|3','faire|present|4','pouvoir|present|5','voir|present|3','dire|present|4'],
 B:['prendre|de-fr|-1','devoir|de-fr|-1','pouvoir|fr-de|-1','aimer|fr-de|-1','vouloir|present|0','savoir|present|1','voir|present|2','mettre|present|3','venir|present|4','devoir|present|5','jouer|present|3','pouvoir|present|4'],
 C:['aller|de-fr|-1','voir|de-fr|-1','devoir|fr-de|-1','venir|fr-de|-1','dire|present|0','prendre|present|1','faire|present|2','pouvoir|present|3','savoir|present|4','avoir|present|5','aimer|present|4','voir|present|5']
};
function probe(c,name){const all=pool(c,'test44');return(probes[name]||[]).map(id=>all.find(q=>q.id===id)).filter(Boolean);}
return{DAY,INTERVALS,PERSONS,norm,plain,day,empty,validateCatalog,pool,expected,grade,record,stats,queue,addRepair,migrate,prompt,probe,probes};
});
