# Woche 44 · Notre après-midi à 30 francs

Aktualisierung vom 28. Oktober 2026. 25 Minuten Partnerarbeit, danach 8 Minuten Austausch zwischen zwei Zweierteams. Ein gemeinsames A3-Plakat zeigt zwei verschiedene Aktivitäten, einen Snack, Uhrzeiten, Preise, Gesamtpreis, Restbetrag und je einen persönlichen Grund.

## Ablauf und Materialien

47–72: 2 Minuten Modell, 3 eigene Wahl, 6 Gespräch und Einigung, 7 Gestaltung, 5 gegenseitiges Erklären, 2 Kontrolle. Alle Angebote stehen offen bereit. Keine Informationslücke, kein Ausfall und keine Neuberechnung von Wegzeiten.

72–80: 1 Minute organisieren, 2 Minuten Team A, 1 Minute Frage und Reaktion von B, dann umgekehrt 3 Minuten, zum Schluss 1 Minute persönliche Favoriten mit Grund. Plakate danach aufhängen.

P1 Arbeitsweg; P2 Angebote; P3 Sprachhilfe; P4 Vorstellung. Diese vier Seiten ersetzen Seiten 8–11 des aktuellen 16-seitigen Lernhefts. A3-Vorlage und Reserven sind separate Dateien. Zahlenkarten A/B nur für N3. Die alte Rollenkarten-Datei enthält aus Kompatibilitätsgründen ebenfalls nur die neuen Zahlenkarten. H1 bleibt als separater Lernplan verfügbar.

Die aktuelle Präsentation hat 87 Folien; 81–84 wurden ersetzt. Die übrigen Folien stammen aus der hochgeladenen Fassung. Zahlen- und Uhrzeitfolien vorab nach dem Zeitbudget auswählen.

## Website

- `partenaire.html`: gemeinsame Angebote, alte role-Parameter sind ohne Wirkung.
- `plan.html`: zwei verschiedene Aktivitäten und ein Snack; korrekte Rechnung, maximal 30 CHF pro Person. Keine Zeit- oder Überraschungslogik.
- Feste Slots: 14–15 h, 15–15 h 30 Snack, 15 h 30–16 h 30. Wege sind eingeplant.
- `cartes.html`: Lernheft, A3, Zahlenkarten, Reserve und Lösungen.
- `reserve.html`: sechs freiwillige Aufgaben passend zum neuen Angebot.
- `index.html`: neuer Arbeitsweg; Fortschritt und Plan verwenden `franzW44Poster_v2`. Alte Pläne werden nicht übertragen, da die Angebote geändert wurden. Verbtrainerdaten bleiben unverändert.
- Zahlen, Uhrzeiten und dauerhafter Verbentrainer bleiben bestehen.

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

Neue Antworten und Lernstände bleiben im Browser, ohne neue Serverübertragung. Die bestehende Anmeldung des Gesamtangebots bleibt unverändert. Arbeitsfortschritt und neue Pläne verwenden `franzW44Poster_v2`. Trainerdaten sind nicht in die bestehende Kontensynchronisation eingebunden. Ein anderer Browser hat einen anderen Stand.

Keine neuen Paketabhängigkeiten. Service Worker ergänzt Seiten, Engine und PDFs. Frühere Module bleiben erhalten. Diese Revision liegt als GitHub-Update-ZIP bereit und wurde nicht veröffentlicht. Vor Einsatz auf franzatelier.com über den bestehenden Weg freischalten. Papier bleibt vollständig einsetzbar.

## Prüfung und Grundlage

`node --test tests/week44.test.cjs tests/training.test.cjs`: 26 gezielte Tests für 120 Antworten, Katalogerweiterung, ungültige Daten, Abstände über Tage, Hilfe/Raten, verzögerte Reparatur, Abdeckung, gemischte Auswahl, Proben, Migration, Zahlen, Uhrzeiten und sämtliche Angebotskombinationen, Budgetgrenzen, verschiedene Snacks und beide Reihenfolgen.

Zusätzlich Syntax- und Linkprüfung. Der Verbentrainer wurde um Fehleranalyse, fünf weitere Übungsformate, PDF-Downloads und eine Notensimulation erweitert. Die gesamte bestehende Testsuite wurde in diesem teilweisen Checkout nicht ausgeführt.

Grundlage: Karpicke & Roediger (2008), DOI 10.1126/science.1152408; Agarwal et al. (2021), DOI 10.1007/s10648-021-09595-9; Kim & Webb (2022), DOI 10.1111/lang.12479; Lambert et al. (2017), DOI 10.1017/S0272263116000085; GER-Begleitband (2020). Die Prinzipien stützen Abruf, Verteilung und Gesprächswiederholung, keine garantierte Wirkung dieser exakten Minutenfolge.

Titelbild: KI-generierte Illustration (Oktober 2026), kein buchbares Angebot. BFF-Logo aus der bereitgestellten Vorlage.


## Lerntraining erweitert · 28. Oktober 2026

### Verbentrainer

