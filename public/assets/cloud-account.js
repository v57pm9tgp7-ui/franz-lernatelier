(() => {
  'use strict';

  const ACCOUNT_KEY = 'franzLernatelierLearner_v1';
  const LOCAL_ONLY_KEY = 'franzLernatelierLocalOnly_v1';
  const META_SUFFIX = ':cloudMeta_v1';
  const modules = Array.isArray(window.FRANZ_MODULES) ? window.FRANZ_MODULES : [];
  const current = modules.find(item => item.status === 'current') || modules[0];
  let learner = readJson(ACCOUNT_KEY, null);
  let localOnly = localStorage.getItem(LOCAL_ONLY_KEY) === '1';
  let lastRaw = current?.storageKey ? localStorage.getItem(current.storageKey) : null;
  let syncTimer = null;
  let pollTimer = null;
  let syncing = false;

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }
  function saveJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }
  function normaliseEmail(value='') { return String(value).trim().toLowerCase(); }
  function validEmail(email) { return /^[^\s@]+@(stud\.bffbern\.ch|bffbern\.ch)$/i.test(email); }
  function metaKey(module) { return `${module.storageKey}${META_SUFFIX}`; }
  function getMeta(module) { return readJson(metaKey(module), {clientUpdatedAt:0, serverUpdatedAt:0}); }
  function setMeta(module, patch) { saveJson(metaKey(module), {...getMeta(module), ...patch}); }
  function getState(module) {
    try { return JSON.parse(localStorage.getItem(module.storageKey) || '{}'); } catch (_) { return {}; }
  }
  function hasState(state) { return state && typeof state === 'object' && Object.keys(state).length > 0; }

  async function api(path, options={}) {
    const response = await fetch(path, {
      ...options,
      headers: {'content-type':'application/json', ...(options.headers || {})},
      cache:'no-store'
    });
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok || !data.ok) {
      const error = new Error(data.message || data.error || `HTTP ${response.status}`);
      error.code = data.error;
      throw error;
    }
    return data;
  }

  function setSyncStatus(mode, text) {
    document.documentElement.dataset.cloudSync = mode;
    document.querySelectorAll('[data-sync-label]').forEach(node => node.textContent = text);
    const save = document.querySelector('.save-note');
    if (save) {
      save.classList.toggle('is-offline', mode === 'offline' || mode === 'error');
      const strong = save.querySelector('strong');
      const small = save.querySelector('small');
      if (strong) strong.textContent = mode === 'syncing' ? 'Wird gespeichert …' : mode === 'error' ? 'Lokal gespeichert' : 'Automatisch gespeichert';
      if (small) small.textContent = mode === 'online' ? 'auf diesem Gerät und online' : mode === 'local' ? 'nur auf diesem Gerät' : mode === 'syncing' ? 'Online-Speicherung läuft' : 'Online-Speicherung folgt später';
    }
  }

  function updateAccountUi() {
    const email = learner?.email || '';
    document.querySelectorAll('[data-learner-email]').forEach(node => node.textContent = email || 'Nicht angemeldet');
    document.querySelectorAll('[data-account-button]').forEach(button => {
      button.hidden = !email;
      button.title = email ? `Angemeldet als ${email}` : '';
    });
  }

  async function createSession(email) {
    const data = await api('/api/session', {method:'POST', body:JSON.stringify({email})});
    learner = {email:data.email};
    saveJson(ACCOUNT_KEY, learner);
    localStorage.removeItem(LOCAL_ONLY_KEY);
    localOnly = false;
    updateAccountUi();
    return learner;
  }

  async function fetchRemote(module) {
    if (!learner?.email || !module?.id) return null;
    return api('/api/progress/load', {method:'POST', body:JSON.stringify({email:learner.email, moduleId:module.id})});
  }

  async function pushState(module, state, clientUpdatedAt) {
    if (!learner?.email || localOnly || syncing) return null;
    syncing = true;
    setSyncStatus('syncing', 'Wird online gespeichert …');
    try {
      const data = await api('/api/progress', {
        method:'PUT',
        body:JSON.stringify({email:learner.email, moduleId:module.id, state, clientUpdatedAt})
      });
      setMeta(module, {clientUpdatedAt:data.clientUpdatedAt, serverUpdatedAt:data.serverUpdatedAt});
      setSyncStatus('online', 'Online gespeichert');
      return data;
    } catch (error) {
      setSyncStatus(navigator.onLine ? 'error' : 'offline', 'Lokal gespeichert · Online später');
      return null;
    } finally {
      syncing = false;
    }
  }

  async function reconcileModule(module) {
    if (!module?.storageKey || !learner?.email || localOnly) return;
    setSyncStatus('syncing', 'Arbeitsstand wird geladen …');
    let remote;
    try { remote = await fetchRemote(module); }
    catch (error) {
      setSyncStatus('error', 'Lokal verfügbar · Online nicht erreichbar');
      return;
    }
    const local = getState(module);
    const meta = getMeta(module);
    if (!remote.found) {
      if (hasState(local)) {
        const stamp = meta.clientUpdatedAt || Date.now();
        setMeta(module, {clientUpdatedAt:stamp});
        await pushState(module, local, stamp);
      } else {
        setSyncStatus('online', 'Online verbunden');
      }
      return;
    }
    const remoteStamp = Number(remote.clientUpdatedAt || 0);
    const localStamp = Number(meta.clientUpdatedAt || 0);
    const statesMatch = JSON.stringify(local || {}) === JSON.stringify(remote.state || {});
    const remoteWins = !hasState(local) || !localStamp || remoteStamp > localStamp;
    if (remoteWins) {
      try {
        localStorage.setItem(module.storageKey, JSON.stringify(remote.state || {}));
        lastRaw = localStorage.getItem(module.storageKey);
        setMeta(module, {clientUpdatedAt:remoteStamp, serverUpdatedAt:remote.serverUpdatedAt});
      } catch (_) {}
      window.dispatchEvent(new CustomEvent('franz-cloud-state-applied', {detail:{moduleId:module.id}}));
    } else if (localStamp > remoteStamp || !statesMatch) {
      const stamp = localStamp > remoteStamp ? localStamp : Date.now();
      setMeta(module, {clientUpdatedAt:stamp});
      await pushState(module, local, stamp);
    } else {
      setMeta(module, {serverUpdatedAt:remote.serverUpdatedAt});
      setSyncStatus('online', 'Online gespeichert');
    }
  }

  function scheduleCurrentSync() {
    if (!current?.storageKey || !learner?.email || localOnly) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      const state = getState(current);
      if (!hasState(state)) return;
      const meta = getMeta(current);
      const stamp = meta.clientUpdatedAt || Date.now();
      pushState(current, state, stamp);
    }, 650);
  }

  function startPolling() {
    if (!current?.storageKey || pollTimer) return;
    pollTimer = setInterval(() => {
      const raw = localStorage.getItem(current.storageKey);
      if (raw !== lastRaw) {
        lastRaw = raw;
        const stamp = Date.now();
        setMeta(current, {clientUpdatedAt:stamp});
        scheduleCurrentSync();
      }
    }, 900);
  }

  function showLogin() {
    const overlay = document.getElementById('loginGate');
    if (!overlay) return;
    overlay.hidden = false;
    document.body.classList.add('login-open');
    setTimeout(() => document.getElementById('schoolEmail')?.focus(), 50);
  }
  function hideLogin() {
    const overlay = document.getElementById('loginGate');
    if (overlay) overlay.hidden = true;
    document.body.classList.remove('login-open');
  }
  function setLoginError(message='') {
    const node = document.getElementById('loginError');
    if (!node) return;
    node.textContent = message;
    node.hidden = !message;
  }
  function setLoginBusy(busy) {
    const button = document.querySelector('#loginForm button[type="submit"]');
    if (!button) return;
    button.disabled = busy;
    button.textContent = busy ? 'Wird verbunden …' : 'Weiter';
  }

  async function handleLogin(event) {
    event.preventDefault();
    const field = document.getElementById('schoolEmail');
    const email = normaliseEmail(field?.value);
    if (!validEmail(email)) {
      setLoginError('Bitte geben Sie Ihre BFF-Schul-E-Mail-Adresse ein.');
      return;
    }
    setLoginBusy(true); setLoginError('');
    try {
      await createSession(email);
      hideLogin();
      await reconcileModule(current);
      startPolling();
    } catch (error) {
      setLoginError(error.code === 'DB_NOT_CONFIGURED' ? 'Die Online-Speicherung ist auf der Webseite noch nicht fertig eingerichtet.' : 'Die Verbindung ist im Moment nicht möglich. Versuchen Sie es nochmals.');
    } finally { setLoginBusy(false); }
  }

  function continueLocal() {
    localOnly = true;
    localStorage.setItem(LOCAL_ONLY_KEY, '1');
    hideLogin();
    setSyncStatus('local', 'Nur lokal gespeichert');
    startPolling();
  }

  async function changeAccount() {
    if (!confirm('Möchten Sie die Schul-E-Mail-Adresse auf diesem Gerät wechseln? Der lokale Arbeitsstand bleibt erhalten.')) return;
    localStorage.removeItem(ACCOUNT_KEY);
    localStorage.removeItem(LOCAL_ONLY_KEY);
    learner = null; localOnly = false;
    updateAccountUi();
    showLogin();
  }

  async function init() {
    updateAccountUi();
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.querySelector('[data-continue-local]')?.addEventListener('click', continueLocal);
    document.querySelectorAll('[data-change-account]').forEach(button => button.addEventListener('click', changeAccount));
    window.addEventListener('online', () => learner?.email && !localOnly && reconcileModule(current));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && learner?.email && !localOnly) reconcileModule(current);
    });
    if (learner?.email && validEmail(learner.email)) {
      hideLogin();
      await reconcileModule(current);
      startPolling();
    } else if (localOnly) {
      hideLogin();
      setSyncStatus('local', 'Nur lokal gespeichert');
      startPolling();
    } else {
      showLogin();
      setSyncStatus('local', 'Anmeldung erforderlich');
    }
  }

  window.FRANZ_ACCOUNT = {
    getEmail: () => learner?.email || '',
    syncCurrent: () => reconcileModule(current)
  };

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
