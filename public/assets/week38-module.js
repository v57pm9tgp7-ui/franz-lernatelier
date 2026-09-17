(() => {
  'use strict';

  const STORAGE_KEY = 'franzoesischLernatelierW37_v1';
  const MISSIONS = [
    [1,'Je reprends mon profil'],
    [2,'Mon école et mon projet'],
    [3,'Je donne des détails'],
    [5,'Mon expérience et mon projet'],
    [6,'Ma carte de parole'],
    [7,'Répéter à deux'],
    [8,'Ma vidéo · Défi final']
  ];
  const IDS = MISSIONS.map(([id]) => id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function state() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }

  function lastMission(s) {
    const direct = Number(s?.lastEditedMission || s?.currentMission || 0);
    if (IDS.includes(direct)) return direct;
    const match = String(s?.currentScreen || '').match(/mission-(\d+)/);
    const screen = match ? Number(match[1]) : 0;
    if (IDS.includes(screen)) return screen;
    return IDS.find(id => !s?.missionDone?.[id]) || 8;
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
      .w38-partner-check{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:14px 0}
      .w38-partner-check>div{border:1px solid #d7dfdc;border-radius:13px;background:#fbfcfd;padding:12px}
      .w38-partner-check strong{display:block;color:#0b315f}.w38-partner-check span{display:block;margin-top:3px;color:#526477;font-size:.9em}
      @media(max-width:760px){.w38-overview,.w38-partner-check{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function hideOldExtras() {
    document.querySelectorAll('details.atelier-disclosure').forEach(details => {
      const text = details.querySelector('summary')?.textContent || '';
      if (text.includes('Woche 36 weiterführen') || text.includes('Zusatzaufgaben')) details.hidden = true;
    });
  }

  function patchMissionFooter() {
    const shell = document.querySelector('#missionMount .mission-shell');
    if (!shell) return;
    const id = Number(shell.querySelector('.mission-number')?.textContent || 0);
    const index = IDS.indexOf(id);
    if (index < 0) return;
    const buttons = shell.querySelectorAll('.mission-nav button');
    if (buttons.length < 2) return;
    const [back, next] = buttons;
    const before = index > 0 ? IDS[index - 1] : null;
    const after = index < IDS.length - 1 ? IDS[index + 1] : null;

    if (before) {
      back.disabled = false;
      back.dataset.mission = String(before);
      back.removeAttribute('data-go');
      if (back.textContent !== '← Vorherige Übung') back.textContent = '← Vorherige Übung';
    } else {
      back.disabled = true;
      back.removeAttribute('data-mission');
    }
    if (after) {
      next.dataset.mission = String(after);
      next.removeAttribute('data-nav-next-week');
      if (next.textContent !== 'Nächste Übung →') next.textContent = 'Nächste Übung →';
    } else {
      next.removeAttribute('data-mission');
      next.setAttribute('data-nav-next-week','');
      if (next.textContent !== 'Alle Wochen →') next.textContent = 'Alle Wochen →';
    }
  }

  function patchPartnerMission() {
    const shell = document.querySelector('#missionMount .mission-shell');
    if (!shell || Number(shell.querySelector('.mission-number')?.textContent || 0) !== 7) return;
    if (shell.dataset.w38Partner === '1') { patchMissionFooter(); return; }
    shell.dataset.w38Partner = '1';
    const s = state();
    const answer = key => esc(s?.answers?.[key] || '');

    const hero = shell.querySelector('.mission-hero');
    const title = hero?.querySelector('h1');
    const description = hero?.querySelector('p');
    const meta = hero?.querySelectorAll('.mission-hero-meta span');
    if (title) title.textContent = 'Répéter à deux';
    if (description) description.textContent = 'Generalprobe zu zweit: sprechen, zuhören, Feedback geben und direkt danach aufnehmen.';
    if (meta?.[0]) meta[0].textContent = '12–18 Min.';
    if (meta?.[1]) meta[1].textContent = 'Partnerarbeit';

    const activities = shell.querySelectorAll('.activity-card');
    if (activities[0]) activities[0].innerHTML = `
      <header class="activity-head"><div><small>A</small><h2>So läuft die Partnerprobe</h2><p>Eine Person spricht. Die andere hört aufmerksam zu. Danach wechseln Sie.</p></div></header>
      <div class="activity-body">
        <ol class="learning-steps">
          <li><strong>Person A spricht 60 Sekunden.</strong> Möglichst ohne sichtbare Karte – genau wie bei der Aufnahme.</li>
          <li><strong>Person B hört nur zu.</strong> Nicht vorsagen und nicht unterbrechen. Achten Sie auf Inhalt, Lautstärke und Tempo.</li>
          <li><strong>Person B gibt kurzes Feedback.</strong> Zuerst eine Sache, die klar war. Danach genau einen konkreten Tipp.</li>
          <li><strong>Rollen wechseln.</strong> Jetzt spricht B 60 Sekunden und A hört zu.</li>
        </ol>
        <div class="w38-partner-check">
          <div><strong>Inhalt</strong><span>Sind die wichtigsten Teile der Vorstellung verständlich?</span></div>
          <div><strong>Stimme</strong><span>Ist die Person gut hörbar und nicht zu schnell?</span></div>
          <div><strong>Frei sprechen</strong><span>Geht es ohne Ablesen und ohne Hilfe?</span></div>
        </div>
      </div>`;

    if (activities[1]) activities[1].innerHTML = `
      <header class="activity-head"><div><small>B</small><h2>Generalprobe direkt vor der Aufnahme</h2><p>Beide machen jetzt je einen vollständigen 60-Sekunden-Durchgang.</p></div></header>
      <div class="activity-body">
        <div class="learning-stack">
          <div class="learning-card"><h3>1 · Person A spricht</h3><p>A steht auf und spricht 60 Sekunden ohne sichtbare Hilfe. B hört zu und gibt danach einen einzigen Tipp für die Aufnahme.</p><label for="w38-feedback-a">Mein Tipp an A</label><textarea id="w38-feedback-a" data-learn-field="group.feedback.0" data-no-writing-help placeholder="Zum Beispiel: Sprich beim Schluss etwas langsamer.">${answer('group.feedback.0')}</textarea></div>
          <div class="learning-card"><h3>2 · Person B spricht</h3><p>B steht auf und spricht 60 Sekunden ohne sichtbare Hilfe. A hört zu und gibt danach einen einzigen Tipp für die Aufnahme.</p><label for="w38-feedback-b">Mein Tipp an B</label><textarea id="w38-feedback-b" data-learn-field="group.feedback.1" data-no-writing-help placeholder="Zum Beispiel: Sprich den Berufswunsch deutlicher.">${answer('group.feedback.1')}</textarea></div>
        </div>
        <div class="learning-toolbar"><button type="button" class="primary-btn" data-timer="60" data-timer-target="group60">60 Sekunden starten</button><strong id="group60" class="timer-display">1:00</strong><button type="button" class="secondary-btn" data-stop-timer>Timer stoppen</button></div>
        <div class="learning-model"><p><strong>Feedback kurz halten:</strong> Eine Stärke + ein konkreter Tipp genügen.</p><p lang="fr">J’ai bien compris … <span lang="de">– Ich habe … gut verstanden.</span></p><p lang="fr">Parle un peu plus fort / lentement. <span lang="de">– Sprich etwas lauter / langsamer.</span></p></div>
        <p><strong>Danach:</strong> Nicht nochmals lange üben. Wechseln Sie direkt zu Übung 8 und nehmen Sie das Video auf.</p>
      </div>`;

    const labels = shell.querySelectorAll('.complete-card .completion-checks label span');
    const completion = [
      'Person A hat 60 Sekunden gesprochen und Feedback erhalten.',
      'Person B hat 60 Sekunden gesprochen und Feedback erhalten.',
      'Wir sind bereit für die Aufnahme: ohne Karte, gut hörbar und verständlich.'
    ];
    labels.forEach((label, index) => { if (completion[index]) label.textContent = completion[index]; });
    patchMissionFooter();
  }

  function patchNavigationFallback() {
    const week = document.querySelector('[data-nav-week]');
    if (week && week.querySelector('option[value="38"]')) week.value = '38';
    document.querySelector('[data-nav-exercise] option[value="mission-4"]')?.remove();
  }

  function decorateStart() {
    const grid = document.getElementById('missionGrid');
    if (!grid) return;
    ensureStyle();
    const s = state();
    const last = lastMission(s);
    const done = IDS.filter(id => !!s?.missionDone?.[id]).length;

    const brand = document.querySelector('.brand-subtitle');
    if (brand) brand.textContent = 'Woche 38 · Qui suis-je ?';

    const hero = document.querySelector('#startScreen .hero-copy');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const h1 = hero.querySelector('h1');
      const lead = hero.querySelector('.lead');
      if (eyebrow) eyebrow.textContent = 'Woche 38 · Weiterarbeiten';
      if (h1) h1.textContent = 'Weiter an «Qui suis-je ?»';
      if (lead) lead.textContent = 'Sie arbeiten an sieben bekannten Übungen aus Woche 37 weiter. Übung 4 wird diese Woche ausgelassen; Ihr bisheriger Lernstand bleibt erhalten.';
    }

    let note = document.getElementById('w38ContinuationNote');
    if (!note) {
      note = document.createElement('div');
      note.id = 'w38ContinuationNote';
      note.className = 'w38-continuation-note';
      const target = grid.closest('section')?.querySelector('.section-head') || grid;
      target.insertAdjacentElement('beforebegin', note);
    }
    note.innerHTML = '<strong>Woche 38 = gezielt weiterarbeiten</strong><p>Sie sehen sieben Übungen aus Woche 37. Übung 4 «Écouter quatre profils» ist in Woche 38 nicht mehr Teil des Arbeitswegs.</p>';

    let summary = document.getElementById('w38Overview');
    if (!summary) {
      summary = document.createElement('div');
      summary.id = 'w38Overview';
      summary.className = 'w38-overview';
      grid.insertAdjacentElement('beforebegin', summary);
    }
    summary.innerHTML = `
      <div class="done"><small>Bereits bearbeitet</small><strong>${done} von ${IDS.length}</strong></div>
      <div><small>Noch offen</small><strong>${IDS.length - done}</strong></div>
      <div class="last"><small>Zuletzt bearbeitet</small><strong>Übung ${String(last).padStart(2,'0')}</strong></div>
    `;

    grid.querySelectorAll('[data-mission]').forEach(card => {
      const id = Number(card.dataset.mission);
      if (!IDS.includes(id)) { card.hidden = true; return; }
      card.hidden = false;
      const isDone = !!s?.missionDone?.[id];
      const isLast = id === last;
      card.classList.toggle('is-w38-last', isLast);
      if (id === 7) {
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        const meta = card.querySelectorAll('.mission-meta span');
        if (h3) h3.textContent = 'Répéter à deux';
        if (p) p.textContent = 'Generalprobe zu zweit: sprechen, zuhören, Feedback geben und direkt danach aufnehmen.';
        if (meta?.[0]) meta[0].textContent = '12–18 Min.';
        if (meta?.[1]) meta[1].textContent = 'Partnerarbeit';
      }
      const status = card.querySelector('.mission-state');
      if (status) status.textContent = isDone ? 'bearbeitet' : isLast ? 'zuletzt bearbeitet' : card.classList.contains('is-working') ? 'in Arbeit' : 'noch offen';
      const go = card.querySelector('.go');
      if (go) go.textContent = isDone ? 'Nochmals öffnen →' : isLast ? 'Hier weiterarbeiten →' : 'Übung öffnen →';
    });

    const progress = document.getElementById('progressText');
    if (progress) progress.textContent = `${done} von ${IDS.length} bearbeitet · ${IDS.length - done} noch offen`;

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) continueBtn.textContent = s?.currentMission && IDS.includes(Number(s.currentMission)) ? `Zuletzt bearbeitete Übung ${last} öffnen →` : `Mit Übung ${last} starten →`;

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
      patchPartnerMission();
      patchMissionFooter();
      patchNavigationFallback();
    });
  }

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

  function start() {
    const grid = document.getElementById('missionGrid');
    const mount = document.getElementById('missionMount');
    const nav = document.querySelector('.atelier-nav');
    const observer = new MutationObserver(schedule);
    if (grid) observer.observe(grid, {childList:true,subtree:true});
    if (mount) observer.observe(mount, {childList:true,subtree:true});
    if (nav) observer.observe(nav, {childList:true,subtree:true});
    schedule();
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
