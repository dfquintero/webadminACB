import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import type { Response } from 'light-my-request';
import { buildApp } from '../src/app.js';
import { ApiFault, storageUnavailable } from '../src/errors.js';
import { authentication, testConfig, testStore } from './fixtures.js';
import { createSessionStore } from '../src/plugins/session-store.js';

const apps: FastifyInstance[] = [];
afterEach(async () => { await Promise.all(apps.splice(0).map(app => app.close())); });
const setup = async (extra: Partial<Parameters<typeof buildApp>[1]> = {}, config = testConfig()) => {
  const app = await buildApp(config, { store: testStore(), authenticate: async () => authentication(), ready: async () => true, ...extra });
  apps.push(app);
  await app.ready();
  return app;
};
const cookieOf = (response: Response) => {
  const header = response.headers['set-cookie'];
  return (Array.isArray(header) ? header.at(-1) : header)?.split(';')[0] ?? '';
};
const csrf = async (app: FastifyInstance, cookie = '') => {
  const response = await app.inject({ url: '/bff/v1/auth/csrf', headers: { cookie } });
  expect(response.statusCode).toBe(200);
  return { cookie: cookieOf(response) || cookie, token: response.json<{ token: string }>().token };
};
const login = async (app: FastifyInstance, username = 'manager') => {
  const initial = await csrf(app);
  return app.inject({ method: 'POST', url: '/bff/v1/auth/login', headers: { cookie: initial.cookie, origin: 'http://localhost:5173', 'x-csrf-token': initial.token }, payload: { username, password: 'synthetic-password' } });
};

