# Woche 44 · Un après-midi avec 30 francs

90 Minuten auf A2-Niveau. Ein Paar erfragt getrennte Preise und Zeiten, begründet persönliche Wünsche, entscheidet und plant nach einem Ausfall neu. Ein neues Gegenüber hört den verbesserten Plan. Angebote sind erfunden. Gestaltung folgt Woche 43 mit Hellblau, Marineblau, Petrol und BFF-Logo.

## Ablauf und Material

0–3 Einstieg; 3–9 M1, bekannte Verben; 9–17 M2, fünf neue Verben; 17–33 N1–N3, Zahlen; 33–43 Uhrzeiten und U1; 43–47 S1 und Auftrag; 47–72 P1–P4, selbständige Partnerarbeit; 72–80 Partnerwechsel und zweiter Versuch; 80–87 T1 mit Korrektur; 87–90 H1, Testhinweis und Exit.

Partnerweg: 2 Minuten Rolle lesen, 7 Minuten erfragen, 6 Minuten entscheiden, 5 Minuten umplanen, 5 Minuten beide erklären. Jede Person stellt mindestens drei Informationsfragen, nennt zwei Wünsche mit Grund und reagiert. Soutien behält Hilfen offen; Standard versucht zuerst selbst; Avancé begründet Alternativen. In Dreiergruppen Rollen beim Umplanen wechseln.

Präsentation: 32 Folien mit Sprechernotizen. Uhrzeitenplätze 17–22 ersetzen durch Originalfolien 22, 21, 23, 24, 32, 34 aus «Franz Woche 44 Donnerstag 2024.pptx». Papier: 19 Lernseiten, drei Rollenkarten, fünf Lösungsseiten. PDFs für Lernende liegen in `public/module/woche-44/material/`.

## Website

- `/module/woche-44/`: Arbeitsweg, Druckmaterial, Mini-Probe, Hausarbeit; kompatible Anker `start` und `mission`.
- `nombres.html`: Frankreichformen 0–100 in fünf Schritten; Schweizer Varianten im Vergleich. Schweizer Antworten werden als korrekte Varianten erkannt; die Runde verlangt ausdrücklich die Frankreichform.
- `heure.html`: offizielle Zeiten und zehn Minuten später.
- `partenaire.html?role=A` bzw. `?role=B`: nur eigene Angaben zeigen.
- `plan.html`: Preis, Snackfenster, Reihenfolge, Wegzeit und Ausfall prüfen. Gründe werden im Gespräch geprüft.
- `parler.html`: S1 und vierteiliger Meinungsdialog.
- `maison.html`: kurze Übegelegenheiten, H1–H4 und drei Proben.
- `reserve.html`: sechs Aufgaben mit Hilfen und Lösungen. Auf Papier R1 = Aufgaben 1–3, R2 = Aufgaben 4–6.
- `/verbentrainer/`: dauerhafter Einstieg ausserhalb des Wochenmoduls.

## Verben und Test

Woche 43: être, avoir, faire, aller, venir, aimer, jouer, mettre, prendre, vouloir.
Woche 44: pouvoir, devoir, savoir, dire, voir.

Aktuelle Vorgabe: kurzer Verbentest in **Woche 44**. Die Lehrperson nennt Datum, verbindlichen Umfang und Bewertung. Vorbereitung: 15 Verben, beide Übersetzungsrichtungen und alle sechs Personen im présent. T1 und Proben A/B/C sind unbenotete Übungsmaterialien.

## Neue Wochen ergänzen

`data.js` enthält `VERB_CATALOG` mit `verbs` und `sets`. Jeder Verbeintrag besitzt eine dauerhafte `id`, `fr`, `de`, akzeptierte deutsche `meanings`, sechs geprüfte `forms`, einen passenden Satzrest `tail` und eine Herkunftswoche. `test44` ist eine feste Auswahl, `2026W43` und `2026W44` sind Wochenmengen. «Alle» wächst automatisch.

Neue Verben vollständig ergänzen, bestehende IDs unverändert lassen. Neues Set mit eindeutiger ID und `verbIds` ergänzen. Das Wochenmodul verlinkt `/verbentrainer/index.html?set=NEUE_ID`. Das alte Testset nicht erweitern. Katalogprüfung und Tests ausführen; bei Veröffentlichung den Service-Worker-Cache erhöhen. Keine automatischen Endungsregeln für unregelmässige Verben.

