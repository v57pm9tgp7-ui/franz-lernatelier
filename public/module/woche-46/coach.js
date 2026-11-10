'use strict';
(() => {
  const steps = [
    ['0–16 Min. · Allein', 'Zahlen aufbauen', 'zahlen', 'Zur Zahlenübersicht', 'Lesen Sie 70, 80 und 90. Lösen Sie im Trainer vier Hunderter. Wechseln Sie dann zu «Tausender» und lösen Sie vier weitere Aufgaben. Sprechen Sie eine grosse Zahl in zwei Gruppen.', 'Ich kann eine grosse Zahl bei «mille» teilen.', 'Lernheft S. 1–2'],
    ['16–27 Min. · Allein', 'Uhrzeiten mit Tageszeit sagen', 'zeiten', 'Zu den Uhrzeiten', 'Lösen Sie vier Aufgaben mit «moins» und vier mit Tageszeit. Lesen Sie jede verbesserte Antwort noch einmal mit «Il est …».', 'Ich kann erklären, welche Stunde ich bei Minute 45 nenne.', 'Lernheft S. 3–4'],
    ['27–38 Min. · Zu zweit', 'Einander Zahlen und Zeiten diktieren', 'partner', 'Zum Partnerdiktat', 'Nur A schaut aufs Gerät. A diktiert die vier Angaben, B notiert Ziffern und liest zurück. Vergleichen Sie mit «Wortlaut vergleichen». Ziehen Sie neue Angaben und wechseln Sie.', 'Beide haben einmal diktiert und einmal zurückgelesen.', 'Lernheft S. 4 für die Antworten'],
    ['38–57 Min. · Allein', 'Alle 25 Verben trainieren', 'verben', 'Zum Verbentraining', '4 Minuten: Wiederholen Sie lire, acheter, ouvrir, manger und comprendre. Starten Sie für 10 Minuten «Alle 25 · gemischt». Werten Sie die Runde aus und üben Sie schwierige Formen weitere 5 Minuten.', 'Ich habe in beide Richtungen übersetzt und schwierige présent-Formen erneut abgerufen.', 'Lernheft S. 5–6 · Test in Woche 47'],
    ['57–72 Min. · Zu zweit', 'Zwei Marktgespräche üben', 'rollen', 'Zu den digitalen Übungskarten', 'Öffnen Sie denselben Fall und lesen Sie nur Ihre Rolle. Verhandeln Sie Preis, Zeit und Ort. Prüfen Sie Ihre Abmachung. Wechseln Sie Fall und Rolle und spielen Sie die schwierigste Stelle nochmals frei.', 'Wir können beide die Abmachung bestätigen und auf eine Rückfrage reagieren.', 'Lernheft S. 7 · Übungskarten auf dem Bildschirm'],
    ['72–77 Min. · Zu zweit', 'Den neuen Fall vorbereiten', 'aufnahme', 'Zur Vorbereitung mit Papierkarten', 'Holen Sie das Kartenpaar bei der Lehrperson. Merken Sie sich die eigenen Angaben. Klären Sie, wer eröffnet, und üben Sie eine Rückfrage. Legen Sie nach 5 Minuten Karten, Heft und Notizen weg.', 'Wir kennen unsere Rollen und können das Gespräch frei beginnen.', 'Neue Papierkarten von der Lehrperson'],
    ['77–90 Min. · Zu zweit', 'Das Rollenspiel aufnehmen und abgeben', 'aufnahme', 'Zur Anleitung für die Aufnahme', 'Öffnen Sie die Aufgabe in Teams. Prüfen Sie Bild und Ton für beide. Nehmen Sie 2–3 Minuten frei auf. Prüfen Sie die Vorschau, fügen Sie das Video an und geben Sie es ab.', 'Wir haben den Abgabestatus in Teams kontrolliert.', 'Teams · Aufgabe zum Verkaufsdialog']
  ];
  const key='franzatelier.coach.w46.1';
  let current=0;
  try {
    const saved=JSON.parse(localStorage.getItem(key));
    if(Number.isInteger(saved)&&saved>=0&&saved<=steps.length)current=saved;
  } catch {}
  const card=document.getElementById('coachCard'), list=document.getElementById('coachList');
  function element(tag,txt,cls) {
    const el=document.createElement(tag);
    if(txt)el.textContent=txt;
    if(cls)el.className=cls;
    return el;
  }
  function setStep(index) {
    if(index===current+1 && current!==5){
      const area=document.getElementById(steps[current][2]);
      const progress=area.querySelector('.progressControl input');
      if(progress && !progress.checked)progress.click();
    }
    current=index;
    try{localStorage.setItem(key,JSON.stringify(current));}catch{}
    render();
    const heading=card.querySelector('h2');
    heading.tabIndex=-1;
    heading.focus();
  }
  function action(text,index,cls) {
    const b=element('button',text,cls);
    b.type='button'; b.onclick=()=>setStep(index); return b;
  }
  function render() {
    card.replaceChildren(); list.replaceChildren();
    steps.forEach(([time,title],i)=>{
      const li=element('li',time+' · '+title);
      if(i===current){li.className='current';li.setAttribute('aria-current','step');}
      list.append(li);
    });
    if(current===steps.length) {
      card.append(element('h2','Sie haben die Unterrichtssequenz abgeschlossen.'),element('p','Woche 47: alle 25 Verben übersetzen und konjugieren. Woche 48: Zahlen und Uhrzeiten. Wählen Sie über die Übersicht eine Übung zum Wiederholen.'),action('Coach neu starten',0,'secondary'));
      return;
    }
    const [time,title,route,link,instruction,check,material]=steps[current];
    const bar=element('progress');bar.max=steps.length;bar.value=current;bar.setAttribute('aria-label','Abgeschlossene Schritte');
    const open=element('a',link+' →','btn primary');open.href='#'+route;
    const onward=document.querySelector('#'+route+' .next');
    open.addEventListener('click',()=>{
      if(onward){onward.href='#coach';onward.textContent='Zum Coach · Schritt abschliessen →';}
    });
    if(current===6)open.onclick=()=>setTimeout(()=>document.querySelector('#aufnahme article:nth-of-type(2)')?.scrollIntoView?.(),60);
    const controls=element('div',null,'coachControls');
    if(current>0)controls.append(action('Vorheriger Schritt',current-1,'secondary'));
    controls.append(action(current===6?'Abgabe geprüft · Abschliessen':'Erledigt · Nächster Schritt',current+1));
    card.append(element('p','Schritt '+(current+1)+' von '+steps.length+' · '+time,'eyebrow'),bar,element('h2',title),element('p',instruction),element('p',material,'tagline'),open,element('p','Vor dem Weitergehen: '+check,'box'),controls);
  }
  render();
  for(const section of document.querySelectorAll('main > section:not(#coach):not(#start)')) {
    for(const position of ['beforeend','afterbegin']){
      const back=element('a','← Zurück zum Unterrichtscoach','coachReturn');back.href='#coach';
      section.insertAdjacentElement(position,back);
    }
  }
})();
