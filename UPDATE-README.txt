Franz Lernatelier – Update 0.19.4
Woche 38: dynamische Weiterarbeit an den Übungen aus Woche 37

Was neu ist
- Woche 38 ist die aktuelle Woche.
- Es kommen vorläufig keine neuen Aufgaben dazu.
- Die acht Übungen aus Woche 37 werden als Übungen der Woche 38 angezeigt.
- Der bisherige Arbeitsstand wird übernommen: erledigte/offene Übungen bleiben sichtbar.
- Auf der Startseite stehen sofort drei Informationen: bereits bearbeitet, noch offen, zuletzt bearbeitet.
- Ein direkter Button führt zur zuletzt bearbeiteten Übung.
- Woche 38 verwendet bewusst denselben gespeicherten und online synchronisierten Lernstand wie Woche 37.
- Dadurch funktioniert die Fortsetzung auch beim Gerätewechsel nach Login mit derselben Schul-E-Mail.
- Die ausführliche Woche-38-Seite ist eine dynamische Weiterführung der bestehenden Woche 37. Änderungen an den Übungen bleiben dadurch konsistent.
- Die verbesserte Sprechkarte aus Version 0.19.3 ist enthalten und funktioniert nun auch in Woche 38.

Installation
1. ZIP entpacken.
2. Den Inhalt in das Hauptverzeichnis des bestehenden GitHub-Repositories übernehmen.
3. Gleichnamige Dateien ersetzen.
4. In GitHub speichern und wie bisher über Cloudflare deployen.
5. Nach dem Deploy die Seite einmal mit Strg+F5 neu laden.

Wichtig
- Die Datei public/module/woche-37/index.html wird nicht ersetzt.
- Woche 38 lädt diese bestehende Übungslogik dynamisch und zeigt sie mit einer Woche-38-Oberfläche.
- Der gemeinsame Lernstand verwendet weiterhin franzosischLernatelierW37_v1 bzw. serverseitig woche-37-2026. Das ist beabsichtigt, damit niemand seinen Stand verliert.

Version: 0.19.4
Datum: 13.09.2026
