(() => {
  'use strict';
  const own=document.currentScript?.src||'';
  const topic=(window.FRANZ_TOPICS||[]).find(t=>t.active)||(window.FRANZ_TOPICS||[])[0];
  const weeks=topic?.weeks||[36,37,38];
  const range=`Woche ${Math.min(...weeks)}–${Math.max(...weeks)}`;
  function enhance(){
    const hero=document.querySelector('#trainingScreen .training-hero');
    if(hero){
      let chip=hero.querySelector('.topic-module-chip');
      if(!chip){chip=document.createElement('span');chip.className='topic-module-chip';hero.prepend(chip);}
      chip.textContent=`Aktuelles Thema · ${range}`;
      const h1=hero.querySelector('h1');if(h1)h1.textContent=`Training · ${topic?.title||'Se présenter'}`;
      const p=hero.querySelector('p');if(p)p.textContent='Hier trainieren Sie den Stoff des ganzen Themas – nicht nur die aktuelle Woche. Cartes und Testvorbereitung verwenden denselben Lernstand.';
      if(!hero.querySelector('.topic-test-link')){const a=document.createElement('a');a.className='topic-test-link';a.href='../../index.html#training';a.textContent='Testvorbereitung & Übersicht →';hero.appendChild(a);}
    }
    const storage=document.querySelector('.practice-storage');if(storage)storage.textContent=`Ihr Trainingsfortschritt gehört zum Thema «${topic?.title||'Se présenter'}» (${range}) und bleibt über die Wochen hinweg erhalten.`;
    const tabs=document.querySelectorAll('.practice-tabs button');if(tabs[0]&&tabs[0].textContent.trim()==='Wortschatz')tabs[0].textContent='Cartes · Vocabulaire';
  }
  function style(){if(document.getElementById('topic-module-style'))return;const s=document.createElement('style');s.id='topic-module-style';s.textContent='.topic-module-chip{display:inline-flex;margin-bottom:10px;padding:6px 9px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(255,255,255,.09);font-size:12px;font-weight:900;letter-spacing:.05em;text-transform:uppercase}.topic-test-link{display:inline-flex;margin-top:16px;min-height:42px;align-items:center;border:1px solid rgba(255,255,255,.32);border-radius:11px;background:#fff;color:#0b315f!important;padding:8px 12px;text-decoration:none;font-weight:900}.topic-test-link:hover{background:#f2f7f7}';document.head.appendChild(s);}
  let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance();});}
  function start(){style();enhance();const main=document.getElementById('trainerMain');if(main)new MutationObserver(schedule).observe(main,{childList:true,subtree:true});}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();
