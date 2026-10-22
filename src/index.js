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
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS teacher_control_events (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      event_date TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      updated_by TEXT NOT NULL
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_teacher_control_group_date
      ON teacher_control_events(group_id, event_date DESC)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS teacher_control_marks (
      event_id TEXT NOT NULL,
      student_email TEXT NOT NULL,
      status TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      updated_at INTEGER NOT NULL,
      updated_by TEXT NOT NULL,
      PRIMARY KEY(event_id, student_email),
      FOREIGN KEY(event_id) REFERENCES teacher_control_events(id) ON DELETE CASCADE
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS teacher_control_members (
      group_id TEXT NOT NULL,
      student_email TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY(group_id, student_email)
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


const CONTROL_STATUSES = Object.freeze({
  attendance: ['open','present','absent','late','excused'],
  homework: ['open','done','partial','missing','excused'],
  test: ['open','done','makeup','excused']
});
function controlDate(value){
  const v=String(value || '');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v)) ||
    new Date(v+'T12:00:00Z').toISOString().slice(0,10)!==v) throw new Error('INVALID_DATE');
  return v;
}
function controlText(value,max=300){
  const s=String(value ?? '').trim();
  if(s.length>max) throw new Error('TEXT_TOO_LONG');
  return s;
}
function controlGroup(groupId){
  const group=getGroup(String(groupId||''));
  if(!group) throw new Error('INVALID_GROUP');
  return group;
}
async function findControlEvent(db,id,groupId){
  return db.prepare('SELECT * FROM teacher_control_events WHERE id = ? AND group_id = ?')
    .bind(id,groupId).first();
}
async function apiTeacherControls(request,env,user){
  const url=new URL(request.url);
  if(request.method==='GET'){
    const group=controlGroup(url.searchParams.get('group'));
    const data=await env.DB.prepare(`SELECT id,group_id,kind,title,event_date,details,created_at,updated_at
      FROM teacher_control_events WHERE group_id=?
      ORDER BY event_date DESC, created_at DESC LIMIT 400`).bind(group.id).all();
    const events=(data.results||[]).map(row=>({
      id:row.id,groupId:row.group_id,kind:row.kind,title:row.title,date:row.event_date,
      details:row.details,createdAt:row.created_at,updatedAt:row.updated_at,marks:{}
    }));
    const lookup=new Map(events.map(item=>[item.id,item]));
    const marks=await env.DB.prepare(`SELECT m.event_id,m.student_email,m.status,m.note
      FROM teacher_control_marks m JOIN teacher_control_events e ON e.id=m.event_id
      WHERE e.group_id=? AND e.id IN
      (SELECT id FROM teacher_control_events WHERE group_id=?
        ORDER BY event_date DESC,created_at DESC LIMIT 400)`).bind(group.id,group.id).all();
    for(const m of (marks.results||[])){
      const event=lookup.get(m.event_id);
      if(event)event.marks[m.student_email]={status:m.status,note:m.note};
    }
    const members=await env.DB.prepare('SELECT student_email FROM teacher_control_members WHERE group_id=? AND active=0')
      .bind(group.id).all();
    return json({ok:true,events,inactiveEmails:(members.results||[]).map(row=>row.student_email)});
  }
  const body=await readJsonBody(request);
  const group=controlGroup(body.groupId);
  if(request.method==='POST'){
    const kind=controlText(body.kind,24);
    if(!CONTROL_STATUSES[kind])return json({ok:false,error:'INVALID_KIND'},400);
    const date=controlDate(body.date),title=controlText(body.title||'Unterricht',100);
    const details=controlText(body.details,350);
    if(!title)return json({ok:false,error:'TITLE_REQUIRED'},400);
    if(kind==='attendance'){
      const existing=await env.DB.prepare(`SELECT id FROM teacher_control_events
        WHERE group_id=? AND kind='attendance' AND event_date=? LIMIT 1`).bind(group.id,date).first();
      if(existing)return json({ok:true,existing:true,id:existing.id});
    }
    const id=crypto.randomUUID(),now=Date.now();
    await env.DB.prepare(`INSERT INTO teacher_control_events
      (id,group_id,kind,title,event_date,details,created_at,updated_at,updated_by)
      VALUES(?,?,?,?,?,?,?,?,?)`).bind(id,group.id,kind,title,date,details,now,now,user.email).run();
    return json({ok:true,id});
  }
  const id=String(body.id||'');
  const event=await findControlEvent(env.DB,id,group.id);
  if(!event)return json({ok:false,error:'NOT_FOUND'},404);
  if(request.method==='PUT'){
    const title=controlText(body.title,100),date=controlDate(body.date),
      details=controlText(body.details,350);
    if(!title)return json({ok:false,error:'TITLE_REQUIRED'},400);
    if(event.kind==='attendance'&&date!==event.event_date){
      const existing=await env.DB.prepare(`SELECT id FROM teacher_control_events
        WHERE group_id=? AND kind='attendance' AND event_date=? AND id<>? LIMIT 1`)
        .bind(group.id,date,id).first();
      if(existing)return json({ok:false,error:'DATE_ALREADY_EXISTS'},409);
    }
    await env.DB.prepare(`UPDATE teacher_control_events SET title=?,event_date=?,details=?,
      updated_at=?,updated_by=? WHERE id=? AND group_id=?`)
      .bind(title,date,details,Date.now(),user.email,id,group.id).run();
    return json({ok:true,id});
  }
  if(request.method==='DELETE'){
    await env.DB.batch([
      env.DB.prepare('DELETE FROM teacher_control_marks WHERE event_id=?').bind(id),
      env.DB.prepare('DELETE FROM teacher_control_events WHERE id=? AND group_id=?').bind(id,group.id)
    ]);
    return json({ok:true,id});
  }
  return json({ok:false,error:'METHOD_NOT_ALLOWED'},405);
}
async function apiTeacherControlMark(request,env,user){
  if(request.method!=='PUT')return json({ok:false,error:'METHOD_NOT_ALLOWED'},405);
  const body=await readJsonBody(request),group=controlGroup(body.groupId);
  const event=await findControlEvent(env.DB,String(body.id||''),group.id);
  if(!event)return json({ok:false,error:'NOT_FOUND'},404);
  const email=normaliseEmail(body.email);
  if(!group.students.some(s=>s.email===email))return json({ok:false,error:'INVALID_STUDENT'},400);
  const status=controlText(body.status,30),note=controlText(body.note,300);
  if(!CONTROL_STATUSES[event.kind].includes(status))return json({ok:false,error:'INVALID_STATUS'},400);
  const now=Date.now();
  await env.DB.prepare(`INSERT INTO teacher_control_marks
    (event_id,student_email,status,note,updated_at,updated_by)
    VALUES(?,?,?,?,?,?)
    ON CONFLICT(event_id,student_email) DO UPDATE SET
      status=excluded.status,note=excluded.note,
      updated_at=excluded.updated_at,updated_by=excluded.updated_by`)
    .bind(event.id,email,status,note,now,user.email).run();
  return json({ok:true,email,status,note});
}
async function apiTeacherControlBulk(request,env,user){
  if(request.method!=='POST')return json({ok:false,error:'METHOD_NOT_ALLOWED'},405);
  const body=await readJsonBody(request),group=controlGroup(body.groupId);
  const event=await findControlEvent(env.DB,String(body.id||''),group.id);
  if(!event)return json({ok:false,error:'NOT_FOUND'},404);
  const status=controlText(body.status,30);
  if(status==='open'||!CONTROL_STATUSES[event.kind].includes(status))
    return json({ok:false,error:'INVALID_STATUS'},400);
  if(!Array.isArray(body.emails)||body.emails.length>60)return json({ok:false,error:'INVALID_STUDENTS'},400);
  const all=new Set(group.students.map(s=>s.email));
  const emails=[...new Set(body.emails.map(normaliseEmail))];
  if(emails.some(email=>!all.has(email)))return json({ok:false,error:'INVALID_STUDENT'},400);
  if(!emails.length)return json({ok:true,count:0});
  const now=Date.now();
  const queries=emails.map(email=>env.DB.prepare(`INSERT INTO teacher_control_marks
    (event_id,student_email,status,note,updated_at,updated_by) VALUES(?,?,?,'',?,?)
    ON CONFLICT(event_id,student_email) DO UPDATE SET
      status=excluded.status,updated_at=excluded.updated_at,updated_by=excluded.updated_by
    WHERE teacher_control_marks.status='open'`).bind(event.id,email,status,now,user.email));
  await env.DB.batch(queries);
  return json({ok:true,count:emails.length});
}
async function apiTeacherControlMember(request,env){
  if(request.method!=='PUT')return json({ok:false,error:'METHOD_NOT_ALLOWED'},405);
  const body=await readJsonBody(request),group=controlGroup(body.groupId);
  const email=normaliseEmail(body.email);
  if(!group.students.some(s=>s.email===email)||typeof body.active!=='boolean')
    return json({ok:false,error:'INVALID_MEMBER'},400);
  await env.DB.prepare(`INSERT INTO teacher_control_members(group_id,student_email,active,updated_at)
    VALUES(?,?,?,?) ON CONFLICT(group_id,student_email) DO UPDATE SET
    active=excluded.active,updated_at=excluded.updated_at`)
    .bind(group.id,email,body.active?1:0,Date.now()).run();
  return json({ok:true,email,active:body.active});
}

