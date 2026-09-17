# Franz Lernatelier – Update 0.22.3

Dieses Update korrigiert die Druckfunktion in **Woche 38 · Übung 6**.

## Wichtigste Korrektur

Die Schaltfläche **„Sprechkarte drucken“** steht jetzt **oberhalb des grossen Textfeldes** und ist damit sofort sichtbar. Sie wird nicht mehr erst unterhalb des langen editierbaren Textes angezeigt.

Die Druckfunktion ist zudem technisch abgesichert: Der Button kann die Karten-Druckfunktion direkt starten. Falls das Druckmodul aus irgendeinem Grund noch nicht geladen ist, wird es beim Klick nachgeladen.

## Druckinhalt

- Vorderseite: kompakte Stichwörter als Gedächtnisstütze.
- Rückseite: der aktuell bearbeitete komplette Text aus Übung 6.
- Eigene Änderungen, Ergänzungen und Streichungen werden beim Drucken übernommen.

## Cache

Die Versionsnummern der betroffenen JavaScript-Dateien und der Service-Worker-Cache wurden erhöht, damit Browser nicht versehentlich die vorherige Version 0.22.2 weiterverwenden.

## Installation in GitHub

Den Inhalt dieses ZIPs in das bestehende Repository kopieren und gleichnamige Dateien ersetzen. Die übrigen Dateien des bestehenden Projekts bleiben unverändert.
