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

    addMission2SpeakingGuide();
  }

  function addMission2SpeakingGuide(){
    if(!document.getElementById('m2-speaking-guide-style')){
      const style = document.createElement('style');
      style.id = 'm2-speaking-guide-style';
      style.textContent = `
        .m2-speaking-guide{
          margin:0 0 18px;
          border:1px solid #b9cbe0;
          border-radius:18px;
          overflow:hidden;
          background:linear-gradient(180deg,#f8fbff 0%,#ffffff 100%);
          box-shadow:0 8px 22px rgba(11,49,95,.07);
        }
        .m2-speaking-guide__head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:18px;
          padding:18px 20px 15px;
          background:#edf4ff;
          border-bottom:1px solid #cbd8e8;
        }
        .m2-speaking-guide__eyebrow{
          display:block;
          margin-bottom:3px;
          color:#0b315f;
          font-size:12px;
          font-weight:950;
          letter-spacing:.06em;
          text-transform:uppercase;
        }
        .m2-speaking-guide__head h3{
          margin:0;
          color:#10233f;
          font-size:23px;
          line-height:1.2;
          letter-spacing:-.015em;
        }
        .m2-speaking-guide__head p{
          margin:5px 0 0;
          max-width:760px;
          color:#526477;
          font-size:15px;
          line-height:1.45;
        }
        .m2-speaking-guide__badge{
          flex:0 0 auto;
          padding:7px 10px;
          border:1px solid #9db7d8;
          border-radius:999px;
          background:#fff;
          color:#0b315f;
          font-size:12px;
          font-weight:900;
          white-space:nowrap;
        }
        .m2-speaking-flow{
          display:grid;
          grid-template-columns:repeat(5,minmax(0,1fr));
          gap:9px;
          padding:15px 16px 13px;
        }
        .m2-speaking-step{
          position:relative;
          min-width:0;
          padding:13px 12px 12px;
          border:1px solid #d7e0ea;
          border-radius:14px;
          background:#fff;
        }
        .m2-speaking-step:not(:last-child)::after{
          content:"→";
          position:absolute;
          right:-10px;
          top:50%;
          z-index:2;
          transform:translateY(-50%);
          width:18px;
          height:18px;
          display:grid;
          place-items:center;
          border-radius:50%;
          background:#0b315f;
          color:#fff;
          font-size:11px;
          font-weight:950;
        }
        .m2-speaking-step__top{
          display:flex;
          align-items:center;
          gap:7px;
          margin-bottom:7px;
        }
        .m2-speaking-step__num{
          width:24px;
          height:24px;
          display:grid;
          place-items:center;
          flex:0 0 auto;
          border-radius:8px;
          background:#0b315f;
          color:#fff;
          font-size:12px;
          font-weight:950;
        }
        .m2-speaking-step__label{
          color:#526477;
          font-size:11px;
          font-weight:950;
          letter-spacing:.045em;
          text-transform:uppercase;
        }
        .m2-speaking-step strong{
          display:block;
          color:#10233f;
          font-size:15px;
          line-height:1.35;
        }
        .m2-speaking-step small{
          display:block;
          margin-top:5px;
          color:#526477;
          font-size:12px;
          line-height:1.35;
        }
        .m2-speaking-example{
          margin:0 16px 13px;
          padding:14px 15px;
          border:1px solid #d7dfdc;
          border-radius:14px;
          background:#fff;
        }
        .m2-speaking-example__title{
          display:flex;
          align-items:center;
          gap:8px;
          margin-bottom:10px;
          color:#10233f;
          font-size:14px;
          font-weight:950;
        }
        .m2-speaking-example__title span{
          width:26px;
          height:26px;
          display:grid;
          place-items:center;
          border-radius:9px;
          background:#e7f4f1;
          color:#177c73;
          font-weight:950;
        }
        .m2-dialogue{
          display:grid;
          gap:6px;
        }
        .m2-dialogue__line{
          display:grid;
          grid-template-columns:31px minmax(0,1fr);
          gap:8px;
          align-items:start;
          font-size:14px;
          line-height:1.42;
        }
        .m2-dialogue__speaker{
          width:27px;
          height:27px;
          display:grid;
          place-items:center;
          border-radius:50%;
          background:#edf4ff;
          color:#0b315f;
          font-size:12px;
          font-weight:950;
        }
        .m2-dialogue__line:nth-child(even) .m2-dialogue__speaker{
          background:#fff0eb;
          color:#b9422f;
        }
        .m2-speaking-rounds{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:9px;
          padding:0 16px 16px;
        }
        .m2-speaking-round{
          padding:11px 12px;
          border-radius:13px;
          background:#f7f9fb;
          border:1px solid #d7dfdc;
          color:#526477;
          font-size:12px;
          line-height:1.4;
        }
        .m2-speaking-round strong{
          display:block;
          margin-bottom:3px;
          color:#10233f;
          font-size:13px;
        }
        .m2-speaking-round--1{border-top:3px solid #177c73}
        .m2-speaking-round--2{border-top:3px solid #e9a434}
        .m2-speaking-round--3{border-top:3px solid #e35d43}
        .m2-speaking-tip{
          display:flex;
          align-items:flex-start;
          gap:10px;
          margin:0 16px 16px;
          padding:10px 12px;
          border-radius:12px;
          background:#fff6df;
          color:#5e4a18;
          font-size:12px;
          line-height:1.45;
        }
        .m2-speaking-tip b{
          flex:0 0 auto;
          width:23px;
          height:23px;
          display:grid;
          place-items:center;
          border-radius:7px;
          background:#e9a434;
          color:#fff;
        }
        @media(max-width:960px){
          .m2-speaking-flow{grid-template-columns:repeat(2,minmax(0,1fr))}
          .m2-speaking-step:not(:last-child)::after{display:none}
          .m2-speaking-step:last-child{grid-column:1/-1}
        }
        @media(max-width:680px){
          .m2-speaking-guide__head{display:block}
          .m2-speaking-guide__badge{display:inline-flex;margin-top:10px}
          .m2-speaking-flow,.m2-speaking-rounds{grid-template-columns:1fr}
          .m2-speaking-step:last-child{grid-column:auto}
        }
      `;
      document.head.appendChild(style);
    }

    const mission = document.getElementById('mission-2');
    if(!mission) return;

    const cards = [...mission.querySelectorAll('.activity-card')];
    const activityD = cards.find(card => {
      const title = card.querySelector('.activity-head h2')?.textContent?.trim() || '';
      return /^D\.\s*Sprechtraining/i.test(title);
    });
    if(!activityD) return;

    const body = activityD.querySelector('.activity-body');
    if(!body || body.querySelector('[data-m2-speaking-guide]')) return;

    const guide = document.createElement('section');
    guide.className = 'm2-speaking-guide';
    guide.dataset.m2SpeakingGuide = '';
    guide.setAttribute('aria-label','Gesprächsfahrplan für Aufgabe D');
    guide.innerHTML = `
      <div class="m2-speaking-guide__head">
        <div>
          <span class="m2-speaking-guide__eyebrow">Gesprächsfahrplan</span>
          <h3>So läuft Ihr Mini-Gespräch ab</h3>
          <p>Sie müssen nicht improvisieren. Folgen Sie zuerst diesen fünf Schritten. Mit jeder Runde schauen Sie weniger auf die Hilfe.</p>
        </div>
        <span class="m2-speaking-guide__badge">30 Sekunden · 2 Rollen</span>
      </div>

      <div class="m2-speaking-flow">
        <div class="m2-speaking-step">
          <div class="m2-speaking-step__top"><span class="m2-speaking-step__num">1</span><span class="m2-speaking-step__label">Start</span></div>
          <strong lang="fr">Bonjour ! / Salut !</strong>
          <small>Begrüssen Sie Ihre Partnerperson.</small>
        </div>
        <div class="m2-speaking-step">
          <div class="m2-speaking-step__top"><span class="m2-speaking-step__num">2</span><span class="m2-speaking-step__label">Fragen</span></div>
          <strong lang="fr">Comment ça va ?</strong>
          <small>Fragen Sie nach dem Befinden.</small>
        </div>
        <div class="m2-speaking-step">
          <div class="m2-speaking-step__top"><span class="m2-speaking-step__num">3</span><span class="m2-speaking-step__label">Antwort + Rückfrage</span></div>
          <strong lang="fr">Ça va bien, merci. Et toi ?</strong>
          <small>Wählen Sie eine Antwort aus der Skala.</small>
        </div>
        <div class="m2-speaking-step">
          <div class="m2-speaking-step__top"><span class="m2-speaking-step__num">4</span><span class="m2-speaking-step__label">Reagieren</span></div>
          <strong lang="fr">Super ! / Désolé(e).</strong>
          <small>Reagieren Sie passend und antworten Sie auf «Et toi ?».</small>
        </div>
        <div class="m2-speaking-step">
          <div class="m2-speaking-step__top"><span class="m2-speaking-step__num">5</span><span class="m2-speaking-step__label">Abschluss</span></div>
          <strong lang="fr">À bientôt ! / Au revoir !</strong>
          <small>Beenden Sie das Gespräch freundlich.</small>
        </div>
      </div>

      <div class="m2-speaking-example">
        <div class="m2-speaking-example__title"><span aria-hidden="true">▶</span> Ein mögliches Gespräch</div>
        <div class="m2-dialogue">
          <div class="m2-dialogue__line"><span class="m2-dialogue__speaker">A</span><span lang="fr"><b>Salut ! Comment ça va ?</b></span></div>
          <div class="m2-dialogue__line"><span class="m2-dialogue__speaker">B</span><span lang="fr">Ça va bien, merci. <b>Et toi ?</b></span></div>
          <div class="m2-dialogue__line"><span class="m2-dialogue__speaker">A</span><span lang="fr">Ça va très bien.</span></div>
          <div class="m2-dialogue__line"><span class="m2-dialogue__speaker">B</span><span lang="fr"><b>Super !</b></span></div>
          <div class="m2-dialogue__line"><span class="m2-dialogue__speaker">A</span><span lang="fr">À bientôt !</span></div>
          <div class="m2-dialogue__line"><span class="m2-dialogue__speaker">B</span><span lang="fr">Salut !</span></div>
        </div>
      </div>

      <div class="m2-speaking-rounds" aria-label="Drei Trainingsrunden">
        <div class="m2-speaking-round m2-speaking-round--1">
          <strong>Runde 1 · mit Hilfe</strong>
          Fahrplan und Beispiel dürfen offen bleiben. Lesen ist erlaubt.
        </div>
        <div class="m2-speaking-round m2-speaking-round--2">
          <strong>Runde 2 · weniger Hilfe</strong>
          Schauen Sie nur noch auf die fünf Schritte – nicht auf das Beispiel.
        </div>
        <div class="m2-speaking-round m2-speaking-round--3">
          <strong>Runde 3 · möglichst frei</strong>
          Blick zur Partnerperson. Rollen tauschen und möglichst wenig ablesen.
        </div>
      </div>

      <div class="m2-speaking-tip">
        <b>+</b>
        <span><strong>Schon vor 30 Sekunden fertig?</strong> Fragen Sie <span lang="fr">«Pourquoi ?»</span> und antworten Sie mit <span lang="fr">«parce que …»</span>. Wenn etwas unklar ist: <span lang="fr">«Est-ce que tu peux répéter ?»</span></span>
      </div>
    `;

    body.prepend(guide);
  }

  // Missionen werden beim Niveauwechsel neu gerendert. Deshalb wird die
  // Gesprächshilfe nach DOM-Änderungen automatisch wieder an Aufgabe D ergänzt.
  const observer = new MutationObserver(() => addMission2SpeakingGuide());

  function start(){
    enhance();
    if(document.body) observer.observe(document.body,{childList:true,subtree:true});
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', start)
    : start();
})();
