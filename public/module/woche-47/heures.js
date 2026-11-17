/* Französisch A2 – Woche 47. Uhrzeiten, mit drei Schwierigkeitsstufen. */
(() => {
  'use strict';

  const exercises = [];
  const add = (id, level, kind, goal, title, prompt, details) => {
    exercises.push({ id: 'zeit-' + id, level, kind, goal, title, prompt, ...details });
  };
  const unique = values => [...new Set(values)];
  const digitAnswers = value => {
    const [hh, mm] = value.split(':');
    const h = String(Number(hh));
    return unique([value, h + ':' + mm, hh + ' h ' + mm, h + ' h ' + mm,
      hh + 'h' + mm, h + 'h' + mm, hh + '.' + mm, h + '.' + mm,
      hh + mm, ...(mm === '00' ? [h + ' h', h + 'h'] : [])]);
  };
  const wording = phrases => unique(phrases.flatMap(phrase => [
    phrase, 'Il est ' + phrase, 'Il est ' + phrase + '.', phrase + '.'
  ]));
  const cardinals = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept',
    'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
    'dix-sept', 'dix-huit', 'dix-neuf'];
  function numberWord(value, feminine = false) {
    if (value === 1 && feminine) return 'une';
    if (value < 20) return cardinals[value];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante'][Math.floor(value / 10)];
    const ones = value % 10;
    if (!ones) return tens;
    if (ones === 1) return tens + ' et ' + (feminine ? 'une' : 'un');
    return tens + '-' + cardinals[ones];
  }
  function timetable(value) {
    const [h, m] = value.split(':').map(Number);
    return numberWord(h, true) + (h <= 1 ? ' heure' : ' heures') +
      (m ? ' ' + numberWord(m, true) : '');
  }
  function writtenTimeAnswers(value) {
    const [h, m] = value.split(':').map(Number);
    const result = [timetable(value)];
    if (m) result.push(timetable(value) + (m === 1 ? ' minute' : ' minutes'));
    // In spoken timetable announcements, early minutes can also be given digit by digit.
    if (m > 0 && m < 10) result.push(numberWord(h, true) + (h <= 1 ? ' heure' : ' heures') + ' zéro ' + numberWord(m, true));
    return wording(result);
  }

  // The daypart resolves the twelve-hour ambiguity of an analogue clock.
  const dials = [
    ['07:00', 'am Morgen'], ['09:20', 'am Vormittag'], ['16:25', 'am Nachmittag'],
    ['18:00', 'am Abend'], ['10:15', 'am Vormittag'], ['05:30', 'am frühen Morgen'],
    ['13:40', 'am frühen Nachmittag'], ['19:50', 'am Abend'], ['08:35', 'am Morgen'],
    ['22:05', 'am späten Abend'], ['03:45', 'mitten in der Nacht'], ['15:55', 'am Nachmittag'],
    ['23:58', 'kurz vor Mitternacht'], ['00:02', 'kurz nach Mitternacht'], ['20:42', 'am Abend'],
    ['11:53', 'kurz vor Mittag'], ['17:47', 'am späten Nachmittag'], ['01:09', 'nachts']
  ];
  dials.forEach(([value, daypart], i) => {
    const [h, m] = value.split(':').map(Number);
    const hour12 = h % 12 || 12;
    const minuteHint = m % 5 === 0 ? 'Jeder Abstand von einer Zahl zur nächsten entspricht fünf Minuten.'
      : 'Zählen Sie nach der letzten Fünfermarke die kleinen Minutenstriche weiter.';
    add('uhr-' + (i + 1), 1 + Math.floor(i / 6), 'input', 'G3', 'Das Zifferblatt lesen',
      'Sie schauen ' + daypart + ' auf die Uhr. Wie lautet die Zeit auf dem digitalen Display? Schreiben Sie Stunden und Minuten.', {
        clock: value, answers: digitAnswers(value),
        hint: 'Der kurze Zeiger zeigt die Stunde, der lange die Minuten. ' + minuteHint,
        explain: 'Auf dem Zifferblatt lesen Sie ' + hour12 + ' Uhr und ' + m +
          ' Minuten. ' + 'Zur angegebenen Tageszeit zeigt das Display ' + value + '.'
      });
  });

  const announcements = [
    [1, 'Le film commence à neuf heures et quart du matin.', '09:15', 'Wann beginnt die Schulvorstellung?', 'Et quart bedeutet eine Viertelstunde nach der vollen Stunde.'],
    [1, 'Le rendez-vous est à cinq heures et demie du soir.', '17:30', 'Wann findet der Termin statt?', 'Du soir macht aus fünf Uhr am Nachmittag oder Abend 17 Uhr.'],
    [1, 'La bibliothèque ouvre à huit heures dix du matin.', '08:10', 'Wann öffnet die Bibliothek?', 'Hören Sie nach heures auf die Minutenzahl.'],
    [1, 'Le bus pour Bienne part à quatorze heures vingt.', '14:20', 'Welche Abfahrtszeit tragen Sie ein?', 'Quatorze heures ist bereits die 24-Stunden-Form.'],
    [1, 'Le cours se termine à dix heures et demie du matin.', '10:30', 'Wann endet der Kurs?', 'Une demi-heure dauert dreissig Minuten.'],
    [1, 'Le magasin ferme à sept heures du soir.', '19:00', 'Welche Ladenschlusszeit hören Sie?', 'Die Angabe du soir bestimmt die Tageshälfte.'],
    [2, 'Votre train arrive à dix-huit heures trente-sept.', '18:37', 'Wann kommt der Zug an?', 'Nach dix-huit heures folgt die vollständige Minutenzahl.'],
    [2, 'La permanence ouvre à deux heures moins le quart de l’après-midi.', '13:45', 'Wann öffnet die Beratungsstelle?', 'Gehen Sie von 14 Uhr eine Viertelstunde zurück.'],
    [2, 'Le dernier tram part à onze heures moins dix du soir.', '22:50', 'Wann fährt das letzte Tram?', 'Gehen Sie von der genannten nächsten Stunde zehn Minuten zurück.'],
    [2, 'Le prochain départ est à midi vingt-cinq.', '12:25', 'Welche Abfahrt hören Sie?', 'Midi ist der Mittag. Die folgende Zahl bezeichnet die Minuten.'],
    [2, 'Le match commence à vingt et une heures cinq.', '21:05', 'Wann beginnt das Spiel?', 'Une gehört hier zur Stunde. Erst nach heures werden die Minuten genannt.'],
    [2, 'Le portail ferme à six heures moins vingt du soir.', '17:40', 'Wann schliesst das Tor?', 'Die volle Stunde wäre am Abend 18 Uhr. Rechnen Sie zwanzig Minuten zurück.'],
    [3, 'Le départ était prévu à dix-sept heures dix. Il est reporté à dix-sept heures vingt-huit.', '17:28', 'Wann fährt das Schiff laut der Änderung tatsächlich ab?', 'Reporté à kündigt die neue Zeit an.'],
    [3, 'Les portes ouvrent à dix-huit heures. La séance commence à dix-huit heures cinquante-deux.', '18:52', 'Wann beginnt die Vorstellung?', 'Unterscheiden Sie Türöffnung und Beginn der Vorstellung.'],
    [3, 'Il y a deux navettes, à vingt-trois heures trente et à minuit vingt. Prenez la deuxième.', '00:20', 'Wann fährt Ihre Navette?', 'La deuxième ist die zweite Fahrt. Minuit markiert den Tageswechsel.'],
    [3, 'Le lundi, le bureau ouvre à huit heures. Le mardi, il ouvre à huit heures quarante-deux.', '08:42', 'Wann öffnet das Büro am Dienstag?', 'Achten Sie auf die Zeit direkt nach le mardi.'],
    [3, 'Rendez-vous à midi moins vingt. Le repas est servi à midi et demi.', '11:40', 'Wann sollen Sie zum Treffen erscheinen?', 'Gefragt ist das Treffen vor dem Essen.'],
    [3, 'Notre train arrive à vingt heures quarante, voie trois. La correspondance part à vingt heures cinquante-six.', '20:56', 'Wann fährt Ihr Anschlusszug?', 'La correspondance ist der Anschluss. Voie bezeichnet das Gleis.']
  ];
  announcements.forEach(([level, speech, value, question, hint], i) => {
    add('hoeren-' + (i + 1), level, 'listen', 'G3', 'Eine Ansage verstehen',
      question + ' Antworten Sie im 24-Stunden-Format.', {
        speech, answers: digitAnswers(value), hint,
        explain: 'Gesucht ist ' + value + '. In der Ansage hören Sie «' + speech + '»'
      });
  });

  const notes = [
    [1, 'Je passe à quatre heures et quart de l’après-midi.', '16:15', 'Wann kommt die Person vorbei?', 'Vier Uhr am Nachmittag ist 16 Uhr.'],
    [1, 'Répétition à onze heures vingt du matin.', '11:20', 'Wann beginnt die Probe?', 'Die Stundenangabe bleibt am Vormittag gleich.'],
    [1, 'On commence à une heure et demie de l’après-midi.', '13:30', 'Wann geht es los?', 'Une heure de l’après-midi ist 13 Uhr.'],
    [1, 'Le téléphone sonne à six heures cinq du matin.', '06:05', 'Wann klingelt das Telefon?', 'Schreiben Sie bei fünf Minuten eine Null vor die 5.'],
    [2, 'Le magasin ferme à midi moins le quart.', '11:45', 'Wann ist Ladenschluss?', 'Beim Abziehen vor Mittag bleiben Sie im Vormittag.'],
    [2, 'La rencontre commence à huit heures moins vingt du soir.', '19:40', 'Wann beginnt das Treffen?', 'Die nächste volle Stunde wäre 20 Uhr.'],
    [2, 'Les inscriptions commencent à seize heures cinquante-trois.', '16:53', 'Wann beginnt die Anmeldung?', 'Cinquante-trois ist die Minutenangabe.'],
    [2, 'Le minibus part à minuit trente-cinq.', '00:35', 'Wann fährt der Kleinbus?', 'Nach minuit beginnt der neue Tag.'],
    [3, 'On ferme à dix-huit heures vingt, mais il faut entrer avant dix-huit heures douze.', '18:12', 'Welche Zeit nennt der Text als Grenze für den Einlass?', 'Il faut entrer avant führt die gesuchte Grenze ein.'],
    [3, 'Le festival ouvre à neuf heures du matin. L’atelier de danse débute à onze heures moins vingt-cinq.', '10:35', 'Wann beginnt der Tanzworkshop am Vormittag?', '«Débute» bezeichnet den Beginn. Von elf Uhr gehen Sie 25 Minuten zurück.'],
    [3, 'Le vol de nuit arrive à une heure moins cinq du matin.', '00:55', 'Wann landet der Nachtflug?', 'Fünf Minuten vor der ersten vollen Stunde des neuen Tages ist es noch null Uhr.'],
    [3, 'Vendredi, le kiosque ferme à dix-neuf heures. Samedi, il ferme un quart d’heure plus tôt.', '18:45', 'Wann schliesst der Kiosk am Samstag?', 'Plus tôt bedeutet früher. Ziehen Sie vom Freitag eine Viertelstunde ab.']
  ];
  notes.forEach(([level, stimulus, value, question, hint], i) => {
    add('lesen-' + (i + 1), level, 'input', 'G3', 'Eine Nachricht auswerten',
      question + ' Schreiben Sie die Digitalzeit.', {
        stimulus, answers: digitAnswers(value), hint, explain: hint + ' Die passende Anzeige lautet ' + value + '.'
      });
  });

  const formalSamples = [
    [1, '07:20', 'Fahrplan einer Schulbuslinie'], [1, '10:05', 'Ankunft eines Ortsbusses'],
    [1, '14:15', 'Abfahrt eines Regionalzugs'], [1, '09:30', 'Start eines Audioguides'],
    [2, '16:38', 'Ankunft eines Schnellzugs'], [2, '20:17', 'Beginn einer Radiosendung'],
    [2, '01:12', 'Abfahrt eines Nachtbusses'], [2, '18:41', 'Beginn eines Konzerts'],
    [3, '21:21', 'Abfahrt eines Abendzugs'], [3, '13:01', 'Anschluss am Bahnhof'],
    [3, '00:31', 'Abfahrt nach Mitternacht'], [3, '22:51', 'Letzte Fahrt einer Seilbahn']
  ];
  formalSamples.forEach(([level, value, context], i) => {
    add('fahrplan-' + (i + 1), level, 'input', 'G4', 'Die Fahrplanzeit ansagen',
      context + '. Schreiben Sie die Zeitangabe vollständig in französischen Wörtern. Lesen Sie zuerst die 24-Stunden-Zahl und dann die Minuten. Verwenden Sie heures oder heure.', {
        stimulus: value, answers: writtenTimeAnswers(value),
        hint: value.startsWith('21') ? 'Heure ist weiblich. Denken Sie an die Endung der Stundenangabe.'
          : 'Beginnen Sie mit der Stunde auf der Anzeige. Lesen Sie die Minuten direkt nach heure oder heures.',
        explain: value + ' heisst in dieser Ansage «' + timetable(value) + '».'
      });
  });

  // Each free-response prompt specifies the target phrase. This makes the requested
  // register clear while accepting common synonym, punctuation and minute variants.
  const everyday = [
    [1,'06:15','Verwenden Sie «et quart» und «du matin».',['six heures et quart du matin'],'Eine Viertelstunde nach sechs Uhr.'],
    [1,'15:30','Verwenden Sie «et demie» und «de l’après-midi».',['trois heures et demie de l’après-midi'],'Nach heures steht die weibliche Form demie.'],
    [1,'22:15','Verwenden Sie «et quart» und «du soir».',['dix heures et quart du soir'],'Ziehen Sie zwölf Stunden ab und ergänzen Sie du soir.'],
    [1,'12:30','Beginnen Sie mit «midi» und verwenden Sie «et demi».',['midi et demi'],'Midi ist männlich, deshalb steht demi ohne e.'],
    [2,'00:15','Beginnen Sie mit «minuit» und verwenden Sie «et quart».',['minuit et quart'],'Die erste Viertelstunde des neuen Tages folgt auf minuit.'],
    [2,'14:45','Verwenden Sie «moins le quart» und «de l’après-midi».',['trois heures moins le quart de l’après-midi'],'Die nächste volle Stunde ist drei Uhr nachmittags.'],
    [2,'07:50','Verwenden Sie «moins» und «du matin».',['huit heures moins dix du matin','huit heures moins dix minutes du matin'],'Zehn Minuten fehlen bis acht Uhr.'],
    [2,'20:30','Verwenden Sie «et demie» und «du soir».',['huit heures et demie du soir'],'Huit heures du soir ist 20 Uhr.'],
    [3,'23:40','Beginnen Sie mit «minuit» und verwenden Sie «moins».',['minuit moins vingt','minuit moins vingt minutes'],'Bis Mitternacht fehlen 20 Minuten.'],
    [3,'11:35','Beginnen Sie mit «midi» und verwenden Sie «moins».',['midi moins vingt-cinq','midi moins vingt-cinq minutes'],'Bis Mittag fehlen 25 Minuten.'],
    [3,'00:45','Verwenden Sie «moins le quart» und «du matin».',['une heure moins le quart du matin'],'Die nächste Stunde heisst une heure.'],
    [3,'21:55','Verwenden Sie «moins» und «du soir».',['dix heures moins cinq du soir','dix heures moins cinq minutes du soir'],'Die nächste volle Stunde im Gespräch ist zehn Uhr abends.']
  ];
  everyday.forEach(([level,value,guide,phrases,hint], i) => {
    add('alltag-' + (i + 1), level, 'input', 'G4', 'Eine Uhrzeit im Gespräch sagen',
      'Schreiben Sie die Uhrzeit so auf, wie Sie sie im Gespräch sagen würden. ' + guide, {
        stimulus:value, answers:wording(phrases), hint, explain:value + ' → «' + phrases[0] + '». ' + hint
      });
  });

  const arrangements = [
    [1,'05:15',['cinq heures','et quart','du matin']],
    [1,'16:30',['quatre heures','et demie','de l’après-midi']],
    [1,'09:25',['neuf heures','vingt-cinq','du matin']],
    [1,'20:10',['huit heures','dix','du soir']],
    [2,'10:45',['onze heures','moins','le quart','du matin']],
    [2,'17:35',['six heures','moins','vingt-cinq','de l’après-midi']],
    [2,'13:20',['une heure','vingt','de l’après-midi']],
    [2,'22:50',['onze heures','moins','dix','du soir']],
    [3,'23:35',['minuit','moins','vingt-cinq']],
    [3,'12:40',['une heure','moins','vingt','de l’après-midi']],
    [3,'00:40',['une heure','moins','vingt','du matin']],
    [3,'11:43',['midi','moins','dix-sept']]
  ];
  arrangements.forEach(([level, value, tokens], i) => {
    const phrase = tokens.join(' ');
    add('bau-' + (i + 1), level, 'order','G4','Eine Zeitangabe zusammensetzen',
      'Setzen Sie die französischen Bausteine zur passenden Zeitangabe zusammen.', {
        stimulus:value, tokens, answers:[phrase],
        hint:tokens.includes('moins') ? 'Beginnen Sie mit der nächsten vollen Stunde. Danach kommen moins und die fehlenden Minuten.'
          : 'Beginnen Sie mit der Stunde. Es folgen die Minuten und gegebenenfalls die Tageszeit.',
        explain:value + ' entspricht «' + phrase + '».'
      });
  });

  const distinctions = [
    [1,'06:45','Welche Aussage passt zum Wecker am Morgen?',['sept heures moins le quart du matin','six heures et quart du matin','sept heures et quart du matin'],'Um 06:45 fehlen fünfzehn Minuten bis sieben.'],
    [1,'16:00','Welche Angabe passt zum Nachmittag?',['quatre heures de l’après-midi','quatre heures du matin','six heures du soir'],'Ziehen Sie im Nachmittagsgespräch zwölf Stunden von 16 ab.'],
    [1,'00:30','Welche Formulierung mit minuit ist richtig geschrieben?',['minuit et demi','minuit et demie','minuit moins demi'],'Minuit ist männlich. Nach minuit heisst es et demi.'],
    [1,'18:30','Welche Formulierung für den Abend ist richtig geschrieben?',['six heures et demie du soir','six heures et demi du soir','six heure et demie du soir'],'Heures steht im Plural und ist weiblich. Deshalb folgt et demie.'],
    [2,'01:15','Welche Zeitangabe ist richtig geschrieben?',['une heure et quart du matin','un heure et quart du matin','une heures et quart du matin'],'Für 1 Uhr verwenden Sie une heure im Singular.'],
    [2,'21:13','Welche Durchsage gibt die Anzeige korrekt wieder?',['vingt et une heures treize','vingt et un heures treize','vingt et une heures trente'],'Heure ist weiblich. Treize sind dreizehn, trente dreissig.'],
    [2,'12:45','Welche Aussage passt zur Mittagszeit?',['une heure moins le quart de l’après-midi','midi moins le quart','une heure et quart de l’après-midi'],'Die nächste volle Stunde ist 13 Uhr.'],
    [2,'03:55','Welche Beschreibung passt zur Nacht?',['quatre heures moins cinq du matin','trois heures cinq du matin','quatre heures cinq du matin'],'Erst fünf Minuten später ist es vier Uhr morgens.'],
    [3,'23:50','Ein Fahrgast sagt «midi moins dix». Welche Änderung ergibt die richtige Zeit?',['minuit moins dix','midi et dix','minuit dix'],'Zehn Minuten vor Mitternacht ist kurz vor dem Ende des Tages.'],
    [3,'13:45','In der Notiz steht «deux heures et quart de l’après-midi». Welche Berichtigung passt?',['deux heures moins le quart de l’après-midi','une heure moins le quart de l’après-midi','deux heures et demie de l’après-midi'],'Die angezeigte Zeit liegt fünfzehn Minuten vor zwei Uhr.'],
    [3,'05:41','Welche vollständige Zeitangabe mit minutes ist korrekt?',['cinq heures quarante et une minutes','cinq heures quarante et un minutes','cinq heures cinquante et une minutes'],'Minute ist weiblich. Bei 41 Minuten schreiben Sie quarante et une minutes.'],
    [3,'00:05','Der Zug fährt kurz nach Mitternacht. Welche Angabe passt?',['minuit cinq','midi cinq','minuit moins cinq'],'Nach Mitternacht werden die fünf Minuten zu minuit hinzugefügt.']
  ];
  distinctions.forEach(([level,stimulus,prompt,options,reason], i) => {
    add('detektiv-' + (i + 1),level,'choice','G4','Die richtige Form finden',prompt,{
      stimulus, options, answers:[options[0]], hint:'Prüfen Sie zuerst Stunde und Minuten, dann Tageszeit und Endungen.',
      explain:reason
    });
  });

  const shifts = [
    [1,'Le cours commence à neuf heures. La salle ouvre quinze minutes avant.','Wann öffnet der Raum?', '08:45','Avant bedeutet früher. Gehen Sie 15 Minuten zurück.'],
    [1,'Le tram part à dix heures dix. Le trajet dure dix minutes.','Wann kommt das Tram an?', '10:20','Addieren Sie die Fahrzeit zur Abfahrt.'],
    [1,'La projection commence à quinze heures. Elle est repoussée de vingt minutes.','Wann beginnt der Film jetzt?', '15:20','Repoussée bedeutet hier nach hinten verschoben.'],
    [2,'Le départ est à seize heures huit. La navette arrive douze minutes avant le départ.','Wann kommt die Navette an?', '15:56','Gehen Sie erst acht Minuten zur vollen Stunde zurück, dann weitere vier.'],
    [2,'Le train quitte Neuchâtel à onze heures quarante-deux. Le trajet dure vingt-six minutes.','Wann kommt der Zug an?', '12:08','Bis Mittag vergehen 18 Minuten. Rechnen Sie den Rest dazu.'],
    [2,'Le spectacle finit à vingt et une heures dix. L’entracte se termine quarante minutes avant la fin.','Wann endet die Pause?', '20:30','Rechnen Sie von der Endzeit des Stücks vierzig Minuten zurück.'],
    [3,'Le dernier bus part à vingt-trois heures trente-huit. Le trajet dure quarante-sept minutes.','Wann kommt der Bus am nächsten Tag an?', '00:25','Rechnen Sie zuerst bis Mitternacht. Von 47 Minuten sind dann noch 25 übrig.'],
    [3,'Le service de nuit commence à minuit vingt-six. Présentez-vous trente-cinq minutes avant.','Wann müssen Sie am Vorabend da sein?', '23:51','Von 00:26 bis Mitternacht sind es 26 Minuten rückwärts. Gehen Sie weitere neun zurück.'],
    [3,'Le spectacle commence à dix-neuf heures douze. La première partie dure trente-sept minutes. La pause dure quinze minutes.','Wann beginnt der zweite Teil?', '20:04','Rechnen Sie zuerst bis zum Ende des ersten Teils und fügen Sie die Pause hinzu.']
  ];
  shifts.forEach(([level,stimulus,question,value,hint], i) => {
    add('plan-' + (i + 1),level,'input','G3','Mit einem Zeitplan arbeiten',
      question + ' Antworten Sie im 24-Stunden-Format.',{
        stimulus, answers:digitAnswers(value), hint, explain:hint + ' Gesucht ist ' + value + '.'
      });
  });
  globalThis.W47Times = exercises;
})();
