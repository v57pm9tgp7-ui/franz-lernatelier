(() => {
  'use strict';

  const DAY = 86400000;
  const INTERVALS = [1,3,7,14,30];
  const qs = (s,r=document) => r.querySelector(s);
  const qsa = (s,r=document) => [...r.querySelectorAll(s)];
  const esc = (v='') => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const day = (time=Date.now()) => { const d=new Date(time); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const normal = (s='') => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'").replace(/[…]/g,' ').replace(/[^a-z0-9'\s]/g,' ').replace(/\s+/g,' ').trim();

  const modules = Array.isArray(window.FRANZ_MODULES) ? window.FRANZ_MODULES : [];
  const topics = Array.isArray(window.FRANZ_TOPICS) ? window.FRANZ_TOPICS : [];
  const currentModule = modules.find(m=>m.status==='current') || modules[0];
  const topic = topics.find(t=>t.id===currentModule?.topicId) || topics.find(t=>t.active) || topics[0];
  if (!topic) return;
  const vocabSection = (topic.assessmentSections||[]).find(s=>s.type==='vocabulary'&&s.enabled);
  const vocabularyAll = vocabSection?.vocabulary || [];
  let vocabulary = [...vocabularyAll];
  let testVocabulary = [...vocabularyAll];
  let classConfig = null;
  const ACCOUNT_KEY = 'franzLernatelierLearner_v1';
  const STORAGE_KEY = topic.progressStorageKey || currentModule?.storageKey;

  let subview = 'dashboard';
  let statusFilter = 'all';
  let searchTerm = '';
  let checkLength = 'all';
  let checkSession = null;
  let lastResult = null;

  function readState(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{}; } catch(_){ return {}; } }
  async function loadClassConfig(){
    let account={}; try{account=JSON.parse(localStorage.getItem(ACCOUNT_KEY)||'{}')||{};}catch(_){}
    const email=String(account.email||'').trim().toLowerCase();
    if(!email)return false;
    try{
      const response=await fetch('/api/topic-config',{method:'POST',headers:{'content-type':'application/json'},cache:'no-store',body:JSON.stringify({email,topicId:topic.id})});
      const data=await response.json();
      if(!response.ok||!data.ok)return false;
      const learn=new Set(Array.isArray(data.learnIds)?data.learnIds:[]);
      const test=new Set(Array.isArray(data.testIds)?data.testIds:[]);
      vocabulary=vocabularyAll.filter(item=>learn.has(item.id));
      testVocabulary=vocabularyAll.filter(item=>test.has(item.id)&&learn.has(item.id));
      classConfig=data;
      if(qs('#topicTrainingShell'))render();
      return true;
    }catch(_){return false;}
  }
  function saveState(state){ try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); } catch(_){} window.dispatchEvent(new Event('storage')); }
  function practice(state){
    state.practiceV2 ||= {version:2,items:{},days:{},xp:0,goal:8,mode:'cards',filter:'recommended',direction:'fr-de',positions:{},drafts:{},favorites:[],events:[]};
    state.practiceV2.items ||= {}; state.practiceV2.days ||= {}; state.practiceV2.events ||= []; state.practiceV2.favorites ||= [];
    return state.practiceV2;
  }
  function statsFor(item,state=readState()){ return practice(state).items?.[item.id] || null; }
  function mastery(item,state=readState()){
    const s=statsFor(item,state);
    if (s?.level>=3 || (s?.successDays?.length||0)>=3) return 'secure';
    if ((s?.independent||0)>0) return 'uncertain';
    return 'learn';
  }
  function statusLabel(status,stat){
    if(status==='secure')return 'Sicher';
    if(status==='uncertain')return 'Unsicher';
    return stat?.attempts ? 'Noch lernen' : 'Noch nicht geprüft';
  }
  function counts(state=readState()){
    const c={secure:0,uncertain:0,learn:0};
    vocabulary.forEach(v=>c[mastery(v,state)]++);
    return c;
  }
  function readiness(c=counts()){
    const total=vocabulary.length||1;
    return Math.round((c.secure + c.uncertain*.45)/total*100);
  }
  function weekRange(){ const w=topic.weeks||[]; return w.length?`Woche ${Math.min(...w)}–${Math.max(...w)}`:''; }
  function masteryText(c=counts()){
    if(c.learn>Math.max(8,vocabulary.length*.35)) return `Starten Sie mit Cartes. ${c.learn} Einträge sind noch nicht sicher genug geprüft.`;
    if(c.uncertain>0) return `Konzentrieren Sie sich jetzt auf die ${c.uncertain} unsicheren Einträge. Cartes legt fällige Wörter automatisch zuerst vor.`;
    return 'Ihr Wortschatz ist bereits sehr stabil. Ein Probe-Check zeigt, ob Sie ihn auch ohne Hilfen abrufen können.';
  }

  function installStyles(){
    if(qs('#topic-training-style'))return;
    const style=document.createElement('style'); style.id='topic-training-style';
    style.textContent=`
      [data-view="training"] .recommended-training,[data-view="training"] #trainingGrid{display:none!important}
      .topic-training-shell{display:grid;gap:22px}
      .topic-hero-grid{display:grid;grid-template-columns:minmax(0,1.18fr) minmax(330px,.82fr);gap:16px}
      .topic-card{border:1px solid #d7dfdc;border-radius:22px;background:#fff;padding:22px;box-shadow:0 8px 24px rgba(14,43,66,.07)}
      .topic-main{background:linear-gradient(135deg,#08264a,#0b315f 68%,#176c74);color:#fff;border:0;padding:26px}
      .topic-kicker{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:950;letter-spacing:.055em;text-transform:uppercase;color:#177c73}
      .topic-main .topic-kicker{color:#bfe8e1}.topic-main h2,.topic-test-card h2{margin:6px 0 8px;font-size:clamp(28px,3vw,38px);letter-spacing:-.03em}.topic-main p{margin:0;max-width:760px;color:#eef7f6;font-size:18px}
      .topic-week-chip{display:inline-flex;margin-top:16px;padding:7px 10px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(255,255,255,.09);font-size:13px;font-weight:900}
      .topic-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}.topic-actions button{min-height:45px;border-radius:12px;padding:9px 14px;font-weight:900;cursor:pointer}.topic-actions .topic-primary{border:1px solid #fff;background:#fff;color:#0b315f}.topic-actions .topic-secondary{border:1px solid rgba(255,255,255,.32);background:rgba(255,255,255,.08);color:#fff}
      .topic-test-card{border-color:#bcd6d2;background:linear-gradient(180deg,#fff,#f7fcfb)}.topic-test-card p{margin:7px 0;color:#526477}.topic-test-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:16px 0}.topic-test-row div{padding:10px;border-radius:12px;background:#f5f7f8}.topic-test-row strong{display:block;font-size:23px}.topic-test-row span{font-size:12px;font-weight:850;color:#526477}.topic-test-row .secure{background:#e9f6ef;color:#176c4b}.topic-test-row .uncertain{background:#fff6df;color:#805800}.topic-test-row .learn{background:#fff0eb;color:#9b4435}
      .topic-open-test{min-height:45px;border:1px solid #177c73;border-radius:12px;background:#177c73;color:#fff;padding:9px 14px;font-weight:950;cursor:pointer}
      .topic-section-head{display:flex;align-items:end;justify-content:space-between;gap:14px}.topic-section-head h2{margin:3px 0 0;font-size:27px}.topic-section-head p{margin:4px 0 0;color:#526477}.topic-mini-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin-top:13px}.topic-mini-training{display:grid;grid-template-columns:48px 1fr auto;gap:13px;align-items:center;border:1px solid #d7dfdc;border-radius:17px;background:#fff;padding:13px 14px;text-align:left;cursor:pointer}.topic-mini-training:hover{border-color:#88aaa5;background:#fbfefd}.topic-mini-icon{width:48px;height:48px;border-radius:13px;background:#edf4ff;display:grid;place-items:center;color:#0b315f;font-weight:950}.topic-mini-training strong{display:block;font-size:18px}.topic-mini-training small{display:block;margin-top:2px;color:#526477;font-size:13px}.topic-mini-training b{font-size:13px;color:#0b315f}.topic-mini-training.is-vocab{border-color:#f0bcb5;background:#fffdfd}.topic-mini-training.is-vocab .topic-mini-icon{background:#fff0ee;color:#c34535}
      .topic-back{min-height:42px;border:1px solid #b8c8c4;border-radius:11px;background:#fff;padding:8px 12px;font-weight:900;cursor:pointer}.topic-prep-hero{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:start;border:1px solid #bcd6d2;border-radius:22px;background:linear-gradient(130deg,#f8fffd,#fff);padding:22px}.topic-prep-hero h2{margin:3px 0 7px;font-size:32px}.topic-prep-hero p{margin:0;color:#526477;max-width:760px}.topic-prep-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.topic-prep-actions button{min-height:44px;border-radius:11px;padding:8px 12px;font-weight:900;cursor:pointer}.topic-prep-actions .primary{background:#0b315f;color:#fff;border:1px solid #0b315f}.topic-prep-actions .secondary{background:#fff;border:1px solid #b8c8c4}.topic-readiness{margin-top:15px;display:flex;gap:12px;align-items:center}.topic-readiness-track{flex:1;height:10px;border-radius:999px;background:#e5ebed;overflow:hidden}.topic-readiness-track span{display:block;height:100%;background:#177c73;border-radius:inherit}.topic-readiness strong{min-width:46px;color:#0f615b}
      .topic-mastery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.topic-mastery-grid article{border:1px solid #d7dfdc;border-radius:16px;padding:14px;background:#fff}.topic-mastery-grid strong{display:block;font-size:26px}.topic-mastery-grid span{font-weight:900}.topic-mastery-grid p{margin:4px 0 0;color:#526477;font-size:13px}.topic-mastery-grid .secure{border-color:#b7ddca;background:#f7fdf9}.topic-mastery-grid .uncertain{border-color:#e5ce91;background:#fffdf6}.topic-mastery-grid .learn{border-color:#f0c5bd;background:#fffafa}
      .topic-next-step{margin-top:14px;padding:13px 15px;border-left:4px solid #177c73;border-radius:0 13px 13px 0;background:#f4fbf9}.topic-next-step strong{display:block}.topic-next-step p{margin:3px 0 0;color:#526477}
      .topic-vocab-section{margin-top:20px;border:1px solid #d7dfdc;border-radius:20px;background:#fff;padding:18px}.topic-vocab-toolbar{display:grid;grid-template-columns:minmax(220px,1fr) auto;gap:12px;align-items:end}.topic-vocab-toolbar input{width:100%;min-height:44px;border:1px solid #b8c8c4;border-radius:11px;padding:9px 11px}.topic-filter{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.topic-filter button{min-height:40px;border:1px solid #c9d4d2;border-radius:999px;background:#fff;padding:7px 11px;font-weight:850;cursor:pointer}.topic-filter button.is-active{background:#0b315f;border-color:#0b315f;color:#fff}.topic-vocab-table{width:100%;border-collapse:collapse;margin-top:14px}.topic-vocab-table th,.topic-vocab-table td{padding:10px 9px;border-bottom:1px solid #e1e6e7;text-align:left;vertical-align:top}.topic-vocab-table thead th{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#526477}.topic-vocab-table td:first-child{font-weight:800;color:#0b315f}.topic-status{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;font-size:12px;font-weight:900;white-space:nowrap}.topic-status.secure{background:#e9f6ef;color:#176c4b}.topic-status.uncertain{background:#fff6df;color:#805800}.topic-status.learn{background:#fff0eb;color:#9b4435}.topic-category{font-size:12px;color:#526477}
      .topic-check-shell{max-width:840px;margin:0 auto}.topic-check-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}.topic-check-progress{height:9px;border-radius:999px;background:#e5ebed;overflow:hidden}.topic-check-progress span{display:block;height:100%;background:#177c73}.topic-check-card{margin-top:16px;border:1px solid #d7dfdc;border-radius:22px;background:#fff;padding:26px;box-shadow:0 12px 30px rgba(14,43,66,.08)}.topic-check-card .prompt{margin:13px 0 20px;font-size:28px;font-weight:950;color:#0b315f}.topic-check-card label{display:block;font-weight:900}.topic-check-card input{width:100%;min-height:52px;margin-top:7px;border:1px solid #9eb0ad;border-radius:12px;padding:10px 12px;font-size:19px}.topic-check-card .hint{margin:8px 0 0;color:#526477;font-size:13px}.topic-check-nav{display:flex;justify-content:space-between;gap:10px;margin-top:18px}.topic-check-nav button{min-height:44px;border-radius:11px;padding:8px 13px;font-weight:900;cursor:pointer}.topic-check-nav .primary{border:1px solid #0b315f;background:#0b315f;color:#fff}.topic-check-nav .secondary{border:1px solid #b8c8c4;background:#fff}
      .topic-result-hero{border-radius:22px;padding:24px;background:linear-gradient(135deg,#08264a,#0b315f);color:#fff}.topic-result-hero small{font-weight:900;color:#bfe8e1}.topic-result-hero h2{margin:5px 0 6px;font-size:36px}.topic-result-hero p{margin:0;color:#eef7f6}.topic-result-score{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}.topic-result-score span{padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.18);font-weight:850}.topic-result-list{display:grid;gap:9px;margin-top:16px}.topic-result-item{display:grid;grid-template-columns:44px 1fr;gap:12px;border:1px solid #d7dfdc;border-radius:15px;background:#fff;padding:13px}.topic-result-mark{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-weight:950}.topic-result-item.correct .topic-result-mark{background:#e9f6ef;color:#176c4b}.topic-result-item.near .topic-result-mark{background:#fff6df;color:#805800}.topic-result-item.wrong .topic-result-mark{background:#fff0eb;color:#9b4435}.topic-result-item strong{display:block}.topic-result-item p{margin:3px 0;color:#526477}.topic-result-item em{font-style:normal;color:#0b315f;font-weight:800}
      #topic-vocab-print{display:none}
      @media(max-width:880px){.topic-hero-grid,.topic-prep-hero{grid-template-columns:1fr}.topic-prep-actions{justify-content:flex-start}.topic-mini-grid{grid-template-columns:1fr}.topic-vocab-toolbar{grid-template-columns:1fr}.topic-filter{justify-content:flex-start}}
      @media(max-width:620px){.topic-mastery-grid,.topic-test-row{grid-template-columns:1fr}.topic-vocab-table thead{display:none}.topic-vocab-table,.topic-vocab-table tbody,.topic-vocab-table tr,.topic-vocab-table td{display:block}.topic-vocab-table tr{padding:9px 0;border-bottom:1px solid #e1e6e7}.topic-vocab-table td{border:0;padding:3px 0}.topic-mini-training{grid-template-columns:44px 1fr}.topic-mini-training b{grid-column:2}.topic-check-card{padding:20px}.topic-check-card .prompt{font-size:24px}}
      @media print{
        body.topic-vocab-printing > *:not(#topic-vocab-print){display:none!important}
        #topic-vocab-print{display:block!important;color:#10233f;font-family:"Segoe UI",Aptos,Arial,sans-serif}
        @page{size:A4 portrait;margin:12mm}
        #topic-vocab-print h1{margin:0;color:#0b315f;font-size:22pt}#topic-vocab-print .print-sub{margin:2mm 0 5mm;color:#526477;font-size:10pt}
        #topic-vocab-print .print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 7mm}
        #topic-vocab-print .print-item{break-inside:avoid;border-bottom:.25mm solid #d7dfdc;padding:2.1mm 0}
        #topic-vocab-print .print-item strong{display:block;font-size:9pt;color:#0b315f}#topic-vocab-print .print-item span{display:block;font-size:8.2pt;margin-top:.4mm}#topic-vocab-print .print-item small{display:block;margin-top:.5mm;font-size:6.8pt;color:#526477}
      }
    `; document.head.appendChild(style);
  }

  function modeCards(){
    const modes=[
      ['cards','▣','Cartes','Vocabulaire aktiv erinnern','5 Min.','is-vocab'],
      ['dictation','◉','Écoute','Hören und möglichst genau schreiben','5–8 Min.',''],
      ['reaction','ϟ','Réagis','Schnell und passend antworten','5 Min.',''],
      ['expert','◉','Expert','60 Sekunden möglichst frei sprechen','8–10 Min.','']
    ];
    return modes.map(([id,icon,title,desc,time,cls])=>`<button class="topic-mini-training ${cls}" type="button" data-start-training="${id}"><span class="topic-mini-icon">${icon}</span><span><strong>${title}</strong><small>${desc}${id==='cards'?' · Lernstand fliesst in die Testvorbereitung ein.':''}</small></span><b>${time} →</b></button>`).join('');
  }

  function renderDashboard(){
    const state=readState(),c=counts(state),ready=readiness(c);
    return `<div class="topic-training-shell">
      <div class="topic-hero-grid">
        <section class="topic-card topic-main">
          <span class="topic-kicker">Aktuelles Thema</span><h2>${esc(topic.title)} · ${esc(topic.subtitle||'')}</h2>
          <p>Trainieren Sie den Stoff des ganzen Themas – nicht nur die aktuelle Woche. Ihr Fortschritt bleibt über mehrere Wochen erhalten.</p>
          <span class="topic-week-chip">${esc(weekRange())} · ${vocabulary.length} Lernwörter${classConfig?.groupLabel?` · ${esc(classConfig.groupLabel)}`:''}</span>
          <div class="topic-actions"><button class="topic-primary" type="button" data-start-training="cards">Weitertrainieren mit Cartes →</button><button class="topic-secondary" type="button" data-topic-prep>Testvorbereitung öffnen</button></div>
        </section>
        <section class="topic-card topic-test-card">
          <span class="topic-kicker">Testvorbereitung</span><h2>Vocabulaire</h2><p>Wortschatzliste, persönlicher Lernstand und ein Probe-Check greifen direkt auf Ihr Cartes-Training zu.</p>
          <div class="topic-test-row"><div class="secure"><strong>${c.secure}</strong><span>sicher</span></div><div class="uncertain"><strong>${c.uncertain}</strong><span>unsicher</span></div><div class="learn"><strong>${c.learn}</strong><span>noch lernen</span></div></div>
          <button class="topic-open-test" type="button" data-topic-prep>Testvorbereitung öffnen · ${ready}% Lernstand →</button>
        </section>
      </div>
      <section><div class="topic-section-head"><div><span class="topic-kicker">Schnelltraining</span><h2>Was möchten Sie heute trainieren?</h2><p>Vier kurze Wege – klar getrennt von der Testvorbereitung.</p></div></div><div class="topic-mini-grid">${modeCards()}</div></section>
    </div>`;
  }

  function renderPrep(){
    const state=readState(),c=counts(state),ready=readiness(c);
    return `<div class="topic-training-shell">
      <div><button class="topic-back" type="button" data-topic-back>← Trainingsübersicht</button></div>
      <section class="topic-prep-hero"><div><span class="topic-kicker">Testvorbereitung · ${esc(topic.title)}</span><h2>Vocabulaire</h2><p>${esc(vocabSection?.description||'')} Der Lernstand basiert auf Ihren Cartes-Durchgängen und den Probe-Checks.${classConfig?.groupLabel?` Für ${esc(classConfig.groupLabel)} sind aktuell ${vocabulary.length} Lernwörter freigegeben; ${testVocabulary.length} davon können im Probe-Check vorkommen.`:''}</p><div class="topic-readiness"><span>Lernstand</span><div class="topic-readiness-track"><span style="width:${ready}%"></span></div><strong>${ready}%</strong></div></div>
      <div class="topic-prep-actions"><button class="primary" type="button" data-topic-check-start ${testVocabulary.length?'':'disabled'}>Check starten${testVocabulary.length?` · ${testVocabulary.length} Testwörter`:' · noch keine Testwörter'}</button><button class="secondary" type="button" data-start-training="cards">Mit Cartes üben</button><button class="secondary" type="button" data-topic-print>Liste drucken</button></div></section>
      <div class="topic-mastery-grid"><article class="secure"><span>Zuverlässig</span><strong>${c.secure}</strong><p>An mindestens drei verschiedenen Tagen selbständig erinnert.</p></article><article class="uncertain"><span>Noch unsicher</span><strong>${c.uncertain}</strong><p>Schon selbständig geschafft, aber noch nicht stabil genug.</p></article><article class="learn"><span>Noch lernen</span><strong>${c.learn}</strong><p>Noch nie selbständig geschafft oder noch gar nicht geprüft.</p></article></div>
      <div class="topic-next-step"><strong>Nächster sinnvoller Schritt</strong><p>${esc(masteryText(c))}</p></div>
      ${renderVocabularyList(state)}
    </div>`;
  }

  function renderVocabularyList(state=readState()){
    const term=normal(searchTerm);
    const rows=vocabulary.filter(item=>{
      const status=mastery(item,state);
      if(statusFilter!=='all'&&status!==statusFilter)return false;
      if(!term)return true;
      return normal(item.fr+' '+item.de+' '+item.category).includes(term);
    });
    return `<section class="topic-vocab-section"><div class="topic-section-head"><div><span class="topic-kicker">Gesamtliste</span><h2>Französisch ↔ Deutsch</h2><p>${rows.length} von ${vocabulary.length} Einträgen angezeigt.</p></div></div>
      <div class="topic-vocab-toolbar"><label>Wort suchen<input type="search" data-topic-search value="${esc(searchTerm)}" placeholder="Französisch oder Deutsch"></label><div class="topic-filter" role="group" aria-label="Lernstand filtern">${[['all','Alle'],['secure','Sicher'],['uncertain','Unsicher'],['learn','Noch lernen']].map(([id,label])=>`<button type="button" class="${statusFilter===id?'is-active':''}" data-topic-filter="${id}">${label}</button>`).join('')}</div></div>
      <table class="topic-vocab-table"><thead><tr><th>Französisch</th><th>Deutsch</th><th>Lernstand</th><th>Lernkontrolle</th></tr></thead><tbody>${rows.map(item=>{const st=mastery(item,state),stat=statsFor(item,state),inTest=testVocabulary.some(v=>v.id===item.id);return `<tr><td lang="fr">${esc(item.fr)}<div class="topic-category">${esc(item.category)}</div></td><td>${esc(item.de)}</td><td><span class="topic-status ${st}">${st==='secure'?'✓ ':st==='uncertain'?'~ ':'○ '}${esc(statusLabel(st,stat))}</span></td><td>${inTest?'<span class="topic-status secure">✓ möglich</span>':'<span class="topic-status learn">—</span>'}</td></tr>`}).join('')}</tbody></table>
    </section>`;
  }

  function shuffle(items){ const a=[...items]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  function balancedSample(length){
    const pool=testVocabulary; const groups=new Map(); pool.forEach(v=>{const k=v.category||'Weitere'; if(!groups.has(k))groups.set(k,[]); groups.get(k).push(v);});
    const chosen=[],used=new Set();
    shuffle([...groups.values()]).forEach(group=>{if(chosen.length>=length)return;const item=shuffle(group)[0]; if(item&&!used.has(item.id)){chosen.push(item);used.add(item.id);}});
    const state=readState();
    const rest=shuffle(pool.filter(v=>!used.has(v.id))).sort((a,b)=>{const rank={learn:0,uncertain:1,secure:2};return rank[mastery(a,state)]-rank[mastery(b,state)]||Math.random()-.5;});
    for(const item of rest){if(chosen.length>=length)break;chosen.push(item);}
    return shuffle(chosen).slice(0,length);
  }
  function startCheck(){
    if(!testVocabulary.length){subview='prep';render();return;}
    const length=checkLength==='all'?testVocabulary.length:Number(checkLength)||12;
    checkSession={items:balancedSample(Math.min(length,testVocabulary.length)),index:0,answers:{},startedAt:Date.now()}; lastResult=null; subview='check'; render(); setTimeout(()=>qs('[data-topic-answer]')?.focus(),0);
  }
  function acceptableVariants(fr){
    let raw=String(fr).trim();
    if(raw.includes(' / ')){
      const [left,right]=raw.split(' / ').map(x=>x.trim().replace(/[.!?]+$/,''));
      return [left,right];
    }
    return [raw.replace(/[.!?]+$/,'')];
  }
  function levenshtein(a,b){const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=0;i<=m;i++)dp[i][0]=i;for(let j=0;j<=n;j++)dp[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return dp[m][n];}
  function evaluate(item,given){
    const g=normal(given); if(!g)return {status:'wrong',reason:'Keine Antwort'};
    const placeholder=/…/.test(item.fr);
    const variants=acceptableVariants(item.fr).map(normal).filter(Boolean);
    if(variants.some(v=>placeholder?(g===v||g.startsWith(v+' ')):g===v))return {status:'correct'};
    let best=0; variants.forEach(v=>{const d=levenshtein(g,v),score=1-d/Math.max(g.length,v.length,1);if(score>best)best=score;});
    if(best>=.84)return {status:'near',reason:'Fast richtig'};
    return {status:'wrong',reason:'Noch nicht richtig'};
  }
  function recordResult(state,item,rating){
    const db=practice(state),now=Date.now(),today=day(now),stat=db.items[item.id]||{attempts:0,independent:0,assisted:0,level:0,successDays:[],dayXP:{}};
    stat.successDays ||= []; stat.dayXP ||= {}; stat.attempts++; stat.lastAt=now; stat.lastDay=today; stat.method='vocab-check';
    if(rating==='known'){stat.independent++;if(!stat.successDays.includes(today)){stat.successDays.push(today);stat.level=Math.min(5,(stat.level||0)+1);}stat.due=now+INTERVALS[Math.max(0,(stat.level||1)-1)]*DAY;}
    else{stat.assisted++;stat.level=0;stat.due=now+10*60*1000;}
    const award=Math.min(rating==='known'?10:5,Math.max(0,15-(stat.dayXP[today]||0)));stat.dayXP[today]=(stat.dayXP[today]||0)+award;db.xp=(db.xp||0)+award;db.items[item.id]=stat;
    const daily=db.days[today]||{reps:0,unique:[],independent:0,xp:0};daily.reps++;daily.independent+=rating==='known'?1:0;daily.xp+=award;if(!daily.unique.includes(item.id))daily.unique.push(item.id);db.days[today]=daily;
    db.events.push({id:item.id,rating,method:'vocab-check',time:now,xp:award});db.events=db.events.slice(-300);
  }
  function finishCheck(){
    if(!checkSession)return;
    const state=readState();
    const results=checkSession.items.map(item=>{const given=checkSession.answers[item.id]||'';const ev=evaluate(item,given);recordResult(state,item,ev.status==='correct'?'known':'again');return {item,given,...ev};});
    const correct=results.filter(r=>r.status==='correct').length,near=results.filter(r=>r.status==='near').length,wrong=results.filter(r=>r.status==='wrong').length;
    const summary={at:Date.now(),correct,near,wrong,total:results.length,percent:Math.round(correct/results.length*100)};
    state.topicAssessments ||= {};
    state.topicAssessments[topic.id] ||= {};
    state.topicAssessments[topic.id].vocabulaire ||= {checks:[]};
    const checkHistory=state.topicAssessments[topic.id].vocabulaire.checks ||= [];
    checkHistory.push(summary);
    state.topicAssessments[topic.id].vocabulaire.checks=checkHistory.slice(-10);
    saveState(state);
    lastResult={results,...summary}; checkSession=null; subview='result'; render();
  }
  function renderCheck(){
    const s=checkSession; if(!s)return renderPrep(); const item=s.items[s.index],answer=s.answers[item.id]||'',last=s.index===s.items.length-1,pct=Math.round(s.index/s.items.length*100);
    return `<div class="topic-training-shell topic-check-shell"><div><button class="topic-back" type="button" data-topic-check-cancel>← Testvorbereitung</button></div><div class="topic-check-top"><div><span class="topic-kicker">Probe-Check · Vocabulaire</span><h2>Frage ${s.index+1} von ${s.items.length}</h2></div><strong>${pct}%</strong></div><div class="topic-check-progress"><span style="width:${pct}%"></span></div><section class="topic-check-card"><span class="topic-kicker">Deutsch → Französisch</span><div class="prompt">${esc(item.de)}</div><label for="topicCheckAnswer">Ihre französische Antwort</label><input id="topicCheckAnswer" data-topic-answer autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(answer)}"><p class="hint">Wie bei einer Lernkontrolle gibt es während des Checks keine Lösung und keine Hilfe. Akzente und Satzzeichen werden bei der Auswertung grosszügig behandelt.</p><div class="topic-check-nav"><button class="secondary" type="button" data-topic-check-skip>${last?'Leer lassen':'Überspringen'}</button><button class="primary" type="button" data-topic-check-next>${last?'Check auswerten':'Antwort speichern →'}</button></div></section></div>`;
  }
  function resultMessage(result){if(result.percent>=85)return 'Sehr gute Grundlage. Wiederholen Sie vor allem die wenigen unsicheren Einträge.';if(result.percent>=65)return 'Sie sind auf gutem Weg. Trainieren Sie die unsicheren Wörter nochmals mit Cartes und machen Sie später einen neuen Check.';return 'Ein weiterer Lernschritt lohnt sich. Cartes legt die jetzt unsicheren Wörter automatisch wieder früher vor.';}
  function renderResult(){
    const r=lastResult; if(!r)return renderPrep();
    return `<div class="topic-training-shell"><div><button class="topic-back" type="button" data-topic-back>← Testvorbereitung</button></div><section class="topic-result-hero"><small>Probe-Check abgeschlossen</small><h2>${r.correct}/${r.total} richtig · ${r.percent}%</h2><p>${esc(resultMessage(r))}</p><div class="topic-result-score"><span>✓ ${r.correct} richtig</span><span>~ ${r.near} fast richtig</span><span>○ ${r.wrong} falsch / leer</span></div></section><div class="topic-prep-actions" style="justify-content:flex-start"><button class="primary" type="button" data-start-training="cards">Unsichere Wörter mit Cartes weiterlernen</button><button class="secondary" type="button" data-topic-check-start>Neuen Check starten</button><button class="secondary" type="button" data-topic-prep>Wortschatzliste ansehen</button></div><section><div class="topic-section-head"><div><span class="topic-kicker">Detaillierte Auswertung</span><h2>Jede Antwort im Vergleich</h2><p>«Fast richtig» zählt im Probe-Check bewusst nicht als richtig und wird nochmals geübt.</p></div></div><div class="topic-result-list">${r.results.map((x,i)=>`<article class="topic-result-item ${x.status}"><div class="topic-result-mark">${x.status==='correct'?'✓':x.status==='near'?'~':'○'}</div><div><strong>${i+1}. ${esc(x.item.de)}</strong><p>Ihre Antwort: <em lang="fr">${esc(x.given||'—')}</em></p><p>Lösung: <em lang="fr">${esc(x.item.fr)}</em></p></div></article>`).join('')}</div></section></div>`;
  }

  function render(){
    const shell=qs('#topicTrainingShell'); if(!shell)return;
    shell.innerHTML=subview==='dashboard'?renderDashboard():subview==='prep'?renderPrep():subview==='check'?renderCheck():renderResult();
  }
  function ensureShell(){
    const training=qs('[data-view="training"]'); if(!training)return null;
    installStyles();
    const eyebrow=training.querySelector('.plain-heading .eyebrow'); if(eyebrow){let weekNode=qs('#trainingWeek',eyebrow);if(!weekNode){weekNode=document.createElement('span');weekNode.id='trainingWeek';eyebrow.replaceChildren(document.createTextNode('Aktuelles Thema · '),weekNode);}else{const first=eyebrow.firstChild;if(first&&first.nodeType===3)first.nodeValue='Aktuelles Thema · ';}weekNode.textContent=weekRange();}
    const title=qs('#trainingTitle',training); if(title)title.textContent=`Training · ${topic.title}`;
    const intro=training.querySelector('.plain-heading p'); if(intro)intro.textContent='Trainieren Sie den Stoff des ganzen Themas. Testvorbereitung und Schnelltraining greifen auf denselben Lernstand zu.';
    let shell=qs('#topicTrainingShell',training); if(!shell){shell=document.createElement('div');shell.id='topicTrainingShell';const recommended=training.querySelector('.recommended-training');(recommended||training.lastElementChild)?.insertAdjacentElement('beforebegin',shell);}
    return shell;
  }

  function printVocabulary(){
    document.getElementById('topic-vocab-print')?.remove();
    const state=readState(),root=document.createElement('section');root.id='topic-vocab-print';
    root.innerHTML=`<h1>Vocabulaire · ${esc(topic.title)}</h1><p class="print-sub">${esc(weekRange())} · Französisch – Deutsch · ${vocabulary.length} Lernwörter${classConfig?.groupLabel?` · ${esc(classConfig.groupLabel)}`:''}</p><div class="print-grid">${vocabulary.map(item=>{const st=mastery(item,state),stat=statsFor(item,state),inTest=testVocabulary.some(v=>v.id===item.id);return `<div class="print-item"><strong lang="fr">${esc(item.fr)}</strong><span>${esc(item.de)}</span><small>${esc(item.category)} · ${esc(statusLabel(st,stat))}${inTest?' · Lernkontrolle':''}</small></div>`}).join('')}</div>`;
    document.body.appendChild(root);document.body.classList.add('topic-vocab-printing');
    const cleanup=()=>{document.body.classList.remove('topic-vocab-printing');root.remove();};window.addEventListener('afterprint',cleanup,{once:true});window.print();setTimeout(()=>{if(root.isConnected&&!window.matchMedia?.('print').matches)cleanup();},60000);
  }

  function handleClick(event){
    const prep=event.target.closest('[data-topic-prep]');if(prep){event.preventDefault();subview='prep';render();return;}
    if(event.target.closest('[data-topic-back]')){event.preventDefault();subview=subview==='result'?'prep':'dashboard';render();return;}
    if(event.target.closest('[data-topic-print]')){event.preventDefault();printVocabulary();return;}
    const filter=event.target.closest('[data-topic-filter]');if(filter){statusFilter=filter.dataset.topicFilter;const shell=qs('#topicTrainingShell');if(shell)shell.innerHTML=renderPrep();return;}
    if(event.target.closest('[data-topic-check-start]')){event.preventDefault();startCheck();return;}
    if(event.target.closest('[data-topic-check-cancel]')){event.preventDefault();checkSession=null;subview='prep';render();return;}
    if(event.target.closest('[data-topic-check-skip]')){event.preventDefault();if(!checkSession)return;const item=checkSession.items[checkSession.index];checkSession.answers[item.id]='';if(checkSession.index===checkSession.items.length-1)finishCheck();else{checkSession.index++;render();setTimeout(()=>qs('[data-topic-answer]')?.focus(),0);}return;}
    if(event.target.closest('[data-topic-check-next]')){event.preventDefault();if(!checkSession)return;const item=checkSession.items[checkSession.index],input=qs('[data-topic-answer]');checkSession.answers[item.id]=input?.value||'';if(checkSession.index===checkSession.items.length-1)finishCheck();else{checkSession.index++;render();setTimeout(()=>qs('[data-topic-answer]')?.focus(),0);}return;}
  }
  function handleInput(event){
    if(event.target.matches('[data-topic-search]')){searchTerm=event.target.value;const pos=event.target.selectionStart||searchTerm.length;clearTimeout(handleInput.t);handleInput.t=setTimeout(()=>{const section=event.target.closest('.topic-vocab-section');if(section){section.outerHTML=renderVocabularyList(readState());const input=qs('[data-topic-search]');if(input){input.focus({preventScroll:true});input.setSelectionRange(Math.min(pos,input.value.length),Math.min(pos,input.value.length));}}},160);}
    if(event.target.matches('[data-topic-answer]')&&checkSession){const item=checkSession.items[checkSession.index];checkSession.answers[item.id]=event.target.value;}
  }
  function handleKey(event){if(event.key==='Enter'&&event.target.matches('[data-topic-answer]')){event.preventDefault();qs('[data-topic-check-next]')?.click();}}

  let scheduled=false;
  function refresh(){scheduled=false;const shell=ensureShell();if(shell)render();}
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(refresh,0);}
  function init(){
    ensureShell();render();loadClassConfig();
    document.addEventListener('click',handleClick,true);document.addEventListener('input',handleInput);document.addEventListener('keydown',handleKey);
    const grid=qs('#trainingGrid');if(grid)new MutationObserver(schedule).observe(grid,{childList:true});
    window.addEventListener('storage',event=>{if(!event.key||event.key===STORAGE_KEY)schedule();});
    window.addEventListener('franz-cloud-state-applied',()=>{schedule();loadClassConfig();});
    window.addEventListener('pageshow',()=>{schedule();loadClassConfig();});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')loadClassConfig();});
    setInterval(loadClassConfig,120000);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true}):setTimeout(init,0);
})();
