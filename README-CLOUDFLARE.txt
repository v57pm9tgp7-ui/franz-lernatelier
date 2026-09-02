Franz Lernatelier – Cloudflare Worker Static Assets

Diese Version ist für Cloudflare Workers vorbereitet.

Projektstruktur:
- wrangler.jsonc
- public/ (komplette Webseite)

Empfohlene Veröffentlichung:
1. Diesen Ordner entpacken und als GitHub-Repository hochladen.
2. Cloudflare Dashboard > Workers & Pages > Create application.
3. Bei "Import a repository" auf "Get started" klicken.
4. GitHub verbinden und das Repository auswählen.
5. Production branch: main.
6. Deploy command: npx wrangler deploy (Standardwert).
7. Save and Deploy.

Der Worker-Name ist "franz-lernatelier". Falls im Cloudflare-Dashboard ein bereits existierender Worker mit anderem Namen verwendet wird, muss der Name in wrangler.jsonc exakt übereinstimmen.
