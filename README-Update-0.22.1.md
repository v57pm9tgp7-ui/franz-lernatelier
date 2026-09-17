# Franz Lernatelier – Update 0.22.1

Stand: 17. September 2026

Dieses ZIP ist ein **Update-Overlay für das bestehende GitHub-Repository `franz-lernatelier`**. Es enthält alle produktiven Dateien aus Update 0.22.0 sowie die neue Überarbeitung von Woche 38, Übung 6. Bestehende Audio-Dateien, Logos und unveränderte Dateien bleiben im Repository erhalten.

## Neu in 0.22.1

- **Woche 38 · Übung 6:** Die bisherige Stichwortkarten-Ansicht wird in Woche 38 vollständig entfernt.
- Die Übung heisst dort neu **«Mon texte final»**.
- Statt einzelner Stichwortfelder sehen die Lernenden den **kompletten persönlichen Vorstellungstext** aus ihren bisherigen Angaben.
- Der gesamte Text kann direkt in einem grossen Textfeld **geändert, ergänzt oder gekürzt** werden.
- Änderungen werden über die bestehende Lernatelier-Speicherung automatisch gesichert.
- Mit **«Text aus meinen bisherigen Angaben neu erstellen»** kann der automatisch zusammengesetzte Ausgangstext wiederhergestellt werden. Wenn dadurch eigene Änderungen überschrieben würden, erscheint vorher eine Sicherheitsabfrage.
- Die Vorlesefunktion liest in Woche 38 **genau den aktuell bearbeiteten Text** vor. Weibliche/männliche Stimme und normales/langsameres Tempo bleiben erhalten.
- Danach folgt direkt eine **60-Sekunden-Einzelprobe** als Vorbereitung auf die Partner-Generalprobe in Übung 7 und die Videoaufnahme in Übung 8.

## Bereits enthalten aus 0.22.0

- Woche 38 erscheint im Wochenmenü.
- Woche 38 enthält die Übungen 1, 2, 3, 5, 6, 7 und 8; Übung 4 wird ausgelassen.
- «Répéter en groupes» wurde zu **«Répéter à deux»**: A spricht, B hört zu und gibt Feedback; danach Rollenwechsel.
- Weibliche/männliche Vorlesestimme und verlangsamtes Tempo.
- Aktualisierte Woche-38-Navigation und Offline-Cache.

## Einspielen in GitHub

1. Bestehendes Repository **nicht leeren**.
2. ZIP entpacken.
3. Den Inhalt des ZIP in das Stammverzeichnis des bestehenden Repositories kopieren.
4. Gleichnamige Dateien **ersetzen**.
5. Alle übrigen Dateien im Repository unverändert belassen.
6. Änderungen committen/pushen und Cloudflare Pages wie gewohnt neu deployen lassen.

## Prüfungen

Die mitgelieferten Regressionstests wurden nach der Änderung ausgeführt:

- **29 Tests**
- **29 bestanden**
- **0 fehlgeschlagen**

Geprüft wurden unter anderem JavaScript-Syntax, Woche-38-Navigation, Ausschluss von Übung 4, editierbarer Finaltext, Wiederherstellungsfunktion, Vorlesen des bearbeiteten Textes, Stimmenwahl, Partnerprobe und Cache-Versionierung.

## Produktive Dateien im ZIP

- `public/data/modules.js`
- `public/assets/atelier-navigation.js`
- `public/assets/week38-module.js`
- `public/module/woche-38/index.html`
- `public/assets/week37-card-print-upgrade.js`
- `public/assets/atelier-accessibility.js`
- `public/service-worker.js`

Zusätzlich enthält das ZIP aktualisierte Tests, einen Testbericht und eine SHA-256-Prüfliste.
