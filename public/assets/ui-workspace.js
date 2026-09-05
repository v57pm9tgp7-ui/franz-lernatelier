(() => {
  'use strict';
  if (window.__franzWorkspaceUI) return;
  window.__franzWorkspaceUI = true;

  const script = document.currentScript;
  const base = script?.src ? new URL('.', script.src) : null;
  const workspaceCssHref = base ? new URL('ui-workspace.css?v=20260905-5', base).href : null;
  const typographyCssHref = base ? new URL('ui-typography-v3.css?v=20260905-5', base).href : null;

  function ensureCss(selector, href, dataName){
    if (!href) return;
    let link = document.querySelector(selector);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.dataset[dataName] = '1';
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }

  ensureCss('link[data-franz-workspace-css]', workspaceCssHref, 'franzWorkspaceCss');
  ensureCss('link[data-franz-typography-css]', typographyCssHref, 'franzTypographyCss');

  let fallbackFocus = false;
  let auditScheduled = false;
  let largeTogglePending = false;
  let syncingLarge = false;

  /* ---------------------------------------------------------------
     Globale Darstellungsoptionen
     «Grössere Schrift» gilt bewusst fuer die gesamte Webseite und
     wird zwischen Startseite, Woche 36 und Woche 37 synchronisiert.
     --------------------------------------------------------------- */
  const ACCESSIBILITY_KEY = 'franzLernatelierAccessibility_v1';

  function readJson(key, fallback){
    try {
      const raw = localStorage.getItem(key);
      return raw ? {...fallback, ...JSON.parse(raw)} : {...fallback};
    } catch (_) { return {...fallback}; }
  }

  function writeJson(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function inferExistingLarge(){
    try {
      const global = JSON.parse(localStorage.getItem(ACCESSIBILITY_KEY) || '{}');
      if (typeof global.large === 'boolean') return global.large;
      const shell = JSON.parse(localStorage.getItem('franzLernatelierView_v3') || '{}');
      if (typeof shell.large === 'boolean') return shell.large;
      const w37 = JSON.parse(localStorage.getItem('franzLernatelierW37View_v1') || '{}');
      if (typeof w37.large === 'boolean') return w37.large;
      const w36 = JSON.parse(localStorage.getItem('franzoesischLernatelierEinstieg_v1') || '{}');
      if (typeof w36?.view?.large === 'boolean') return w36.view.large;
    } catch (_) {}
    return false;
  }

  let accessPrefs = readJson(ACCESSIBILITY_KEY, {large:inferExistingLarge()});

  function mirrorLargeIntoPageStores(on){
    // Hauptseite
    const shell = readJson('franzLernatelierView_v3', {large:false,contrast:false,motion:false});
    if (shell.large !== on) { shell.large = on; writeJson('franzLernatelierView_v3', shell); }

    // Woche 37
    const w37 = readJson('franzLernatelierW37View_v1', {large:false,contrast:false,focus:false,motion:false});
    if (w37.large !== on) { w37.large = on; writeJson('franzLernatelierW37View_v1', w37); }

    // Woche 36 speichert die Ansicht im Modulzustand.
    try {
      const key = 'franzoesischLernatelierEinstieg_v1';
      const raw = localStorage.getItem(key);
      if (raw) {
        const state = JSON.parse(raw);
        state.view = {...(state.view || {}), large:on};
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (_) {}
  }

  function syncLargeControls(on){
    document.querySelectorAll('[data-setting="large"],[data-view-option="large"]').forEach(btn => {
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function applyGlobalLarge(on, persist=true){
    on = !!on;
    accessPrefs.large = on;
    syncingLarge = true;
    document.body?.classList.toggle('view-large', on);
    syncLargeControls(on);
    requestAnimationFrame(() => { syncingLarge = false; });
    if (persist) {
      writeJson(ACCESSIBILITY_KEY, accessPrefs);
      mirrorLargeIntoPageStores(on);
    }
    scheduleAudit(document);
  }

  function isLargeControl(target){
    const button = target?.closest?.('[data-setting="large"],[data-view-option="large"],button');
    if (!button) return null;
    if (button.matches('[data-setting="large"],[data-view-option="large"]')) return button;
    const text = (button.textContent || button.getAttribute('aria-label') || '').toLowerCase();
    return text.includes('grössere schrift') || text.includes('größere schrift') ? button : null;
  }

  function isFull(){ return !!document.fullscreenElement || fallbackFocus; }

  function sync(){
    const on = isFull();
    document.body?.classList.toggle('is-workspace-fullscreen', on);
    document.querySelectorAll('[data-ui-fullscreen]').forEach(btn => {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'Vollbild beenden' : 'Arbeitsbereich im Vollbild anzeigen';
      const label = btn.querySelector('.fullscreen-label');
      if (label) label.textContent = on ? 'Vollbild beenden' : 'Vollbild';
    });
  }

  async function toggle(){
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (_) {}
      return;
    }
    if (fallbackFocus) {
      fallbackFocus = false;
      sync();
      return;
    }
    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen({navigationUI:'hide'});
        return;
      } catch (_) {
        fallbackFocus = true;
        sync();
        return;
      }
    }
    fallbackFocus = true;
    sync();
  }

  function createHeaderButton(){
    if (document.querySelector('[data-ui-fullscreen]')) return;
    const shellHost = document.querySelector('.header-actions');
    const moduleHost = document.querySelector('.topbar-actions');
    const host = shellHost || moduleHost;
    if (!host) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.uiFullscreen = '1';
    button.setAttribute('aria-label','Vollbildmodus umschalten');
    button.setAttribute('aria-pressed','false');
    button.title = 'Arbeitsbereich im Vollbild anzeigen';

    if (shellHost) {
      button.className = 'round-button ui-fullscreen-button';
      button.innerHTML = '<span aria-hidden="true">⛶</span>';
      const help = host.querySelector('[data-open-help]');
      if (help) host.insertBefore(button, help); else host.appendChild(button);
    } else {
      button.className = 'top-action ui-fullscreen-button';
      button.innerHTML = '<span aria-hidden="true">⛶</span><span class="fullscreen-label">Vollbild</span>';
      const help = host.querySelector('[data-open-help]');
      if (help) host.insertBefore(button, help); else host.appendChild(button);
    }
    button.addEventListener('click', toggle);
  }

  function createExit(){
    if (document.querySelector('.ui-fullscreen-exit')) return;
    const exit = document.createElement('button');
    exit.type = 'button';
    exit.className = 'ui-fullscreen-exit';
    exit.innerHTML = '<span aria-hidden="true">↙</span><span>Vollbild beenden</span>';
    exit.addEventListener('click', toggle);
    document.body.appendChild(exit);
  }

  /* ----------------------------------------------------------------
     Automatischer Lesbarkeits-Audit
     Sichert auch dynamisch gerenderte Inhalte ab, damit künftig keine
     11–14-px-Lerntexte durch einen vergessenen Selektor zurückkehren.
     ---------------------------------------------------------------- */
  const EXCLUDE = [
    '.visual-number','.passport-stamp','.route-dot','.stop-dot','.task-number',
    '.mission-number','.next-number','.level-symbol','.brand-mark','.tricolore',
    'svg','path','use','script','style','noscript','[aria-hidden="true"]'
  ].join(',');

  function hasReadableText(el){
    if (!el || el.matches(EXCLUDE)) return false;
    const text = (el.textContent || '').replace(/\s+/g,' ').trim();
    if (!text) return false;
    // Reine Symbol-/Pfeil-Elemente nicht aufblasen.
    if (!/[A-Za-zÀ-ÿ0-9]/.test(text)) return false;
    return true;
  }

  function ownText(el){
    return [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  }

  function floorFor(el){
    if (el.matches('p,li,label,summary,figcaption,dd,dt')) return {px:17, cls:'ui-font-floor-copy'};
    if (el.matches('button,input,textarea,select')) return {px:16.5, cls:'ui-font-floor-control'};
    if (el.matches('small')) return {px:16, cls:'ui-font-floor-meta'};
    if (el.matches('span,strong,b') && ownText(el)) return {px:16, cls:'ui-font-floor-meta'};
    return null;
  }

  function auditTypography(root=document){
    const scopes = [];
    if (root.matches?.('.app-main,.site-main')) scopes.push(root);
    scopes.push(...(root.querySelectorAll?.('.app-main,.site-main') || []));
    if (!scopes.length && document.body) {
      const main = document.querySelector('.app-main,.site-main');
      if (main) scopes.push(main);
    }

    scopes.forEach(scope => {
      const nodes = scope.querySelectorAll('p,li,label,summary,figcaption,dd,dt,small,span,strong,b,button,input,textarea,select');
      nodes.forEach(el => {
        if (!hasReadableText(el)) return;
        const floor = floorFor(el);
        if (!floor) return;
        const size = parseFloat(getComputedStyle(el).fontSize || '0');
        if (Number.isFinite(size) && size + .05 < floor.px) {
          el.classList.add(floor.cls);
          el.dataset.uiReadableFloor = String(floor.px);
        }
      });
    });
  }

  function scheduleAudit(root=document){
    if (auditScheduled) return;
    auditScheduled = true;
    requestAnimationFrame(() => {
      auditScheduled = false;
      auditTypography(root);
    });
  }

  function start(){
    createHeaderButton();
    createExit();
    sync();

    // Globale Grossschrift bereits beim ersten Paint wiederherstellen.
    applyGlobalLarge(!!accessPrefs.large, false);
    mirrorLargeIntoPageStores(!!accessPrefs.large);
    setTimeout(() => applyGlobalLarge(!!accessPrefs.large, false), 120);
    setTimeout(() => applyGlobalLarge(!!accessPrefs.large, false), 650);

    // Bestehende «Grössere Schrift»-Schalter weiterverwenden. Wir lassen
    // zuerst die jeweilige Seite reagieren und synchronisieren danach.
    // Die Grossschrift-Schalter werden zentral verwaltet. Capture verhindert,
    // dass drei verschiedene Seitenskripte denselben Klick doppelt umschalten.
    document.addEventListener('click', event => {
      const control = isLargeControl(event.target);
      if (!control) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      largeTogglePending = true;
      applyGlobalLarge(!accessPrefs.large, true);
      largeTogglePending = false;
    }, true);

    document.addEventListener('click', event => {
      // Andere Ansichtsoptionen duerfen die globale Grossschrift nicht
      // versehentlich zuruecksetzen, wenn ihre lokale Settings-Kopie alt ist.
      const anySetting = event.target.closest?.('[data-setting],[data-view-option]');
      if (anySetting && !isLargeControl(event.target)) setTimeout(() => applyGlobalLarge(!!accessPrefs.large, false), 0);
    });

    // Manche Wochen rendern ihre Ansicht neu und wenden dabei eigene lokale
    // Settings erneut an. Die globale Grossschrift bleibt trotzdem verbindlich.
    if (document.body) {
      const bodyClassObserver = new MutationObserver(() => {
        if (largeTogglePending || syncingLarge) return;
        const current = document.body.classList.contains('view-large');
        if (current !== !!accessPrefs.large) requestAnimationFrame(() => applyGlobalLarge(!!accessPrefs.large, false));
      });
      bodyClassObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
    }

    window.addEventListener('storage', event => {
      if (event.key === ACCESSIBILITY_KEY) {
        accessPrefs = readJson(ACCESSIBILITY_KEY, {large:false});
        applyGlobalLarge(!!accessPrefs.large, false);
      }
    });

    scheduleAudit(document);
    setTimeout(() => auditTypography(document), 180);
    setTimeout(() => auditTypography(document), 700);

    const observer = new MutationObserver(records => {
      let root = document;
      for (const record of records) {
        const candidate = record.target?.nodeType === 1 ? record.target : null;
        if (candidate?.closest?.('.app-main,.site-main')) { root = candidate.closest('.app-main,.site-main'); break; }
      }
      scheduleAudit(root);
    });
    if (document.body) observer.observe(document.body,{childList:true,subtree:true});

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) fallbackFocus = false;
      sync();
      scheduleAudit(document);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && fallbackFocus) {
        fallbackFocus = false;
        sync();
      }
    });
    window.addEventListener('resize', () => scheduleAudit(document));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', start)
    : start();
})();