async function handleTeacherApi(request, env) {
  // Cloudflare Access schützt den gesamten Pfad /lehrperson/* bereits vor dem Worker.
  // Deshalb gibt es hier bewusst keine zweite, variablenabhängige JWT-Prüfung mehr.
  // So kann ein normaler GitHub/Wrangler-Deploy den Lehrpersonenbereich nicht mehr
  // durch fehlende ACCESS_* Runtime-Variablen ausser Funktion setzen.
  const user = {email:'christoph.marti@bffbern.ch'};
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/lehrperson/, '');
  if (path === '/api/teacher/me' && request.method === 'GET') return apiTeacherMe(request, env, user);
  if (path === '/api/teacher/roster' && request.method === 'GET') return apiTeacherRoster(request, env);
  if (path === '/api/teacher/vocabulary') return apiTeacherVocabulary(request, env, user);
  if (path === '/api/teacher/dashboard' && request.method === 'GET') return apiTeacherDashboard(request, env);
  if (path === '/api/teacher/controls') return apiTeacherControls(request,env,user);
  if (path === '/api/teacher/controls/mark') return apiTeacherControlMark(request,env,user);
  if (path === '/api/teacher/controls/bulk') return apiTeacherControlBulk(request,env,user);
  if (path === '/api/teacher/controls/member') return apiTeacherControlMember(request,env);
  return json({ok:false, error:'NOT_FOUND'}, 404);
}

async function handleApi(request, env) {
  if (!env.DB) return json({ok:false, error:'DB_NOT_CONFIGURED', message:'Die Online-Speicherung ist noch nicht eingerichtet.'}, 503);
  await ensureSchema(env.DB);
  const url = new URL(request.url);
  if (url.pathname.startsWith('/lehrperson/api/teacher/')) return handleTeacherApi(request, env);
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
