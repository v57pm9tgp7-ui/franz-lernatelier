(() => {
  'use strict';

  const WEEK36_STORAGE = 'franzoesischLernatelierEinstieg_v1';
  const FLOW = [7, 5, 8]; // Bordeaux → Marseille → Nice
  let applying = false;
  let scheduled = false;

  function qs(selector, root=document){ return root.querySelector(selector); }
  function qsa(selector, root=document){ return [...root.querySelectorAll(selector)]; }

  function readState(){
    try { return JSON.parse(localStorage.getItem(WEEK36_STORAGE) || '{}'); }
    catch (_) { return {}; }
  }

  function writeState(state){
    try { localStorage.setItem(WEEK36_STORAGE, JSON.stringify(state)); }
    catch (_) {}
  }

  function setText(el, text){ if (el && el.textContent !== text) el.textContent = text; }
  function removeDataset(el, key){ if (el && key in el.dataset) delete el.dataset[key]; }

  function injectStyle(){
    if (document.getElementById('w36-flow-style')) return;
    const style = document.createElement('style');
    style.id = 'w36-flow-style';
    style.textContent = `
      .w36-flow-card{
        margin:18px 0 0;border:1px solid #b9cde5;border-radius:18px;
        background:linear-gradient(145deg,#f4f8ff,#fff);overflow:hidden;
      }
      .w36-flow-head{padding:16px 18px;background:#0b315f;color:#fff}
      .w36-flow-head small{display:block;color:#d8e8fb;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
      .w36-flow-head h3{margin:3px 0 0;font-size:22px;color:#fff}
      .w36-flow-body{padding:16px 18px}
      .w36-flow-body>p{margin:0 0 13px;color:#526477}
      .w36-flow-roles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
      .w36-flow-role{border:1px solid #d7e2ef;border-radius:13px;background:#fff;padding:12px}
      .w36-flow-role b{display:grid;place-items:center;width:30px;height:30px;border-radius:9px;background:#eaf0ff;color:#1d4ed8;margin-bottom:8px}
      .w36-flow-role strong{display:block;color:#10233f}
      .w36-flow-role span{display:block;margin-top:3px;color:#526477;font-size:13px;line-height:1.4}
      .w36-flow-note{margin-top:12px;padding:11px 13px;border:1px solid #ead28e;border-radius:12px;background:#fff7df;color:#6a4c0b;font-size:13px}
      .w36-route-mini{display:grid;gap:10px;margin:17px 0}
      .w36-route-step{display:grid;grid-template-columns:42px minmax(0,1fr);gap:12px;align-items:start;border:1px solid #d9e3ef;border-radius:14px;background:#fff;padding:13px}
      .w36-route-step b{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:#edf3ff;color:#1d4ed8}
      .w36-route-step:nth-child(2) b{background:#fff6df;color:#815800}
      .w36-route-step:nth-child(3) b{background:#ffe9ea;color:#b93643}
      .w36-route-step:nth-child(4) b{background:#eef2f7;color:#102a43}
      .w36-route-step strong{display:block;font-size:16px;color:#10233f}
      .w36-route-step span{display:block;margin-top:2px;color:#526477;font-size:13px;line-height:1.4}
      .w36-flow-order{display:inline-flex;margin:8px 0 0;padding:5px 8px;border-radius:999px;background:#eef4fb;color:#0b315f;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.04em}
      .w36-legacy-hidden{display:none!important}
      @media(max-width:760px){.w36-flow-roles{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function ensureBackLink(){
    document.title = 'Franz Lernatelier – Woche 36';
    const actions = qs('.topbar-actions');
    if (!actions || actions.querySelector('[data-back-to-atelier]')) return;
    const link = document.createElement('a');
    link.className = 'top-action app-link';
    link.href = '../../index.html';
    link.dataset.backToAtelier = '';
    link.innerHTML = '<span aria-hidden="true">←</span><span class="app-word">Lernatelier</span>';
    actions.prepend(link);
  }

  function addMission2SpeakingGuide(){
    const mission = qs('#mission-2');
    if (!mission) return;
    const activity = qsa('.activity-card', mission).find(card => /Sprechtraining/i.test(qs('.activity-head h2', card)?.textContent || ''));
    const body = activity && qs('.activity-body', activity);
    if (!body || qs('[data-m2-speaking-guide]', body)) return;
    const box = document.createElement('section');
    box.dataset.m2SpeakingGuide = '';
    box.className = 'w36-flow-card';
    box.innerHTML = `
      <div class="w36-flow-head"><small>Gesprächsfahrplan</small><h3>So läuft Ihr Mini-Gespräch ab</h3></div>
      <div class="w36-flow-body">
        <div class="w36-flow-roles">
          <div class="w36-flow-role"><b>1</b><strong lang="fr">Bonjour ! / Salut !</strong><span>Begrüssen.</span></div>
          <div class="w36-flow-role"><b>2</b><strong lang="fr">Comment ça va ?</strong><span>Nach dem Befinden fragen.</span></div>
          <div class="w36-flow-role"><b>3</b><strong lang="fr">Ça va bien, merci. Et toi ?</strong><span>Antworten und zurückfragen.</span></div>
        </div>
        <div class="w36-flow-note"><strong>Trainieren Sie in drei Durchgängen:</strong> zuerst mit Hilfe, dann nur mit den Schritten, zuletzt möglichst frei.</div>
      </div>`;
    body.prepend(box);
  }

  function patchStart(){
    const start = qs('#start');
    if (!start) return;
    setText(qs('.selection-copy h1', start), 'Woche 36 abschliessen');
    setText(qs('.selection-copy .lead', start), 'Bevor Woche 37 beginnt, schliessen Sie drei wichtige Stationen ab: 20 Questions vorbereiten, daraus eine persönliche Vorstellung aufbauen und zum Schluss möglichst frei sprechen.');
    const sideP = qsa('.selection-side p', start).pop();
    setText(sideP, 'Bordeaux → 20 Questions in Dreiergruppen → Marseille → Nice.');

    const routeTitle = qs('#routeTitle');
    setText(routeTitle, 'Ihr Abschlussweg für Woche 36');
    const routeIntro = routeTitle?.parentElement?.querySelector('p');
    setText(routeIntro, 'Die Reihenfolge steht fest. Die eigentliche 20-Questions-Sprechphase findet mit der Präsentation in Dreiergruppen statt.');

    const grid = qs('.route-grid', start);
    if (grid && !grid.dataset.w36Fixed) {
      grid.dataset.w36Fixed = '1';
      grid.className = 'w36-route-mini';
      grid.innerHTML = `
        <div class="w36-route-step"><b>1</b><div><strong>Bordeaux · 20 Questions vorbereiten</strong><span>Vier Fragen auswählen und eigene Antworten vorbereiten.</span></div></div>
        <div class="w36-route-step"><b>2</b><div><strong>20 Questions · Dreiergruppen</strong><span>Die Präsentation steuert Fragen, Rollenwechsel und neue Gruppen. Diese Phase findet ausserhalb des Lernateliers statt.</span></div></div>
        <div class="w36-route-step"><b>3</b><div><strong>Marseille · Mon profil express</strong><span>Aus einzelnen Antworten entsteht eine persönliche Vorstellung.</span></div></div>
        <div class="w36-route-step"><b>4</b><div><strong>Nice · Défi final</strong><span>Zum Abschluss möglichst frei und verständlich sprechen.</span></div></div>`;
    }
    const routeNote = qs('.route-note', start);
    if (routeNote) routeNote.classList.add('w36-legacy-hidden');
    setText(qs('#startLearning', start), 'Restweg öffnen →');
  }

  function stateDone(id){ return !!readState()?.missionDone?.[id]; }

  function patchDashboard(){
    const dashboard = qs('#dashboard');
    if (!dashboard) return;
    const state = readState();
    const done = FLOW.filter(id => !!state?.missionDone?.[id]).length;
    const next = FLOW.find(id => !state?.missionDone?.[id]);
    const names = {7:'Bordeaux',5:'Marseille',8:'Nice'};
    const pct = Math.round(done / FLOW.length * 100);

    setText(qs('#dashboardTitle'), 'Woche 36 · der Abschlussweg');
    setText(qs('#dashboardLead'), 'Noch drei Lernatelier-Stationen. Dazwischen liegt die gemeinsame 20-Questions-Phase in Dreiergruppen. Speed-Dating gehört nicht mehr zu diesem Lernweg.');
    setText(qs('#routeDuration'), 'Abschluss Woche 36');
    setText(qs('#progressNumber'), `${done}/3`);
    const ring = qs('#progressRing');
    if (ring) ring.style.setProperty('--progress', `${pct * 3.6}deg`);
    setText(qs('#progressMessage'), done === 3 ? 'Woche 36 ist abgeschlossen.' : `Nächster Schritt: ${names[next]}.`);
    setText(qs('#dashboardCityShort'), next ? names[next] : 'Woche 37');
    setText(qs('#dashboardPointsShort'), String(done * 100));
    setText(qs('#passportPoints'), String(done * 100));
    const pointsLabel = qs('#passportPoints')?.parentElement?.querySelector('span');
    setText(pointsLabel, 'Punkte von 300');
    const badges = qs('#badgeGrid');
    if (badges) badges.innerHTML = [
      [7,'B','Bordeaux vorbereitet'],[5,'M','Marseille geschafft'],[8,'N','Nice geschafft']
    ].map(([id,icon,label]) => `<div class="badge${state?.missionDone?.[id]?' is-earned':''}"><i>${icon}</i><span>${label}</span></div>`).join('');

    const section = qsa('.section-intro', dashboard).find(x => /acht Escales|Ihre acht Escales/i.test(x.textContent || ''));
    if (section) {
      setText(qs('h2', section), 'Noch drei Escales aus Woche 36');
      setText(qs('p', section), 'Bearbeiten Sie zuerst Bordeaux. Nach der 20-Questions-Gruppenphase folgen Marseille und Nice.');
    }

    const grid = qs('#missionGrid');
    if (grid) {
      const cards = new Map(qsa('[data-open-mission]', grid).map(card => [Number(card.dataset.openMission), card]));
      qsa('[data-open-mission]', grid).forEach(card => card.classList.add('w36-legacy-hidden'));
      FLOW.forEach((id, index) => {
        const card = cards.get(id);
        if (!card) return;
        card.classList.remove('w36-legacy-hidden', 'is-extra');
        const routeChip = qsa('.meta-chip', card).find(x => /Route|Zusatzmission|Lernweg/i.test(x.textContent || ''));
        setText(routeChip, index === 0 ? '1 · zuerst' : index === 1 ? '2 · danach' : '3 · Abschluss');
        let order = qs('.w36-flow-order', card);
        if (!order) {
          order = document.createElement('span');
          order.className = 'w36-flow-order';
          const h3 = qs('h3', card);
          h3?.insertAdjacentElement('afterend', order);
        }
        order.textContent = index === 0 ? 'Jetzt zuerst' : index === 1 ? 'Nach der Gruppenphase' : 'Zum Schluss';
        grid.appendChild(card);
      });
    }

    const rail = qs('#routeStops');
    if (rail) {
      const stops = new Map(qsa('[data-open-mission]', rail).map(stop => [Number(stop.dataset.openMission), stop]));
      qsa('[data-open-mission]', rail).forEach(stop => stop.classList.add('w36-legacy-hidden'));
      FLOW.forEach(id => {
        const stop = stops.get(id);
        if (!stop) return;
        stop.classList.remove('w36-legacy-hidden','is-extra');
        rail.appendChild(stop);
      });
      rail.style.gridTemplateColumns = 'repeat(3,minmax(150px,1fr))';
    }

    const continueBtn = qs('#continueLearning');
    if (continueBtn) {
      if (next) {
        continueBtn.dataset.continueMission = String(next);
        removeDataset(continueBtn, 'w36ToWeek37');
        continueBtn.textContent = `Weiter nach ${names[next]} →`;
      } else {
        continueBtn.dataset.continueMission = '';
        continueBtn.dataset.w36ToWeek37 = '1';
        continueBtn.textContent = 'Woche 37 starten →';
      }
    }
  }

  function markLegacyInterviewAsSatisfied(mission){
    const legacy = qs('input[data-check="m7.interview"]', mission);
    if (legacy && !legacy.checked) {
      legacy.checked = true;
      legacy.dispatchEvent(new Event('change', {bubbles:true}));
    }
  }

  function activityByLetter(mission, letter){
    return qsa('.activity-card', mission).find(card => (qs('.activity-head h2', card)?.textContent || '').trim().startsWith(`${letter}.`));
  }

  function patchBordeaux(){
    const mission = qs('#mission-7');
    if (!mission) return;
    markLegacyInterviewAsSatisfied(mission);

    setText(qs('.task-position', mission), 'Schritt 1 von 3 · Bordeaux · 20 Questions vorbereiten');
    setText(qs('.mission-banner p', mission), 'Vier Fragen auswählen · eigene Antworten vorbereiten');
    const goal = qs('.goal-box p', mission);
    setText(goal, 'Sie wählen vier Fragen aus mindestens drei Kategorien und bereiten eigene, wahrheitsgetreue Antworten vor. Gesprochen wird danach mit der 20-Questions-Präsentation in Dreiergruppen.');

    const c = activityByLetter(mission, 'C');
    const d = activityByLetter(mission, 'D');
    c?.remove(); d?.remove();

    const bodyB = qs('.activity-card:nth-of-type(2) .activity-body', mission) || qsa('.activity-card', mission)[1]?.querySelector('.activity-body');
    if (!qs('[data-w36-class-transition]', mission)) {
      const transition = document.createElement('section');
      transition.className = 'activity-card w36-class-transition';
      transition.dataset.w36ClassTransition = '1';
      transition.innerHTML = `
        <header class="activity-head"><div><h2>C. Danach: 20 Questions in Dreiergruppen</h2><p>Diese Sprechphase findet bewusst nicht nochmals im Lernatelier statt.</p></div><span class="activity-tag">Präsentation</span></header>
        <div class="activity-body">
          <div class="w36-flow-card" style="margin:0">
            <div class="w36-flow-head"><small>Nächster Unterrichtsschritt</small><h3>Notebook bleibt als Hilfe bereit – gesprochen wird in der Gruppe</h3></div>
            <div class="w36-flow-body"><p>Herr Marti zeigt mit der 20-Questions-Präsentation die Fragen und die Rollen. Arbeiten Sie in einer Dreiergruppe und wechseln Sie die Rollen.</p>
              <div class="w36-flow-roles">
                <div class="w36-flow-role"><b>A</b><strong>fragt</strong><span>wählt eine Frage und hört aufmerksam zu.</span></div>
                <div class="w36-flow-role"><b>B</b><strong>antwortet</strong><span>antwortet in einem ganzen Satz und ergänzt wenn möglich ein Detail.</span></div>
                <div class="w36-flow-role"><b>C</b><strong>hört zu</strong><span>achtet auf Verständlichkeit und eine passende Rückfrage.</span></div>
              </div>
              <div class="w36-flow-note"><strong>Wichtig:</strong> Starten Sie diese Phase erst, wenn die Präsentation das Signal gibt. Danach geht es im Lernatelier mit Marseille weiter.</div>
            </div>
          </div>
        </div>`;
      const cards = qsa('.activity-card', mission);
      const b = cards.find(card => (qs('.activity-head h2', card)?.textContent || '').startsWith('B.'));
      b?.insertAdjacentElement('afterend', transition);
    }

    const finish = qs('.finish-card', mission);
    if (finish) {
      setText(qs('.side-label', finish), 'Bordeaux vorbereitet, wenn …');
      const p = qs('p', finish);
      setText(p, 'Vier Fragen aus mindestens drei Kategorien sind ausgewählt und mit eigenen Antworten vorbereitet. Das eigentliche Gespräch folgt anschliessend mit der Präsentation.');
      const state = readState();
      const ids = (state.selectedQuestions || []).map(Number);
      const selectedCards = qsa('.question-card.is-selected', mission);
      const categories = new Set(selectedCards.map(card => qs('.question-category', card)?.textContent?.trim()).filter(Boolean));
      const answered = ids.filter(id => String(state?.answers?.[`m7.q${id}.answer`] || '').trim()).length;
      let visiblePct = Math.round(Math.min(4, ids.length) / 4 * 40 + Math.min(4, answered) / 4 * 60);
      if (ids.length === 4 && categories.size < 3) visiblePct = Math.min(visiblePct, 85);
      const ready = ids.length === 4 && categories.size >= 3 && answered === 4;
      if (ready) visiblePct = 100;
      setText(qs('[id^="missionProgressText"]', finish), `${visiblePct}%`);
      const bar = qs('.mini-progress span', finish); if (bar) bar.style.width = `${visiblePct}%`;
    }

    const footer = qs('.task-footer', mission);
    if (footer) {
      const prev = qs('.nav-btn.prev', footer);
      const next = qs('.nav-btn.next', footer);
      if (prev) { prev.textContent = '← Übersicht'; prev.dataset.go = 'dashboard'; removeDataset(prev,'openMission'); }
      if (next) { next.textContent = 'Nach der Gruppenphase: Marseille →'; next.dataset.openMission = '5'; removeDataset(next,'go'); }
      const done = qs('.finish-btn', footer);
      if (done) done.textContent = stateDone(7) ? 'Bordeaux vorbereitet ✓' : 'Vorbereitung abschliessen & stempeln';
    }
  }

  function patchMarseille(){
    const mission = qs('#mission-5');
    if (!mission) return;
    setText(qs('.task-position', mission), 'Schritt 2 von 3 · Marseille · Mon profil express');
    const footer = qs('.task-footer', mission);
    if (footer) {
      const prev = qs('.nav-btn.prev', footer);
      const next = qs('.nav-btn.next', footer);
      if (prev) { prev.textContent = '← Bordeaux'; prev.dataset.openMission = '7'; removeDataset(prev,'go'); }
      if (next) { next.textContent = 'Weiter nach Nice →'; next.dataset.openMission = '8'; removeDataset(next,'go'); }
    }
  }

  function patchNice(){
    const mission = qs('#mission-8');
    if (!mission) return;
    setText(qs('.task-position', mission), 'Schritt 3 von 3 · Nice · Défi final');
    const footer = qs('.task-footer', mission);
    if (footer) {
      const prev = qs('.nav-btn.prev', footer);
      const next = qs('.nav-btn.next', footer);
      if (prev) { prev.textContent = '← Marseille'; prev.dataset.openMission = '5'; removeDataset(prev,'go'); }
      if (next) {
        next.textContent = 'Danach: Woche 37 →';
        next.dataset.w36ToWeek37 = '1';
        removeDataset(next,'openMission'); removeDataset(next,'go');
      }
    }
  }

  function removeSpeedDating(){
    const mission = qs('#mission-6');
    if (mission?.classList.contains('is-active')) {
      const state = readState();
      state.currentScreen = 'dashboard'; state.currentMission = null;
      writeState(state);
      qs('[data-go="dashboard"]')?.click();
    }
    qs('#mission-6')?.remove();
  }

  function patchTeacherHelp(){
    const panel = qs('[data-help-panel="teacher"]');
    if (!panel || panel.dataset.w36FlowPatched) return;
    panel.dataset.w36FlowPatched = '1';
    const p = qs('p', panel);
    setText(p, 'Der Abschluss von Woche 36 verbindet gezielte Online-Vorbereitung mit einer realen Sprechphase in Dreiergruppen. Speed-Dating ist aus dem Lernweg entfernt.');
    const steps = qs('.help-steps', panel);
    if (steps) steps.innerHTML = `
      <div class="help-step"><div><strong>1 · Bordeaux:</strong><br>Vier 20-Questions-Fragen auswählen und Antworten vorbereiten.</div></div>
      <div class="help-step"><div><strong>2 · Präsentation:</strong><br>20 Questions in wechselnden Dreiergruppen sprechen; das Lernatelier dient nur als Hilfe.</div></div>
      <div class="help-step"><div><strong>3 · Marseille:</strong><br>Persönliche Informationen zu einer kurzen Vorstellung ordnen und laut erproben.</div></div>
      <div class="help-step"><div><strong>4 · Nice:</strong><br>Défi final abschliessen; danach beginnt Woche 37.</div></div>`;
  }

  function apply(){
    if (applying) return;
    applying = true;
    try {
      injectStyle();
      ensureBackLink();
      addMission2SpeakingGuide();
      patchStart();
      patchDashboard();
      removeSpeedDating();
      patchBordeaux();
      patchMarseille();
      patchNice();
      patchTeacherHelp();
    } finally {
      applying = false;
    }
  }

  function scheduleApply(){
    if (scheduled || applying) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; apply(); });
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-w36-to-week37]');
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.href = '../woche-37/index.html';
  }, true);

  const observer = new MutationObserver(scheduleApply);
  function start(){
    apply();
    if (document.body) observer.observe(document.body, {childList:true, subtree:true});
    window.addEventListener('storage', scheduleApply);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
