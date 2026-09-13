Franz Lernatelier – Woche 37 – Sprechkarte / Kartendruck
Update vom 13.09.2026

Dieses Paket ist ein gezieltes Update für das bestehende Repository franz-lernatelier.
Es ersetzt keine Lernstände und verändert kein Datenbankschema.

Geändert:
1. Übung 6 zeigt neu vollständige Stichwortvorschläge aus allen vorhandenen Woche-37-Angaben:
   persönliche Angaben, Freizeit, Schule, Sprachen, Beruf, Grund, Stärke,
   Schnupperlehre / Tätigkeit / Eindruck und Schluss.
2. Vorhandene eigene Stichwörter bleiben erhalten. Ein Button kann die Vorschläge
   jederzeit aus den aktuellen Angaben neu erzeugen.
3. «Karte drucken» erzeugt exakt zwei A6-Seiten:
   - Vorderseite: Überschrift, kurze Arbeitsanweisung und nur Stichwörter.
   - Rückseite: der vollständige mit der App erarbeitete französische Text.
4. Beim Drucken wird die restliche Website vollständig ausgeblendet.
   Navigation, Niveauwahl, Hilfe, Buttons und andere Bildschirminhalte werden nicht gedruckt.
5. Der Service-Worker wurde versioniert und nimmt das neue Upgrade auch in den Offline-Cache auf.

In GitHub übernehmen:
- ZIP entpacken.
- Den Inhalt in das Hauptverzeichnis des bestehenden Repositorys ziehen.
- Gleichnamige Dateien ersetzen.
- Die neue Datei public/assets/week37-card-print-upgrade.js muss mit hochgeladen werden.
- Danach wie gewohnt committen; Christoph veröffentlicht selbst über den bestehenden GitHub/Cloudflare-Weg.

Druckhinweis:
Für echte Vorder-/Rückseite im Druckdialog «beidseitig» bzw. Duplex aktivieren.
Das Dokument selbst liefert Seite 1 als Vorderseite und Seite 2 als Rückseite im Format A6 Hochformat.
