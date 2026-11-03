# Woche 45 · 2026/27

90 Minuten: Einstieg, bestehende Lernkontrolle (ca. 15 Minuten), stille Repetition, Marché in Dreiergruppen, Partnerpläne, Klassenpreis-Spiel und Verbinput, individuelles Training und Abschluss. Die neue Woche ist in der bestehenden Startseite eingetragen. Bisherige Wochen bleiben verfügbar.

## Einstieg

- `/module/woche-45/`: Übersicht und vier Arbeitsbereiche
- `/module/woche-45/training.html#quiet`: stille Mischung aus bekannten Zahlen und Uhrzeiten
- `#numbers` und `#times`: gezieltes Training mit Auswahl der Schwierigkeit
- `/verbentrainer/?set=2026W45&learn=1`: fünf neue Verben kennenlernen
- `/verbentrainer/?set=all`: alle bisher eingeführten Verben

## Weitere Verben hinzufügen

`public/verbentrainer/data.js` enthält den Katalog. Für jede neue Woche fünf bis zehn eindeutige Verb-IDs mit Bedeutung, erlaubten Übersetzungen, sechs Präsensformen, Beispielsatz, Merktipp und Kontext ergänzen. Danach ein Set mit aufsteigender ID wie `2026W46` anlegen. Bestehende IDs nicht umbenennen. Die empfohlene Runde nimmt automatisch das neueste Wochenset hinzu. Das Set `test44` ist aus Kompatibilitätsgründen weiterhin die unveränderte Auswahl der 15 Verben des Tests in Woche 45. Neue Verben nicht unbemerkt zum Teststoff hinzufügen.

Sichtbaren Wochenhinweis und Wochenlink im Trainer jeweils aktualisieren. `engine.validateCatalog` überprüft Katalogreferenzen und vollständige Formen. Der Erweiterungstest fügt ein zusätzliches Verb ein und prüft die Erhaltung alter Fortschritts-IDs.

## Speicherung

W45-Modul: `franzoesischLernatelierW45_v1` mit Missionen 1–4. Der Zahlen-/Uhrzeitentrainer speichert Lernstellen separat und markiert nach einer stillen Runde ausschliesslich Mission 1. Der Verbentrainer behält seine bisherigen Speicher-IDs. Hilfen, Raten und direkte Fehlerkorrektur zählen nicht als unabhängiger späterer Abruf. Die Hauptseite nutzt weiterhin die vorhandene Kontosynchronisation; die neuen Trainer funktionieren lokal.

## Validierung

55 gezielte Tests bestanden:

```
node --test tests/week45-shell.test.cjs tests/week45.test.cjs tests/training45.test.cjs tests/verbs45.test.cjs tests/week44.test.cjs tests/training.test.cjs
```

Desktop- und 390-Pixel-Ansicht wurden im Browser kontrolliert, ebenso Navigation, Lernkarten, Antwortprüfung und analoge Uhr. Neue Seiten nutzen dieselben Falldaten wie die Unterrichtsmaterialien. Die gesamte historische Testsammlung enthält bereits im Basiscommit 28 Fehler, vor allem alte Versions-/Strukturerwartungen aus Woche 38; diese sind nicht Bestandteil dieser Änderung.
