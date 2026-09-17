# Franz Lernatelier – Update 0.22.5

## Korrektur: Sprechkarte Woche 38 · Übung 6

Dieses Update behebt den Fehler, dass die Rückseite der gedruckten Sprechkarte leer bleiben konnte.

### Neu abgesichert
- Die Rückseite enthält **immer den vollständigen aktuellen Sprechtext** aus dem editierbaren Textfeld.
- Änderungen, Ergänzungen und Streichungen werden unmittelbar vor dem Druck nochmals übernommen.
- Der Text wird beim Öffnen des Druckdialogs ein zweites Mal synchronisiert (`beforeprint`).
- Die Druckansicht verwendet einen eigenen, robusten Textblock auf der Rückseite und erzwingt dessen Sichtbarkeit im Druckmodus.
- Falls der editierte Text ausnahmsweise leer ankommt, wird statt einer leeren Rückseite der vollständig aus den bisherigen Angaben erzeugte Sprechtext verwendet.
- Auch längere Texte werden durch abgestufte Schriftgrössen vollständig auf die A6-Rückseite eingepasst.

## Installation
Den Inhalt dieses ZIPs über das bestehende GitHub-Repository kopieren und gleichnamige Dateien ersetzen. Danach neu deployen. Der Service-Worker-Cache wurde auf Version `0.22.5` erhöht, damit Browser die korrigierten Dateien laden.
