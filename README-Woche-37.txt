FRANZ LERNATELIER · WOCHE 37
GitHub-Update für franzatelier.com
====================================

Dieses Paket ist als UPDATE für das bestehende Repository
v57pm9tgp7-ui/franz-lernatelier gedacht.

WICHTIG
-------
Die ZIP-Datei nicht als einzelne ZIP-Datei ins Repository legen.
Zuerst auf dem Computer entpacken und danach die enthaltenen Dateien/Ordner
in das bestehende GitHub-Repository hochladen. Bestehende Dateien mit gleichem
Pfad ersetzen.

Geändert / neu
--------------
1. public/module/woche-37/index.html
   Neues vollständiges Lernatelier für Woche 37 «Qui suis-je ? · Je me présente».

2. public/data/modules.js
   Woche 36 bleibt erhalten und wird als frühere Woche angezeigt.
   Woche 37 wird zur aktuellen Woche.

3. public/service-worker.js
   Cache-Version erhöht und Woche 37 ergänzt, damit die neue Woche zuverlässig
   geladen und danach auch offline verfügbar wird.

Woche 36 bleibt unverändert erhalten.

EMPFOHLENER GITHUB-WEG
----------------------
1. Diese ZIP-Datei entpacken.
2. Im Repository franz-lernatelier den Branch main öffnen.
3. «Add file» → «Upload files» wählen.
4. Den Inhalt dieses entpackten Ordners so hochladen, dass die vorhandene
   Ordnerstruktur public/... erhalten bleibt.
5. Bei gleichen Dateipfaden die neue Version übernehmen.
6. Commit-Nachricht z. B.: «Woche 37 veröffentlichen».
7. Nach dem Cloudflare-Deployment franzatelier.com neu laden.

KURZTEST NACH DEM DEPLOYMENT
----------------------------
- Startseite zeigt Woche 37 als aktuelle Woche.
- «Woche 37 öffnen» führt zu /module/woche-37/.
- Login / Schul-E-Mail funktioniert wie bisher.
- Woche 36 ist unter «Wochen» weiterhin verfügbar.
- Offene «20 Questions» aus Woche 36 werden in Woche 37 als Brücke erkannt.
- Niveauwahl Soutien / Standard / Défi / Expert funktioniert.
- Missionen 1 bis 8 lassen sich öffnen.
- Hörbuttons in Mission 4 funktionieren im Browser.
- Arbeitsstand wird gespeichert.

DIDAKTISCHE LOGIK WOCHE 37
--------------------------
Kernziel: Die Lernenden können sich auf Niveau A2 verständlich und zunehmend
frei vorstellen. Das Lernatelier ist kein Ersatz für die gemeinsame Lektion:
Es bereitet Sprechphasen vor, sichert persönliche Sprachbausteine und gibt
gezielte Hilfe. Die Präsentation steuert Gruppenwechsel und mündliche Phasen.

Die 8 Missionen:
01 Questions utiles – Brücke aus «20 Questions»
02 Mon profil essentiel – nützliche Informationen über mich
03 Réponses plus fortes – Detail, Grund und Verbindung
04 Écouter un profil – Hörverstehen und Transfer
05 École, métier, qualités – Berufsbezug
06 Ma carte de parole – Stichwortkarte statt Skript
07 Répéter en groupe – drei Sprech-Runden in wechselnden Dreiergruppen
08 Défi final – 60 Sekunden möglichst frei sprechen

Reserve zählt nie als Rückstand. Im Modul stehen zusätzliche Kurz- und
Vertiefungsaufgaben bereit, u. a. Portrait croisé, Rotation 3×3,
Aussprache-Coaching und Probeaufnahme.

Technische Kennung Woche 37:
- moduleId: woche-37-2026
- storageKey: franzoesischLernatelierW37_v1

Stand: 05.09.2026
