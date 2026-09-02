const ALLOWED_DOMAINS = new Set(['stud.bffbern.ch', 'bffbern.ch']);
const MAX_STATE_BYTES = 900_000;
const SECURITY_HEADERS = {
  'strict-transport-security': 'max-age=31536000',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), geolocation=(), payment=(), microphone=(self)',
  'cross-origin-resource-policy': 'same-origin'
};

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
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_progress_email ON progress(email)`)
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

async function handleApi(request, env) {
  if (!env.DB) return json({ok:false, error:'DB_NOT_CONFIGURED', message:'Die Online-Speicherung ist noch nicht eingerichtet.'}, 503);
  await ensureSchema(env.DB);
  const url = new URL(request.url);
  if (url.pathname === '/api/status' && request.method === 'GET') return json({ok:true, database:true});
  if (url.pathname === '/api/session' && request.method === 'POST') return apiSession(request, env);
  if (url.pathname === '/api/progress/load' && request.method === 'POST') return apiGetProgress(request, env);
  if (url.pathname === '/api/progress' && request.method === 'PUT') return apiPutProgress(request, env);
  return json({ok:false, error:'NOT_FOUND'}, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Keine unverschluesselte Nutzung: HTTP immer dauerhaft auf HTTPS umleiten.
    if (url.protocol !== 'https:') {
      url.protocol = 'https:';
      return withSecurityHeaders(Response.redirect(url.toString(), 308));
    }

    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env);
      } catch (error) {
        console.error('API error', error);
        const code = error?.message === 'JSON_REQUIRED' ? 415 : 500;
        return json({ok:false, error:'SERVER_ERROR'}, code);
      }
    }

    const response = await env.ASSETS.fetch(request);
    return withSecurityHeaders(response);
  }
};