describe('BFF session boundary', () => {
  it('round-trips authentication through encrypted storage without rotating cookies on SSR reads', async () => {
    const config = testConfig();
    const entries = new Map<string, string>();
    const redis = {
      get: async (key: string) => entries.get(key) ?? null,
      set: async (key: string, value: string) => { entries.set(key, value); return 'OK'; },
      del: async (key: string) => Number(entries.delete(key)),
    };
    const app = await setup({ store: createSessionStore(redis, config.SESSION_ENCRYPTION_KEY) }, config);
    const loggedIn = await login(app);
    expect(loggedIn.statusCode).toBe(200);
    const response = await app.inject({ url: '/bff/v1/auth/session', headers: { cookie: cookieOf(loggedIn) } });
    expect(response.statusCode).toBe(200);
    expect(response.json().user.role).toBe('MANAGER');
    expect(response.headers['set-cookie']).toBeUndefined();
    expect([...entries.values()].join('')).not.toContain('backend-token');
  });
  it('requires a session and does not cache authenticated responses', async () => {
    const app = await setup();
    const response = await app.inject('/bff/v1/auth/session');
    expect(response.statusCode).toBe(401);
    expect(response.headers['cache-control']).toBe('no-store');
  });

  it('authenticates exactly once and returns only the public identity', async () => {
    const authenticate = vi.fn(async () => authentication());
    const app = await setup({ authenticate });
    const response = await login(app);
    expect(response.statusCode).toBe(200);
    expect(authenticate).toHaveBeenCalledExactlyOnceWith({ username: 'manager', password: 'synthetic-password' });
    expect(response.json()).toMatchObject({ user: { role: 'MANAGER' } });
    expect(response.body).not.toContain('backend-token');
    expect(cookieOf(response)).not.toContain('backend-token');
    expect(String(response.headers['set-cookie'])).toContain('HttpOnly');
    expect(String(response.headers['set-cookie'])).toContain('SameSite=Lax');
    expect((await app.inject({ url: '/bff/v1/auth/session', headers: { cookie: cookieOf(response) } })).statusCode).toBe(200);
  });

  it('regenerates the anonymous session on successful login', async () => {
    const app = await setup();
    const initial = await csrf(app);
    const response = await app.inject({ method: 'POST', url: '/bff/v1/auth/login', headers: { cookie: initial.cookie, origin: 'http://localhost:5173', 'x-csrf-token': initial.token }, payload: { username: 'manager', password: 'synthetic-password' } });
    expect(response.statusCode).toBe(200);
    expect(cookieOf(response)).not.toBe(initial.cookie);
    expect((await app.inject({ url: '/bff/v1/auth/session', headers: { cookie: initial.cookie } })).statusCode).toBe(401);
  });

  it('rejects login without a CSRF token before contacting auth', async () => {
    const authenticate = vi.fn(async () => authentication());
    const app = await setup({ authenticate });
    const response = await app.inject({ method: 'POST', url: '/bff/v1/auth/login', headers: { origin: 'http://localhost:5173' }, payload: { username: 'manager', password: 'synthetic-password' } });
    expect(response.statusCode).toBe(403);
    expect(authenticate).not.toHaveBeenCalled();
  });

  it('rejects a foreign origin even with a valid CSRF token', async () => {
    const authenticate = vi.fn(async () => authentication());
    const app = await setup({ authenticate });
    const initial = await csrf(app);
    const response = await app.inject({ method: 'POST', url: '/bff/v1/auth/login', headers: { cookie: initial.cookie, origin: 'https://foreign.test', 'x-csrf-token': initial.token }, payload: { username: 'manager', password: 'synthetic-password' } });
    expect(response.statusCode).toBe(403);
    expect(authenticate).not.toHaveBeenCalled();
  });

  it('rejects cross-site CSRF bootstrap', async () => {
    const app = await setup();
    expect((await app.inject({ url: '/bff/v1/auth/csrf', headers: { 'sec-fetch-site': 'cross-site' } })).statusCode).toBe(403);
  });

  it('rejects invalid credentials shape without contacting auth', async () => {
    const authenticate = vi.fn(async () => authentication());
    const app = await setup({ authenticate });
    const initial = await csrf(app);
    const response = await app.inject({ method: 'POST', url: '/bff/v1/auth/login', headers: { cookie: initial.cookie, origin: 'http://localhost:5173', 'x-csrf-token': initial.token }, payload: { email: 'test@example.test', password: 'synthetic-password' } });
    expect(response.statusCode).toBe(400);
    expect(authenticate).not.toHaveBeenCalled();
  });

  it('retains safe upstream permission errors without issuing an authenticated session', async () => {
    const app = await setup({ authenticate: async () => { throw new ApiFault(403, 'MANAGER_REQUIRED', 'MANAGER requerido.'); } });
    const response = await login(app);
    expect(response.statusCode).toBe(403);
    expect((await app.inject({ url: '/bff/v1/auth/session', headers: { cookie: cookieOf(response) } })).statusCode).toBe(401);
  });

  it('keeps simultaneous sessions isolated', async () => {
    const app = await setup({ authenticate: async input => authentication(input.username, input.username) });
    const first = await login(app, 'manager-one');
    const second = await login(app, 'manager-two');
    const read = async (cookie: string) => (await app.inject({ url: '/bff/v1/auth/session', headers: { cookie } })).json().user.name;
    expect(await read(cookieOf(first))).toBe('manager-one');
    expect(await read(cookieOf(second))).toBe('manager-two');
  });

  it('destroys the server session and clears its cookie on logout', async () => {
    const app = await setup();
    const response = await login(app);
    const cookie = cookieOf(response);
    const token = await csrf(app, cookie);
    const loggedOut = await app.inject({ method: 'POST', url: '/bff/v1/auth/logout', headers: { cookie, origin: 'http://localhost:5173', 'x-csrf-token': token.token } });
    expect(loggedOut.statusCode).toBe(204);
    expect(String(loggedOut.headers['set-cookie'])).toContain('Max-Age=0');
    expect((await app.inject({ url: '/bff/v1/auth/session', headers: { cookie } })).statusCode).toBe(401);
  });

  it('rejects expired authenticated state', async () => {
    const app = await setup({ authenticate: async () => ({ ...authentication(), expiresAt: Date.now() - 1000 }) });
    const response = await login(app);
    expect((await app.inject({ url: '/bff/v1/auth/session', headers: { cookie: cookieOf(response) } })).statusCode).toBe(401);
  });

  it('reports unavailable features rather than fabricating CRUD endpoints', async () => {
    const app = await setup();
    const response = await login(app);
    const capabilities = await app.inject({ url: '/bff/v1/capabilities', headers: { cookie: cookieOf(response) } });
    expect(capabilities.json()).toMatchObject({ auth: true, estudiantes: false, dashboard: false });
    expect((await app.inject('/bff/v1/estudiantes')).statusCode).toBe(404);
  });

  it('separates readiness failure from liveness', async () => {
    const app = await setup({ ready: async () => false });
    expect((await app.inject('/health/live')).statusCode).toBe(200);
    expect((await app.inject('/health/ready')).statusCode).toBe(503);
  });

  it('fails closed when the session store fails', async () => {
    const store = testStore();
    store.set = (_id, _session, callback) => callback(storageUnavailable());
    const app = await setup({ store });
    const response = await app.inject('/bff/v1/auth/csrf');
    expect(response.statusCode).toBe(503);
    expect(response.body).not.toContain('redis://');
  });

  it('uses a host-only Secure cookie for HTTPS', async () => {
    const app = await setup({}, testConfig({ PUBLIC_ORIGIN: 'https://dashboard.test', TRUSTED_PROXY: 'loopback' }));
    const response = await app.inject({ url: '/bff/v1/auth/csrf', headers: { 'x-forwarded-proto': 'https' } });
    expect(response.statusCode).toBe(200);
    const cookie = String(response.headers['set-cookie']);
    expect(cookie).toContain('__Host-acb_session=');
    expect(cookie).toContain('Secure');
    expect(cookie).not.toContain('Domain=');
  });
});
