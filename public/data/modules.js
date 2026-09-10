window.FRANZ_MODULES = [
  {
    id: 'woche-36-2026',
    week: 36,
    schoolYear: '2026/27',
    title: 'Bienvenue',
    subtitle: 'Passeport de français',
    description: 'Abschluss von Woche 36: 20 Questions vorbereiten, die persönliche Vorstellung aufbauen und im Défi final möglichst frei sprechen.',
    status: 'previous',
    continuationOf: null,
    href: 'module/woche-36/index.html',
    duration: 'Restweg · 3 Escales + Gruppenphase',
    missions: 3,
    storageKey: 'franzoesischLernatelierEinstieg_v1',
    remainingFlow: [7,5,8],
    facts: ['3 verbleibende Escales', 'Bordeaux → Marseille → Nice', 'A1 bis B2+'],
    tags: ['Sprechen', 'Lesen', 'Interagieren', 'Strategien'],
    levels: [
      {id:'support',label:'Soutien',range:'A1 → A2',symbol:'+',color:'#2f6bff',soft:'#edf3ff',note:'Viele Hilfen, Beispiele und Satzanfänge.',supportTitle:'Viel Unterstützung',supportText:'Wortbank und Satzanfänge sind direkt verfügbar. Ein Beispiel können Sie bei Bedarf öffnen.',layers:['Wortbank','Satzanfänge','Beispiel','kleine Schritte'],placeholder:'Wählen Sie einen Satzanfang …'},
      {id:'standard',label:'Standard',range:'A2',symbol:'●',color:'#147c73',soft:'#e8f6f3',note:'Gezielte Hilfe, die Sie bei Bedarf öffnen.',supportTitle:'Gezielte Unterstützung',supportText:'Sie schreiben selbst. Ein Satzanfang, Wortideen und ein kurzer Check bleiben verfügbar.',layers:['1 Satzanfang','Wortideen','Kurzcheck','Beispiel bei Bedarf'],placeholder:'écrivez votre réponse …'},
      {id:'challenge',label:'Défi',range:'A2+ → B1',symbol:'↗',color:'#b87900',soft:'#fff6df',note:'Weniger Gerüst, mehr eigene Sprache.',supportTitle:'Weniger Hilfe, mehr eigene Sprache',supportText:'Sie formulieren frei und ergänzen einen Grund, ein Beispiel oder eine passende Rückfrage.',layers:['frei formulieren','Grund','Beispiel','Rückfrage'],placeholder:'formulez librement et ajoutez une raison …'},
      {id:'expert',label:'Expert',range:'B1 → B2+',symbol:'◆',color:'#10233f',soft:'#eef2f7',note:'Längere und sprachlich anspruchsvollere Aufgaben.',supportTitle:'Anspruchsvollere Aufgabe',supportText:'Sie arbeiten mit Nuancen, Register und Strategien zum Umschreiben. Satzbausteine treten in den Hintergrund.',layers:['Register','Nuancen','umschreiben','spontan reagieren'],placeholder:'développez une réponse nuancée …'}
    ],
    missionList: [
      {id:7,title:'Bordeaux · 20 questions',description:'Vier Fragen auswählen und eigene Antworten vorbereiten',time:'20–25 Min.',form:'Einzelarbeit',symbol:'B'},
      {id:5,title:'Marseille · Mon profil express',description:'Aus persönlichen Antworten eine kurze Vorstellung aufbauen',time:'20–25 Min.',form:'EA + PA',symbol:'M'},
      {id:8,title:'Nice · Défi final',description:'Zweimal 60 Sekunden sprechen, Partner wechseln und Feedback nutzen',time:'20–25 Min.',form:'Partnerarbeit',symbol:'N'}
    ],
    training: [
      {id:'cards',title:'Cartes',subtitle:'Wortschatz',description:'Wörter, Sätze und Verbindungswörter erinnern, aufdecken und laut nachsprechen.',icon:'cards',color:'coral',time:'5 Min.'},
      {id:'dictation',title:'Écoute',subtitle:'Diktat',description:'Einen Satz hören, in Wortgruppen erfassen und aufschreiben.',icon:'headphones',color:'sky',time:'5–8 Min.'},
      {id:'reaction',title:'Réagis',subtitle:'Blitzreaktion',description:'Eine Situation lesen und innerhalb von zehn Sekunden passend antworten.',icon:'bolt',color:'mint',time:'5 Min.'},
      {id:'expert',title:'Expert',subtitle:'60 Sekunden',description:'Zu einem Sprechimpuls eine Minute lang möglichst frei sprechen.',icon:'mic',color:'violet',time:'8–10 Min.'}
    ]
  },
  {
    id: 'woche-37-2026',
    week: 37,
    schoolYear: '2026/27',
    title: 'Qui suis-je ?',
    subtitle: 'Je me présente',
    description: 'Das Profil aus Marseille erweitern, Schule und Beruf vorstellen und eine Minute frei im Video sprechen.',
    homeLead: 'Nutzen Sie Ihre Angaben aus Woche 36, ergänzen Sie Schule und Beruf und üben Sie Ihre Vorstellung. Am Schluss geben Sie ein 60-Sekunden-Video in Teams ab.',
    status: 'current',
    continuationOf: 'woche-36-2026',
    href: 'module/woche-37/index.html',
    duration: '2–3 Lektionen',
    missions: 8,
    storageKey: 'franzoesischLernatelierW37_v1',
    facts: ['8 Missionen', '2–3 Lektionen', 'A1 bis B2+'],
    tags: ['Sprechen', 'Hören', 'Interagieren', 'Beruf'],
    visual: {number:'37',phraseA:'Je me présente.',phraseB:'Et toi ?'},
    heroLogo: 'assets/logo-se-presenter-christoph.png',
    levels: [
      {id:'support',label:'Soutien',range:'A1 → A2',symbol:'+',color:'#2f6bff',soft:'#edf3ff',note:'Viele Hilfen, Wortbanken und klare Satzanfänge.',supportTitle:'Viel Unterstützung',supportText:'Sie erhalten Satzanfänge, Beispiele und kleine Schritte. Beim Üben können Sie die Hilfe schrittweise ausblenden.',layers:['Wortbank','Satzanfänge','Beispiel','kleine Schritte'],placeholder:'Wählen Sie einen Satzanfang …'},
      {id:'standard',label:'Standard',range:'A2',symbol:'●',color:'#147c73',soft:'#e8f6f3',note:'Gezielte Hilfe und zunehmend eigene Formulierungen.',supportTitle:'Gezielte Unterstützung',supportText:'Sie formulieren selbst und nutzen Hilfen nur, wenn Sie sie brauchen.',layers:['Satzanfang','Wortideen','Kurzcheck','laut sprechen'],placeholder:'écrivez votre réponse …'},
      {id:'challenge',label:'Défi',range:'A2+ → B1',symbol:'↗',color:'#b87900',soft:'#fff6df',note:'Mehr Details, Gründe und eigene Rückfragen.',supportTitle:'Mehr eigene Sprache',supportText:'Sie ergänzen Gründe, Details und Rückfragen und sprechen mit weniger Gerüst.',layers:['Grund','Detail','Rückfrage','weniger ablesen'],placeholder:'développez et ajoutez une raison …'},
      {id:'expert',label:'Expert',range:'B1 → B2+',symbol:'◆',color:'#10233f',soft:'#eef2f7',note:'Spontaner, differenzierter und mit weniger Gerüst.',supportTitle:'Anspruchsvollere Produktion',supportText:'Sie variieren Formulierungen, reagieren spontan und umschreiben Wortlücken auf Französisch.',layers:['Register','Nuancen','umschreiben','spontan reagieren'],placeholder:'formulez librement et avec nuance …'}
    ],
    missionList: [{"id": 1, "title": "Je reprends mon profil", "description": "Ihre Angaben aus Marseille prüfen und frei erzählen.", "time": "15–20 Min.", "form": "Einzelarbeit", "symbol": "1"}, {"id": 2, "title": "Mon école et mon projet", "description": "Schule, Sprachen und Berufswunsch ergänzen.", "time": "20–25 Min.", "form": "Einzelarbeit", "symbol": "2"}, {"id": 3, "title": "Je donne des détails", "description": "Drei eigene Sätze mit passenden Details ergänzen.", "time": "15–20 Min.", "form": "Einzelarbeit", "symbol": "3"}, {"id": 4, "title": "Écouter quatre profils", "description": "Vier Personen hören und auch Einzelheiten verstehen.", "time": "20–25 Min.", "form": "Einzelarbeit", "symbol": "4"}, {"id": 5, "title": "Mon expérience et mon projet", "description": "Beruf, Stärke und Schnupperlehre persönlich beschreiben.", "time": "20–25 Min.", "form": "Einzelarbeit", "symbol": "5"}, {"id": 6, "title": "Ma carte de parole", "description": "Eigene Stichwörter ordnen und damit 60 Sekunden üben.", "time": "15–20 Min.", "form": "Einzelarbeit", "symbol": "6"}, {"id": 7, "title": "Répéter en groupe", "description": "Drei Proben mit Rückmeldung und immer weniger Hilfe.", "time": "20–30 Min.", "form": "Dreiergruppe", "symbol": "7"}, {"id": 8, "title": "Ma vidéo · Défi final", "description": "Lernkontrolle: 60 Sekunden frei vorstellen und Video in Teams abgeben.", "time": "20–30 Min.", "form": "Einzelarbeit", "symbol": "8"}],
    training: [
      {id:'cards',title:'Cartes',subtitle:'Wortschatz & Verbindungen',description:'Fragen, Antworten und Verbindungswörter aktiv erinnern und laut sprechen.',icon:'cards',color:'coral',time:'5 Min.'},
      {id:'dictation',title:'Écoute',subtitle:'Diktat',description:'Kurze Selbstvorstellungs-Sätze hören und möglichst genau aufschreiben.',icon:'headphones',color:'sky',time:'5–8 Min.'},
      {id:'reaction',title:'Réagis',subtitle:'10 Sekunden',description:'Auf eine persönliche Frage schnell, passend und in einem ganzen Satz reagieren.',icon:'bolt',color:'mint',time:'5 Min.'},
      {id:'expert',title:'Expert',subtitle:'60 Sekunden',description:'Zu einem Sprechimpuls möglichst frei sprechen, verbinden und spontan reagieren.',icon:'mic',color:'violet',time:'8–10 Min.'}
    ]
  }
];

