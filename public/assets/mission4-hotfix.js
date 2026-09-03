(() => {
  'use strict';

  // Mission 04 · Teil B (Vrai/Faux)
  // Richtiger Lösungsschlüssel:
  // 1 Vrai · 2 Faux · 3 Vrai · 4 Vrai · 5 Faux · 6 Vrai
  const correct = [true, false, true, true, false, true];

  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-action="check-m4-quiz"]');
    if(!button) return;

    // Die ursprüngliche Auswertung im eingebetteten Wochenmodul enthält
    // bei Aussage 4 und 5 einen vertauschten Lösungsschlüssel. Wir fangen
    // ausschliesslich diesen einen Prüfbutton ab und werten korrekt aus.
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const rows = [...document.querySelectorAll('#mission-4 .quiz-row')];
    let answered = 0;
    let score = 0;

    correct.forEach((expected, index) => {
      const selected = rows[index]?.querySelector('.option-btn.is-selected');
      if(!selected) return;
      answered += 1;
      const actual = selected.dataset.quizValue === 'true';
      if(actual === expected) score += 1;
    });

    const feedback = document.getElementById('fb-m4-quiz');
    if(!feedback) return;

    feedback.hidden = false;

    if(answered < correct.length){
      feedback.className = 'feedback warn';
      feedback.innerHTML = `<strong>${score} von ${answered} beantworteten Aussagen richtig.</strong> Beantworten Sie zuerst alle sechs Aussagen.`;
      return;
    }

    feedback.className = `feedback ${score === 6 ? 'good' : score >= 4 ? 'warn' : 'bad'}`;
    feedback.innerHTML = `<strong>${score} von 6 richtig.</strong> ${score === 6
      ? 'Sie haben die zentralen Informationen sicher gefunden.'
      : 'Lesen Sie Namen, Fächer, Familienstand, Wohnort und Berufsjahre nochmals gezielt nach.'}`;
  }, true);
})();
