/* Franz Lernatelier · Lernlabor 2026 · offlinefähig, ohne externe Abhängigkeiten.
 * Vorbereitungsformat nach Lernkontrolle Französisch Woche 43 V2: 40 Min., 60 P., 6 × 10 P.
 */
(()=>{'use strict';
const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='franz-lernatelier-lernstand-2026-w43-v2';
const BASE=[
 ['Comment tu t’appelles ?','Wie heisst du?'],['Tu habites où ?','Wo wohnst du?'],['Quels sont tes loisirs ?','Was sind deine Hobbys?'],['Quel métier veux-tu apprendre ?','Welchen Beruf möchtest du lernen?'],['Pourquoi ?','Warum?'],['Quelles langues parles-tu ?','Welche Sprachen sprichst du?'],
 ['Je m’appelle …','Ich heisse …'],['J’ai seize ans.','Ich bin sechzehn Jahre alt.'],['J’habite à Berne.','Ich wohne in Bern.'],['Dans mon temps libre, …','In meiner Freizeit …'],['Je parle allemand.','Ich spreche Deutsch.'],['Je suis à la BFF.','Ich bin an der BFF.'],
 ['Je voudrais devenir …','Ich möchte … werden.'],['Je m’intéresse au métier de …','Ich interessiere mich für den Beruf …'],['une place d’apprentissage','eine Lehrstelle'],['aider les gens','Menschen helfen'],
 ['un stage','eine Schnupperlehre'],['J’ai fait un stage.','Ich habe eine Schnupperlehre gemacht.'],['J’ai aidé à …','Ich habe mitgeholfen, …'],['J’ai observé …','Ich habe … beobachtet.'],
 ['fiable','zuverlässig'],['patient / patiente','geduldig'],['soigneux / soigneuse','sorgfältig'],['Je travaille bien en équipe.','Ich arbeite gut im Team.'],
 ['Et toi ?','Und du?'],['parce que','weil'],['mais','aber'],['et','und']
].map((a,i)=>({id:i+1,fr:a[0],de:a[1],goal:i<12?Math.floor(i/6)+1:Math.floor((i-12)/4)+3}));
const GOALS=[
 {id:1,title:'Fragen stellen',subtitle:'Ein Gespräch beginnen',can:'Passende Fragen zu Name, Wohnort, Hobbys, Sprachen und Beruf stellen.',model:'Quelles langues parles-tu ?',cue:'Die passende Frage finden und selbst schreiben.',example:'Tu habites où ? → J’habite à Berne.'},
 {id:2,title:'Über mich sprechen',subtitle:'Mich kurz vorstellen',can:'Name, Alter, Wohnort, Sprache, Freizeit und Schule in kurzen Sätzen nennen.',model:'Je m’appelle Léa. Je suis à la BFF.',cue:'Mehrere persönliche Informationen verständlich aufschreiben.',example:'Je m’appelle Lina. Je parle allemand.'},
 {id:3,title:'Beruf und Ziele',subtitle:'Einen Wunsch begründen',can:'Einen Berufswunsch nennen und mit «parce que» einen Grund angeben.',model:'Je voudrais devenir cuisinier parce que j’aime cuisiner.',cue:'Den Berufswunsch und den Grund in einem Satz verbinden.',example:'Je voudrais devenir éducatrice parce que j’aime aider les gens.'},
 {id:4,title:'Schnupperlehre',subtitle:'Von Tätigkeiten berichten',can:'Über eine Schnupperlehre und darüber schreiben, was ich beobachtet oder wobei ich geholfen habe.',model:'J’ai fait un stage. J’ai observé les enfants.',cue:'Beobachten und Mithelfen in der Vergangenheit unterscheiden.',example:'J’ai aidé à préparer la salle.'},
 {id:5,title:'Stärken ausdrücken',subtitle:'So arbeite ich',can:'Eine eigene Stärke nennen und erklären, wie ich im Team arbeite.',model:'Je suis patiente. Je travaille bien en équipe.',cue:'Zuverlässig, geduldig und sorgfältig korrekt anwenden.',example:'Je suis fiable. Je travaille bien en équipe.'},
 {id:6,title:'Sätze verbinden',subtitle:'Reagieren und nachfragen',can:'«et», «mais» und «parce que» sinnvoll verwenden und passende Rückfragen stellen.',model:'Je suis soigneuse et fiable. Et toi ?',cue:'Verbindungen wählen und ein Gespräch sinnvoll weiterführen.',example:'Je veux apprendre ce métier parce que j’aime aider les gens.'}
];
// Auswahlfragen: jeweils genau eine fachlich haltbare Antwort. Andere Kontexte als in der echten Lernkontrolle.
// Format: [Fragestellung, [3 Antworten], Index, kurze Erklärung].
const C={
1:[
 ['«Je m’appelle Manon.» Welche Frage passt?', ['Comment tu t’appelles ?','Pourquoi ?','Tu habites où ?'],0,'«m’appelle» nennt den Namen.'],
 ['«J’habite à Thoune.» Welche Frage passt?', ['Quels sont tes loisirs ?','Tu habites où ?','Pourquoi ?'],1,'«J’habite» sagt, wo jemand wohnt.'],
 ['Sie möchten etwas über Freizeit erfahren. Fragen Sie nach …',['dem Namen','den Sprachen','den Hobbys'],2,'«Loisirs» heisst Hobbys.'],
 ['«Je parle italien et allemand.» Was wurde gefragt?', ['Quelles langues parles-tu ?','Tu habites où ?','Quels sont tes loisirs ?'],0,'Die Antwort nennt die Sprachen.'],
 ['«Je voudrais devenir boulanger.» Welche Rückfrage passt?', ['Pourquoi ?','Comment tu t’appelles ?','Tu habites où ?'],0,'«Pourquoi ?» fragt nach dem Grund.'],
 ['Welche Frage erkundigt sich nach einer Ausbildung?', ['Quels sont tes loisirs ?','Quel métier veux-tu apprendre ?','Quelles langues parles-tu ?'],1,'«Métier» bedeutet Beruf.'],
 ['«Je fais du basket.» Welche Frage passt?', ['Quels sont tes loisirs ?','Quel métier veux-tu apprendre ?','Tu habites où ?'],0,'Basketball gehört zur Freizeit.'],
 ['«Je suis de Bienne.» Welche Frage passt?', ['Pourquoi ?','Tu habites où ?','Comment tu t’appelles ?'],1,'Die Aussage gibt Auskunft über den Ort.'],
 ['Was möchte «Quelles langues parles-tu ?» wissen?', ['Welche Schule?','Welche Sprachen?','Welche Arbeit?'],1,'«Langues» bedeutet Sprachen.'],
 ['Sie wollen den Namen wissen. Welche Frage stellen Sie?', ['Tu habites où ?','Pourquoi ?','Comment tu t’appelles ?'],2,'«Comment tu t’appelles ?» fragt nach dem Namen.']
],
2:[
 ['«Je suis à la BFF.» Was erfahren Sie?', ['die Schule','den Wohnort','das Alter'],0,'«BFF» ist hier die Schule.'],
 ['«J’ai seize ans.» Was erfahren Sie?', ['die Sprache','das Alter','die Freizeit'],1,'«seize ans» = 16 Jahre.'],
 ['«Dans mon temps libre, je danse.» Das handelt von …',['Freizeit','einer Bewerbung','der Schule'],0,'«Temps libre» bedeutet Freizeit.'],
 ['«J’habite à Berne.» Was bedeutet das?', ['Ich arbeite in Bern.','Ich wohne in Bern.','Ich habe die BFF besucht.'],1,'«Habiter» heisst wohnen.'],
 ['Welche Aussage nennt eine Sprache?', ['Je parle allemand.','J’ai seize ans.','Je suis à la BFF.'],0,'«Je parle …» nennt eine Sprache.'],
 ['Welcher Satz nennt einen Namen?', ['J’habite à Berne.','Je m’appelle Malik.','Je suis à la BFF.'],1,'«Je m’appelle» = ich heisse.'],
 ['«J’ai seize ans et je parle allemand.» Zwei Informationen sind …',['Alter und Sprache','Schule und Beruf','Name und Freizeit'],0,'Die Person nennt ihr Alter und ihre Sprache.'],
 ['«Je suis à la BFF.» Was wissen Sie NICHT?', ['die Schule','dass die Person an der BFF ist','das Hobby'],2,'Zur Freizeit wurde nichts gesagt.'],
 ['Welche Einleitung passt zu «je joue de la guitare»?', ['Dans mon temps libre,','Quel métier veux-tu apprendre ?','Un stage'],0,'Ein Hobby passt zum Satzanfang über Freizeit.'],
 ['«Je parle allemand.» Ist das eine Frage?', ['Ja, eine Frage zum Namen.','Nein, eine Aussage über die Sprache.','Ja, eine Frage zur Schule.'],1,'«Je» leitet eine eigene Aussage ein.']
],
3:[
 ['«Je m’intéresse au métier de pharmacienne.» Was sagt sie?', ['Sie hat die Lehre abgeschlossen.','Sie interessiert sich für diesen Beruf.','Sie hat eine Lehrstelle sicher.'],1,'Interesse bedeutet noch keine Zusage.'],
 ['«Je voudrais devenir peintre.» Das ist …',['ein Berufswunsch','eine frühere Tätigkeit','eine Frage'],0,'«Je voudrais devenir …» = ich möchte werden.'],
 ['«Une place d’apprentissage» bedeutet …',['ein Schulzimmer','eine Schnupperlehre','eine Lehrstelle'],2,'Eine Lehrstelle und eine Schnupperlehre sind verschieden.'],
 ['«Je voudrais aider les gens.» Was möchte die Person?', ['mit Menschen diskutieren','Menschen helfen','Menschen beobachten'],1,'«Aider» bedeutet helfen.'],
 ['Was folgt sinnvoll auf «Je voudrais devenir coiffeuse, parce que …»?', ['j’aime les cheveux.','tu habites où ?','un stage.'],0,'Nach «parce que» folgt ein passender Grund als Aussage.'],
 ['Was steht vor einer Begründung?', ['mais','parce que','Et toi ?'],1,'«parce que» leitet den Grund ein.'],
 ['Welche Aussage nennt noch keinen konkreten Beruf?', ['Je voudrais devenir vendeuse.','Je m’intéresse au métier de cuisinier.','J’aime aider les gens.'],2,'Menschen helfen ist eine Tätigkeit, kein Berufsname.'],
 ['«Je voudrais devenir fleuriste.» Ist das eine vergangene Tätigkeit?', ['Nein, ein Zukunftswunsch.','Ja, sie hat dort gearbeitet.','Ja, eine Schulnote.'],0,'«Je voudrais devenir» drückt einen Wunsch aus.'],
 ['Welche Formulierung passt zur Lehrstellensuche?', ['une place d’apprentissage','un stage','les loisirs'],0,'«Place d’apprentissage» ist die Lehrstelle.'],
 ['«Je m’intéresse au métier de …» spricht über …',['den Wohnort','ein berufliches Interesse','die Teamarbeit'],1,'Der Satz leitet einen Beruf ein.']
],
4:[
 ['«J’ai observé les clients.» Was hat die Person gemacht?', ['Kundschaft beobachtet','Kundschaft angerufen','Kundschaft unterrichtet'],0,'«observé» bedeutet beobachtet.'],
 ['«J’ai aidé à ranger le matériel.» Das bedeutet …',['Ich möchte etwas einräumen.','Ich habe beim Versorgen des Materials geholfen.','Ich habe Material nur gesehen.'],1,'«J’ai aidé à …» beschreibt Mithilfe.'],
 ['«Un stage» ist …',['eine Lehrstelle','eine Sprache','eine Schnupperlehre'],2,'«Stage» bedeutet Schnupperlehre.'],
 ['Welche Aussage beschreibt eine abgeschlossene Schnupperlehre?', ['Je voudrais devenir …','J’ai fait un stage.','Je suis à la BFF.'],1,'«J’ai fait un stage.» = ich habe eine Schnupperlehre gemacht.'],
 ['«J’ai observé la cuisine.» Was ist sicher?', ['Sie hat gekocht.','Sie hat eine Küche beobachtet.','Sie hat den Beruf gelernt.'],1,'Es wird nur eine Beobachtung beschrieben.'],
 ['Bei welchem Satz hat jemand aktiv mitgeholfen?', ['J’ai aidé à préparer les tables.','J’ai observé les employés.','Je voudrais devenir …'],0,'«aidé» beschreibt aktives Helfen.'],
 ['«J’ai fait un stage.» Bezieht sich auf …',['ein Hobby','die Zukunft','eine Erfahrung in der Vergangenheit'],2,'«J’ai fait» = ich habe gemacht.'],
 ['Welche Ergänzung passt nach «J’ai observé …»?', ['les enfants.','parce que.','Et toi ?'],0,'Nach dem Verb kann stehen, was beobachtet wurde.'],
 ['«J’ai aidé à préparer la salle.» Was sagt der Satz?', ['Ich habe beim Vorbereiten des Raums geholfen.','Ich habe den Raum gemietet.','Ich arbeite nie mit anderen.'],0,'«préparer la salle» = den Raum vorbereiten.'],
 ['«J’ai observé» und «J’ai aidé» unterscheiden …',['Sprechen und Lesen','Beobachten und Mithelfen','Schule und Freizeit'],1,'Nicht jede Beobachtung ist eine Mithilfe.']
],
5:[
 ['Jemand hält immer Abmachungen ein. Welche Stärke?', ['patient','soigneux','fiable'],2,'«fiable» bedeutet zuverlässig.'],
 ['Jemand arbeitet sehr genau. Welche Stärke?', ['soigneuse','patiente','fiable'],0,'«soigneuse» bedeutet sorgfältig.'],
 ['Jemand bleibt ruhig, auch wenn etwas länger dauert.', ['fiable','patient','soigneux'],1,'«patient» bedeutet geduldig.'],
 ['«Je travaille bien en équipe.» bedeutet …',['Ich arbeite gut im Team.','Ich arbeite nie mit anderen.','Ich bin immer pünktlich.'],0,'«Équipe» heisst Team.'],
 ['Welche Stärke passt zu einer Person, die ihre Arbeit kontrolliert?', ['soigneux','patient','un stage'],0,'Kontrollieren und genau arbeiten spricht für Sorgfalt.'],
 ['Welche Eigenschaft hat eine Person, auf die man sich verlassen kann?', ['soigneuse','fiable','patiente'],1,'Zuverlässig bedeutet «fiable».'],
 ['«Je suis patiente.» bedeutet …',['Ich bin zuverlässig.','Ich bin sorgfältig.','Ich bin geduldig.'],2,'«patiente» ist die feminine Form von geduldig.'],
 ['Welche zwei Aussagen passen zu einer Vorstellung beim Lehrbetrieb?', ['Je suis fiable. Je travaille bien en équipe.','Tu habites où ? Pourquoi ?','Un stage. Quel métier ?'],0,'Eigene Stärke und Teamarbeit passen zur Vorstellung.'],
 ['«soigneux / soigneuse» – welche Bedeutung?', ['zuverlässig','sorgfältig','geduldig'],1,'Die beiden Formen unterscheiden das grammatische Geschlecht.'],
 ['Eine Person hört anderen geduldig zu. Das passt zu …',['patient / patiente','fiable','un stage'],0,'Gesucht ist Geduld.']
],
6:[
 ['«Je parle allemand ___ français.» Welches Wort verbindet?', ['mais','et','parce que'],1,'«et» verbindet zwei Angaben.'],
 ['«J’aime le métier ___ je voudrais aider les gens.»', ['parce que','mais','Et toi ?'],0,'Der zweite Satzteil nennt den Grund.'],
 ['«Je suis fiable, ___ parfois je suis lente.»', ['parce que','et','mais'],2,'«mais» leitet einen Gegensatz ein.'],
 ['«Et toi ?» bewirkt …',['eine Rückfrage','eine Verneinung','eine Entschuldigung'],0,'Die Frage wird an die andere Person zurückgegeben.'],
 ['Welche Wendung bedeutet «weil»?', ['et','parce que','mais'],1,'«Parce que» führt einen Grund ein.'],
 ['«Je suis patiente ___ soigneuse.»', ['et','mais','Pourquoi ?'],0,'Zwei passende Stärken werden verbunden.'],
 ['«Je voudrais devenir cuisinier ___ j’aime cuisiner.»',['mais','Et toi ?','parce que'],2,'Ein Wunsch wird begründet.'],
 ['Welcher Ausdruck bedeutet «aber»?', ['mais','et','parce que'],0,'«mais» = aber.'],
 ['Was ist nach «Je parle italien. Et toi ?» passend?', ['Une place d’apprentissage.','Je parle allemand.','J’ai fait un stage.'],1,'Die Rückfrage bezieht sich auf die Sprachen.'],
 ['«J’aime le sport, ___ je préfère la musique.»',['parce que','mais','Et toi ?'],1,'Der zweite Satz stellt eine andere Vorliebe gegenüber.']
]};
// Satzlücken: konkrete Kontexte, ein eindeutiges Lösungswort.
const G={
1:[['«___ tu t’appelles ?» – «Je m’appelle Maël.»',['Comment','Quels','Pourquoi'],0],['«Tu habites ___ ?» – «À Berne.»',['que','où','qui'],1],['«___ sont tes loisirs ?» – «Le sport.»',['Quelle','Quels','Quelles'],1],['«Quel ___ veux-tu apprendre ?»',['métier','âge','langue'],0],['«___ langues parles-tu ?»',['Quels','Quelles','Quel'],1],['«___ ?» – «Parce que j’aime aider.»',['Pourquoi','Comment','Où'],0],['«___ tu t’appelles ?» fragt nach dem Namen.',['Comment','Quand','Pourquoi'],0],['«Tu habites ___ ?» fragt nach dem Wohnort.',['quoi','où','qui'],1]],
2:[['«Je m’___ Amir.»',['appelle','habite','aide'],0],['«J’___ seize ans.»',['ai','est','suis'],0],['«J’___ à Berne.»',['appelle','habite','travaille'],1],['«Dans mon temps ___, je danse.»',['stage','libre','équipe'],1],['«Je ___ allemand.»',['parle','m’appelle','voudrais'],0],['«Je suis à la ___.»',['stage','BFF','Berne'],1],['«___ mon temps libre, je joue au foot.»',['Dans','Avec','Mais'],0],['«J’ai ___ ans.»',['seize','stage','équipe'],0]],
3:[['«Je ___ devenir cuisinière.»',['habite','voudrais','parle'],1],['«Je m’intéresse au ___ de fleuriste.»',['stage','métier','équipe'],1],['«une place d’___»',['apprentissage','équipe','observé'],0],['«Je voudrais ___ les gens.»',['aider','habiter','appeler'],0],['«Je voudrais devenir coiffeur ___ j’aime travailler avec les gens.»',['mais','parce que','et'],1],['«Je m’___ au métier de peintre.»',['appelle','intéresse','observe'],1],['«Je voudrais ___ vendeuse.»',['devenir','faire','habiter'],0],['«une ___ d’apprentissage»',['place','langue','loisir'],0]],
4:[['«J’ai fait un ___.»',['métier','stage','loisir'],1],['«J’ai ___ à préparer le matériel.»',['habité','aidé','parlé'],1],['«J’ai ___ les clients.»',['observé','voulu','parlé'],0],['«J’___ fait un stage.»',['est','ai','suis'],1],['«J’ai aidé ___ préparer la salle.»',['à','en','de'],0],['«J’ai observé les ___.»',['parce que','enfants','était'],1],['«J’ai ___ à ranger les tables.»',['aidé','parlé','appelle'],0],['«un ___» bezeichnet die Schnupperlehre.',['stage','métier','équipe'],0]],
5:[['«Je suis ___.» Ich bin zuverlässig.',['fiable','stage','loisirs'],0],['«Je suis ___.» Ich bin geduldig (feminin).',['soigneuse','patiente','fiable'],1],['«Je suis ___.» Ich bin sorgfältig (maskulin).',['soigneux','patient','stage'],0],['«Je travaille bien en ___.»',['stage','équipe','métier'],1],['«Je ___ bien en équipe.»',['travaille','habite','deviens'],0],['«Je suis ___ et patiente.»',['fiable','stage','langue'],0],['«Il est ___.» Er ist geduldig.',['patiente','patient','soigneuse'],1],['«Elle est ___.» Sie ist sorgfältig.',['soigneux','soigneuse','patient'],1]],
6:[['«Je suis fiable ___ soigneuse.»',['mais','et','parce que'],1],['«Je voudrais aider les gens ___ c’est important pour moi.»',['parce que','mais','Et toi ?'],0],['«Je parle allemand, ___ je ne parle pas italien.»',['et','mais','parce que'],1],['«Je suis patiente. ___ toi ?»',['Mais','Et','Parce que'],1],['«Je veux une place d’apprentissage ___ j’aime ce métier.»',['mais','parce que','et'],1],['«Je parle allemand ___ français.»',['mais','et','Pourquoi'],1],['«Je suis fiable, ___ parfois je fais des erreurs.»',['mais','et','Et toi'],0],['«Je voudrais devenir coiffeur ___ j’aime ce métier.»',['parce que','mais','et'],0]]};
// Satzbau: Französischer Zielsatz und deutliche deutsche Aufgabenbeschreibung.
const O={
1:[['«Wie heisst du?»','Comment tu t’appelles ?'],['«Wo wohnst du?»','Tu habites où ?'],['«Was sind deine Hobbys?»','Quels sont tes loisirs ?'],['«Welche Sprachen sprichst du?»','Quelles langues parles-tu ?'],['«Welchen Beruf möchtest du lernen?»','Quel métier veux-tu apprendre ?']],
2:[['«Ich heisse Eva.»','Je m’appelle Eva.'],['«Ich bin sechzehn Jahre alt.»','J’ai seize ans.'],['«Ich wohne in Bern.»','J’habite à Berne.'],['«Ich spreche Deutsch.»','Je parle allemand.'],['«Ich bin an der BFF.»','Je suis à la BFF.']],
3:[['«Ich möchte Köchin werden.»','Je voudrais devenir cuisinière.'],['«Ich möchte Menschen helfen.»','Je voudrais aider les gens.'],['«Ich interessiere mich für den Beruf Koch.»','Je m’intéresse au métier de cuisinier.'],['«Ich möchte Maler werden.»','Je voudrais devenir peintre.'],['«Ich möchte Köchin werden, weil ich gerne koche.»','Je voudrais devenir cuisinière parce que j’aime cuisiner.']],
4:[['«Ich habe eine Schnupperlehre gemacht.»','J’ai fait un stage.'],['«Ich habe die Kinder beobachtet.»','J’ai observé les enfants.'],['«Ich habe beim Vorbereiten des Raums geholfen.»','J’ai aidé à préparer la salle.'],['«Ich habe die Kundinnen und Kunden beobachtet.»','J’ai observé les clients.'],['«Ich habe beim Versorgen des Materials geholfen.»','J’ai aidé à ranger le matériel.']],
5:[['«Ich arbeite gut im Team.»','Je travaille bien en équipe.'],['«Ich bin zuverlässig.»','Je suis fiable.'],['«Ich bin geduldig (feminin).»','Je suis patiente.'],['«Ich bin sorgfältig (maskulin).»','Je suis soigneux.'],['«Ich bin zuverlässig und sorgfältig (feminin).»','Je suis fiable et soigneuse.']],
6:[['«Ich bin zuverlässig und geduldig (maskulin).»','Je suis fiable et patient.'],['«Ich wohne in Bern und spreche Deutsch.»','J’habite à Berne et je parle allemand.'],['«Ich spreche Deutsch. Und du?»','Je parle allemand. Et toi ?'],['«Ich bin zuverlässig, aber manchmal langsam.»','Je suis fiable mais parfois lent.'],['«Ich bin geduldig und arbeite gut im Team (feminin).»','Je suis patiente et je travaille bien en équipe.']]};
// Offene Anwendung: nachvollziehbare 2-Punkte-Checklisten. Freie Antworten niemals maschinell benotet.
// [Auftrag, mögliche Lösung, 2 Kriterien, Hilfe]
const W={
1:[
 ['Sie treffen eine neue Person. Fragen Sie nach ihrem Wohnort und ihrer Freizeit.','Tu habites où ? Quels sont tes loisirs ?',['Eine Frage nach dem Wohnort.','Eine Frage nach der Freizeit.'],'Tu habites … ? / Quels sont … ?'],
 ['Sie haben jemanden an der BFF kennengelernt. Fragen Sie nach den Sprachen und dem Berufswunsch.','Quelles langues parles-tu ? Quel métier veux-tu apprendre ?',['Eine Frage nach den Sprachen.','Eine Frage nach dem Berufswunsch.'],'Quelles … ? / Quel … ?'],
 ['Eine Person sagt: «Je voudrais devenir boulanger.» Fragen Sie nach dem Grund und nach den Hobbys.','Pourquoi ? Quels sont tes loisirs ?',['Eine passende Warum-Frage.','Eine Frage zur Freizeit.'],'Pourquoi ? / Quels sont … ?'],
 ['Verfassen Sie zwei verschiedene Fragen für ein Kennenlerngespräch. Eine muss nach dem Namen fragen.','Comment tu t’appelles ? Tu habites où ?',['Eine Frage nach dem Namen.','Eine andere passende Kennenlernfrage.'],'Comment … ? / Tu … ?'],
 ['Sie wollen im Gespräch zuerst nach dem Namen und anschliessend nach einer Sprache fragen.','Comment tu t’appelles ? Quelles langues parles-tu ?',['Der Name wird erfragt.','Die gesprochene Sprache wird erfragt.'],'Comment … ? / Quelles … ?']
],
2:[
 ['Stellen Sie sich mit zwei Sätzen vor. Nennen Sie Namen und Schule.','Je m’appelle Samira. Je suis à la BFF.',['Ein verständlicher Satz mit dem Namen.','Ein verständlicher Satz mit der Schule.'],'Je m’appelle … / Je suis …'],
 ['Schreiben Sie zwei Sätze über Wohnort und Sprache. Sie dürfen Angaben erfinden.','J’habite à Berne. Je parle allemand.',['Der Wohnort wird genannt.','Eine Sprache wird genannt.'],'J’habite à … / Je parle …'],
 ['Ihre neue Kollegin möchte zwei Informationen über Sie: Alter und Hobby.','J’ai seize ans. Dans mon temps libre, je joue au foot.',['Das Alter wird genannt.','Eine Freizeitbeschäftigung wird genannt.'],'J’ai … ans. / Dans mon temps libre, …'],
 ['Stellen Sie sich mit Name, Schule und einer weiteren Information vor. Mindestens drei kurze Sätze.','Je m’appelle Noa. Je suis à la BFF. Je parle allemand.',['Name und Schule kommen vor.','Eine weitere passende Information ist vorhanden.'],'Je m’appelle … / Je suis … / J’habite …'],
 ['Eine Partnerin fragt nach Ihrem Wohnort. Antworten Sie und nennen Sie noch Ihre Sprache.','J’habite à Berne. Je parle allemand.',['Ein passender Satz zum Wohnort.','Ein eigener Satz zur Sprache.'],'J’habite à … / Je parle …']
],
3:[
 ['Ein Lehrbetrieb fragt nach Ihrem Berufswunsch. Nennen Sie ihn und einen Grund mit «parce que».','Je voudrais devenir éducatrice parce que j’aime aider les gens.',['Ein konkreter Berufswunsch steht da.','«parce que» verbindet einen nachvollziehbaren Grund.'],'Je voudrais devenir … parce que …'],
 ['Sie möchten Verkäuferin/Verkäufer werden und arbeiten gerne mit Menschen. Schreiben Sie einen Satz.','Je voudrais devenir vendeur parce que j’aime travailler avec les gens.',['Der Berufswunsch ist verständlich.','Der Grund passt und folgt auf «parce que».'],'Je voudrais devenir … parce que j’aime …'],
 ['Schreiben Sie zwei Aussagen: Für welchen Beruf interessieren Sie sich? Warum?','Je m’intéresse au métier de cuisinier. J’aime cuisiner.',['Ein berufliches Interesse wird genannt.','Ein nachvollziehbarer Grund wird formuliert.'],'Je m’intéresse au métier de … / J’aime …'],
 ['Schreiben Sie einen Satz über einen Berufswunsch. Verwenden Sie «aider les gens» als Grund.','Je voudrais devenir infirmière parce que je voudrais aider les gens.',['Ein verständlicher Berufswunsch.','«parce que» und «aider les gens» ergeben den Grund.'],'Je voudrais devenir … parce que je voudrais aider les gens.'],
 ['Eine Freundin fragt, was Sie lernen möchten. Antworten Sie und begründen Sie Ihre Wahl.','Je voudrais devenir fleuriste parce que j’aime les fleurs.',['Der Beruf wird genannt.','Ein sinnvoller Grund wird erklärt.'],'Je voudrais devenir … parce que …']
],
4:[
 ['Schreiben Sie zwei Sätze über eine Schnupperlehre: zuerst die Erfahrung, dann eine Beobachtung.','J’ai fait un stage. J’ai observé les enfants.',['«J’ai fait un stage» oder gleichwertige Aussage.','Eine passende Beobachtung steht im zweiten Satz.'],'J’ai fait un stage. J’ai observé …'],
 ['Sie haben in einem Restaurant mitgeholfen, die Tische vorzubereiten. Schreiben Sie einen Satz.','J’ai aidé à préparer les tables.',['Eine Mithilfe ist mit «J’ai aidé à» erkennbar.','Die Tätigkeit wird verständlich genannt.'],'J’ai aidé à … (préparer les tables = Tische vorbereiten)'],
 ['Sie haben einen Einblick in einem Betrieb erhalten. Berichten Sie von einer Sache, die Sie beobachtet haben.','J’ai observé les employés.',['«J’ai observé …» steht in der Vergangenheit.','Es folgt ein passendes Objekt der Beobachtung.'],'J’ai observé les employés / les clients / les enfants.'],
 ['Berichten Sie mit zwei kurzen Sätzen, was Sie in einer Schnupperlehre beobachtet und wobei Sie mitgeholfen haben.','J’ai observé les clients. J’ai aidé à préparer le matériel.',['Eine Beobachtung wird genannt.','Eine Mithilfe wird genannt.'],'J’ai observé … / J’ai aidé à …'],
 ['Erfinden Sie eine kurze Schnuppererfahrung. Schreiben Sie, dass Sie eine Schnupperlehre gemacht haben, und nennen Sie eine Mithilfe.','J’ai fait un stage. J’ai aidé à ranger le matériel.',['Der stage wird erwähnt.','Eine Tätigkeit als Mithilfe wird beschrieben.'],'J’ai fait un stage. J’ai aidé à …']
],
5:[
 ['Nennen Sie eine eigene Stärke und sagen Sie, dass Sie gut im Team arbeiten.','Je suis fiable. Je travaille bien en équipe.',['Eine passende Stärke wird verständlich genannt.','Ein verständlicher Satz zur Teamarbeit steht da.'],'Je suis fiable / patient(e) / soigneux(se). Je travaille bien en équipe.'],
 ['Sie möchten einem Betrieb zeigen, dass Sie geduldig sind und im Team arbeiten können. Zwei Aussagen.','Je suis patiente. Je travaille bien en équipe.',['Die Eigenschaft geduldig ist passend genannt.','Die Teamarbeit wird verständlich angesprochen.'],'Je suis patient/patiente. Je travaille bien en équipe.'],
 ['Sie arbeiten sorgfältig. Nennen Sie diese Stärke und eine zweite Stärke in zwei kurzen Sätzen.','Je suis soigneuse. Je suis fiable.',['«soigneux/soigneuse» ist richtig verwendet.','Eine weitere passende Stärke steht da.'],'Je suis soigneux/soigneuse. Je suis …'],
 ['Ein Lehrbetrieb möchte Ihre Stärken kennenlernen. Schreiben Sie zwei unterschiedliche Stärken und einen Satz zur Zusammenarbeit.','Je suis fiable et patiente. Je travaille bien en équipe.',['Zwei sinnvolle Stärken werden genannt.','Ein verständlicher Satz zur Teamarbeit steht da.'],'Je suis … et … / Je travaille bien en équipe.'],
 ['Beschreiben Sie sich als zuverlässige Person. Ergänzen Sie etwas über Teamarbeit.','Je suis fiable. Je travaille bien en équipe.',['Zuverlässigkeit wird korrekt ausgedrückt.','Die Zusammenarbeit wird genannt.'],'Je suis fiable. Je travaille …']
],
6:[
 ['Verbinden Sie zwei Ihrer Stärken mit «et». Stellen Sie dann eine Rückfrage zum Berufswunsch.','Je suis fiable et patiente. Quel métier veux-tu apprendre ?',['Zwei Stärken sind sinnvoll mit «et» verbunden.','Eine passende Frage nach dem Berufswunsch steht da.'],'Je suis … et … / Quel métier … ?'],
 ['Ihre Kollegin sagt: «Je suis fiable. Et toi ?» Antworten Sie und fragen Sie nach ihrer Freizeit.','Je suis patiente. Quels sont tes loisirs ?',['Eine eigene Stärke wird als Antwort genannt.','Eine sinnvolle neue Frage nach Hobbys folgt.'],'Je suis … / Quels sont tes loisirs ?'],
 ['Schreiben Sie einen Berufswunsch mit «parce que» und stellen Sie danach eine Frage zur Sprache.','Je voudrais devenir cuisinière parce que j’aime cuisiner. Quelles langues parles-tu ?',['Ein nachvollziehbarer Grund folgt auf «parce que».','Eine Frage nach den Sprachen folgt.'],'Je voudrais devenir … parce que … / Quelles … ?'],
 ['Schreiben Sie einen Satz mit «mais», der einen Gegensatz zeigt. Verwenden Sie danach «Et toi ?».','Je suis patiente, mais parfois lente. Et toi ?',['«mais» verbindet einen sinnvollen Gegensatz.','«Et toi ?» bildet eine Rückfrage.'],'Je suis …, mais … . Et toi ?'],
 ['Sie sprechen Deutsch und Französisch. Schreiben Sie das mit «et» und stellen Sie eine Rückfrage.','Je parle allemand et français. Et toi ?',['«et» verbindet zwei Sprachen sinnvoll.','Eine passende Rückfrage steht da.'],'Je parle … et … . Et toi ?']
]};
// Probeprüfung: anders formuliert als die echte Lernkontrolle. Teil C je 2 × 1 P. + 2 P. eigene Formulierung.
const SCENES={
1:{story:'Sie lernen Jules kennen. Jules sagt: «Je parle français. Je voudrais devenir peintre.»',a:['Welche Information nennt Jules zuerst?',['seine Sprachen','seinen Wohnort','seine Schule'],0],b:['Welche Frage passt zu «Je voudrais devenir peintre.»?',['Pourquoi ?','Comment tu t’appelles ?','Tu habites où ?'],0],prompt:'Stellen Sie Jules zwei Kennenlernfragen: eine nach dem Namen und eine nach den Hobbys.',model:'Comment tu t’appelles ? Quels sont tes loisirs ?',criteria:['Sie fragen nach dem Namen.','Sie fragen nach den Hobbys.']},
2:{story:'Lesen Sie: «Je m’appelle Safia. J’habite à Bienne. Je parle allemand. Je suis à la BFF.»',a:['Wo wohnt Safia?',['in Bern','in Biel','in Thun'],1],b:['Welche Sprache spricht Safia?',['Deutsch','Italienisch','Spanisch'],0],prompt:'Stellen Sie sich mit zwei anderen Informationen vor: Nennen Sie Ihr Alter und Ihre Schule.',model:'J’ai seize ans. Je suis à la BFF.',criteria:['Ein verständlicher Satz nennt Ihr Alter.','Ein verständlicher Satz nennt die Schule.']},
3:{story:'Ein Jugendlicher schreibt: «Je m’intéresse au métier de mécanicien parce que j’aime les voitures.» (mécanicien = Mechaniker; voitures = Autos)',a:['Wofür interessiert sich die Person?',['für den Beruf Mechaniker','für den Beruf Koch','für eine Schnupperlehre im Büro'],0],b:['Welcher Grund wird genannt?',['Die Person mag Autos.','Sie mag Kinder.','Sie mag Sprachen.'],0],prompt:'Schreiben Sie einen eigenen Berufswunsch und einen passenden Grund mit «parce que».',model:'Je voudrais devenir cuisinière parce que j’aime cuisiner.',criteria:['Sie nennen einen verständlichen Berufswunsch.','Der Grund passt und ist mit «parce que» angeschlossen.']},
4:{story:'In einer Schnupperlehre: Mittwoch «J’ai observé les employés.» Donnerstag «J’ai aidé à préparer les tables.» (employés = Mitarbeitende; préparer les tables = Tische vorbereiten)',a:['An welchem Tag hat die Person beobachtet?',['Mittwoch','Donnerstag','an keinem Tag'],0],b:['Wann hat sie aktiv mitgeholfen?',['am Mittwoch','am Donnerstag','nie'],1],prompt:'Schreiben Sie einen eigenen Satz über eine Beobachtung ODER Mithilfe während einer Schnupperlehre.',model:'J’ai aidé à ranger le matériel.',criteria:['Der Satz beschreibt eine Beobachtung oder Mithilfe.','Die französische Vergangenheitsform ist verständlich erkennbar.']},
5:{story:'Im Team: Dana kontrolliert ihre Arbeit genau. Karim bleibt auch bei Wartezeiten ruhig.',a:['Welche Stärke beschreibt Dana?',['fiable','soigneuse','patiente'],1],b:['Welche Stärke beschreibt Karim?',['patient','soigneux','fiable'],0],prompt:'Schreiben Sie zwei französische Aussagen: eine eigene Stärke und Ihre Zusammenarbeit im Team.',model:'Je suis fiable. Je travaille bien en équipe.',criteria:['Sie nennen eine eigene Stärke in einem verständlichen Satz.','Sie erklären verständlich, wie Sie im Team arbeiten.']},
6:{story:'Eine Person schreibt: «Je suis fiable et patiente. J’aime le métier, mais je cherche encore une place d’apprentissage.»',a:['Was verbindet «et» hier?',['zwei Stärken','zwei Schulorte','zwei Berufe'],0],b:['Welche Bedeutung hat «mais»?',['weil','aber','und'],1],prompt:'Antworten Sie auf «Je suis soigneuse. Et toi ?»: Nennen Sie eine eigene Stärke und stellen Sie eine neue Frage zur Freizeit ODER zum Berufswunsch.',model:'Je suis patient. Quels sont tes loisirs ?',criteria:['Ihre Antwort enthält eine passende eigene Stärke.','Sie stellen eine sinnvolle neue Frage, nicht bloss «Et toi ?».']}
};
const MODE=[
 {id:'meaning',title:'Verstehen',short:'Bedeutungen erkennen',subtitle:'Situationen und Wortbedeutungen sicher unterscheiden.',skill:'understand',sign:'01'},
 {id:'recall',title:'Selbst schreiben',short:'Ohne Vorlage schreiben',subtitle:'Die 28 Testeinträge und wichtige Sätze aktiv abrufen.',skill:'recall',sign:'02'},
 {id:'gap',title:'Satzlücken',short:'Das passende Wort einsetzen',subtitle:'Die richtige Wendung im Zusammenhang auswählen.',skill:'understand',sign:'03'},
 {id:'order',title:'Satzbau',short:'Wörter richtig ordnen',subtitle:'Mit Wortkarten vollständige französische Sätze bauen.',skill:'recall',sign:'04'},
 {id:'use',title:'Selbst formulieren',short:'Eigene Sätze schreiben',subtitle:'Prüfungsnahe Situationen lösen und selbst prüfen.',skill:'apply',sign:'05'}
];
function choice(id,g,p,opts,right,exp,where='training'){
 return {id,g,type:'choice',p,opts,right,explain:exp,max:1,where};
}
function typed(id,g,p,solutions,context=''){
 return {id,g,type:'typed',p,solutions:Array.isArray(solutions)?solutions:[solutions],context,max:2};
}
function open(id,g,p,model,criteria,hint){return {id,g,type:'open',p,model,criteria,hint,max:2};}
function vocab(g){return BASE.filter(x=>x.goal===g);}
function normalize(raw){return String(raw??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\.{3}|…/g,' ').replace(/[?!.;,\-]/g,' ').replace(/\s+/g,' ').trim();}
function gradeText(input,solutions){
 const attempt=normalize(input);
 if(!attempt)return 0;
 const expanded=[];
 for(const s of solutions){
   let t=String(s), variants=/\//.test(t)?[t,...t.split(/\s*\/\s*/).map(x=>x.trim())]:[t];
   for(const v of variants){let n=normalize(v);if(n)expanded.push(n);}
   // Die Auslassung «…» steht für einen beliebigen sinnvollen Inhalt.
   if(/…|\.\.\./.test(t)){const core=normalize(t.replace(/…|\.\.\./g,''));if(core&&attempt.startsWith(core)&&(attempt.length===core.length||attempt[core.length]===' '))return 2;}
 }
 if(expanded.includes(attempt))return 2;
 // Schreibweisen mit Ziffern statt Zahlwort; in einer Prüfung gehört die Wortform zum Lernstoff.
 if(expanded.includes("j'ai seize ans")&&attempt==="j'ai 16 ans")return 1;
 // Kleine Buchstabendreher erst ab längeren Wendungen mit Teilpunkt – nie bei et / est / mais.
 for(const s of expanded){if(s.length>=10&&Math.abs(s.length-attempt.length)<=1&&distance(s,attempt)<=1)return 1;}
 return 0;
}
function distance(a,b){let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}return prev[b.length];}
function wordVariants(w){
 if(w.id===22)return ['patient','patiente','patient / patiente'];
 if(w.id===23)return ['soigneux','soigneuse','soigneux / soigneuse'];
 if(w.id===8)return [w.fr];
 return [w.fr];
}
function distractors(w){
 let ids=vocab(w.goal).filter(x=>x.id!==w.id);
 if(ids.length<3)ids=BASE.filter(x=>x.id!==w.id&&x.goal!==w.goal).slice((w.id*3)%23);
 return ids.slice(0,3).map(x=>x.de);
}
function wordChoice(w){let arr=[w.de,...distractors(w).slice(0,2)];let offset=w.id%3;arr=arr.slice(offset).concat(arr.slice(0,offset));return choice(`meaning-v${w.id}`,w.goal,`Was bedeutet «${w.fr}»?`,arr,arr.indexOf(w.de),`«${w.fr}» bedeutet «${w.de}».`);}
function bank(g,mode){
 if(mode==='meaning')return [...C[g].map((x,i)=>choice(`meaning-c${g}-${i}`,g,...x)),...vocab(g).map(wordChoice)];
 if(mode==='recall')return [...vocab(g).map(w=>typed(`recall-v${w.id}`,g,`Schreiben Sie auf Französisch: «${w.de}»`,wordVariants(w),'Verbindlicher Wortschatz')),...O[g].map((x,i)=>typed(`recall-s${g}-${i}`,g,`Schreiben Sie den ganzen Satz auf Französisch: ${x[0]}`,x[1],'Satztraining – Beispielwörter sind nicht zusätzlich prüfungspflichtig'))];
 if(mode==='gap')return G[g].map((x,i)=>choice(`gap-${g}-${i}`,g,`Ergänzen Sie die Lücke: ${x[0]}`,x[1],x[2],`Richtig ist «${x[1][x[2]]}».`));
 if(mode==='order')return O[g].map((x,i)=>({id:`order-${g}-${i}`,g,type:'order',p:`Ordnen Sie die Wortkarten. Bedeutung: ${x[0]}`,target:x[1],max:2}));
 if(mode==='use')return W[g].map((x,i)=>open(`use-${g}-${i}`,g,...x));
 return [];
}
function diagTasks(version){
 let x=[];
 GOALS.forEach(g=>{
  const n=g.id,v=vocab(n),variant=version===1?0:1;
  let ch=C[n][variant===0?Math.min(1+n,8):Math.min(6+n%3,9)];
  x.push(choice(`dia${version}-mc${n}`,n,...ch));
  let word=v[variant===0?(n%v.length):(n+2)%v.length];
  x.push(typed(`dia${version}-write${n}`,n,`Schreiben Sie auf Französisch: «${word.de}»`,wordVariants(word)));
  let a=W[n][variant===0?1:3];
  x.push(open(`dia${version}-own${n}`,n,...a));
 });
 return x;
}
function simTasks(){
 const picks={1:[2,5],2:[8,11],3:[13,16],4:[17,19],5:[22,23],6:[26,28]};
 const recall=[],understanding=[],apply=[];
 GOALS.forEach(g=>{
  for(const id of picks[g.id]){const w=BASE[id-1];recall.push(typed(`sim-v${id}`,g.id,`Schreiben Sie auf Französisch: «${w.de}»`,wordVariants(w)));}
 });
 GOALS.forEach(g=>{
  for(const ix of [3,7]){const row=C[g.id][ix];understanding.push(choice(`sim-m${g.id}-${ix}`,g.id,...row));}
 });
 GOALS.forEach(g=>{
  const c=SCENES[g.id];apply.push({id:`sim-case${g.id}`,g:g.id,type:'scene',p:c.story,scene:c,max:4});
 });
 return [...recall,...understanding,...apply];
}
function seededShuffle(items,seed){let a=items.slice();let v=seed|0;for(let i=a.length-1;i>0;i--){v=(Math.imul(1664525,v)+1013904223)|0;let j=(v>>>0)%(i+1);[a[i],a[j]]=[a[j],a[i]];}if(a.every((x,i)=>x===items[i])&&a.length>1)[a[0],a[1]]=[a[1],a[0]];return a;}
function defaultState(){return {version:2,diagnostics:[],simulations:[],events:[],fontLarge:false,opened:{},created:new Date().toISOString()};}
function loadState(){try{const v=JSON.parse(localStorage.getItem(KEY));return v?.version===2&&Array.isArray(v.events)&&Array.isArray(v.diagnostics)?{...defaultState(),...v}:defaultState();}catch{return defaultState();}}
let state=loadState(),session=null,route='home',currentGoal=1,currentMode='meaning',lastResult=null,selectedDiary=1,showAllWords=false;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{/* Ohne verfügbaren Browserspeicher funktioniert das Training dennoch. */}}
function record(g,q,points,assisted){state.events.push({g,id:q.id,type:q.type,points,max:q.max,assisted:!!assisted,at:new Date().toISOString()});state.events=state.events.slice(-900);persist();}
function lastDiag(){return state.diagnostics.at(-1)||null;}
function lastAnyResult(){return [...state.diagnostics,...state.simulations].sort((a,b)=>(b.at||'').localeCompare(a.at||''))[0]||null;}
function latestGoal(g){const entry=lastAnyResult();return entry?.byGoal?.[g]||null;}
function modeRecommendation(g){const v=latestGoal(g);if(!v)return {mode:'meaning',reason:'Starten Sie mit den Bedeutungen. Danach schreiben Sie ohne Vorlage.'};
 const caps=v.caps||{understand:1,recall:2,apply:2};
 if(v.understand/caps.understand<.75)return{mode:'meaning',reason:'Bei den Bedeutungen oder passenden Antworten gab es noch Unsicherheiten.'};
 if(v.recall/caps.recall<.75)return{mode:'recall',reason:'Das Verstehen klappt besser als das Schreiben ohne Vorlage.'};
 if(v.apply/caps.apply<1)return{mode:'use',reason:'Bei eigenen Sätzen und Antworten lohnt sich gezieltes Üben.'};
 return{mode:'gap',reason:'Die letzte Überprüfung gelang. Sichern Sie das Gelernte mit neuen Beispielen.'};
}
function goalStatus(g){const x=latestGoal(g);if(!x)return {label:'Noch nicht geprüft',kind:'',detail:'Beginnen Sie mit einem Diagnosecheck.'};let p=x.total/x.max;
 if(x.recall===0&&x.understand>0)return{label:'Schreiben üben',kind:'work',detail:'Erkennen gelingt zum Teil; der selbstständige Abruf fehlt noch.'};
 if(x.apply===0&&p>=.55)return{label:'Eigene Sätze üben',kind:'work',detail:'Verstehen ist da; das Formulieren braucht Übung.'};
 if(p>=.89&&x.apply>=Math.min(2,x.caps?.apply||2))return{label:'Gut nachgewiesen',kind:'good',detail:'Diesen Stand mit einer Wiederholung festigen.'};
 if(p>=.55)return{label:'Teilweise sicher',kind:'work',detail:'Einige Aufgaben klappten bereits. Trainieren Sie den schwächsten Teil.'};
 return{label:'Gezielt üben',kind:'work',detail:'Beginnen Sie mit dem empfohlenen Training.'};
}
function eventsFor(g){return state.events.filter(x=>x.g===g);}
function practiceCount(g){return MODE.reduce((sum,m)=>sum+bank(g,m.id).length,0);}
function trainingStats(g){const a=eventsFor(g);return {attempts:a.length,independent:a.filter(x=>x.points===x.max&&!x.assisted).length};}
function studyPoints(){return state.events.reduce((acc,e)=>acc+(e.points===e.max?(e.assisted?4:8):e.points?3:1),0);}
function progressSteps(){const n=state.diagnostics.length+state.simulations.length;return {diagnosed:!!n,goals:GOALS.filter(g=>eventsFor(g.id).length>=5).length,review:state.simulations.length>0};}
function qid(x){return Math.max(0,Math.min(100,Math.round(x)));}
function esc(v){return escapeHtml(v);}
function btn(label,go='',cls='secondary'){return `<button type="button" class="btn ${cls}" ${go?`data-go="${esc(go)}"`:''}>${esc(label)}</button>`;}
function statusTag(g){const t=goalStatus(g);return `<span class="pill ${t.kind}">${esc(t.label)}</span>`;}
function goalNum(n){return `<span class="goalnum">${n}</span>`;}
function go(path){location.hash='#/'+path;}
function nav(){const navs=[['home','⌂','Übersicht'],['diagnose','◉','Diagnosetests'],['progress','↗','Mein Lernstand'],['vocab','Aa','28 Einträge'],['probe','▤','Generalprobe']];
 let html=navs.slice(0,2).map(([r,i,t])=>`<button class="nav-item ${route===r?'active':''}" data-go="${r}" ${route===r?'aria-current="page"':''}><span>${i}</span>${t}</button>`).join('');
 html+='<div class="nav-group">Die sechs Lernziele</div>';
 html+=GOALS.map(g=>`<button class="nav-item ${route==='goal'&&currentGoal===g.id?'active':''}" data-go="goal/${g.id}"><span>${g.id}</span>${esc(g.title)}</button>`).join('');
 html+='<div class="nav-group">Zum Abschluss</div>'+navs.slice(2).map(([r,i,t])=>`<button class="nav-item ${route===r?'active':''}" data-go="${r}" ${route===r?'aria-current="page"':''}><span>${i}</span>${t}</button>`).join('');
 $('#nav').innerHTML=html;
}
function wrapper(title,eyebrow,intro){return `<div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1><p class="lead">${esc(intro)}</p>`;}
function goalCards(){return `<div class="goalgrid">${GOALS.map(g=>{let s=goalStatus(g.id),v=latestGoal(g.id),rec=modeRecommendation(g.id);return `<article class="goalcard"><div class="card-top">${goalNum(g.id)}${statusTag(g.id)}</div><h3>${esc(g.title)}</h3><p>${esc(g.can)}</p>${v?`<div class="progress-label"><span>Letzter Check</span><strong>${v.total}/${v.max} Punkte</strong></div><div class="meter"><span style="width:${qid(v.total/v.max*100)}%"></span></div>`:'<p class="tiny muted">Noch kein Testergebnis vorhanden.</p>'}<div class="actions">${btn('Lernziel öffnen','goal/'+g.id,'primary small')}${btn('Empfohlene Übung','practice/'+g.id+'/'+rec.mode,'secondary small')}</div></article>`}).join('')}</div>`;}
function home(){const steps=progressSteps(),last=lastAnyResult();let recs=GOALS.map(g=>({g:g.id,status:goalStatus(g.id),rec:modeRecommendation(g.id),v:latestGoal(g.id)}));recs.sort((a,b)=>{if(!a.v)return 1;if(!b.v)return -1;return (a.v.total/a.v.max)-(b.v.total/b.v.max)});
 return `<section class="hero"><div class="eyebrow">Woche 43 · Lernkontrolle Französisch</div><h1>Gut vorbereitet.<br>In Ihrem Tempo.</h1><p>Sie finden heraus, was schon klappt. Danach üben Sie genau das, was Ihnen noch fehlt – mit klaren Beispielen, vielfältigen Aufgaben und hilfreichem Feedback.</p><div class="tagrow"><span class="tag">6 Lernziele</span><span class="tag">28 verbindliche Einträge</span><span class="tag">40 Minuten · 60 Punkte</span></div><div class="actions">${btn(steps.diagnosed?'Erneut testen →':'Mit einem Standortcheck starten →','diagnose','primary')}${btn('Alle Lernziele ansehen','goals','secondary')}</div></section>
 <div class="grid-3"><article class="tile feature"><span class="stepnum">01 · ORIENTIEREN</span><h3>Was klappt schon?</h3><p>Zwei verschiedene Diagnosetests prüfen Verstehen, Schreiben und eigene Sätze – je Lernziel getrennt.</p>${btn(steps.diagnosed?'Zweiten Check machen':'Diagnose starten','diagnose','primary')}</article><article class="tile"><span class="stepnum">02 · GEZIELT ÜBEN</span><h3>Passende Übungen</h3><p>Über 250 Übungen in fünf Formen. Die Empfehlungen richten sich nach Ihrem letzten Ergebnis.</p>${btn('Training auswählen','goals','secondary')}</article><article class="tile"><span class="stepnum">03 · ANWENDEN</span><h3>Generalprobe</h3><p>40 Minuten, 60 Punkte. Eine neue Probe mit denselben Aufgabentypen – nicht mit den Prüfungsfragen.</p>${btn('Generalprobe öffnen','probe','secondary')}</article></div>
 ${last?`<section class="surface" style="margin-top:22px"><div class="flex-between"><div><div class="eyebrow">Mein letzter Check</div><h2>${last.kind==='sim'?'Generalprobe':'Diagnosetest '+(last.version===1?'A':'B')} · ${last.total}/${last.max} Punkte</h2><p class="muted" style="margin:0">${last.byGoal?GOALS.filter(g=>goalStatus(g.id).kind==='good').length:0} Lernziele gut nachgewiesen. Entscheidend ist, ob Sie die Wendungen auch selbst schreiben können.</p></div>${btn('Ergebnisse ansehen','result','primary')}</div></section>`:''}
 <div class="section-head"><div><h2>Die sechs Lernziele</h2><p>Öffnen Sie ein Lernziel oder starten Sie mit der empfohlenen Übungsart.</p></div>${btn('28 verbindliche Einträge','vocab','subtle small')}</div>${goalCards()}
 <section class="surface" style="margin-top:21px"><div class="flex-between"><div><h2>Kurze Wiederholungsrunde</h2><p class="muted">Noch einmal gezielt an den Aufgaben arbeiten, die zuletzt nicht gelungen sind.</p></div>${btn('Wiederholen →','review-errors','secondary')}</div></section>`;
}
function goalsPage(){return wrapper('Ihre sechs Lernziele','MEIN TRAINING','Sie können jedes Lernziel einzeln trainieren. Die Reihenfolge wählen Sie selbst. Beginnen Sie bei Unsicherheiten mit «Verstehen» und wechseln Sie dann zu «Selbst schreiben».')+goalCards();}
function diagnosticsPage(){const last=lastDiag();return wrapper('Zuerst herausfinden, was Sie brauchen','DIAGNOSE · OHNE NOTE','Jeder Test hat 18 Aufgaben: pro Lernziel eine zum Verstehen, eine zum Schreiben und eine zum Anwenden. So sehen Sie nicht nur eine Gesamtpunktzahl, sondern konkret Ihre nächsten Schritte.')+`<div class="grid-2">
 <article class="tile feature"><span class="stepnum">DIAGNOSE A · CA. 15 MIN.</span><h2>Mein erster Standort</h2><p>18 Aufgaben · 30 Punkte. Verschiedene Situationen und kurze eigene Sätze. Ohne Hilfen während des Tests.</p><div class="actions">${btn('Diagnose A starten','startdiag/1','primary')}</div></article>
 <article class="tile"><span class="stepnum">DIAGNOSE B · CA. 15 MIN.</span><h2>Was hat sich verbessert?</h2><p>Ein zweiter Test mit anderen Beispielen. Machen Sie ihn nach einer Übungsphase – am besten nicht sofort hintereinander.</p><div class="actions">${btn('Diagnose B starten','startdiag/2','primary')}</div></article>
 </div><section class="surface" style="margin-top:21px"><h2>Was bedeutet die Auswertung?</h2><div class="grid-3"><div><strong>Verstehen · 1 Punkt</strong><p class="small-example">Sie erkennen die passende Bedeutung oder Antwort.</p></div><div><strong>Selbst schreiben · 2 Punkte</strong><p class="small-example">Sie schreiben eine Wendung aus dem Gedächtnis.</p></div><div><strong>Anwenden · 2 Punkte</strong><p class="small-example">Sie schreiben eine eigene passende Aussage.</p></div></div><p class="muted tiny">Freie Texte vergleichen Sie am Ende mit zwei klaren Kriterien selbst. Das ist eine Orientierung, keine Note. Sie können auch sinnvolle andere Formulierungen verwenden.</p></section>
 ${last?`<section class="surface"><h2>Letzte Diagnose</h2><p>${last.version===1?'A':'B'} · ${formatDate(last.at)} · ${last.total}/30 Punkte</p>${btn('Auswertung öffnen','result','primary')}</section>`:''}`;
}
function goalPage(gid){const g=GOALS[gid-1];if(!g)return goalsPage();let st=goalStatus(gid),v=latestGoal(gid),rec=modeRecommendation(gid),stats=trainingStats(gid);
 return `<div class="backstrip"><a href="#/goals" class="backlink">← Alle Lernziele</a><span>· Lernziel ${gid} von 6</span></div>`+wrapper(g.title,`LERNZIEL ${gid} · ${g.subtitle}`,g.can)+`<section class="surface"><div class="flex-between"><div><div class="eyebrow">Mein nächster Schritt</div><h2>${esc(st.label)}</h2><p class="muted">${esc(v?rec.reason:'Sie können ohne Vorkenntnisse beginnen. Lesen Sie das Beispiel und wählen Sie dann eine Übung.')}</p></div>${btn('Empfohlene Übung starten →','practice/'+gid+'/'+rec.mode,'primary')}</div><div class="callout"><strong>Das Beispiel</strong><p class="fr" style="margin:6px 0 0" lang="fr">${esc(g.example)}</p></div><div class="flex-between"><span class="tiny muted">${practiceCount(gid)} Übungen · ${stats.attempts} Versuche · ${stats.independent} selbstständig gelungen</span>${v?`<strong class="tiny">Letzter Check: ${v.total}/${v.max} Punkte</strong>`:''}</div></section>
 <div class="section-head"><div><h2>So können Sie üben</h2><p>Wählen Sie die Übungsform, die Ihnen im Moment am meisten hilft.</p></div></div><div class="goalgrid">${MODE.map(m=>`<article class="tile"><span class="stepnum">${m.sign} · ${bank(gid,m.id).length} AUFGABEN</span><h3>${esc(m.title)}${rec.mode===m.id?' · empfohlen':''}</h3><p>${esc(m.subtitle)}</p>${btn(m.id===rec.mode?'Hier weiterüben →':'Übungen öffnen','practice/'+gid+'/'+m.id,m.id===rec.mode?'primary':'secondary')}</article>`).join('')}</div><section class="surface" style="margin-top:20px"><h2>Alle verbindlichen Einträge für dieses Lernziel</h2>${vocab(gid).map(w=>`<div class="linebox"><strong lang="fr">${esc(w.fr)}</strong><span>${esc(w.de)}</span></div>`).join('')}<p class="fineprint" style="margin-top:14px">Weitere Wörter in Beispielsätzen helfen beim Verstehen. Die Pflichtliste bleibt bei genau 28 Einträgen.</p></section>`;
}
function vocabPage(){let grouped=GOALS.map(g=>({g,items:vocab(g.id)}));return wrapper('Die 28 verbindlichen Einträge','WORTSCHATZ · OFFIZIELLE LISTE','Alle französischen Formen gehören zum Prüfungsstoff. Lernen Sie die Bedeutung und schreiben Sie jede französische Form auch aus dem Gedächtnis.')+`<section class="surface"><div class="flex-between"><div><h2>Alle 28 Wörter und Wendungen</h2><p class="muted">Nach sechs Lernzielen geordnet, ohne zusätzliche Pflichtwörter.</p></div><button class="btn secondary" data-action="toggle-vocab">${showAllWords?'Französisch zeigen':'Französisch verdecken'}</button></div>${grouped.map(x=>`<h3 style="margin:23px 0 9px">${x.g.id} · ${esc(x.g.title)}</h3>${x.items.map(w=>`<div class="linebox"><span><strong class="fr">${showAllWords?'•••':esc(w.fr)}</strong><span class="tiny muted" style="display:block">Nr. ${String(w.id).padStart(2,'0')}</span></span><span>${esc(w.de)}</span></div>`).join('')}<div class="actions" style="margin-top:10px">${btn('Diese Wendungen schreiben','practice/'+x.g.id+'/recall','secondary small')}</div>`).join('')}</section>`;
}
function begin(kind,details={}){
 if(kind==='diag')session={kind,version:details.version,step:0,phase:'taking',started:Date.now(),tasks:diagTasks(details.version),responses:[],reviewIndex:0};
 else if(kind==='sim')session={kind,step:0,phase:'taking',started:Date.now(),tasks:simTasks(),responses:[],reviewIndex:0};
 else if(kind==='practice')session={kind,goal:details.goal,mode:details.mode,step:0,phase:'taking',started:Date.now(),tasks:bank(details.goal,details.mode),responses:[]};
 else if(kind==='quick'){
  const lookup=new Map(GOALS.flatMap(g=>MODE.flatMap(m=>bank(g.id,m.id))).map(q=>[q.id,q]));
  const recent=new Map();state.events.forEach(e=>recent.set(e.id,e));
  const weak=Array.from(recent.values()).filter(e=>e.points<e.max).reverse().map(e=>lookup.get(e.id)).filter(Boolean);
  const fillers=GOALS.flatMap(g=>[bank(g.id,'meaning')[2],bank(g.id,'recall')[0],bank(g.id,'use')[0]]);
  let seen=new Set(),pool=[];[...weak,...seededShuffle(fillers,Date.now())].forEach(q=>{if(q&&!seen.has(q.id)){seen.add(q.id);pool.push(q);}});
  session={kind:'quick',step:0,phase:'taking',started:Date.now(),tasks:pool.slice(0,8),responses:[]};
 }
 route='session';go('session');render();
}
function getResponse(){if(!session)return null;session.responses[session.step]??={};return session.responses[session.step];}
function collectInput(){if(!session||route!=='session')return;const r=getResponse(),input=$('[data-answer-text]');if(input)r.text=input.value;}
function formatDate(d){try{return new Intl.DateTimeFormat('de-CH',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(d));}catch{return '–';}}
function formatDuration(ms){const seconds=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function tickClock(){const e=$('#elapsedClock');if(e&&session)e.textContent=formatDuration(Date.now()-session.started);}
function recBadge(q,s){return s?.done?(s.points===q.max?'<span class="pill good">Gelungen</span>':'<span class="pill work">Noch üben</span>'):'<span class="pill">Übungsaufgabe</span>';}
function renderQuestion(q,r={},kind='practice'){
 const locked=kind==='diag'||kind==='sim',readonly=!!r.done,answer=!!r.reveal;
 let html=`<div class="task-top"><span>Lernziel ${q.g} · ${esc(GOALS[q.g-1].title)}</span>${recBadge(q,locked?null:r)}</div><div class="task-prompt">${esc(q.p)}</div>`;
 if(q.type==='choice'){
  html+=`<div class="options" role="group" aria-label="Antwortmöglichkeiten">${q.opts.map((o,i)=>`<button type="button" class="opt ${r.choice===i?'selected':''} ${readonly&&i===q.right?'correct':''} ${readonly&&r.choice===i&&i!==q.right?'wrong':''}" data-pick="${i}" ${readonly?'disabled':''} aria-pressed="${r.choice===i}"><span class="round">${r.choice===i?'✓':''}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
 }else if(q.type==='typed'){
  html+=`<label class="field" for="writtenAnswer">Ihre Antwort auf Französisch</label><input id="writtenAnswer" data-answer-text class="entry" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="Hier auf Französisch schreiben …" value="${esc(r.text||'')}" ${readonly?'readonly':''} aria-describedby="typedHint"><p id="typedHint" class="note">Schreiben Sie aus dem Gedächtnis. Kleine Satzzeichenfehler zählen nicht.</p>`;
 }else if(q.type==='order'){
  let tokens=r.tokens;
  if(!tokens){tokens=seededShuffle(q.target.split(/\s+/).map((t,i)=>({token:t,original:i})),q.id.length*137+q.g*997);r.tokens=tokens;}
  r.chosen??=[];
  html+=`<p class="note">Klicken Sie die Wörter der Reihe nach an. Ein Wort im eigenen Satz können Sie wieder entfernen.</p><div class="built" aria-label="Ihr zusammengesetzter Satz">${r.chosen.length?r.chosen.map((i,j)=>`<button class="word" data-undo="${j}" type="button" ${readonly?'disabled':''} aria-label="Wort ${esc(tokens[i].token)} entfernen">${esc(tokens[i].token)}</button>`).join(''):'<span class="muted tiny">Hier entsteht Ihr Satz.</span>'}</div><div class="wordbank" aria-label="Wortkarten">${tokens.map((t,i)=>`<button type="button" class="word" data-word="${i}" ${readonly||r.chosen.includes(i)?'disabled':''}>${esc(t.token)}</button>`).join('')}</div>`;
 }else if(q.type==='open'){
  html+=`<label class="field" for="writtenAnswer">Ihre französische Antwort</label><textarea id="writtenAnswer" data-answer-text class="writing" spellcheck="false" placeholder="Schreiben Sie hier Ihre eigene Antwort …" ${readonly?'readonly':''}>${esc(r.text||'')}</textarea><p class="note">Andere korrekte, einfache Formulierungen sind erlaubt.</p>`;
 }else if(q.type==='scene'){
  const s=q.scene;html+=`<div class="sim-item"><h3>a · 1 Punkt</h3><p>${esc(s.a[0])}</p>${renderSubOptions('a',s.a,r,readonly)}</div><div class="sim-item"><h3>b · 1 Punkt</h3><p>${esc(s.b[0])}</p>${renderSubOptions('b',s.b,r,readonly)}</div><div class="sim-item"><h3>c · 2 Punkte</h3><p>${esc(s.prompt)}</p><label for="writtenAnswer" class="field">Ihre französische Antwort</label><textarea class="writing" id="writtenAnswer" data-answer-text spellcheck="false" ${readonly?'readonly':''} placeholder="Hier Ihre eigene Formulierung …">${esc(r.text||'')}</textarea><p class="tiny muted">Diese freie Antwort beurteilen Sie nach der Probe anhand von zwei Kriterien.</p></div>`;
 }
 if(!locked){
   if(!r.done&&!answer){html+=`<div class="task-footer"><button type="button" class="btn subtle small" data-action="hint">${r.hint?'Hilfe ausblenden':'Hilfe anzeigen'}</button><button type="button" class="btn primary next" data-action="check">${q.type==='open'?'Mit Muster vergleichen':'Antwort prüfen'}</button></div>`;if(r.hint)html+=`<div class="callout"><strong>Eine Hilfe zum Weiterdenken</strong><p>${esc(q.hint||GOALS[q.g-1].example)}</p></div>`;}
   if(answer&&!r.done&&q.type==='open'){html+=`<div class="answer"><h4>Eine mögliche Lösung</h4><p class="fr" lang="fr">${esc(q.model)}</p><p class="tiny muted">Ihre Antwort darf anders aussehen. Entscheidend sind die zwei Kriterien.</p></div><div class="feedback"><strong>Prüfen Sie Ihre Antwort</strong>${q.criteria.map((c,i)=>`<label class="checkrow"><input type="checkbox" data-self-check="${i}" ${r.ownChecks?.includes(i)?'checked':''} ${!(r.text||'').trim()?'disabled':''}><span>${esc(c)}</span></label>`).join('')}<p class="note" style="margin:10px 0 0">Pro erfülltes Kriterium 1 Punkt. Eine leere Antwort ergibt 0 Punkte.</p></div><div class="task-footer"><button class="btn primary next" data-action="grade-own" type="button">Selbstcheck abschliessen</button></div>`;}
   if(r.done){let full=r.points===q.max;let reply=full?'Diese Aufgabe haben Sie sicher gelöst.':r.points>0?'Ein Teil ist gelungen. Sehen Sie sich die richtige Form noch einmal an.':'Das hat noch nicht geklappt. Wiederholen Sie die Formulierung später.';
     if(q.type==='typed'&&r.points===1)reply='Fast richtig. Vergleichen Sie die Schreibweise Buchstabe für Buchstabe.';
     html+=`<div class="feedback ${full?'good':'fix'}" role="status"><strong>${r.points}/${q.max} Punkte · ${full?'Gelungen':'Weiter üben'}</strong><p>${reply}</p></div><div class="answer"><h4>${q.type==='open'?'Musterlösung':'Richtige Antwort'}</h4><p class="fr" lang="fr">${esc(q.type==='choice'?q.opts[q.right]:q.type==='typed'?q.solutions[0]:q.type==='order'?q.target:q.model)}</p>${q.explain?`<p class="note">${esc(q.explain)}</p>`:''}</div><div class="task-footer"><span class="tiny muted">${r.assisted?'Mit Hilfe bearbeitet':'Ohne angezeigte Lösung bearbeitet'}</span><button class="btn primary next" data-action="next" type="button">${session?.step===session?.tasks?.length-1?'Runde abschliessen':'Nächste Aufgabe →'}</button></div>`;}
 }
 return html;
}
function renderSubOptions(part,sub,r,readonly){return `<div class="options" role="group" aria-label="Antworten ${part}">${sub[1].map((o,i)=>`<button type="button" class="opt ${r[part]===i?'selected':''}" data-part="${part}" data-subpick="${i}" ${readonly?'disabled':''} aria-pressed="${r[part]===i}"><span class="round">${r[part]===i?'✓':''}</span>${esc(o)}</button>`).join('')}</div>`;}
function sessionPage(){if(!session)return diagnosticsPage();let s=session,q=s.tasks[s.step],r=getResponse(),locked=s.kind==='diag'||s.kind==='sim';
 if(s.phase==='review')return reviewPage();if(s.phase==='summary')return practiceSummary();if(!q)return '<p>Keine Aufgabe ausgewählt.</p>';
 const label=s.kind==='diag'?`Diagnose ${s.version===1?'A':'B'}`:s.kind==='sim'?'Generalprobe':s.kind==='quick'?'Meine 8er-Runde':`${GOALS[s.goal-1].title} · ${MODE.find(m=>m.id===s.mode)?.title}`;
 let total=s.tasks.length,percent=Math.round(s.step/total*100);
 let sect=s.kind==='sim'?(s.step<12?'Teil A · Wortschatz schreiben':s.step<24?'Teil B · Verstehen':'Teil C · Sprache anwenden'):'';
 return `<div class="backstrip"><button class="btn subtle small" data-action="quit-session">← Training verlassen</button><span>${esc(label)}${sect?' · '+esc(sect):''}</span></div>
 <div class="flex-between"><div><div class="eyebrow">${locked?'ÜBERPRÜFUNG · OHNE HILFSMITTEL':'TRAINIEREN · SOFORTIGES FEEDBACK'}</div><h1>${esc(label)}</h1></div><div><strong>Aufgabe ${s.step+1} / ${total}</strong>${s.kind==='sim'?'<div class="tiny muted">Zeit: <span id="elapsedClock">00:00</span></div>':''}</div></div>
 <div class="mini-progress" role="progressbar" aria-valuenow="${s.step}" aria-valuemin="0" aria-valuemax="${total}" aria-label="Aufgabenfortschritt"><span style="width:${percent}%"></span></div>
 ${locked?`<div class="callout"><p><strong>Testmodus:</strong> Erst selbst lösen, am Schluss kontrollieren. ${s.kind==='sim'?'Für die Probe sind 40 Minuten vorgesehen.':'Für die Diagnose reichen ungefähr 15 Minuten.'} Ihre Ergebnisse werden nach der Auswertung gespeichert.</p></div>`:''}
 <section class="taskbox">${renderQuestion(q,r,s.kind)}</section>
 ${locked?`<div class="task-footer"><button class="btn secondary" data-action="prev" ${s.step===0?'disabled':''}>← Zurück</button><button class="btn primary next" data-action="test-next">${s.step===total-1?'Antworten abgeben und kontrollieren':'Weiter →'}</button></div><p class="fineprint">Sie können Antworten bis zur Abgabe ändern. Bei freien Sätzen wird am Schluss anhand einer Checkliste verglichen.</p>`:''}`;
}
function performCheck(){if(!session)return;collectInput();const q=session.tasks[session.step],r=getResponse();if(r.done)return;
 if(q.type==='open'){r.reveal=true;r.assisted=!!r.hint;render();return;}
 let points=0;
 if(q.type==='choice'){
  if(r.choice==null){toast('Wählen Sie zuerst eine Antwort.');return;}points=r.choice===q.right?1:0;
 }else if(q.type==='typed'){
  if(!String(r.text||'').trim()){toast('Schreiben Sie zuerst eine Antwort.');return;}points=gradeText(r.text,q.solutions);
 }else if(q.type==='order'){
  if(!r.chosen?.length){toast('Ordnen Sie zuerst mindestens ein Wort zu.');return;}
  const built=r.chosen.map(i=>r.tokens[i].token).join(' ');
  if(normalize(built)===normalize(q.target))points=2;
  else {const words=q.target.split(' '),placed=r.chosen.map(i=>r.tokens[i].token),correct=placed.filter((v,i)=>v===words[i]).length;points=placed.length===words.length&&correct>=words.length-2?1:0;}
 }
 r.points=points;r.assisted=!!r.hint;r.done=true;record(q.g,q,points,r.assisted);render();
}
function gradeOwn(){if(!session)return;collectInput();let q=session.tasks[session.step],r=getResponse();if(q.type!=='open'||!r.reveal)return;
 let checked=$$('[data-self-check]:checked').map(x=>+x.dataset.selfCheck);let points=(r.text||'').trim()?checked.length:0;r.ownChecks=checked;r.points=points;r.assisted=!!r.hint;r.done=true;record(q.g,q,points,r.assisted);render();
}
function advancePractice(){if(!session)return;let r=getResponse();if(!r.done){toast('Prüfen Sie zuerst Ihre Antwort.');return;}if(session.step===session.tasks.length-1){session.phase='summary';}else session.step++;render();window.scrollTo(0,0);}
function testAdvance(){if(!session)return;collectInput();let s=session;if(s.step===s.tasks.length-1){s.phase='review';s.reviewIndex=0;}else s.step++;render();window.scrollTo(0,0);}
function scoreOne(q,r){
 if(q.type==='typed')return gradeText(r.text||'',q.solutions);
 if(q.type==='choice')return r.choice===q.right?1:0;
 if(q.type==='order')return normalize((r.chosen||[]).map(i=>r.tokens[i].token).join(' '))===normalize(q.target)?2:0;
 if(q.type==='open')return Number(r.selfPoints||0);
 if(q.type==='scene')return Number(r.a===q.scene.a[2])+Number(r.b===q.scene.b[2])+Number(r.selfPoints||0);
 return 0;
}
function reviewPage(){let s=session;if(!s)return diagnosticsPage();let indices=s.tasks.map((q,i)=>(q.type==='open'||q.type==='scene')?i:-1).filter(i=>i>=0);let idx=indices[s.reviewIndex];let q=s.tasks[idx],r=s.responses[idx]||{};
 if(!q){finalizeCheck();return resultPage();}
 const story=q.type==='scene'?q.scene.story:'',prompt=q.type==='scene'?q.scene.prompt:q.p,model=q.type==='scene'?q.scene.model:q.model,criteria=q.type==='scene'?q.scene.criteria:q.criteria;
 return `<div class="eyebrow">SCHRITT 2 · ANTWORTEN SELBST PRÜFEN</div><h1>Ihre eigenen Sätze vergleichen</h1><p class="lead">Bei freien Antworten können verschiedene französische Sätze richtig sein. Vergleichen Sie Ihre Formulierung mit den zwei konkreten Kriterien.</p><div class="mini-progress"><span style="width:${Math.round(s.reviewIndex/indices.length*100)}%"></span></div>
 <section class="taskbox"><div class="task-top"><span>Lernziel ${q.g} · Antwort ${s.reviewIndex+1} von ${indices.length}</span><span class="pill">2 Punkte möglich</span></div>${story?`<div class="textcard"><span class="eyebrow">Situation</span><p>${esc(story)}</p></div>`:''}
 <h2>${esc(prompt)}</h2><div class="answer"><h4>Ihre Antwort</h4><p lang="fr" style="white-space:pre-wrap">${esc((r.text||'').trim()||'– keine Antwort –')}</p></div>
 <div class="answer"><h4>Eine mögliche richtige Lösung</h4><p class="fr" lang="fr">${esc(model)}</p></div>
 <div class="feedback"><strong>Welche Kriterien erfüllt Ihre Antwort?</strong>${criteria.map((c,i)=>`<label class="checkrow"><input type="checkbox" data-review-check="${i}" ${r.reviewChecks?.includes(i)?'checked':''} ${(r.text||'').trim()?'':'disabled'}><span>${esc(c)}</span></label>`).join('')}
 <p class="fineprint" style="margin:9px 0 0">Ein Häkchen gibt 1 Punkt. Sinnvolle andere Antworten sind richtig. Eine leere Antwort gibt 0 Punkte.</p></div>
 <div class="task-footer"><button class="btn primary next" data-action="review-next">${s.reviewIndex===indices.length-1?'Auswertung anzeigen →':'Nächste Antwort prüfen →'}</button></div></section>`;
}
function reviewNext(){let s=session;if(!s)return;let ids=s.tasks.map((q,i)=>['open','scene'].includes(q.type)?i:-1).filter(i=>i>=0),index=ids[s.reviewIndex],r=s.responses[index]||{};r.reviewChecks=$$('[data-review-check]:checked').map(x=>+x.dataset.reviewCheck);r.selfPoints=(r.text||'').trim()?r.reviewChecks.length:0;s.responses[index]=r;
 if(s.reviewIndex===ids.length-1){finalizeCheck();}else{s.reviewIndex++;render();window.scrollTo(0,0);}
}
function finalizeCheck(){let s=session;if(!s)return;let cap=s.kind==='sim'?{understand:4,recall:4,apply:2}:{understand:1,recall:2,apply:2};let byGoal={};for(const g of GOALS)byGoal[g.id]={understand:0,recall:0,apply:0,total:0,max:s.kind==='sim'?10:5,caps:{...cap}};
 s.tasks.forEach((q,i)=>{let r=s.responses[i]||{},v=scoreOne(q,r),x=byGoal[q.g];if(q.type==='choice')x.understand+=v;else if(q.type==='typed')x.recall+=v;else if(q.type==='open')x.apply+=v;else if(q.type==='scene'){x.understand+=(r.a===q.scene.a[2]?1:0)+(r.b===q.scene.b[2]?1:0);x.apply+=r.selfPoints||0;}
 if(v<q.max){let m=q.type==='typed'?'recall':q.type==='open'||q.type==='scene'?'use':'meaning';state.opened[`weak-${q.g}-${m}`]=(state.opened[`weak-${q.g}-${m}`]||0)+1;}
 });
 for(const x of Object.values(byGoal))x.total=x.understand+x.recall+x.apply;
 const result={id:`${s.kind}-${Date.now()}`,kind:s.kind==='sim'?'sim':'diag',version:s.version||null,at:new Date().toISOString(),total:Object.values(byGoal).reduce((n,x)=>n+x.total,0),max:s.kind==='sim'?60:30,byGoal,duration:Date.now()-s.started};
 if(s.kind==='sim'){state.simulations.push(result);state.simulations=state.simulations.slice(-12);}else{state.diagnostics.push(result);state.diagnostics=state.diagnostics.slice(-16);}
 persist();lastResult=result;session=null;go('result');render();window.scrollTo(0,0);
}
function practiceSummary(){let s=session,scored=s.tasks.map((q,i)=>({q,r:s.responses[i]||{}})),done=scored.filter(x=>x.r.done),perfect=done.filter(x=>x.r.points===x.q.max&&!x.r.assisted).length,needs=done.filter(x=>x.r.points<x.q.max).length,points=done.reduce((n,x)=>n+x.r.points,0),possible=done.reduce((n,x)=>n+x.q.max,0);let goal=s.goal||1;
 return wrapper('Ihre Runde ist abgeschlossen','GUT GEÜBT · ERGEBNIS','Sie haben aktiv geübt und sofort kontrolliert. Entscheidend ist jetzt, was Sie ohne Vorlage wiederholen können.')+`<div class="stats"><div class="stat"><strong>${done.length}</strong><span>bearbeitete Aufgaben</span></div><div class="stat"><strong>${perfect}</strong><span>ohne Hilfe ganz richtig</span></div><div class="stat"><strong>${needs}</strong><span>nochmals üben</span></div><div class="stat"><strong>${studyPoints()}</strong><span>Lernpunkte insgesamt</span></div></div><section class="surface"><h2>Was ist der nächste gute Schritt?</h2><p>${needs?'Wiederholen Sie zuerst die Aufgaben, die noch nicht gelungen sind. Danach empfiehlt sich eine andere Übungsform.':'Die Runde ist gelungen. Versuchen Sie als Nächstes eine andere Übungsform – besonders das eigene Schreiben.'}</p><div class="actions">${btn('Nochmals gezielt üben','review-errors','primary')}${btn('Lernziel öffnen','goal/'+goal,'secondary')}${btn('Zu den Diagnosetests','diagnose','secondary')}</div></section><p class="fineprint">Die Lernpunkte sind nur eine Trainingsanzeige, keine Schulnote oder Prüfungsvorhersage.</p>`;
}
function ratioPart(a,b){return b?Math.round(a/b*100):0;}
function resultPage(){let z=lastResult||lastAnyResult();if(!z)return wrapper('Noch keine Auswertung','MEIN STAND','Beginnen Sie mit Diagnose A. Danach sehen Sie hier Ihre Ergebnisse pro Lernziel.')+btn('Diagnose auswählen','diagnose','primary');
 let diag=z.kind==='diag';const totals=GOALS.map(g=>({g:g.id,x:z.byGoal[g.id]}));const needs=totals.slice().sort((a,b)=>a.x.total/a.x.max-b.x.total/b.x.max);let completed=totals.filter(({x})=>x.total/x.max>=.89&&x.apply>0&&x.recall>0).length;
 return wrapper('Ihr Lernstand – und wie es weitergeht',`${diag?'DIAGNOSE '+(z.version===1?'A':'B'):'GENERALPROBE'} · ${formatDate(z.at)}`,`Sie haben ${z.total} von ${z.max} möglichen Punkten erreicht. Es geht nicht um eine Note: Schauen Sie vor allem, bei welchem Lernziel Sie noch gezielt üben können.`)+
 `<div class="stats"><div class="stat"><strong>${z.total}/${z.max}</strong><span>Punkte insgesamt</span></div><div class="stat"><strong>${completed}/6</strong><span>Lernziele gut nachgewiesen</span></div><div class="stat"><strong>${formatDuration(z.duration)}</strong><span>Bearbeitungszeit inkl. Selbstcheck</span></div><div class="stat"><strong>6</strong><span>Lernziele einzeln ausgewertet</span></div></div>
 <section class="surface"><div class="eyebrow">Was empfehle ich jetzt?</div>${needs.slice(0,2).map(({g,x},i)=>{const rec=modeRecommendation(g);return `<div class="review-row"><div><div class="tiny muted">${i===0?'Als Erstes üben':'Danach üben'} · Lernziel ${g}</div><strong>${esc(GOALS[g-1].title)}</strong><p>${esc(goalStatus(g).detail)} ${esc(rec.reason)}</p></div>${btn('Übung öffnen →','practice/'+g+'/'+rec.mode,'primary small')}</div>`;}).join('')}<div class="actions" style="margin-top:16px">${btn('Zurück zu den sechs Lernzielen','goals','secondary')}${btn('Erneut testen','diagnose','secondary')}</div></section>
 <div class="section-head"><div><h2>Alle Lernziele im Detail</h2><p>${diag?'Je 5 mögliche Punkte':'Je 10 mögliche Punkte'} – bewusst auf drei Fähigkeiten verteilt.</p></div><button type="button" class="btn subtle small" data-action="print">Auswertung drucken</button></div><div class="summarygrid">${GOALS.map(g=>{let x=z.byGoal[g.id],status=goalStatus(g.id),rc=modeRecommendation(g.id);return `<article class="resultcard"><div class="resulthead"><strong>${g.id} · ${esc(g.title)}</strong><span class="score ${x.total/x.max>=.8?'positive':'warn'}">${x.total}/${x.max}</span></div><div class="meter ${x.total/x.max>=.89?'good':''}" style="margin:13px 0"><span style="width:${qid(x.total/x.max*100)}%"></span></div><div class="skills"><div class="skill"><span>Verstehen</span><div class="meter"><span style="width:${ratioPart(x.understand,x.caps.understand)}%"></span></div><span>${x.understand}/${x.caps.understand}</span></div><div class="skill"><span>Schreiben</span><div class="meter"><span style="width:${ratioPart(x.recall,x.caps.recall)}%"></span></div><span>${x.recall}/${x.caps.recall}</span></div><div class="skill"><span>Anwenden</span><div class="meter"><span style="width:${ratioPart(x.apply,x.caps.apply)}%"></span></div><span>${x.apply}/${x.caps.apply}</span></div></div><p>${x.apply===0&&x.total>=x.max*.55?'Verstehen klappt besser als selbst formulieren. Das ist Ihr wichtigster nächster Schritt.':esc(goalStatus(g.id).detail)}</p><div class="actions">${btn('Passendes Training →','practice/'+g.id+'/'+rc.mode,'secondary small')}</div></article>`;}).join('')}</div>
 <section class="surface" style="margin-top:20px"><h2>So lesen Sie die Ergebnisse</h2><p>Eine richtig angekreuzte Antwort zeigt, dass Sie etwas erkennen. Zum Beweis, dass Sie es <strong>selbst anwenden</strong> können, brauchen Sie eigene französische Sätze. Freie Antworten haben Sie deshalb selbst mithilfe zweier Kriterien kontrolliert.</p><p class="fineprint">Die automatische Prüfung erkennt Schreibweisen und kleine Tippfehler, nicht jede denkbare sinnvolle Alternative. Ihr Ergebnis ist eine Lernhilfe, keine verbindliche Note. Weitere korrekte Formulierungen sind möglich.</p></section>`;
}
function progressPage(){const points=studyPoints(),seen=new Set(state.events.map(e=>e.id)).size,days=new Set(state.events.map(e=>e.at.slice(0,10))).size,diagnostics=state.diagnostics.slice().reverse(),sims=state.simulations.slice().reverse(),weak=state.events.filter(e=>e.points<e.max).length;
 let badges=[['Erster Versuch',state.events.length>=1,'Mindestens eine Übung ausprobiert.'],['Fünf Übungen',state.events.length>=5,'Fünf Aufgaben bearbeitet.'],['Schreiben geübt',state.events.some(e=>e.type==='typed'&&e.points>0),'Eine Wendung aktiv geschrieben.'],['Eigene Sätze',state.events.some(e=>e.type==='open'&&e.points>0),'Einen eigenen Satz mit Kriterien geprüft.'],['Wiederholt',days>=2,'An mindestens zwei Tagen geübt.']];
 return wrapper('Mein Lernstand','FORTSCHRITT · AUF DIESEM GERÄT','Sehen Sie, wie viel Sie gearbeitet haben, welche Übungen Sie noch wiederholen sollten und wie Ihre Diagnosen ausgefallen sind.')+
 `<div class="stats"><div class="stat"><strong>${state.events.length}</strong><span>Übungsversuche</span></div><div class="stat"><strong>${seen}</strong><span>verschiedene Aufgaben</span></div><div class="stat"><strong>${points}</strong><span>Lernpunkte</span></div><div class="stat"><strong>${days}</strong><span>Trainingstage</span></div></div>
 <section class="surface"><h2>Meine Lernziele</h2><div class="review-rows">${GOALS.map(g=>{let v=latestGoal(g.id),r=modeRecommendation(g.id);return `<div class="review-row"><div><strong>${g.id} · ${esc(g.title)}</strong><p>${v?`Letzter Check ${v.total}/${v.max} · ${esc(goalStatus(g.id).label)}`:`${trainingStats(g.id).attempts} Übungen durchgeführt · noch keine Diagnose`}</p></div>${btn('Weiterlernen →','practice/'+g.id+'/'+r.mode,'secondary small')}</div>`;}).join('')}</div></section>
 <div class="grid-2"><section class="surface"><h2>Meine Trainingsschritte</h2>${badges.map(([title,earned,detail])=>`<div class="challenge"><span class="challenge-bubble">${earned?'✓':'○'}</span><div><strong>${esc(title)}</strong><p class="tiny muted" style="margin:3px 0">${esc(detail)}</p></div></div>`).join('')}<p class="fineprint" style="margin-top:12px">Keine Rangliste, keine Strafen. Lernpunkte zeigen nur Ihr Üben, nicht Ihre Prüfungsnote.</p></section><section class="surface"><h2>Meine letzten Diagnosen</h2>${diagnostics.length?diagnostics.slice(0,6).map(d=>`<div class="linebox"><span>Diagnose ${d.version===1?'A':'B'} · ${formatDate(d.at)}</span><strong>${d.total}/30</strong></div>`).join(''):'<p class="muted">Noch keine Diagnose abgeschlossen.</p>'}${sims.length?`<h3 style="margin-top:20px">Generalproben</h3>${sims.slice(0,4).map(d=>`<div class="linebox"><span>${formatDate(d.at)}</span><strong>${d.total}/60</strong></div>`).join('')}`:''}${btn('Neuen Check machen','diagnose','secondary')}</section></div>
 <section class="surface"><h2>Lernstand speichern oder mitnehmen</h2><p>Ihr Lernstand bleibt normalerweise in diesem Browser gespeichert. Für die Arbeit an einem anderen Gerät können Sie ihn als JSON-Datei exportieren und dort wieder einlesen.</p><div class="actions"><button class="btn primary" type="button" data-action="export">Lernstand exportieren</button><label class="btn secondary" for="importFile" style="display:inline-flex;align-items:center;cursor:pointer">Lernstand importieren</label><input id="importFile" type="file" accept=".json,application/json" style="position:absolute;left:-9999px" aria-label="Lernstand-Datei zum Import auswählen"><button class="btn subtle" type="button" data-action="reset">Alles auf diesem Gerät zurücksetzen</button></div><p class="fineprint" style="margin-top:12px">Es werden nur Ergebnisse und Übungsfortschritte gespeichert, keine Namen und keine selbst geschriebenen Antworten. Beim Import ersetzt die Datei den bisherigen Lernstand auf diesem Gerät.</p></section>`;
}
function probePage(){return wrapper('Eine echte Generalprobe','40 MINUTEN · 60 PUNKTE · OHNE HILFEN','Trainieren Sie den Ablauf der neuen Lernkontrolle. Die Aufgaben sind neu und unterscheiden sich von den Fragen des Prüfungspapiers.')+
 `<div class="grid-3"><article class="tile"><span class="stepnum">TEIL A · 24 PUNKTE</span><h3>Wörter selbst schreiben</h3><p>12 deutsche Vorgaben. Schreiben Sie die französischen Wendungen ohne Wortliste.</p></article><article class="tile"><span class="stepnum">TEIL B · 12 PUNKTE</span><h3>Verstehen und entscheiden</h3><p>12 kurze Situationen. Wählen Sie jeweils die passende Bedeutung oder Reaktion.</p></article><article class="tile"><span class="stepnum">TEIL C · 24 PUNKTE</span><h3>Französisch anwenden</h3><p>6 Situationen. Je zwei Verständnisaufgaben und eine eigene kurze Formulierung.</p></article></div>
 <section class="surface" style="margin-top:22px"><div class="eyebrow">So gehen Sie vor</div><h2>Einmal wie in der Lernkontrolle</h2><p>Arbeiten Sie allein und ohne Übersetzungswerkzeug. Bei einer Generalprobe sehen Sie während der Bearbeitung keine Lösungen. Danach werden eindeutige Antworten automatisch kontrolliert. Sechs freie Antworten bewerten Sie selbst mit konkreten Kriterien.</p><div class="callout"><p><strong>Wichtig:</strong> Die echte Lernkontrolle zählt 60 Punkte. Pro Lernziel sind es 10 Punkte: 4 fürs Schreiben, 4 fürs Verstehen und Entscheiden und 2 fürs eigene Formulieren.</p></div>${btn('Generalprobe starten →','startprobe','primary')} ${btn('Vorher noch gezielt üben','goals','secondary')}</section>`;
}
function reviewErrorsPage(){let byGoal=GOALS.map(g=>({g:g.id,n:state.events.filter(e=>e.g===g.id&&e.points<e.max).length,rec:modeRecommendation(g.id)}));return wrapper('8 Aufgaben – ein kurzer Durchgang','KLEINE SPIELERISCHE RUNDE','In dieser Runde kommen Ihre bisherigen Stolperstellen zuerst. Wenn noch keine Fehler gespeichert sind, erhalten Sie einen gemischten Einstieg aus verschiedenen Lernzielen.')+
 `<section class="surface"><h2>Was zählt?</h2><p>Sie bearbeiten acht Aufgaben am Stück. Für selbstständig gelöste Aufgaben wachsen Ihre Lernpunkte. Bei einem Fehler sehen Sie sofort, wie es richtig geht. Es gibt keine Uhr und keine Strafpunkte.</p><div class="actions">${btn('8er-Runde starten →','startquick','primary')}${btn('Alle sechs Lernziele','goals','secondary')}</div></section>
 <section class="surface"><h2>Letzte Übungsschwerpunkte</h2>${byGoal.map(z=>`<div class="linebox"><span><strong>${z.g} · ${esc(GOALS[z.g-1].title)}</strong></span><span>${z.n} frühere nicht vollständig gelungene Versuche</span></div>`).join('')}<p class="fineprint" style="margin-top:12px">Die Zahl zeigt frühere Versuche. Ein inzwischen behobener Fehler ist kein dauerhafter Schwachpunkt.</p></section>`;
}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.hidden=true,3100);}
function render(){if(!$('#app'))return;document.body.classList.toggle('large',!!state.fontLarge);$('#fontSize')?.setAttribute('aria-pressed',String(!!state.fontLarge));nav();let output='';
 if(route==='home')output=home();else if(route==='goals')output=goalsPage();else if(route==='diagnose')output=diagnosticsPage();else if(route==='goal')output=goalPage(currentGoal);else if(route==='vocab')output=vocabPage();else if(route==='progress')output=progressPage();else if(route==='probe')output=probePage();else if(route==='review-errors')output=reviewErrorsPage();else if(route==='session')output=sessionPage();else if(route==='result')output=resultPage();else output=home();
 $('#app').innerHTML=output;tickClock();
}
function parseRoute(){const bits=(location.hash||'#/home').replace(/^#\/?/,'').split('/');let name=bits[0]||'home';if(name==='startdiag'){begin('diag',{version:Number(bits[1])===2?2:1});return;}if(name==='startprobe'){begin('sim');return;}if(name==='startquick'){begin('quick');return;}
 if(name==='practice'){let g=Number(bits[1]),mode=bits[2];if(!GOALS.some(x=>x.id===g)||!MODE.some(x=>x.id===mode)){go('goals');return;}begin('practice',{goal:g,mode});return;}
 if(name==='goal'){route='goal';currentGoal=Math.max(1,Math.min(6,+bits[1]||1));}
 else if(['home','goals','diagnose','result','probe','vocab','progress','review-errors','session'].includes(name))route=name;
 else route='home';
 if(route==='session'&&!session){route='diagnose';}
 if(route==='result')lastResult=lastResult||lastAnyResult();
 render();
}
function leaveSession(){if(!session)return go('home');if(['diag','sim'].includes(session.kind)&&session.phase==='taking'&&!window.confirm('Test abbrechen? Ihre Antworten aus dieser Runde gehen dabei verloren. Bereits abgeschlossene Tests bleiben gespeichert.'))return;
 const path=session.goal?'goal/'+session.goal:'diagnose';session=null;go(path);}
function exportState(){const body=JSON.stringify({product:'Franz Lernatelier – Lernkontrolle Woche 43',exportedAt:new Date().toISOString(),learningState:state},null,2),blob=new Blob([body],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Franz Lernatelier Lernstand Woche 43.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Lernstand als Datei bereitgestellt.');}
async function importState(file){if(!file||file.size>2_000_000){toast('Bitte eine gültige Lernstand-Datei wählen (max. 2 MB).');return;}try{const raw=JSON.parse(await file.text()),x=raw.learningState;if(raw.product!=='Franz Lernatelier – Lernkontrolle Woche 43'||x?.version!==2||!Array.isArray(x.events)||!Array.isArray(x.diagnostics)||!Array.isArray(x.simulations))throw Error('Format');if(!window.confirm('Den aktuellen Lernstand auf diesem Gerät durch den importierten ersetzen?'))return;state={...defaultState(),...x};persist();session=null;lastResult=null;go('progress');render();toast('Lernstand übernommen.');}catch{toast('Datei konnte nicht gelesen werden. Verwenden Sie einen Export aus diesem Lernlabor.');}}
function resetAll(){if(window.confirm('Wollen Sie wirklich alle Ergebnisse und Trainingspunkte auf diesem Gerät löschen?')){if(window.confirm('Letzte Bestätigung: Der gespeicherte Lernstand wird endgültig zurückgesetzt.')){state=defaultState();persist();session=null;lastResult=null;go('home');render();toast('Lernstand zurückgesetzt.');}}}
document.addEventListener('click',ev=>{
 const start=ev.target.closest('[data-go]');if(start){ev.preventDefault();go(start.dataset.go);return;}
 const el=ev.target.closest('button');if(!el)return;
 if(el.id==='fontSize'){state.fontLarge=!state.fontLarge;persist();render();return;}
 if(el.dataset.pick!=null){let r=getResponse();if(!r||r.done)return;collectInput();r.choice=Number(el.dataset.pick);render();return;}
 if(el.dataset.subpick!=null){let r=getResponse();if(!r)return;collectInput();r[el.dataset.part]=Number(el.dataset.subpick);render();return;}
 if(el.dataset.word!=null){const r=getResponse();if(!r||r.done)return;r.chosen??=[];let i=Number(el.dataset.word);if(!r.chosen.includes(i))r.chosen.push(i);render();return;}
 if(el.dataset.undo!=null){let r=getResponse();if(!r||r.done)return;r.chosen.splice(Number(el.dataset.undo),1);render();return;}
 const action=el.dataset.action;if(!action)return;
 if(action==='hint'){collectInput();let r=getResponse();r.hint=!r.hint;render();return;}
 if(action==='check')return performCheck();
 if(action==='grade-own')return gradeOwn();
 if(action==='next')return advancePractice();
 if(action==='prev'){collectInput();session.step=Math.max(0,session.step-1);render();window.scrollTo(0,0);return;}
 if(action==='test-next')return testAdvance();
 if(action==='review-next')return reviewNext();
 if(action==='quit-session')return leaveSession();
 if(action==='toggle-vocab'){showAllWords=!showAllWords;render();return;}
 if(action==='print')return window.print();
 if(action==='export')return exportState();
 if(action==='reset')return resetAll();
});
document.addEventListener('input',ev=>{
 if(ev.target.matches('[data-answer-text]')&&session){getResponse().text=ev.target.value;}
});
document.addEventListener('change',ev=>{
 if(ev.target.matches('#importFile')){importState(ev.target.files?.[0]);ev.target.value='';}
 if(ev.target.matches('[data-self-check]')){const r=getResponse();r.ownChecks=$$('[data-self-check]:checked').map(x=>+x.dataset.selfCheck);}
 if(ev.target.matches('[data-review-check]')&&session){const indices=session.tasks.map((q,i)=>['open','scene'].includes(q.type)?i:-1).filter(i=>i>=0),r=session.responses[indices[session.reviewIndex]]||{};r.reviewChecks=$$('[data-review-check]:checked').map(x=>+x.dataset.reviewCheck);session.responses[indices[session.reviewIndex]]=r;}
});
document.addEventListener('keydown',ev=>{
 if(ev.key==='Enter'&&ev.target.matches('#writtenAnswer')&&ev.target.tagName==='INPUT'&&session&&!['diag','sim'].includes(session.kind)){ev.preventDefault();performCheck();}
});
window.addEventListener('hashchange',()=>{parseRoute();window.scrollTo({top:0,behavior:'instant'});});
setInterval(tickClock,1000);
parseRoute();
// Der Testrahmen benutzt bewusst keine echte Prüfungsfrage wörtlich als ganzer Aufgabenkontext.
})();
