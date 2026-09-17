/* Franz Lernatelier · Woche 37/38 · Stichwortkarte, Vorlesen und sauberer Duplexdruck */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'franzoesischLernatelierW37_v1';
  const VOICE_PREF_KEY = 'franzLernatelierSpeech_v1';
  const DISPLAY_WEEK = (typeof location !== 'undefined' && /woche-38/.test(location.pathname)) ? 38 : 37;
  const TITLES = ['Anfang', 'Über mich', 'Schule und Beruf', 'Grund, Stärke und Erfahrung', 'Schluss'];
  const TIMES = ['0–10 s', '10–20 s', '20–30 s', '30–50 s', '50–60 s'];
  const trim = value => String(value ?? '').trim();
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const sentence = value => trim(value) ? trim(value).replace(/[.!?]+$/, '') + '.' : '';
  const lowerFirst = value => value ? value[0].toLowerCase() + value.slice(1) : '';
  const normalize = value => trim(value).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

  function answersOf(state) { return state?.answers || {}; }
  function answer(state, key) { return trim(answersOf(state)[key]); }

  function schoolSentence(state) {
    const value = answer(state, 'profile.school');
    if (!value) return '';
    return sentence(/^(je\s|j[’'])/i.test(value) ? value : 'Je suis à ' + value);
  }

  function jobSentence(state) {
    const value = answer(state, 'profile.job');
    const status = answer(state, 'profile.jobStatus');
    if (!value) return status === 'undecided' ? 'Je ne sais pas encore quel métier je veux apprendre.' : '';
    const vowel = /^[aàâeéèêëiîïoôuùûüh]/i.test(value);
    const intro = ['explore', 'undecided'].includes(status)
      ? `Je m’intéresse au métier ${vowel ? 'd’' : 'de '}${value}`
      : `Je voudrais devenir ${value}`;
    return (status === 'undecided' ? 'Je n’ai pas encore choisi. ' : '') + sentence(intro);
  }

  function profileSentence(state, key) {
    const value = answer(state, 'profile.' + key);
    if (!value) return '';
    const starts = {
      name: 'Je m’appelle ',
      age: 'J’ai ',
      city: 'J’habite à ',
      mood: 'Aujourd’hui, je me sens ',
      hobbyClause: 'Dans mon temps libre, ',
      food: 'Mon plat préféré, c’est ',
      schoolLike: 'À l’école, '
    };
    let text = (starts[key] || '') + value;
    if (key === 'age' && !/\bans?\b/i.test(value)) text += ' ans';
    return sentence(text);
  }

  function keywordize(value, max = 7) {
    let text = trim(value);
    if (!text) return '';
    text = text
      .replace(/je\s+m[’']appelle/gi, ' ')
      .replace(/j[’']habite\s+à/gi, ' ')
      .replace(/aujourd[’']hui,?\s+je\s+me\s+sens/gi, ' ')
      .replace(/dans\s+mon\s+temps\s+libre,?/gi, ' ')
      .replace(/mon\s+plat\s+préféré,?\s+c[’']est/gi, ' ')
      .replace(/à\s+l[’']école,?/gi, ' ')
      .replace(/je\s+suis\s+à/gi, ' ')
      .replace(/je\s+parle/gi, ' ')
      .replace(/je\s+voudrais\s+devenir/gi, ' ')
      .replace(/je\s+m[’']intéresse\s+au\s+métier\s+d?[’e]?/gi, ' ')
      .replace(/j[’']ai\s+fait\s+un\s+stage/gi, ' stage ')
      .replace(/j[’']aimerais/gi, ' ')
      .replace(/j[’']ai\s+aidé\s+à/gi, ' ')
      .replace(/j[’']ai\s+aimé/gi, ' ')
      .replace(/plus\s+tard,?\s+je\s+veux/gi, ' ')
      .replace(/[.!?,;:()[\]{}]/g, ' ')
      .replace(/[’']/g, ' ');
    const stop = new Set('je j ai suis es est sommes êtes sont de des du la le les un une et en à au aux mon ma mes ton ta tes son sa ses avec dans pour parce que qu qui ce cet cette ces me m te t se s nous vous ils elles on y voudrais veux aime aimer interessé intéressé très plus aussi mais par exemple'.split(' '));
    const words = text.split(/\s+/).filter(Boolean).filter(word => !stop.has(word.toLocaleLowerCase('fr')));
    return words.slice(0, max).join(' ');
  }

  function addPart(parts, label, value, options = {}) {
    const raw = trim(value);
    if (!raw) return;
    const body = options.raw ? raw : keywordize(raw, options.max || 7);
    if (!body) return;
    const text = label ? `${label}: ${body}` : body;
    const key = normalize(text);
    if (!key || parts.some(item => normalize(item) === key)) return;
    parts.push(text);
  }

  function buildKeywordSections(state) {
    const a = key => answer(state, key);
    const sections = TITLES.map((title, i) => ({ title, time: TIMES[i], parts: [] }));

    addPart(sections[0].parts, '', 'Bonjour', {raw:true});
    addPart(sections[0].parts, 'prénom', a('profile.name'), {raw:true});
    if (a('profile.age')) addPart(sections[0].parts, 'âge', /\bans?\b/i.test(a('profile.age')) ? a('profile.age') : `${a('profile.age')} ans`, {raw:true});
    addPart(sections[0].parts, 'ville', a('profile.city'), {raw:true});

    addPart(sections[1].parts, 'humeur', a('profile.mood'), {raw:true});
    addPart(sections[1].parts, 'loisirs', a('m3.hobby') || a('profile.hobbyClause'), {max:8});
    addPart(sections[1].parts, 'plat', a('profile.food'), {raw:true});

    addPart(sections[2].parts, 'école', a('m3.school') || a('profile.school'), {max:9});
    addPart(sections[2].parts, 'langues', a('profile.languages'), {raw:true});
    addPart(sections[2].parts, 'à l’école', a('profile.schoolLike'), {max:6});
    addPart(sections[2].parts, 'métier', a('profile.job'), {raw:true});

    addPart(sections[3].parts, 'raison', a('career.reason') || a('m3.job'), {max:8});
    addPart(sections[3].parts, 'qualité', a('career.strength'), {max:8});
    if (a('career.stageStatus') === 'none') addPart(sections[3].parts, 'stage', 'à découvrir', {raw:true});
    else addPart(sections[3].parts, 'stage', a('career.stage') || 'expérience', {max:8, raw:!a('career.stage')});
    addPart(sections[3].parts, 'activité', a('career.task'), {max:8});
    addPart(sections[3].parts, 'impression', a('career.liked'), {max:8});

    addPart(sections[4].parts, 'projet', a('profile.wish'), {max:8});
    addPart(sections[4].parts, '', 'merci', {raw:true});

    return sections;
  }

  function buildFullText(state) {
    const a = key => answer(state, key);
    const lines = [];
    const seen = new Set();
    const push = value => {
      const text = trim(value);
      if (!text) return;
      const key = normalize(text);
      if (!key || seen.has(key)) return;
      seen.add(key);
      lines.push(text);
    };

    push('Bonjour !');
    push(profileSentence(state, 'name'));
    push(profileSentence(state, 'age'));
    push(profileSentence(state, 'city'));
    push(profileSentence(state, 'mood'));
    push(a('m3.hobby') ? sentence(a('m3.hobby')) : profileSentence(state, 'hobbyClause'));
    push(profileSentence(state, 'food'));
    push(profileSentence(state, 'schoolLike'));
    if (a('profile.languages')) push(sentence('Je parle ' + a('profile.languages')));
    push(a('m3.school') ? sentence(a('m3.school')) : schoolSentence(state));

    const currentJob = jobSentence(state);
    const reason = a('career.reason');
    const expandedJob = a('m3.job');
    if (reason) {
      if (/^parce\s+que\b/i.test(reason) && currentJob) push(sentence(currentJob.replace(/[.]$/, '') + ' ' + lowerFirst(reason)));
      else { push(currentJob); push(sentence(reason)); }
    } else if (expandedJob) push(sentence(expandedJob));
    else push(currentJob);
    push(sentence(a('career.strength')));
    if (a('career.stageStatus') === 'none') push('Je n’ai pas encore fait de stage.');
    else push(sentence(a('career.stage')));
    push(sentence(a('career.task')));
    push(sentence(a('career.liked')));
    if (a('profile.wish')) push(sentence('Plus tard, je veux ' + a('profile.wish')));
    push('Merci de m’avoir écouté / écoutée.');
    return lines;
  }

  function mergeKeywordText(custom, generatedParts) {
    const parts = [];
    const seen = new Set();
    const add = value => {
      trim(value).split(/\s*[·;]\s*/).map(trim).filter(Boolean).forEach(piece => {
        const key = normalize(piece);
        if (key && !seen.has(key)) { seen.add(key); parts.push(piece); }
      });
    };
    add(custom);
    generatedParts.forEach(add);
    return parts.join(' · ');
  }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }

  function loadVoicePrefs() {
    try { return {...{voice:'female',rate:'1'}, ...(JSON.parse(localStorage.getItem(VOICE_PREF_KEY) || '{}') || {})}; }
    catch (_) { return {voice:'female',rate:'1'}; }
  }

  function saveVoicePrefs(prefs) {
    try { localStorage.setItem(VOICE_PREF_KEY, JSON.stringify(prefs)); }
    catch (_) {}
  }

  function saveInputValue(input, value) {
    if (!input || !value || input.value === value) return;
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles:true}));
  }

  function frenchVoices() {
    if (!global.speechSynthesis?.getVoices) return [];
    return global.speechSynthesis.getVoices().filter(voice => /^fr(?:-|_)/i.test(voice.lang || '') || /français|french/i.test(voice.name || ''));
  }

  const VOICE_HINTS = {
    female:['denise','hortense','audrey','amélie','amelie','marie','julie','céline','celine','charlotte','léa','lea','virginie','google français'],
    male:['henri','thomas','paul','rémi','remi','nicolas','alain','claude','mathieu','louis','pierre']
  };

  function chooseVoice(kind) {
    const voices = frenchVoices();
    if (!voices.length) return null;
    const hints = VOICE_HINTS[kind] || [];
    const matched = voices.find(voice => hints.some(hint => String(voice.name || '').toLocaleLowerCase('fr').includes(hint)));
    if (matched) return matched;
    if (voices.length === 1) return voices[0];
    return kind === 'male' ? voices[1] : voices[0];
  }

  function speechText(state) {
    return buildFullText(state).join(' ')
      .replace(/écouté\s*\/\s*écoutée/gi, 'écouté')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function voicePanelHTML() {
    const prefs = loadVoicePrefs();
    return `<section class="w37-voice-coach" aria-labelledby="w37VoiceTitle">
      <div class="w37-voice-copy"><strong id="w37VoiceTitle">Meinen ganzen Text anhören</strong><p>Hören Sie Ihre aktuelle Vorstellung einmal vollständig an. Danach sprechen Sie selbst. Die Vorlesefunktion ist nur zum Üben – im Video sprechen Sie frei.</p></div>
      <div class="w37-voice-controls">
        <label>Stimme<select data-w37-voice><option value="female" ${prefs.voice==='female'?'selected':''}>weibliche Stimme</option><option value="male" ${prefs.voice==='male'?'selected':''}>männliche Stimme</option></select></label>
        <label>Tempo<select data-w37-rate><option value="1" ${String(prefs.rate)==='1'?'selected':''}>normal</option><option value="0.72" ${String(prefs.rate)==='0.72'?'selected':''}>langsamer</option></select></label>
        <button type="button" class="w37-voice-play" data-w37-speak-full>▶ Text vorlesen</button>
        <button type="button" class="w37-voice-stop" data-w37-stop-speech>■ Stoppen</button>
      </div>
      <p class="w37-voice-status" data-w37-voice-status role="status" aria-live="polite">Wählen Sie Stimme und Tempo und starten Sie dann das Vorlesen.</p>
    </section>`;
  }

  function enhanceMission6() {
    const inputs = [...document.querySelectorAll('input[data-learn-field^="cue."]')];
    if (!inputs.length) return;
    const state = loadState();
    const sections = buildKeywordSections(state);
    inputs.forEach(input => {
      const index = Number((input.dataset.learnField || '').split('.')[1]);
      if (!Number.isInteger(index) || !sections[index]) return;
      const stored = answer(state, `cue.${index}`);
      const generated = sections[index].parts.join(' · ');
      if (!stored) saveInputValue(input, generated);
      // Der frühere grüne Einzelvorschlag wiederholte praktisch denselben Inhalt wie das Eingabefeld.
      // Die Funktion bleibt erhalten, wird aber zentral und verständlich erklärt.
      input.parentElement?.querySelector(':scope > .w37-cue-generated')?.remove();
    });

    const stack = inputs[0]?.closest('.learning-stack');
    if (stack) {
      let intro = stack.parentElement?.querySelector(':scope > .w37-cue-intro');
      if (!intro) {
        intro = document.createElement('div');
        intro.className = 'w37-cue-intro';
        stack.insertAdjacentElement('beforebegin', intro);
      }
      if (intro.dataset.version !== '2') {
        intro.dataset.version = '2';
        intro.innerHTML = '<strong>So funktioniert Ihre Stichwortkarte</strong><p>Die Stichwörter werden automatisch aus Ihren Angaben der vorherigen Übungen erstellt. Sie sind nur eine Gedächtnisstütze – keine Sätze zum Ablesen. Kürzen, ändern oder löschen Sie alles, was für Sie nicht passt. Wenn Sie frühere Angaben später geändert haben, können Sie die automatischen Stichwörter hier neu erstellen.</p><button type="button" data-w37-cue-use-all>Automatische Stichwörter neu erstellen</button>';
      }

      let voice = stack.parentElement?.querySelector(':scope > .w37-voice-coach');
      if (!voice) {
        const holder = document.createElement('div');
        holder.innerHTML = voicePanelHTML();
        voice = holder.firstElementChild;
        intro.insertAdjacentElement('afterend', voice);
      }
    }

    const printButton = document.querySelector('[data-print]');
    if (printButton) {
      if (printButton.textContent !== 'Karte doppelseitig drucken') printButton.textContent = 'Karte doppelseitig drucken';
      const toolbar = printButton.closest('.learning-toolbar');
      if (toolbar && !toolbar.nextElementSibling?.classList.contains('w37-print-hint')) {
        const hint = document.createElement('div');
        hint.className = 'w37-print-hint';
        hint.innerHTML = '<strong>Druckhinweis</strong><p>Drucken Sie auf <b>A4 doppelseitig</b>, mit Wendung an der <b>langen Kante</b> und möglichst bei <b>100 % / tatsächlicher Grösse</b>. Schneiden Sie die Karte anschliessend von Hand entlang der hellen Schnittlinie aus.</p>';
        toolbar.insertAdjacentElement('afterend', hint);
      }
    }
  }

  function applyGenerated(index = null) {
    const state = loadState();
    const sections = buildKeywordSections(state);
    const inputs = [...document.querySelectorAll('input[data-learn-field^="cue."]')];
    inputs.forEach(input => {
      const i = Number((input.dataset.learnField || '').split('.')[1]);
      if (!Number.isInteger(i) || !sections[i] || (index !== null && i !== index)) return;
      saveInputValue(input, sections[i].parts.join(' · '));
    });
  }

  function installStyles() {
    if (document.getElementById('w37-card-upgrade-style')) return;
    const style = document.createElement('style');
    style.id = 'w37-card-upgrade-style';
    style.textContent = `
.w37-cue-intro{margin:0 0 16px;padding:16px 18px;border:1px solid #bcd6d2;border-radius:16px;background:#f8fffd}.w37-cue-intro strong{font-size:1.05em}.w37-cue-intro p{margin:5px 0 12px;color:#526477}.w37-cue-intro button{min-height:40px;border:1px solid #177c73;border-radius:11px;background:#fff;color:#0f615b;padding:7px 11px;font-weight:850;cursor:pointer}.w37-voice-coach{margin:0 0 18px;padding:17px 18px;border:1px solid #afc8e2;border-radius:16px;background:linear-gradient(135deg,#f4f8ff,#fff)}.w37-voice-copy strong{font-size:1.08em;color:#0b315f}.w37-voice-copy p{margin:5px 0 14px;color:#526477}.w37-voice-controls{display:flex;align-items:end;gap:9px;flex-wrap:wrap}.w37-voice-controls label{display:grid;gap:4px;color:#455969;font-size:.85em;font-weight:850}.w37-voice-controls select{min-height:42px;border:1px solid #b8c8c4;border-radius:10px;background:#fff;color:#10233f;padding:7px 34px 7px 10px}.w37-voice-controls button{min-height:42px;border-radius:11px;padding:8px 12px;font-weight:900;cursor:pointer}.w37-voice-play{border:1px solid #0b315f;background:#0b315f;color:#fff}.w37-voice-stop{border:1px solid #b8c8c4;background:#fff;color:#10233f}.w37-voice-status{margin:10px 0 0;color:#526477;font-size:.86em}.w37-print-hint{margin:10px 0 16px;padding:12px 14px;border:1px solid #d8bd7b;border-radius:12px;background:#fff9e9}.w37-print-hint strong{display:block;color:#604710}.w37-print-hint p{margin:4px 0 0;color:#526477;line-height:1.45}@media(max-width:680px){.w37-voice-controls{display:grid;grid-template-columns:1fr 1fr}.w37-voice-controls button{width:100%}}
#franz-w37-print-root{display:none}
@media print{
  @page{size:A4 portrait;margin:0}
  html,body{width:210mm!important;height:auto!important;margin:0!important;padding:0!important;background:#fff!important}
  body > *:not(#franz-w37-print-root){display:none!important}
  #franz-w37-print-root{display:block!important;position:static!important;width:210mm!important;margin:0!important;padding:0!important;background:#fff!important;color:#10233f!important;font-family:"Segoe UI",Aptos,Arial,sans-serif!important}
  #franz-w37-print-root *{box-sizing:border-box!important}
  .w37-print-sheet{position:relative;width:210mm;height:297mm;margin:0!important;padding:0!important;overflow:hidden;background:#fff!important;break-after:page;page-break-after:always}
  .w37-print-sheet:last-child{break-after:auto;page-break-after:auto}
  .w37-print-sheet-front{display:flex;justify-content:flex-start;align-items:flex-start}
  .w37-print-sheet-back{display:flex;justify-content:flex-end;align-items:flex-start}
  .w37-print-card{position:relative;width:105mm;height:148mm;margin:0!important;padding:9mm 9mm 8mm;overflow:hidden;background:#fff!important;border:0!important}
  .w37-print-card-front{outline:.25mm solid #cfd8da;outline-offset:-.25mm}
  .w37-print-card::before{content:"";position:absolute;inset:0 0 auto;height:3.2mm;background:linear-gradient(90deg,#0055a4 0 33.333%,#fff 33.333% 66.666%,#ef4135 66.666%);border-bottom:.25mm solid #d7dfdc}
  .w37-print-head{padding-top:3mm;border-bottom:.45mm solid #0b315f;padding-bottom:3.2mm;margin-bottom:3mm}.w37-print-kicker{margin:0 0 1.2mm;font-size:7.4pt;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#177c73}.w37-print-head h1{margin:0;font-size:18pt;line-height:1.05;color:#0b315f}.w37-print-instruction{margin:1.8mm 0 0;font-size:8.8pt;line-height:1.3;color:#455969}
  .w37-print-cues{display:grid;gap:1.2mm}.w37-print-cue{display:grid;grid-template-columns:24mm 1fr;gap:3mm;padding:2.1mm 0;border-bottom:.25mm solid #d7dfdc}.w37-print-cue:last-child{border-bottom:0}.w37-print-cue-title{font-size:8.3pt;font-weight:900;line-height:1.15;color:#0b315f}.w37-print-cue-time{display:block;margin-top:.7mm;font-size:6.8pt;color:#526477}.w37-print-keywords{font-size:9.1pt;font-weight:750;line-height:1.28;color:#10233f;overflow-wrap:anywhere}
  .w37-print-card-back .w37-print-head{margin-bottom:2.4mm}.w37-print-text{display:grid;gap:1.2mm}.w37-print-text p{margin:0;font-size:8.8pt;line-height:1.24;color:#10233f}.w37-print-card-back.is-dense .w37-print-text{gap:.9mm}.w37-print-card-back.is-dense .w37-print-text p{font-size:8pt;line-height:1.18}.w37-print-card-back.is-very-dense .w37-print-text{gap:.65mm}.w37-print-card-back.is-very-dense .w37-print-text p{font-size:7.3pt;line-height:1.12}
}`;
    document.head.appendChild(style);
  }

  function createPrintRoot(state) {
    const sections = buildKeywordSections(state);
    const fullText = buildFullText(state);
    const cueInputs = [...document.querySelectorAll('input[data-learn-field^="cue."]')];
    const current = new Map(cueInputs.map(input => [Number((input.dataset.learnField || '').split('.')[1]), trim(input.value)]));
    const chars = fullText.join(' ').length;
    const density = chars > 1150 || fullText.length > 16 ? ' is-very-dense' : chars > 800 || fullText.length > 12 ? ' is-dense' : '';
    const front = sections.map((section, i) => {
      const custom = current.get(i) || answer(state, `cue.${i}`);
      const words = mergeKeywordText(custom, section.parts);
      return `<div class="w37-print-cue"><div class="w37-print-cue-title">${esc(section.title)}<span class="w37-print-cue-time">${esc(section.time)}</span></div><div class="w37-print-keywords" lang="fr">${esc(words || 'Stichwörter ergänzen')}</div></div>`;
    }).join('');
    const back = fullText.map(line => `<p lang="fr">${esc(line)}</p>`).join('');
    const root = document.createElement('section');
    root.id = 'franz-w37-print-root';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `<section class="w37-print-sheet w37-print-sheet-front"><div class="w37-print-card w37-print-card-front"><header class="w37-print-head"><p class="w37-print-kicker">Franz Lernatelier · Woche ${DISPLAY_WEEK}</p><h1>Ma carte de parole</h1><p class="w37-print-instruction">Sprechen Sie frei. Die Stichwörter erinnern Sie an Ihren eigenen Text. Schauen Sie nur kurz auf die Karte.</p></header><div class="w37-print-cues">${front}</div></div></section><section class="w37-print-sheet w37-print-sheet-back"><div class="w37-print-card w37-print-card-back${density}"><header class="w37-print-head"><p class="w37-print-kicker">Franz Lernatelier · Woche ${DISPLAY_WEEK}</p><h1>Je me présente</h1></header><div class="w37-print-text">${back || '<p>Ergänzen Sie zuerst Ihre Angaben in den Übungen 1–5.</p>'}</div></div></section>`;
    return root;
  }

  function printCard(event) {
    const printButton = event.target.closest('[data-print]');
    if (!printButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    installStyles();
    document.getElementById('franz-w37-print-root')?.remove();
    const root = createPrintRoot(loadState());
    document.body.appendChild(root);
    const cleanup = () => root.remove();
    global.addEventListener('afterprint', cleanup, {once:true});
    global.print();
    global.setTimeout(() => { if (root.isConnected && !global.matchMedia?.('print').matches) cleanup(); }, 60000);
  }

  function setVoiceStatus(text) {
    const status = document.querySelector('[data-w37-voice-status]');
    if (status) status.textContent = text;
  }

  function speakFullText() {
    if (!('speechSynthesis' in global) || typeof global.SpeechSynthesisUtterance !== 'function') {
      setVoiceStatus('Auf diesem Browser ist die Vorlesefunktion nicht verfügbar.');
      return;
    }
    const text = speechText(loadState());
    if (!text) {
      setVoiceStatus('Ergänzen Sie zuerst Ihre Angaben. Danach kann der Text vorgelesen werden.');
      return;
    }
    const voiceChoice = document.querySelector('[data-w37-voice]')?.value || 'female';
    const rate = Number(document.querySelector('[data-w37-rate]')?.value || 1);
    const voice = chooseVoice(voiceChoice);
    const utterance = new global.SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = Number.isFinite(rate) ? rate : 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setVoiceStatus(`Vorlesen läuft${voice?.name ? ` · ${voice.name}` : ''}.`);
    utterance.onend = () => setVoiceStatus('Fertig. Sprechen Sie den Text jetzt selbst – möglichst ohne mitzulesen.');
    utterance.onerror = () => setVoiceStatus('Das Vorlesen konnte nicht gestartet werden. Versuchen Sie es nochmals oder wechseln Sie die Stimme.');
    global.speechSynthesis.cancel();
    global.speechSynthesis.speak(utterance);
  }

  let scheduled = false;
  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; enhanceMission6(); });
  }

  const API = {buildKeywordSections, buildFullText, mergeKeywordText, keywordize, profileSentence, schoolSentence, jobSentence, chooseVoice, speechText};
  global.FranzWeek37CardUpgrade = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;

  if (typeof document === 'undefined') return;
  installStyles();
  document.addEventListener('click', event => {
    if (event.target.closest('[data-print]')) return printCard(event);
    const one = event.target.closest('[data-w37-cue-use]');
    if (one) { event.preventDefault(); applyGenerated(Number(one.dataset.w37CueUse)); scheduleEnhance(); return; }
    const all = event.target.closest('[data-w37-cue-use-all]');
    if (all) { event.preventDefault(); applyGenerated(null); scheduleEnhance(); return; }
    if (event.target.closest('[data-w37-speak-full]')) { event.preventDefault(); speakFullText(); return; }
    if (event.target.closest('[data-w37-stop-speech]')) { event.preventDefault(); global.speechSynthesis?.cancel(); setVoiceStatus('Vorlesen gestoppt.'); }
  }, true);
  document.addEventListener('change', event => {
    if (!event.target.matches('[data-w37-voice],[data-w37-rate]')) return;
    saveVoicePrefs({
      voice:document.querySelector('[data-w37-voice]')?.value || 'female',
      rate:document.querySelector('[data-w37-rate]')?.value || '1'
    });
  }, true);
  const observer = new MutationObserver(scheduleEnhance);
  function start() { scheduleEnhance(); observer.observe(document.body, {childList:true, subtree:true}); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start, {once:true}) : start();
})(typeof window !== 'undefined' ? window : globalThis);
