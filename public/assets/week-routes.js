// All links are relative to the published module. The catalogue owns the week order
// and mission names. Only a week with additional pages needs navigation metadata.
(() => {
  'use strict';
  const modules = window.FRANZ_MODULES || [];
  const root = new URL('../', document.currentScript?.src || new URL('assets/week-routes.js', location.href));
  const weeks = modules.filter(m => m.status !== 'draft').sort((a, b) => a.week - b.week);
  const definitions = {
    48: {training:'#training',more:[['Lernziele','#lernziele'],['Freies Training','#training'],['Mein Lernstand','#lernstand'],['Terminkarten','#kalender/partner'],['Neun Projektformate','#projekt/formate'],['Projektmodelle','#projekt/beispiele'],['Unser Projektplan','#projekt/plan'],['Projektbeurteilung','#projekt/kriterien'],['Material','#material'],['Abschluss','#abschluss']]},
    36: { overview: '#dashboard' },
    38: { more: [['Herbstferien', 'herbstferien.html']] },
    42: {
      training: '#training',
      more: [['Mein 80-Minuten-Plan', '#plan'], ['Pflichtaufträge', '#pflicht'], ['Wahlaufträge', '#wahl'],
        ['Prüfungsstoff', '#pruefung'], ['Lernziele', '#ziele'], ['Standortcheck', '#diagnose'],
        ['Schlusscheck', '#schluss'], ['Wortliste', '#wortliste'], ['Lernpass', '#pass'],
        ['Carnet de parole', 'carnet.html'], ['Probelernkontrollen', 'proben/index.html'], ['Lösungen', 'proben/loesungen.html']]
    },
    43: {
      training: 'vertiefung.html',
      more: [['Zusatztraining', 'vertiefung.html'], ['Unterrichtsansicht', 'unterricht.html']]
    },
    44: {
      overview: './', training: 'atelier.html',
      more: [['Einstieg', '#einstieg'], ['Angebote für den Nachmittag', 'partenaire.html'], ['Budget prüfen', 'plan.html'], ['Zahlen', 'nombres.html'],
        ['Uhrzeiten', 'heure.html'], ['Sprechen', 'parler.html'], ['Übungsatelier', 'atelier.html'], ['Mini-Probe', 'mini.html'],
        ['Zu Hause', 'maison.html'], ['Reserve', 'reserve.html'], ['Druckmaterial', 'cartes.html'],
        ['Verbentrainer', '../../verbentrainer/']]
    },
    45: {
      training: 'training.html#quiet',
      more: [['Klassenansicht', '#classe'], ['Mein Abschluss', '#bilan'], ['Druckmaterial', '#material'],
        ['Zahlentraining', 'training.html#numbers'], ['Uhrzeitentraining', 'training.html#times'], ['Verbentrainer', '../../verbentrainer/']]
    },
    46: {
      training: '#verben',
      more: [['Unterrichtscoach', '#coach'], ['Verkaufsdialog', 'dialogue.html'], ['Verbentrainer', '../../verbentrainer/']]
    },
    47: {
      more: [['Lernziele', '#lernziele'], ['Freies Training', '#training'], ['Zahlentraining', '#training/zahlen'],
        ['Uhrzeitentraining', '#training/zeiten'], ['Verbentraining', '#training/verben'], ['Lerncheck', '#lerncheck'],
        ['Mein Lernstand', '#lernstand']]
    }
  };
  const pageKey = url => url.pathname.replace(/(?:\/index(?:\.html)?|\.html|\/)$/, '');
  const base = week => new URL(week.href, root);
  const config = week => week.navigation || definitions[week.week] || {};
  const to = (week, path) => new URL(path, base(week));
  const overview = week => to(week, config(week).overview || '#start');
  function training(week, kind) {
    const item = week.training?.find(t => t.id === kind);
    if (item?.href || item?.anchor) return to(week, item.href || '#' + item.anchor);
    if (item && week.week === 45) return to(week, kind === 'verbs' ? '../../verbentrainer/index.html?set=all' : 'training.html#' + kind);
    if (item && week.week === 44) return to(week, '../../verbentrainer/');
    if (item && (week.week <= 38 || week.week === 43)) return to(week, '#training/' + kind);
    return to(week, config(week).training || '#training');
  }
  const mission = (week, item) => to(week, item.href || '#' + (item.anchor || 'mission-' + item.id));
  const more = week => (config(week).more || []).map(([title, href]) => ({title, url:to(week, href)}));
  const active = weeks.find(m => m.status === 'current');
  window.FranzWeekRoutes = {weeks, active, root, pageKey, base, overview, training, mission, more};

  // The first modules retain their original settings drawers and local stores.
  if (/\/module\/woche-(36|37|38)\/(?:index\.html)?$/.test(location.pathname)) {
    const key = 'franzLernatelierView_v3';
    const selector = '[data-view-option="large"],[data-setting="large"]';
    function sharedSettings() {
      try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
    }
    function applySharedSize() {
      const value = sharedSettings().large;
      const toggle = document.querySelector(selector);
      if (toggle && typeof value === 'boolean' && document.body.classList.contains('view-large') !== value) toggle.click();
    }
    window.addEventListener('pageshow', applySharedSize);
    window.addEventListener('storage', e => {if (e.key === key) applySharedSize();});
    document.addEventListener('click', e => {
      if (!e.target.closest(selector)) return;
      queueMicrotask(() => {
        try {localStorage.setItem(key, JSON.stringify({...sharedSettings(), large:document.body.classList.contains('view-large')}));} catch {}
      });
    });
  }
})();
