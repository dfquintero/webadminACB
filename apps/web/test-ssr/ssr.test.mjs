import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('../', import.meta.url));
const capabilities = { auth: true, estudiantes: false, guias: false, rutas: false, asignaciones: false, asistencia: false, alertas: false, dashboard: false, geo: false };
const sessionCalls = [];
let web;
let base;
let logs = '';
const bff = createServer((request, response) => {
  response.setHeader('content-type', 'application/json');
  const cookie = request.headers.cookie ?? '';
  if (cookie.includes('offline')) { response.writeHead(503).end('{}'); return; }
  const name = cookie.includes('opaque-one') ? 'Manager One' : cookie.includes('opaque-two') ? 'Manager Two' : null;
  if (!name) { response.writeHead(401).end('{}'); return; }
  if (request.url === '/bff/v1/auth/session') {
    sessionCalls.push(name);
    response.end(JSON.stringify({ user: { id: name, name, role: 'MANAGER', zone: null }, expiresAt: new Date(Date.now() + 3600000).toISOString(), token: 'BACKEND_TOKEN_MUST_NOT_LEAK' }));
  } else if (request.url === '/bff/v1/capabilities') response.end(JSON.stringify(capabilities));
  else response.writeHead(404).end('{}');
});
const listen = async server => { server.listen(0, '127.0.0.1'); await once(server, 'listening'); return server.address().port; };
const request = (path, cookie = '') => fetch(`${base}${path}`, { redirect: 'manual', headers: cookie ? { cookie: `acb_session_dev=${cookie}` } : {}, signal: AbortSignal.timeout(20000) });

before(async () => {
  const bffPort = await listen(bff);
  const reservation = createServer();
  const port = await listen(reservation);
  await new Promise(resolve => reservation.close(resolve));
  base = `http://127.0.0.1:${port}`;
  web = spawn(process.execPath, ['scripts/start.mjs'], {
    cwd: directory, env: { ...process.env, NODE_ENV: 'production', HOSTNAME: '127.0.0.1', PORT: String(port), NEXT_TELEMETRY_DISABLED: '1', BFF_INTERNAL_URL: `http://127.0.0.1:${bffPort}`, PUBLIC_ORIGIN: base }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const capture = data => { logs = (logs + data.toString()).slice(-10000); };
  web.stdout.on('data', capture);
  web.stderr.on('data', capture);
  for (let i = 0; i < 120; i++) {
    if (web.exitCode !== null) throw new Error(`Next.js exited: ${logs}`);
    try { if ((await request('/api/health')).status === 200) return; } catch {}
    await delay(250);
  }
  throw new Error(`Next.js did not start: ${logs}`);
});

after(async () => {
  if (web && web.exitCode === null) {
    const exited = once(web, 'exit');
    web.kill('SIGTERM');
    await Promise.race([exited, delay(5000, undefined, { ref: false })]);
    if (web.exitCode === null && web.signalCode === null) web.kill('SIGKILL');
  }
  bff.closeAllConnections();
  await new Promise(resolve => bff.close(resolve));
});

test('login fields and MUI styles exist before JavaScript runs', async () => {
  const response = await request('/login');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('name="username"'));
  assert.ok(html.includes('name="password"'));
  assert.ok(html.includes('data-emotion'));
  const asset = html.match(/src="(\/_next\/static\/[^"]+\.js[^"]*)"/);
  assert.ok(asset, 'Next.js script reference must exist');
  assert.equal((await request(asset[1])).status, 200);
});

test('every administrative route rejects an anonymous request', async () => {
  for (const path of ['/', '/estudiantes', '/rutas', '/guias', '/asignaciones', '/asistencia', '/alertas']) {
    const response = await request(path);
    const html = await response.text();
    const redirects = [303, 307, 308].includes(response.status) && response.headers.get('location')?.endsWith('/login');
    assert.ok(redirects || html.includes('url=/login'), `Expected server redirect for ${path}`);
    assert.ok(!html.includes('Manager One'));
  }
});

test('parallel server renders isolate identities and never serialize bearer or opaque cookies', async () => {
  const [one, two] = await Promise.all([request('/', 'opaque-one'), request('/', 'opaque-two')]);
  assert.equal(one.status, 200);
  assert.equal(two.status, 200);
  assert.match(one.headers.get('cache-control'), /private|no-store/);
  const [first, second] = await Promise.all([one.text(), two.text()]);
  assert.ok(first.includes('Manager One'));
  assert.ok(!first.includes('Manager Two'));
  assert.ok(second.includes('Manager Two'));
  assert.ok(!second.includes('Manager One'));
  for (const html of [first, second]) {
    assert.ok(!html.includes('BACKEND_TOKEN_MUST_NOT_LEAK'));
    assert.ok(!html.includes('opaque-one'));
    assert.ok(!html.includes('opaque-two'));
  }
  const again = await request('/estudiantes', 'opaque-one');
  assert.equal(again.status, 200);
  assert.ok((await again.text()).includes('Esta función está pendiente'));
  assert.ok(sessionCalls.filter(name => name === 'Manager One').length >= 2);
});

test('every administrative page renders unavailable contracts without fabricating data', async () => {
  for (const path of ['/estudiantes', '/rutas', '/guias', '/asignaciones', '/asistencia', '/alertas']) {
    const response = await request(path, 'opaque-one');
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('Esta función está pendiente'), `Expected explicit capability message for ${path}`);
    assert.ok(!html.includes('BACKEND_TOKEN_MUST_NOT_LEAK'));
  }
});

test('RSC requests cannot bypass page authorization', async () => {
  const response = await fetch(`${base}/estudiantes?_rsc`, { redirect: 'manual', headers: { rsc: '1' } });
  const body = await response.text();
  assert.ok(response.headers.get('location')?.endsWith('/login') || body.includes('NEXT_REDIRECT'), `Anonymous RSC request returned ${response.status} without a login redirect`);
  assert.ok(!body.includes('Manager One'));
});

test('an authenticated login request is redirected to the panel', async () => {
  const response = await request('/login', 'opaque-one');
  const html = await response.text();
  assert.ok([303, 307, 308].includes(response.status) || html.includes('url=/'));
});

test('BFF failure is explicit and does not expose administrative content', async () => {
  const response = await request('/', 'offline');
  const html = await response.text();
  assert.ok(html.includes('No se pudo comprobar la sesión con el BFF'));
  assert.ok(!html.includes('Manager One'));
});

test('unknown pages retain a real 404 response', async () => {
  const response = await request('/nonexistent');
  assert.equal(response.status, 404);
});
