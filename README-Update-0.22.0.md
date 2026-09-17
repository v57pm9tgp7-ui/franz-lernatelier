# Franz Lernatelier – Update 0.22.0

Stand: 17. September 2026

Dieses ZIP ist ein **sicheres Update-Overlay für das bestehende GitHub-Repository `franz-lernatelier`**. Es enthält alle Dateien, die für dieses Update geändert wurden, sowie aktualisierte Regressionstests. Unveränderte Dateien, Audio-Dateien, Logos und andere Medien bleiben im bestehenden Repository erhalten und werden bewusst nicht dupliziert.

## Änderungen

- **Woche 38 im Wochenmenü:** Die Auswahl zeigt jetzt Woche 36, 37 und 38. Von Woche 37 führt der nächste Wochenwechsel korrekt zu Woche 38.
- **Woche 38 = sieben Übungen:** Die Übungen 1, 2, 3, 5, 6, 7 und 8 aus Woche 37 werden weitergeführt. **Übung 4 wird in Woche 38 ausgelassen.** Der bestehende Lernstand aus Woche 37 bleibt erhalten.
- **Ma carte de parole:** Der bisher wiederholte grüne Block «Vollständiger Vorschlag aus Ihren Angaben» wurde entfernt. Stattdessen wird einmal klar erklärt, wozu die automatisch erzeugten Stichwörter dienen und wie sie aktualisiert werden können.
- **Ganzer Text zum Anhören:** Der persönliche Vorstellungstext kann vollständig auf Französisch vorgelesen werden. Lernende wählen **weibliche oder männliche Stimme** sowie **normales oder langsameres Tempo**. Die tatsächlich verfügbare Stimme hängt vom Browser und Betriebssystem ab; bevorzugt werden französische Stimmen.
- **Répéter à deux:** Die bisherige Gruppenarbeit wird in Woche 38 zur unmittelbaren Generalprobe zu zweit. A spricht 60 Sekunden, B hört zu und gibt kurzes Feedback; danach werden die Rollen gewechselt. Anschliessend geht es direkt zur Videoaufnahme.
- **Offline-Cache aktualisiert:** Neuer Cache für Version 0.22.0, damit die geänderten Dateien zuverlässig geladen werden.

## Einspielen in GitHub

1. Bestehendes Repository **nicht leeren**.
2. ZIP entpacken.
3. Den Inhalt des ZIP im Stammverzeichnis des bestehenden Repositories einfügen und gleichnamige Dateien **ersetzen**.
4. Alle anderen bestehenden Dateien unverändert behalten.
5. Änderungen prüfen, committen und wie gewohnt zu GitHub pushen.
6. Cloudflare Pages kann danach aus dem aktualisierten Repository neu deployen.

## Tests

Im Paket liegen aktualisierte Node-Regressionstests. In dieser Laufzeit wurden die geänderten Dateien mit **29 automatisierten Checks** geprüft; alle 29 sind bestanden. Dazu gehören Syntaxprüfung, Woche-38-Navigation, Ausschluss von Übung 4, Partnerprobe, Sprechkartenlogik, Stimmenwahl, verlangsamtes Vorlesen und Service-Worker-Versionierung.

Für die vollständige bestehende Projektsuite im Repository:

```bash
npm ci
npm test
```

Die vollständige `jsdom`-Suite konnte in der Erstellungsumgebung nicht zusätzlich ausgeführt werden, weil die bestehenden `node_modules` dort nicht verfügbar waren. Die mitgelieferten Update-Tests benötigen für ihre Kernprüfungen nur Node.js.

## Enthaltene produktive Dateien

- `public/data/modules.js`
- `public/assets/atelier-navigation.js`
- `public/assets/week38-module.js`
- `public/module/woche-38/index.html`
- `public/assets/week37-card-print-upgrade.js`
- `public/assets/atelier-accessibility.js`
- `public/service-worker.js`

Zusätzlich sind aktualisierte Tests und diese README enthalten.
