/* New short retrieval activities. The graded paper assessment is not part of this site. */
(() => {
 'use strict';
 const verbs=[];
 const add=(id,prompt,stimulus,answer,hint,explain,verb)=>verbs.push({id:'w48v-'+id,goal:'V',kind:'input',title:'Verben verwandeln',prompt,stimulus,answers:[answer],hint,explain,verb});
 const forms=[
 ['être','sein','Tu … prêt pour le film.','es','Nous … devant la caméra.','sommes','être: je suis, tu es, il est, nous sommes, vous êtes, ils sont.'],
 ['avoir','haben','Vous … une bonne idée.','avez','J’… un rôle dans le film.','ai','avoir: j’ai, tu as, il a, nous avons, vous avez, ils ont.'],
 ['faire','machen','Vous … une nouvelle vidéo.','faites','Mes amis … une affiche.','font','Die unregelmässigen Formen sind vous faites und ils font.'],
 ['aller','gehen','Nous … au studio.','allons','Tu … au concert.','vas','aller: je vais, tu vas, il va, nous allons, vous allez, ils vont.'],
 ['venir','kommen','Elle … avec son micro.','vient','Ils … pour la répétition.','viennent','venir: im Singular vien-, bei ils/elles vienn-.'],
 ['aimer','mögen','Vous … cette histoire.','aimez','Mes copines … ce personnage.','aiment','Regelmässige -er-Endungen: -e, -es, -e, -ons, -ez, -ent.'],
 ['jouer','spielen','Nous … deux personnages.','jouons','Tu … dans notre scène.','joues','Der Stamm jou- bleibt erhalten.'],
 ['mettre','legen','Tu … le téléphone ici.','mets','Nous … les photos dans l’ordre.','mettons','mettre: je mets, tu mets, il met, nous mettons, vous mettez, ils mettent.'],
 ['prendre','nehmen','Ils … une photo du décor.','prennent','Nous … le bus ensemble.','prenons','prendre: nous prenons, vous prenez, ils prennent.'],
 ['vouloir','wollen','Elle … un rôle drôle.','veut','Nous … une fin surprise.','voulons','vouloir: je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent.'],
 ['pouvoir','können','Vous … commencer la scène.','pouvez','Je … faire le bruit du vent.','peux','pouvoir: je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent.'],
 ['devoir','müssen','Tu … parler plus fort.','dois','Vous … écouter votre partenaire.','devez','devoir: je dois, tu dois, il doit, nous devons, vous devez, ils doivent.'],
 ['savoir','wissen','Elle … dessiner des personnages.','sait','Nous … comment finir la scène.','savons','savoir: je sais, tu sais, il sait, nous savons, vous savez, ils savent.'],
 ['dire','sagen','Vous … bonjour au client.','dites','Elles … la même chose.','disent','Achtung: vous dites. Im Plural: nous disons, ils disent.'],
 ['voir','sehen','Vous … les six images.','voyez','Ils … le problème.','voient','voir: nous voyons, vous voyez, ils voient.'],
 ['donner','geben','Nous … un conseil à notre équipe.','donnons','Tu … le signal.','donnes','Donner ist regelmässig. Der Stamm donn- hat zwei n.'],
 ['parler','sprechen','Vous … assez lentement.','parlez','Ils … de leur projet.','parlent','Regelmässiges -er-Verb: nous parlons, vous parlez, ils parlent.'],
 ['finir','beenden','Nous … notre dessin.','finissons','Ils … la dernière scène.','finissent','Bei finir steht im Plural -iss-: finissons, finissez, finissent.'],
 ['sortir','hinausgehen','Je … du studio.','sors','Nous … après la répétition.','sortons','sortir: je sors, tu sors, il sort, nous sortons.'],
 ['écrire','schreiben','Nous … un dialogue.','écrivons','Elle … le titre.','écrit','écrire: je/tu écris, il écrit, nous écrivons, vous écrivez, ils écrivent.'],
 ['lire','lesen','Nous … les bulles de la BD.','lisons','Vous … le scénario.','lisez','lire: je lis, tu lis, il lit, nous lisons, vous lisez, ils lisent.'],
 ['acheter','kaufen','Elle … un billet de cinéma.','achète','Vous … un micro.','achetez','acheter: je/tu/il/ils mit è; nous achetons und vous achetez ohne è.'],
 ['ouvrir','öffnen','Nous … la boîte surprise.','ouvrons','Elle … la porte du studio.','ouvre','Ouvrir erhält im Présent die Endungen eines -er-Verbs.'],
 ['manger','essen','Nous … le dernier biscuit.','mangeons','Vous … après le tournage.','mangez','Bei nous mangeons bleibt das e für den weichen g-Laut.'],
 ['comprendre','verstehen','Vous … la fin de l’histoire.','comprenez','Elles … le message.','comprennent','comprendre: nous comprenons, vous comprenez, ils comprennent.']
 ];
 forms.forEach(([verb,de,s1,a1,s2,a2,h],i)=>{
 add(i+'a','Ergänzen Sie die Präsensform von '+verb+' («'+de+'»). Schreiben Sie nur das Verb.',s1,a1,'Welche Person steht im Satz? '+h,h,verb);
 add(i+'b','Die Person wechselt. Schreiben Sie nur die fehlende Präsensform.',s1.replace('…',a1)+' → '+s2,a2,h,h,verb);
 });
 [['Nous mangons le dessert.','mangeons','manger'],['Vous faisez le montage.','faites','faire'],['Ils comprendent la scène.','comprennent','comprendre'],['Vous disez merci.','dites','dire'],['J’achete un carnet.','achète','acheter'],['Nous finons notre projet.','finissons','finir'],['Elles prendrent le train.','prennent','prendre'],['Tu ouvres la porte.','ouvres','ouvrir']].forEach(([s,a,v],i)=>add('fix'+i,'Prüfen Sie den Satz. Schreiben Sie die korrekte Verbform (auch wenn sie bereits stimmt).',s,a,forms.find(f=>f[0]===v)[6],forms.find(f=>f[0]===v)[6],v));
 const words={
  journee:[['le matin','der Morgen'],['à midi','am Mittag'],['l’après-midi','der Nachmittag'],['le soir','der Abend'],['la nuit','die Nacht'],['à minuit','um Mitternacht']],
  jours:[['lundi','Montag'],['mardi','Dienstag'],['mercredi','Mittwoch'],['jeudi','Donnerstag'],['vendredi','Freitag'],['samedi','Samstag'],['dimanche','Sonntag']],
  mois:[['janvier','Januar'],['février','Februar'],['mars','März'],['avril','April'],['mai','Mai'],['juin','Juni'],['juillet','Juli'],['août','August'],['septembre','September'],['octobre','Oktober'],['novembre','November'],['décembre','Dezember']],
  saisons:[['le printemps','der Frühling'],['l’été','der Sommer'],['l’automne','der Herbst'],['l’hiver','der Winter']]
 };
 const calendar=[];
 Object.entries(words).forEach(([group,ws])=>ws.forEach(([fr,de],i)=>{
  calendar.push({id:'cal-'+group+i,goal:'K',kind:'choice',group,title:'Zeitbegriffe erkennen',prompt:'Welcher französische Ausdruck passt?',stimulus:de,options:[fr,...ws.filter(x=>x[0]!==fr).slice(i%2,i%2+2).map(x=>x[0])],answers:[fr],hint:'Schauen Sie bei Bedarf kurz in die Übersicht. Versuchen Sie es danach nochmals aus dem Kopf.',explain:fr+' = '+de});
 }));
 [['jours','Après mardi, c’est …','mercredi'],['jours','Avant vendredi, c’est …','jeudi'],['jours','Après dimanche, c’est …','lundi'],['mois','Après juin, c’est …','juillet'],['mois','Avant octobre, c’est …','septembre'],['mois','Après décembre, c’est …','janvier'],['journee','Um zwölf Uhr mittags: …','à midi'],['saisons','Im Frühling: … printemps','au'],['saisons','Im Winter: … hiver','en'],['mois','Im November: … novembre','en'],['jours','Jeden Montag: … lundi','le'],['journee','Am Abend: … soir','le'],['journee','Am Nachmittag: … après-midi','l’']].forEach(([group,stimulus,a],i)=>calendar.push({id:'cal-use'+i,goal:'K',kind:'input',group,title:'Zeitbegriffe verwenden',prompt:'Ergänzen Sie den fehlenden Ausdruck.',stimulus,answers:a==='l’'?['l’',"l'"]: [a],hint:'Merken Sie sich: le matin, à midi, en novembre, au printemps, en hiver, le lundi.',explain:stimulus.replace('…',a)}));
 globalThis.W48Data={verbs,words,calendar,goals:{G1:'Zahlwerte verstehen',G2:'Zahlen bilden und schreiben',G3:'Uhrzeiten verstehen',G4:'Uhrzeiten ausdrücken',V:'Verbformen im Présent',K:'Zeitbegriffe verwenden'}};
})();
