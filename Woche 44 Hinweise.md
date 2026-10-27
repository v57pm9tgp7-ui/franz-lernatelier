# Woche 44: Un après-midi avec 30 francs

Vorbereitete Unterrichtseinheit für 90 Minuten. Der Kern ist eine selbständige Partnerplanung mit getrennten Informationen, begründeten Meinungen, einer Planänderung und erneutem Erzählen. Fiktive Angebote, keine Buchungsdaten.

## Neue Einstiege

- `public/module/woche-44/index.html`: Wochenübersicht und Arbeitsweg
- `public/module/woche-44/partenaire.html?role=A` bzw. `?role=B`: getrennte Karten
- `public/module/woche-44/plan.html`: Budget, Zeiten und Wegzeiten prüfen
- `public/module/woche-44/cartes.html`: vier druckbare Seiten
- `public/module/woche-44/nombres.html`: Schweizer Zahlen mit Francevarianten
- `public/module/woche-44/heure.html`: offizielle Uhrzeiten und Sprechauftrag
- `public/module/woche-44/mini.html`: unbenotete Mini-Probe
- `public/verbentrainer/index.html`: wiederverwendbarer Verbentrainer

Die Startseite ist auf Woche 44 vorbereitet. Die bisherige Prüfungsvorbereitung bleibt unter ihrem bisherigen Pfad erreichbar. Alle früheren Wochen bleiben erhalten. Die Erweiterung ist für das vorhandene statische Asset-Deployment konzipiert. Keine neuen Abhängigkeiten, keine Änderung am Worker oder an Konten.

## Lernstoff

Woche 43: être, avoir, faire, aller, venir, aimer, jouer, mettre, prendre, vouloir.
Woche 44 gemäss Screenshot: pouvoir, devoir, savoir, dire, voir.

Der Trainer enthält 120 Fragen: 15 Übersetzungen pro Richtung und 90 Formen im présent. Gemischte Runden kombinieren, soweit die Auswahl reicht, zwei Fragen je Übersetzungsrichtung und sechs Präsensfragen. Fehler werden bei neuen Runden bevorzugt und können separat gewählt werden. Akzentfehler werden von anderen Fehlern unterschieden. Eine richtige Antwort entfernt die betreffende Frage aus der Fehlerliste. Keine Aussprachebewertung.

Der vorgesehene Prüfungsumfang für Woche 45 ist ein Vorschlag: alle 15 Verben, Bedeutungen in beide Richtungen, alle Personen im présent. Die Lehrperson bestätigt den endgültigen Umfang und die Bewertung. Die Mini-Probe ist kein benoteter Test.

## Ablauf in Minuten

0–7 Abruf alter Verben; 7–15 fünf neue Verben; 15–24 Zahlendialog mit Bewegung; 24–32 Uhrzeiten; 32–36 Meinungsdialog; 36–65 Partnerauftrag; 65–74 neue Gesprächspartner; 74–79 Feedback; 79–87 Mini-Probe und Korrektur; 87–90 Exit.

## Daten und Betrieb

Lernstand und Antworten bleiben lokal im Browser, ohne Anmeldung und ohne neue Übertragung. Die fünf selbst abgehakten Arbeitsschritte werden für die vorhandene Wochenübersicht gespeichert. Die neuen Daten werden nicht in die bestehende Kontensynchronisation aufgenommen. Der Service Worker ergänzt die neuen Assets. Für den Unterricht gibt es eine vollständig druckbare Alternative.

## Überprüfung

`node --test tests/week44.test.cjs`

Geprüft: 120 eindeutige Verbfragen, korrekte Antworten, Akzente und Pronomen, Zahlvarianten, Budgetgrenzen, Snackfenster, Wegzeiten sowie eine mögliche Ersatzplanung für jede gültige Kombination nach der Überraschung. Browserprüfung: Wochenübersicht, Rollen, gültiger Plan, Ausfall, Ersatzplan und Verbentrainer.

Das Titelbild ist eine KI-generierte illustrative Szene (Oktober 2026), keine Aufnahme eines realen Angebots. Für das Web wurde es als JPEG komprimiert. Die Angebote und Preise sind ausdrücklich erfunden.