// Kleine Anpassungen der bestehenden Startseite an die jeweils aktuelle Woche.
// Die App selbst bleibt unverändert, damit Woche 36 weiterhin genau gleich funktioniert.
window.addEventListener('DOMContentLoaded', () => setTimeout(() => {
  const current = window.FRANZ_MODULES.find(module => module.status === 'current');
  if (!current) return;
  const lead = document.getElementById('homeLead');
  if (lead && current.homeLead) lead.textContent = current.homeLead;
  const heroVisual = document.querySelector('.week-hero-visual');
  if (heroVisual && current.week === 37) {
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
  if (demo) demo.textContent = 'Beispiel aus «Mon profil essentiel»';
  const coming = document.querySelector('.coming-card');
  if (coming) {
    const week = Number(current.week) + 1;
    const label = coming.querySelector('span');
    const title = coming.querySelector('h2');
    const text = coming.querySelector('p');
    if (label) label.textContent = `Woche ${week}`;
    if (title) title.textContent = `Woche ${week} erscheint hier.`;
    if (text) text.textContent = 'Sobald das nächste Modul veröffentlicht ist, können Sie an dieser Stelle weiterarbeiten.';
  }

  // Woche 36 zeigt bewusst nur noch den Restweg Bordeaux → Marseille → Nice.
  // Die 20-Questions-Sprechphase dazwischen findet mit der Präsentation in Dreiergruppen statt.
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

// Gemeinsamer Lesbarkeits-/Vollbildstandard fuer die Hauptseite.
(() => {
  if (document.querySelector('script[data-franz-workspace-ui]')) return;
  const script = document.createElement('script');
  script.src = 'assets/ui-workspace.js?v=20260909-ux14';
  script.dataset.franzWorkspaceUi = '1';
  document.head.appendChild(script);
})();
