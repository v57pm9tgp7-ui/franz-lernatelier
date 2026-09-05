FRANZ LERNATELIER – KORRIGIERTER ÜBERGANG WOCHE 36 → 37
=============================================================

Dieses Update setzt den neuen Unterrichtsablauf um und lässt die bestehenden Eingaben der Lernenden erhalten.

NEUER ABSCHLUSS VON WOCHE 36
-----------------------------
1. BORDEAUX · 20 Questions vorbereiten
   - vier Fragen aus mindestens drei Kategorien auswählen
   - eigene, wahrheitsgetreue Antworten vorbereiten
   - Joker bei persönlichen Fragen bleibt erhalten
   - das frühere digitale 2-Minuten-Interview wurde entfernt
   - der frühere Teil «Was haben Sie erfahren?» wurde entfernt

2. 20 QUESTIONS · KLASSENAKTIVITÄT
   - findet mit der separaten Präsentation in Dreiergruppen statt
   - A fragt, B antwortet, C hört zu / coacht
   - das Lernatelier dient nur als sprachliche Hilfe

3. MARSEILLE · Mon profil express
   - persönliche Informationen zu einer Vorstellung ordnen

4. NICE · Défi final
   - möglichst frei und verständlich sprechen
   - danach beginnt Woche 37

SPEED-DATING / TOULOUSE
-----------------------
- ist aus dem sichtbaren Restweg von Woche 36 entfernt
- zählt nicht mehr zum Abschlussfortschritt
- wird nicht mehr über «Weiter» aufgerufen

ÜBERGANG ZU WOCHE 37
--------------------
- Woche 37 prüft nun Bordeaux, Marseille und Nice.
- Der Start von Woche 37 wird erst freigegeben, wenn diese drei Escales abgeschlossen sind.
- Mission 1 von Woche 37 wiederholt die 20 Questions nicht mehr als Gesprächsrunde.
  Stattdessen werden drei Antworten in erste Bausteine für «se présenter» verwandelt.

GITHUB-UPLOAD
-------------
1. Diese ZIP-Datei entpacken.
2. Den enthaltenen Ordner «public» in das bestehende Repository hochladen.
3. Bei bestehenden Dateien «Replace/Overwrite» wählen.
4. Die Ordnerstruktur unverändert lassen.

Geänderte/enthaltene Dateien:
- public/assets/module-bridge.js
- public/data/modules.js
- public/service-worker.js
- public/module/woche-37/index.html

WICHTIG
-------
Die grosse Datei public/module/woche-36/index.html wird NICHT ersetzt.
Die Korrektur für Woche 36 wird über public/assets/module-bridge.js angewendet.
Die vorhandene Woche-36-Datei lädt diese Bridge bereits.

Nach der Veröffentlichung im Browser einmal neu laden. Der Service-Worker-Cache
wurde auf v0-9 erhöht, damit die neue Version zuverlässig übernommen wird.


UPDATE – SCHREIBHILFEN & HOERVERSTEHEN
--------------------------------------
- Woche 37: Unter allen Text- und Schreibfeldern erscheint jetzt eine Schreibhilfe.
- Die Hilfe passt sich an Soutien / Standard / Défi / Expert an.
- Soutien zeigt viele Bausteine und Beispiele; Standard gezielte Hilfen; Défi und Expert deutlich weniger Gerüst und mehr Ausbauimpulse.
- Diktat im Trainingsmodus bewertet nicht mehr nach exakter Zeichenfolge. Kleine Schreibfehler, Akzente, Gross-/Kleinschreibung und sehr ähnliche Wörter führen nicht mehr sofort zu «falsch».
- Rueckmeldungen sind gestuft und motivierend: «sehr gut», «fast vollständig – das zählt», «gute Grundlage», «guter erster Versuch».
- Nach mehreren Versuchen stehen ein kleiner Hörhinweis und danach ein freiwilliger Lösungsvergleich bereit.
- Audio ist langsamer: Soutien besonders langsam, Standard klar verlangsamt, Défi/Expert etwas natürlicher.
- Woche 36: Audioausgabe wurde über die vorhandene Modul-Brücke ebenfalls verlangsamt.
- Für diese Verbesserungen ist KEINE KI nötig. Die Auswertung arbeitet lokal im Browser mit toleranter Ähnlichkeitsprüfung.

ERGÄNZUNG · LESBARKEIT UND VOLLBILD
-----------------------------------
- Der Arbeitsbereich nutzt auf grossen Bildschirmen fast die gesamte verfügbare Breite.
- Kleine Hilfs-, Meta- und Erklärungstexte wurden global vergrössert.
- Besonders die Schreibhilfen sind deutlich besser lesbar; 10–12-px-Kleinschrift wird vermieden.
- Auf Hauptseite und Wochenmodulen steht neu ein Vollbild-Schalter zur Verfügung.
- Im Vollbild wird die Navigation ausgeblendet und der Arbeitsbereich maximiert. Ein gut sichtbarer Button beendet den Vollbildmodus; Esc funktioniert ebenfalls.
- Service-Worker-Cache: v0-11.

UPDATE – TYPOGRAFIE 2.0 / GRUENDLICHER LESBARKEITS-AUDIT
---------------------------------------------------------
- Der gesamte sichtbare Text in Woche 37 wurde systematisch nach zu kleinen Schriftgroessen geprueft.
- Alle 8 Missionen sowie alle 4 Trainingsmodi wurden im Desktop-Layout kontrolliert.
- Lern- und Hilfetexte liegen nun in der Regel bei mindestens 16–18 px.
- Reine Metadaten/Badges liegen bei mindestens ca. 15–16 px; es gibt im Desktop-Lernbereich keine sichtbaren Texte unter 15 px.
- Schreibhilfen wurden nochmals deutlich vergroessert: Schritttexte, Satzbausteine, Wortideen, Beispiele, Checklisten und Statusmeldungen.
- Auch bisher unauffaellige Kleinstellen wurden korrigiert: Hoerverstehens-Fragen, ausgeblendete Hoertexte, Mission-Metadaten, Reservekarten, Rollen-/Gruppenhinweise, Labels und Drawer-Texte.
- Die Karten duerfen bei groesserer Schrift in der Hoehe wachsen; Text wird nicht zusammengedrueckt oder abgeschnitten.
- Das kleine Passeport im Hero wurde fuer die groessere Typografie nachjustiert, damit Titel und Beschriftungen sauber getrennt bleiben.
- Derselbe globale Typografie-Standard wird ueber ui-workspace.css auch auf die Hauptseite und Woche 36 angewendet.
- Woche 37 bindet das Lesbarkeits-Stylesheet jetzt bereits im <head> ein, damit es keinen kurzen Wechsel von kleiner zu grosser Schrift beim Laden gibt.
- Service-Worker-Cache: v0-12.
