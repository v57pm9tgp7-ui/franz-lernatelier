(()=>{'use strict';
const A=window.VerbTrainerAPI,E=window.VerbLearning,C=window.VERB_CATALOG,$=s=>document.querySelector(s);
const weekly=C.sets.filter(s=>/^\d{4}W\d+$/.test(s.id)).sort((a,b)=>a.id.localeCompare(b.id)),latest=weekly.at(-1);
function resetChoices(){A.setScope('all');$('#focusVerb').value='all';$('#mode').value='mixed';$('#person').value='all';$('#support').value='standard';$('#support').dispatchEvent(new Event('change'));$('#roundSize').value='10';$('#practiceKind').value='recommended';}
$('#quickRound').onclick=()=>{resetChoices();A.start('recommended');};
$('#quickLearn').onclick=()=>{A.setScope(latest.id);$('#focusVerb').value='all';A.learn();};
function status(){const qs=E.pool(C),s=E.stats(qs,A.state());$('#launchStatus').textContent=s.due?`${s.due} Aufgaben sind fällig. Ihre Runde mischt Wiederholung, neue Verben und Bekanntes.`:`${C.verbs.length} Verben im Atelier · ${latest.verbIds.length} neu in dieser Woche. Starten Sie mit einer Mischung aus Neuem und Bekanntem.`;}
function openTarget(hash){if(!hash||hash==='#')return;let node;try{node=document.querySelector(hash);}catch{return;}if(!node)return;let parent=node;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>openTarget(a.getAttribute('href'))));window.addEventListener('hashchange',()=>openTarget(location.hash));openTarget(location.hash);
// Accents are keyboard aids; they do not reveal a solution.
document.querySelectorAll('[data-accent]').forEach(b=>b.onclick=()=>{const input=$('#answer');if(input.readOnly)return;const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.setRangeText(b.dataset.accent,start,end,'end');input.focus();});
document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>{A.close();document.querySelector('.launch-grid').scrollIntoView({block:'start',behavior:'smooth'});});
window.addEventListener('verbprogress',status);status();
if(new URLSearchParams(location.search).get('learn')==='1')A.learn();
})();
