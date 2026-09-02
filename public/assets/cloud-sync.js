(() => {
  'use strict';
  const script = document.currentScript;
  const moduleId = script?.dataset?.moduleId || 'woche-36-2026';
  const storageKey = script?.dataset?.storageKey || 'franzoesischLernatelierEinstieg_v1';
  const accountKey = 'franzLernatelierLearner_v1';
  const metaKey = `${storageKey}:cloudMeta_v1`;
  const localOnly = localStorage.getItem('franzLernatelierLocalOnly_v1') === '1';
  let account = read(accountKey, null);
  let meta = read(metaKey, {clientUpdatedAt:0, serverUpdatedAt:0});
  let lastRaw = localStorage.getItem(storageKey);
  let syncTimer = null;
  let syncing = false;

  function read(key, fallback) { try { const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback; } catch (_) { return fallback; } }
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function state() { try { return JSON.parse(localStorage.getItem(storageKey)||'{}'); } catch (_) { return {}; } }
  function hasState(value) { return value && typeof value==='object' && Object.keys(value).length>0; }
  function updateChip(mode, label) {
    const chip=document.getElementById('saveChip'), text=document.getElementById('saveLabel');
    if(text) text.textContent=label;
    if(chip){ chip.classList.toggle('error',mode==='error'); chip.title=mode==='online'?'Auf diesem Gerät und online gespeichert.':'Der Stand ist lokal gespeichert und wird später online synchronisiert.'; }
  }
  async function api(path, options={}) {
    const response=await fetch(path,{...options,headers:{'content-type':'application/json',...(options.headers||{})},cache:'no-store'});
    const data=await response.json().catch(()=>({}));
    if(!response.ok||!data.ok) throw new Error(data.error||`HTTP ${response.status}`);
    return data;
  }
  async function push() {
    if(!account?.email||localOnly||syncing)return;
    const s=state(); if(!hasState(s))return;
    syncing=true; updateChip('syncing','Wird online gespeichert …');
    try{
      const data=await api('/api/progress',{method:'PUT',body:JSON.stringify({email:account.email,moduleId,state:s,clientUpdatedAt:meta.clientUpdatedAt||Date.now()})});
      meta={clientUpdatedAt:data.clientUpdatedAt,serverUpdatedAt:data.serverUpdatedAt}; write(metaKey,meta); updateChip('online','Online gespeichert');
    }catch(_){ updateChip('error','Lokal gespeichert · Online später'); }
    finally{syncing=false;}
  }
  function schedulePush(){ clearTimeout(syncTimer); syncTimer=setTimeout(push,650); }
  async function reconcile(){
    if(!account?.email||localOnly)return;
    updateChip('syncing','Arbeitsstand wird geladen …');
    try{
      const remote=await api('/api/progress/load',{method:'POST',body:JSON.stringify({email:account.email,moduleId})});
      const local=state();
      if(!remote.found){
        if(hasState(local)){ meta.clientUpdatedAt=meta.clientUpdatedAt||Date.now(); write(metaKey,meta); await push(); }
        else updateChip('online','Online verbunden');
        return;
      }
      const remoteStamp=Number(remote.clientUpdatedAt||0), localStamp=Number(meta.clientUpdatedAt||0);
      const statesMatch=JSON.stringify(local||{})===JSON.stringify(remote.state||{});
      if(!hasState(local)||!localStamp||remoteStamp>localStamp){
        localStorage.setItem(storageKey,JSON.stringify(remote.state||{}));
        lastRaw=localStorage.getItem(storageKey);
        meta={clientUpdatedAt:remoteStamp,serverUpdatedAt:remote.serverUpdatedAt}; write(metaKey,meta);
        const guard='franzCloudReload:'+moduleId;
        if(sessionStorage.getItem(guard)!=='1'){ sessionStorage.setItem(guard,'1'); location.reload(); return; }
      }else if(localStamp>remoteStamp||!statesMatch){ meta.clientUpdatedAt=localStamp>remoteStamp?localStamp:Date.now(); write(metaKey,meta); await push(); }
      else updateChip('online','Online gespeichert');
    }catch(_){ updateChip('error','Lokal gespeichert · Online später'); }
  }
  function poll(){
    setInterval(()=>{
      const raw=localStorage.getItem(storageKey);
      if(raw!==lastRaw){ lastRaw=raw; meta.clientUpdatedAt=Date.now(); write(metaKey,meta); schedulePush(); }
    },900);
  }
  function init(){
    if(!account?.email&&!localOnly){
      const target=encodeURIComponent(location.pathname+location.hash);
      location.replace(`/?return=${target}`); return;
    }
    if(localOnly){ updateChip('local','Automatisch lokal gespeichert'); poll(); return; }
    reconcile().finally(poll);
    window.addEventListener('online',reconcile);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reconcile();});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
