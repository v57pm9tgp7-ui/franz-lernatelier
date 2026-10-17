(function app(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY="franzPruefungW43_2026_v1";
const THEMES=[
{id:1,title:"Fragen stellen",subtitle:"Ein Gespräch beginnen und weiterführen",lead:"Sie stellen verständliche Fragen zu Name, Wohnort, Freizeit, Sprache oder Beruf.",tip:"Fragen Sie zuerst nach einer Information. Hören Sie auf die Antwort. Dann fragen Sie weiter.",example:"Tu habites où ? → J’habite à Berne.",v:[0,1,2,3,4,5],
situations:[
["Sie kennen den Wohnort bereits. Welche Frage bringt eine NEUE Information?","Quelles langues parles-tu ?",["Tu habites où ?","Quelles langues parles-tu ?","Comment tu t’appelles ?"],1,"Die Frage nach den Sprachen bringt eine andere Information.","Gesucht ist nicht nochmals die Frage nach dem Wohnort."],
["Eine Person antwortet: «Je parle allemand.» Welche Frage hat sie vermutlich gehört?","Quelles langues parles-tu ?",["Quels sont tes loisirs ?","Quelles langues parles-tu ?","Pourquoi ?"],1,"Die Antwort nennt eine Sprache.","Achten Sie auf «parle»."],
["Sie erfahren: «Je voudrais devenir cuisinier.» Welche Rückfrage ist jetzt sinnvoll?","Pourquoi ?",["Tu habites où ?","Pourquoi ?","Comment tu t’appelles ?"],1,"Mit «Pourquoi ?» erfahren Sie den Grund.","Ein Berufswunsch wurde bereits genannt."],
["Sie möchten wissen, was jemand ausserhalb der Schule gern macht. Welche Frage passt?","Quels sont tes loisirs ?",["Quels sont tes loisirs ?","Tu habites où ?","Quelles langues parles-tu ?"],0,"«Loisirs» bedeutet Hobbys.","Es geht um die Freizeit."],
["In einem Kennenlerngespräch wurden Name und Alter genannt. Was könnten Sie als Nächstes erfragen?","Tu habites où ?",["Comment tu t’appelles ?","Pourquoi ?","Tu habites où ?"],2,"Die Frage nach dem Wohnort ergänzt das Gespräch.","Wählen Sie eine Information, die noch fehlt."] ],
order:["Quelles","langues","parles-tu","?"],target:"Quelles langues parles-tu ?",writePrompt:"Stellen Sie eine Frage nach den Sprachen.",open:"Sie treffen jemanden beim Schnuppern. Schreiben Sie zwei verschiedene Fragen, um die Person kennenzulernen.",sample:"Tu habites où ? Quelles langues parles-tu ?",criteria:["Zwei verschiedene Fragen stehen da.","Beide Fragen sind verständlich.","Fragezeichen und Wortfolge passen."]},
{id:2,title:"Über mich sprechen",subtitle:"Kurz und verständlich etwas über sich erzählen",lead:"Sie nennen mehrere passende persönliche Informationen in einfachen französischen Sätzen.",tip:"Ein guter Vorstellungstext enthält verschiedene Informationen, nicht viermal dieselbe.",example:"Je m’appelle Lina. Je parle allemand. Je suis à la BFF.",v:[6,7,8,9,10,11],
situations:[
["«Je suis à la BFF. Je parle allemand.» Welche zwei Informationen erhalten Sie?",null,["Schule und Sprache","Alter und Wohnort","Hobby und Lehrstelle"],0,"Die Person nennt ihre Schule und ihre Sprache.","Suchen Sie die Wörter «BFF» und «allemand»."],
["«Je m’appelle Ali. J’habite à Berne.» Welche Information FEHLT noch?",null,["Name","Wohnort","Alter"],2,"Name und Wohnort sind bekannt, das Alter fehlt.","Welche der drei Informationen wurde nicht genannt?"],
["In welchem Satz spricht die Person über Freizeit?",null,["Je suis à la BFF.","Dans mon temps libre, je joue au foot.","J’habite à Berne."],1,"«Dans mon temps libre» leitet die Freizeit ein.","«Temps libre» bedeutet Freizeit."],
["Welche Reihenfolge ergibt eine sinnvolle kurze Vorstellung?",null,["Name → Alter → Schule","Schule → Schule → Schule","Name → Name → Name"],0,"Verschiedene Informationen machen eine Vorstellung nützlich.","Wählen Sie die abwechslungsreiche Folge."],
["Auf «Tu habites où ?» passt welche Antwort?",null,["J’ai seize ans.","J’habite à Berne.","Je parle allemand."],1,"Die Antwort nennt einen Wohnort.","Gesucht ist ein Ort." ] ],
order:["Je","suis","à","la","BFF","."],target:"Je suis à la BFF.",writePrompt:"Ordnen Sie den Satz über Ihre Schule.",open:"Schreiben Sie drei verschiedene Sätze über sich. Nennen Sie Name, Schule und eine zusätzliche persönliche Information.",sample:"Je m’appelle Sara. Je suis à la BFF. Je parle allemand.",criteria:["Drei vollständige, verschiedene Informationen stehen da.","Ein Satz nennt den Namen, einer die Schule.","Die Sätze sind auf Französisch verständlich."]},
{id:3,title:"Beruf und Ziele",subtitle:"Wunsch und Begründung unterscheiden",lead:"Sie können Ihren eigenen Berufswunsch formulieren und mit einem einfachen Grund erklären.",tip:"«Je m’intéresse au métier de …» ist Interesse. «Je voudrais devenir …» ist ein Wunsch.",example:"Je voudrais devenir cuisinière parce que j’aime cuisiner. (j’aime cuisiner = ich koche gern)",v:[12,13,14,15],
situations:[
["«Je m’intéresse au métier de fleuriste.» Was sagt die Person?",null,["Sie hat die Lehrstelle sicher.","Sie interessiert sich für einen Beruf.","Sie hat eine Schnupperlehre gemacht."],1,"Interesse und feste Zusage sind nicht dasselbe.","Achten Sie auf «m’intéresse»."],
["«Je voudrais devenir mécanicien parce que j’aime les voitures.» Was steht nach «parce que»?",null,["Eine Erklärung","Eine Frage nach dem Namen","Eine Schnupperlehre"],0,"Nach «parce que» folgt eine Begründung.","«Parce que» bedeutet weil."],
["Welche Aussage nennt eindeutig einen Berufswunsch?",null,["une place d’apprentissage","J’ai fait un stage.","Je voudrais devenir assistant dentaire."],2,"«Je voudrais devenir» drückt aus, was jemand werden möchte.","Gesucht ist ein Wunsch für die Zukunft."],
["Sie möchten ausdrücken, dass Sie Menschen helfen wollen. Welche Wendung passt?",null,["aider les gens","un stage","et toi ?"],0,"«Aider les gens» bedeutet Menschen helfen.","Wählen Sie die passende Tätigkeit."],
["Welche zwei Teile gehören zu einer nachvollziehbaren Begründung des Berufswunsches?",null,["Nur ein Berufsname","Berufswunsch und ein Grund","Nur der Wohnort"],1,"Wer eine Begründung gibt, nennt einen Wunsch und ein Warum.","Was möchte ich werden – und weshalb?" ] ],
order:["Je","voudrais","devenir","…"],target:"Je voudrais devenir …",writePrompt:"Ordnen Sie die Wendung für den Berufswunsch.",open:"Ein Betrieb fragt, für welchen Beruf Sie sich interessieren. Schreiben Sie Ihren eigenen Berufswunsch und einen passenden Grund mit «parce que».",sample:"Je voudrais devenir assistante dentaire parce que je voudrais aider les gens.",criteria:["Ein konkreter Berufswunsch steht da.","«parce que» leitet einen passenden Grund ein.","Die Aussage ist als französischer Satz verständlich."]},
{id:4,title:"Schnupperlehre",subtitle:"Beobachten und mithelfen richtig unterscheiden",lead:"Sie können kurz von einer Schnupperlehre erzählen und eigene Tätigkeiten beschreiben.",tip:"«J’ai observé …» = ich habe beobachtet. «J’ai aidé à …» = ich habe mitgeholfen.",example:"J’ai fait un stage. J’ai aidé à préparer le matériel. (préparer le matériel = Material vorbereiten)",v:[16,17,18,19],
situations:[
["Welche Person war nachweislich AKTIV beteiligt?",null,["«J’ai observé les employés.»","«J’ai aidé à préparer le matériel.»","«Je voudrais devenir …»"],1,"«J’ai aidé à» beschreibt eine Mithilfe.","Beobachten und Mithelfen sind verschieden."],
["«J’ai fait un stage. J’ai observé les enfants.» Was wissen wir sicher?",null,["Die Person hat Kinder beobachtet.","Sie hat eine Lehrstelle bekommen.","Sie hat mit den Kindern gespielt."],0,"Nur das Beobachten wird gesagt.","Keine Details dazuerfinden."],
["Welcher Ausdruck steht für die Schnupperlehre selbst?",null,["une place d’apprentissage","un stage","fiable"],1,"«Un stage» bedeutet eine Schnupperlehre.","Nicht mit der Lehrstelle verwechseln."],
["«J’ai aidé à ranger les affaires.» Welche deutsche Aussage passt?",null,["Ich möchte Dinge einräumen.","Ich habe beim Aufräumen geholfen.","Ich habe nur zugeschaut."],1,"«J’ai aidé à» bedeutet mitgeholfen.","«ranger les affaires» = Dinge versorgen."],
["Welche Fortsetzung kann eine Tätigkeit aus einer Schnupperlehre beschreiben?",null,["J’ai observé les clients.","Comment tu t’appelles ?","Quelles langues parles-tu ?"],0,"Beobachten ist eine Tätigkeit, die man berichten kann.","Wählen Sie einen Satz über die Vergangenheit." ] ],
order:["J’ai","fait","un","stage","."],target:"J’ai fait un stage.",writePrompt:"Ordnen Sie den Satz: Ich habe eine Schnupperlehre gemacht.",open:"Erzählen Sie in zwei kurzen Sätzen von einer Schnupperlehre. Schreiben Sie, dass Sie eine gemacht haben, und beschreiben Sie etwas, das Sie beobachtet oder wobei Sie geholfen haben.",sample:"J’ai fait un stage. J’ai observé les enfants.",criteria:["Die Schnupperlehre wird genannt.","Eine Beobachtung oder eine Mithilfe wird beschrieben.","Die beiden Aussagen sind verständlich."]},
{id:5,title:"Stärken ausdrücken",subtitle:"Eigenschaften treffend benennen",lead:"Sie erkennen den Unterschied zwischen zuverlässig, geduldig und sorgfältig und beschreiben, wie Sie arbeiten.",tip:"Denken Sie an konkrete Situationen: zuverlässig = Abmachungen halten; geduldig = ruhig warten; sorgfältig = genau arbeiten.",example:"Je suis soigneuse. Je travaille bien en équipe.",v:[20,21,22,23],
situations:[
["Ein Mensch überprüft seine Arbeit sehr genau. Welche Stärke passt?",null,["patient / patiente","soigneux / soigneuse","fiable"],1,"Genau arbeiten bedeutet sorgfältig arbeiten.","Gesucht ist nicht geduldig."],
["Eine Person kommt immer wie vereinbart. Welche Stärke passt?",null,["fiable","soigneux / soigneuse","un stage"],0,"Abmachungen einhalten ist zuverlässig.","Denken Sie an Verlässlichkeit."],
["Eine Person bleibt ruhig, wenn etwas länger dauert. Welche Stärke passt?",null,["fiable","patient / patiente","soigneux / soigneuse"],1,"Hier geht es um Geduld.","Warten können, ohne unruhig zu werden."],
["«Je travaille bien en équipe.» Was betont die Person?",null,["Einzelarbeit","Zusammenarbeit","Wohnort"],1,"Die Person arbeitet gut mit anderen.","«Équipe» bedeutet Team."],
["Welche Kombination beschreibt eine sorgfältige Person, die gut mit anderen arbeitet?",null,["soigneuse + Je travaille bien en équipe.","fiable + J’ai fait un stage.","patiente + Tu habites où ?"],0,"Es werden eine Stärke und die Teamarbeit kombiniert.","Gesucht sind genau zwei passende Aussagen." ] ],
order:["Je","travaille","bien","en","équipe","."],target:"Je travaille bien en équipe.",writePrompt:"Ordnen Sie den Satz über Zusammenarbeit.",open:"Ein Team sucht Verstärkung. Nennen Sie zwei verschiedene Stärken von sich. Schreiben Sie dazu einen dritten Satz über die Zusammenarbeit.",sample:"Je suis fiable et patiente. Je travaille bien en équipe.",criteria:["Zwei sinnvolle Stärken sind genannt.","Ein Satz sagt etwas über Teamarbeit.","Die Sätze sind verständlich."]},
{id:6,title:"Sätze verbinden",subtitle:"Reagieren, nachfragen und Gründe nennen",lead:"Sie verbinden Aussagen sinnvoll mit et, mais und parce que und können mit «Et toi ?» zurückfragen.",tip:"et verbindet Gleichartiges, mais zeigt einen Gegensatz, parce que nennt einen Grund und Et toi ? fragt zurück.",example:"Je parle allemand et français. Et toi ?",v:[24,25,26,27],
situations:[
["«J’aime ce métier ___ je voudrais aider les gens.» Was zeigt die Lücke?",null,["Einen Grund: parce que","Einen Gegensatz: mais","Eine Rückfrage: Et toi ?"],0,"Das zweite erklärt das erste.","Ein Grund folgt auf «weil»."],
["«Je suis patiente ___ soigneuse.» Welche Verbindung ist sinnvoll?",null,["mais","et","Parce que"],1,"Die Eigenschaften werden aufgezählt.","Beides stimmt gleichzeitig."],
["«Je parle allemand. Et toi ?» Was macht die Person?",null,["Sie erzählt von einem Praktikum.","Sie stellt die Frage zurück.","Sie nennt einen Beruf."],1,"Die andere Person soll ebenfalls antworten.","«Et toi ?» = und du?"],
["Welche Verbindung zeigt einen Gegensatz?",null,["mais","et","parce que"],0,"«Mais» bedeutet aber.","Nicht eine Aufzählung, nicht einen Grund."],
["«Je suis soigneuse ___ je fais parfois des erreurs.» (parfois = manchmal; erreurs = Fehler) Welche Verbindung passt?",null,["et","mais","Et toi ?"],1,"Der zweite Teil steht im Gegensatz zum ersten.","Wählen Sie «aber»." ] ],
order:["Et","toi","?"],target:"Et toi ?",writePrompt:"Ordnen Sie eine kurze Rückfrage.",open:"Schreiben Sie drei kurze französische Aussagen: eine mit «et», eine mit «parce que» und eine Rückfrage mit «Et toi ?».",sample:"Je suis fiable et soigneuse. Je voudrais devenir infirmière parce que je voudrais aider les gens. Et toi ?",criteria:["«et» verbindet zwei passende Elemente.","«parce que» leitet einen nachvollziehbaren Grund ein.","«Et toi ?» wird sinnvoll als Rückfrage verwendet."]}
];
const VOC=[
["Comment tu t’appelles ?","Wie heisst du?",1,["Comment t'appelles tu ?"]],
["Tu habites où ?","Wo wohnst du?",1,["Ou habites-tu ?","Où habites-tu ?"]],
["Quels sont tes loisirs ?","Was sind deine Hobbys?",1,[]],
["Quel métier veux-tu apprendre ?","Welchen Beruf möchtest du lernen?",1,[]],
["Pourquoi ?","Warum?",1,[]],
["Quelles langues parles-tu ?","Welche Sprachen sprichst du?",1,[]],
["Je m’appelle …","Ich heisse …",2,[]],
["J’ai seize ans.","Ich bin sechzehn Jahre alt.",2,[]],
["J’habite à Berne.","Ich wohne in Bern.",2,[]],
["Dans mon temps libre, …","In meiner Freizeit …",2,[]],
["Je parle allemand.","Ich spreche Deutsch.",2,[]],
["Je suis à la BFF.","Ich bin an der BFF.",2,[]],
["Je voudrais devenir …","Ich möchte … werden.",3,[]],
["Je m’intéresse au métier de …","Ich interessiere mich für den Beruf …",3,[]],
["une place d’apprentissage","eine Lehrstelle",3,[]],
["aider les gens","Menschen helfen",3,[]],
["un stage","eine Schnupperlehre",4,[]],
["J’ai fait un stage.","Ich habe eine Schnupperlehre gemacht.",4,[]],
["J’ai aidé à …","Ich habe mitgeholfen, …",4,[]],
["J’ai observé …","Ich habe … beobachtet.",4,[]],
["fiable","zuverlässig",5,[]],
["patient / patiente","geduldig",5,["patient","patiente"]],
["soigneux / soigneuse","sorgfältig",5,["soigneux","soigneuse"]],
["Je travaille bien en équipe.","Ich arbeite gut im Team.",5,[]],
["Et toi ?","Und du?",6,[]],
["parce que","weil",6,[]],
["mais","aber",6,[]],
["et","und",6,[]]
].map((x,id)=>({id,fr:x[0],de:x[1],goal:x[2],variants:x[3]}));
const COPY=JSON.stringify(VOC);
const DEFAULT={version:1,done:{},wrong:{},seen:{},recalls:{},sessions:{},simCount:0,simHistory:[],font:false};
function read(){try{let d=JSON.parse(localStorage.getItem(KEY)||"null");return d&&d.version===1?{...DEFAULT,...d}:structuredClone(DEFAULT)}catch{return JSON.parse(JSON.stringify(DEFAULT))}}
let state=read(),screen="start",queue=[],idx=0,attempts=0,feedback=null,selection=null,orderChoice=[],typed="",simAnswers={},simStarted=0,simResults=null,reviewSet=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function goalById(id){return THEMES.find(g=>g.id===id)}
function normalize(s){return String(s??"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[’‘`´]/g,"'").replace(/[…]/g," ").replace(/[^a-z0-9' ]/gi," ").replace(/\s+/g," ").trim()}
function spelling(s){return normalize(s).replace(/'/g," ")}
function dist(a,b){const m=Array.from({length:b.length+1},(_,j)=>j);for(let i=1;i<=a.length;i++){let prev=m[0];m[0]=i;for(let j=1;j<=b.length;j++){const old=m[j];m[j]=Math.min(m[j]+1,m[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old}}return m[b.length]}
function judge(candidate,correct,variants=[]){
let raw=String(candidate||"").trim();if(!raw)return {ok:false,near:false};
let checks=[correct,...variants];for(let a of checks){if(normalize(raw)===normalize(a))return {ok:true,near:spelling(raw)!==spelling(a) || raw.replace(/[’]/g,"'")!==a.replace(/[’]/g,"'")}} 
let got=spelling(raw).split(" "),target=checks.map(v=>spelling(v).split(" "));
for(let want of target){if(got.length!==want.length)continue;let corrections=0;let ok=want.every((w,i)=>{if(w===got[i])return true;if(w.length<5||got[i].length<4||w.slice(0,2)!==got[i].slice(0,2)||dist(w,got[i])!==1)return false;corrections++;return true});if(ok&&corrections<=2)return {ok:true,near:true}}
return {ok:false,near:false}
}
function wordRec(id){let w=VOC[id];return {id:"v-"+id,goal:w.goal,type:"write",prompt:w.de,meta:"Schreiben Sie die französische Wendung aus dem Gedächtnis.",correct:w.fr,variants:w.variants,explain:"So steht die Wendung auf der verbindlichen Liste.",hint:"Lesen Sie die deutsche Bedeutung langsam. Versuchen Sie die französische Form zuerst ohne Hilfe."}}
function wordMeaning(id){let w=VOC[id];let other=VOC.filter(v=>v.goal===w.goal&&v.id!==w.id);let opts=[w.de,...other.slice(0,2).map(v=>v.de)];return {id:"m-"+id,goal:w.goal,type:"choice",prompt:w.fr,meta:"Welche deutsche Bedeutung passt?",options:opts,correct:0,explain:w.fr+" bedeutet: "+w.de,hint:"Überlegen Sie, worum es in der Wendung geht."}}
function scenario(goal,i){const s=goalById(goal).situations[i];return {id:"s-"+goal+"-"+i,goal,type:"choice",prompt:s[0],meta:"Wählen Sie die passende Antwort.",options:s[2],correct:s[3],explain:s[4],hint:s[5]}}
function arrange(goal){let m=goalById(goal);return {id:"o-"+goal,goal,type:"order",prompt:m.writePrompt,meta:"Klicken Sie die Teile in der richtigen Reihenfolge an.",tokens:m.order,correct:m.target,hint:m.tip,explain:"Die richtige Reihenfolge lautet:"}}
function openTask(goal){const m=goalById(goal);return{id:"f-"+goal,goal,type:"open",prompt:m.open,meta:"Schreiben Sie auf Französisch. Sie dürfen passende eigene Wörter verwenden.",correct:m.sample,criteria:m.criteria,hint:m.tip,explain:"Eine mögliche Lösung:"}}
function shuffle(arr,seed=0){let a=arr.slice();let s=(seed*1664525+1013904223)>>>0;for(let i=a.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;let j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function training(goal){let m=goalById(goal);let ids=m.v;const q=[scenario(goal,0),wordMeaning(ids[0]),wordRec(ids[1]),scenario(goal,1),wordRec(ids[2]),arrange(goal),scenario(goal,2),wordMeaning(ids[Math.min(3,ids.length-1)]),wordRec(ids[ids.length-1]),scenario(goal,3),openTask(goal),scenario(goal,4)];return q}
function diagnostic(){return THEMES.flatMap((m,k)=>[scenario(m.id,(k+2)%5),wordRec(m.v[Math.min(k%m.v.length,m.v.length-1)])])}
function mixed(){const pool=THEMES.flatMap(m=>[scenario(m.id,3),scenario(m.id,4),wordRec(m.v[0]),wordRec(m.v[m.v.length-1]),arrange(m.id)]);return shuffle(pool,Date.now()%99991).slice(0,12)}
function simulation(){
const used=[1,2,3,4,8,9,10,11,14,15,17,19,21,22,24,25];const seed=state.simCount+1;
let ids=shuffle(used,seed).slice(0,12);
let ch=THEMES.map((m,k)=>scenario(m.id,(seed+k+1)%5));
let op=THEMES.map(m=>openTask(m.id));
return {questions:[...ids.map(wordRec),...ch,...op],types:["write","choice","open"]};
}
function progress(){
let answered=Object.values(state.done).filter(x=>x.ok).length;let mastered=THEMES.map(m=>training(m.id).filter(q=>state.done[q.id]?.ok).length);
let uncertain=Object.keys(state.wrong).filter(id=>state.wrong[id]&&!(state.done[id]?.ok)).length;
return {answered,mastered,uncertain,percent:Math.round(mastered.reduce((a,b)=>a+b,0)/72*100)};
}
function iconLabel(id){return goalById(id)?.title||""}
const NAV=[["start","Übersicht","⌂"],["check","Standortcheck","?"],
...THEMES.map(g=>["ziel-"+g.id,g.title,String(g.id)]),
["woerter","28 Wendungen","W"],["wiederholen","Nochmals üben","↻"],["probe","Generalprobe","✓"]];
function navRender(){
$("#sideNav").innerHTML=NAV.map(([id,label,sym])=>`<button type="button" data-route="${id}" class="${screen===id?"active":""}" ${screen===id?'aria-current="page"':""}><span class="num">${esc(sym)}</span>${esc(label)}</button>`).join("");
}
function go(where){if(!NAV.some(x=>x[0]===where))where="start";if(location.hash.slice(1)!==where){location.hash=where}else{screen=where;render()}window.scrollTo({top:0,behavior:"instant"})}
function headline(kicker,title,description){return `<div class="section-head"><span class="kicker">${esc(kicker)}</span><h1 style="font-size:clamp(28px,3.5vw,42px);margin:7px 0 12px">${esc(title)}</h1><p>${esc(description)}</p></div>`}
function routeButton(id,label,klass="secondary"){return `<button class="btn ${klass}" data-route="${id}">${esc(label)}</button>`}
function dashboard(){
let p=progress();return `<section class="hero"><span class="kicker">PRÜFUNGSVORBEREITUNG · WOCHE 43</span><h1>Gut vorbereitet in die Lernkontrolle.</h1><p>Sie üben die 28 verbindlichen Wörter und Wendungen und wenden sie in echten Situationen an. Sie sehen sofort, was schon klappt und was Sie nochmals üben sollten.</p><div class="chips"><span class="chip">6 Lernziele</span><span class="chip">28 verbindliche Einträge</span><span class="chip">5–25 Minuten pro Runde</span><span class="chip">Alle Aufgaben neu</span></div></section>
<section class="surface"><div class="phasebar"><div><span class="eyebrow">Ihr Lernstand</span><h2>Wo stehen Sie gerade?</h2></div><div><span class="big-stat">${p.percent}%</span><div class="stat-caption">Trainingsaufgaben bereits sicher gelöst</div></div></div><div class="progress"><span style="width:${p.percent}%"></span></div><p class="muted small">Der Fortschritt entsteht durch Üben, nicht durch blosses Anklicken. Er ist keine Notenprognose.</p><div class="actions">${routeButton("check","Standortcheck starten","primary")}${routeButton("wiederholen",p.uncertain?`${p.uncertain} offene Fehler üben`:"Wiederholen")}</div></section>
<div class="section-head"><span class="eyebrow">Ihr Weg zur Lernkontrolle</span><h2>So lernen Sie am effizientesten</h2><p>Am besten verteilen Sie das Training auf mehrere kurze Runden. Rufen Sie Wendungen möglichst oft zuerst aus dem Gedächtnis ab.</p></div>
<div class="grid-3"><button class="tile" data-route="check"><span class="badge">1 · 5–8 Min.</span><h3>Erst herausfinden</h3><p>Zwölf kurze Aufgaben zeigen, welches Lernziel Sie schon gut können.</p><span class="arrow">Standortcheck öffnen →</span></button><button class="tile" data-route="ziel-1"><span class="badge">2 · Je 10–15 Min.</span><h3>Gezielt trainieren</h3><p>Alle sechs Lernziele mit Beispielen, neuen Aufgaben und hilfreichem Feedback.</p><span class="arrow">Lernziele öffnen →</span></button><button class="tile" data-route="probe"><span class="badge">3 · 35–45 Min.</span><h3>Prüfung proben</h3><p>Eine neue Generalprobe ohne Hilfen während der Bearbeitung.</p><span class="arrow">Generalprobe öffnen →</span></button></div>
<section class="surface" style="margin-top:22px"><div class="phasebar"><div><span class="eyebrow">Die sechs Lernziele</span><h2>Woran möchten Sie arbeiten?</h2></div><span class="pill">Wählen Sie selbst</span></div><div class="grid-2">${THEMES.map(m=>{let n=training(m.id).filter(q=>state.done[q.id]?.ok).length;return `<button class="tile" data-route="ziel-${m.id}"><span class="badge">Lernziel ${m.id}</span><h3>${esc(m.title)}</h3><span class="muted small">${esc(m.subtitle)}</span><div class="progress" style="margin-top:auto"><span style="width:${Math.round(n/12*100)}%"></span></div><span class="tiny-progress">${n}/12 sicher bearbeitet</span></button>`}).join("")}</div></section>
<section class="surface mint"><div class="two-column"><div><span class="eyebrow">5 Minuten Zeit?</span><h2>Auch eine kleine Runde lohnt sich.</h2><p>Üben Sie ein paar Wörter ohne Vorlage. Anschliessend wiederholen Sie möglichst jene, die noch nicht sicher sitzen.</p><div class="actions">${routeButton("woerter","Wortschatzkarten öffnen","primary")}${routeButton("wiederholen","Meine Fehler wiederholen")}</div></div><div class="note"><b>So erhalten Sie Feedback</b><p>Ein kleiner Tippfehler zählt nicht einfach als falsch. Sie sehen die richtige Schreibweise trotzdem. Bei freien Sätzen gibt es einen Mustertext und eine Checkliste – keine irreführende automatische Note.</p></div></div></section>`}
function introGoal(goal){
const m=goalById(goal);return `<section class="surface mint"><span class="eyebrow">Bevor Sie starten</span><h2>Das müssen Sie können</h2><p>${esc(m.lead)}</p><div class="note"><b>Merken Sie sich:</b><p>${esc(m.tip)}</p></div><p class="small muted">Beispiel (nicht dieselbe Aufgabe wie in der Prüfung)</p><p class="fr-text">${esc(m.example)}</p></section>`}
function getSession(key,make){let old=state.sessions[key];if(old?.items?.length)return old;let items=make().map(q=>q.id);state.sessions[key]={items,step:0};save();return state.sessions[key]}
function questionsById(id){if(id.startsWith("v-"))return wordRec(+id.slice(2));if(id.startsWith("m-"))return wordMeaning(+id.slice(2));if(id.startsWith("s-")){let a=id.split("-");return scenario(+a[1],+a[2])}if(id.startsWith("o-"))return arrange(+id.slice(2));if(id.startsWith("f-"))return openTask(+id.slice(2));return null}
function renderGoal(goal){let m=goalById(goal);if(!m)return dashboard();let session=getSession("g"+goal,()=>training(goal));let list=session.items.map(questionsById).filter(Boolean);let n=training(goal).filter(q=>state.done[q.id]?.ok).length;return headline("LERNZIEL "+goal,m.title,m.subtitle)+introGoal(goal)+`<section class="surface"><div class="phasebar"><div><span class="eyebrow">12 kleine Übungsschritte</span><h2>Jetzt wirklich üben</h2></div><b>${n}/12 sicher</b></div><div class="progress"><span style="width:${Math.round(n/12*100)}%"></span></div><p class="muted small">Sie dürfen Hilfen öffnen und Antworten verbessern. Nach einer falschen Antwort erhalten Sie eine gezielte Erklärung.</p><div id="exercise"></div></section><section class="surface sm"><h3>Wenn Sie fertig sind</h3><p>Schliessen Sie diese Runde ab, wiederholen Sie Unsicheres am nächsten Tag und versuchen Sie die Generalprobe erst danach.</p><div class="actions">${routeButton("ziel-"+(goal%6+1),"Nächstes Lernziel")}${routeButton("wiederholen","Nochmals üben")}</div></section>`}
function renderCheck(){return headline("STARTCHECK · CA. 8 MINUTEN","Was klappt schon?","Ohne Lernnote. Sie erkennen, welche Wendungen und Situationen Sie noch üben sollten.")+`<section class="surface"><p>Versuchen Sie jede Antwort zuerst ohne Hilfe. Sie erhalten direkt eine Rückmeldung. Das ist ein Training und keine benotete Prüfung.</p><div id="exercise"></div></section>`}
function renderMix(){let p=progress();return headline("FEHLERTRAINER","Nochmals üben, bis es sitzt.","Fehler sind eine nützliche Information: Hier lernen Sie gezielt weiter, statt bekannte Aufgaben unnötig oft zu wiederholen.")+`<section class="surface"><h2>${p.uncertain?"Ihre noch offenen Aufgaben":"Ihr Wiederholungstraining"}</h2><p>${p.uncertain?`Sie haben ${p.uncertain} noch nicht sicher gelöste Aufgaben. Bearbeiten Sie diese nochmals.`:"Im Moment haben Sie keine offenen Fehler. Üben Sie gemischt, um die Wendungen aktiv abzurufen."}</p><div class="actions"><button class="btn primary" data-action="review-start">${p.uncertain?"Fehler gezielt trainieren":"Gemischte Runde starten"}</button>${routeButton("woerter","28 Wendungen wiederholen")}</div><div id="exercise"></div></section>`}
function renderWords(){let learned=VOC.filter(w=>state.recalls[w.id]==="secure").length;return headline("WORTSCHATZTRAINER","28 Wörter und Wendungen","Erinnern Sie sich zuerst selbst an die französische Form. Zeigen Sie erst danach die Lösung. Markieren Sie ehrlich, was schon sitzt.")+`<section class="surface"><div class="phasebar"><div><span class="eyebrow">Aktiv erinnern</span><h2>${learned} von 28 sicher</h2></div><span class="pill">Ohne Ratefragen</span></div><div class="progress"><span style="width:${Math.round(learned/28*100)}%"></span></div><div id="wordcard"></div></section><details class="surface sm helper"><summary>Alle 28 verbindlichen Einträge ansehen</summary><div class="wordlist">${VOC.map(w=>`<div class="wordrow"><b>${String(w.id+1).padStart(2,"0")}</b><span><strong>${esc(w.fr)}</strong><br><span class="gloss">${esc(w.de)}</span></span></div>`).join("")}</div></details>`}
function renderProbe(){return headline("GENERALPROBE · 35–45 MINUTEN","Wie bereit sind Sie für den Test?","Eine neue Probe mit Wortschatz, Verstehen und sechs Anwendungsaufgaben. Keine identischen Prüfungsfragen.")+`<section class="surface"><div class="grid-3"><div><span class="eyebrow">Teil A</span><h3>Schreiben</h3><strong>24 Punkte</strong></div><div><span class="eyebrow">Teil B</span><h3>Verstehen</h3><strong>12 Punkte</strong></div><div><span class="eyebrow">Teil C</span><h3>Anwenden</h3><strong>24 Punkte</strong></div></div><hr class="hr"><p>Während der Generalprobe gibt es keine Hilfen und keine sofortigen Lösungen. Am Ende werden eindeutige Antworten automatisch korrigiert; bei eigenen Sätzen beurteilen Sie sich anhand transparenter Kriterien selbst.</p><div id="simbox"></div></section>`}
function promptBlock(q,n,total){
let qnum=`<div class="phasebar"><span class="eyebrow">Aufgabe ${n+1} von ${total}</span><span class="pill">Lernziel ${q.goal}</span></div><div class="progress" style="margin:11px 0"><span style="width:${Math.round((n)/total*100)}%"></span></div>`;
let body=q.type==="choice"?`<div class="options" role="group" aria-label="Antworten">${q.options.map((c,i)=>`<button type="button" class="option ${selection===i?"selected":""}" data-option="${i}" aria-pressed="${selection===i}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${esc(c)}</span></button>`).join("")}</div>`:
q.type==="order"?`<div class="note small"><p>Klicken Sie die Teile in der richtigen Reihenfolge. Klicken Sie auf «Zurücksetzen», um neu zu beginnen.</p></div><div class="surface sm" style="margin-top:12px"><div class="small muted">Ihre Reihenfolge:</div><div class="chips">${orderChoice.length?orderChoice.map((v,i)=>`<button class="btn secondary" style="min-height:40px;padding:6px 10px" data-order-remove="${i}">${esc(v.v)} ×</button>`).join(""):"Noch keine Teile gewählt"}</div></div><div class="options">${q.tokens.map((v,i)=>`<button class="option" data-token="${i}" ${orderChoice.some(x=>x.i===i)?"disabled":""} style="min-height:45px">${esc(v)}</button>`).join("")}</div><button class="btn ghost" data-action="clear-order">Zurücksetzen</button>`:
`<label for="answerField" class="small muted">${q.type==="open"?"Ihre eigenen französischen Sätze":"Ihre französische Antwort"}</label><textarea id="answerField" class="input-answer ${q.type==="open"?"wide":""}" rows="${q.type==="open"?3:1}" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="${q.type==="open"?"Schreiben Sie Ihre Sätze hier …":"Hier auf Französisch schreiben …"}">${esc(typed)}</textarea>`;
return `${qnum}<div class="question">${esc(q.prompt)}</div><div class="gloss">${esc(q.meta)}</div>${body}`
}
function explanation(q){
return `<strong class="ref">${esc(q.type==="choice"?q.options[q.correct]:q.correct)}</strong><p class="small">${esc(q.explain)}</p>`
}
function currentQ(){return queue[idx]}
function renderExercise(){
const mount=$("#exercise");if(!mount)return; if(!queue.length){mount.innerHTML=`<p class="note">Wählen Sie eine Übungsrunde.</p>`;return}
if(idx>=queue.length){let completed=queue.filter(q=>state.done[q.id]?.ok).length;mount.innerHTML=`<div class="surface mint" style="margin-top:15px"><span class="eyebrow">Runde abgeschlossen</span><h2>Gut gearbeitet!</h2><p>${completed} von ${queue.length} Aufgaben dieser Runde sind als sicher bearbeitet markiert. Freie Texte werden anhand Ihrer eigenen Einschätzung erfasst.</p><p>Am meisten bringt es, wenn Sie heute noch zwei unsichere Antworten wiederholen und morgen kurz wieder einsteigen.</p><div class="actions"><button class="btn primary" data-action="restart-session">Neue Runde</button>${routeButton("wiederholen","Fehler üben")}${routeButton("start","Zur Übersicht")}</div></div>`;return}
let q=queue[idx];let locked=feedback?.final||false;let content=promptBlock(q,idx,queue.length);
if(q.type!=="open"&&!locked&&attempts>=1)content+=`<details class="helper" open><summary>Hilfestellung</summary><p>${esc(q.hint)}</p></details>`;
else if(q.type!=="open")content+=`<details class="helper"><summary>Eine Hilfe ansehen</summary><p>${esc(q.hint)}</p></details>`;
if(q.type==="open"){content+=`<details class="helper"><summary>Hilfe und Satzanfang</summary><p>${esc(q.hint)}</p></details>`}
if(feedback){let cls=feedback.good?"":"warn";if(!feedback.good&&feedback.final)cls="bad";content+=`<div class="feedback ${cls}" role="status"><h3>${esc(feedback.title)}</h3><p>${esc(feedback.text)}</p>${feedback.showAnswer?explanation(q):""}${q.type==="open"&&feedback.showAnswer?`<h3 style="margin-top:20px">Prüfen Sie Ihre eigene Antwort</h3><ul>${q.criteria.map(c=>`<li>${esc(c)}</li>`).join("")}</ul><p class="small">Andere passende Formulierungen sind ebenfalls möglich.</p>`:""}</div>`}
if(q.type==="open" && feedback?.showAnswer){
content+=`<div class="actions"><button class="btn primary" data-action="self-yes">Das kann ich bereits</button><button class="btn secondary" data-action="self-no">Das übe ich nochmals</button></div>`;
}else if(locked){content+=`<div class="actions"><button class="btn primary" data-action="next">Weiter →</button></div>`}
else{content+=`<div class="actions"><button class="btn primary" data-action="check-answer">${attempts?"Antwort nochmals prüfen":"Antwort prüfen"}</button>${attempts?'<button class="btn secondary" data-action="show-answer">Lösung ansehen</button>':""}</div>`}
mount.innerHTML=`<div style="margin-top:22px">${content}</div>`;if(q.type==="choice"&&selection!==null)mount.querySelectorAll("[data-option]").forEach(b=>b.classList.toggle("selected",+b.dataset.option===selection));
}
function begin(items){queue=items;idx=0;attempts=0;feedback=null;typed="";selection=null;orderChoice=[];renderExercise()}
function resetCurrent(){attempts=0;feedback=null;typed="";selection=null;orderChoice=[]}
function nextQ(){idx++;resetCurrent();renderExercise();$("#exercise")?.scrollIntoView({block:"start",behavior:"smooth"})}
function mark(q,ok,assisted=false){state.seen[q.id]=(state.seen[q.id]||0)+1;if(ok&&!assisted){state.done[q.id]={ok:true,at:Date.now()};delete state.wrong[q.id]}else if(ok&&assisted){state.done[q.id]={ok:false,assisted:true,at:Date.now()};state.wrong[q.id]=true}else{state.wrong[q.id]=true}save()}
function checkAnswer(){
let q=currentQ();if(!q||feedback?.final)return;
if(q.type==="choice"&&selection===null){announce("Wählen Sie zuerst eine Antwort.");return}
if(q.type==="write"||q.type==="open"){typed=$("#answerField")?.value?.trim()||"";if(!typed){announce("Schreiben Sie zuerst eine Antwort.");return}}
if(q.type==="order"&&!orderChoice.length){announce("Klicken Sie zuerst auf die Wörter.");return}
if(q.type==="open"){
feedback={good:true,final:false,showAnswer:true,title:"Vergleichen und selbst beurteilen",text:"Bei eigenen Sätzen kann die Webseite nicht zuverlässig alle richtigen Varianten erkennen. Vergleichen Sie Ihre Antwort mit dem Beispiel und prüfen Sie die drei Punkte."};renderExercise();return
}
let candidate=q.type==="choice"?selection:q.type==="order"?orderChoice.map(x=>x.v).join(" "):typed;
let result=q.type==="choice"?{ok:candidate===q.correct,near:false}:judge(candidate,q.correct,q.variants);
attempts++;
if(result.ok){const helped=attempts>1;mark(q,true,helped);feedback={good:true,final:true,showAnswer:true,title:helped?"Jetzt richtig – später nochmals ohne Hilfe":result.near?"Inhaltlich richtig – Schreibweise ansehen":"Richtig!",text:helped?"Sie haben die Antwort im zweiten Versuch gefunden. Super! Sie bleibt zur Festigung im Wiederholungstrainer.":result.near?"Kleine Unterschiede wie Akzente oder Tippfehler wurden grosszügig berücksichtigt. Merken Sie sich die Schreibweise aus der Lösung.":"Gut! Das passt. Lesen Sie die korrekte Form nochmals aufmerksam."}}
else{mark(q,false);feedback={good:false,final:attempts>=2,showAnswer:attempts>=2,title:attempts>=2?"Hier lohnt sich nochmals Üben":"Noch nicht ganz",text:attempts>=2?"Schauen Sie sich die Lösung an. Diese Aufgabe erscheint im Fehlertrainer.":"Sie dürfen es nochmals versuchen. Öffnen Sie die Hilfe und denken Sie an die Bedeutung."}}
renderExercise()
}
function makeStarter(view){
if(view==="check"){begin(diagnostic());return}
if(view.startsWith("ziel-")){begin(training(+view.slice(5)));return}
}
let activeWord=0,wordFlipped=false;
function renderWordCard(){
const w=VOC[activeWord];let learned=VOC.filter(x=>state.recalls[x.id]==="secure").length;
const root=$("#wordcard");if(!root)return;
root.innerHTML=`<div class="phasebar" style="margin-top:20px"><span class="step-count">Karte ${activeWord+1} von 28 · Lernziel ${w.goal}</span><span class="badge ${state.recalls[w.id]==="secure"?"success":""}">${state.recalls[w.id]==="secure"?"Schon sicher":"Aus dem Gedächtnis"}</span></div><div class="cardface"><span>Wie heisst das auf Französisch?</span><div class="fr-text">${esc(w.de)}</div>${wordFlipped?`<div class="vocab-back"><strong>${esc(w.fr)}</strong></div>`:`<p class="muted small">Sagen oder schreiben Sie die Antwort zuerst selbst.</p>`}</div><div class="actions" style="justify-content:center">${wordFlipped?`<button class="btn primary" data-action="word-secure">Konnte ich</button><button class="btn secondary" data-action="word-weak">Nochmals üben</button>`:`<button class="btn primary" data-action="word-flip">Lösung anzeigen</button>`}</div><div class="actions" style="justify-content:space-between"><button class="btn ghost" data-action="word-prev" ${activeWord===0?"disabled":""}>← Zurück</button><button class="btn ghost" data-action="word-next">${activeWord===27?"Zurück zu Karte 1":"Nächste Karte →"}</button></div><div class="note small" style="margin-top:20px"><p><b>${learned} von 28 sicher.</b> «Konnte ich» nur anklicken, wenn Sie die Wendung vor der Lösung richtig wussten. Unsichere Karten wiederholen Sie später.</p></div>`;
}
function simScreen(){
const root=$("#simbox");if(!root)return;
let a=state.sessions.sim;
if(!a){root.innerHTML=`<div class="actions"><button class="btn primary" data-action="sim-start">Generalprobe starten</button></div><p class="small muted">Sie können jederzeit unterbrechen. Die Antworten werden nur auf diesem Gerät gespeichert.</p>${state.simHistory.length?`<p class="muted small">Letzte Probe: ${state.simHistory.at(-1).auto} von 36 automatisch prüfbaren Punkten · freie Sätze gesondert.</p>`:""}`;return}
if(a.finished){showSimResult(root,a);return}
const q=questionsById(a.items[a.step]);if(!q){root.innerHTML="Fehler beim Laden. Starten Sie die Generalprobe neu.";return}
const total=a.items.length;let body=q.type==="choice"?`<div class="options">${q.options.map((x,i)=>`<button class="option ${a.answers[a.step]===String(i)?"selected":""}" data-sim-choice="${i}">${esc(x)}</button>`).join("")}</div>`:`<label class="small" for="simAnswer">Ihre Antwort${q.type==="open"?" (eigene Sätze)":""}</label><textarea class="input-answer ${q.type==="open"?"wide":""}" rows="${q.type==="open"?4:2}" id="simAnswer" placeholder="Antwort auf Französisch …">${esc(a.answers[a.step]||"")}</textarea>`;
let phase=a.step<12?"A · Aus dem Gedächtnis":a.step<18?"B · Verstehen":"C · Anwenden";
root.innerHTML=`<div class="phasebar"><span class="eyebrow">${phase}</span><span class="pill">Aufgabe ${a.step+1} / ${total}</span></div><div class="progress" style="margin:14px 0"><span style="width:${Math.round((a.step)/total*100)}%"></span></div><h2>${esc(q.prompt)}</h2><p class="muted">${esc(q.meta)}</p>${body}<div class="actions"><button class="btn ghost" data-action="sim-prev" ${a.step===0?"disabled":""}>← Zurück</button><button class="btn primary" data-action="sim-next">${a.step===total-1?"Generalprobe auswerten":"Weiter →"}</button></div><p class="small muted">Keine Lösungen während der Bearbeitung. Die Zeit läuft seit dem Start im Hintergrund. Nehmen Sie sich für die gesamte Probe ungefähr 45 Minuten.</p>`;
}
function showSimResult(root,a){
let qs=a.items.map(questionsById);let automatic=0,automaticMax=36;
const records=qs.map((q,i)=>{
let val=a.answers[i]||"",correct=false,near=false;
if(q.type==="choice")correct=val!==""&&Number(val)===q.correct;
else if(q.type==="write"){let r=judge(val,q.correct,q.variants);correct=r.ok;near=r.near}
if(correct)automatic+=2;
return {q,val,correct,near,i};
});
let open=records.filter(r=>r.q.type==="open");let elapsed=Math.round(((a.completedAt||Date.now())-a.started)/60000);
root.innerHTML=`<span class="eyebrow">Generalprobe ausgewertet</span><h2>Ihr Ergebnis – und was Sie damit anfangen</h2><div class="grid-3"><div class="surface sm"><div class="big-stat">${automatic}/36</div><div class="stat-caption">Automatisch prüfbare Punkte</div></div><div class="surface sm"><div class="big-stat">24</div><div class="stat-caption">Punkte aus freien Sätzen noch selbst prüfen</div></div><div class="surface sm"><div class="big-stat">${elapsed}</div><div class="stat-caption">Minuten Bearbeitungszeit</div></div></div><p class="note">Diese Punktzahl ist <b>keine vollständige Prüfungsnote</b>. Die sechs freien Antworten können nicht zuverlässig automatisch benotet werden. Vergleichen Sie diese anhand der Checklisten.</p><h3>Freie Antworten überprüfen</h3>${open.map(r=>`<details class="helper"><summary>Lernziel ${r.q.goal} · ${esc(iconLabel(r.q.goal))}</summary><p><b>Auftrag:</b> ${esc(r.q.prompt)}</p><p><b>Ihre Antwort:</b> ${esc(r.val||"(leer)")}</p><p><b>Ein mögliches Beispiel:</b> ${esc(r.q.correct)}</p><ul>${r.q.criteria.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`).join("")}<h3>Alle korrigierbaren Antworten</h3>${records.filter(r=>r.q.type!=="open").map(r=>`<div class="reviewrow"><div><strong>${r.correct?"✓":"↻"} Aufgabe ${r.i+1}</strong><div class="small">${esc(r.q.prompt)}</div><div class="gloss">Ihre Antwort: ${esc(r.q.type==="choice"?r.q.options[Number(r.val)]||"–":r.val||"–")}<br>Richtig: ${esc(r.q.type==="choice"?r.q.options[r.q.correct]:r.q.correct)}</div></div><span class="badge ${r.correct?"success":"soon"}">${r.correct?"2/2":"0/2"}</span></div>`).join("")}<div class="actions"><button class="btn primary" data-action="sim-new">Neue Generalprobe</button>${routeButton("wiederholen","Gezielt weiterüben")}${routeButton("start","Zur Übersicht")}</div>`;
}
function simStart(){state.simCount++;let q=simulation().questions;state.sessions.sim={items:q.map(x=>x.id),step:0,answers:{},started:Date.now(),finished:false};save();simScreen()}
function announce(msg){$("#announce").textContent=msg}
function render(){
screen=decodeURIComponent(location.hash.slice(1))||"start";
if(!NAV.some(x=>x[0]===screen))screen="start";
navRender();$("#app").innerHTML=screen==="start"?dashboard():screen==="check"?renderCheck():screen.startsWith("ziel-")?renderGoal(+screen.slice(5)):screen==="woerter"?renderWords():screen==="wiederholen"?renderMix():screen==="probe"?renderProbe():dashboard();
if(screen==="check"){begin(diagnostic())}
else if(screen.startsWith("ziel-")){let id=+screen.slice(5),key="g"+id,session=state.sessions[key];queue=training(id);idx=session?Math.min(session.step||0,queue.length):0;resetCurrent();renderExercise()}
else if(screen==="woerter")renderWordCard();
else if(screen==="probe")simScreen();
else if(screen==="wiederholen"){queue=[];idx=0}
document.title=(screen==="start"?"Gut vorbereitet":screen.startsWith("ziel-")?iconLabel(+screen.slice(5)):"Lernkontrolle üben")+" · Franz Lernatelier";
}
document.addEventListener("click",e=>{
const btn=e.target.closest("button");if(!btn)return;
if(btn.dataset.route){go(btn.dataset.route);return}
const act=btn.dataset.action;
if(btn.dataset.option!=null){selection=+btn.dataset.option;renderExercise();return}
if(btn.dataset.token!=null){let i=+btn.dataset.token,q=currentQ();if(q&&!orderChoice.some(x=>x.i===i))orderChoice.push({i,v:q.tokens[i]});renderExercise();return}
if(btn.dataset.orderRemove!=null){orderChoice.splice(+btn.dataset.orderRemove,1);renderExercise();return}
if(btn.dataset.simChoice!=null){let a=state.sessions.sim;a.answers[a.step]=btn.dataset.simChoice;save();simScreen();return}
switch(act){
case"clear-order":orderChoice=[];renderExercise();break;
case"check-answer":checkAnswer();break;
case"show-answer":if(currentQ()){mark(currentQ(),false);feedback={good:false,final:true,showAnswer:true,title:"Lösung und Erklärung",text:"Nutzen Sie diese Lösung für einen neuen Versuch im Wiederholungstraining."};renderExercise()}break;
case"next":if(screen.startsWith("ziel-")){state.sessions["g"+(+screen.slice(5))].step=idx+1;save()}nextQ();break;
case"self-yes":mark(currentQ(),true);feedback={good:true,final:true,showAnswer:true,title:"Das sitzt!",text:"Gut. Versuchen Sie beim nächsten Mal, es wieder ohne Hilfe zu schreiben."};renderExercise();break;
case"self-no":mark(currentQ(),false);feedback={good:false,final:true,showAnswer:true,title:"Nochmals üben",text:"Kein Problem. Diese Aufgabe bleibt in Ihrem Wiederholungstraining."};renderExercise();break;
case"restart-session":if(screen.startsWith("ziel-")){let id=+screen.slice(5);state.sessions["g"+id].step=0;save();begin(training(id))}else if(screen==="check")begin(diagnostic());else if(screen==="wiederholen")begin(mixed());break;
case"review-start":{let missing=Object.keys(state.wrong).filter(id=>state.wrong[id]&&!state.done[id]?.ok).map(questionsById).filter(Boolean);begin(missing.length?shuffle(missing,Date.now()%10000):mixed());break}
case"word-flip":wordFlipped=true;renderWordCard();break;
case"word-secure":state.recalls[activeWord]="secure";save();activeWord=(activeWord+1)%28;wordFlipped=false;renderWordCard();break;
case"word-weak":state.recalls[activeWord]="practice";save();state.wrong["v-"+activeWord]=true;activeWord=(activeWord+1)%28;wordFlipped=false;renderWordCard();break;
case"word-next":activeWord=(activeWord+1)%28;wordFlipped=false;renderWordCard();break;
case"word-prev":activeWord=Math.max(0,activeWord-1);wordFlipped=false;renderWordCard();break;
case"sim-start":case"sim-new":simStart();break;
case"sim-prev":{let a=state.sessions.sim;let field=$("#simAnswer");if(field)a.answers[a.step]=field.value;a.step=Math.max(0,a.step-1);save();simScreen();break}
case"sim-next":{let a=state.sessions.sim;let field=$("#simAnswer");if(field)a.answers[a.step]=field.value;if(a.step===a.items.length-1){a.finished=true;a.completedAt=Date.now();let total=a.items.map((id,i)=>{let q=questionsById(id),v=a.answers[i]||"";return q.type==="choice"?Number(v)===q.correct&&v!==""?2:0:q.type==="write"&&judge(v,q.correct,q.variants).ok?2:0}).reduce((s,n)=>s+(n||0),0);state.simHistory.push({at:Date.now(),auto:total});state.simHistory=state.simHistory.slice(-8)}else a.step++;save();simScreen();break}
}
});
document.addEventListener("input",e=>{if(e.target?.id==="answerField")typed=e.target.value;if(e.target?.id==="simAnswer"){let a=state.sessions.sim;if(a&&!a.finished){a.answers[a.step]=e.target.value;save()}}});
$("#fontToggle").addEventListener("click",()=>{state.font=!state.font;document.body.classList.toggle("large",state.font);$("#fontToggle").setAttribute("aria-pressed",String(state.font));save()});
document.body.classList.toggle("large",state.font);$("#fontToggle").setAttribute("aria-pressed",String(state.font));
window.addEventListener("hashchange",render);
render();
})();