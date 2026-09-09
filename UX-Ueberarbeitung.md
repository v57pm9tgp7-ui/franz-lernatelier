# UX-Überarbeitung und Prüfung

Franz Lernatelier · 9. September 2026

Ziel: Eine klare, ruhige und selbsterklärende Oberfläche für Lernende von 15 bis 18 Jahren. Die bestehenden Lerninhalte und fachlichen Arbeitsabläufe bleiben erhalten.

## Priorisierte Probleme und Lösungen

| Priorität | Festgestelltes Problem | Umgesetzte Verbesserung |
| --- | --- | --- |
| Sehr hoch | Training führte zur Übersicht statt zur ursprünglichen Arbeitsstelle zurück. | Die Navigation merkt sich die Ausgangsseite, Übung, Scrollposition, Eingabestelle und geöffnete Bereiche. Ein deutlich beschrifteter Rückweg steht im Training bereit. |
| Sehr hoch | Übungen und Wochen waren schwer direkt anwählbar; Abschlussanzeigen konnten wie Zugangsvoraussetzungen wirken. | Eine ständig erreichbare Wochen- und Übungswahl sowie freie Vor-/Zurücknavigation machen den Zugang unabhängig vom Abschluss. Der vorgeschlagene Lernweg aus Woche 36 bleibt bestehen. |
| Sehr hoch | Eine Trainingstaste in der Wochenliste öffnete unabhängig von ihrer Woche das aktuelle Modul. | Jede Taste ist an die richtige Woche gebunden. Alle vier Trainingsarten unterstützen direkte Einstiege. |
| Sehr hoch | Das Wortschatztraining aus Woche 37 bot keinen mit Woche 36 vergleichbaren Kartenablauf. | Vollständige Kartenrunde mit Erinnern, Aufdecken, Audio, Merkliste, Wiederholung schwieriger Karten und verständlichem Rundenabschluss. Die vorherige Karte ermöglicht die Korrektur einer versehentlichen Bewertung. |
| Sehr hoch | Bei «20 Questions» war unklar, welche Präsentation verwendet wird und wie die Dreiergruppen technisch arbeiten. | Der Auftrag nennt nun die zuvor aus Teams heruntergeladene, lokal geöffnete Präsentation und einen Computer pro Dreiergruppe. Rollen und Rollenwechsel sind direkt beschrieben. |
| Sehr hoch | «Mon profil express» wirkte teilweise vorausgefüllt; Zweck von Sprechtext und Partnerspiel waren zu wenig erklärt. | Alle acht Felder starten leer und ohne Übernahme des Profilnamens. Der automatisch zusammengesetzte Sprechtext erhält einen klaren Verwendungsauftrag; «Deux vérités, un mensonge» führt durch Vorbereitung, Raten, Auflösen und Rollenwechsel. Der unklare frühere Teil D entfällt. |
| Sehr hoch | Beim «Défi final» waren drei Stichwörter und 20 Sekunden Vorbereitung zu knapp; ein Durchgang und ein allgemeines Feedback ermöglichten kaum gezielte Verbesserung. | Ein Fünf-Schritt-Sprechplan mit Satzhilfen, sechs bis acht Stichwörtern und zwei Minuten Vorbereitung entlastet die Aufgabe. Zwei 60-Sekunden-Runden mit Partnerwechsel verbinden Checklistenfeedback, Verbesserungsfokus und eine zweite Wirkungsbewertung. Das Exit-Ticket entfällt. |
| Hoch | Die zuletzt bearbeitete Übung war nach einem Wechsel schwer wiederzufinden. | «Letzte Übung», eindeutige Seitentitel und nachvollziehbare Browser-Zurücknavigation. Auf der Startseite sind die acht Übungen der aktuellen Woche direkt anklickbar. |
| Hoch | Mehrere ältere Gestaltungsregeln überlagerten sich; grosse Dekoration und Fortschrittsanzeigen verdrängten die eigentlichen Aufgaben. | Gemeinsame Gestaltung in `atelier.css`; Übungen stehen vor ergänzenden Angaben. Niveauwahl, Lernpass und Zusatzaufgaben sind sinnvoll gruppiert und aufklappbar. |
| Hoch | Kleine Texte, wechselnde Abstände, viele Hervorhebungen und unklare Fokuszustände erschwerten die Nutzung. | Einheitliche Schriftgrössen, reduzierte Farbpalette, deutliche Fokusrahmen, überwiegend mindestens 44 Pixel hohe Bedienelemente und zugeordnete Formularbeschriftungen. |
| Hoch | Bei schmalen Ansichten brauchten Navigation und Karten zu viel Platz oder liefen über den Rand. | Eigene Anordnung für Tablet und Smartphone; einspaltige Formularbereiche, passende Trainingsschaltflächen und eine kompakte Navigation. |
| Mittel | Wiederholte DOM- und Schriftprüfungen verursachten unnötige Arbeit bei Änderungen der Oberfläche. | Die bestehende Anpassung für Woche 36 beobachtet ihre eigenen Änderungen nicht mehr. Schriftgrössen werden direkt über CSS geregelt; die globale Grossschriftoption bleibt erhalten. |

