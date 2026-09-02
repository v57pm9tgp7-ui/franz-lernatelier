(() => {
  'use strict';

  const qs = (selector, root=document) => root.querySelector(selector);
  const qsa = (selector, root=document) => [...root.querySelectorAll(selector)];
  const modules = Array.isArray(window.FRANZ_MODULES) ? window.FRANZ_MODULES : [];
  const current = modules.find(module => module.status === 'current') || modules[0];
  const shellKey = 'franzLernatelierShell_v3';
  const settingsKey = 'franzLernatelierView_v3';
  const routeMap = {
    short:[1,2,4,8],
    medium:[1,3,5,6,8],
    full:[1,2,3,4,5,6,7,8],
    expert:[1,2,3,4,5,6,7,8]
  };
  const iconMap = {cards:'i-cards', headphones:'i-headphones', bolt:'i-bolt', mic:'i-mic'};
  const trainingColors = {
    coral:{color:'#ef4135',soft:'#fff0ee'},
    sky:{color:'#0c6ec4',soft:'#eaf3fb'},
    mint:{color:'#147c73',soft:'#e8f5f1'},
    violet:{color:'#10243e',soft:'#eef2f7'}
  };

  let toastTimer = null;
  let shellState = readJson(shellKey,{view:'home',level:null});
  let settings = readJson(settingsKey,{large:false,contrast:false,motion:false});
  let moduleState = readModuleState(current);
  let selectedLevel = resolveLevel();

  function esc(value=''){
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  function readJson(key,fallback){
    try{
      const raw=localStorage.getItem(key);
      return raw?{...fallback,...JSON.parse(raw)}:{...fallback};
    }catch(error){return {...fallback};}
  }

  function saveJson(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));}catch(error){}
  }

  function readModuleState(module){
    if(!module?.storageKey)return{};
    try{return JSON.parse(localStorage.getItem(module.storageKey)||'{}');}catch(error){return{};}
  }

  function writeModuleState(patch={}){
    if(!current?.storageKey)return;
    moduleState={...moduleState,...patch};
    try{localStorage.setItem(current.storageKey,JSON.stringify(moduleState));}catch(error){}
  }

  function resolveLevel(){
    const valid=new Set((current?.levels||[]).map(level=>level.id));
    const candidate=moduleState.globalLevel||shellState.level||'standard';
    return valid.has(candidate)?candidate:'standard';
  }

  function currentLevel(){
    return current?.levels?.find(level=>level.id===selectedLevel)||current?.levels?.[1]||current?.levels?.[0]||{};
  }

  function progressData(module=current,state=moduleState){
    const ids=routeMap[state?.route]||routeMap.full;
    const done=ids.filter(id=>state?.missionDone?.[id]).length;
    const total=ids.length;
    const started=done>0||Object.keys(state?.answers||{}).length>0||Object.keys(state?.choices||{}).length>0;
    const finished=done===total&&total>0;
    const pct=total?Math.round(done/total*100):0;
    const activeMission=Number(state?.currentMission||0);
    const nextId=activeMission&&ids.includes(activeMission)&&!state?.missionDone?.[activeMission]
      ?activeMission
      :(ids.find(id=>!state?.missionDone?.[id])||ids[ids.length-1]||1);
    return{ids,done,total,started,finished,pct,nextId};
  }

  function renderHeader(){
    const level=currentLevel();
    qsa('[data-current-level-label]').forEach(node=>node.textContent=level.label||'Standard');
    qsa('[data-current-level-range]').forEach(node=>node.textContent=level.range||'A2');
  }

  function renderHome(){
    if(!current)return;
    const progress=progressData();
    const next=current.missionList.find(mission=>mission.id===progress.nextId)||current.missionList[0];
    qs('#headingWeek').textContent=current.week;
    qs('#trainingWeek').textContent=current.week;
    qs('#currentWeekNumber').textContent=current.week;
    qs('#moduleSchoolYear').textContent=`Schuljahr ${current.schoolYear}`;
    qs('#moduleTitle').textContent=current.title;
    qs('#moduleSubtitle').textContent=current.subtitle;
    qs('#currentDescription').textContent=current.description;
    qs('#homeLead').textContent='Sie arbeiten an Begrüssungen, Hilfssätzen, einer persönlichen Vorstellung und kurzen Gesprächen.';
    qs('#currentFacts').innerHTML=(current.facts||[]).map(fact=>`<span class="fact-chip">${esc(fact)}</span>`).join('');
    qs('#progressValue').textContent=`${progress.pct}%`;
    qs('#progressBar').style.width=`${progress.pct}%`;

    let label='Noch nicht begonnen.';
    let action='Woche öffnen';
    let state='Noch nicht begonnen';
    let stateClass='';
    if(progress.finished){
      label=`${progress.done} von ${progress.total} Aufgaben abgeschlossen.`;
      action='Woche nochmals öffnen';
      state='Abgeschlossen';
      stateClass='is-done';
    }else if(progress.started){
      label=`${progress.done} von ${progress.total} Aufgaben abgeschlossen.`;
      action='Weiterarbeiten';
      state='In Arbeit';
      stateClass='is-working';
    }
    qs('#progressLabel').textContent=label;
    qs('#primaryActionLabel').textContent=action;
    const badge=qs('#moduleState');
    badge.className=`state-badge ${stateClass}`.trim();
    badge.innerHTML=`<i></i> ${state}`;
    qs('#routeProgressText').textContent=`${progress.done} erledigt`;

    qs('#nextStepCount').textContent=String(next.id).padStart(2,'0');
    qs('#nextStepTitle').textContent=progress.finished?'Woche abgeschlossen':next.title;
    qs('#nextStepDescription').textContent=progress.finished?'Sie können eine Aufgabe wiederholen oder kurz trainieren.':next.description;
    qs('#nextStepTime').textContent=next.time;
    qs('#nextStepForm').textContent=next.form;
    qs('[data-open-next]').dataset.mission=String(next.id);
    renderRoute(progress);
  }

  function renderRoute(progress){
    const holder=qs('#heroRouteStations');
    if(!holder||!current)return;
    holder.innerHTML=current.missionList.map(mission=>{
      const done=!!moduleState.missionDone?.[mission.id];
      const isNext=mission.id===progress.nextId&&!progress.finished;
      return `<span class="route-dot${done?' is-done':''}${isNext?' is-next':''}" title="${esc(mission.title)}">${done?'✓':mission.id}</span>`;
    }).join('');
  }

  function levelCard(level,drawer=false){
    const selected=selectedLevel===level.id;
    const style=`--level-color:${level.color};--level-soft:${level.soft}`;
    if(drawer){
      return `<button class="drawer-level${selected?' is-selected':''}" type="button" data-select-level="${esc(level.id)}" style="${style}"><span class="level-icon">${esc(level.symbol)}</span><span><h3>${esc(level.label)} · ${esc(level.range)}</h3><p>${esc(level.note)}</p></span><span class="level-radio">✓</span></button>`;
    }
    return `<button class="level-card${selected?' is-selected':''}" type="button" data-select-level="${esc(level.id)}" style="${style}"><span class="level-card-top"><span class="level-icon">${esc(level.symbol)}</span><span class="level-radio">✓</span></span><h3>${esc(level.label)}</h3><strong>${esc(level.range)}</strong><p>${esc(level.note)}</p></button>`;
  }

  function renderLevels(){
    if(!current)return;
    qs('#levelGrid').innerHTML=current.levels.map(level=>levelCard(level)).join('');
    qs('#drawerLevels').innerHTML=current.levels.map(level=>levelCard(level,true)).join('');
    const level=currentLevel();
    qs('#demoLevelLabel').textContent=`${level.label} · ${level.range}`;
    qs('#supportLabel').textContent=`${level.label} · Unterstützung`;
    qs('#supportTitle').textContent=level.supportTitle;
    qs('#supportText').textContent=level.supportText;
    qs('#supportLayers').innerHTML=(level.layers||[]).map(item=>`<span>${esc(item)}</span>`).join('');
    qs('#supportBox').style.setProperty('--level-color',level.color);
    qs('#supportBox').style.setProperty('--level-soft',level.soft);
    qs('#demoInput').placeholder=level.placeholder;
  }

  function renderQuickTraining(){
    if(!current)return;
    const items=current.training.slice(0,3);
    qs('#quickTrainingGrid').innerHTML=items.map(item=>{
      const colors=trainingColors[item.color]||trainingColors.sky;
      return `<button class="quick-card" type="button" data-start-training="${esc(item.id)}" style="--card-color:${colors.color};--card-soft:${colors.soft}"><span class="quick-icon"><svg><use href="#${iconMap[item.icon]||'i-training'}"></use></svg></span><span><strong>${esc(item.title)}</strong><small>${esc(item.time)} · ${esc(item.subtitle)}</small></span><span>→</span></button>`;
    }).join('');
  }

  function renderWeeks(){
    const holder=qs('#weeksList');
    if(!holder)return;
    holder.innerHTML=modules.slice().sort((a,b)=>b.week-a.week).map(module=>{
      const state=readModuleState(module);
      const progress=progressData(module,state);
      return `<article class="week-list-card"><div class="week-list-number">${module.week}</div><div class="week-list-copy"><span class="small-label">${module.status==='current'?'Aktuelle Woche':'Frühere Woche'} · ${esc(module.schoolYear)}</span><h2>${esc(module.title)}</h2><h3>${esc(module.subtitle)}</h3><p>${esc(module.description)}</p></div><div class="week-list-progress"><div><span>${progress.started?`${progress.done} von ${progress.total} Aufgaben`:'Noch nicht begonnen'}</span><strong>${progress.pct}%</strong></div><div class="progress-track"><span style="width:${progress.pct}%"></span></div></div><div class="week-list-actions"><a href="${esc(module.href)}" data-open-module="${esc(module.id)}">${progress.started?'Weiterarbeiten':'Öffnen'}</a><button type="button" data-start-training="cards">Trainieren</button></div></article>`;
    }).join('');
    qs('#summaryModules').textContent=String(modules.length);
    qs('#summaryEscales').textContent=String(modules.reduce((sum,module)=>sum+(module.missions||0),0));
  }

  function renderTraining(){
    const holder=qs('#trainingGrid');
    if(!holder||!current)return;
    holder.innerHTML=current.training.map(item=>{
      const colors=trainingColors[item.color]||trainingColors.sky;
      return `<article class="training-card" style="--card-color:${colors.color};--card-soft:${colors.soft}"><span class="training-card-time">${esc(item.time)}</span><span class="training-card-icon"><svg><use href="#${iconMap[item.icon]||'i-training'}"></use></svg></span><small>${esc(item.subtitle)}</small><h2>${esc(item.title)}</h2><p>${esc(item.description)}</p><button type="button" data-start-training="${esc(item.id)}">Öffnen <svg><use href="#i-arrow"></use></svg></button></article>`;
    }).join('');
    const progress=progressData();
    let id=progress.done>=2?'reaction':'cards';
    if(selectedLevel==='expert')id='expert';
    const item=current.training.find(entry=>entry.id===id)||current.training[0];
    qs('#trainingRecommendation').textContent=`${item.title} · ${item.subtitle}`;
    qs('#trainingRecommendationText').textContent=item.description;
    qs('[data-start-recommended]').dataset.startTraining=item.id;
  }

  function renderAll(){
    renderHeader();
    renderHome();
    renderLevels();
    renderQuickTraining();
    renderWeeks();
    renderTraining();
    applySettings();
  }

  function setLevel(id){
    if(!current?.levels?.some(level=>level.id===id))return;
    selectedLevel=id;
    shellState.level=id;
    saveJson(shellKey,shellState);
    writeModuleState({globalLevel:id,missionLevels:{}});
    renderAll();
    showToast(`${currentLevel().label} (${currentLevel().range}) ausgewählt.`);
  }

  function setView(view,updateHash=true){
    if(!['home','weeks','training'].includes(view))view='home';
    shellState.view=view;
    saveJson(shellKey,shellState);
    qsa('[data-view]').forEach(panel=>{
      const active=panel.dataset.view===view;
      panel.classList.toggle('is-active',active);
      panel.hidden=!active;
    });
    qsa('[data-view-target]').forEach(button=>button.classList.toggle('is-active',button.dataset.viewTarget===view));
    if(updateHash&&location.hash!==`#${view}`)history.replaceState(null,'',`#${view}`);
    window.scrollTo({top:0,behavior:settings.motion?'auto':'smooth'});
    qs('#mainContent')?.focus({preventScroll:true});
  }

  function prepareModule({mission=null,training=null}={}){
    const patch={globalLevel:selectedLevel};
    if(mission){patch.currentScreen=`mission-${mission}`;patch.currentMission=Number(mission);}
    if(training){patch.currentScreen='training';patch.trainingMode=training;}
    writeModuleState(patch);
  }

  function openModule(event,options={}){
    event?.preventDefault();
    if(!current)return;
    prepareModule(options);
    location.href=current.href+(options.training?'#training':'');
  }

  function openDrawer(id){
    closeDrawers();
    const drawer=qs(`#${id}`);
    if(!drawer)return;
    qs('#overlay').hidden=false;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>drawer.querySelector('button')?.focus(),0);
  }

  function closeDrawers(){
    qs('#overlay').hidden=true;
    qsa('.drawer').forEach(drawer=>{
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden','true');
    });
    document.body.style.overflow='';
  }

  function applySettings(){
    document.body.classList.toggle('view-large',!!settings.large);
    document.body.classList.toggle('view-contrast',!!settings.contrast);
    document.body.classList.toggle('view-motion',!!settings.motion);
    qsa('[data-setting]').forEach(button=>button.classList.toggle('is-active',!!settings[button.dataset.setting]));
  }

  function showToast(message){
    const toast=qs('#toast');
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2400);
  }

  function bindEvents(){
    document.addEventListener('click',event=>{
      const view=event.target.closest('[data-view-target]');
      if(view){event.preventDefault();setView(view.dataset.viewTarget);return;}

      const level=event.target.closest('[data-select-level]');
      if(level){setLevel(level.dataset.selectLevel);return;}

      if(event.target.closest('[data-open-level]')){openDrawer('levelDrawer');return;}
      if(event.target.closest('[data-open-help]')){openDrawer('helpDrawer');return;}
      if(event.target.closest('[data-open-settings]')){openDrawer('settingsDrawer');return;}
      if(event.target.closest('[data-close-drawers]')){closeDrawers();return;}

      const setting=event.target.closest('[data-setting]');
      if(setting){
        settings[setting.dataset.setting]=!settings[setting.dataset.setting];
        saveJson(settingsKey,settings);
        applySettings();
        return;
      }

      const training=event.target.closest('[data-start-training]');
      if(training){openModule(event,{training:training.dataset.startTraining});return;}

      const recommended=event.target.closest('[data-start-recommended]');
      if(recommended){openModule(event,{training:recommended.dataset.startTraining});return;}

      const currentLink=event.target.closest('[data-open-current]');
      if(currentLink){openModule(event);return;}

      const next=event.target.closest('[data-open-next]');
      if(next){openModule(event,{mission:next.dataset.mission});return;}

      const moduleLink=event.target.closest('[data-open-module]');
      if(moduleLink&&moduleLink.dataset.openModule===current?.id){openModule(event);}
    });

    qs('#overlay').addEventListener('click',closeDrawers);
    document.addEventListener('keydown',event=>{if(event.key==='Escape')closeDrawers();});
    window.addEventListener('hashchange',()=>setView(location.hash.slice(1),false));
    window.addEventListener('storage',event=>{
      if(event.key===current?.storageKey){
        moduleState=readModuleState(current);
        selectedLevel=resolveLevel();
        renderAll();
      }
    });
  }

  function init(){
    renderAll();
    bindEvents();
    setView(location.hash.slice(1)||shellState.view||'home',false);
  }

  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
