// Franz Lernatelier · Wochenkonfiguration
// Version 0.22.0 · Woche 38: 7 Übungen, Partnerprobe und Vorlesefunktion.
const FRANZ_LEVELS_37 = [{"id":"support","label":"Soutien","range":"A1 → A2","symbol":"+","color":"#2f6bff","soft":"#edf3ff","note":"Viele Hilfen, Wortbanken und klare Satzanfänge.","supportTitle":"Viel Unterstützung","supportText":"Sie erhalten Satzanfänge, Beispiele und kleine Schritte. Beim Üben können Sie die Hilfe schrittweise ausblenden.","layers":["Wortbank","Satzanfänge","Beispiel","kleine Schritte"],"placeholder":"Wählen Sie einen Satzanfang …"},{"id":"standard","label":"Standard","range":"A2","symbol":"●","color":"#147c73","soft":"#e8f6f3","note":"Gezielte Hilfe und zunehmend eigene Formulierungen.","supportTitle":"Gezielte Unterstützung","supportText":"Sie formulieren selbst und nutzen Hilfen nur, wenn Sie sie brauchen.","layers":["Satzanfang","Wortideen","Kurzcheck","laut sprechen"],"placeholder":"écrivez votre réponse …"},{"id":"challenge","label":"Défi","range":"A2+ → B1","symbol":"↗","color":"#b87900","soft":"#fff6df","note":"Mehr Details, Gründe und eigene Rückfragen.","supportTitle":"Mehr eigene Sprache","supportText":"Sie ergänzen Gründe, Details und Rückfragen und sprechen mit weniger Gerüst.","layers":["Grund","Detail","Rückfrage","weniger ablesen"],"placeholder":"développez et ajoutez une raison …"},{"id":"expert","label":"Expert","range":"B1 → B2+","symbol":"◆","color":"#10233f","soft":"#eef2f7","note":"Spontaner, differenzierter und mit weniger Gerüst.","supportTitle":"Anspruchsvollere Produktion","supportText":"Sie variieren Formulierungen, reagieren spontan und umschreiben Wortlücken auf Französisch.","layers":["Register","Nuancen","umschreiben","spontan reagieren"],"placeholder":"formulez librement et avec nuance …"}];
const FRANZ_MISSIONS_37 = [{"id":1,"title":"Je reprends mon profil","description":"Ihre Angaben aus Marseille prüfen und frei erzählen.","time":"15–20 Min.","form":"Einzelarbeit","symbol":"1"},{"id":2,"title":"Mon école et mon projet","description":"Schule, Sprachen und Berufswunsch ergänzen.","time":"20–25 Min.","form":"Einzelarbeit","symbol":"2"},{"id":3,"title":"Je donne des détails","description":"Drei eigene Sätze mit passenden Details ergänzen.","time":"15–20 Min.","form":"Einzelarbeit","symbol":"3"},{"id":4,"title":"Écouter quatre profils","description":"Vier Personen hören und auch Einzelheiten verstehen.","time":"20–25 Min.","form":"Einzelarbeit","symbol":"4"},{"id":5,"title":"Mon expérience et mon projet","description":"Beruf, Stärke und Schnupperlehre persönlich beschreiben.","time":"20–25 Min.","form":"Einzelarbeit","symbol":"5"},{"id":6,"title":"Ma carte de parole","description":"Eigene Stichwörter ordnen und damit 60 Sekunden üben.","time":"15–20 Min.","form":"Einzelarbeit","symbol":"6"},{"id":7,"title":"Répéter en groupe","description":"Drei Proben mit Rückmeldung und immer weniger Hilfe.","time":"20–30 Min.","form":"Dreiergruppe","symbol":"7"},{"id":8,"title":"Ma vidéo · Défi final","description":"Lernkontrolle: 60 Sekunden frei vorstellen und Video in Teams abgeben.","time":"20–30 Min.","form":"Einzelarbeit","symbol":"8"}];
const FRANZ_MISSIONS_38 = FRANZ_MISSIONS_37
  .filter(mission => mission.id !== 4)
  .map(mission => mission.id === 7 ? {...mission,
    title:'Répéter à deux',
    description:'Generalprobe zu zweit: sprechen, zuhören, Feedback geben und direkt danach aufnehmen.',
    time:'12–18 Min.',
    form:'Partnerarbeit'
  } : mission);