- Detaillierte Fehlerdaten pro Verb, Richtung und Person. Letzte falsche Eingabe neben der Lösung. Noch unsichere Formen direkt üben oder als persönliche Fehlerliste drucken.
- Fünf zusätzliche Formate: sechs Personen, Alltagssätze, Personenwechsel, Fehler verbessern, Hörschreiben. Hörschreiben speichert separate Ergebnisse und erhöht die Stufe des freien Abrufs nicht.
- Erste Versuche, Fehler, Hilfe und Raten werden getrennt gezählt; Hilfe und Raten können bei derselben Antwort vorkommen. Frühere Lapsen werden nicht rückwirkend als genaue Fehlerquote ausgegeben.
- 30 Aufgaben pro Testsimulation: 6 DE–FR, 6 FR–DE, 18 présent; jedes der 15 Verben mindestens einmal, jede Person genau dreimal. Neue Aufgabenreihenfolge und Auswahl je Versuch, unabhängig vom persönlichen Fehlerprofil. Zwischenstand bleibt lokal erhalten.
- Note dieser Simulation: 1 + 5 × Punkte / 30, auf eine Dezimalstelle; 18 Punkte = 4,0. Dies ist eine offen ausgewiesene Modellbewertung und keine bestätigte BFF-Prüfungsordnung. Nur bei bestätigtem Versuch ohne Hilfen eine Note anzeigen. Unbeantwortete Fragen zählen als falsch, Abgabe erfordert dann eine Bestätigung.
- Nach Abgabe: Lösungen, Punkte pro Bereich, Notenverlauf und gezielter Übergang in die Fehlerübung. Ein neuer Versuch direkt nach den Lösungen ist keine unabhängige Vorhersage.

### Zahlen, Uhrzeiten, Meinungen

`/module/woche-44/atelier.html`: 17 Formate (6 Zahlen, 6 Uhrzeiten, 5 Meinungen). Von den bisherigen Themenseiten und der Hausaufgabenseite aus verlinkt. Runden mit 6, 10 oder 12 Startaufgaben; verzögerte Fehlerwiederholung bis maximal 16 Aufgaben. Auswahl aller, ungeübter oder schwieriger Aufgaben der jeweiligen Übungsart. Eigener Lernstand unter `franzPractice_v1`.

Zahlen: 0–30 als Einstieg, bis 100 im Kerntraining; Ziffern/Wörter, Hören, Rückgeld, Korrektur, Schweizvergleich. Bei allgemeinen Aufgaben sind passende Schweizer Formen korrekt, beim Vergleich wird ausdrücklich die Frankreichform verlangt.

Uhrzeiten: offizielle und gebräuchliche Alltagsformen, Ziffern, SVG-Analoguhren, Hörschreiben, Zeitrechnung über Stundengrenzen und Mitternacht, Il est/à. Unterschiedliche Rechenbedingungen haben eigene Fortschritts-IDs.

Meinungen: 12 Reaktionsaufgaben, 12 Verbindungen, 12 Sätze aus Bausteinen, 8 Sprachkorrekturen, 12 offene Sprechaufträge. Freie Aussagen erhalten eine Selbstkontrolle nach Meinung, Grund und Reaktion; keine vorgetäuschte automatische Sprachbewertung. Bei diesen Formaten beeinflusst das Niveau vor allem den freien Sprechauftrag; die geschlossenen Kernaufgaben bleiben gleich.

### PDFs und weitere Wochen

Fünf Verben-PDFs: Gesamtübersicht W43/44, Einzelwochen, Übungsheft, Lösungen. Dazu ein Heft zu Zahlen/Uhrzeiten/Meinungen mit separaten Lösungen und eine dreiseitige Kurzanleitung. Alle acht Dateien sind herunterladbar. Persönliche Auswahl/Fehlerliste über Druckansicht, im Druckdialog als PDF speicherbar.

Fertige PDFs haben einen bestimmten Stand. Der zusätzliche Druckknopf nutzt immer den aktuellen Katalog. Für neue Wochen: `python3 scripts/export_training_pdfs.py --verb-set 2026W45` (erst Set ergänzen). Ausgabe unter `training-export/`; danach bewusst unter `public/verbentrainer/pdf/` ablegen und verlinken. `--verb-set all` erzeugt eine aktuelle Gesamtübersicht. Ohne Argument werden die acht Materialien für die festgelegte Woche 44 neu erstellt und in die Website kopiert. Voraussetzung nur für den Export: Python mit reportlab, DejaVu-Sans-Schriften unter dem im Skript angegebenen Pfad, Node.js. Die Website selbst benötigt keine neue Abhängigkeit.

### Prüfung dieser Erweiterung

26 automatisierte Tests erfolgreich; darunter 1000 zufällige Testzusammenstellungen, Notengrenzen, Eingabevarianten, Hilfe/Raten, Hörschreiben und Lernstandsidentitäten. Alle 17 Aufgabenbanken auf drei Niveaus auf eindeutige IDs, eigene Musterlösungen und eindeutige Auswahlantworten geprüft. Browserprüfung: gezielte Konjugationsfehler, Satzbau, Rückgeld, Analoguhren, Sprech-Selbstkontrolle, Testfortsetzung, 30/30 = 6,0 und kein Notenausweis bei Hilfen. Französische Tonausgabe konnte in der Vorschau mangels französischer Gerätestimme nicht akustisch geprüft werden; der passende Fallback wurde geprüft. Die PDFs wurden vollständig gerendert und visuell kontrolliert.

Es wurde kein Live-Deployment vorgenommen. Das ZIP enthält auch die vorherige Plakat-Überarbeitung. Bestehende andere Wochen und Infrastruktur im Repository beibehalten.
