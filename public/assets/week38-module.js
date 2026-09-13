(() => {
  'use strict';

  const STORAGE_KEY = 'franzoesischLernatelierW37_v1';
  const HOLIDAY_HREF = 'herbstferien.html';
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

  function holidayInfo(s) {
    const h = s?.week38Holidays || {};
    const done = !!h.completed;
    const stepDone = Object.values(h.stepDone || {}).filter(Boolean).length;
    const started = done || stepDone > 0 || Number(h.currentStep || 1) > 1 || (h.selected || []).length > 0;
    return {done, started, stepDone, currentStep: Math.max(1, Math.min(7, Number(h.currentStep) || 1))};
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
      .w38-chapter{margin:28px 0 8px;border:1px solid #a8c7dc;border-radius:24px;background:linear-gradient(135deg,#f8fbff,#fff 55%,#fff6f2);box-shadow:0 14px 34px rgba(14,43,66,.09);overflow:hidden}
      .w38-chapter-inner{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:18px;align-items:stretch;padding:24px}
      .w38-chapter-kicker{display:inline-flex;padding:6px 10px;border-radius:999px;background:#0b315f;color:#fff;font-size:12px;font-weight:950;letter-spacing:.05em;text-transform:uppercase}
      .w38-chapter h2{margin:12px 0 4px;font-size:31px;line-height:1.08;color:#10233f}.w38-chapter .frq{margin:0;color:#0f615b;font-size:20px;font-weight:850}
      .w38-chapter .desc{margin:13px 0 0;color:#526477;max-width:740px}.w38-chapter-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:15px}.w38-chapter-meta span{padding:6px 9px;border:1px solid #d2e0e8;border-radius:9px;background:#fff;font-size:12px;font-weight:850;color:#425a70}
      .w38-chapter-side{border:1px solid #d7dfdc;border-radius:18px;background:#fff;padding:17px;display:flex;flex-direction:column;justify-content:center}.w38-chapter-side small{font-weight:900;color:#526477;text-transform:uppercase;letter-spacing:.04em}.w38-chapter-side strong{display:block;margin-top:5px;font-size:22px;color:#10233f}.w38-chapter-side p{margin:5px 0 13px;color:#526477;font-size:14px}.w38-chapter-action{min-height:47px;border-radius:12px;background:#177c73;color:#fff;text-decoration:none;font-weight:950;display:flex;align-items:center;justify-content:center;padding:10px 13px}.w38-chapter-action:hover{background:#0f615b}.w38-chapter.is-waiting .w38-chapter-action{background:#0b315f}.w38-chapter.is-done{border-color:#9bd1b6;background:linear-gradient(135deg,#f3fbf6,#fff)}.w38-chapter.is-done .w38-chapter-kicker{background:#20865d}
      .w38-chapter-route{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:16px}.w38-chapter-route span{height:7px;border-radius:999px;background:#dfe6e8}.w38-chapter-route span.on{background:#177c73}
      @media(max-width:900px){.w38-chapter-inner{grid-template-columns:1fr}.w38-chapter-side{display:block}.w38-chapter-route{grid-template-columns:repeat(7,1fr)}}
      @media(max-width:760px){.w38-overview{grid-template-columns:1fr}.w38-chapter-inner{padding:18px}.w38-chapter h2{font-size:27px}}
    `;
    document.head.appendChild(style);
  }

  function hideOldExtras() {
    document.querySelectorAll('details.atelier-disclosure').forEach(details => {
      const text = details.querySelector('summary')?.textContent || '';
      if (text.includes('Woche 36 weiterführen') || text.includes('Zusatzaufgaben')) details.hidden = true;
    });
  }

  function decorateHolidayChapter(grid, s) {
    const h = holidayInfo(s);
    const videoDone = !!s?.missionDone?.[8];
    let chapter = document.getElementById('w38HolidayChapter');
    if (!chapter) {
      chapter = document.createElement('section');
      chapter.id = 'w38HolidayChapter';
      grid.insertAdjacentElement('afterend', chapter);
    }
    chapter.className = `w38-chapter${h.done ? ' is-done' : videoDone ? '' : ' is-waiting'}`;
    const status = h.done ? 'Abgeschlossen' : h.started ? `Etappe ${h.currentStep} von 7` : videoDone ? 'Jetzt starten' : 'Start nach dem Video';
    const action = h.done ? 'Kapitel nochmals öffnen →' : h.started ? 'Weiterarbeiten →' : videoDone ? 'Kapitel starten →' : 'Kapitel ansehen →';
    const helper = h.done
      ? 'Ihr Ferienplan ist gespeichert und kann später wiederverwendet werden.'
      : videoDone
        ? 'Ihre Videoarbeit ist abgeschlossen. Jetzt folgt der neue Einzelarbeits-Teil.'
        : 'Bearbeiten Sie zuerst die offenen Schritte bis zur Videoabgabe. Danach arbeiten Sie hier selbständig weiter.';
    chapter.innerHTML = `
      <div class="w38-chapter-inner">
        <div>
          <span class="w38-chapter-kicker">Zusätzliches Kapitel · nach dem Video</span>
          <h2>Mes vacances d’automne</h2>
          <p class="frq">Qu’est-ce que vous allez faire ?</p>
          <p class="desc">In sieben klar geführten Etappen lernen Sie, über Ihre Herbstferien zu sprechen: Wortschatz wählen, «je vais + Infinitiv» verstehen, eigene Sätze bauen, einen Ferienplan erstellen, Fragen beantworten und 30–45 Sekunden frei sprechen.</p>
          <div class="w38-chapter-meta"><span>≈ 60 Min.</span><span>Einzelarbeit</span><span>7 Etappen</span><span>mit Beispielen & Hilfen</span><span>automatisch gespeichert</span></div>
          <div class="w38-chapter-route" aria-label="Fortschritt im Herbstferien-Kapitel">${Array.from({length:7},(_,i)=>`<span class="${i < h.stepDone ? 'on' : ''}"></span>`).join('')}</div>
        </div>
        <aside class="w38-chapter-side">
          <small>${videoDone ? 'Nach Ihrer Videoabgabe' : 'Reihenfolge'}</small>
          <strong>${status}</strong>
          <p>${helper}</p>
          <a class="w38-chapter-action" href="${HOLIDAY_HREF}">${action}</a>
        </aside>
      </div>`;
  }

  function decorateStart() {
    const grid = document.getElementById('missionGrid');
    if (!grid) return;
    ensureStyle();
    const s = state();
    const last = lastMission(s);
    const done = MISSIONS.filter(([id]) => !!s?.missionDone?.[id]).length;
    const h = holidayInfo(s);

    const brand = document.querySelector('.brand-subtitle');
    if (brand) brand.textContent = 'Woche 38 · Qui suis-je ?';

    const hero = document.querySelector('#startScreen .hero-copy');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const h1 = hero.querySelector('h1');
      const lead = hero.querySelector('.lead');
      if (eyebrow) eyebrow.textContent = 'Woche 38 · Abschliessen und weiterlernen';
      if (h1) h1.textContent = 'Video fertig – und dann?';
      if (lead) lead.textContent = 'Schliessen Sie zuerst die bekannten Übungen aus Woche 37 und Ihr Video ab. Danach wartet unten ein neues 60-Minuten-Kapitel zu Ihren Herbstferien – vollständig in Einzelarbeit.';
    }

    let note = document.getElementById('w38ContinuationNote');
    if (!note) {
      note = document.createElement('div');
      note.id = 'w38ContinuationNote';
      note.className = 'w38-continuation-note';
      const target = grid.closest('section')?.querySelector('.section-head') || grid;
      target.insertAdjacentElement('beforebegin', note);
    }
    note.innerHTML = '<strong>Teil 1 · «Qui suis-je ?» fertigstellen</strong><p>Ihr Stand aus Woche 37 ist übernommen. Erledigen Sie offene Übungen bis zur Videoabgabe. Anschliessend wechseln Sie zum neuen Kapitel «Mes vacances d’automne».</p>';

    let summary = document.getElementById('w38Overview');
    if (!summary) {
      summary = document.createElement('div');
      summary.id = 'w38Overview';
      summary.className = 'w38-overview';
      grid.insertAdjacentElement('beforebegin', summary);
    }
    summary.innerHTML = `
      <div class="done"><small>«Qui suis-je ?» bearbeitet</small><strong>${done} von 8</strong></div>
      <div><small>Noch offen</small><strong>${8 - done}</strong></div>
      <div class="last"><small>Herbstferien-Kapitel</small><strong>${h.done ? 'fertig' : h.started ? `${h.stepDone}/7` : 'danach'}</strong></div>
    `;

    grid.querySelectorAll('[data-mission]').forEach(card => {
      const id = Number(card.dataset.mission);
      const isDone = !!s?.missionDone?.[id];
      const isLast = id === last;
      card.classList.toggle('is-w38-last', isLast && !s?.missionDone?.[8]);
      const status = card.querySelector('.mission-state');
      if (status) status.textContent = isDone ? 'bearbeitet' : isLast ? 'zuletzt bearbeitet' : card.classList.contains('is-working') ? 'in Arbeit' : 'noch offen';
      const go = card.querySelector('.go');
      if (go) go.textContent = isDone ? 'Nochmals öffnen →' : isLast ? 'Hier weiterarbeiten →' : 'Übung öffnen →';
    });

    const progress = document.getElementById('progressText');
    if (progress) progress.textContent = `${done} von 8 bearbeitet · ${8 - done} noch offen`;

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
      if (s?.missionDone?.[8]) continueBtn.textContent = h.done ? 'Herbstferien-Kapitel nochmals öffnen →' : h.started ? 'Im Herbstferien-Kapitel weiterarbeiten →' : 'Jetzt: Mes vacances d’automne →';
      else continueBtn.textContent = s?.currentMission ? `Zuletzt bearbeitete Übung ${last} öffnen →` : `Mit Übung ${last} starten →`;
    }

    decorateHolidayChapter(grid, s);
    hideOldExtras();
  }

  function openNext() {
    const s = state();
    if (s?.missionDone?.[8]) {
      location.href = HOLIDAY_HREF;
      return;
    }
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

  document.addEventListener('click', event => {
    if (event.target.closest('#continueBtn')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openNext();
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