const FRANZ_TRAINING_37 = [{"id":"cards","title":"Cartes","subtitle":"Wortschatz & Verbindungen","description":"Fragen, Antworten und Verbindungswörter aktiv erinnern und laut sprechen.","icon":"cards","color":"coral","time":"5 Min."},{"id":"dictation","title":"Écoute","subtitle":"Diktat","description":"Kurze Selbstvorstellungs-Sätze hören und möglichst genau aufschreiben.","icon":"headphones","color":"sky","time":"5–8 Min."},{"id":"reaction","title":"Réagis","subtitle":"10 Sekunden","description":"Auf eine persönliche Frage schnell, passend und in einem ganzen Satz reagieren.","icon":"bolt","color":"mint","time":"5 Min."},{"id":"expert","title":"Expert","subtitle":"60 Sekunden","description":"Zu einem Sprechimpuls möglichst frei sprechen, verbinden und spontan reagieren.","icon":"mic","color":"violet","time":"8–10 Min."}];

window.FRANZ_TOPICS = [{"id":"se-presenter-2026","title":"Se présenter","subtitle":"Qui suis-je ?","weeks":[36,37,38],"active":true,"progressStorageKey":"franzoesischLernatelierW37_v1","description":"Begrüssen, persönliche Angaben machen, Schule und Beruf beschreiben und zunehmend frei sprechen.","assessmentSections":[{"id":"vocabulaire","label":"Vocabulaire","type":"vocabulary","enabled":true,"description":"Wörter, Fragen und Redemittel des ganzen Themas sicher verstehen und auf Französisch abrufen.","vocabulary":[{"id":"cards.0","fr":"Comment tu t’appelles ?","de":"Wie heisst du?","category":"Fragen"},{"id":"cards.1","fr":"Tu habites où ?","de":"Wo wohnst du?","category":"Fragen"},{"id":"cards.2","fr":"Quels sont tes loisirs ?","de":"Was sind deine Hobbys?","category":"Fragen"},{"id":"cards.3","fr":"Quel métier veux-tu apprendre ?","de":"Welchen Beruf möchtest du lernen?","category":"Fragen"},{"id":"cards.4","fr":"Pourquoi ?","de":"Warum?","category":"Fragen"},{"id":"cards.5","fr":"Quelles langues parles-tu ?","de":"Welche Sprachen sprichst du?","category":"Fragen"},{"id":"cards.6","fr":"Et toi ?","de":"Rückfrage: Und du?","category":"Gespräch"},{"id":"cards.7","fr":"Je préfère ne pas répondre.","de":"Ich möchte lieber nicht antworten.","category":"Gespräch"},{"id":"cards.8","fr":"Je m’appelle …","de":"Ich heisse …","category":"Persönliche Angaben"},{"id":"cards.9","fr":"J’ai seize ans.","de":"Ich bin sechzehn Jahre alt.","category":"Persönliche Angaben"},{"id":"cards.10","fr":"J’habite à Berne.","de":"Ich wohne in Bern.","category":"Persönliche Angaben"},{"id":"cards.11","fr":"Dans mon temps libre, …","de":"In meiner Freizeit …","category":"Persönliche Angaben"},{"id":"cards.12","fr":"Je parle allemand.","de":"Ich spreche Deutsch.","category":"Persönliche Angaben"},{"id":"cards.13","fr":"Je suis à la BFF.","de":"Ich bin an der BFF.","category":"Schule"},{"id":"cards.14","fr":"Je voudrais devenir …","de":"Ich möchte … werden.","category":"Beruf"},{"id":"cards.15","fr":"Je m’intéresse au métier de …","de":"Ich interessiere mich für den Beruf …","category":"Beruf"},{"id":"cards.16","fr":"un apprentissage","de":"eine Berufslehre","category":"Beruf"},{"id":"cards.17","fr":"une place d’apprentissage","de":"eine Lehrstelle","category":"Beruf"},{"id":"cards.18","fr":"un stage","de":"eine Schnupperlehre","category":"Schnupperlehre"},{"id":"cards.19","fr":"J’ai fait un stage.","de":"Ich habe eine Schnupperlehre gemacht.","category":"Schnupperlehre"},{"id":"cards.20","fr":"Je n’ai pas encore fait de stage.","de":"Ich habe noch keine Schnupperlehre gemacht.","category":"Schnupperlehre"},{"id":"cards.21","fr":"J’ai aidé à …","de":"Ich habe mitgeholfen, …","category":"Schnupperlehre"},{"id":"cards.22","fr":"J’ai observé …","de":"Ich habe … beobachtet.","category":"Schnupperlehre"},{"id":"cards.23","fr":"Ce qui m’a plu, c’est …","de":"Was mir gefallen hat, ist …","category":"Schnupperlehre"},{"id":"cards.24","fr":"parce que","de":"weil","category":"Verbindungswörter"},{"id":"cards.25","fr":"aussi","de":"auch","category":"Verbindungswörter"},{"id":"cards.26","fr":"mais","de":"aber","category":"Verbindungswörter"},{"id":"cards.27","fr":"surtout","de":"vor allem","category":"Verbindungswörter"},{"id":"cards.28","fr":"souvent","de":"oft","category":"Verbindungswörter"},{"id":"cards.29","fr":"par exemple","de":"zum Beispiel","category":"Verbindungswörter"},{"id":"cards.30","fr":"fiable","de":"zuverlässig","category":"Stärken"},{"id":"cards.31","fr":"patient / patiente","de":"geduldig","category":"Stärken"},{"id":"cards.32","fr":"soigneux / soigneuse","de":"sorgfältig","category":"Stärken"},{"id":"cards.33","fr":"Je travaille bien en équipe.","de":"Ich arbeite gut im Team.","category":"Stärken"},{"id":"cards.34","fr":"aider les gens","de":"Menschen helfen","category":"Beruf"},{"id":"cards.35","fr":"travailler avec mes mains","de":"mit den Händen arbeiten","category":"Beruf"},{"id":"cards.36","fr":"résoudre un problème","de":"ein Problem lösen","category":"Beruf"},{"id":"cards.37","fr":"préparer le matériel","de":"das Material vorbereiten","category":"Schnupperlehre"},{"id":"cards.38","fr":"accueillir les clients","de":"Kundinnen und Kunden begrüssen","category":"Schnupperlehre"},{"id":"cards.39","fr":"vérifier mon travail","de":"meine Arbeit kontrollieren","category":"Stärken"},{"id":"cards.40","fr":"Je veux améliorer mon français.","de":"Ich möchte mein Französisch verbessern.","category":"Lernziel"},{"id":"cards.41","fr":"Merci de m’avoir écouté.","de":"Danke fürs Zuhören.","category":"Schluss"},{"id":"cards.42","fr":"et","de":"und","category":"Verbindungswörter"},{"id":"cards.43","fr":"avec","de":"mit","category":"Verbindungswörter"}]},{"id":"grammaire","label":"Grammaire","type":"grammar","enabled":false},{"id":"communication","label":"Communication","type":"speaking","enabled":false}]}];

