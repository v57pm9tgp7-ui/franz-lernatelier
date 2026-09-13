(() => {
  'use strict';

  const CURRENT_ID = 'woche-38-2026';
  const SHARED_ID = 'woche-37-2026';
  const STORAGE_KEY = 'franzoesischLernatelierW37_v1';
  const SHELL_KEY = 'franzLernatelierShell_v3';
  const FIRST_LANDING_KEY = 'franzLernatelierW38Landing_v1';

  // Woche 38 ist didaktisch eine Weiterführung von Woche 37.
  // Für die Online-Synchronisation wird deshalb bewusst derselbe Server-Lernstand benutzt.
  const originalFetch = window.fetch.bind(window);
  window.fetch = function(input, init) {
    try {
      const rawUrl = typeof input === 'string' ? input : input?.url;
      const url = new URL(rawUrl, location.href);
      if ((url.pathname === '/api/progress' || url.pathname === '/api/progress/load') && init?.body) {
        const payload = JSON.parse(init.body);
        if (payload?.moduleId === CURRENT_ID) {
          const nextInit = {...init, body: JSON.stringify({...payload, moduleId: SHARED_ID})};
          return originalFetch(input, nextInit);
        }
      }
    } catch (_) {}
    return originalFetch(input, init);
  };

  function readState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }

  function readShell() {
    try { return JSON.parse(localStorage.getItem(SHELL_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }

  function forceHomeIntent() {
    const shell = readShell();
    shell.view = 'home';
    try { localStorage.setItem(SHELL_KEY, JSON.stringify(shell)); } catch (_) {}
    if (location.hash !== '#home') history.replaceState(null, '', '#home');
  }

  function currentModule() {
    return (window.FRANZ_MODULES || []).find(m => m.id === CURRENT_ID);
  }

  function lastMission(state, module) {
    const ids = (module?.missionList || []).map(m => Number(m.id));
    const direct = Number(state?.lastEditedMission || state?.currentMission || 0);
    if (ids.includes(direct)) return direct;
    const match = String(state?.currentScreen || '').match(/mission-(\d+)/);
    const fromScreen = match ? Number(match[1]) : 0;
    if (ids.includes(fromScreen)) return fromScreen;
    return ids.find(id => !state?.missionDone?.[id]) || ids[ids.length - 1] || 1;
  }

  let refreshScheduled = false;
  function scheduleRefresh() {
    if (refreshScheduled) return;
    refreshScheduled = true;
    setTimeout(() => {
      refreshScheduled = false;
      refresh();
    }, 30);
  }

  function ensureStyles() {
    if (document.getElementById('w38-home-style')) return;
    const style = document.createElement('style');
    style.id = 'w38-home-style';
    style.textContent = `
      .w38-progress-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 14px}
      .w38-progress-strip>div{border:1px solid #d7dfdc;border-radius:14px;background:#fff;padding:11px 13px}
      .w38-progress-strip small{display:block;color:#526477;font-size:12px;font-weight:800}
      .w38-progress-strip strong{display:block;margin-top:2px;color:#10233f;font-size:19px;line-height:1.2}
      .w38-progress-strip .w38-done{border-color:#9bd1b6;background:#f3fbf6}
      .w38-progress-strip .w38-last{border-color:#e1c077;background:#fffaf0}
      .home-exercise.is-w38-last{box-shadow:0 0 0 2px rgba(233,164,52,.28)}
      .home-exercise.is-w38-open .exercise-index{background:#f3f5f6;color:#526477}
      .home-exercise.is-w38-done .exercise-index{background:#20865d;color:#fff}
      .home-exercise .w38-route-state{font-size:12px;font-weight:900;white-space:nowrap}
      .home-exercise.is-w38-done .w38-route-state{color:#176c4b}
      .home-exercise.is-w38-last .w38-route-state{color:#8b6100}
      @media(max-width:760px){.w38-progress-strip{grid-template-columns:1fr}.home-exercise .w38-route-state{font-size:11px}}
    `;
    document.head.appendChild(style);
  }

  function refresh() {
    const module = currentModule();
    if (!module) return;
    const route = document.getElementById('heroRouteStations');
    if (!route) return;

    ensureStyles();
    const state = readState();
    const ids = module.missionList.map(m => Number(m.id));
    const done = ids.filter(id => !!state?.missionDone?.[id]).length;
    const last = lastMission(state, module);
    const lastData = module.missionList.find(m => Number(m.id) === last) || module.missionList[0];

    const heading = document.querySelector('.week-index-heading');
    if (heading) {
      const h3 = heading.querySelector('h3');
      const p = heading.querySelector('p');
      if (h3) h3.textContent = 'Übungen der Woche 38';
      if (p) p.textContent = 'Ihr Stand aus Woche 37 wurde automatisch übernommen.';
    }

    let strip = document.getElementById('w38ProgressStrip');
    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'w38ProgressStrip';
      strip.className = 'w38-progress-strip';
      route.insertAdjacentElement('beforebegin', strip);
    }
    strip.innerHTML = `
      <div class="w38-done"><small>Bereits bearbeitet</small><strong>${done} von ${ids.length}</strong></div>
      <div><small>Noch offen</small><strong>${Math.max(0, ids.length - done)}</strong></div>
      <div class="w38-last"><small>Zuletzt bearbeitet</small><strong>Übung ${String(last).padStart(2,'0')}</strong></div>
    `;

    route.querySelectorAll('.home-exercise').forEach(button => {
      const id = Number(button.dataset.mission);
      const isDone = !!state?.missionDone?.[id];
      const isLast = id === last;
      button.classList.toggle('is-w38-done', isDone);
      button.classList.toggle('is-w38-open', !isDone);
      button.classList.toggle('is-w38-last', isLast);
      const tail = button.lastElementChild;
      if (tail) {
        tail.classList.add('w38-route-state');
        tail.textContent = isDone ? '✓ Erledigt' : isLast ? 'Zuletzt →' : 'Offen →';
      }
    });

    const primary = document.querySelector('[data-open-current]');
    const primaryLabel = document.getElementById('primaryActionLabel');
    if (primaryLabel) primaryLabel.textContent = state?.currentMission ? 'Zuletzt bearbeitete Übung öffnen' : 'Mit Woche 38 starten';
    if (primary) primary.href = `${module.href}#mission-${last}`;

    const nextCard = document.querySelector('.next-card');
    if (nextCard && lastData) {
      const small = nextCard.querySelector('.small-label');
      if (small) small.textContent = state?.currentMission ? 'Zuletzt bearbeitete Übung' : 'Hier starten';
      const count = document.getElementById('nextStepCount');
      const title = document.getElementById('nextStepTitle');
      const description = document.getElementById('nextStepDescription');
      const time = document.getElementById('nextStepTime');
      const form = document.getElementById('nextStepForm');
      const link = nextCard.querySelector('[data-open-next]');
      if (count) count.textContent = String(last).padStart(2,'0');
      if (title) title.textContent = lastData.title;
      if (description) description.textContent = state?.missionDone?.[last] ? 'Diese Übung ist bereits abgeschlossen. Sie können sie nochmals öffnen.' : lastData.description;
      if (time) time.textContent = lastData.time;
      if (form) form.textContent = lastData.form;
      if (link) {
        link.dataset.mission = String(last);
        link.href = `${module.href}#mission-${last}`;
        link.childNodes[0].nodeValue = state?.currentMission ? 'Weiterarbeiten ' : 'Aufgabe öffnen ';
      }
    }

    const progressLabel = document.getElementById('progressLabel');
    if (progressLabel) progressLabel.textContent = `${done} von ${ids.length} Übungen bearbeitet · ${ids.length - done} noch offen.`;
  }

  function boot() {
    // Beim ersten Aufruf der neuen aktuellen Woche landet man immer in der Wochenübersicht.
    if (!localStorage.getItem(FIRST_LANDING_KEY)) {
      forceHomeIntent();
      try { localStorage.setItem(FIRST_LANDING_KEY, '1'); } catch (_) {}
    }
    document.getElementById('loginForm')?.addEventListener('submit', forceHomeIntent, true);
    window.addEventListener('franz-cloud-state-applied', scheduleRefresh);
    window.addEventListener('pageshow', scheduleRefresh);
    window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) scheduleRefresh(); });
    const holder = document.getElementById('heroRouteStations');
    if (holder) new MutationObserver(scheduleRefresh).observe(holder, {childList:true});
    scheduleRefresh();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();