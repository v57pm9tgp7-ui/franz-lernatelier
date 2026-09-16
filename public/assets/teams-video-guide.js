/* Woche 37/38 · Video direkt in Microsoft Teams aufnehmen */
(() => {
  'use strict';

  const TEAMS_GUIDE_MARKER = 'teams-video-guide-v1';

  function installStyle() {
    if (document.getElementById('teams-video-guide-style')) return;
    const style = document.createElement('style');
    style.id = 'teams-video-guide-style';
    style.textContent = `
      .teams-video-warning{
        margin:0 0 14px;padding:15px 17px;border:2px solid #efb86e;border-radius:15px;
        background:#fff8e9;color:#10233f
      }
      .teams-video-warning strong{display:block;margin-bottom:4px;font-size:1.05em;color:#8a5700}
      .teams-click-path{
        display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:13px 0 16px
      }
      .teams-click-path span{
        display:inline-flex;align-items:center;min-height:38px;padding:7px 10px;border:1px solid #bfd2e5;
        border-radius:10px;background:#f5f9fd;color:#0b315f;font-weight:900
      }
      .teams-click-path i{font-style:normal;color:#177c73;font-weight:950}
      .teams-step-note{
        margin-top:12px;padding:12px 14px;border-left:4px solid #177c73;border-radius:0 12px 12px 0;
        background:#f4fbf9;color:#455969
      }
      .teams-submit-check{
        margin-top:14px;padding:13px 15px;border:1px solid #b7ddca;border-radius:13px;background:#f7fff9
      }
      .teams-submit-check strong{color:#176c4b}
    `;
    document.head.appendChild(style);
  }

  function activityByTitle(mount, title) {
    return [...mount.querySelectorAll('.activity-card')].find(card =>
      card.querySelector('h2')?.textContent?.trim() === title
    );
  }

  function replaceBody(card, html) {
    const body = card?.querySelector('.activity-body');
    if (body) body.innerHTML = html;
  }

  function setActivityHeader(card, title, subtitle) {
    if (!card) return;
    const h2 = card.querySelector('.activity-head h2');
    const p = card.querySelector('.activity-head p');
    if (h2) h2.textContent = title;
    if (p && subtitle) p.textContent = subtitle;
  }

  function patchMission8() {
    const mount = document.getElementById('missionMount');
    if (!mount) return;

    const heading = mount.querySelector('.mission-hero h1');
    if (!heading || !/Ma vidéo|Vorstellungsvideo|Défi final/i.test(heading.textContent || '')) return;
    if (mount.querySelector(`[data-upgrade="${TEAMS_GUIDE_MARKER}"]`)) return;

    installStyle();

    const intro = activityByTitle(mount, 'Mein Vorstellungsvideo');
    if (intro) {
      setActivityHeader(
        intro,
        'Mein Vorstellungsvideo · direkt in Teams',
        'Nehmen Sie Ihre Vorstellung direkt in der Teams-Aufgabe auf. Verwenden Sie dafür die integrierte Flip-Videoaufzeichnung.'
      );
      const introBody = intro.querySelector('.activity-body');
      if (introBody) {
        const warning = document.createElement('div');
        warning.className = 'teams-video-warning';
        warning.dataset.upgrade = TEAMS_GUIDE_MARKER;
        warning.innerHTML = `
          <strong>Wichtig: Nicht mit der normalen Kamera-App des Handys filmen.</strong>
          Die Aufnahme wird direkt in Microsoft Teams erstellt. Sie müssen vorher keine Videodatei mit der normalen Handy-Kamera aufnehmen und danach auch keine separate Datei hochladen.
        `;
        introBody.prepend(warning);
      }
    }

    const prep = activityByTitle(mount, 'Die Aufnahme vorbereiten');
    setActivityHeader(
      prep,
      'Direkt in Teams aufnehmen',
      'Öffnen Sie die Teams-Aufgabe und starten Sie dort die integrierte Flip-Videoaufzeichnung.'
    );
    replaceBody(prep, `
      <div class="teams-video-warning" data-upgrade="${TEAMS_GUIDE_MARKER}">
        <strong>Keine normale Handy-Kamera verwenden.</strong>
        Öffnen Sie für die Aufnahme direkt die Aufgabe in Microsoft Teams. Der richtige Weg führt über «+ Neu» zur Flip-Videoaufzeichnung.
      </div>

      <div class="teams-click-path" aria-label="Klickweg in Teams">
        <span>Aufgaben</span><i>→</i>
        <span>Aufgabe öffnen</span><i>→</i>
        <span>+ Neu</span><i>→</i>
        <span>Flip-Videoaufzeichnung</span>
      </div>

      <ol class="learning-steps">
        <li><strong>Französisch-Team öffnen.</strong> Öffnen Sie in Microsoft Teams Ihr Französisch-Team und danach «Aufgaben».</li>
        <li><strong>Die richtige Lernkontrolle öffnen.</strong> Öffnen Sie die Aufgabe für das Vorstellungsvideo.</li>
        <li><strong>Zu Ihrer Arbeit gehen.</strong> Scrollen Sie zum Bereich «Meine Arbeit / Eigene Arbeit».</li>
        <li><strong>«+ Neu» wählen.</strong> Klicken Sie auf «+ Neu» und danach auf «Flip-Videoaufzeichnung» bzw. «Flip video recording».</li>
        <li><strong>Kamera und Mikrofon erlauben.</strong> Falls Teams nachfragt, erlauben Sie den Zugriff auf Kamera und Mikrofon.</li>
        <li><strong>Bildausschnitt prüfen.</strong> Stellen Sie das Gerät stabil und weit genug weg. Ihr ganzer Körper muss während der Aufnahme sichtbar sein.</li>
        <li><strong>Hilfen weglegen.</strong> Sprechkarte, Text und zweites Gerät liegen ausser Sicht.</li>
      </ol>

      <div class="teams-step-note">
        Teams erlaubt bei der Flip-Aufnahme bis zu 5 Minuten. Für diese Lernkontrolle sprechen Sie aber ungefähr <strong>60 Sekunden</strong>.
      </div>
    `);

    const review = activityByTitle(mount, 'Das Video ganz anschauen');
    setActivityHeader(
      review,
      'Aufnehmen und vollständig kontrollieren',
      'Sprechen Sie ungefähr 60 Sekunden frei. Sehen Sie die Aufnahme danach ganz an, bevor Sie sie übernehmen.'
    );
    replaceBody(review, `
      <ol class="learning-steps">
        <li><strong>Aufnahme starten.</strong> Drücken Sie in Teams den Aufnahme-Button und beginnen Sie erst dann zu sprechen.</li>
        <li><strong>Ungefähr 60 Sekunden frei sprechen.</strong> Nutzen Sie keine Sprechkarte und lesen Sie keinen Text ab.</li>
        <li><strong>Aufnahme stoppen.</strong> Beenden Sie die Aufnahme nach Ihrem Schlusssatz.</li>
        <li><strong>Vorschau vollständig anschauen.</strong> Kontrollieren Sie Bild, Ton und Inhalt von Anfang bis Ende.</li>
        <li><strong>Bei Bedarf neu aufnehmen.</strong> Wenn der ganze Körper nicht sichtbar ist, der Ton schlecht ist oder Sie stark ablesen, machen Sie eine neue Aufnahme.</li>
        <li><strong>Bei Bedarf kürzen.</strong> Wenn Teams die Funktion anbietet, können Sie unnötige Sekunden am Anfang oder Ende kürzen.</li>
      </ol>

      <div class="video-checks">
        <label><input type="checkbox" data-check="video.body" ${window.__dummy ? '' : ''}>Ich bin durchgehend von Kopf bis Fuss zu sehen.</label>
        <label><input type="checkbox" data-check="video.sound">Meine Stimme ist gut hörbar.</label>
        <label><input type="checkbox" data-check="video.duration">Meine Vorstellung dauert ungefähr 60 Sekunden.</label>
        <label><input type="checkbox" data-check="video.free">Ich spreche frei und lese nichts ab.</label>
        <label><input type="checkbox" data-check="video.content">Die geforderten Informationen sind enthalten.</label>
      </div>
    `);

    const submit = activityByTitle(mount, 'In Teams abgeben');
    setActivityHeader(
      submit,
      'Flip-Aufnahme hinzufügen und abgeben',
      'Übernehmen Sie die fertige Aufnahme in die Aufgabe und geben Sie erst danach ab.'
    );
    replaceBody(submit, `
      <ol class="learning-steps">
        <li><strong>Fertige Aufnahme verwenden.</strong> Bestätigen Sie in der Flip-Aufzeichnung die Aufnahme, die Sie abgeben möchten.</li>
        <li><strong>Zur Aufgabe zurückkehren.</strong> Kontrollieren Sie, dass die Videoaufnahme jetzt unter «Meine Arbeit / Eigene Arbeit» angezeigt wird.</li>
        <li><strong>Erst jetzt «Abgeben».</strong> Klicken Sie auf «Abgeben» und warten Sie, bis Teams die Abgabe bestätigt.</li>
        <li><strong>Bestätigung kontrollieren.</strong> Die Lernkontrolle ist erst fertig, wenn Teams die Abgabebestätigung anzeigt.</li>
      </ol>

      <div class="teams-submit-check">
        <strong>Fertig bedeutet:</strong> Ihre Flip-Aufnahme ist in der richtigen Aufgabe sichtbar und Teams zeigt die Abgabebestätigung.
        Danach wechseln Sie direkt in den Trainingsmodus.
      </div>
    `);

    // Die Abschlusskontrolle sprachlich an den neuen Ablauf anpassen, ohne die gespeicherten Keys zu ändern.
    const completion = mount.querySelector('.complete-card');
    if (completion) {
      const labels = [...completion.querySelectorAll('.completion-checks label span')];
      if (labels[0]) labels[0].textContent = 'Ich habe meine fertige Flip-Aufnahme direkt in Teams erstellt.';
      if (labels[1]) labels[1].textContent = 'Ich habe die Aufnahme vollständig kontrolliert.';
      if (labels[2]) labels[2].textContent = 'Ich habe in Teams abgegeben und die Abgabebestätigung gesehen.';
    }

    // Auch die Kurzbeschreibung der Mission auf der geöffneten Seite präzisieren.
    const heroDesc = mount.querySelector('.mission-hero > div > p');
    if (heroDesc) {
      heroDesc.textContent = 'Lernkontrolle: ungefähr 60 Sekunden frei vorstellen, direkt in der Teams-Aufgabe als Flip-Video aufnehmen und abgeben.';
    }
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      patchMission8();
    });
  }

  function patchOverview() {
    document.querySelectorAll('[data-mission="8"]').forEach(card => {
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      if (title && /Ma vidéo/i.test(title.textContent || '')) title.textContent = 'Ma vidéo · direkt in Teams';
      if (desc) desc.textContent = 'Lernkontrolle: direkt in Teams als Flip-Video aufnehmen, kontrollieren und abgeben.';
    });
  }

  function run() {
    patchMission8();
    patchOverview();
  }

  const observer = new MutationObserver(() => {
    schedule();
    requestAnimationFrame(patchOverview);
  });

  function start() {
    run();
    observer.observe(document.body, {childList:true,subtree:true});
    window.addEventListener('pageshow', run);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', start, {once:true})
    : start();
})();