window.FRANZ_MODULES = [
  {
    id:'woche-36-2026',week:36,schoolYear:'2026/27',topicId:'se-presenter-2026',
    title:'Bienvenue',subtitle:'Passeport de français',
    description:'Abschluss von Woche 36: 20 Questions vorbereiten, die persönliche Vorstellung aufbauen und im Défi final möglichst frei sprechen.',
    status:'previous',continuationOf:null,href:'module/woche-36/index.html',
    duration:'Restweg · 3 Escales + Gruppenphase',missions:3,
    storageKey:'franzoesischLernatelierEinstieg_v1',
    remainingFlow:[7,5,8],
    facts:['3 verbleibende Escales','Bordeaux → Marseille → Nice','A1 bis B2+'],
    tags:['Sprechen','Lesen','Interagieren','Strategien'],
    levels:[{"id":"support","label":"Soutien","range":"A1 → A2","symbol":"+","color":"#2f6bff","soft":"#edf3ff","note":"Viele Hilfen, Beispiele und Satzanfänge.","supportTitle":"Viel Unterstützung","supportText":"Wortbank und Satzanfänge sind direkt verfügbar. Ein Beispiel können Sie bei Bedarf öffnen.","layers":["Wortbank","Satzanfänge","Beispiel","kleine Schritte"],"placeholder":"Wählen Sie einen Satzanfang …"},{"id":"standard","label":"Standard","range":"A2","symbol":"●","color":"#147c73","soft":"#e8f6f3","note":"Gezielte Hilfe, die Sie bei Bedarf öffnen.","supportTitle":"Gezielte Unterstützung","supportText":"Sie schreiben selbst. Ein Satzanfang, Wortideen und ein kurzer Check bleiben verfügbar.","layers":["1 Satzanfang","Wortideen","Kurzcheck","Beispiel bei Bedarf"],"placeholder":"écrivez votre réponse …"},{"id":"challenge","label":"Défi","range":"A2+ → B1","symbol":"↗","color":"#b87900","soft":"#fff6df","note":"Weniger Gerüst, mehr eigene Sprache.","supportTitle":"Weniger Hilfe, mehr eigene Sprache","supportText":"Sie formulieren frei und ergänzen einen Grund, ein Beispiel oder eine passende Rückfrage.","layers":["frei formulieren","Grund","Beispiel","Rückfrage"],"placeholder":"formulez librement et ajoutez une raison …"},{"id":"expert","label":"Expert","range":"B1 → B2+","symbol":"◆","color":"#10233f","soft":"#eef2f7","note":"Längere und sprachlich anspruchsvollere Aufgaben.","supportTitle":"Anspruchsvollere Aufgabe","supportText":"Sie arbeiten mit Nuancen, Register und Strategien zum Umschreiben. Satzbausteine treten in den Hintergrund.","layers":["Register","Nuancen","umschreiben","spontan reagieren"],"placeholder":"développez une réponse nuancée …"}],
    missionList:[{"id":7,"title":"Bordeaux · 20 questions","description":"Vier Fragen auswählen und eigene Antworten vorbereiten","time":"20–25 Min.","form":"Einzelarbeit","symbol":"B"},{"id":5,"title":"Marseille · Mon profil express","description":"Aus persönlichen Antworten eine kurze Vorstellung aufbauen","time":"20–25 Min.","form":"EA + PA","symbol":"M"},{"id":8,"title":"Nice · Défi final","description":"Zweimal 60 Sekunden sprechen, Partner wechseln und Feedback nutzen","time":"20–25 Min.","form":"Partnerarbeit","symbol":"N"}],
    training:[{"id":"cards","title":"Cartes","subtitle":"Wortschatz","description":"Wörter, Sätze und Verbindungswörter erinnern, aufdecken und laut nachsprechen.","icon":"cards","color":"coral","time":"5 Min."},{"id":"dictation","title":"Écoute","subtitle":"Diktat","description":"Einen Satz hören, in Wortgruppen erfassen und aufschreiben.","icon":"headphones","color":"sky","time":"5–8 Min."},{"id":"reaction","title":"Réagis","subtitle":"Blitzreaktion","description":"Eine Situation lesen und innerhalb von zehn Sekunden passend antworten.","icon":"bolt","color":"mint","time":"5 Min."},{"id":"expert","title":"Expert","subtitle":"60 Sekunden","description":"Zu einem Sprechimpuls eine Minute lang möglichst frei sprechen.","icon":"mic","color":"violet","time":"8–10 Min."}]
  },
  {
    id:'woche-37-2026',week:37,schoolYear:'2026/27',topicId:'se-presenter-2026',
    title:'Qui suis-je ?',subtitle:'Je me présente',
    description:'Das Profil aus Marseille erweitern, Schule und Beruf vorstellen und eine Minute frei im Video sprechen.',
    homeLead:'Die Übungen bleiben verfügbar. Ihr Arbeitsstand wird in Woche 38 direkt weitergeführt.',
    status:'previous',continuationOf:'woche-36-2026',href:'module/woche-37/index.html',
    duration:'2–3 Lektionen',missions:8,storageKey:'franzoesischLernatelierW37_v1',
    facts:['8 Missionen','2–3 Lektionen','A1 bis B2+'],
    tags:['Sprechen','Hören','Interagieren','Beruf'],
    visual:{number:'37',phraseA:'Je me présente.',phraseB:'Et toi ?'},
    heroLogo:'assets/logo-se-presenter-christoph.png',
    levels:FRANZ_LEVELS_37,missionList:FRANZ_MISSIONS_37,training:FRANZ_TRAINING_37
  },
  {
    id:'woche-38-2026',week:38,schoolYear:'2026/27',topicId:'se-presenter-2026',
    title:'Je continue',subtitle:'Qui suis-je ? · weiterarbeiten',
    description:'Sie führen sieben Übungen aus Woche 37 weiter. Übung 4 wird diese Woche ausgelassen.',
    homeLead:'Woche 38 führt Ihren Lernstand aus Woche 37 weiter. Sie sehen sieben bekannte Übungen; Übung 4 ist bewusst nicht mehr dabei.',
    status:'current',continuationOf:'woche-37-2026',href:'module/woche-38/index.html',
    duration:'Weiterarbeit · individuell',missions:7,storageKey:'franzoesischLernatelierW37_v1',
    sharedProgressWith:'woche-37-2026',
    facts:['7 Übungen aus Woche 37','Übung 4 ausgelassen','Stand aus Woche 37 übernommen'],
    tags:['Weiterarbeiten','Sprechen','Interagieren','Beruf'],
    visual:{number:'38',phraseA:'Je continue.',phraseB:'À mon rythme.'},
    heroLogo:'assets/logo-se-presenter-christoph.png',
    levels:FRANZ_LEVELS_37,missionList:FRANZ_MISSIONS_38,training:FRANZ_TRAINING_37
  }
];

