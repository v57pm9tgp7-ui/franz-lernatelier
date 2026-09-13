import { COURSE_GROUPS, findStudentByEmail, getGroup } from './roster.js';

const ALLOWED_DOMAINS = new Set(['stud.bffbern.ch', 'bffbern.ch']);
const MAX_STATE_BYTES = 900_000;
const DEFAULT_TOPIC_CONFIGS = {
  'se-presenter-2026': Array.from({length:44}, (_,i) => `cards.${i}`)
};
const TOPIC_MODULE_IDS = {
  'se-presenter-2026': 'woche-37-2026'
};
const SECURITY_HEADERS = {
  'strict-transport-security': 'max-age=31536000',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(self), geolocation=(), payment=(), microphone=(self)',
  'cross-origin-resource-policy': 'same-origin'
};

let jwksCache = {url:'', expires:0, keys:[]};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function json(data, status = 200) {
  return withSecurityHeaders(new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0'
    }
  }));
}

function normaliseEmail(value = '') {
  return String(value).trim().toLowerCase();
}

function validEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const domain = email.split('@').pop();
  return ALLOWED_DOMAINS.has(domain);
}

function normaliseAccessDomain(value='') {
  return String(value || '').trim().replace(/\/+$/, '');
}

function b64urlBytes(value='') {
  const padded = value.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4 - value.length % 4) % 4);
  const raw = atob(padded);
  return Uint8Array.from(raw, ch => ch.charCodeAt(0));
}

function b64urlJson(value='') {
  return JSON.parse(new TextDecoder().decode(b64urlBytes(value)));
}

function configuredAudiences(env) {
  return String(env.ACCESS_AUDS || env.ACCESS_AUD || '')
    .split(/[,\s]+/)
    .map(v => v.trim())
    .filter(Boolean);
}

async function accessKeys(teamDomain) {
  const url = `${teamDomain}/cdn-cgi/access/certs`;
  const now = Date.now();
  if (jwksCache.url === url && jwksCache.expires > now && jwksCache.keys.length) return jwksCache.keys;
  const response = await fetch(url, {cf:{cacheTtl:300}});
  if (!response.ok) throw new Error('ACCESS_KEYS_UNAVAILABLE');
  const data = await response.json();
  const keys = Array.isArray(data.keys) ? data.keys : [];
  if (!keys.length) throw new Error('ACCESS_KEYS_EMPTY');
  jwksCache = {url, expires:now + 5*60_000, keys};
  return keys;
}

async function verifyTeacherAccess(request, env) {
  const teamDomain = normaliseAccessDomain(env.ACCESS_TEAM_DOMAIN);
  const audiences = configuredAudiences(env);
  const teacherEmail = normaliseEmail(env.TEACHER_EMAIL);
  if (!teamDomain || !audiences.length || !teacherEmail) throw new Error('TEACHER_ACCESS_NOT_CONFIGURED');

  const token = request.headers.get('cf-access-jwt-assertion') || '';
  if (!token) throw new Error('ACCESS_TOKEN_MISSING');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('ACCESS_TOKEN_INVALID');

  const header = b64urlJson(parts[0]);
  const payload = b64urlJson(parts[1]);
  if (header.alg !== 'RS256' || !header.kid) throw new Error('ACCESS_TOKEN_INVALID');

  const issuer = normaliseAccessDomain(payload.iss);
  if (issuer !== teamDomain) throw new Error('ACCESS_ISSUER_INVALID');
  const nowSeconds = Math.floor(Date.now()/1000);
  if (Number(payload.exp || 0) <= nowSeconds) throw new Error('ACCESS_TOKEN_EXPIRED');
  if (payload.nbf && Number(payload.nbf) > nowSeconds + 30) throw new Error('ACCESS_TOKEN_NOT_YET_VALID');

  const tokenAud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!tokenAud.some(aud => audiences.includes(String(aud)))) throw new Error('ACCESS_AUDIENCE_INVALID');

  const keys = await accessKeys(teamDomain);
  const jwk = keys.find(key => key.kid === header.kid);
  if (!jwk) throw new Error('ACCESS_KEY_NOT_FOUND');
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    {name:'RSASSA-PKCS1-v1_5', hash:'SHA-256'},
    false,
    ['verify']
  );
  const valid = await crypto.subtle.verify(
    {name:'RSASSA-PKCS1-v1_5'},
    key,
    b64urlBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );
  if (!valid) throw new Error('ACCESS_SIGNATURE_INVALID');

  const email = normaliseEmail(payload.email || request.headers.get('cf-access-authenticated-user-email'));
  if (!email || email !== teacherEmail) throw new Error('TEACHER_EMAIL_MISMATCH');
  return {...payload, email};
}

