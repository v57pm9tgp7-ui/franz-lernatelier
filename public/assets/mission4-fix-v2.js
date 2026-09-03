(() => {
  'use strict';

  const CORRECT = [true, false, true, true, false, true];

  function evaluateMission4Quiz(){
    const rows = [...document.querySelectorAll('#mission-4 .quiz-row')];
    let answered = 0;
    let score = 0;

    CORRECT.forEach((expected, index) => {
      const selected = rows[index]?.querySelector('.option-btn.is-selected');
      if(!selected) return;
      answered += 1;
      if((selected.dataset.quizValue === 'true') === expected) score += 1;
    });

    const feedback = document.getElementById('fb-m4-quiz');
    if(!feedback) return;
    feedback.hidden = false;

    if(answered < 6){
      feedback.className = 'feedback warn';
      feedback.innerHTML = `<strong>${score} von ${answered} beantworteten Aussagen richtig.</strong> Beantworten Sie zuerst alle sechs Aussagen.`;
      return;
    }

    feedback.className = `feedback ${score === 6 ? 'good' : score >= 4 ? 'warn' : 'bad'}`;
    feedback.innerHTML = `<strong>${score} von 6 richtig.</strong> ${score === 6
      ? 'Sie haben die zentralen Informationen sicher gefunden.'
      : 'Lesen Sie Namen, Fächer, Familienstand, Wohnort und Berufsjahre nochmals gezielt nach.'}`;
  }

  // Capture-Phase: verhindert zuverlässig, dass die alte fehlerhafte
  // runCheck-Auswertung desselben Buttons noch ausgeführt wird.
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-action="check-m4-quiz"]');
    if(!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    evaluateMission4Quiz();
  }, true);
})();