// Kleine Anpassungen der bestehenden Startseite an die jeweils aktuelle Woche.
window.addEventListener('DOMContentLoaded', () => setTimeout(() => {
  const current = window.FRANZ_MODULES.find(module => module.status === 'current');
  if (!current) return;
  const lead = document.getElementById('homeLead');
  if (lead && current.homeLead) lead.textContent = current.homeLead;

  const heroVisual = document.querySelector('.week-hero-visual');
  if (heroVisual && current.week >= 37) {
    heroVisual.classList.add('has-custom-week-logo');
    if (!heroVisual.querySelector('.week-hero-logo')) {
      const logo = document.createElement('img');
      logo.className = 'week-hero-logo';
      logo.src = current.heroLogo || 'assets/logo-se-presenter-christoph.png';
      logo.alt = 'Se présenter';
      heroVisual.appendChild(logo);
    }
  }
  const visualNumber = document.querySelector('.visual-number');
  if (visualNumber) visualNumber.textContent = current.visual?.number || current.week;
  const cardA = document.querySelector('.speech-card.card-a');
  const cardB = document.querySelector('.speech-card.card-b');
  if (cardA) cardA.textContent = current.visual?.phraseA || 'Bonjour !';
  if (cardB) cardB.textContent = current.visual?.phraseB || 'Ça va ?';
  const demo = document.querySelector('.exercise-example small');
  if (demo) demo.textContent = 'Beispiel aus «Qui suis-je ?»';

  const coming = document.querySelector('.coming-card');
  if (coming) {
    const week = Number(current.week) + 1;
    const label = coming.querySelector('span');
    const title = coming.querySelector('h2');
    const text = coming.querySelector('p');
    if (label) label.textContent = `Woche ${week}`;
    if (title) title.textContent = `Woche ${week} erscheint hier.`;
    if (text) text.textContent = 'Sobald neue Inhalte veröffentlicht sind, können Sie an dieser Stelle weiterarbeiten.';
  }

  // Woche 36 zeigt bewusst nur noch den Restweg Bordeaux → Marseille → Nice.
  const w36 = window.FRANZ_MODULES.find(module => module.id === 'woche-36-2026');
  if (w36) {
    let previous = {};
    try { previous = JSON.parse(localStorage.getItem(w36.storageKey) || '{}'); } catch (_) {}
    const rest = [7,5,8];
    const done = rest.filter(id => previous?.missionDone?.[id]).length;
    const pct = Math.round(done / rest.length * 100);
    [...document.querySelectorAll('.week-list-card')].forEach(card => {
      if (card.querySelector('h2')?.textContent?.trim() !== 'Bienvenue') return;
      const copy = card.querySelector('.week-list-copy p');
      if (copy) copy.textContent = 'Abschlussweg: Bordeaux vorbereiten → 20 Questions in Dreiergruppen → Marseille → Nice.';
      const progressLabel = card.querySelector('.week-list-progress span');
      const progressValue = card.querySelector('.week-list-progress strong');
      const progressBar = card.querySelector('.progress-track span');
      if (progressLabel) progressLabel.textContent = `${done} von 3 Abschluss-Escales`;
      if (progressValue) progressValue.textContent = `${pct}%`;
      if (progressBar) progressBar.style.width = `${pct}%`;
      const button = card.querySelector('.week-list-actions a');
      if (button) button.textContent = done === 3 ? 'Nochmals öffnen' : 'Restweg öffnen';
    });
  }
}, 0));

