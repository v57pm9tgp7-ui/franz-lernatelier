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

Version: 0.20.0
Datum: 13.09.2026

Zusatzfix 0.19.5
- Rückseite der Druckkarte steht nun rechts, damit Vorder- und Rückseite beim doppelseitigen Druck besser zusammenpassen.
- Titel auf der Rückseite heisst neu «Je me présente».


Grosses Update 0.20.0 – Themenbasiertes Training
- Trainingsmodus bezieht sich neu auf das aktuelle Thema «Se présenter» (Woche 36–38), nicht nur auf eine einzelne Woche.
- Startansicht neu hierarchisiert: aktuelles Thema, Testvorbereitung und kompakte Schnelltrainings.
- Neue Testvorbereitung «Vocabulaire» mit vollständiger Französisch-Deutsch-Liste, Suche und Lernstandfiltern.
- Druckbare Wortschatzliste.
- Drei Lernstände aus demselben Cartes-Datensatz: zuverlässig, unsicher, noch lernen / noch nicht geprüft.
- Neuer Probe-Check ohne Hilfen; detaillierte Auswertung erst am Schluss.
- Richtige/falsche Check-Antworten fliessen zurück in den Cartes-Wiederholungsplan.
- Datenmodell unterstützt bereits weitere spätere Testbereiche wie Grammaire oder Communication, ohne diese jetzt in der Oberfläche anzuzeigen.
- Trainingsansicht innerhalb der Übungen zeigt ebenfalls das ganze Thema und verlinkt zur Testvorbereitung.
