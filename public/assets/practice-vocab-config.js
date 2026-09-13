(() => {
'use strict';
const ACCOUNT_KEY='franzLernatelierLearner_v1';
const TOPIC_ID='se-presenter-2026';
if(!window.FranzPractice?.create)return;
const originalCreate=window.FranzPractice.create;

window.FranzPractice.create=function(api){
  const instance=originalCreate(api);
  const originalCards=[...(instance.data?.cards||[])];

  async function applyTeacherConfig(){
    let account={};try{account=JSON.parse(localStorage.getItem(ACCOUNT_KEY)||'{}')||{};}catch(_){}
    const email=String(account.email||'').trim().toLowerCase();
    if(!email||!instance.data?.cards)return;
    try{
      const response=await fetch('/api/topic-config',{method:'POST',headers:{'content-type':'application/json'},cache:'no-store',body:JSON.stringify({email,topicId:TOPIC_ID})});
      const data=await response.json();
      if(!response.ok||!data.ok)return;
      const learn=new Set(Array.isArray(data.learnIds)?data.learnIds:[]);
      const filtered=originalCards.filter(card=>learn.has(card.id));
      instance.data.cards.splice(0,instance.data.cards.length,...filtered);
      const state=api.state?.();
      if(state?.practiceV2?.mode==='cards')instance.restart?.();
      document.documentElement.dataset.vocabGroup=data.groupId||'';
    }catch(_){}
  }

  setTimeout(applyTeacherConfig,0);
  window.addEventListener('pageshow',applyTeacherConfig);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')applyTeacherConfig();});
  return instance;
};
})();