## Gestaltung und Orientierung

Die wichtigsten Aktionen erhalten einen dunklen Blauton. Die Rückkehr aus dem Training ist gezielt rot hervorgehoben. Helle, neutrale Flächen, klare Rahmen und wenige Akzentfarben ersetzen überlagerte Verläufe und grosse Dekorationen.

Woche und Übung bleiben in der Navigationsleiste erkennbar. Die nächste und die vorherige Übung sind während des Scrollens erreichbar. In der Übersicht führt ein direkter Einstieg zur zuletzt besuchten Übung. Die ursprünglichen französischen Lernbegriffe und Aufgabenstellungen bleiben erhalten; zusätzliche Bedienbezeichnungen sind kurz und deutsch.

Geschlossene Hilfefenster sind ausgeblendet und für die Tastatur inaktiv. Ein geöffnetes Fenster erhält den Fokus, hält die Tabulatornavigation im Fenster und gibt den Fokus beim Schliessen an den Auslöser zurück. Rückmeldungen werden für unterstützende Technik als Status ausgezeichnet. Grössere Schrift, stärkerer Kontrast, reduzierte Bewegung und Vollbild bleiben verfügbar.

Die Gestaltung orientiert sich unter anderem an den W3C-Erläuterungen zu [Bedienzielgrössen](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) und [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Eine formale WCAG-Konformitätsprüfung war nicht Bestandteil dieser Überarbeitung.

## Erhaltene Grundlagen

- Die bestehenden Speicherkennungen und gespeicherten Antworten, Auswahlwerte, Bewertungen, Niveaus und Abschlüsse werden weiterverwendet.
- Die Lerninhalte für Woche 37 in `LEVELS`, `MISSIONS`, `QUESTIONS`, `LISTENING` und `TRAINING` wurden mit dem Ausgangsstand verglichen: identisch.
- `src/index.js`, `cloud-account.js`, `cloud-sync.js` und `wrangler.jsonc` wurden mit dem Ausgangsstand verglichen: identisch.
- Die vorhandenen Hörübungen, Schreibhilfen, Sprechaufträge, Timer, Aufnahmen, Exporte, Importe und Druckfunktionen bleiben im Projekt enthalten.
- Der bereits bestehende Abschlussweg aus Woche 36 bleibt bei Bordeaux → Marseille → Nice. Die weiteren zuvor zugänglichen Übungen 1 bis 4 sind zusätzlich über die Übungswahl erreichbar. Die im Ausgangsstand bereits ausgeblendete Speed-Dating-Station wurde nicht wieder eingeführt.
- Der Abschluss einer Aufgabe wird weiterhin ehrlich über die vorhandenen Kriterien markiert. Er ist keine Voraussetzung, um eine andere Übung oder Woche zu öffnen.

## Durchgeführte Prüfungen

### Automatisiert

`npm test`: **11 Prüfungen erfolgreich, keine fehlgeschlagen.**

1. Syntax aller ausgelieferten Skripte und vorhandene lokale HTML-Ressourcen.
2. Freies Öffnen aller acht Übungen aus Woche 37 bei nicht abgeschlossenen Wochen.
3. Rückkehr aus Woche-37-Training mit Scrollposition, Antwort, Texteingabefokus und Auswahlposition; einschliesslich Fokuswechsel durch einen Zeigerklick.
4. Rückkehr in Woche 36, freie Übungswahl und vorhandener Einstieg in Woche 37.
5. Neue Sprechaufträge in Woche 36: lokal geöffnete 20-Questions-Präsentation, leere Profilfelder, zwei Gesprächsrunden und kein Exit-Ticket.
6. Alle vier Trainingseinstiege in beiden Wochen.
7. Woche-37-Karten: Aufdecken, Sprachaufruf, Merkliste, Wiederholung, vorherige Karte und Rundenabschluss.
8. Leere Merkliste mit sinnvoller Fortsetzung sowie vorhandene Diktatprüfung.
9. Browser-Zurück zur ursprünglichen Übung und erneutes Öffnen der letzten Übung.
10. Erhalt vorhandener Antworten, Auswahlwerte, Häkchen, Bewertungen, Niveaus und abgeschlossener Übungen beim Navigieren und Verlassen der Seite.
11. Acht direkte Übungseinstiege auf der Startseite und eindeutige Zuordnung beider Wochentrainings.

### Im Browser

- Desktopansicht bei 1363 Pixeln; Tabletansicht bei 768 Pixeln; Smartphoneansichten bei 390 und 320 Pixeln. Die schmalen Ansichten wurden in Rahmen mit eigener Seitenbreite gerendert, sodass die tatsächlichen responsiven Layoutregeln greifen.
- Alle acht Übungen aus Woche 37 und alle sieben in Woche 36 zugänglichen Übungen bei 320 Pixeln geprüft: kein horizontaler Seitenüberlauf. Bei eingeblendeter Scrollleiste standen dabei 305 Pixel für den Inhalt zur Verfügung.
- Trainingswechsel aus einem ausgefüllten Feld: Rückkehr auf dieselbe Scrollposition von 732 Pixeln, dasselbe Feld und dieselbe Cursorposition. Geöffnete Schreibhilfen wurden in einem separaten Durchlauf ebenfalls erhalten.
- Training aus der Wochenliste gezielt für Woche 36 geöffnet und zur ursprünglichen Wochenübersicht zurückgekehrt.
- Wortschatzkarten in Woche 37 aufgedeckt, gemerkt, mit «Noch üben» wiederholt und eine Merklistenrunde abgeschlossen.
- Wortschatzkarte in Woche 36 mit der Leertaste aufgedeckt; Karten, Diktat, Blitzreaktion und Expert-Ansicht bei Smartphonebreite geöffnet.
- Diktat in Woche 37 auf Tabletbreite mit korrekter Antwort geprüft; passende Rückmeldung erhalten.
- Einstellungsfenster per Tastatur geprüft: Fokus beim Öffnen, rückwärts laufende Tabulatornavigation, Schliessen mit Escape und Fokus zurück auf «Ansicht anpassen».
- Die neuen Inhalte von Bordeaux, Marseille und Nice im Browser geprüft: leere Profilfelder, automatisch aktualisierter Sprechtext, 2-Minuten-Timer, getrennte Markierung beider Gesprächsrunden sowie lesbare Feedbackkarten auf Desktop, Tablet und Smartphone.

### Grenzen der Prüfung

Die Browserprüfungen erfolgten mit lokalen Testeingaben und ohne produktive Lernkonten. Die produktive Cloud-Synchronisation, eine tatsächliche Mikrofonaufnahme und ein physischer Ausdruck wurden nicht gegen das Live-System geprüft. Die zugehörigen bestehenden Funktionen bleiben enthalten; die Server- und Synchronisationsdateien sind unverändert. Die responsive Prüfung ersetzt keinen Test auf jedem physischen Gerät oder in jeder Browserversion.

## Technischer Überblick

- `public/assets/atelier-navigation.js`: gemeinsamer Rückweg, Verlauf, Wochen- und Übungswahl.
- `public/assets/atelier.css`: gemeinsame Darstellung und responsive Regeln.
- `public/assets/atelier-accessibility.js`: Beschriftungen, Fokusführung und Statusmeldungen.
- `public/assets/app.js`: aktuelle Woche, direkte Übungseinstiege und passende Trainingseinstiege.
- Wochenmodule: Anbindung der Navigation; ergänzter Kartenablauf in Woche 37.
- `public/service-worker.js`: neue Oberflächenressourcen und bevorzugte Aktualisierung von HTML, CSS und JavaScript.
- `tests/navigation.test.cjs`: reproduzierbare Funktionsprüfungen.
- `vite.config.mjs`: lokale Vorschau; die produktive Bereitstellung bleibt bei Cloudflare Worker und `public`.
