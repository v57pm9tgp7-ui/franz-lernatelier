/*
  index.html nach public/module/woche-N/ kopieren. Dieser Eintrag gehört in
  FRANZ_MODULES in public/data/modules.js. Woche, Speicherkennung und Inhalte
  einsetzen. Jede Mission benötigt auf der Seite ein entsprechendes Sprungziel.
  «current» kennzeichnet die aktuelle Woche. Veröffentlichte Vorwochen behalten
  den Status «previous» und ihre ursprünglichen Speicherkennungen.
*/
window.FRANZ_MODULE = {
  id: 'woche-XX-2026',
  week: 0,
  schoolYear: '2026/27',
  href: 'module/woche-XX/',
  title: 'Wochenthema',
  subtitle: 'Untertitel der Woche',
  description: 'Was die Lernenden diese Woche anwenden.',
  status: 'draft',
  storageKey: 'franzoesischLernatelierWXX_v1',
  levels: typeof FRANZ_LEVELS_37 === 'undefined' ? [] : FRANZ_LEVELS_37,
  missionList: [{id:1, title:'Erste Übung', description:'Konkreter Auftrag', time:'10 Min.', form:'Einzelarbeit'}],
  training: [{id:'practice', title:'Training', subtitle:'Üben', description:'Anwenden und wiederholen.', anchor:'training'}],
  navigation: {overview:'#start', training:'#training', more:[]}
};
