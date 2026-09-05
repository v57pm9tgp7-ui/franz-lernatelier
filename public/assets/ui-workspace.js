(() => {
  'use strict';
  if (window.__franzWorkspaceUI) return;
  window.__franzWorkspaceUI = true;

  const script = document.currentScript;
  const base = script?.src ? new URL('.', script.src) : null;
  const workspaceCssHref = base ? new URL('ui-workspace.css?v=20260905-3', base).href : null;
  const typographyCssHref = base ? new URL('ui-typography-v3.css?v=20260905-3', base).href : null;

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
