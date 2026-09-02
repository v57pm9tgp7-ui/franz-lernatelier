window.FRANZ_MODULES = [
  {
    id: 'woche-36-2026',
    week: 36,
    schoolYear: '2026/27',
    title: 'Bienvenue',
    subtitle: 'Passeport de français',
    description: 'Begrüssen, Befinden ausdrücken, Hilfssätze nutzen, sich vorstellen und kurze Gespräche führen.',
    status: 'current',
    continuationOf: null,
    href: 'module/woche-36/index.html',
    duration: '2–3 Lektionen',
    missions: 8,
    storageKey: 'franzoesischLernatelierEinstieg_v1',
    facts: ['8 Stationen', '2–3 Lektionen', 'A1 bis B2+'],
    tags: ['Sprechen', 'Lesen', 'Interagieren', 'Strategien'],
    levels: [
      {
        id:'support', label:'Soutien', range:'A1 → A2', symbol:'+', color:'#2f6bff', soft:'#edf3ff',
        note:'Viele Hilfen, Beispiele und Satzanfänge.',
        supportTitle:'Viel Unterstützung',
        supportText:'Wortbank und Satzanfänge sind direkt verfügbar. Ein Beispiel können Sie bei Bedarf öffnen.',
        layers:['Wortbank','Satzanfänge','Beispiel','kleine Schritte'],
        placeholder:'Wählen Sie einen Satzanfang …'
      },
      {
        id:'standard', label:'Standard', range:'A2', symbol:'●', color:'#147c73', soft:'#e8f6f3',
        note:'Gezielte Hilfe, die Sie bei Bedarf öffnen.',
        supportTitle:'Gezielte Unterstützung',
        supportText:'Sie schreiben selbst. Ein Satzanfang, Wortideen und ein kurzer Check bleiben verfügbar.',
        layers:['1 Satzanfang','Wortideen','Kurzcheck','Beispiel bei Bedarf'],
        placeholder:'écrivez votre réponse …'
      },
      {
        id:'challenge', label:'Défi', range:'A2+ → B1', symbol:'↗', color:'#b87900', soft:'#fff6df',
        note:'Weniger Gerüst, mehr eigene Sprache.',
        supportTitle:'Weniger Hilfe, mehr eigene Sprache',
        supportText:'Sie formulieren frei und ergänzen einen Grund, ein Beispiel oder eine passende Rückfrage.',
        layers:['frei formulieren','Grund','Beispiel','Rückfrage'],
        placeholder:'formulez librement et ajoutez une raison …'
      },
      {
        id:'expert', label:'Expert', range:'B1 → B2+', symbol:'◆', color:'#10233f', soft:'#eef2f7',
        note:'Längere und sprachlich anspruchsvollere Aufgaben.',
        supportTitle:'Anspruchsvollere Aufgabe',
        supportText:'Sie arbeiten mit Nuancen, Register und Strategien zum Umschreiben. Satzbausteine treten in den Hintergrund.',
        layers:['Register','Nuancen','umschreiben','spontan reagieren'],
        placeholder:'développez une réponse nuancée …'
      }
    ],
    missionList: [
      {id:1, title:'Se saluer', description:'Begrüssen, reagieren und verabschieden', time:'15–20 Min.', form:'Einzelarbeit', symbol:'B'},
      {id:2, title:'Comment ça va ?', description:'Befinden ausdrücken und passend reagieren', time:'15–20 Min.', form:'EA + PA', symbol:'Ç'},
      {id:3, title:'Kit de survie', description:'Hilfssätze für den Unterricht', time:'20–25 Min.', form:'Einzelarbeit', symbol:'K'},
      {id:4, title:'Qui suis-je ?', description:'Lesen und Informationen finden', time:'15–20 Min.', form:'Einzelarbeit', symbol:'Q'},
      {id:5, title:'Mon profil express', description:'Eine persönliche Vorstellung aufbauen', time:'20–25 Min.', form:'EA + PA', symbol:'M'},
      {id:6, title:'Speed-Dating', description:'Fragen, antworten und weiterführen', time:'25–35 Min.', form:'EA + PA', symbol:'S'},
      {id:7, title:'20 questions', description:'Persönliche Fragen respektvoll nutzen', time:'25–35 Min.', form:'EA + PA', symbol:'20'},
      {id:8, title:'Défi final', description:'45 Sekunden möglichst frei sprechen', time:'15–20 Min.', form:'Partnerarbeit', symbol:'D'}
    ],
    training: [
      {id:'cards', title:'Cartes', subtitle:'Wortschatz', description:'Wörter und Sätze erinnern, aufdecken und laut nachsprechen.', icon:'cards', color:'coral', time:'5 Min.'},
      {id:'dictation', title:'Écoute', subtitle:'Diktat', description:'Einen Satz hören, in Wortgruppen erfassen und aufschreiben.', icon:'headphones', color:'sky', time:'5–8 Min.'},
      {id:'reaction', title:'Réagis', subtitle:'Blitzreaktion', description:'Eine Situation lesen und innerhalb von zehn Sekunden passend antworten.', icon:'bolt', color:'mint', time:'5 Min.'},
      {id:'expert', title:'Expert', subtitle:'60 Sekunden', description:'Zu einem Sprechimpuls eine Minute lang möglichst frei sprechen.', icon:'mic', color:'violet', time:'8–10 Min.'}
    ]
  }
];
