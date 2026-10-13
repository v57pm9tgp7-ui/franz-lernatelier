window.FRANZ42_GOALS={
  "goals": [
    {
      "id": "fragen",
      "name": "Fragen stellen",
      "short": "Kennenlernen",
      "goal": "Ich kann passende Fragen stellen – zum Beispiel zu Name, Wohnort, Freizeit und Beruf.",
      "success": "Ich wähle für eine Situation die richtige Frage und schreibe sie vollständig, mit Fragezeichen.",
      "why": "Im Test lesen Sie eine Situation und schreiben die passende französische Frage.",
      "time": "8–13 Min.",
      "ids": [
        "cards.0",
        "cards.1",
        "cards.2",
        "cards.3",
        "cards.4",
        "cards.5"
      ],
      "situations": [
        {
          "prompt": "Sie möchten wissen, wie eine Person heisst.",
          "answerId": "cards.0"
        },
        {
          "prompt": "Sie möchten wissen, wo Ihr Gegenüber wohnt.",
          "answerId": "cards.1"
        },
        {
          "prompt": "Sie möchten nach den Hobbys fragen.",
          "answerId": "cards.2"
        },
        {
          "prompt": "Sie möchten wissen, welcher Beruf Ihr Gegenüber interessiert.",
          "answerId": "cards.3"
        },
        {
          "prompt": "Fragen Sie nach dem Grund für den Berufswunsch.",
          "answerId": "cards.4"
        },
        {
          "prompt": "Fragen Sie nach den gesprochenen Sprachen.",
          "answerId": "cards.5"
        }
      ],
      "competencies": [
        {
          "level": "Einstieg",
          "prompt": "Sie treffen eine neue Person. Fragen Sie nach dem Namen.",
          "solution": "Comment tu t’appelles ?",
          "criteria": "Eine vollständige Frage mit Fragezeichen."
        },
        {
          "level": "Zwei Fragen",
          "prompt": "Sie möchten Wohnort und Freizeit kennenlernen. Schreiben Sie zwei passende Fragen.",
          "solution": "Tu habites où ? Quels sont tes loisirs ?",
          "criteria": "Zwei unterschiedliche Fragen, verständlich und korrekt."
        },
        {
          "level": "Beruf entdecken",
          "prompt": "Fragen Sie zuerst nach dem Berufswunsch. Fragen Sie danach nach dem Grund.",
          "solution": "Quel métier veux-tu apprendre ? Pourquoi ?",
          "criteria": "Frage zum Beruf und passende Nachfrage."
        }
      ]
    },
    {
      "id": "person",
      "name": "Über mich sprechen",
      "short": "Persönliche Angaben",
      "goal": "Ich kann mich in mehreren einfachen französischen Sätzen vorstellen.",
      "success": "Ich verbinde persönliche Angaben zu einer kurzen, verständlichen Selbstvorstellung.",
      "why": "Im Test schreiben Sie nicht nur einzelne Wörter, sondern können mehrere passende Sätze bilden.",
      "time": "8–12 Min.",
      "ids": [
        "cards.8",
        "cards.9",
        "cards.10",
        "cards.11",
        "cards.12",
        "cards.13"
      ],
      "situations": [
        {
          "prompt": "Stellen Sie sich mit Ihrem Namen vor (Satzanfang).",
          "answerId": "cards.8"
        },
        {
          "prompt": "Sagen Sie, dass Sie 16 Jahre alt sind.",
          "answerId": "cards.9"
        },
        {
          "prompt": "Sagen Sie, dass Sie in Bern wohnen.",
          "answerId": "cards.10"
        },
        {
          "prompt": "Beginnen Sie einen Satz über Ihre Freizeit.",
          "answerId": "cards.11"
        },
        {
          "prompt": "Sagen Sie, dass Sie Deutsch sprechen.",
          "answerId": "cards.12"
        },
        {
          "prompt": "Sagen Sie, dass Sie an der BFF sind.",
          "answerId": "cards.13"
        }
      ],
      "competencies": [
        {
          "level": "Zwei Angaben",
          "prompt": "Schreiben Sie: Ich heisse Léa. Ich bin 16 Jahre alt.",
          "solution": "Je m’appelle Léa. J’ai seize ans.",
          "criteria": "Zwei vollständige Sätze mit je / j’ai."
        },
        {
          "level": "Wo und welche Sprache?",
          "prompt": "Schreiben Sie: Ich wohne in Bern. Ich spreche Deutsch.",
          "solution": "J’habite à Berne. Je parle allemand.",
          "criteria": "Wohnort und Sprache in je einem korrekten Satz."
        },
        {
          "level": "Mini-Vorstellung",
          "prompt": "Stellen Sie sich in drei kurzen Sätzen vor: Name, Schule und Freizeit. Den Namen und die Freizeit wählen Sie selbst.",
          "solution": "Je m’appelle Amir. Je suis à la BFF. Dans mon temps libre, je joue au football.",
          "criteria": "Drei verständliche Sätze; eigene Angaben dürfen anders sein."
        }
      ]
    },
    {
      "id": "beruf",
      "name": "Beruf und Ziele",
      "short": "Berufswunsch",
      "goal": "Ich kann einen Berufswunsch ausdrücken und einen einfachen Grund nennen.",
      "success": "Ich schreibe einen Berufswunsch und ergänze bei Bedarf eine passende Begründung.",
      "why": "Im Test kann die Frage nach Ihrem beruflichen Ziel oder einer einfachen Begründung vorkommen.",
      "time": "10–15 Min.",
      "ids": [
        "cards.14",
        "cards.15",
        "cards.17",
        "cards.34"
      ],
      "situations": [
        {
          "prompt": "Beginnen Sie: Ich möchte … werden.",
          "answerId": "cards.14"
        },
        {
          "prompt": "Beginnen Sie: Ich interessiere mich für den Beruf …",
          "answerId": "cards.15"
        },
        {
          "prompt": "Übersetzen Sie: eine Lehrstelle.",
          "answerId": "cards.17"
        },
        {
          "prompt": "Schreiben Sie: Menschen helfen.",
          "answerId": "cards.34"
        }
      ],
      "competencies": [
        {
          "level": "Ein Ziel",
          "prompt": "Schreiben Sie auf Französisch: Ich möchte FaGe werden. (Berufsbezeichnung: assistant(e) en soins et santé communautaire.)",
          "solution": "Je voudrais devenir assistant en soins et santé communautaire.",
          "criteria": "Den Satzanfang «Je voudrais devenir» richtig verwenden; Beruf ist vorgegeben."
        },
        {
          "level": "Interesse",
          "prompt": "Beginnen Sie einen Satz: Ich interessiere mich für den Beruf …",
          "solution": "Je m’intéresse au métier de …",
          "criteria": "Den vollständigen französischen Satzanfang schreiben."
        },
        {
          "level": "Ziel mit Grund",
          "prompt": "Formulieren Sie einen Berufswunsch und begründen Sie ihn mit «Menschen helfen».",
          "solution": "Je voudrais devenir assistant en soins et santé communautaire parce que je veux aider les gens.",
          "criteria": "Berufswunsch und Grund ergeben zusammen eine verständliche Aussage; persönliche Berufsbezeichnungen dürfen variieren."
        }
      ]
    },
    {
      "id": "schnuppern",
      "name": "Schnupperlehre",
      "short": "Berufserfahrungen",
      "goal": "Ich kann in einfachen Sätzen über eine Schnupperlehre und Tätigkeiten berichten.",
      "success": "Ich sage, dass ich eine Schnupperlehre gemacht habe, und berichte einfach, was ich getan habe.",
      "why": "Im Test kann eine kurze Nachricht zu einer Schnupperlehre oder Tätigkeit verlangt werden.",
      "time": "10–16 Min.",
      "ids": [
        "cards.18",
        "cards.19",
        "cards.21",
        "cards.22"
      ],
      "situations": [
        {
          "prompt": "Übersetzen Sie: eine Schnupperlehre.",
          "answerId": "cards.18"
        },
        {
          "prompt": "Schreiben Sie: Ich habe eine Schnupperlehre gemacht.",
          "answerId": "cards.19"
        },
        {
          "prompt": "Beginnen Sie: Ich habe mitgeholfen, …",
          "answerId": "cards.21"
        },
        {
          "prompt": "Beginnen Sie: Ich habe … beobachtet.",
          "answerId": "cards.22"
        }
      ],
      "competencies": [
        {
          "level": "Erfahrung",
          "prompt": "Schreiben Sie: Ich habe eine Schnupperlehre gemacht.",
          "solution": "J’ai fait un stage.",
          "criteria": "Ein korrekter Satz mit j’ai fait."
        },
        {
          "level": "Mithelfen",
          "prompt": "Schreiben Sie einen einfachen Satzanfang: Ich habe mitgeholfen, …",
          "solution": "J’ai aidé à …",
          "criteria": "J’ai + aidé + à richtig schreiben."
        },
        {
          "level": "Kleine Nachricht",
          "prompt": "Schreiben Sie zwei kurze Sätze: Ich habe eine Schnupperlehre gemacht. Ich habe das Team beobachtet. (das Team = l’équipe)",
          "solution": "J’ai fait un stage. J’ai observé l’équipe.",
          "criteria": "Die beiden Vergangenheitsformen sind richtig und bilden eine kleine Nachricht."
        }
      ]
    },
    {
      "id": "staerken",
      "name": "Stärken ausdrücken",
      "short": "Eigenschaften",
      "goal": "Ich kann meine Stärken nennen und in einem Satz erklären, wie ich arbeite.",
      "success": "Ich wähle passende Stärken und verwende sie in einer einfachen Beschreibung.",
      "why": "Im Test können Sie eine Eigenschaft oder die Zusammenarbeit im Team ausdrücken.",
      "time": "7–12 Min.",
      "ids": [
        "cards.30",
        "cards.31",
        "cards.32",
        "cards.33"
      ],
      "situations": [
        {
          "prompt": "Übersetzen Sie: zuverlässig.",
          "answerId": "cards.30"
        },
        {
          "prompt": "Übersetzen Sie: geduldig.",
          "answerId": "cards.31"
        },
        {
          "prompt": "Übersetzen Sie: sorgfältig.",
          "answerId": "cards.32"
        },
        {
          "prompt": "Sagen Sie: Ich arbeite gut im Team.",
          "answerId": "cards.33"
        }
      ],
      "competencies": [
        {
          "level": "Eine Stärke",
          "prompt": "Übersetzen Sie: Ich bin zuverlässig. (Ich bin = Je suis)",
          "solution": "Je suis fiable.",
          "criteria": "Je suis und ein passendes Adjektiv."
        },
        {
          "level": "Zwei Stärken",
          "prompt": "Schreiben Sie: Ich bin zuverlässig und geduldig. Wählen Sie die zu Ihnen passende Form.",
          "solution": "Je suis fiable et patient. / Je suis fiable et patiente.",
          "criteria": "Zwei Eigenschaften mit et verbinden; patient/patiente passend verwenden."
        },
        {
          "level": "Im Team",
          "prompt": "Sagen Sie in zwei kurzen Aussagen, dass Sie zuverlässig sind und gut im Team arbeiten.",
          "solution": "Je suis fiable. Je travaille bien en équipe.",
          "criteria": "Eine Stärke und ein vollständiger Satz über Teamarbeit."
        }
      ]
    },
    {
      "id": "gespraech",
      "name": "Sätze verbinden",
      "short": "Gespräch & Reaktionen",
      "goal": "Ich kann reagieren, nachfragen und kurze Aussagen mit und, aber oder weil verbinden.",
      "success": "Ich gebe eine Frage zurück und verbinde zwei passende Aussagen logisch miteinander.",
      "why": "Im Test können Sie ein kurzes Gespräch ergänzen oder zwei Sätze passend verbinden.",
      "time": "10–16 Min.",
      "ids": [
        "cards.6",
        "cards.24",
        "cards.26",
        "cards.42"
      ],
      "situations": [
        {
          "prompt": "Geben Sie die Frage mit «Und du?» zurück.",
          "answerId": "cards.6"
        },
        {
          "prompt": "Übersetzen Sie: weil.",
          "answerId": "cards.24"
        },
        {
          "prompt": "Übersetzen Sie: aber.",
          "answerId": "cards.26"
        },
        {
          "prompt": "Übersetzen Sie: und.",
          "answerId": "cards.42"
        }
      ],
      "competencies": [
        {
          "level": "Frage zurückgeben",
          "prompt": "Eine Person antwortet auf Ihre Frage. Schreiben Sie: Und du?",
          "solution": "Et toi ?",
          "criteria": "Eine passende kurze Rückfrage."
        },
        {
          "level": "Mit weil begründen",
          "prompt": "Verbinden Sie mit «weil»: Ich arbeite gern im Team, weil ich geduldig bin. (ich arbeite gern = j’aime travailler)",
          "solution": "J’aime travailler en équipe parce que je suis patient. / J’aime travailler en équipe parce que je suis patiente.",
          "criteria": "parce que und eine sinnvolle Begründung."
        },
        {
          "level": "Zwei Aussagen verbinden",
          "prompt": "Verbinden Sie die Sätze mit «aber»: Ich spreche Deutsch, aber ich möchte Französisch lernen. (Französisch lernen = apprendre le français)",
          "solution": "Je parle allemand, mais je voudrais apprendre le français.",
          "criteria": "«mais» verbindet zwei unterschiedliche Aussagen verständlich."
        }
      ]
    }
  ],
  "choices": [
    {
      "id": "mission-2",
      "title": "Retour à deux",
      "label": "Gespräch",
      "minutes": 4,
      "description": "Zu zweit ankommen: fragen, antworten und die Frage zurückgeben.",
      "mode": "Partnerarbeit",
      "value": "Sprechen ohne grossen Druck"
    },
    {
      "id": "mission-3",
      "title": "Trois messages",
      "label": "Hörverstehen",
      "minutes": 9,
      "description": "Drei kurze Alltagsgeschichten hören und die richtigen Belege finden.",
      "mode": "Einzelarbeit",
      "value": "Hören, verstehen, prüfen"
    },
    {
      "id": "mission-4",
      "title": "Le labo des phrases",
      "label": "Sprachlabor",
      "minutes": 9,
      "description": "Gegenwart, Vergangenheit und Zukunft anhand von Beispielen entdecken.",
      "mode": "Einzelarbeit",
      "value": "Neues entdecken – nicht Teil des W43-Wortschatztests"
    },
    {
      "id": "mission-5",
      "title": "Mon moment",
      "label": "Kreativ",
      "minutes": 8,
      "description": "Mit Satzbausteinen eine eigene oder erfundene kleine Geschichte schreiben.",
      "mode": "Einzelarbeit",
      "value": "Eigene Sprache gestalten"
    },
    {
      "id": "mission-6",
      "title": "L’interview",
      "label": "Gespräch",
      "minutes": 11,
      "description": "Ein Interview mit klaren Fragen führen, nachfragen und die Rollen wechseln.",
      "mode": "Partnerarbeit",
      "value": "Gemeinsam sicherer sprechen"
    },
    {
      "id": "mission-7",
      "title": "La capsule",
      "label": "Audio",
      "minutes": 18,
      "description": "Eine Geschichte überarbeiten und eine kurze Sprachaufnahme machen.",
      "mode": "Einzel-/Partnerarbeit",
      "value": "Eine hörbare Verbesserung schaffen"
    },
    {
      "id": "mission-8",
      "title": "Défi de transfert",
      "label": "Transfer",
      "minutes": 8,
      "description": "Neue Alltagssituationen mit bekannten Sprachmustern lösen.",
      "mode": "Einzelarbeit",
      "value": "Spontan anwenden"
    },
    {
      "id": "training",
      "title": "Cartes express",
      "label": "Wortschatz",
      "minutes": 10,
      "description": "Wortkarten durchgehen und ausschliesslich unsichere Ausdrücke wiederholen.",
      "mode": "Einzelarbeit",
      "value": "Schnell und zielgerichtet"
    },
    {
      "id": "wordbank",
      "title": "Boîte à outils",
      "label": "Sprachhilfe",
      "minutes": 6,
      "description": "Neue Satzbausteine für Ihre Geschichte lesen und eigene Beispiele formulieren.",
      "mode": "Einzelarbeit",
      "value": "Mehr Ausdrucksmöglichkeiten"
    }
  ],
  "officialTest": {
    "week": 43,
    "count": 28,
    "heading": "28 verbindliche Wörter und Wendungen",
    "ids": [
      "cards.0",
      "cards.1",
      "cards.2",
      "cards.3",
      "cards.4",
      "cards.5",
      "cards.8",
      "cards.9",
      "cards.10",
      "cards.11",
      "cards.12",
      "cards.13",
      "cards.14",
      "cards.15",
      "cards.17",
      "cards.34",
      "cards.18",
      "cards.19",
      "cards.21",
      "cards.22",
      "cards.30",
      "cards.31",
      "cards.32",
      "cards.33",
      "cards.6",
      "cards.24",
      "cards.26",
      "cards.42"
    ],
    "minutes": 25,
    "points": 24,
    "goals": 6,
    "notes": "Die Liste ist abschliessend. Zusätzliche Beispiele und Wahlaufgaben sind zum Lernen da, gehören aber nicht als neue Wörter zum Prüfungsstoff."
  }
};
