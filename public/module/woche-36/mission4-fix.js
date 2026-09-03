(() => {
  'use strict';
  const correct = [true, false, true, true, false, true];
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-action="check-m4-quiz"]');
    if(!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const rows = [...document.querySelectorAll('#mission-4 .quiz-row')];
    let score = 0;
    correct.forEach((expected, i) => {
      const selected = rows[i]?.querySelector('.option-btn.is-selected');
      if(selected && (selected.dataset.quizValue === 'true') === expected) score += 1;
    });
    const feedback = document.getElementById('fb-m4-quiz');
    if(!feedback) return;
    feedback.hidden = false;
    feedback.className = `feedback ${score === 6 ? 'good' : score >= 4 ? 'warn' : 'bad'}`;
    feedback.innerHTML = `<strong>${score} von 6 richtig.</strong> ${score === 6 ? 'Sie haben die zentralen Informationen sicher gefunden.' : 'Lesen Sie Namen, Fächer, Familienstand, Wohnort und Berufsjahre nochmals gezielt nach.'}`;
  }, true);
})();
