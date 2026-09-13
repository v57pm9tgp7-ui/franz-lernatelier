/* Franz Lernatelier · Woche 37 · vollständige Stichwortkarte + sauberer Duplexdruck */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'franzoesischLernatelierW37_v1';
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

  function saveInputValue(input, value) {
    if (!input || !value || input.value === value) return;
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles:true}));
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
      let hint = input.parentElement?.querySelector(':scope > .w37-cue-generated');
      if (!hint && input.parentElement) {
        hint = document.createElement('div');
        hint.className = 'w37-cue-generated';
        input.insertAdjacentElement('afterend', hint);
      }
      if (hint) {
        const signature = generated || 'leer';
        if (hint.dataset.signature !== signature) {
          hint.dataset.signature = signature;
          hint.innerHTML = `<strong>Vollständiger Vorschlag aus Ihren Angaben</strong><span lang="fr">${esc(generated || 'Ergänzen Sie zuerst die vorherigen Übungen.')}</span><button type="button" data-w37-cue-use="${index}">Vorschlag übernehmen</button>`;
        }
      }
    });

    const stack = inputs[0]?.closest('.learning-stack');
    if (stack && !stack.previousElementSibling?.classList.contains('w37-cue-intro')) {
      const intro = document.createElement('div');
      intro.className = 'w37-cue-intro';
      intro.innerHTML = '<strong>Alle Inhalte auf einer Karte</strong><p>Die Stichwörter greifen alle vorhandenen Teile aus Woche 37 auf: persönliche Angaben, Freizeit, Schule, Sprachen, Beruf, Grund, Stärke, Schnupperlehre und Schluss. Nicht passende freiwillige Details dürfen Sie löschen.</p><button type="button" data-w37-cue-use-all>Stichwörter aus meinen Angaben aktualisieren</button>';
      stack.insertAdjacentElement('beforebegin', intro);
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
.w37-cue-intro{margin:0 0 16px;padding:16px 18px;border:1px solid #bcd6d2;border-radius:16px;background:#f8fffd}.w37-cue-intro strong{font-size:1.05em}.w37-cue-intro p{margin:5px 0 12px;color:#526477}.w37-cue-intro button,.w37-cue-generated button{min-height:40px;border:1px solid #177c73;border-radius:11px;background:#fff;color:#0f615b;padding:7px 11px;font-weight:850;cursor:pointer}.w37-cue-generated{display:grid;gap:6px;margin-top:9px;padding:11px 12px;border-left:4px solid #177c73;border-radius:0 11px 11px 0;background:#f4fbf9}.w37-cue-generated strong{font-size:.83em;color:#0f615b}.w37-cue-generated span{font-weight:750;line-height:1.45}.w37-cue-generated button{justify-self:start;min-height:36px;font-size:.88em}
#franz-w37-print-root{display:none}
@media print{
  @page{size:A6 portrait;margin:0}
  html,body{width:105mm!important;height:auto!important;margin:0!important;padding:0!important;background:#fff!important}
  body > *:not(#franz-w37-print-root){display:none!important}
  #franz-w37-print-root{display:block!important;position:static!important;width:105mm!important;margin:0!important;padding:0!important;background:#fff!important;color:#10233f!important;font-family:"Segoe UI",Aptos,Arial,sans-serif!important}
  #franz-w37-print-root *{box-sizing:border-box!important}
  .w37-print-side{position:relative;width:105mm;height:148mm;margin:0!important;padding:9mm 9mm 8mm;overflow:hidden;background:#fff!important;break-after:page;page-break-after:always;border:0!important}
  .w37-print-side:last-child{break-after:auto;page-break-after:auto}
  .w37-print-side::before{content:"";position:absolute;inset:0 0 auto;height:3.2mm;background:linear-gradient(90deg,#0055a4 0 33.333%,#fff 33.333% 66.666%,#ef4135 66.666%);border-bottom:.25mm solid #d7dfdc}
  .w37-print-head{padding-top:3mm;border-bottom:.45mm solid #0b315f;padding-bottom:3.2mm;margin-bottom:3mm}.w37-print-kicker{margin:0 0 1.2mm;font-size:7.4pt;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#177c73}.w37-print-head h1{margin:0;font-size:18pt;line-height:1.05;color:#0b315f}.w37-print-instruction{margin:1.8mm 0 0;font-size:8.8pt;line-height:1.3;color:#455969}
  .w37-print-cues{display:grid;gap:1.2mm}.w37-print-cue{display:grid;grid-template-columns:24mm 1fr;gap:3mm;padding:2.1mm 0;border-bottom:.25mm solid #d7dfdc}.w37-print-cue:last-child{border-bottom:0}.w37-print-cue-title{font-size:8.3pt;font-weight:900;line-height:1.15;color:#0b315f}.w37-print-cue-time{display:block;margin-top:.7mm;font-size:6.8pt;color:#526477}.w37-print-keywords{font-size:9.1pt;font-weight:750;line-height:1.28;color:#10233f;overflow-wrap:anywhere}
  .w37-print-back .w37-print-head{margin-bottom:2.4mm}.w37-print-text{display:grid;gap:1.2mm}.w37-print-text p{margin:0;font-size:8.8pt;line-height:1.24;color:#10233f}.w37-print-back.is-dense .w37-print-text{gap:.9mm}.w37-print-back.is-dense .w37-print-text p{font-size:8pt;line-height:1.18}.w37-print-back.is-very-dense .w37-print-text{gap:.65mm}.w37-print-back.is-very-dense .w37-print-text p{font-size:7.3pt;line-height:1.12}
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
    root.innerHTML = `<section class="w37-print-side w37-print-front"><header class="w37-print-head"><p class="w37-print-kicker">Franz Lernatelier · Woche ${DISPLAY_WEEK}</p><h1>Ma carte de parole</h1><p class="w37-print-instruction">Sprechen Sie frei. Die Stichwörter erinnern Sie an Ihren eigenen Text. Schauen Sie nur kurz auf die Karte.</p></header><div class="w37-print-cues">${front}</div></section><section class="w37-print-side w37-print-back${density}"><header class="w37-print-head"><p class="w37-print-kicker">Franz Lernatelier · Woche ${DISPLAY_WEEK}</p><h1>Mein vollständiger Text</h1></header><div class="w37-print-text">${back || '<p>Ergänzen Sie zuerst Ihre Angaben in den Übungen 1–5.</p>'}</div></section>`;
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

  let scheduled = false;
  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; enhanceMission6(); });
  }

  const API = {buildKeywordSections, buildFullText, mergeKeywordText, keywordize, profileSentence, schoolSentence, jobSentence};
  global.FranzWeek37CardUpgrade = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;

  if (typeof document === 'undefined') return;
  installStyles();
  document.addEventListener('click', event => {
    if (event.target.closest('[data-print]')) return printCard(event);
    const one = event.target.closest('[data-w37-cue-use]');
    if (one) { event.preventDefault(); applyGenerated(Number(one.dataset.w37CueUse)); scheduleEnhance(); return; }
    const all = event.target.closest('[data-w37-cue-use-all]');
    if (all) { event.preventDefault(); applyGenerated(null); scheduleEnhance(); }
  }, true);
  const observer = new MutationObserver(scheduleEnhance);
  function start() { scheduleEnhance(); observer.observe(document.body, {childList:true, subtree:true}); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start, {once:true}) : start();
})(typeof window !== 'undefined' ? window : globalThis);
