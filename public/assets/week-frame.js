// Navigation for weekly lessons and their companion pages. Exercise engines keep their own state.
(() => {
  'use strict';
  const routes = window.FranzWeekRoutes;
  if (!routes || location.protocol === 'file:') return;
  const html = document.documentElement;
  const currentUrl = () => new URL(location.href);
  const samePage = (a, b) => routes.pageKey(a) === routes.pageKey(b);
  const samePlace = (a, b) => samePage(a, b) && a.hash === b.hash && a.search === b.search;
  const local = url => url.pathname + url.search + url.hash;
  const asLink = url => samePage(url, currentUrl()) && url.search === location.search && url.hash ? url.hash : local(url);
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const read = (storage, key) => { try { return JSON.parse(storage.getItem(key)); } catch { return null; } };
  const write = (storage, key, value) => { try { storage.setItem(key, JSON.stringify(value)); } catch {} };
  const originKey = 'franzAtelierTrainingReturn_v1';
  const pendingKey = 'franzAtelierRestorePosition_v1';
  const settingsKey = 'franzLernatelierView_v3';
  const schoolWeek = url => routes.weeks.find(w => url.pathname.includes('/module/woche-' + w.week + '/') ||
    routes.pageKey(url) === routes.pageKey(routes.base(w)));
  const own = schoolWeek(currentUrl());
  const tool = html.dataset.atelierTool;
  const storedOrigin = read(sessionStorage, originKey);
  function fromTrainingLink() {
    if (!tool || !storedOrigin?.target || !samePage(new URL(storedOrigin.target, location.href), currentUrl())) return false;
    const type = performance.getEntriesByType?.('navigation')[0]?.type;
    if (type === 'reload' || type === 'back_forward') return true;
    if (!document.referrer) return false;
    const referrer = new URL(document.referrer);
    return referrer.origin === location.origin && samePage(referrer, new URL(storedOrigin.url, location.href));
  }
  const week = own || (fromTrainingLink() && routes.weeks.find(w => w.week === storedOrigin.week));
  if (!week && !tool) return;
  const title = document.querySelector('[data-atelier-title]');
  if (title && week) {
    title.textContent = week.title;
    document.title = week.title + ' · Woche ' + week.week + ' · Franz Lernatelier';
  }
  const description = document.querySelector('[data-atelier-description]');
  if (description && week) description.textContent = week.description;

  const weeksUrl = new URL('index.html#weeks', routes.root);
  const homeUrl = new URL('index.html#home', routes.root);
  const exercises = week ? week.missionList.map((item, i) => ({id:item.id, title:item.title, position:i+1, url:routes.mission(week, item)})) : [];
  const additional = week ? routes.more(week) : [];
  const overview = week ? routes.overview(week) : weeksUrl;
  const train = week ? routes.training(week) : new URL('index.html#training', routes.root);
  const overviewText = 'Wochenübersicht';
  const isHome = url => samePage(url, homeUrl) && ['', '#home', '#weeks', '#training'].includes(url.hash);
  const topics = {
    'training':'Training', 'lernweg':'Lernweg', 'runde':'Übungsrunde', 'auswertung':'Auswertung',
    'wortliste':'Wortliste', 'wordbank':'Wörter und Satzbausteine', 'wiederholung':'Wiederholung'
  };
  function selectedEntry() {
    const url = currentUrl();
    if (tool) {
      const linkedTool = additional.find(entry => samePage(entry.url, url));
      return {title:tool, url:linkedTool?.url};
    }
    const exact = [...exercises, ...additional].find(entry => samePlace(entry.url, url));
    if (exact) return exact;
    const pathEntry = additional.find(entry => !entry.url.hash && samePage(entry.url, url) && !samePage(overview, url));
    if (pathEntry) return pathEntry;
    if (samePage(overview, url)) {
      if (!url.hash || url.hash === '#start' || url.hash === overview.hash) return {title:overviewText, url:overview};
      if (url.hash === '#lernweg') {
        const step = Number(document.querySelector('.stepbtn[aria-current="step"]')?.hash.split('/')[1]);
        if (step && exercises[step-1]) return exercises[step-1];
      }
      const tag = url.hash.slice(1).split('/')[0];
      if (topics[tag]) return {title:topics[tag]};
    }
    const heading = document.querySelector('#content h1, main section:not([hidden]) h1, main h1, h1');
    return {title:heading?.textContent.trim() || overviewText};
  }

  function trainingPage(url) {
    if (/\/(?:verbentrainer|pruefungsvorbereitung)(?:\/|$)/.test(url.pathname)) return true;
    if (!week) return false;
    if (!samePage(train, overview) && samePage(url, train)) return true;
    return samePage(url, overview) && (url.hash === train.hash || /^#(?:training(?:\/|$)|lerncheck$|lernstand$|runde$|auswertung$|check-)/.test(url.hash));
  }
  function remember(target, place) {
    const outsideWeek = !schoolWeek(target);
    if (!own || !trainingPage(target) || (!outsideWeek && trainingPage(currentUrl())) || samePlace(target, currentUrl())) return;
    const entry = selectedEntry();
    const position = place || window.FranzNavigation?.snapshot(null);
    write(sessionStorage, originKey, {week:week.week, label:entry.title, url:local(currentUrl()), target:local(target), position});
  }
  function returnPlace() {
    const origin = read(sessionStorage, originKey);
    if (!origin || origin.week !== week?.week || !trainingPage(currentUrl())) return null;
    const url = new URL(origin.url, location.href);
    return url.origin === location.origin && (schoolWeek(url)?.week === origin.week || isHome(url)) ? {...origin, target:url} : null;
  }
  function restorePosition() {
    const saved = read(sessionStorage, pendingKey);
    if (!saved || !samePlace(new URL(saved.url, location.href), currentUrl())) return;
    try {sessionStorage.removeItem(pendingKey);} catch {}
    if (saved.position) window.FranzNavigation?.restore(saved.position);
  }

  // New weeks reuse this list by placing <atelier-lernweg> on their overview.
  if (week && !customElements.get('atelier-lernweg')) {
    customElements.define('atelier-lernweg', class extends HTMLElement {
      connectedCallback() {
        this.classList.add('af-roadmap');
        this.descriptions ??= Array.from(this.querySelectorAll(':scope > a')).map(a => ({
          title:a.querySelector('strong')?.textContent, detail:a.querySelector('span')?.textContent, meta:a.querySelector('small')?.textContent
        }));
        this.update();
      }
      update() {
        const progress = read(localStorage, week.storageKey)?.missionDone || {};
        const open = exercises.find(e => !progress[e.id]);
        const count = exercises.filter(e => progress[e.id]).length;
        this.innerHTML = '<div class="af-roadmap-head"><h2>Ihr Lernweg</h2><span>'+count+' von '+exercises.length+' Schritten abgeschlossen</span></div><ol class="af-step-list">' +
          exercises.map((entry, i) => {
            const done = Boolean(progress[entry.id]);
            const info = week.missionList[i];
            const copy = this.descriptions[i] || {};
            const state = done ? 'af-complete' : entry === open ? 'af-next' : '';
            return '<li><a class="'+state+'" href="'+esc(asLink(entry.url))+'"><span class="af-step-number" aria-hidden="true">'+
              (done ? '✓' : String(i+1).padStart(2, '0'))+'</span><span>'+esc(copy.title || entry.title)+(copy.detail ? '<span class="af-step-detail">'+esc(copy.detail)+'</span>' : '')+
              '<small>'+esc(copy.meta || [info.time, info.form].filter(Boolean).join(' · '))+(done ? ' · abgeschlossen' : '')+'</small></span><span aria-hidden="true">→</span></a></li>';
          }).join('')+'</ol>';
      }
    });
  }

  const frame = document.createElement('div');
  frame.className = 'af-frame';
  const opt = (value, title) => '<option value="' + esc(value) + '">' + esc(title) + '</option>';
  const weeks = routes.weeks.map(w => opt(w.week, 'Woche ' + w.week)).join('');
  const items = exercises.map(e => opt(local(e.url), e.position + ' · ' + e.title)).join('');
  const extras = additional.map(e => opt(local(e.url), e.title)).join('');
  const sub = week ? 'Woche ' + week.week + ' · ' + week.title : tool;
  frame.innerHTML = `
    <div class="af-top" role="banner"><div class="af-inner af-mast">
      <a class="af-brand" href="${esc(local(homeUrl))}"><span class="af-mark" aria-hidden="true">FR</span>
        <span><strong>Franz Lernatelier</strong><small>${esc(sub)}</small></span></a>
      <div class="af-actions">
        <a class="af-control af-home-link" href="${esc(local(homeUrl))}">← Lernatelier</a>
        <a class="af-control" data-af-train href="${esc(asLink(train))}">Trainieren</a>
        <button class="af-control" type="button" data-af-font aria-label="Extra grosse Schrift" title="Extra grosse Schrift" aria-pressed="false">Aa</button>
        <details class="af-help"><summary class="af-control">Hilfe</summary><div class="af-help-copy">
          <strong>So finden Sie sich zurecht</strong>
          <p>Mit «Woche wählen» wechseln Sie die Woche.${week ? ' Über «Übung wählen» öffnen Sie jeden Schritt direkt.' : ''}</p>
          <p>Mit «Aa» vergrössern Sie die Schrift. «Alle Wochen» führt Sie zur Übersicht.</p>
          <a href="${esc(local(weeksUrl))}">Alle Wochen öffnen</a>
        </div></details>
      </div></div></div>
    <div class="af-nav" role="navigation" aria-label="Wochen und Übungen"><div class="af-inner">
      <div class="af-path"><a href="${esc(local(weeksUrl))}">Alle Wochen</a>
        ${week ? '<span aria-hidden="true">/</span><a href="'+esc(asLink(overview))+'">Woche '+week.week+'</a>' : ''}
        <span aria-hidden="true">/</span><strong aria-current="page" data-af-place></strong></div>
      <div class="af-row">
        <select data-af-week aria-label="Woche wählen">${week ? '' : opt('', 'Woche wählen')}${weeks}</select>
        ${week ? '<select data-af-exercise aria-label="Übung wählen">'+opt(local(overview),'Wochenübersicht')+'<optgroup label="Lernweg">'+items+'</optgroup>'+(extras?'<optgroup label="Weitere Bereiche">'+extras+'</optgroup>':'')+'</select>' : ''}
        <div class="af-directions" data-af-directions></div>
      </div></div></div>`;
  const first = document.querySelector('[data-atelier-insert], [data-atelier-replace]') || document.querySelector('main');
  if (!first) return;
  first.before(frame);
  html.classList.add('af-ready');
  const existingStatus = document.querySelector('[data-atelier-replace] .save-chip');
  if (existingStatus) frame.querySelector('.af-actions').prepend(existingStatus);
  const schoolLogo = document.querySelector('header[data-atelier-replace] img[alt*="BFF"]');
  if (schoolLogo) {
    const logo = schoolLogo.cloneNode();
    logo.className = 'af-school'; frame.querySelector('.af-actions').append(logo);
  }
  const picker = frame.querySelector('[data-af-week]');
  if (week) picker.value = week.week;
  const choose = frame.querySelector('[data-af-exercise]');
  const help = frame.querySelector('.af-help');
  const font = frame.querySelector('[data-af-font]');
  const dirs = frame.querySelector('[data-af-directions]');
  const direction = (url, title, label, attr='') => '<a class="af-control" '+attr+' href="'+esc(asLink(url))+'" aria-label="'+esc(label)+'">'+esc(title)+'</a>';

  function refresh() {
    const entry = selectedEntry();
    document.querySelectorAll('atelier-lernweg').forEach(list => list.update?.());
    html.dataset.atelierOverview = String(!tool && (entry.title === overviewText || !location.hash && samePage(overview, currentUrl())));
    frame.querySelector('[data-af-place]').textContent = entry.position ? 'Schritt ' + entry.position + ' von ' + exercises.length : entry.title;
    if (choose) {
      const match = entry.url && [...choose.options].some(o => o.value === local(entry.url));
      const old = choose.querySelector('[data-current]');
      if (old) old.remove();
      choose.options[0].text = entry.title === overviewText ? 'Übung wählen …' : overviewText;
      if (match) choose.value = local(entry.url);
      else {
        const current = new Option(entry.title, '', true, true);
        current.dataset.current = ''; current.disabled = true; choose.prepend(current);choose.value='';
      }
    }
    let links = '';
    const origin = returnPlace();
    if (origin) links += direction(origin.target, '↩ Zur Ausgangsstelle', 'Zurück zu «' + origin.label + '»', 'data-af-return');
    if (entry.position) {
      const previous = exercises[entry.position-2], next = exercises[entry.position];
      links += direction(previous?.url || overview, '← Zurück', previous ? 'Vorherige Übung: ' + previous.title : 'Zur Wochenübersicht');
      links += direction(next?.url || overview, next ? 'Weiter →' : 'Zur Übersicht', next ? 'Nächste Übung: ' + next.title : 'Zur Wochenübersicht');
    } else if (week && entry.title !== overviewText && !origin) {
      links += direction(overview, '← Zur Woche', 'Zur Übersicht von Woche ' + week.week);
    }
    if (dirs.innerHTML !== links) dirs.innerHTML = links;
    restorePosition();
  }
  function applyFont() {
    const settings = read(localStorage, settingsKey) || {};
    const large = settings.large ?? (document.body.classList.contains('large') || document.body.classList.contains('big'));
    html.dataset.atelierLarge = String(Boolean(large));
    font.setAttribute('aria-pressed', String(Boolean(large)));
    html.classList.toggle('af-contrast', !!settings.contrast);
    html.classList.toggle('af-reduced-motion', !!settings.motion);
  }
  font.addEventListener('click', () => {
    const settings = read(localStorage, settingsKey) || {};
    write(localStorage, settingsKey, {...settings, large:font.getAttribute('aria-pressed') !== 'true'});
    applyFont();
  });
  picker.addEventListener('change', () => {
    const selected = routes.weeks.find(w => w.week === Number(picker.value));
    if (selected) location.assign(asLink(routes.overview(selected)));
  });
  choose?.addEventListener('change', () => {
    const url = new URL(choose.value, location.href);
    remember(url); location.assign(asLink(url));
  });
  let pressedPlace = null;
  document.addEventListener('pointerdown', e => {
    const a = e.target.closest?.('a[href]');
    pressedPlace = a && trainingPage(new URL(a.href, location.href)) && own ? window.FranzNavigation?.snapshot(null) : null;
  }, true);
  document.addEventListener('click', e => {
    if (help.open && !help.contains(e.target)) help.open = false;
    const routeButton = e.target.closest?.('[data-route="training"]');
    if (routeButton && week) remember(train, pressedPlace);
    const a = e.target.closest?.('a[href]');
    if (!a || a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (a.hasAttribute('data-af-return')) {
      const origin = returnPlace();
      if (origin && isHome(origin.target)) write(sessionStorage, 'franzReturnPlace_v1', origin.position);
      else if (origin) write(sessionStorage, pendingKey, origin);
    } else remember(new URL(a.href, location.href), pressedPlace);
    pressedPlace = null;
  }, true);
  frame.addEventListener('keydown', e => {
    if (e.key === 'Escape' && help.open) {help.open = false; help.querySelector('summary').focus();}
  });
  document.addEventListener('change', e => {
    if (e.target.matches('[data-step], [data-complete], .progressControl input')) {
      document.querySelectorAll('atelier-lernweg').forEach(list => list.update?.());
    }
  });
  window.addEventListener('hashchange', refresh);
  window.addEventListener('popstate', () => requestAnimationFrame(refresh));
  window.addEventListener('pageshow', () => {applyFont();refresh();});
  window.addEventListener('storage', e => {if (e.key === settingsKey) applyFont();});
  document.addEventListener('atelier:route', refresh);
  document.addEventListener('atelier:trainingstart', e => remember(new URL(e.detail.href, location.href)));
  applyFont();
  refresh();
})();