async function requireTeacher(request, env) {
  try {
    const user = await verifyTeacherAccess(request, env);
    return {ok:true, user};
  } catch (error) {
    const code = error?.message || 'TEACHER_ACCESS_DENIED';
    const configError = code === 'TEACHER_ACCESS_NOT_CONFIGURED';
    return {
      ok:false,
      response:json({
        ok:false,
        error:code,
        message:configError
          ? 'Der Lehrpersonenbereich ist noch nicht vollständig mit Cloudflare Access verbunden.'
          : 'Kein Zugriff auf den Lehrpersonenbereich.'
      }, configError ? 503 : 403)
    };
  }
}

async function ensureSchema(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS learners (
      email TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS progress (
      email TEXT NOT NULL,
      module_id TEXT NOT NULL,
      state_json TEXT NOT NULL,
      client_updated_at INTEGER NOT NULL,
      server_updated_at INTEGER NOT NULL,
      PRIMARY KEY (email, module_id)
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_progress_email ON progress(email)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS teacher_vocab_config (
      topic_id TEXT NOT NULL,
      group_id TEXT NOT NULL,
      learn_json TEXT NOT NULL,
      test_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      updated_by TEXT NOT NULL,
      PRIMARY KEY (topic_id, group_id)
    )`)
  ]);
}

async function readJsonBody(request) {
  const type = request.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new Error('JSON_REQUIRED');
  return request.json();
}

async function touchLearner(db, email, now) {
  await db.prepare(`INSERT INTO learners (email, created_at, last_seen_at)
    VALUES (?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET last_seen_at = excluded.last_seen_at`)
    .bind(email, now, now).run();
}

function safeIdList(value) {
  if (!Array.isArray(value)) return [];
  const result = [];
  const seen = new Set();
  for (const raw of value) {
    const id = String(raw || '').trim();
    if (!/^[a-zA-Z][a-zA-Z0-9_.:-]{0,80}$/.test(id) || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

function defaultTopicIds(topicId) {
  return [...(DEFAULT_TOPIC_CONFIGS[topicId] || [])];
}

async function getTopicConfig(db, topicId, groupId) {
  const defaults = defaultTopicIds(topicId);
  const row = await db.prepare(`SELECT learn_json, test_json, updated_at, updated_by
    FROM teacher_vocab_config WHERE topic_id = ? AND group_id = ?`)
    .bind(topicId, groupId).first();

  if (!row) {
    return {
      topicId, groupId,
      learnIds:defaults,
      testIds:defaults,
      configured:false,
      updatedAt:0,
      updatedBy:''
    };
  }
  let learnIds = defaults, testIds = defaults;
  try { learnIds = safeIdList(JSON.parse(row.learn_json)); } catch (_) {}
  try { testIds = safeIdList(JSON.parse(row.test_json)); } catch (_) {}
  const learnSet = new Set(learnIds);
  testIds = testIds.filter(id => learnSet.has(id));
  return {
    topicId, groupId, learnIds, testIds,
    configured:true,
    updatedAt:Number(row.updated_at || 0),
    updatedBy:String(row.updated_by || '')
  };
}

async function apiSession(request, env) {
  const body = await readJsonBody(request);
  const email = normaliseEmail(body.email);
  if (!validEmail(email)) {
    return json({ok:false, error:'INVALID_EMAIL', message:'Bitte verwenden Sie Ihre BFF-Schul-E-Mail-Adresse.'}, 400);
  }
  const now = Date.now();
  await touchLearner(env.DB, email, now);
  return json({ok:true, email, lastSeenAt:now});
}

async function apiGetProgress(request, env) {
  const body = await readJsonBody(request);
  const email = normaliseEmail(body.email);
  const moduleId = String(body.moduleId || '').trim();
  if (!validEmail(email) || !moduleId) return json({ok:false, error:'BAD_REQUEST'}, 400);
  const now = Date.now();
  await touchLearner(env.DB, email, now);
  const row = await env.DB.prepare(`SELECT state_json, client_updated_at, server_updated_at
    FROM progress WHERE email = ? AND module_id = ?`)
    .bind(email, moduleId).first();
  if (!row) return json({ok:true, found:false, moduleId});
  let state = {};
  try { state = JSON.parse(row.state_json); } catch (_) {}
  return json({
    ok:true,
    found:true,
    moduleId,
    state,
    clientUpdatedAt:Number(row.client_updated_at || 0),
    serverUpdatedAt:Number(row.server_updated_at || 0)
  });
}

async function apiPutProgress(request, env) {
  const body = await readJsonBody(request);
  const email = normaliseEmail(body.email);
  const moduleId = String(body.moduleId || '').trim();
  const clientUpdatedAt = Number(body.clientUpdatedAt || Date.now());
  const state = body.state;
  if (!validEmail(email) || !moduleId || !state || typeof state !== 'object' || Array.isArray(state)) {
    return json({ok:false, error:'BAD_REQUEST'}, 400);
  }
  const stateJson = JSON.stringify(state);
  if (new TextEncoder().encode(stateJson).length > MAX_STATE_BYTES) {
    return json({ok:false, error:'STATE_TOO_LARGE'}, 413);
  }
  const now = Date.now();
  await touchLearner(env.DB, email, now);
  await env.DB.prepare(`INSERT INTO progress (email, module_id, state_json, client_updated_at, server_updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(email, module_id) DO UPDATE SET
      state_json = excluded.state_json,
      client_updated_at = excluded.client_updated_at,
      server_updated_at = excluded.server_updated_at
    WHERE excluded.client_updated_at >= progress.client_updated_at`)
    .bind(email, moduleId, stateJson, clientUpdatedAt, now).run();

  const row = await env.DB.prepare(`SELECT state_json, client_updated_at, server_updated_at
    FROM progress WHERE email = ? AND module_id = ?`)
    .bind(email, moduleId).first();
  let savedState = state;
  try { savedState = JSON.parse(row.state_json); } catch (_) {}
  return json({
    ok:true,
    moduleId,
    state:savedState,
    clientUpdatedAt:Number(row.client_updated_at || clientUpdatedAt),
    serverUpdatedAt:Number(row.server_updated_at || now)
  });
}

async function apiTopicConfig(request, env) {
  const body = await readJsonBody(request);
  const email = normaliseEmail(body.email);
  const topicId = String(body.topicId || 'se-presenter-2026').trim();
  if (!validEmail(email) || !topicId) return json({ok:false, error:'BAD_REQUEST'}, 400);
  const student = findStudentByEmail(email);
  const groupId = student?.groupId || '';
  const defaults = defaultTopicIds(topicId);
  if (!groupId) {
    return json({
      ok:true, topicId, groupId:null, groupLabel:null,
      learnIds:defaults, testIds:defaults, configured:false
    });
  }
  const group = getGroup(groupId);
  const config = await getTopicConfig(env.DB, topicId, groupId);
  return json({
    ok:true,
    ...config,
    groupLabel:group?.label || groupId,
    classCode:student.classCode
  });
}

function vocabSummary(state, ids) {
  const result = {secure:0, uncertain:0, learn:0};
  const items = state?.practiceV2?.items || {};
  for (const id of ids) {
    const stat = items[id];
    if (stat?.level >= 3 || (stat?.successDays?.length || 0) >= 3) result.secure++;
    else if ((stat?.independent || 0) > 0) result.uncertain++;
    else result.learn++;
  }
  return result;
}

function lastVocabCheck(state, topicId) {
  const checks = state?.topicAssessments?.[topicId]?.vocabulaire?.checks;
  if (!Array.isArray(checks) || !checks.length) return null;
  const item = checks[checks.length - 1] || {};
  return {
    at:Number(item.at || 0),
    correct:Number(item.correct || 0),
    near:Number(item.near || 0),
    wrong:Number(item.wrong || 0),
    total:Number(item.total || 0),
    percent:Number(item.percent || 0)
  };
}

function progressSummary(state, learnIds, topicId) {
  const doneIds = [];
  for (let id=1; id<=8; id++) if (state?.missionDone?.[id]) doneIds.push(id);
  return {
    missionDone:doneIds,
    missionCount:doneIds.length,
    currentMission:Number(state?.currentMission || 0) || null,
    vocab:vocabSummary(state, learnIds),
    lastCheck:lastVocabCheck(state, topicId)
  };
}

async function apiTeacherMe(request, env, user) {
  return json({ok:true, email:user.email});
}

async function apiTeacherRoster(request, env) {
  return json({
    ok:true,
    groups:Object.values(COURSE_GROUPS).map(group => ({
      id:group.id,
      label:group.label,
      sourceLabel:group.sourceLabel,
      count:group.students.length,
      students:group.students
    }))
  });
}

async function apiTeacherVocabulary(request, env, user) {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const groupId = String(url.searchParams.get('group') || '').trim();
    const topicId = String(url.searchParams.get('topicId') || 'se-presenter-2026').trim();
    if (!getGroup(groupId) || !topicId) return json({ok:false, error:'BAD_REQUEST'}, 400);
    const config = await getTopicConfig(env.DB, topicId, groupId);
    return json({ok:true, ...config});
  }

  if (request.method === 'PUT') {
    const body = await readJsonBody(request);
    const groupId = String(body.groupId || '').trim();
    const topicId = String(body.topicId || 'se-presenter-2026').trim();
    if (!getGroup(groupId) || !topicId) return json({ok:false, error:'BAD_REQUEST'}, 400);

    let learnIds = safeIdList(body.learnIds);
    const requestedTestIds = safeIdList(body.testIds);
    const learnSet = new Set(learnIds);
    for (const id of requestedTestIds) {
      if (!learnSet.has(id)) { learnSet.add(id); learnIds.push(id); }
    }
    const testIds = requestedTestIds.filter(id => learnSet.has(id));
    const now = Date.now();

    await env.DB.prepare(`INSERT INTO teacher_vocab_config
      (topic_id, group_id, learn_json, test_json, updated_at, updated_by)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(topic_id, group_id) DO UPDATE SET
        learn_json=excluded.learn_json,
        test_json=excluded.test_json,
        updated_at=excluded.updated_at,
        updated_by=excluded.updated_by`)
      .bind(topicId, groupId, JSON.stringify(learnIds), JSON.stringify(testIds), now, user.email).run();

    return json({
      ok:true, topicId, groupId, learnIds, testIds,
      configured:true, updatedAt:now, updatedBy:user.email
    });
  }

  return json({ok:false, error:'METHOD_NOT_ALLOWED'}, 405);
}

async function apiTeacherDashboard(request, env) {
  const url = new URL(request.url);
  const groupId = String(url.searchParams.get('group') || '').trim();
  const topicId = String(url.searchParams.get('topicId') || 'se-presenter-2026').trim();
  const group = getGroup(groupId);
  if (!group || !topicId) return json({ok:false, error:'BAD_REQUEST'}, 400);

  const config = await getTopicConfig(env.DB, topicId, groupId);
  const moduleId = TOPIC_MODULE_IDS[topicId] || 'woche-37-2026';
  const emails = group.students.map(student => student.email);
  const marks = emails.map(() => '?').join(',');

  const [learnerQuery, progressQuery] = await Promise.all([
    env.DB.prepare(`SELECT email, last_seen_at FROM learners WHERE email IN (${marks})`)
      .bind(...emails).all(),
    env.DB.prepare(`SELECT email, state_json, server_updated_at FROM progress
      WHERE module_id = ? AND email IN (${marks})`)
      .bind(moduleId, ...emails).all()
  ]);

  const lastSeenMap = new Map((learnerQuery.results || []).map(row => [row.email, Number(row.last_seen_at || 0)]));
  const progressMap = new Map((progressQuery.results || []).map(row => [row.email, row]));

  const students = group.students.map(student => {
    const row = progressMap.get(student.email);
    let state = {};
    if (row?.state_json) {
      try { state = JSON.parse(row.state_json); } catch (_) {}
    }
    const summary = progressSummary(state, config.learnIds, topicId);
    const lastSeen = Math.max(lastSeenMap.get(student.email) || 0, Number(row?.server_updated_at || 0));
    return {
      ...student,
      hasProgress:!!row,
      lastSeenAt:lastSeen,
      ...summary
    };
  });

  return json({
    ok:true,
    group:{id:group.id,label:group.label,sourceLabel:group.sourceLabel,count:group.students.length},
    topicId,
    moduleId,
    config:{learnIds:config.learnIds,testIds:config.testIds,configured:config.configured,updatedAt:config.updatedAt},
    students
  });
}

async function handleTeacherApi(request, env) {
  const guard = await requireTeacher(request, env);
  if (!guard.ok) return guard.response;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/lehrperson/, '');
  if (path === '/api/teacher/me' && request.method === 'GET') return apiTeacherMe(request, env, guard.user);
  if (path === '/api/teacher/roster' && request.method === 'GET') return apiTeacherRoster(request, env);
  if (path === '/api/teacher/vocabulary') return apiTeacherVocabulary(request, env, guard.user);
  if (path === '/api/teacher/dashboard' && request.method === 'GET') return apiTeacherDashboard(request, env);
  return json({ok:false, error:'NOT_FOUND'}, 404);
}

async function handleApi(request, env) {
  if (!env.DB) return json({ok:false, error:'DB_NOT_CONFIGURED', message:'Die Online-Speicherung ist noch nicht eingerichtet.'}, 503);
  await ensureSchema(env.DB);
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/teacher/') || url.pathname.startsWith('/lehrperson/api/teacher/')) return handleTeacherApi(request, env);
  if (url.pathname === '/api/status' && request.method === 'GET') return json({ok:true, database:true});
  if (url.pathname === '/api/session' && request.method === 'POST') return apiSession(request, env);
  if (url.pathname === '/api/progress/load' && request.method === 'POST') return apiGetProgress(request, env);
  if (url.pathname === '/api/progress' && request.method === 'PUT') return apiPutProgress(request, env);
  if (url.pathname === '/api/topic-config' && request.method === 'POST') return apiTopicConfig(request, env);
  return json({ok:false, error:'NOT_FOUND'}, 404);
}

async function fixWeek36Mission4(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return withSecurityHeaders(response);

  let html = await response.text();
  html = html.replace(
    'const right=[true,false,true,false,true,true];',
    'const right=[true,false,true,true,false,true];'
  );

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.set('cache-control', 'no-cache, max-age=0, must-revalidate');

  return withSecurityHeaders(new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol !== 'https:') {
      url.protocol = 'https:';
      return withSecurityHeaders(Response.redirect(url.toString(), 308));
    }

    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/lehrperson/api/teacher/')) {
      try {
        return await handleApi(request, env);
      } catch (error) {
        console.error('API error', error);
        const code = error?.message === 'JSON_REQUIRED' ? 415 : 500;
        return json({ok:false, error:error?.message || 'SERVER_ERROR'}, code);
      }
    }

    const response = await env.ASSETS.fetch(request);
    const isWeek36 = /\/module\/woche-36(?:\/index\.html|\/)?$/.test(url.pathname);
    if (isWeek36) return fixWeek36Mission4(response);
    return withSecurityHeaders(response);
  }
};
