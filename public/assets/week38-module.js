(() => {
  'use strict';

  const STORAGE_KEY = 'franzoesischLernatelierW37_v1';
  const MISSIONS = [
    [1,'Je reprends mon profil'],
    [2,'Mon école et mon projet'],
    [3,'Je donne des détails'],
    [4,'Écouter quatre profils'],
    [5,'Mon expérience et mon projet'],
    [6,'Ma carte de parole'],
    [7,'Répéter en groupe'],
    [8,'Ma vidéo · Défi final']
  ];

  function state() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }

  function lastMission(s) {
    const ids = MISSIONS.map(([id]) => id);
    const direct = Number(s?.lastEditedMission || s?.currentMission || 0);
    if (ids.includes(direct)) return direct;
    const match = String(s?.currentScreen || '').match(/mission-(\d+)/);
    const screen = match ? Number(match[1]) : 0;
    if (ids.includes(screen)) return screen;
    return ids.find(id => !s?.missionDone?.[id]) || 8;
  }

  function ensureStyle() {
    if (document.getElementById('w38-module-style')) return;
    const style = document.createElement('style');
    style.id = 'w38-module-style';
    style.textContent = `
      .w38-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0 16px}
      .w38-overview>div{padding:15px 16px;border:1px solid #d7dfdc;border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(14,43,66,.05)}
      .w38-overview small{display:block;color:#526477;font-weight:850}.w38-overview strong{display:block;margin-top:3px;font-size:22px;color:#10233f}
      .w38-overview .done{border-color:#9bd1b6;background:#f2fbf5}.w38-overview .last{border-color:#e1c077;background:#fffaf0}
      .mission-card.is-w38-last{box-shadow:0 0 0 3px rgba(233,164,52,.22),0 16px 34px rgba(14,43,66,.10)}
      .mission-card.is-w38-last .mission-state{background:#fff0bf;color:#725000}
      .w38-continuation-note{margin:18px 0 24px;padding:15px 18px;border:1px solid #bcd6d2;border-radius:16px;background:#f8fffd;color:#10233f}
      .w38-continuation-note strong{display:block;color:#0f615b}.w38-continuation-note p{margin:4px 0 0;color:#526477}
      @media(max-width:760px){.w38-overview{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function hideOldExtras() {
    document.querySelectorAll('details.atelier-disclosure').forEach(details => {
      const text = details.querySelector('summary')?.textContent || '';
      if (text.includes('Woche 36 weiterführen') || text.includes('Zusatzaufgaben')) details.hidden = true;
    });
  }

  function decorateStart() {
    const grid = document.getElementById('missionGrid');
    if (!grid) return;
    ensureStyle();
    const s = state();
    const last = lastMission(s);
    const done = MISSIONS.filter(([id]) => !!s?.missionDone?.[id]).length;

    const brand = document.querySelector('.brand-subtitle');
    if (brand) brand.textContent = 'Woche 38 · Qui suis-je ?';

    const hero = document.querySelector('#startScreen .hero-copy');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const h1 = hero.querySelector('h1');
      const lead = hero.querySelector('.lead');
      if (eyebrow) eyebrow.textContent = 'Woche 38 · Weiterarbeiten';
      if (h1) h1.textContent = 'Weiter an «Qui suis-je ?»';
      if (lead) lead.textContent = 'Diese Woche kommen vorläufig keine neuen Aufgaben dazu. Sie arbeiten an den bekannten Übungen weiter. Ihr Stand aus Woche 37 ist bereits übernommen.';
    }

    let note = document.getElementById('w38ContinuationNote');
    if (!note) {
      note = document.createElement('div');
      note.id = 'w38ContinuationNote';
      note.className = 'w38-continuation-note';
      note.innerHTML = '<strong>Woche 38 = weiterarbeiten, nicht neu beginnen</strong><p>Alle acht Übungen sind dieselben wie in Woche 37. Bereits erledigte Übungen bleiben als bearbeitet markiert.</p>';
      const target = grid.closest('section')?.querySelector('.section-head') || grid;
      target.insertAdjacentElement('beforebegin', note);
    }

    let summary = document.getElementById('w38Overview');
    if (!summary) {
      summary = document.createElement('div');
      summary.id = 'w38Overview';
      summary.className = 'w38-overview';
      grid.insertAdjacentElement('beforebegin', summary);
    }
    summary.innerHTML = `
      <div class="done"><small>Bereits bearbeitet</small><strong>${done} von 8</strong></div>
      <div><small>Noch offen</small><strong>${8 - done}</strong></div>
      <div class="last"><small>Zuletzt bearbeitet</small><strong>Übung ${String(last).padStart(2,'0')}</strong></div>
    `;

    grid.querySelectorAll('[data-mission]').forEach(card => {
      const id = Number(card.dataset.mission);
      const isDone = !!s?.missionDone?.[id];
      const isLast = id === last;
      card.classList.toggle('is-w38-last', isLast);
      const status = card.querySelector('.mission-state');
      if (status) status.textContent = isDone ? 'bearbeitet' : isLast ? 'zuletzt bearbeitet' : card.classList.contains('is-working') ? 'in Arbeit' : 'noch offen';
      const go = card.querySelector('.go');
      if (go) go.textContent = isDone ? 'Nochmals öffnen →' : isLast ? 'Hier weiterarbeiten →' : 'Übung öffnen →';
    });

    const progress = document.getElementById('progressText');
    if (progress) progress.textContent = `${done} von 8 bearbeitet · ${8 - done} noch offen`;

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) continueBtn.textContent = s?.currentMission ? `Zuletzt bearbeitete Übung ${last} öffnen →` : `Mit Übung ${last} starten →`;

    hideOldExtras();
  }

  function openLast() {
    const s = state();
    const last = lastMission(s);
    const card = document.querySelector(`#missionGrid [data-mission="${last}"]`);
    if (card) {
      setTimeout(() => card.click(), 0);
      return;
    }
    location.hash = `#mission-${last}`;
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      decorateStart();
    });
  }

  // Der originale Woche-37-Button würde zur nächsten offenen Übung springen.
  // In Woche 38 ist die bewusste Vorgabe: zurück zur zuletzt bearbeiteten Übung.
  document.addEventListener('click', event => {
    if (event.target.closest('#continueBtn')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openLast();
      return;
    }
    if (event.target.closest('[data-go="start"]')) setTimeout(schedule, 0);
  }, true);

  window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) schedule(); });
  window.addEventListener('franz-cloud-state-applied', schedule);
  const observer = new MutationObserver(schedule);
  function start() {
    const grid = document.getElementById('missionGrid');
    if (grid) observer.observe(grid, {childList:true});
    schedule();
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();