// Der Wochen-38-Adapter muss vor cloud-account.js laufen:
// Er verwendet online weiterhin denselben Lernstand wie Woche 37.
if (document.readyState === 'loading' && window.FRANZ_MODULES.some(m => m.week === 38 && m.status === 'current')) {
  document.write('<script src="assets/week38-home.js?v=20260917-w38-2"><\/script>');
}

if (document.readyState === 'loading') {
  document.write('<script src="assets/topic-training.js?v=20260913-topic2"><\/script>');
}

// Gemeinsamer Lesbarkeits-/Vollbildstandard fuer die Hauptseite.
(() => {
  if (document.querySelector('script[data-franz-workspace-ui]')) return;
  const script = document.createElement('script');
  script.src = 'assets/ui-workspace.js?v=20260909-ux14';
  script.dataset.franzWorkspaceUi = '1';
  document.head.appendChild(script);
})();


// Direkteinstieg für die Lehrperson auf franzatelier.com.
// Der Link ist nur sichtbar, wenn genau die Lehrpersonen-E-Mail im Lernatelier angemeldet ist.
// Die eigentliche Zugriffskontrolle bleibt Cloudflare Access auf /lehrperson/.
(() => {
  const ACCOUNT_KEY = 'franzLernatelierLearner_v1';
  const TEACHER_EMAIL = 'christoph.marti@bffbern.ch';

  function getEmail() {
    try {
      return String(JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '{}')?.email || '').trim().toLowerCase();
    } catch (_) {
      return '';
    }
  }

  function installStyle() {
    if (document.getElementById('teacher-entry-style')) return;
    const style = document.createElement('style');
    style.id = 'teacher-entry-style';
    style.textContent = `
      .teacher-entry-link{
        min-height:42px;display:inline-flex;align-items:center;gap:8px;padding:7px 12px;
        border:1px solid #a8c9c3;border-radius:12px;background:#f3fbf9;color:#0b315f;
        text-decoration:none;font-weight:900;white-space:nowrap
      }
      .teacher-entry-link[hidden]{display:none!important}
      .teacher-entry-link:hover{border-color:#177c73;background:#e7f4f1}
      .teacher-entry-link>span{
        width:28px;height:28px;display:grid;place-items:center;border-radius:9px;
        background:#0b315f;color:#fff;font-size:11px;letter-spacing:.03em
      }
      .teacher-entry-link>strong{font-size:13px}
      @media(max-width:920px){.teacher-entry-link>strong{display:none}.teacher-entry-link{padding:6px}}
    `;
    document.head.appendChild(style);
  }

  function updateTeacherLink() {
    const actions = document.querySelector('.header-actions');
    if (!actions) return;
    installStyle();

    let link = actions.querySelector('[data-teacher-entry]');
    if (!link) {
      link = document.createElement('a');
      link.href = 'lehrperson/';
      link.dataset.teacherEntry = '1';
      link.className = 'teacher-entry-link';
      link.setAttribute('aria-label', 'Lehrpersonenbereich öffnen');
      link.innerHTML = '<span aria-hidden="true">LP</span><strong>Lehrpersonenbereich</strong>';
      actions.insertBefore(link, actions.firstChild);
    }
    link.hidden = getEmail() !== TEACHER_EMAIL;
  }

  function startTeacherLink() {
    updateTeacherLink();
    const emailNode = document.querySelector('[data-learner-email]');
    if (emailNode) new MutationObserver(updateTeacherLink).observe(emailNode, {childList:true,subtree:true,characterData:true});
    window.addEventListener('pageshow', updateTeacherLink);
    window.addEventListener('focus', updateTeacherLink);
    window.addEventListener('storage', event => { if (event.key === ACCOUNT_KEY) updateTeacherLink(); });
    let n = 0;
    const timer = setInterval(() => { updateTeacherLink(); if (++n >= 12) clearInterval(timer); }, 500);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', startTeacherLink, {once:true})
    : startTeacherLink();
})();
