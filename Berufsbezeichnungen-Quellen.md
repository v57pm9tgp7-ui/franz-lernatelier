# Berufsbezeichnungen Deutsch–Französisch

Stand der Abfrage: 9. September 2026.

## Grundlage

- Deutsche Ausgangsliste: die 247 Berufe aus dem bestehenden Berufswahlcoach, anschliessend mit den amtlichen Quellen abgeglichen.
- Amtliche Sprachzuordnung: die `hreflang="fr"`-Verweise der [Sitemap von berufsberatung.ch](https://www.berufsberatung.ch/sitemap.xml).
- Französische Berufsbezeichnungen: die vollständigen H1-Titel der jeweils zugehörigen [Berufsprofile auf orientation.ch](https://www.orientation.ch/fr/accueil-recherche/professions), dem französischen Angebot von berufsberatung.ch/SDBB/CSFO.
- Pro Datensatz sind der genaue deutsche und französische Profil-Link erhalten.

Es werden keine Berufsbezeichnungen maschinell übersetzt oder erfunden. Die männliche und weibliche Form werden aus den ausgeschriebenen amtlichen Seitentiteln übernommen. Die Reihenfolge auf der Quellenseite wechselt; deshalb wird sie beim Zusammenstellen normalisiert und anschliessend überprüft. Geschlechtsneutrale Titel, zum Beispiel «libraire», stehen in beiden Feldern gleich.

## Umfang

Die fertige Liste enthält 246 Berufe: 186 EFZ- und 60 EBA-Berufe. Sie entspricht allen am Abfragetag in der amtlichen Sitemap vorhandenen Berufsprofilen, deren deutsche URL auf `-efz` oder `-eba` endet. Zwölf ältere deutsche Links im Ausgangskatalog wurden anhand der amtlichen Sitemap auf ihre aktuelle Schreibweise mit «und» korrigiert.

Bei der Abschlussprüfung wurde ein Fehler im Ausgangskatalog entdeckt: Zifferblattmacher/in war als EFZ eingeordnet. Die amtlichen Profile führen einen Verbandsabschluss auf, keinen EFZ/CFC-Abschluss. Dieser Beruf ist deshalb in der EFZ/EBA-Liste nicht enthalten. Die richtige französische Bezeichnung lautet [«cadranographe»](https://www.orientation.ch/fr/professions/cadranographe). Der korrigierte zusätzliche Datensatz liegt separat in `weiterer-beruf-verbandsdiplom.json` vor.

Das ist eine Liste von Grundberufen. Fachrichtungen und Branchen sind nicht immer eigene Einträge, zum Beispiel bei Fachmann/Fachfrau Betreuung oder Kaufmann/Kauffrau. Höhere Berufsbildung, Hochschulberufe und frei erfundene Berufsbezeichnungen sind nicht enthalten. Für einen nicht gefundenen Begriff bietet die Oberfläche eine Suche bei berufsberatung.ch oder orientation.ch an.

## Datenfelder

| Feld | Zweck |
| --- | --- |
| `id` | Stabile Katalogkennung aus dem Berufswahlcoach |
| `de` | Deutscher Beruf mit Abschluss |
| `frMale`, `frFemale` | Ausgeschriebene persönliche Sprechform ohne Abschluss; erster Buchstabe für den Satzeinsatz kleingeschrieben |
| `qualification`, `qualificationFr` | EFZ/CFC beziehungsweise EBA/AFP |
| `frCombined` | Zusammengefasster amtlicher französischer Seitentitel |
| `officialFrMale`, `officialFrFemale` | Vollständige französische Titel einschliesslich Abschluss, genau wie auf der Quellenseite |
| `sourceDe`, `sourceFr` | Direkte amtliche Berufsprofile |
| `aliases` | Zusätzliche deutsche Suchbegriffe und verbreitete Abkürzungen; keine zusätzlichen Berufsabschlüsse |

## Einbindung

`berufe-de-fr.json` enthält das Datenarray. `berufe-de-fr.js` stellt dieselben Daten unter `window.ATELIER_OCCUPATIONS` bereit. Die lokale Zuordnung funktioniert ohne zusätzliche Netzwerkanfrage und damit auch bei einer vorübergehenden Störung des Quellenportals. Bei der Anzeige sollte «Quelle: berufsberatung.ch / orientation.ch · Stand 09.09.2026» verlinkt werden.

Die Oberfläche lässt die gewünschte Sprechform auswählen. Beispiel: «Je veux devenir assistante médicale.» Ein neutraler Name bleibt gleich, zum Beispiel «Je veux devenir libraire.» Der Abschluss wird in der Berufsliste gezeigt, ist aber im mündlichen Satz nicht nötig.

Die Quelldokumente und Abrufskripte sind interne Rechercheartefakte und müssen nicht in das Website-Paket übernommen werden.

## Prüfung

- 246 eindeutige IDs und 246 unterschiedliche französische Profil-URLs.
- Abschlusszuordnung EFZ/CFC und EBA/AFP stimmt in jedem Datensatz mit den vollständigen französischen Titeln überein.
- Alle 246 französischen Seiten verlinken mit `hreflang="de"` genau auf das zugeordnete deutsche Berufsprofil zurück.
- Die männlichen/weiblichen Formen wurden in der vollständigen Ausgabetabelle geprüft; 45 Berufe haben eine gleichlautende Form.
- UTF-8-JSON ist gültig. Keine französischen Titel wurden aus deutschen Titeln übersetzt.
