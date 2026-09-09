# Franz Lernatelier

Version 0.19.0 · 9. September 2026

Vollständiges Update für das bestehende Repository `v57pm9tgp7-ui/franz-lernatelier`. Enthält die überarbeitete Oberfläche, die neuen Unterrichtsaufträge und das ausgebaute Training für Woche 36 und 37.

## In GitHub übernehmen

1. ZIP entpacken.
2. Den Inhalt in das Hauptverzeichnis des bestehenden Repositorys übernehmen. Gleichnamige Projektdateien ersetzen; eigene produktive Einstellungen und Zugangsdaten beibehalten.
3. `public`, `src`, `package.json` und `wrangler.jsonc` liegen nebeneinander. Änderungen wie bisher in GitHub speichern und über die vorhandene Cloudflare-Bereitstellung veröffentlichen.

Die Datenbankanbindung und die Schnittstellen zur Synchronisation bleiben erhalten. Das Update benötigt keine Änderung des Datenbankschemas. Im Worker wurde die Kameraberechtigung für die eigene Website freigegeben, damit die neue Videoaufnahme funktioniert. Kamera und Mikrofon starten erst nach einer bewussten Aktion und der Browserfreigabe.

## Das ist neu

- Grössere Schrift auf der gesamten Website; über «Extra grosse Schrift» nochmals rund 40 % vergrösserbar. Angepasste Abstände und Umbrüche für kleine Bildschirme.
- Genaue Rückkehr aus dem Training, einfache Wochen- und Übungswahl und freie Navigation ohne Abschlusszwang.
- Woche 36: klare Anleitung zur heruntergeladenen 20-Questions-Präsentation, leere persönliche Profilfelder, verständlicher Partnerauftrag und zwei unterschiedliche Feedbackrunden im Défi final.
- Woche 37: vorhandene Angaben aus Marseille weiterverwenden, mit Schule und Beruf ergänzen und mit übersetzten Satzbausteinen ausbauen.
- Suchbare Berufsliste mit 246 amtlich abgeglichenen EFZ-/EBA-Berufen, männlicher und weiblicher französischer Form sowie direkten Quellenlinks. Die beiden Berufshilfen verwenden dieselbe persönliche Angabe.
- Vier längere Hörprofile mit passenden weiblichen und männlichen Stimmen und insgesamt 24 Fragen.
- Persönliche Sprechkarte, klare Gruppenproben und Lernkontrolle als 60-Sekunden-Video: ganzer Körper sichtbar, frei sprechen, anschliessend in Teams abgeben. Eine lokale Videoaufnahme ist zusätzlich direkt auf der Website möglich.
- Fünf Trainingsarten mit Merkliste, persönlichem Tagesziel, Wiederholungsabständen, Übungszählern, Lernpunkten, Levels und Abzeichen. Vorherige und nächste Aufgabe stehen direkt an der Übung.

Einzelheiten und Prüfumfang: [UX-Ueberarbeitung.md](UX-Ueberarbeitung.md). Berufsquellen: [Berufsbezeichnungen-Quellen.md](Berufsbezeichnungen-Quellen.md). Stimmen und Lizenzen: [Audio-Sources.md](Audio-Sources.md).

## Lokal prüfen

Node.js ab 22.12 verwenden.

```sh
npm ci
npm test
npm run dev
```

Die Vorschau zeigt die Oberfläche. Ohne Cloudflare-API lässt sich die vorhandene Möglichkeit zum lokalen Weiterarbeiten verwenden. Die produktive Bereitstellung verwendet weiterhin `src/index.js` und `public`.

19 automatisierte Prüfungen sind erfolgreich. Die Oberfläche wurde zusätzlich auf Desktop-, Tablet- und Smartphonebreiten geprüft, einschliesslich 320 Pixeln mit extra grosser Schrift. Echte Lernkonten, eine reale Teams-Abgabe und physische Kamera-/Mikrofongeräte waren nicht Teil der Prüfung.

Ältere `README-*.txt` bleiben als Projektgeschichte enthalten. Für dieses vollständige Update gilt diese Anleitung.
