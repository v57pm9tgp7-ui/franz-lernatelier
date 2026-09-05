(() => {
  'use strict';
  if (window.__franzWorkspaceUI) return;
  window.__franzWorkspaceUI = true;

  const script = document.currentScript;
  const cssHref = script?.src ? new URL('ui-workspace.css?v=20260905-1', script.src).href : null;
  if (cssHref && !document.querySelector('link[data-franz-workspace-css]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    link.dataset.franzWorkspaceCss = '1';
    document.head.appendChild(link);
  }

  let fallbackFocus = false;

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

  function start(){
    createHeaderButton();
    createExit();
    sync();
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) fallbackFocus = false;
      sync();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && fallbackFocus) {
        fallbackFocus = false;
        sync();
      }
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', start)
    : start();
})();
