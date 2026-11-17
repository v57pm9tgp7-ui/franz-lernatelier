/* Französisch A2 · Woche 47. In allen Aufgaben gelten die im Kurs geübten Zahlwörter. */
(() => {
  'use strict';
  const tasks = [];
  const units = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

  function belowHundred(n, beforeMille) {
    if (n < 20) return units[n];
    if (n >= 80) return n === 80 ? (beforeMille ? 'quatre-vingt' : 'quatre-vingts') : 'quatre-vingt-' + units[n - 80];
    if (n >= 70) return n === 71 ? 'soixante et onze' : 'soixante-' + units[n - 60];
    const ten = tens[Math.floor(n / 10)];
    const one = n % 10;
    return one === 0 ? ten : (one === 1 ? ten + ' et un' : ten + '-' + units[one]);
  }

  function block(n, beforeMille = false) {
    if (n < 100) return belowHundred(n, beforeMille);
    const h = Math.floor(n / 100);
    const rem = n % 100;
    const prefix = (h > 1 ? units[h] + ' ' : '') + 'cent';
    if (!rem) return prefix + (h > 1 && !beforeMille ? 's' : '');
    return prefix + ' ' + belowHundred(rem, beforeMille);
  }

  function words(n) {
    if (n === 1000000) return 'un million';
    if (n < 1000) return block(n);
    const thousands = Math.floor(n / 1000), rest = n % 1000;
    return (thousands === 1 ? '' : block(thousands, true) + ' ') + 'mille' + (rest ? ' ' + block(rest) : '');
  }

  const format = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '’');
  const spelling = n => [...new Set([words(n), n === 1000000 ? 'un million' : words(n).replaceAll(' ', '-')])];
  const digitAnswers = n => [...new Set([format(n), String(n), format(n).replaceAll('’', ' '), format(n).replaceAll('’', "'")])];
  const group = n => String(n).padStart(3, '0');
  function hint(n) {
    if (n === 1000000) return 'Eine Million ist eins mit sechs Nullen. Im Französischen steht vor «million» ein Zahlwort.';
    if (n >= 1000) return 'Suchen Sie die Grenze bei «mille». Schreiben Sie links die Tausender und rechts einen Block mit genau drei Ziffern.';
    if (n >= 100) return 'Beginnen Sie mit dem Hunderter. Ergänzen Sie die letzten zwei Stellen aus dem Rest des Zahlworts.';
    if (n >= 90) return 'Nach «quatre-vingt» folgt bei diesen Zahlen ein Wort von «dix» bis «dix-neuf».';
    if (n >= 80) return '«Quatre-vingts» ist viermal zwanzig. Hören oder lesen Sie, ob noch eine Einheit folgt.';
    if (n >= 70) return '«Soixante» bedeutet 60. Was müssen Sie zum Zehner dazuzählen?';
    if (n >= 20) return 'Bestimmen Sie zuerst den Zehner und danach die Einerstelle.';
    return 'Sprechen Sie das Zahlwort langsam. Achten Sie besonders auf den letzten Laut.';
  }
  function reason(n) {
    if (n === 1000000) return '1’000’000 hat zwei volle Dreiergruppen nach der 1 und heisst «un million».';
    if (n >= 1000) {
      const k = Math.floor(n / 1000), r = n % 1000;
      return 'Die Blöcke sind ' + k + ' | ' + group(r) + '. Zusammen ergeben sie ' + format(n) + ' («' + words(n) + '»).';
    }
    if (n >= 100) {
      const h = Math.floor(n / 100), r = n % 100;
      if (!r) return '«' + words(n) + '» entspricht ' + h + ' × 100.' + (h > 1 ? ' «Cents» trägt am Ende der Zahl ein s.' : '');
      return 'Der Hunderterblock hat den Wert ' + (h * 100) + ', der Rest ' + r + '. Zusammen sind das ' + n + ' («' + words(n) + '»).';
    }
    if (n === 80) return '4 × 20 = 80. Am Ende der Zahl schreibt man «quatre-vingts» mit s.';
    if (n >= 80) return '80 + ' + (n - 80) + ' = ' + n + '. In «' + words(n) + '» folgt noch etwas auf «vingt», deshalb steht kein s.';
    if (n >= 70) return '60 + ' + (n - 60) + ' = ' + n + '. Das ergibt «' + words(n) + '».';
    if (n === 0) return '«Zéro» steht für 0. Beim Schreiben hat das erste e einen Akzent: é.';
    return '«' + words(n) + '» steht für ' + n + '.';
  }
  function add(id, level, kind, title, prompt, answers, goal, extra) {
    tasks.push({id: 'num-' + id, level, kind, title, prompt, answers, goal, ...extra});
  }

  // Kurze Durchsagen mit genau einer Zielzahl. Der Kontext liefert die Einheit.
  const audio = [
    [1,0,'Das Lager ist leer','Wie viele Pakete sind noch da?','Paquets en stock : zéro.'],
    [1,13,'Am Tisch','Wie viele Plätze werden reserviert?','Je voudrais réserver treize places.'],
    [1,16,'Im Team','Wie viele Personen werden erwartet?','Nous attendons seize personnes.'],
    [1,31,'Klassenausflug','Wie viele Billette werden bestellt?','Il nous faut trente et un billets.'],
    [1,43,'Im Sportclub','Wie viele Trikots sind bereit?','Il y a quarante-trois maillots.'],
    [1,52,'In der Mensa','Wie viele Menüs stehen bereit?','Nous avons préparé cinquante-deux menus.'],
    [1,60,'Vereinskasse','Wie viele Franken kommen in die Kasse?','Nous ajoutons soixante francs.'],
    [1,64,'Im Quartier','Welche Hausnummer hören Sie?','Notre adresse : soixante-quatre, rue des Fleurs.'],
    [2,70,'Am Quai','Welcher Bus fährt vor?','Le bus numéro soixante-dix arrive.'],
    [2,71,'Schliessfach','Welche Nummer steht auf dem Schlüssel?','Votre casier porte le numéro soixante et onze.'],
    [2,76,'Auf der Bühne','Wie viele Stühle braucht das Team?','Il faut soixante-seize chaises.'],
    [2,80,'Im Kino','Wie viele Billette sind verkauft?','Nous avons vendu quatre-vingts billets.'],
    [2,81,'An der Haltestelle','Welche Linie sollen Sie nehmen?','Prenez la ligne quatre-vingt-un.'],
    [2,90,'Im Fundbüro','Welche Abholnummer wird aufgerufen?','Le numéro quatre-vingt-dix, s’il vous plaît.'],
    [2,91,'Im Kurs','Welche Buchseite wird angesagt?','Ouvrez votre livre à la page quatre-vingt-onze.'],
    [2,106,'An der Réception','Welche Zimmernummer hören Sie?','Votre chambre porte le numéro cent six.'],
    [2,480,'Beim Konzert','Wie viele Eintritte wurden gezählt?','Nous avons compté quatre cent quatre-vingts entrées.'],
    [3,2007,'Am Schalter','Welche Bestellnummer nennt die Kundin?','Mon numéro de commande est deux mille sept.'],
    [3,10700,'Spendensammlung','Wie viele Franken wurden gesammelt?','Nous avons récolté dix mille sept cents francs.'],
    [3,20804,'Im Depot','Wie viele Exemplare sind auf Lager?','Le stock compte vingt mille huit cent quatre exemplaires.'],
    [3,70308,'Besuchszahlen','Wie viele Personen kamen ins Museum?','Le musée a accueilli soixante-dix mille trois cent huit personnes.'],
    [3,84090,'Im Stadion','Wie viele Eintritte wurden registriert?','Nous avons enregistré quatre-vingt-quatre mille quatre-vingt-dix entrées.'],
    [3,200015,'Aufrufe','Wie oft wurde der Film angeschaut?','La vidéo a été vue deux cent mille quinze fois.'],
    [3,450006,'Versand','Wie viele Karten gingen in den Versand?','Nous avons envoyé quatre cent cinquante mille six cartes.'],
    [3,900800,'Unterwegs','Wie viele Kilometer zeigt der Zähler?','Le compteur affiche neuf cent mille huit cents kilomètres.'],
    [3,1000000,'Beim Stadtfest','Wie viele Besuche sind es genau?','Nous avons atteint un million de visites.']
  ];
  for (const [level,n,title,prompt,speech] of audio) {
    add('hoer-'+n,level,'listen',title,prompt+' Notieren Sie die Zahl in Ziffern.',digitAnswers(n),'G1',{speech,hint:hint(n),explain:reason(n)});
  }

  // Aktive Produktion aus Ziffern. Alle Beispiele verlangen die Zahl allein.
  const writing = [
    [1,0,'Am Start','Schreiben Sie den Startwert in französischen Wörtern.'],
    [1,12,'Dutzend','Schreiben Sie die Anzahl Gläser als Zahlwort.'],
    [1,15,'Reservierte Plätze','Tragen Sie die Anzahl der Reservierungen in Worten ein.'],
    [1,18,'Alter','Schreiben Sie das Alter auf Französisch aus.'],
    [1,24,'Turnier','Schreiben Sie die Anzahl Teams in Worten.'],
    [1,32,'Kopien','Schreiben Sie die Anzahl Kopien aus.'],
    [1,41,'Gutscheine','Schreiben Sie den Wert des Gutscheins in Worten.'],
    [1,56,'Laufgruppe','Schreiben Sie die Teilnehmerzahl auf Französisch.'],
    [1,62,'Fundbüro','Schreiben Sie die Abholnummer in Worten.'],
    [2,69,'Fahrkarte','Schreiben Sie den Preis in Worten.'],
    [2,70,'Eintrittspreis','Schreiben Sie den Betrag in Worten.'],
    [2,71,'Am Markt','Schreiben Sie die Anzahl in Worten.'],
    [2,75,'Warteliste','Schreiben Sie die Wartelistenposition aus.'],
    [2,80,'Im Lager','Schreiben Sie den Bestand in Worten.'],
    [2,81,'Nummer ziehen','Schreiben Sie die Nummer in Worten.'],
    [2,90,'Im Kiosk','Schreiben Sie den Warenwert in Worten.'],
    [2,91,'Buchseite','Schreiben Sie die Seitenzahl aus.'],
    [2,98,'Trainingsgruppe','Schreiben Sie die Nummer auf Französisch.'],
    [2,200,'Neue Bücher','Schreiben Sie den Bestand aus.'],
    [2,201,'Bestand erhöht','Schreiben Sie den neuen Bestand aus.'],
    [2,280,'Tagesrekord','Schreiben Sie die Zielmarke in Worten.'],
    [3,1000,'Startkapital','Schreiben Sie den Geldbetrag in französischen Wörtern.'],
    [3,3009,'Inventar','Schreiben Sie die Inventarnummer aus.'],
    [3,7210,'Kilometer','Schreiben Sie den Kilometerstand aus.'],
    [3,24080,'Tickets','Schreiben Sie die Anzahl Eintrittskarten aus.'],
    [3,80000,'Festivalbudget','Schreiben Sie den Budgetbetrag in Worten.'],
    [3,121006,'Stand auf der Anzeige','Schreiben Sie den Wert der Anzeige aus.'],
    [3,200000,'Jubiläum','Schreiben Sie die Besuchszahl in Worten.'],
    [3,381019,'Onlineumfrage','Schreiben Sie die Anzahl der Antworten aus.'],
    [3,600700,'Bauprojekt','Schreiben Sie die Kostenschätzung aus.'],
    [3,999999,'Fast eine Million','Schreiben Sie die Zahl aus.'],
    [3,1000000,'Genau eine Million','Schreiben Sie die Zahl auf Französisch aus.']
  ];
  for (const [level,n,title,prompt] of writing) {
    add('wort-'+n,level,'input',title,prompt+' Geben Sie nur das Zahlwort ein.',spelling(n),'G2',
      {stimulus:format(n),hint:hint(n),explain:reason(n)});
  }

  // Schriftliche Mitteilungen im Alltag. Lernende übertragen den Wert in Ziffern.
  const reading = [
    [1,9,'Am Treffpunkt','Wie viele Menschen warten?','Neuf personnes attendent devant la gare.'],
    [1,14,'Nachricht vom Team','Wie viele Westen fehlen?','Il manque quatorze gilets.'],
    [1,27,'Auf der Quittung','Wie viele Franken kostet die Reparatur?','Réparation : vingt-sept francs.'],
    [1,35,'Klassenchat','Welche Buslinie steht im Chat?','On prend le bus trente-cinq.'],
    [1,46,'Vor dem Kino','Wie viele Plätze gibt es noch?','Il reste quarante-six places.'],
    [1,59,'Fundstück','Welche Nummer steht auf dem Etikett?','Objet numéro cinquante-neuf.'],
    [2,73,'Beim Match','Wie viele Punkte hat die Mannschaft?','Notre équipe a soixante-treize points.'],
    [2,79,'Im Klub','Wie viele Personen sind angemeldet?','Soixante-dix-neuf personnes sont inscrites.'],
    [2,88,'In der Küche','Wie viele Teller sind bereit?','Il y a quatre-vingt-huit assiettes.'],
    [2,97,'Im Buch','Auf welcher Seite finden Sie die Übung?','L’exercice se trouve à la page quatre-vingt-dix-sept.'],
    [2,303,'Im Büro','Welche interne Nummer steht auf dem Zettel?','Composez le trois cent trois.'],
    [2,750,'Rechnung','Welcher Betrag steht auf der Rechnung?','Montant total : sept cent cinquante francs.'],
    [3,1090,'Im Fanshop','Wie viele Schals sind noch da?','Il reste mille quatre-vingt-dix écharpes.'],
    [3,6020,'Gemeinde','Wie viele Menschen wohnen im Ort?','La commune compte six mille vingt habitants.'],
    [3,31004,'Wanderaktion','Wie viele Schritte stehen auf dem Display?','Trente et un mille quatre pas.'],
    [3,80003,'Crowdfunding','Wie viele Franken sind eingegangen?','Le projet a reçu quatre-vingt mille trois francs.'],
    [3,204900,'Ausstellung','Wie viele Besuchende nennt die Meldung?','L’exposition a accueilli deux cent quatre mille neuf cents visiteurs.'],
    [3,705050,'Bibliothek','Wie viele ausgeliehene Bücher nennt der Bericht?','Le rapport indique sept cent cinq mille cinquante livres empruntés.']
  ];
  for (const [level,n,title,prompt,stimulus] of reading) {
    add('lesen-'+n,level,'input',title,prompt+' Geben Sie die Zahl in Ziffern ein.',digitAnswers(n),'G1',
      {stimulus,hint:hint(n),explain:reason(n)});
  }

  // Die Reihenfolge der Antwortoptionen ist bewusst gemischt.
  const choices = [
    [1,'ticket','Falsches Billett?','Auf dem Billett steht «seize francs». Welchen Betrag zahlen Sie?','seize francs',['60','16','6'],'16','«Seize» und «soixante» klingen am Anfang ähnlich.','Seize = 16. Für 60 steht «soixante».','G1'],
    [1,'places','Welche Gruppe ist grösser?','Wählen Sie den Ort mit mehr freien Plätzen.','Salle A : vingt-huit places. Salle B : trente-deux places.',['Salle A','Gleich viele','Salle B'],'Salle B','Vergleichen Sie zuerst die Zehner.','Salle B hat 32 freie Plätze, Salle A hat 28.','G1'],
    [1,'et21','Wort für Wort','Welche Schreibweise passt zur abgebildeten Zahl?','21',['vingt-un','vingt et un','vingt et onze'],'vingt et un','Bei 21 verbindet ein kurzes Wort den Zehner mit der Eins.','Im Kurs schreiben wir «vingt et un». Auch die Schreibung «vingt-et-un» ist korrekt.','G2'],
    [1,'queue','Anstehen','Welche aufgelegte Nummer kommt als Nächstes?','dix-sept → dix-huit → …',['vingt','dix-neuf','seize'],'dix-neuf','Zählen Sie vom letzten Wert einen Schritt weiter.','17, 18, 19 heisst «dix-sept, dix-huit, dix-neuf».','G1'],
    [1,'trente','Hinter der Kasse','Welche Quittung stimmt mit «quarante-deux francs» überein?','quarante-deux francs',['24 francs','40 francs','42 francs'],'42 francs','Welcher Teil von «quarante-deux» nennt den Zehner?','«Quarante» heisst 40, «deux» ergibt die zwei zusätzlichen Franken.','G1'],
    [1,'ordre','Von klein nach gross','Welche Liste steigt von links nach rechts?','',['douze · vingt · dix-sept','dix-sept · douze · vingt','douze · dix-sept · vingt'],'douze · dix-sept · vingt','Übersetzen Sie die drei Wörter kurz in Ziffern.','Die Werte in aufsteigender Reihenfolge sind 12, 17 und 20.','G1'],
    [2,'contraste','Fehlbestellung','Bestellt sind «soixante-douze affiches». Welches Paket nehmen Sie?','',['62 affiches','82 affiches','72 affiches'],'72 affiches','Welchen Wert hat «douze» zusätzlich zu 60?','60 + 12 = 72. Für 62 würde man «soixante-deux» sagen.','G1'],
    [2,'vingts','Fehler finden','Welche Beschriftung für 84 ist korrekt?','84',['quatre-vingt-quatre','quatre-vingts-quatre','quatre-vingt et quatre'],'quatre-vingt-quatre','Prüfen Sie das s an «vingt», wenn danach noch eine Zahl folgt.','In «quatre-vingt-quatre» folgt nach «vingt» noch «quatre». Das s entfällt.','G2'],
    [2,'91vs81','Vor dem Gebäude','Sie suchen Haus 91. Welche Aufschrift passt?','91',['quatre-vingt-un','quatre-vingt-onze','soixante et onze'],'quatre-vingt-onze','Ist der Rest nach 80 eins oder elf?','91 = 80 + 11. 81 heisst «quatre-vingt-un».','G1'],
    [2,'cent','Preisetikett','Welche Schreibweise gehört auf das Etikett für 205 Franken?','205 francs',['deux cents cinq francs','deux cent cinq francs','deux cent cinquante francs'],'deux cent cinq francs','Achten Sie auf die Zahl hinter «cent».','Weil «cinq» folgt, bleibt «cent» ohne s. 250 wäre «deux cent cinquante».','G2'],
    [2,'logo','Hundert genau','Wie schreiben Sie die Zahl 100?','100',['un cents','cent','cents'],'cent','Hundert allein ist im Französischen ein einziges Zahlwort.','100 heisst «cent». Für 200 steht «deux cents».','G2'],
    [2,'cheap','Der günstigere Kurs','Welcher Tanzkurs kostet weniger?','Lundi : quatre-vingt-treize francs. Jeudi : quatre-vingt-sept francs.',['Lundi','Beide gleich','Jeudi'],'Jeudi','Beide Preise beginnen mit 80. Vergleichen Sie den Rest.','Am Donnerstag kostet der Kurs 87 Franken, am Montag 93 Franken.','G1'],
    [2,'et71','Siebziger','Welche Zahl enthält beim Sprechen ein «et»?','',['72','71','70'],'71','Sprechen Sie die Zahlen nacheinander langsam aus.','Man sagt «soixante et onze» für 71, «soixante-douze» für 72 und «soixante-dix» für 70.','G2'],
    [2,'tableau','Vor und nach 80','Welches Zahlwort ergänzt die Folge?','soixante-dix-neuf → … → quatre-vingt-un',['quatre-vingt-dix','soixante-dix','quatre-vingts'],'quatre-vingts','Die Lücke liegt direkt zwischen 79 und 81.','Bei 80 allein trägt «quatre-vingts» am Ende ein s.','G2'],
    [3,'groupes','Wo steht die Null?','Welcher Eintrag entspricht «cinquante-trois mille quatorze»?','',['53’140','530’014','53’014'],'53’014','Der Block rechts von «mille» hat in Ziffern immer drei Stellen.','14 wird rechts als 014 geschrieben. Die beiden Blöcke sind 53 | 014.','G1'],
    [3,'stock','Lagervergleich','Welcher Standort hat mehr Hefte?','Berne : onze mille quatre-vingts. Bienne : onze mille huit cents.',['Berne','Bienne','Gleich viele'],'Bienne','Die Tausendergruppe ist an beiden Standorten gleich.','Bienne hat 11’800 Hefte, Bern hat 11’080. Vergleichen Sie 800 und 080.','G1'],
    [3,'mille','Tausend genau','Welche Form passt auf das Schild?','3’000 entrées',['trois milles entrées','trois millions entrées','trois mille entrées'],'trois mille entrées','«Mille» ist als Zahlwort unveränderlich.','Für 3’000 steht «trois mille». «Mille» hat auch nach «trois» kein s.','G2'],
    [3,'centmille','Hundert vor tausend','Welche Schreibweise ergibt 400’000?','400’000',['quatre cents mille','quatre cent mille','quatre cent quatre mille'],'quatre cent mille','Achten Sie auf das Wort, das hinter «cent» folgt.','Vor «mille» bleibt «cent» ohne s. Für 400 allein steht «quatre cents».','G2'],
    [3,'80mille','Achtzig vor tausend','Welche Form ist für 80’004 korrekt?','80’004',['quatre-vingt mille quatre','quatre-vingts mille quatre','quatre-vingt-quatre mille'],'quatre-vingt mille quatre','Vergleichen Sie die Position von «vingt» vor «mille» mit 80 allein.','Man schreibt «quatre-vingts» für 80, aber «quatre-vingt mille quatre» für 80’004.','G2'],
    [3,'million','Die Millionengrenze','Welche Meldung erreicht genau eine Million?','',['cent mille visiteurs','dix mille visiteurs','un million de visiteurs'],'un million de visiteurs','Eine Million ist tausendmal tausend.','«Un million» steht für 1’000’000, «cent mille» für 100’000 und «dix mille» für 10’000.','G1'],
    [3,'reste','Missverständnis aufklären','Der Betrag ist 405’030 Franken. Welche Rückfrage bestätigt ihn?','405’030 francs',['Vous avez dit quatre cent cinquante mille trois francs ?','Vous avez dit quatre cent cinq mille trente francs ?','Vous avez dit quatre cent cinq mille trois cents francs ?'],'Vous avez dit quatre cent cinq mille trente francs ?','Lesen Sie die beiden Blöcke 405 und 030 getrennt.','405 | 030 ergibt «quatre cent cinq mille trente». 030 ist dreissig, 300 ist dreihundert.','G1'],
    [3,'estimer','Den Zahlenbereich erkennen','In welchem Bereich liegt das Ergebnis des Festivals?','deux cent un mille quatre-vingt-douze entrées',['20’000 bis 29’999','200’000 bis 209’999','210’000 bis 219’999'],'200’000 bis 209’999','«Mille» trennt die Anzahl der Tausender vom kleineren Rest.','Das Festival zählt 201’092 Eintritte. Die Zahl liegt zwischen 200’000 und 209’999.','G1']
  ];
  for (const [level,id,title,prompt,stimulus,options,answer,help,explain,goal] of choices) {
    add('wahl-'+id,level,'choice',title,prompt,[answer],goal,{stimulus,options,hint:help,explain});
  }

  const orders = [
    [1,22,['vingt','deux']],[1,38,['trente','huit']],[1,47,['quarante','sept']],
    [1,51,['cinquante','et','un']],[1,63,['soixante','trois']],
    [2,72,['soixante','douze']],[2,74,['soixante','quatorze']],[2,89,['quatre','vingt','neuf']],
    [2,93,['quatre','vingt','treize']],[2,218,['deux','cent','dix-huit']],
    [2,574,['cinq','cent','soixante','quatorze']],
    [3,1005,['mille','cinq']],[3,6300,['six','mille','trois','cents']],
    [3,17509,['dix-sept','mille','cinq','cent','neuf']],
    [3,60214,['soixante','mille','deux','cent','quatorze']],
    [3,180040,['cent','quatre-vingt','mille','quarante']],
    [3,720006,['sept','cent','vingt','mille','six']]
  ];
  for (const [level,n,parts] of orders) {
    // Rotate the display so no order task starts solved, including two-piece forms.
    const pivot = Math.max(1, Math.floor(parts.length / 2));
    const tokens = parts.slice(pivot).concat(parts.slice(0,pivot));
    add('bau-'+n,level,'order','Zahlwort zusammensetzen','Tippen Sie die Wortteile in der Reihenfolge an, in der Sie die Zahl sagen.',
      [...new Set([words(n),parts.join(' '),...spelling(n)])],'G2',
      {stimulus:format(n),tokens,hint:hint(n),explain:reason(n)});
  }
  globalThis.W47Numbers = tasks;
})();
