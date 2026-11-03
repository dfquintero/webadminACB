import { Redis } from 'ioredis';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import type { SessionStore } from '@fastify/session';
import { buildApp } from '../src/app.js';
import { createSessionStore } from '../src/plugins/session-store.js';
import { authentication, testConfig } from '../test/fixtures.js';

let redis: Redis | undefined;
let app: FastifyInstance | undefined;
const created = new Set<string>();

beforeAll(async () => {
  const url = process.env.BFF_TEST_REDIS_URL;
  if (!url) throw new Error('Provide a dedicated BFF_TEST_REDIS_URL to run Redis integration tests.');
  redis = new Redis(url, { lazyConnect: true, enableOfflineQueue: false, maxRetriesPerRequest: 1, retryStrategy: () => null });
  redis.on('error', () => {});
  await redis.connect();
  const config = testConfig();
  const backing = createSessionStore(redis, config.SESSION_ENCRYPTION_KEY);
  const store: SessionStore = {
    get: backing.get,
    destroy: backing.destroy,
    set(id, value, callback) { created.add(id); backing.set(id, value, callback); },
  };
  app = await buildApp(config, { store, authenticate: async () => authentication(), ready: async () => (await redis!.ping()) === 'PONG' });
  await app.ready();
});

afterAll(async () => {
  await app?.close();
  if (redis?.status === 'ready') {
    for (const id of created) await redis.del(`acb:bff:session:${id}`);
  }
  redis?.disconnect();
});

describe('real Redis session persistence', () => {
  it('stores only encrypted sessions with bounded TTL and revokes them on logout', async () => {
    const bootstrap = await app!.inject('/bff/v1/auth/csrf');
    const initialCookie = bootstrap.cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    const login = await app!.inject({ method: 'POST', url: '/bff/v1/auth/login', headers: { cookie: initialCookie, origin: 'http://localhost:5173', 'x-csrf-token': bootstrap.json().token }, payload: { username: 'manager', password: 'synthetic-password' } });
    expect(login.statusCode).toBe(200);
    const rawCookies = login.headers['set-cookie'];
    const cookie = (Array.isArray(rawCookies) ? rawCookies.at(-1) : rawCookies)!.split(';')[0]!;
    const current = await app!.inject({ url: '/bff/v1/auth/session', headers: { cookie } });
    expect(current.statusCode).toBe(200);
    for (const id of created) {
      const value = await redis!.get(`acb:bff:session:${id}`);
      if (value) {
        expect(value).not.toContain('backend-token');
        const ttl = await redis!.pttl(`acb:bff:session:${id}`);
        expect(ttl).toBeGreaterThan(0);
        expect(ttl).toBeLessThanOrEqual(60000);
      }
    }
    const csrf = await app!.inject({ url: '/bff/v1/auth/csrf', headers: { cookie } });
    const logout = await app!.inject({ method: 'POST', url: '/bff/v1/auth/logout', headers: { cookie, origin: 'http://localhost:5173', 'x-csrf-token': csrf.json().token } });
    expect(logout.statusCode).toBe(204);
    expect((await app!.inject({ url: '/bff/v1/auth/session', headers: { cookie } })).statusCode).toBe(401);
  });
});
