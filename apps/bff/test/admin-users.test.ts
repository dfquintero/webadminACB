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
const setup = async (config = testConfig({ ADMIN_USERS_BASE_URL: 'http://admin.test' })) => {
  const app = await buildApp(config, { store: testStore(), authenticate: async () => authentication(), ready: async () => true });
  apps.push(app);
  await app.ready();
  return app;
};
const cookieOf = (response: InjectResponse) => {
  const header = response.headers['set-cookie'];
  return (Array.isArray(header) ? header.at(-1) : header)?.split(';')[0] ?? '';
};
const login = async (app: FastifyInstance) => {
  const initial = await app.inject({ url: '/bff/v1/auth/csrf' });
  const response = await app.inject({ method: 'POST', url: '/bff/v1/auth/login', headers: { cookie: cookieOf(initial), origin: 'http://localhost:5173', 'x-csrf-token': initial.json<{ token: string }>().token }, payload: { username: 'manager', password: 'synthetic-password' } });
  expect(response.statusCode).toBe(200);
  return cookieOf(response);
};
const student = { userId: 7, documentType: 'TI', documentNumber: '100200300', name: 'Estudiante Sintético' };

describe('admin_users routes', () => {
  it('requires a session', async () => {
    const app = await setup();
    expect((await app.inject('/bff/v1/students')).statusCode).toBe(401);
  });

  it('forwards the session bearer upstream without exposing it', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ content: [student], totalElements: 1 }));
    vi.stubGlobal('fetch', fetcher);
    const app = await setup();
    const response = await app.inject({ url: '/bff/v1/students', headers: { cookie: await login(app) } });
    expect(response.statusCode).toBe(200);
    expect(response.json().content).toEqual([student]);
    const headers = fetcher.mock.calls[0]?.[1]?.headers as Record<string, string>;
    expect(String(fetcher.mock.calls[0]?.[0])).toBe('http://admin.test/api/v1/students?page=0&size=10');
    expect(headers.authorization).toBe('Bearer backend-token-never-public');
    expect(response.body).not.toContain('backend-token');
  });

  it('maps upstream 404 to NOT_FOUND', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response('not found', { status: 404 })));
    const app = await setup();
    const response = await app.inject({ url: '/bff/v1/students/9', headers: { cookie: await login(app) } });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
  });

  it('maps an upstream 5xx to UPSTREAM_ERROR', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response('boom', { status: 500 })));
    const app = await setup();
    const response = await app.inject({ url: '/bff/v1/students', headers: { cookie: await login(app) } });
    expect(response.statusCode).toBe(502);
    expect(response.json().error.code).toBe('UPSTREAM_ERROR');
  });

  it('reports capabilities from the configured upstreams', async () => {
    const full = await setup(testConfig({ ADMIN_USERS_BASE_URL: 'http://admin.test', GEO_BASE_URL: 'http://geo.test' }));
    const enabled = await full.inject({ url: '/bff/v1/capabilities', headers: { cookie: await login(full) } });
    expect(enabled.json()).toMatchObject({ estudiantes: true, guias: true, rutas: true, geo: true });
    const minimal = await setup(testConfig());
    const disabled = await minimal.inject({ url: '/bff/v1/capabilities', headers: { cookie: await login(minimal) } });
    expect(disabled.json()).toMatchObject({ estudiantes: false, guias: false, rutas: false, geo: false });
  });
});
