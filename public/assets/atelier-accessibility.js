(() => {
  'use strict';
  const ownScript=document.currentScript?.src||'';
  let counter=0,scheduled=false,activeDialog=null,returnFocus=null;
  const backgrounds=new Map();
  const visible=el=>!!el&&!el.hidden&&el.getAttribute('aria-hidden')!=='true'&&!!el.getClientRects().length;
  const focusables=root=>[...root.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex="0"]')].filter(el=>!el.disabled&&!el.closest('[inert]')&&visible(el));
  function enhance(){
    scheduled=false;
    document.querySelectorAll('input,textarea,select').forEach(field=>{
      if(field.type==='hidden'||field.closest('label'))return;
      const label=field.closest('.field,.form-field,.field-row')?.querySelector('label');
      if(label&&!label.htmlFor){field.id||=`atelier-field-${++counter}`;label.htmlFor=field.id;}
      if(!field.id&&!field.hasAttribute('aria-label'))field.setAttribute('aria-label',field.getAttribute('placeholder')||'Ihre Antwort');
    });
    document.querySelectorAll('[data-global-level],[data-select-level],[data-mission-level],[data-set-all-level],button[data-level],[data-training],[data-training-tab],[data-setting],[data-view-option]').forEach(el=>{
      const on=el.classList.contains('is-selected')||el.classList.contains('is-active');
      if(el.getAttribute('aria-pressed')!==String(on))el.setAttribute('aria-pressed',String(on));
    });
    document.querySelectorAll('.quiz-feedback,.feedback,.dictation-hint').forEach(el=>{el.setAttribute('role','status');el.setAttribute('aria-live','polite');});
    document.querySelectorAll('.drawer,.help-drawer,#viewDrawer').forEach(drawer=>{
      const open=drawer.classList.contains('is-open')||drawer.id==='viewDrawer'&&!drawer.hidden;
      drawer.inert=!open;
      if(drawer.classList.contains('is-open')){drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');}
      const heading=drawer.querySelector('h2');
      if(heading){heading.id||=`atelier-dialog-${++counter}`;drawer.setAttribute('aria-labelledby',heading.id);}
    });
    document.querySelectorAll('.drawer-close,[data-close-drawers],[data-close]').forEach(el=>{
      if(el.tagName==='BUTTON'&&!el.hasAttribute('aria-label'))el.setAttribute('aria-label','Fenster schliessen');
    });
    const dialog=[...document.querySelectorAll('.drawer.is-open,.help-drawer.is-open,#viewDrawer:not([hidden]),.login-gate:not([hidden]) .login-card,.modal-overlay:not([hidden]) .modal-card')].find(visible)||null;
    if(dialog!==activeDialog){
      backgrounds.forEach((value,el)=>el.inert=value);backgrounds.clear();
      const closing=activeDialog;
      activeDialog=dialog;
      if(dialog){
        if(!closing)returnFocus=document.activeElement;
        dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
        document.querySelectorAll('main,.site-header,.topbar,.mobile-nav').forEach(el=>{if(!el.contains(dialog)){backgrounds.set(el,el.inert);el.inert=true;}});
        requestAnimationFrame(()=>{
          if(activeDialog===dialog&&!dialog.contains(document.activeElement))focusables(dialog)[0]?.focus({preventScroll:true});
        });
      }else if(returnFocus?.isConnected){returnFocus.focus({preventScroll:true});returnFocus=null;}
    }
    const flash=document.getElementById('singleFlash');
    if(flash){flash.setAttribute('aria-label','Wortschatzkarte: Antwort aufdecken oder verbergen');flash.setAttribute('aria-expanded',String(flash.classList.contains('revealed')));}
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance);}
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab'&&activeDialog){const items=focusables(activeDialog);if(!items.length){event.preventDefault();return;}const first=items[0],last=items[items.length-1];if(event.shiftKey&&(document.activeElement===first||!activeDialog.contains(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||!activeDialog.contains(document.activeElement))){event.preventDefault();first.focus();}}
  });
  const observer=new MutationObserver(schedule);
  function start(){enhance();observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','aria-hidden']});window.addEventListener('pageshow',()=>window.FranzNavigation.restoreIncoming());}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();

  /* Woche 37/38: die druckbare Sprechkarte ist bewusst als separates, kleines Upgrade gekapselt. */
  if(/\/module\/woche-(?:37|38)(?:\/|\/index\.html|$)/.test(location.pathname)){
    const script=document.createElement('script');
    script.src=ownScript?new URL('week37-card-print-upgrade.js?v=20260913-card2',ownScript).href:'../../assets/week37-card-print-upgrade.js?v=20260913-card2';
    script.defer=true;
    document.head.appendChild(script);
  }
})();
