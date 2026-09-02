(() => {
  'use strict';
  function enhance(){
    document.title = 'Franz Lernatelier – Woche 36';
    const actions = document.querySelector('.topbar-actions');
    if(actions && !actions.querySelector('[data-back-to-atelier]')){
      const link = document.createElement('a');
      link.className = 'top-action app-link';
      link.href = '../../index.html';
      link.dataset.backToAtelier = '';
      link.innerHTML = '<span aria-hidden="true">←</span><span class="app-word">Lernatelier</span>';
      actions.prepend(link);
    }
    if(location.hash === '#training'){
      setTimeout(() => document.querySelector('[data-go="training"]')?.click(), 80);
    }
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', enhance) : enhance();
})();
