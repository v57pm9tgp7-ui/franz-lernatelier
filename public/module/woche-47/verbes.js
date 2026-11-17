/* Individual present-tense retrieval, separate from the paper assessment. */
(() => {
  'use strict';

  const exercises = [];
  function exercise(id, level, kind, title, prompt, content) {
    exercises.push({ id: 'v47-' + id, goal: 'G0', level, kind, title, prompt, ...content });
  }

  // A complete example sentence is revealed only after the learner answers.
  const gaps = [
    ['etre', 1, 'être', 'sein', 'Nous … en avance.', 'sommes', 'Bei être haben nous und vous verschiedene Stämme.', 'Nous sommes en avance. Wir sind zu früh da.'],
    ['avoir', 1, 'avoir', 'haben', 'Le théâtre … deux entrées.', 'a', 'Le théâtre entspricht il. Denken Sie an die kurze Form von avoir.', 'Le théâtre a deux entrées. Die 3. Person Singular von avoir lautet a.'],
    ['faire', 2, 'faire', 'machen', 'Mes cousins … un dessin.', 'font', 'Mes cousins steht im Plural. Wie lautet faire mit ils?', 'Mes cousins font un dessin. Die Mehrzahlform font hat nur eine Silbe.'],
    ['aller', 2, 'aller', 'gehen oder fahren', 'Mon frère et moi … à la répétition.', 'allons', 'Die sprechende Person gehört zur Gruppe. Ersetzen Sie die Gruppe durch nous.', 'Mon frère et moi allons à la répétition. Hier bedeutet mon frère et moi dasselbe wie nous.'],
    ['venir', 2, 'venir', 'kommen', 'Vous … avec votre classe ?', 'venez', 'Nehmen Sie für vous den Stamm ven-.', 'Vous venez avec votre classe ? In der vous-Form steht ven- mit der Endung -ez.'],
    ['aimer', 1, 'aimer', 'mögen oder lieben', 'Les deux sœurs … les BD.', 'aiment', 'Les deux sœurs entspricht elles. Die Endung ist beim Sprechen stumm.', 'Les deux sœurs aiment les BD. Die stumme Endung -ent zeigt hier den Plural.'],
    ['jouer', 1, 'jouer', 'spielen', 'Je … du piano le vendredi.', 'joue', 'Das Verb gehört zur regelmässigen -er-Gruppe. Entfernen Sie -er.', 'Je joue du piano le vendredi. Der Stamm jou- erhält bei je ein -e.'],
    ['mettre', 3, 'mettre', 'legen, stellen oder anziehen', 'Les visiteurs … leurs manteaux ici.', 'mettent', 'Die Pluralformen von mettre enthalten zwei t.', 'Les visiteurs mettent leurs manteaux ici. Bei ils/elles folgt auf mett- die Endung -ent.'],
    ['prendre', 2, 'prendre', 'nehmen', 'Vous … un raccourci.', 'prenez', 'Bei nous und vous verschwindet das d aus prendre.', 'Vous prenez un raccourci. Die vous-Form besteht aus pren- und -ez.'],
    ['vouloir', 2, 'vouloir', 'wollen', 'Tu … garder cette place ?', 'veux', 'Die Endung der tu-Form ist bei diesem Verb ein x.', 'Tu veux garder cette place ? Je veux und tu veux werden gleich geschrieben.'],
    ['pouvoir', 2, 'pouvoir', 'können oder dürfen', 'Les enfants … rester ici.', 'peuvent', 'Les enfants entspricht ils. Der Stamm im Plural der 3. Person beginnt mit peuv-.', 'Les enfants peuvent rester ici. Zur Form peuvent gehören eu, v und die Pluralendung -ent.'],
    ['devoir', 2, 'devoir', 'müssen', 'Je … téléphoner à Léa.', 'dois', 'Bei je und tu hat devoir denselben Stamm wie bei il, aber eine andere Endung.', 'Je dois téléphoner à Léa. Je dois und tu dois enden auf -s, il doit auf -t.'],
    ['savoir', 2, 'savoir', 'wissen oder etwas beherrschen', 'Tu … jongler avec trois balles ?', 'sais', 'Bei einer erlernten Fähigkeit steht savoir vor dem Infinitiv.', 'Tu sais jongler avec trois balles ? Hier geht es um eine erlernte Fähigkeit.'],
    ['dire', 2, 'dire', 'sagen', 'Nous … au revoir à Zoé.', 'disons', 'Der Stamm für nous beginnt mit dis-.', 'Nous disons au revoir à Zoé. Die Form lautet disons mit einem s zwischen i und o.'],
    ['voir', 2, 'voir', 'sehen', 'Nous … le lac depuis le train.', 'voyons', 'Der Stamm wechselt bei nous und vous zu voy-.', 'Nous voyons le lac depuis le train. Vor -ons steht ein y.'],
    ['donner', 1, 'donner', 'geben', 'Vous … un conseil à Luc.', 'donnez', 'Donner ist ein regelmässiges -er-Verb. Behalten Sie beide n.', 'Vous donnez un conseil à Luc. Der Stamm donn- erhält die Endung -ez.'],
    ['parler', 1, 'parler', 'sprechen', 'Mila … allemand avec son père.', 'parle', 'Ersetzen Sie Mila durch elle.', 'Mila parle allemand avec son père. In der 3. Person Singular endet parler auf -e.'],
    ['finir', 2, 'finir', 'beenden', 'La musicienne … son concert à dix heures.', 'finit', 'La musicienne entspricht elle. Bei je und tu steht hier -is, bei elle eine andere Endung.', 'La musicienne finit son concert à dix heures. Die Endung bei elle lautet -it.'],
    ['sortir', 2, 'sortir', 'hinausgehen', 'Vous … du musée à midi.', 'sortez', 'Im Plural verwendet sortir den Stamm sort-.', 'Vous sortez du musée à midi. Die vous-Form endet auf -ez.'],
    ['ecrire', 2, 'écrire', 'schreiben', 'Tu … un courriel au club.', 'écris', 'Bei je und tu endet das Verb auf -s.', 'Tu écris un courriel au club. Die Form bei il/elle lautet dagegen écrit.'],
    ['lire', 1, 'lire', 'lesen', 'On … une affiche dans la rue.', 'lit', 'On verwendet immer die gleiche Verbform wie il oder elle.', 'On lit une affiche dans la rue. Bei on endet lire im Singular auf -t.'],
    ['acheter', 2, 'acheter', 'kaufen', 'Nous … des timbres à la poste.', 'achetons', 'Vergleichen Sie elle achète mit der nous-Form. Wo hören Sie das betonte è?', 'Nous achetons des timbres à la poste. Bei nous und vous schreibt man acheter ohne accent grave.'],
    ['ouvrir', 2, 'ouvrir', 'öffnen', 'Tu … ton courrier après le cours.', 'ouvres', 'Die Endungen von ouvrir gleichen im présent denen eines -er-Verbs.', 'Tu ouvres ton courrier après le cours. Auf den Stamm ouvr- folgt bei tu die Endung -es.'],
    ['manger', 2, 'manger', 'essen', 'On … dehors aujourd’hui.', 'mange', 'On verwendet die Form der 3. Person Singular.', 'On mange dehors aujourd’hui. Bei on endet das Verb auf -e.'],
    ['comprendre', 3, 'comprendre', 'verstehen', 'Tes amis … le panneau.', 'comprennent', 'Tes amis entspricht ils. Denken Sie beim Plural von prendre an das doppelte n.', 'Tes amis comprennent le panneau. In der 3. Person Plural hat comprennent zwei n hintereinander.']
  ];

  gaps.forEach(([id, level, verb, meaning, stimulus, form, hint, explain]) => {
    exercise('luecke-' + id, level, 'input', 'Ein Verb im Satz',
      'Setzen Sie ' + verb + ' («' + meaning + '») ins présent. Schreiben Sie die fehlende Verbform.',
      { stimulus, answers: [form], hint, explain });
  });

  const switches = [
    ['lire', 'Tu lis ces pages. → Paul et moi … ces pages.', 'lisons', 'Paul et moi steht für nous. Der Pluralstamm von lire ist lis-.', 'Paul et moi lisons ces pages.'],
    ['acheter', 'Vous achetez un vélo. → Elle … un vélo.', 'achète', 'Bei elle trägt das zweite e einen accent grave.', 'Elle achète un vélo. Das è ist im Singular von acheter hörbar.'],
    ['ouvrir', 'Elle ouvre le cadeau. → Vous … le cadeau.', 'ouvrez', 'Die vous-Form behält den Stamm ouvr-.', 'Vous ouvrez le cadeau. Auf ouvr- folgt die Endung -ez.'],
    ['manger', 'Il mange à la gare. → Lina et moi … à la gare.', 'mangeons', 'Vor der Endung -ons braucht es einen zusätzlichen Buchstaben, damit das g weich bleibt.', 'Lina et moi mangeons à la gare. Das e sichert die weiche Aussprache des g.'],
    ['comprendre', 'Elles comprennent le jeu. → Tu … le jeu.', 'comprends', 'Im Singular bleibt das d von comprendre stehen. Welche Endung gehört zu tu?', 'Tu comprends le jeu. Die tu-Form endet auf -ds.'],
    ['venir', 'Je viens à pied. → Les élèves … à pied.', 'viennent', 'Die 3. Person Plural wechselt zu vienn-.', 'Les élèves viennent à pied. Viennent hat zwei n.']
  ];
  switches.forEach(([id, stimulus, form, hint, explain]) => {
    exercise('wechsel-' + id, 2, 'input', 'Die Person wechselt',
      'Im zweiten Satz ändert sich das Subjekt. Schreiben Sie die neue Verbform.',
      { stimulus, answers: [form], hint, explain });
  });

  const corrections = [
    ['lire', 'Lina et Ilan lisent la carte. → Je lises la carte.', 'lis', 'Das zweite Subjekt ist je. Bei lire ist die Singularform kürzer als die Pluralform.', 'Je lis la carte. Bei je und tu lautet die Form lis.'],
    ['acheter', 'J’achete une baguette.', 'achète', 'Auf welchem e hören Sie beim Sprechen ein offenes «è»?', 'J’achète une baguette. Das erste e nach dem h trägt den accent grave.'],
    ['ouvrir', 'La salle ouvrit à neuf heures.', 'ouvre', 'Gesucht ist das présent. «La salle» entspricht elle.', 'La salle ouvre à neuf heures. Die Präsensendung bei elle ist -e.'],
    ['manger', 'Nous mangons avec Sara.', 'mangeons', 'Achten Sie darauf, wie das g vor -ons ausgesprochen würde.', 'Nous mangeons avec Sara. Das eingeschobene e hält das g weich.'],
    ['comprendre', 'Vous comprendez ces symboles.', 'comprenez', 'Bei der vous-Form von prendre und comprendre entfällt das d.', 'Vous comprenez ces symboles. Die Verbform endet auf -prenez.']
  ];
  corrections.forEach(([id, stimulus, form, hint, explain]) => {
    exercise('korrektur-' + id, 3, 'input', 'Eine Form verbessern',
      'Die letzte Verbform passt so nicht ins présent. Schreiben Sie nur die richtige Form.',
      { stimulus, answers: [form], hint, explain });
  });

  const words = [
    ['apprendre', 'Welches Verb bedeutet hier «können», weil jemand etwas gelernt hat?', 'Nina … lire la musique. Elle a appris à l’école.', ['doit','sait','veut'], 'sait', 'Der zweite Satz nennt eine erlernte Fähigkeit.', 'Nina sait lire la musique. Savoir + Infinitiv drückt eine erlernte Fähigkeit aus.'],
    ['permission', 'Welches Verb drückt hier die Erlaubnis aus?', 'Vous avez l’autorisation. Vous … entrer.', ['savez','devez','pouvez'], 'pouvez', 'Mit welchem Verb bitten Sie um Erlaubnis?', 'Vous pouvez entrer. Pouvoir + Infinitiv drückt hier eine Erlaubnis aus.'],
    ['ouvrir', 'Welcher französische Infinitiv passt zur Handlung?', 'den Schrank öffnen', ['ouvrir','sortir','finir'], 'ouvrir', 'Die Handlung betrifft die Schranktür.', 'Ouvrir bedeutet öffnen. «Den Schrank öffnen» heisst ouvrir l’armoire.'],
    ['lire', 'Welcher französische Infinitiv passt zur Handlung?', 'eine Speisekarte lesen', ['dire','écrire','lire'], 'lire', 'Sie möchten erfahren, was auf der Karte steht.', 'Lire bedeutet lesen. «Eine Speisekarte lesen» heisst lire un menu.'],
    ['acheter', 'Welche Handlung beschreibt der Satz?', 'J’achète un casque pour mon vélo.', ['Ich gebe einen Helm ab.','Ich kaufe einen Helm.','Ich suche einen Helm.'], 'Ich kaufe einen Helm.', 'Der Infinitiv im Satz ist acheter.', 'Acheter bedeutet kaufen. Un casque ist ein Helm.'],
    ['comprendre', 'Welche Handlung beschreibt der Satz?', 'Nous comprenons les règles du tournoi.', ['Wir erklären die Regeln.','Wir schreiben die Regeln.','Wir verstehen die Regeln.'], 'Wir verstehen die Regeln.', 'Die Form comprenons gehört zum Verb comprendre.', 'Comprendre bedeutet verstehen. Nous comprenons heisst wir verstehen.']
  ];
  words.forEach(([id, prompt, stimulus, options, form, hint, explain]) => {
    exercise('bedeutung-' + id, 1, 'choice', 'Die Bedeutung erkennen',
      prompt, { stimulus, options, answers: [form], hint, explain });
  });

  const sentences = [
    ['lire', ['Nous','lisons','un','article'], 'Wir lesen einen Artikel.', 'Bei nous braucht lire die Endung -ons.', 'Nous lisons un article. Lisons ist die nous-Form von lire.'],
    ['manger', ['Elles','mangent','une','salade'], 'Sie (die beiden Mädchen) essen einen Salat.', 'Das Subjekt steht vor dem Verb. Die beiden Mädchen entsprechen elles.', 'Elles mangent une salade. Die geschriebene Endung -ent bleibt stumm.'],
    ['ouvrir', ['Il','ouvre','son','sac'], 'Er öffnet seine Tasche.', 'Beginnen Sie mit dem Subjekt. Bei il lautet die Endung von ouvrir -e.', 'Il ouvre son sac. Son richtet sich nach dem maskulinen Nomen sac.']
  ];
  sentences.forEach(([id, parts, stimulus, hint, explain]) => {
    const tokens = [parts[2], parts[0], parts[3], parts[1]];
    exercise('satz-' + id, 1, 'order', 'Satzbausteine ordnen',
      'Bilden Sie mit allen Bausteinen den französischen Satz.', { stimulus, tokens, answers: [parts.join(' ')], hint, explain });
  });

  globalThis.W47Verbs = exercises;
})();
