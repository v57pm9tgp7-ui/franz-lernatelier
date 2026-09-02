FRANZ LERNATELIER · VERSION 0.4

Die Plattform enthält Woche 36 als erstes Lernmodul.
Neu wird der Arbeitsstand zusätzlich zu localStorage in Cloudflare D1 gespeichert.
Die Schul-E-Mail-Adresse dient als eindeutiges Identifikationsmerkmal; ein Passwort wird in dieser Version nicht verwendet.

Wichtige Dateien:
- /index.html                     Plattform
- /module/woche-36/index.html     Wochenmodul
- /assets/cloud-account.js        Anmeldung und Synchronisation der Plattform
- /assets/cloud-sync.js           Synchronisation im Wochenmodul
- /src/index.js                   Worker-API für D1
- /wrangler.jsonc                 Cloudflare-Konfiguration
