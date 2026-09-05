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
