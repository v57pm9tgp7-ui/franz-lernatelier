(() => {
  'use strict';

  const STORAGE_KEY = 'franzoesischLernatelierW37_v1';
  const FINAL_TEXT_KEY = 'w38.finalText';
  const VOICE_PREF_KEY = 'franzLernatelierSpeech_v1';
  const MISSIONS = [
    [1,'Je reprends mon profil'],
    [2,'Mon école et mon projet'],
    [3,'Je donne des détails'],
    [5,'Mon expérience et mon projet'],
    [6,'Mon texte final'],
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
      .w38-final-editor{display:grid;gap:10px}.w38-final-editor textarea{width:100%;min-height:410px;resize:vertical;border:2px solid #b8c8c4;border-radius:14px;background:#fff;color:#10233f;padding:16px 17px;font-size:1.02em;line-height:1.62}.w38-final-editor textarea:focus{border-color:#177c73;box-shadow:0 0 0 4px rgba(23,124,115,.16);outline:none}.w38-final-note{margin:0;color:#526477}.w38-final-tools{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.w38-final-tools button{min-height:42px;border:1px solid #b8c8c4;border-radius:11px;background:#fff;color:#10233f;padding:8px 12px;font-weight:900;cursor:pointer}.w38-final-tools button:hover{border-color:#177c73;background:#f4fbf9}.w38-final-save{font-size:.86em;font-weight:850;color:#176c4b}.w38-print-box{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:4px;padding:15px 16px;border:1px solid #d8bd7b;border-radius:14px;background:#fffaf0}.w38-print-box div{min-width:0}.w38-print-box strong{display:block;color:#604710}.w38-print-box p{margin:4px 0 0;color:#526477;line-height:1.45}.w38-print-box button{flex:0 0 auto;min-height:44px;border:1px solid #0b315f;border-radius:11px;background:#0b315f;color:#fff;padding:8px 14px;font-weight:900;cursor:pointer}.w38-print-box button:hover{background:#08264a;border-color:#08264a}.w38-print-box-prominent{margin:4px 0 8px;border-width:2px;box-shadow:0 10px 24px rgba(14,43,66,.08)}.w38-voice-coach{padding:17px 18px;border:1px solid #afc8e2;border-radius:16px;background:linear-gradient(135deg,#f4f8ff,#fff)}.w38-voice-copy strong{font-size:1.08em;color:#0b315f}.w38-voice-copy p{margin:5px 0 14px;color:#526477}.w38-voice-controls{display:flex;align-items:end;gap:9px;flex-wrap:wrap}.w38-voice-controls label{display:grid;gap:4px;color:#455969;font-size:.85em;font-weight:850}.w38-voice-controls select{min-height:42px;border:1px solid #b8c8c4;border-radius:10px;background:#fff;color:#10233f;padding:7px 34px 7px 10px}.w38-voice-controls button{min-height:42px;border-radius:11px;padding:8px 12px;font-weight:900;cursor:pointer}.w38-voice-play{border:1px solid #0b315f;background:#0b315f;color:#fff}.w38-voice-stop{border:1px solid #b8c8c4;background:#fff;color:#10233f}.w38-voice-status{margin:10px 0 0;color:#526477;font-size:.86em}
      @media(max-width:760px){.w38-overview,.w38-partner-check{grid-template-columns:1fr}.w38-final-editor textarea{min-height:330px}.w38-print-box{align-items:stretch;flex-direction:column}.w38-print-box button{width:100%}.w38-voice-controls{display:grid;grid-template-columns:1fr 1fr}.w38-voice-controls button{width:100%}}
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

  function generatedFinalText() {
    const s = state();
    const api = window.FranzWeek37CardUpgrade;
    if (!api?.buildFullText) return '';
    return api.buildFullText(s).join('\n').trim();
  }

  function currentFinalText() {
    const saved = String(state()?.answers?.[FINAL_TEXT_KEY] || '').trim();
    return saved || generatedFinalText();
  }

  function voicePrefs() {
    try { return {...{voice:'female',rate:'1'}, ...(JSON.parse(localStorage.getItem(VOICE_PREF_KEY) || '{}') || {})}; }
    catch (_) { return {voice:'female',rate:'1'}; }
  }

  function voicePanel() {
    const prefs = voicePrefs();
    return `<section class="w38-voice-coach" aria-labelledby="w38VoiceTitle">
      <div class="w38-voice-copy"><strong id="w38VoiceTitle">Meinen Text anhören</strong><p>Hören Sie genau den Text an, der oben im Feld steht. Danach sprechen Sie ihn selbst – möglichst ohne mitzulesen.</p></div>
      <div class="w38-voice-controls">
        <label>Stimme<select data-w37-voice><option value="female" ${prefs.voice==='female'?'selected':''}>weibliche Stimme</option><option value="male" ${prefs.voice==='male'?'selected':''}>männliche Stimme</option></select></label>
        <label>Tempo<select data-w37-rate><option value="1" ${String(prefs.rate)==='1'?'selected':''}>normal</option><option value="0.72" ${String(prefs.rate)==='0.72'?'selected':''}>langsamer</option></select></label>
        <button type="button" class="w38-voice-play" data-w37-speak-full>▶ Text vorlesen</button>
        <button type="button" class="w38-voice-stop" data-w37-stop-speech>■ Stoppen</button>
      </div>
      <p class="w38-voice-status w37-voice-status" data-w37-voice-status role="status" aria-live="polite">Wählen Sie Stimme und Tempo und starten Sie dann das Vorlesen.</p>
    </section>`;
  }

  function resizeFinalText(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(410, Math.min(textarea.scrollHeight + 4, 760))}px`;
  }

  function patchFinalTextMission() {
    const shell = document.querySelector('#missionMount .mission-shell');
    if (!shell || Number(shell.querySelector('.mission-number')?.textContent || 0) !== 6) return;
    if (shell.dataset.w38FinalText === '1') { patchMissionFooter(); return; }
    const text = currentFinalText();
    // Beim ersten Öffnen warten wir kurz auf den zentralen Textgenerator. So wird niemals ein leeres Feld erzeugt.
    if (!text && !window.FranzWeek37CardUpgrade?.buildFullText) { setTimeout(schedule, 100); return; }
    shell.dataset.w38FinalText = '1';

    const hero = shell.querySelector('.mission-hero');
    const title = hero?.querySelector('h1');
    const description = hero?.querySelector('p');
    if (title) title.textContent = 'Mon texte final';
    if (description) description.textContent = 'Ihr vollständiger Text für die Aufnahme: prüfen, ändern, ergänzen oder streichen.';

    const activities = shell.querySelectorAll('.activity-card');
    if (activities[0]) activities[0].innerHTML = `
      <header class="activity-head"><div><small>A</small><h2>Mein kompletter Text</h2><p>Aus Ihren bisherigen Übungen ist jetzt eine vollständige Vorstellung entstanden. Machen Sie daraus Ihren eigenen Text.</p></div></header>
      <div class="activity-body">
        <div class="w38-final-editor">
          <p class="w38-final-note"><strong>Sie entscheiden über den Text:</strong> Sie können Wörter oder ganze Sätze ändern, ergänzen oder löschen. Der Text muss zu Ihnen passen und sich gut sprechen lassen.</p>
          <section class="w38-print-box w38-print-box-prominent" aria-label="Sprechkarte drucken"><div><strong>🖨 Sprechkarte für die Generalprobe drucken</strong><p>Die Karte bleibt verfügbar: vorne kompakte Stichwörter, hinten Ihr aktuell bearbeiteter kompletter Text. Für die Videoaufnahme legen Sie die Karte weg.</p></div><button type="button" data-w38-print-card data-print>🖨 Sprechkarte drucken</button></section>
          <label for="w38-final-text"><strong>Mein Text für die Aufnahme</strong></label>
          <textarea id="w38-final-text" data-w38-final-text data-learn-field="${FINAL_TEXT_KEY}" data-no-writing-help lang="fr" spellcheck="true" aria-describedby="w38-final-save">${esc(text)}</textarea>
          <div class="w38-final-tools"><button type="button" data-w38-reset-final>Text aus meinen bisherigen Angaben neu erstellen</button><span class="w38-final-save" id="w38-final-save" data-w38-save-status>Änderungen werden automatisch gespeichert.</span></div>
          <p class="w38-final-note">Tipp: Streichen Sie lieber einen Satz, den Sie nicht sicher sprechen können, als zu viel Text in 60 Sekunden zu packen.</p>
        </div>
      </div>`;

    if (activities[1]) activities[1].innerHTML = `
      <header class="activity-head"><div><small>B</small><h2>Anhören und letzte Einzelprobe</h2><p>Hören Sie Ihren bearbeiteten Text an. Sprechen Sie ihn danach selbst und schauen Sie immer weniger auf den Bildschirm.</p></div></header>
      <div class="activity-body">
        ${voicePanel()}
        <div class="learning-toolbar"><button type="button" class="primary-btn" data-timer="60" data-timer-target="cue60">60 Sekunden starten</button><strong id="cue60" class="timer-display">1:00</strong><button type="button" class="secondary-btn" data-stop-timer>Timer stoppen</button></div>
        <ol class="learning-steps"><li>Text einmal anhören und schwierige Stellen markieren oder vereinfachen.</li><li>Text einmal selbst laut lesen.</li><li>Dann 60 Sekunden sprechen und nur noch kurz auf den Text schauen.</li></ol>
      </div>`;

    const labels = shell.querySelectorAll('.complete-card .completion-checks label span');
    if (labels[0]) labels[0].textContent = 'Ich habe meinen kompletten Text geprüft und so angepasst, dass er zu mir passt.';
    if (labels[1]) labels[1].textContent = 'Ich habe den Text angehört und danach selbst laut geübt.';
    resizeFinalText(shell.querySelector('[data-w38-final-text]'));
    patchMissionFooter();
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
    const exercise = document.querySelector('[data-nav-exercise]');
    exercise?.querySelector('option[value="mission-4"]')?.remove();
    const six = exercise?.querySelector('option[value="mission-6"]');
    const seven = exercise?.querySelector('option[value="mission-7"]');
    if (six) six.textContent = '6 · Mon texte final';
    if (seven) seven.textContent = '7 · Répéter à deux';
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
      if (id === 6) {
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        const meta = card.querySelectorAll('.mission-meta span');
        if (h3) h3.textContent = 'Mon texte final';
        if (p) p.textContent = 'Kompletten Text prüfen, direkt bearbeiten, anhören und für die Aufnahme üben.';
        if (meta?.[0]) meta[0].textContent = '15–20 Min.';
        if (meta?.[1]) meta[1].textContent = 'Einzelarbeit';
      }
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
      patchFinalTextMission();
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
    const print = event.target.closest('[data-w38-print-card]');
    if (print) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const run = () => {
        const api = window.FranzWeek37CardUpgrade;
        if (api?.printNow) { api.printNow(); return true; }
        return false;
      };
      if (run()) return;
      const existing = document.querySelector('script[data-w38-print-loader]');
      if (existing) {
        existing.addEventListener('load', run, {once:true});
        return;
      }
      const script = document.createElement('script');
      script.src = '../../assets/week37-card-print-upgrade.js?v=20260917-card10';
      script.dataset.w38PrintLoader = '1';
      script.onload = () => { if (!run()) window.alert('Die Druckfunktion konnte nicht geladen werden. Bitte laden Sie die Seite neu.'); };
      script.onerror = () => window.alert('Die Druckfunktion konnte nicht geladen werden. Bitte laden Sie die Seite neu.');
      document.head.appendChild(script);
      return;
    }
    const reset = event.target.closest('[data-w38-reset-final]');
    if (reset) {
      event.preventDefault();
      const textarea = document.querySelector('[data-w38-final-text]');
      const generated = generatedFinalText();
      if (textarea && generated) {
        if (textarea.value.trim() !== generated.trim() && !window.confirm('Ihre bisherigen Änderungen am Text werden durch die Angaben aus den Übungen ersetzt. Fortfahren?')) return;
        textarea.value = generated;
        textarea.dispatchEvent(new Event('input', {bubbles:true}));
        const status = document.querySelector('[data-w38-save-status]');
        if (status) status.textContent = 'Text aus Ihren bisherigen Angaben neu erstellt und gespeichert.';
        resizeFinalText(textarea);
      }
      return;
    }
    if (event.target.closest('[data-go="start"]')) setTimeout(schedule, 0);
  }, true);

  document.addEventListener('input', event => {
    if (!event.target.matches('[data-w38-final-text]')) return;
    resizeFinalText(event.target);
    const status = document.querySelector('[data-w38-save-status]');
    if (status) status.textContent = 'Änderung gespeichert.';
  }, true);

  window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) schedule(); });
  window.addEventListener('franz-card-upgrade-ready', schedule);
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
