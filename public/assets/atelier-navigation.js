/* Navigation belongs to this browser tab; answers remain in the original stores. */
(() => {
  'use strict';
  const read = (key, fallback) => { try { return JSON.parse(sessionStorage.getItem(key)) || fallback; } catch { return fallback; } };
  const write = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function selector(el) {
    if (!el || el === document.body) return null;
    for (const attr of ['data-answer','data-bind','data-learn-field','data-check']) if (el.hasAttribute(attr)) return `[${attr}="${CSS.escape(el.getAttribute(attr))}"]`;
    return el.id ? `#${CSS.escape(el.id)}` : null;
  }
  function snapshot(route) {
    const active = document.querySelector('.screen.is-active,.app-view.is-active') || document;
    const field = document.activeElement;
    return {route, url:location.pathname + location.search + location.hash, y:window.scrollY,
      focus:selector(field), start:field?.selectionStart, end:field?.selectionEnd,
      details:[...active.querySelectorAll('details')].map((el,index) => ({index,open:el.open}))};
  }
  function restore(place) {
    if (!place) return;
    const active = document.querySelector('.screen.is-active,.app-view.is-active') || document;
    const details = active.querySelectorAll('details');
    (place.details || []).forEach(item => { if (details[item.index]) details[item.index].open = item.open; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const field = place.focus && document.querySelector(place.focus);
      field?.focus({preventScroll:true});
      if (field?.setSelectionRange && place.start != null) { try { field.setSelectionRange(place.start,place.end); } catch {} }
      const root = document.documentElement, old = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo({top:place.y || 0,behavior:'instant'});
      root.style.scrollBehavior = old;
    }));
  }
  function create(config) {
    const key = `franzNavigation_v1:${location.pathname}`;
    const saved = read(key, {});
    let current = null, pending = null, restoring = null, historyMove = false, entryPlace = null;
    let last = saved.last || null, previous = saved.previous || null;
    let trainingReturn = saved.trainingReturn || null;
    const available = config.missions.map(m => Number(m.id));
    const valid = route => route === config.overview || route === 'start' || route === 'training' || /^mission-\d+$/.test(route || '') && available.includes(Number(route.split('-')[1]));
    const fragment = decodeURIComponent(location.hash.slice(1));
    const requested = fragment.split('/')[0];
    const initial = valid(requested) ? requested : valid(config.savedRoute) ? config.savedRoute : config.overview;
    const initialMode = requested === 'training' ? fragment.split('/')[1] : null;
    const externalOrigin = read('franzTrainingOrigin_v1',null);
    if (requested === 'training' && externalOrigin?.target === location.pathname) {
      trainingReturn = externalOrigin.place;
      try { sessionStorage.removeItem('franzTrainingOrigin_v1'); } catch {}
    }
    if (initial === 'training' && !trainingReturn && last) trainingReturn = last;
    const main = document.querySelector('.app-main');
    main.id ||= 'mainContent'; main.tabIndex = -1;
    if (!document.querySelector('.skip-link')) {
      const skip = document.createElement('a'); skip.className='skip-link'; skip.href='#mainContent'; skip.textContent='Direkt zur Übung'; document.body.prepend(skip);
    }
    const bar = document.createElement('nav'); bar.className='atelier-nav'; bar.setAttribute('aria-label','Wochen und Übungen'); main.prepend(bar);
    const title = route => route?.startsWith('mission-') ? config.missions.find(m => m.id === Number(route.split('-')[1]))?.title || 'Übung' : route === 'training' ? 'Training' : 'Übersicht';
    const persist = () => write(key,{last,previous,trainingReturn});
    function capture() {
      if (!current || restoring) return;
      pending = entryPlace?.route === current ? entryPlace : snapshot(current);
      if (current.startsWith('mission-')) { last = pending; persist(); }
      history.replaceState({...history.state,franzPlace:pending},'');
    }
    function draw() {
      const id = Number(current?.split('-')[1]);
      const sequence = (config.week===36 && [7,5,8].includes(id)) ? [7,5,8] : available;
      const index = sequence.indexOf(id);
      const isTraining = current === 'training', isMission = index >= 0;
      const before = isMission && index > 0 ? sequence[index-1] : null;
      const after = isMission && index < sequence.length-1 ? sequence[index+1] : null;
      const resume = isTraining ? trainingReturn || last : !isMission ? last : null;
      bar.innerHTML = `<div class="atelier-path"><a href="../../index.html#weeks">Wochen</a><span aria-hidden="true">/</span><button type="button" data-nav-route="${config.overview}">Woche ${config.week}</button><span aria-hidden="true">/</span><strong aria-current="page">${esc(isMission ? 'Übung '+id : title(current))}</strong></div>
        <div class="atelier-controls"><label class="atelier-picker"><span class="sr-only">Woche wählen</span><select data-nav-week><option value="36" ${config.week===36?'selected':''}>Woche 36</option><option value="37" ${config.week===37?'selected':''}>Woche 37</option></select></label>
        <label class="atelier-picker atelier-exercise"><span class="sr-only">Übung wählen</span><select data-nav-exercise><option value="${config.overview}" ${!isMission?'selected':''}>${isTraining?'Training · Übung wählen':'Alle Übungen'}</option>${config.missions.map(m=>`<option value="mission-${m.id}" ${m.id===id?'selected':''}>${m.id} · ${esc(m.title)}</option>`).join('')}</select></label>
        ${resume?`<button class="atelier-return" type="button" data-nav-return>${isTraining?'← Zurück':'↩ Letzte Übung'}<span>${esc(resume.route?.startsWith('mission-')?'Übung '+resume.route.split('-')[1]:resume.label||'Zur Ausgangsseite')}</span></button>`:''}
        ${!isMission&&!isTraining?'<button type="button" class="secondary-btn" data-nav-route="training">Trainieren</button>':''}${isMission?`<div class="atelier-step-buttons"><button type="button" ${before?`data-nav-route="mission-${before}"`:`data-nav-route="${config.overview}"`} aria-label="${before?'Vorherige Übung: '+esc(title('mission-'+before)):'Zur Wochenübersicht'}">← <span>Zurück</span></button><button type="button" data-nav-route="training">Trainieren</button><button type="button" ${after?`data-nav-route="mission-${after}"`:`data-nav-next-week`} aria-label="${after?'Nächste Übung: '+esc(title('mission-'+after)):config.week===36?'Woche 37 öffnen':'Alle Wochen öffnen'}"><span>${after?'Weiter':config.week===36?'Woche 37':'Wochen'}</span> →</button></div>`:''}</div>`;
      document.querySelectorAll('[data-go="training"]').forEach(el => {
        el.classList.toggle('is-current',isTraining);
        if (isTraining) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current');
      });
      const heading = document.querySelector('.screen.is-active h1');
      document.title = `${title(current)} · Woche ${config.week} · Franz Lernatelier`;
      if (heading) heading.tabIndex = -1;
      document.querySelectorAll('[data-training-return]').forEach(el => {
        el.textContent = resume ? (resume.route?.startsWith('mission-') ? `← Zurück zu Übung ${resume.route.split('-')[1]}` : '← Zurück zur Ausgangsseite') : '← Zur Wochenübersicht';
      });
    }
    function changed(route, scroll=true) {
      if (!valid(route)) route = config.overview;
      const old = current;
      const place = pending;
      if (old !== route && place && !restoring) {
        if (old?.startsWith('mission-')) { previous=last; last=place; }
        if (route === 'training' && old !== 'training') trainingReturn=place;
      }
      current=route; pending=null; entryPlace=null;
      if (route.startsWith('mission-') && (!last || last.route !== route)) last={route,url:location.pathname+'#'+route,y:0};
      persist(); draw();
      const target = restoring;
      if (!historyMove) {
        const method = !old || old===route ? 'replaceState' : 'pushState';
        history[method]({...history.state,franzPlace:target || {route,url:location.pathname+'#'+route,y:0}},'',`#${route}`);
      }
      restoring=null; historyMove=false;
      if (target) restore(target);
      else if (scroll && old !== route) {
        window.scrollTo({top:0,behavior:'instant'});
        document.querySelector('.screen.is-active h1')?.focus({preventScroll:true});
      }
    }
    function go(route, place=null) {
      if (!valid(route)) return;
      capture(); restoring=place;
      config.show(route);
    }
    function back() {
      const place=current==='training' ? trainingReturn || last : last;
      if (!place) return go(config.overview);
      const url=new URL(place.url,location.href);
      if (url.origin!==location.origin) return go(config.overview);
      if (url.pathname!==location.pathname) {
        write('franzReturnPlace_v1',place); config.flush(); location.href=url.href;
      } else go(place.route,place);
    }
    // Keep the text caret before a pointer click moves focus to Trainieren.
    document.addEventListener('pointerdown',e=>{
      const trigger=e.target.closest('[data-nav-route="training"],[data-go="training"]');
      entryPlace=trigger&&current&&current!=='training'?snapshot(current):null;
    },true);
    document.addEventListener('pointercancel',()=>{entryPlace=null;},true);
    document.addEventListener('click',e=>{
      const button=e.target.closest('button,a'); if(!button)return;
      if(button.matches('[data-go],[data-mission],[data-open-mission],#continueBtn,#continueLearning,[data-nav-route],[data-nav-return],[data-training-return],a'))capture();
      if(button.hasAttribute('data-nav-return')||button.hasAttribute('data-training-return')){e.preventDefault();e.stopImmediatePropagation();back();}
      else if(button.dataset.navRoute){e.preventDefault();e.stopImmediatePropagation();go(button.dataset.navRoute);}
      else if(button.hasAttribute('data-nav-next-week')){config.flush();location.href=config.week===36?'../woche-37/index.html#start':'../../index.html#weeks';}
    },true);
    bar.addEventListener('change',e=>{
      if(e.target.matches('[data-nav-exercise]'))go(e.target.value);
      if(e.target.matches('[data-nav-week]')){capture();config.flush();location.href=`../woche-${e.target.value}/index.html#${e.target.value==='36'?'dashboard':'start'}`;}
    });
    window.addEventListener('popstate',e=>{
      const place=e.state?.franzPlace, route=place?.route || location.hash.slice(1).split('/')[0];
      if(!valid(route))return;
      historyMove=true;restoring=place || {route,y:0};config.show(route);
    });
    window.addEventListener('pagehide',()=>{capture();config.flush();});
    return {initial,initialMode,capture,changed,go,back,refresh:draw};
  }
  window.FranzNavigation={create,snapshot,restore,rememberTraining(target,label){write('franzTrainingOrigin_v1',{target,place:{...snapshot(null),label}});},restoreIncoming(){const place=read('franzReturnPlace_v1',null);if(place&&new URL(place.url,location.href).pathname===location.pathname){try{sessionStorage.removeItem('franzReturnPlace_v1');}catch{}restore(place);return true;}return false;}};
})();