120 Abrufziele für 15 Verben: zwei Bedeutungsrichtungen plus sechs Personen je Verb. Auswahl nach Woche, Einzelverb, Richtung und Person. Soutien beginnt mit je, Avancé ergänzt Satzkontext. Lernkarten erklären vor dem ersten Abruf. Gemischte Zehnerrunden enthalten nach Möglichkeit 2 DE→FR, 2 FR→DE und 6 présent-Aufgaben.

## Lernen und Wiederholen

`engine.js`: Bewertung, Auswahl, Abstände, Migration. `trainer.js`: Oberfläche. Lernstand `franzVerbs_v2`; Fragen-ID `verbId|type|person`. Alte Fehlerlisten werden ohne erfundene Erfolge übernommen. Neue Wochen ändern bestehende Fragen-IDs nicht.

Nach selbständigem fälligem Erfolg: zunächst 1 Tag, danach 3, 7, 14, 30 Tage. Das ist eine transparente Heuristik, keine individuell optimale wissenschaftliche Formel. Fehler, Hilfe und Raten setzen eine Frage zurück. Reparaturwiederholungen nur bei mindestens zwei anderen Aufgaben dazwischen; maximal 16 Fragen. Reparaturen zählen nicht als neuer langfristiger Erfolg. Weitere Versuche am selben Fehlertag verlängern das Intervall nicht. «An mehreren Tagen» erfordert drei erfolgreiche Gelegenheiten; keine Testgarantie.

Probe A/B/C: je zwölf unterschiedliche Aufgaben, Lösungen erst nach Abgabe, danach unveränderbare Antworten. Fehler bleiben für weitere Übung gespeichert. Zusammen kommen alle 15 Verben vor, aber nicht jede Form. Keine Ranglisten oder Geschwindigkeitspunkte. Vorlesen nur mit französischer Gerätestimme; keine Aussprachebewertung.

## Daten und Freischaltung

Neue Antworten und Lernstände bleiben im Browser, ohne neue Serverübertragung. Die bestehende Anmeldung des Gesamtangebots bleibt unverändert. Arbeitsfortschritt bleibt kompatibel mit `franzW44Plan_v1.missionDone`. Trainerdaten sind nicht in die bestehende Kontensynchronisation eingebunden. Ein anderer Browser hat einen anderen Stand.

Keine neuen Paketabhängigkeiten. Service Worker ergänzt Seiten, Engine und PDFs. Frühere Module bleiben erhalten. Die Änderungen sind in PR 9 vorbereitet, noch nicht produktiv veröffentlicht. Vor Einsatz auf franzatelier.com über den bestehenden Weg freischalten. Papier bleibt vollständig einsetzbar.

## Prüfung und Grundlage

`node --test tests/week44.test.cjs`: 18 gezielte Tests für 120 Antworten, Katalogerweiterung, ungültige Daten, Abstände über Tage, Hilfe/Raten, verzögerte Reparatur, Abdeckung, gemischte Auswahl, Proben, Migration, Zahlen, Uhrzeiten und alle gültigen Missionskombinationen mit Ersatzplanung.

Zusätzlich Syntax- und Linkprüfung. Browser: unterstütztes Einzelverb, freier Abruf, vollständige Probe mit absichtlich falscher Antwort, Rückmeldung erst nach Abgabe, Zahlen und Planprüfung. Die gesamte bestehende Testsuite wurde in diesem teilweisen Checkout nicht ausgeführt.

Grundlage: Karpicke & Roediger (2008), DOI 10.1126/science.1152408; Agarwal et al. (2021), DOI 10.1007/s10648-021-09595-9; Kim & Webb (2022), DOI 10.1111/lang.12479; Lambert et al. (2017), DOI 10.1017/S0272263116000085; GER-Begleitband (2020). Die Prinzipien stützen Abruf, Verteilung und Gesprächswiederholung, keine garantierte Wirkung dieser exakten Minutenfolge.

Titelbild: KI-generierte Illustration (Oktober 2026), kein buchbares Angebot. BFF-Logo aus der bereitgestellten Vorlage.
