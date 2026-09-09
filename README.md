# Franz Lernatelier – UX-Überarbeitung

Stand: 9. September 2026 · Version 0.17.0

Dieses Paket enthält das vollständige Projekt für das bestehende Repository `v57pm9tgp7-ui/franz-lernatelier`. Grundlage ist Commit `f3119bc8206a4048d267fd5ae50d54977cc29b8a`.

## In GitHub übernehmen

1. ZIP entpacken.
2. Den Inhalt in das Hauptverzeichnis des bestehenden Repositorys übernehmen und gleichnamige Dateien ersetzen. `public`, `src` und `wrangler.jsonc` müssen wie bisher nebeneinander liegen.
3. Änderungen in GitHub speichern. Die vorhandene Cloudflare-Bereitstellung kann den neuen Stand wie bisher veröffentlichen.

Die Cloudflare-Konfiguration, der Worker und die Datenbankanbindung sind unverändert. Eine Datenmigration ist für dieses Update nicht erforderlich. Vorhandene eigene Dateien und Bereitstellungseinstellungen beibehalten.

## Was sich verbessert hat

- Gemeinsame Gestaltung für Startseite, Wochen 36 und 37, Übungen, Training und Hilfe: ruhige Farben, gut lesbare Texte, klare Gruppen und grössere Bedienelemente.
- Feste Orientierung mit Wochen- und Übungswahl sowie «Zurück», «Trainieren» und «Weiter».
- Aus dem Training zurück zur Ausgangsstelle: Übung beziehungsweise Übersicht, Scrollposition, Eingaben und geöffnete Hilfen bleiben erhalten. Beim Wechsel per Maus oder Touch wird auch die zuvor aktive Eingabestelle wiederhergestellt.
- Die zuletzt besuchte Übung lässt sich über «Letzte Übung» wieder öffnen. Eine abgeschlossene Übung bleibt erneut zugänglich.
- Übungen und Wochen lassen sich ohne vorherigen Abschluss öffnen.
- Wortschatztraining in Woche 37 mit Aufdecken, Vorlesen, Merkliste, «Noch üben», «Gewusst», vorheriger Karte und neuer Runde. Die vorhandenen acht Karten bleiben inhaltlich unverändert.
- Die Trainingstaste einer Woche öffnet zuverlässig das Training dieser Woche.
- Sichtbarer Tastaturfokus, beschriftete Eingabefelder und bedienbare Hilfefenster.

Die Einzelheiten stehen in [UX-Ueberarbeitung.md](UX-Ueberarbeitung.md).

## Lokal prüfen

Für die lokale Entwicklung wird Node.js ab 22.12 benötigt.

```sh
npm ci
npm test
npm run dev
```

Die lokale Vorschau zeigt die Oberfläche. Für Prüfungen ohne Cloudflare-API lässt sich die vorhandene Option zum lokalen Weiterarbeiten verwenden. Die produktive Website verwendet weiterhin `src/index.js` und die Dateien in `public`.

Die zehn automatisierten Prüfungen sind erfolgreich. Zusätzlich wurden die Oberfläche, Navigation, Tastaturbedienung und ausgewählte Trainingsabläufe im Browser bei Desktop-, Tablet- und Smartphonebreiten geprüft. Die genauen Prüfumfänge und Grenzen sind im Änderungsbericht dokumentiert.

Ältere `README-*.txt` bleiben als Projektgeschichte enthalten. Für dieses vollständige Update gilt diese Anleitung.
