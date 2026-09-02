FRANZ LERNATELIER – CLOUDFLARE WORKER VERSION 0.4
=================================================

NEU IN VERSION 0.4
- Schul-E-Mail-Adresse als einziges Identifikationsmerkmal (kein Passwort).
- Lernstand bleibt lokal gespeichert UND wird in Cloudflare D1 synchronisiert.
- Auf einem anderen Gerät wird der gespeicherte Lernstand nach Eingabe derselben E-Mail geladen.
- Woche 36 synchronisiert den vollständigen Arbeitsstand, inklusive Antworten, Niveau und Fortschritt.
- Bei Verbindungsproblemen kann lokal weitergearbeitet werden; später wird erneut synchronisiert.

ZULÄSSIGE E-MAIL-DOMAINS
- @stud.bffbern.ch (Lernende)
- @bffbern.ch (Lehrperson/Test)

WICHTIG ZUR SICHERHEIT
Die E-Mail-Adresse ist in dieser Version nur ein Identifikationsmerkmal, keine sichere Authentifizierung.
Wer die E-Mail-Adresse einer anderen Person kennt, könnte theoretisch deren Lernstand laden.
Daher diese Version nicht für Noten, besonders sensible Daten oder vertrauliche Beurteilungen verwenden.

CLOUDFLARE / D1
Die wrangler.jsonc enthält eine D1-Bindung mit dem Namen DB ohne feste Datenbank-ID.
Aktuelle Wrangler-Versionen können die D1-Datenbank beim Deployment automatisch bereitstellen.
Die Tabellen learners und progress werden beim ersten API-Aufruf automatisch angelegt.

DEPLOYMENT
1. Diese Projektdateien ins GitHub-Repository franz-lernatelier übernehmen.
2. Cloudflare Workers Builds veröffentlicht den neuen Commit automatisch.
3. Unter Worker > Bindings prüfen, ob eine D1-Bindung namens DB vorhanden ist.
4. Webseite öffnen und mit einer Schul-E-Mail testen.
5. Auf einem zweiten Browser/Gerät dieselbe E-Mail eingeben und prüfen, ob der Stand geladen wird.

DATEN IN D1
learners:
- email
- created_at
- last_seen_at

progress:
- email
- module_id
- state_json
- client_updated_at
- server_updated_at

Die eigentlichen Audioaufnahmen werden NICHT in D1 gespeichert.


SICHERE VERBINDUNG (Version 0.4.1)
---------------------------------
Der Worker laeuft vor allen statischen Dateien, leitet HTTP mit Status 308 auf HTTPS um und setzt HSTS sowie weitere Sicherheits-Header. Fuer eine produktive Schuladresse wird eine Cloudflare Custom Domain empfohlen; Cloudflare stellt das TLS-Zertifikat automatisch aus.
