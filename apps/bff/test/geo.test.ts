import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import type { Response as InjectResponse } from 'light-my-request';
import { buildApp } from '../src/app.js';
import { authentication, testConfig, testStore } from './fixtures.js';

const apps: FastifyInstance[] = [];
afterEach(async () => {
  vi.unstubAllGlobals();
  await Promise.all(apps.splice(0).map(app => app.close()));
});
const setup = async (config = testConfig({ GEO_BASE_URL: 'http://geo.test' })) => {
  const app = await buildApp(config, { store: testStore(), authenticate: async () => authentication(), ready: async () => true });
  apps.push(app);
  await app.ready();
  return app;
};
const cookieOf = (response: InjectResponse) => {
  const header = response.headers['set-cookie'];
  return (Array.isArray(header) ? header.at(-1) : header)?.split(';')[0] ?? '';
};
const csrf = async (app: FastifyInstance, cookie = '') => {
  const response = await app.inject({ url: '/bff/v1/auth/csrf', headers: { cookie } });
  expect(response.statusCode).toBe(200);
  return { cookie: cookieOf(response) || cookie, token: response.json<{ token: string }>().token };
};
const login = async (app: FastifyInstance) => {
  const initial = await csrf(app);
  const response = await app.inject({ method: 'POST', url: '/bff/v1/auth/login', headers: { cookie: initial.cookie, origin: 'http://localhost:5173', 'x-csrf-token': initial.token }, payload: { username: 'manager', password: 'synthetic-password' } });
  expect(response.statusCode).toBe(200);
  return cookieOf(response);
};
const upload = async (app: FastifyInstance, filename: string, extra: Record<string, string> = {}) => {
  const boundary = 'synthetic-boundary';
  const payload = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/vnd.google-earth.kmz\r\n\r\nsynthetic-kmz-bytes\r\n--${boundary}--\r\n`);
  return app.inject({ method: 'POST', url: '/bff/v1/geo/imports/kmz', headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, origin: 'http://localhost:5173', ...extra }, payload });
};
const importResult = { saved_routes: 2, saved_points: 5, endpoints: { resolved: 1, unresolved: 0, not_applicable: 1 } };

describe('geo routes', () => {
  it('requires a session to list routes', async () => {
    const app = await setup();
    expect((await app.inject('/bff/v1/geo/routes')).statusCode).toBe(401);
  });

  it('proxies the upstream and returns the validated array', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json([{ _id: 'route-1', name: 'Ruta Norte', code: 'R1', route_code: 'RC-1', meeting_point_ids: ['mp-1', 'mp-2'] }]));
    vi.stubGlobal('fetch', fetcher);
    const app = await setup();
    const response = await app.inject({ url: '/bff/v1/geo/routes', headers: { cookie: await login(app) } });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([{ _id: 'route-1', name: 'Ruta Norte', code: 'R1', route_code: 'RC-1', meeting_point_ids: ['mp-1', 'mp-2'] }]);
    expect(String(fetcher.mock.calls[0]?.[0])).toBe('http://geo.test/api/v1/routes');
    expect(response.body).not.toContain('backend-token');
  });

  it('rejects a KMZ import without a CSRF token', async () => {
    const app = await setup();
    const response = await upload(app, 'rutas.kmz', { cookie: await login(app) });
    expect(response.statusCode).toBe(403);
  });

  it('rejects a non-KMZ file before contacting the upstream', async () => {
    const fetcher = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetcher);
    const app = await setup();
    const cookie = await login(app);
    const { token } = await csrf(app, cookie);
    const response = await upload(app, 'rutas.txt', { cookie, 'x-csrf-token': token });
    expect(response.statusCode).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('keeps the upstream validation detail on 422', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(Response.json({ detail: 'El KMZ no contiene paradas.' }, { status: 422 })));
    const app = await setup();
    const cookie = await login(app);
    const { token } = await csrf(app, cookie);
    const response = await upload(app, 'rutas.kmz', { cookie, 'x-csrf-token': token });
    expect(response.statusCode).toBe(422);
    expect(response.json().error.message).toBe('El KMZ no contiene paradas.');
  });

  it('returns the import summary on upstream success', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(Response.json(importResult, { status: 201 })));
    const app = await setup();
    const cookie = await login(app);
    const { token } = await csrf(app, cookie);
    const response = await upload(app, 'rutas.kmz', { cookie, 'x-csrf-token': token });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ saved_routes: 2, saved_points: 5, endpoints: { resolved: 1, unresolved: 0, not_applicable: 1 } });
  });
});
