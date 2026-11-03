/* Woche 45 — vier einfache Wege, private Rollenkarten und hilfreiche Rückmeldungen. */
(function () {
  'use strict';
  const C = window.W45_CONTENT;
  const KEY = 'franzoesischLernatelierW45_v1';
  const main = document.getElementById('main');
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normal = value => String(value ?? '').trim().toLowerCase().normalize('NFC').replace(/[’‘]/g,"'").replace(/[‐‑–—]/g,'-').replace(/\s+/g,' ');
  let storageOK = true;
  let state = readState();
  let marketCase = 'M1', role = '', partnerSet = 'A1', partnerRole = '', priceRound = 0;
  const marketDrafts = {}, partnerDrafts = {};
  function rememberDrafts() {
    const form=$('#agreementForm'); if(form) marketDrafts[marketCase]=Object.fromEntries(new FormData(form));
    const check=$('#partnerCheck'); if(check) partnerDrafts[partnerSet]=[...check.querySelectorAll('input:checked')].map(i=>i.value);
  }
  function restoreDrafts() {
    const form=$('#agreementForm'), draft=marketDrafts[marketCase];
    if(form && draft) for(const key of ['price','time','place']) form.elements[key].value=draft[key]||'';
    const check=$('#partnerCheck'); if(check) check.querySelectorAll('input').forEach(i=>{i.checked=(partnerDrafts[partnerSet]||[]).includes(i.value);});
  }
  function readState() {
    try { return {...{globalLevel:'standard',missionDone:{}}, ...JSON.parse(localStorage.getItem(KEY) || '{}')}; }
    catch (_) { storageOK = false; return {globalLevel:'standard',missionDone:{}}; }
  }
  function save(patch) {
    const current = storageOK ? readState() : state;
    state = {...current, ...patch};
    if (patch.missionDone) state.missionDone = {...current.missionDone, ...patch.missionDone};
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { storageOK = false; }
    updateStatus();
  }
  function updateStatus() {
    $('#saveStatus').textContent = storageOK ? 'Lernstand in diesem Browser gespeichert' : 'Speichern nicht verfügbar · Einträge gelten nur bis zum Neuladen';
  }
  function evaluateAgreement(c, price, time, place) {
    const amount = Number(String(price).replace(',','.'));
    return {price: String(price).trim() !== '' && Number.isFinite(amount) && amount >= c.solution.price_min && amount <= c.solution.price_max,
      time: c.solution.times.includes(time), place: normal(place) === normal(c.solution.place_fr)};
  }
  function checkAnswer(question, answer) {
    let value = normal(answer);
    const answers = question.accepted || [question.answer];
    if (/^\d{1,2}[.:h]\s*\d{2}$/.test(value)) value = value.replace(/[.h]\s*/,':').padStart(5,'0');
    return answers.some(a => normal(a) === value);
  }
  window.W45 = {KEY, evaluateAgreement, checkAnswer, normal};
  const list = (items, cls='steps') => `<ol class="${cls}">${items.map((i,n)=>`<li><span class="step-num" aria-hidden="true">${n+1}</span><div>${i}</div></li>`).join('')}</ol>`;
  function phrases(items) { return items.map(p=>`<div class="phrase"><div class="fr" lang="fr">${esc(p.fr)}</div><div class="de">${esc(p.de)}</div></div>`).join(''); }
  function level(context) {
    const hints = {
      market:{support:'Soutien: Öffnen Sie die Sprachhilfe. Lesen Sie passende Sätze vor und ersetzen Sie Preis und Zeit.',standard:'Standard: Sprechen Sie mit den Stichworten Ihrer Karte. Fragen Sie mindestens einmal nach.',challenge:'Avancé: Verhandeln Sie möglichst frei. Begründen Sie Ihren Vorschlag; Fälle M4–M6 enthalten grössere Zahlen.'},
      partner:{support:'Soutien: Bei jedem Termin stehen Frage und Satzanfang bereit. Nutzen Sie beides.',standard:'Standard: Stellen Sie die Frage selbst. Die Satzhilfe können Sie bei Bedarf öffnen.',challenge:'Avancé: Sprechen Sie ohne abgelesene Satzhilfe. Bestätigen Sie jeden Unterschied mit beiden Zeiten.'},
      training:{support:'Soutien: Beginnen Sie mit Beispiel und Bedeutung. Nutzen Sie Hilfen und blenden Sie diese schrittweise aus.',standard:'Standard: Geben Sie selbständig Antworten ein und nutzen Sie die Rückmeldungen.',challenge:'Avancé: Üben Sie ohne Hilfe und mit wechselnden Personen. Wählen Sie bei Zahlen auch den erweiterten Bereich.'}
    };
    return `<div class="levelbar"><label for="level">Meine Unterstützung</label><select id="level" data-action="level"><option value="support" ${state.globalLevel==='support'?'selected':''}>Soutien · mit Hilfen</option><option value="standard" ${state.globalLevel==='standard'?'selected':''}>Standard</option><option value="challenge" ${state.globalLevel==='challenge'?'selected':''}>Avancé · mehr Herausforderung</option></select></div><p class="hint">${hints[context][state.globalLevel] || hints[context].standard}</p>`;
  }
  function heading(kicker,title,lead,tags=[]) { return `<div class="phasehead"><div class="meta">${tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><span class="eyebrow">${kicker}</span><h1>${title}</h1><p class="lead">${lead}</p></div>`; }
  function complete(id, next, label) {
    return `<div class="progressline"><label><input type="checkbox" data-complete="${id}" ${state.missionDone?.[id]?'checked':''}> Ich habe diese Phase bearbeitet.</label><a class="btn secondary" href="${next}">${label} →</a></div>`;
  }
  function dashboard() {
    const cards=[
      ['1','Nach dem Test','Allein · leise','Zahlen und Uhrzeiten wiederholen, bis alle fertig sind.','Sobald Sie abgegeben haben'],
      ['2','Marché d’occasion','Zu dritt · 20 Min.','Kaufen, verkaufen, nachfragen. Finden Sie gemeinsam eine Abmachung.','Minute 20–40'],
      ['3','Nos agendas','Zu zweit · 12 Min.','Zwei Pläne, drei Unterschiede. Nur durch Fragen finden Sie sie.','Minute 40–52'],
      ['4','Mein Lernatelier','Allein · 23 Min.','Fünf neue Verben, Ihr Schwerpunkt und ein kurzer Check.','Minute 64–87']
    ];
    main.innerHTML=`<section class="hero"><div><span class="eyebrow">WOCHE 45 · PARLER & S’ENTRAÎNER</span><h1>On fait une<br>bonne affaire !</h1><p class="lead">Sie handeln einen Preis aus, sprechen über Uhrzeiten und lernen fünf neue Verben. Ein Schritt nach dem anderen.</p><a class="btn light" href="#mission-1">Nach der Lernkontrolle starten →</a></div><div class="hero-art" aria-hidden="true"><div class="speech one"><small>Le prix</small>C’est combien ?</div><div class="speech two"><small>Le rendez-vous</small>À quelle heure ?</div></div></section><div class="intro-row"><div><h2>Ihr Weg durch die Lektion</h2><p class="muted">Zuerst die Lernkontrolle auf Papier. Danach wählen Sie hier die aktuelle Phase.</p></div><span class="tag">90 Minuten · A2</span></div><div class="flowgrid">${cards.map(c=>`<a class="flowcard" href="#mission-${c[0]}"><span class="num">0${c[0]}</span>${state.missionDone?.[c[0]]?'<span class="done-dot">✓ bearbeitet</span>':''}<div class="meta"><span class="tag">${c[2]}</span></div><h3>${c[1]}</h3><p>${c[3]}</p><small class="muted">${c[4]}</small><span class="go">Öffnen →</span></a>`).join('')}</div><div class="classlink"><div><span class="eyebrow">DAZWISCHEN · MINUTE 52–64 · GEMEINSAM</span><h3>Le juste prix & fünf neue Verben</h3><p class="muted">Preise schätzen, Zahlen sagen, neue Verben entdecken.</p></div><a class="btn secondary" href="#classe">Klassenansicht →</a></div><div class="grid2"><div class="panel soft"><h3>Heute gelingt Ihnen …</h3><p>… ein Gespräch mit Preis, Uhrzeit und Treffpunkt. Sie fragen nach, wenn etwas unklar ist, und wählen einen persönlichen Übungsschwerpunkt.</p></div><div class="panel"><h3>Am Schluss: Ihr nächster Schritt</h3><p>Was gelingt schon? Was möchten Sie nochmals üben?</p><a href="#bilan">Mein Abschluss →</a> · <a href="#material">Druckmaterial →</a></div></div>`;
  }
  function quiet() {
    main.innerHTML=heading('01 · NACH DER LERNKONTROLLE','Fertig? In Ruhe weiter.','Kontrollieren Sie Ihre Antworten und geben Sie die Lernkontrolle ab. Danach repetieren Sie selbständig bekannten Stoff.',['Allein','Ohne Ton','Bis zum gemeinsamen Start'])+`<section class="panel soft"><h2>Zahlen & Uhrzeiten</h2><p>Eine ruhige Mischung aus Zahlen von 0 bis 100 und bekannten Uhrzeiten. Sie entscheiden Ihr Tempo; Hilfen sind erlaubt.</p><a class="btn" href="training.html#quiet">Stille Repetition starten →</a><p class="small muted" style="margin-top:16px">Keine vorgeschriebene Anzahl Aufgaben. Die Übung öffnet ohne Audio.</p></section><div class="grid2"><div class="panel"><h3>So bleiben alle konzentriert</h3>${list(['Arbeiten Sie leise und selbständig.','Verbentraining beginnt später in der Lektion.','Beenden Sie Ihre aktuelle Aufgabe, wenn die Lehrperson zum Marché überleitet.'])}</div><div class="panel"><h3>Lieber gezielt üben?</h3><p>Sie können auch direkt einen bekannten Bereich wählen.</p><div class="actions"><a class="btn secondary" href="training.html#numbers">Zahlen</a><a class="btn secondary" href="training.html#times">Uhrzeiten</a></div></div></div>`+complete(1,'#mission-2','Zum Marché');
  }
  function market() {
    const c=C.market.cases.find(c=>c.id===marketCase);
    main.innerHTML=heading('02 · MARCHÉ D’OCCASION','Ein Angebot. Drei Rollen.','Vereinbaren Sie auf Französisch einen Preis, eine Uhrzeit und einen Treffpunkt. Öffnen Sie nur Ihre eigene Rollenkarte. Halten Sie Ihre geheimen Angaben verdeckt.',['Zu dritt','20 Minuten','3 Runden'])+`<div class="panel">${list(['Verteilen Sie A, B und C in Ihrer Gruppe. Öffnen Sie alle denselben Fall.','Wählen Sie Ihre Rolle. Sprechen Sie etwa vier Minuten miteinander.','Notieren Sie die Abmachung zuerst getrennt. Vergleichen Sie danach und wechseln Sie die Rollen.'])}<details><summary>Rollenwechsel & Zweiergruppen</summary><div class="tablewrap"><table><thead><tr><th>Runde / Fall</th><th>Person A</th><th>Person B</th><th>Person C</th></tr></thead><tbody>${C.market.rounds.map(r=>`<tr><td>${r.round} · ${r.case}</td><td>${esc(r.person_A)}</td><td>${esc(r.person_B)}</td><td>${esc(r.person_C)}</td></tr>`).join('')}</tbody></table></div><p class="small" style="margin-top:15px">${esc(C.market.pair_fallback)}</p></details></div><section class="panel"><label for="marketCase"><strong>Unser Fall</strong></label><select id="marketCase" data-action="market-case">${C.market.cases.map(x=>`<option value="${x.id}" ${x.id===marketCase?'selected':''}>${x.id} · ${esc(x.item_de)}${x.extension?' · Zusatz':''}</option>`).join('')}</select><p class="small muted" style="margin-top:10px">Starten Sie mit M1, dann M2 und M3. M4–M6 sind Alternativen mit grösseren Zahlen.</p><div class="quiet-message"><h3 lang="fr">${esc(c.item_fr)}</h3><p><span lang="fr">${esc(c.public.condition_fr)}</span> · Angebot: <strong>CHF ${c.public.asking_price}</strong> · Treffpunkt: <span lang="fr">${esc(c.public.place_fr)}</span></p></div><h3>Nur die eigene Karte öffnen</h3><div class="rolepick" aria-label="Meine Rolle">${[['buyer','Kaufen'],['seller','Verkaufen'],['coach','Gesprächskontrolle']].map(([v,l])=>`<button data-role="${v}" aria-pressed="${role===v}">${l}</button>`).join('')}</div><div id="roleCard">${roleCard(c)}</div>${level('market')}</section><details ${state.globalLevel==='support'?'open':''}><summary>Sprachhilfe · für das Gespräch</summary>${phrases(C.market.phrases)}</details><section class="panel"><h2>Unsere Abmachung</h2><p>Notieren Sie zuerst Ihre eigene Version. Vergleichen Sie erst danach mit Ihrem Gegenüber.</p><form id="agreementForm"><div class="fieldrow"><div><label for="dealPrice">Preis in CHF</label><input id="dealPrice" name="price" inputmode="decimal" type="number" min="0" step="0.05" required placeholder="z. B. 50"></div><div><label for="dealTime">Uhrzeit</label><input id="dealTime" name="time" type="time" required></div><div><label for="dealPlace">Treffpunkt auf Französisch</label><input id="dealPlace" name="place" autocomplete="off" required placeholder="On se retrouve …"></div></div><label class="checkline"><input type="checkbox" required> Wir haben unsere getrennt notierten Angaben verglichen.</label><button class="primary" type="submit">Abmachung prüfen</button><div id="dealFeedback" class="notice" role="status"></div></form></section>`+complete(2,'#mission-3','Zur Partnerarbeit');
  }
  function roleCard(c) {
    if (!role) return '<p class="hint">Ihre geheimen Angaben erscheinen erst nach der Rollenwahl.</p>';
    if (role==='coach') return `<article class="rolecard coach"><div class="rolelabel">Ihre Aufgabe · Gesprächskontrolle</div><h3>Hören. Nachfragen. Rückmelden.</h3><p>Sie unterstützen das Gespräch. Die geheimen Preisgrenzen und Zeiten der anderen bleiben verdeckt.</p>${list(['Fragen Sie nach, wenn eine Angabe fehlt: <span lang="fr">Quel prix ? À quelle heure ? Où ?</span>','Lassen Sie beide Personen Preis, Zeit und Ort getrennt notieren.','Vergleichen Sie die Einträge. Geben Sie eine konkrete Rückmeldung: «Das war klar: …»'])}<p class="fr" lang="fr">Vous pouvez répéter, s’il vous plaît ?</p><button class="btn secondary" data-action="hide-role">Karte wieder verdecken</button></article>`;
    const r=c[role];
    return `<article class="rolecard ${role}"><div class="rolelabel">Nur für Sie · ${esc(r.title)}</div><h3>${esc(c.item_de)}</h3><p>${esc(r.instruction)}</p><div class="fact"><span>${role==='buyer'?'Ihr höchstes Budget':'Ihr Mindestpreis'}</span><strong>CHF ${role==='buyer'?r.maximum_budget:r.minimum_price}</strong></div><div class="fact"><span>Ihre freien Zeiten</span><strong>${r.available_times.map(t=>esc(t)).join(' / ')}</strong></div><div class="fact"><span>Treffpunkt</span><strong lang="fr">${esc(r.place_fr)}</strong></div>${state.globalLevel==='support'?`<p class="hint" style="margin-top:16px" lang="fr">${role==='buyer'?esc(r.maximum_budget_fr):esc(r.minimum_price_fr)}</p>`:''}<div class="actions"><button class="btn secondary" data-action="hide-role">Karte wieder verdecken</button></div></article>`;
  }
  function partner() {
    const set=C.partner.sets.find(s=>s.id===partnerSet);
    main.innerHTML=heading('03 · NOS AGENDAS','Gleicher Tag. Andere Zeiten.','Finden Sie die drei Unterschiede. Zeigen Sie Ihren Plan nicht: Fragen und Antworten führen zur Lösung.',['Zu zweit','12 Minuten','6 Termine'])+`<div class="panel">${list(['Wählen Sie gemeinsam einen Tagesplan. Eine Person öffnet A, die andere B. Lesen Sie zuerst für sich (2 Min.).','Vergleichen Sie alle sechs Termine. Fragen Sie abwechselnd auf Französisch (7 Min.).','Notieren Sie die drei Unterschiede mit beiden Zeiten. Kontrollieren Sie am Schluss gemeinsam (3 Min.).'])}</div><section class="panel"><label for="partnerSet"><strong>Unser Tagesplan</strong></label><select id="partnerSet" data-action="partner-set">${C.partner.sets.map(s=>`<option value="${s.id}" ${s.id===partnerSet?'selected':''}>${esc(s.label)}</option>`).join('')}</select><div class="rolepick" aria-label="Mein Plan"><button data-partner-role="A" aria-pressed="${partnerRole==='A'}">Ich habe Plan A</button><button data-partner-role="B" aria-pressed="${partnerRole==='B'}">Ich habe Plan B</button></div>${partnerRole?`<h2>Ihr Plan ${partnerRole}</h2><div class="tablewrap"><table><thead><tr><th>Nr.</th><th>Termin</th><th>Ihre Uhrzeit</th>${state.globalLevel==='support'?'<th>Satzhilfe</th>':''}</tr></thead><tbody>${set.events.map(e=>`<tr><td>${e.row}</td><td><strong lang="fr">${esc(e.event_fr)}</strong><br><small class="muted">${esc(e.event_de)}</small></td><td><time>${e['time_'+partnerRole]}</time></td>${state.globalLevel==='support'?`<td lang="fr">${esc(e.question_fr)}<br>${esc(e.answer_starter_fr)} …</td>`:''}</tr>`).join('')}</tbody></table></div><button class="btn secondary" style="margin-top:15px" data-action="hide-plan">Plan verdecken</button>`:'<p class="hint">Wählen Sie nur Ihren eigenen Plan. Der andere bleibt verdeckt.</p>'}${level('partner')}</section><details ${state.globalLevel==='support'?'open':''}><summary>Sprachhilfe · fragen und vergleichen</summary>${phrases(C.partner.phrases)}<details><summary>Eine passende Frage für jeden Termin</summary>${set.events.map(e=>`<p lang="fr"><strong>${e.row}.</strong> ${esc(e.question_fr)}<br><span class="muted">${esc(e.answer_starter_fr)} …</span></p>`).join('')}</details></details><section class="panel"><h2>Wo sind die drei Unterschiede?</h2><p>Notieren Sie beide Zeiten zuerst auf Papier. Wählen Sie danach genau drei Termine.</p><form id="partnerCheck">${set.events.map(e=>`<label class="checkline"><input type="checkbox" name="different" value="${e.row}"> <span>${e.row} · <span lang="fr">${esc(e.event_fr)}</span></span></label>`).join('')}<button class="primary" type="submit">Unsere Auswahl prüfen</button><div id="partnerFeedback" class="notice" role="status"></div><div id="partnerSolution"></div></form></section>`+complete(3,'#classe','Zur Klassenaktivität');
  }
  function training() {
    main.innerHTML=heading('04 · MEIN LERNATELIER','Ihr nächster Lernschritt.','Arbeiten Sie ruhig und selbständig. Lernen Sie zuerst die neuen Verben; wählen Sie danach Ihren eigenen Schwerpunkt.',['Allein','23 Minuten','10 + 8 + 5'])+level('training')+`<section class="panel soft"><span class="eyebrow">1 · ZEHN MINUTEN</span><h2>Fünf neue Verben + Bekanntes</h2><p lang="fr" class="fr">donner · parler · finir · sortir · écrire</p><p>Starten Sie mit Bedeutung und Beispielen. Üben Sie danach neue und bisherige Formen. Die Rückmeldungen helfen Ihnen beim nächsten Versuch.</p><a class="btn" href="../../verbentrainer/?set=2026W45&learn=1">Verbentrainer starten →</a><p class="small muted" style="margin-top:14px">Heute: Bedeutung verstehen und erste Formen abrufen. Alle Personen werden in weiteren kurzen Runden gefestigt.</p></section><section class="panel"><span class="eyebrow">2 · ACHT MINUTEN</span><h2>Mein Schwerpunkt</h2><p>Wählen Sie den Bereich, der Ihnen jetzt am meisten hilft. Nutzen Sie Hilfen, verbessern Sie Ihre Antwort und probieren Sie nochmals.</p><div class="actions"><a class="btn secondary" href="training.html#numbers">Zahlen trainieren</a><a class="btn secondary" href="training.html#times">Uhrzeiten trainieren</a><a class="btn secondary" href="../../verbentrainer/?set=2026W45">Verbformen festigen</a></div></section><section class="panel"><span class="eyebrow">3 · FÜNF MINUTEN</span><h2>Mein Check ohne Hilfe</h2><p>Wählen Sie Ihren Schwerpunkt. Erst selbst lösen, dann die Lösungen vergleichen. Der Check ist keine Note.</p><div class="actions"><a class="btn secondary" href="#check-numbers">Zahlen-Check</a><a class="btn secondary" href="#check-times">Uhrzeiten-Check</a><a class="btn secondary" href="#check-verbs">Verben-Check</a></div></section>`+complete(4,'#bilan','Zum Abschluss');
  }
  function productSVG(index) {
    const drawings=[`<path d="M40 95c-9 0-16-6-20-14M40 95h150c9 0 16-6 20-14"/><path d="M40 83h150" stroke="#087d78" stroke-width="12"/><circle cx="60" cy="113" r="10" fill="#edb34b"/><circle cx="170" cy="113" r="10" fill="#edb34b"/>`,`<path d="M76 47l-30 14-25 54 28 12 19-35v69h94V92l19 35 28-12-25-54-30-14" fill="#14364b"/><path d="M76 47c0-45 78-45 78 0l-22 20H98z" fill="#7bc2ae"/><path d="M92 127h46l12 25H80z" stroke="#a8dbca"/><path d="M106 65v32m18-32v32" stroke="#fff"/>`,`<path d="M70 161h100M120 160V96l35-55"/><path d="M115 22l53 30-31 54-53-30z" fill="#edb34b"/><circle cx="120" cy="96" r="9" fill="#087d78"/><path d="M87 96l-16 14m33 0-8 20" stroke="#edb34b"/>`,`<rect x="45" y="49" width="145" height="70" rx="20" fill="#14364b"/><circle cx="118" cy="84" r="25" fill="#77bfaf"/><circle cx="118" cy="84" r="10" fill="#fff"/><path d="M98 120v23h40v-23M80 151h77M188 91c40 0 11 60 34 60"/><circle cx="63" cy="70" r="3" stroke="#edb34b"/>`];
    return `<svg viewBox="0 0 240 190" aria-hidden="true">${drawings[index]}</svg>`;
  }
  function classe() {
    const r=C.price_game.rounds[priceRound];
    main.innerHTML=heading('ENSEMBLE · MINUTE 52–64','Le juste prix','Schätzen. Entscheiden. Gemeinsam zeigen. Sagen Sie den Betrag auf Französisch.',['Klasse','3 Runden + 1 Reserve','Danach: 3 Minuten Verben'])+`<p class="small muted">Alle Anzeigen und Preise sind erfunden. Es geht um Zahlen, nicht um Marktkenntnisse.</p><section class="classstage"><div class="product-art" role="img" aria-label="${esc(r.item_de)}">${productSVG(priceRound)}</div><div><span class="eyebrow">RUNDE ${priceRound+1} / 4${priceRound===3?' · RESERVE':''}</span><h2 lang="fr">${esc(r.item_fr)}</h2><p lang="fr">${esc(r.condition_fr)}</p><div class="priceoptions">${r.options.map((p,i)=>`<div class="priceoption"><small>${'ABC'[i]}</small> ${p} CHF</div>`).join('')}</div><p class="fr" lang="fr">Je pense que ça coûte … francs.</p><div id="priceReveal"><button class="primary" data-action="price-reveal">Preis aufdecken</button></div></div></section><div class="switchback"><button class="btn secondary" data-action="price-prev" ${priceRound===0?'disabled':''}>← Vorige Runde</button><button class="btn" data-action="price-next" ${priceRound===3?'disabled':''}>Nächste Runde →</button></div><details><summary>So spielen wir · 2 Minuten pro Runde</summary>${list(C.price_game.steps.map(esc))}<p class="small muted">${esc(C.price_game.teacher)}</p></details><section class="panel gold"><span class="eyebrow">DANACH · KURZER INPUT · 3 MINUTEN</span><h2>Cinq nouveaux verbes</h2><div class="grid3">${C.verbs.filter(v=>v.week===45).map(v=>`<div><h3 lang="fr">${esc(v.infinitive)}</h3><p>${esc(v.de)}<br><span class="small" lang="fr">${esc(v.example)}</span></p></div>`).join('')}</div><details><summary>Was fällt Ihnen an den Formen auf?</summary>${list(C.verb_intro.noticing.map(esc))}</details><a class="btn" href="#mission-4">Weiter zum individuellen Training →</a></section>`;
  }
  function check(kind) {
    const labels={numbers:'Zahlen',times:'Uhrzeiten',verbs:'Verben'};
    main.innerHTML=heading('MEIN CHECK · OHNE HILFE',`${labels[kind]}: Was gelingt schon?`,'Lösen Sie die Aufgaben zuerst selbst. Danach erhalten Sie die Lösungen zum Vergleichen.',['Allein','5 Minuten','Keine Note'])+`<form id="learningCheck" class="panel exitform" data-kind="${kind}">${C.checks[kind].map((q,i)=>`<div class="exititem"><label for="answer-${i}">${i+1}. ${esc(q.q)}</label><input id="answer-${i}" name="answer-${i}" autocomplete="off" spellcheck="false" ${q.extension?'':'required'}><div id="feedback-${i}"></div></div>`).join('')}<div class="actions"><button class="primary" type="submit">Meine Antworten vergleichen</button><a class="btn secondary" href="#mission-4">Zurück zum Training</a></div><div id="checkSummary" class="notice" role="status"></div></form><div class="actions"><a class="btn secondary" href="#bilan">Mein nächster Schritt →</a></div>`;
  }
  function bilan() {
    const reflection=state.exit||{};
    main.innerHTML=heading('MON BILAN · DIE LETZTEN 3 MINUTEN','Das nehme ich mit.','Wählen Sie einen konkreten nächsten Schritt. Ein Beispiel hilft Ihnen, beim nächsten Mal gezielt weiterzuüben.',['Allein','3 Minuten'])+`<form id="exitForm" class="panel"><div class="grid2"><div><label for="exitSuccess">Das gelingt mir schon</label><select id="exitSuccess" name="success">${C.exit.fields[0].options.map(t=>`<option ${reflection.success===t?'selected':''}>${esc(t)}</option>`).join('')}</select></div><div><label for="exitFocus">Das übe ich als Nächstes</label><select id="exitFocus" name="focus">${C.exit.fields[1].options.map(t=>`<option ${reflection.focus===t?'selected':''}>${esc(t)}</option>`).join('')}</select></div></div><label for="exitExample" style="margin-top:20px">Mein konkretes Beispiel</label><input id="exitExample" name="example" value="${esc(reflection.example||'')}" placeholder="Eine Zahl, Uhrzeit oder Verbform" style="width:100%" required><div class="actions"><button class="primary" type="submit">Meinen nächsten Schritt speichern</button><a class="btn secondary" href="#start">Zur Übersicht</a></div><div id="exitFeedback" class="notice" role="status">${reflection.example?'Ihr letzter Eintrag ist hier gespeichert.':''}</div></form><p class="small muted">Ihr Eintrag wird in diesem Browser gespeichert. Zeigen Sie ihn der Lehrperson, wenn Sie Unterstützung möchten.</p>`;
  }
  function material() {
    main.innerHTML=heading('ZUM MITNEHMEN','Material für Woche 45','Die Aufgaben und Sprachhilfen können Sie auch ausdrucken. Die Rollen sind auf getrennten Karten angeordnet.',['PDF','Offline auf Papier'])+`<div class="grid2 downloadgrid"><a href="material/Unterrichtsmaterial_W45.pdf" download><strong>Unterrichtsmaterial W45 ↓</strong><span>Rollenkarten, Tagespläne und Arbeitsblätter. Öffnen Sie nur Ihre eigene Rolle oder Ihren Plan.</span></a><a href="material/Lernhilfe_W45.pdf" download><strong>Lernhilfe W45 ↓</strong><span>Sprachmittel, Zahlen, Uhrzeiten und neue Verben zum Nachschlagen.</span></a></div><div class="quiet-message">Im Gespräch bleibt die Karte des Gegenübers verdeckt. Für Papierarbeit verteilt die Lehrperson die passenden Einzelkarten.</div><a class="btn secondary" href="#start">Zur Wochenübersicht →</a>`;
  }
  function render() {
    state = storageOK ? readState() : state;
    const hash=location.hash.slice(1)||'start';
    const names={'mission-1':'quiet','mission-2':'market','mission-3':'partner','mission-4':'training',classe:'classe',bilan:'bilan',material:'material',start:'start'};
    const view=hash.startsWith('check-')?'training':(names[hash]||'start');
    document.body.classList.toggle('class-mode',view==='classe');
    document.querySelectorAll('.mainnav a').forEach(a=>{if(a.dataset.view===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    const id={'quiet':1,'market':2,'partner':3,'training':4}[view];
    if(id) save({currentMission:id});
    if(hash.startsWith('check-') && ['numbers','times','verbs'].includes(hash.slice(6))) check(hash.slice(6));
    else ({start:dashboard,quiet,market,partner,training,classe,bilan,material}[view])();
    updateStatus();
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button'); if(!button)return;
    if(button.id==='largeText') { const on=document.body.classList.toggle('large');button.setAttribute('aria-pressed',String(on));save({largeText:on});return; }
    if(button.dataset.role){rememberDrafts();role=button.dataset.role;market();restoreDrafts();return;}
    if(button.dataset.partnerRole){rememberDrafts();partnerRole=button.dataset.partnerRole;partner();restoreDrafts();return;}
    switch(button.dataset.action){
      case 'hide-role':rememberDrafts();role='';market();restoreDrafts();break;
      case 'hide-plan':rememberDrafts();partnerRole='';partner();restoreDrafts();break;
      case 'price-next':priceRound=Math.min(3,priceRound+1);classe();break;
      case 'price-prev':priceRound=Math.max(0,priceRound-1);classe();break;
      case 'price-reveal': {const r=C.price_game.rounds[priceRound];$('#priceReveal').innerHTML=`<div class="reveal"><span lang="fr">${'ABC'[r.answer_index]} · ${r.price} CHF<br>${esc(r.price_fr)}</span></div>`;break;}
    }
  });
  document.addEventListener('change',event=>{
    const el=event.target;
    if(el.dataset.complete)save({missionDone:{[el.dataset.complete]:el.checked}});
    if(el.dataset.action==='level'){rememberDrafts();save({globalLevel:el.value});render();restoreDrafts();}
    if(el.dataset.action==='market-case'){rememberDrafts();marketCase=el.value;role='';market();restoreDrafts();}
    if(el.dataset.action==='partner-set'){rememberDrafts();partnerSet=el.value;partnerRole='';partner();restoreDrafts();}
  });
  document.addEventListener('submit',event=>{
    const form=event.target;event.preventDefault();
    if(form.id==='agreementForm'){
      const values=new FormData(form), c=C.market.cases.find(c=>c.id===marketCase);
      const a={price:values.get('price'),time:values.get('time'),place:values.get('place')};
      const valid=evaluateAgreement(c,a.price,a.time,a.place);
      const okay=Object.values(valid).every(Boolean), feedback=$('#dealFeedback');
      feedback.classList.toggle('bad',!okay);
      feedback.textContent=okay?'Das passt zu beiden Rollenkarten. Lesen Sie Ihre Abmachung einander nochmals auf Französisch vor.':'Prüfen Sie nochmals '+[!valid.price?'den Preis mit beiden geheimen Preisgrenzen':null,!valid.time?'die freien Zeiten beider Personen':null,!valid.place?'den Treffpunkt auf Ihrer Karte (nur z. B. «à la gare», ohne ganzen Satz)':null].filter(Boolean).join(' und ')+'. Fragen Sie nach und vereinbaren Sie eine passende Lösung.';
      save({agreements:{...state.agreements,[marketCase]:{...a,valid:okay}}});
    }
    if(form.id==='partnerCheck'){
      const choices=[...form.querySelectorAll('input:checked')].map(i=>Number(i.value));
      const feedback=$('#partnerFeedback');
      if(choices.length!==3){feedback.className='notice bad';feedback.textContent='Wählen Sie genau drei Termine. Vergleichen Sie dafür alle sechs Zeilen.';return;}
      const set=C.partner.sets.find(s=>s.id===partnerSet),hits=choices.filter(v=>set.different_rows.includes(v)).length;
      feedback.className='notice'+(hits===3?'':' bad');feedback.textContent=hits===3?'Alle drei Unterschiede gefunden. Vergleichen Sie jetzt auch Ihre beiden notierten Zeiten.':`${hits} von 3 gewählten Terminen stimmen. Vergleichen Sie Ihre Notizen mit der Lösung und sprechen Sie die Zeiten nochmals aus.`;
      $('#partnerSolution').innerHTML=`<h3>Gemeinsame Kontrolle</h3><div class="tablewrap"><table><thead><tr><th>Termin</th><th>Plan A</th><th>Plan B</th></tr></thead><tbody>${set.solution.map(s=>`<tr><td>${s.row} · <span lang="fr">${esc(s.event_fr)}</span></td><td>${s.A}</td><td>${s.B}</td></tr>`).join('')}</tbody></table></div>`;
      save({partnerResults:{...state.partnerResults,[partnerSet]:{choices,hits}}});
    }
    if(form.id==='learningCheck'){
      if(form.dataset.checked==='true')return;
      const kind=form.dataset.kind, questions=C.checks[kind];let correct=0,attempted=0;
      questions.forEach((q,i)=>{const field=$(`#answer-${i}`),answer=field.value; if(!answer.trim()&&q.extension){$(`#feedback-${i}`).innerHTML='<p class="hint">Zusatz ausgelassen.</p>';return;} attempted++;const ok=checkAnswer(q,answer);if(ok)correct++;field.readOnly=true;$(`#feedback-${i}`).innerHTML=`<p class="notice ${ok?'':'bad'}">${ok?'✓ Gelungen.':'Nochmals üben.'} Lösung: <strong>${esc((q.accepted||[q.answer]).join(' / '))}</strong></p>`;});
      form.dataset.checked='true';form.querySelector('button[type=submit]').disabled=true;
      $('#checkSummary').textContent=`${correct} von ${attempted} Antworten gelungen. Wählen Sie eine noch unsichere Aufgabe als nächsten Übungsschritt. Dieser Check ist keine Note.`;
      save({checks:{...state.checks,[kind]:{correct,attempted,at:new Date().toISOString()}}});
    }
    if(form.id==='exitForm'){
      const data=new FormData(form);save({exit:{success:data.get('success'),focus:data.get('focus'),example:data.get('example')}});
      $('#exitFeedback').textContent=storageOK?'Gespeichert. Sie wissen, womit Sie beim nächsten Mal weiterüben.':'Ihr nächster Schritt ist ausgewählt. Notieren Sie ihn auch auf Papier; Speichern ist hier nicht verfügbar.';
    }
  });
  window.addEventListener('hashchange',()=>{role='';partnerRole='';render();main.focus({preventScroll:true});window.scrollTo(0,0);});
  window.addEventListener('storage',event=>{if(event.key===KEY)render();});
  if(state.largeText){document.body.classList.add('large');$('#largeText').setAttribute('aria-pressed','true');}
  render();
})();
