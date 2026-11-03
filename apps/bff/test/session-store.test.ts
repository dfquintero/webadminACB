import { randomBytes } from 'node:crypto';
import type { Session } from 'fastify';
import type { SessionStore } from '@fastify/session';
import { describe, expect, it, vi } from 'vitest';
import { createSessionStore } from '../src/plugins/session-store.js';
import { authentication } from './fixtures.js';

const put = (store: SessionStore, id: string, value: Session) => new Promise<void>((resolve, reject) => store.set(id, value, error => error ? reject(error) : resolve()));
const get = (store: SessionStore, id: string) => new Promise<Session | null | undefined>((resolve, reject) => store.get(id, (error, value) => error ? reject(error) : resolve(value)));
const remove = (store: SessionStore, id: string) => new Promise<void>((resolve, reject) => store.destroy(id, error => error ? reject(error) : resolve()));
const createFixture = () => {
  const records = new Map<string, string>();
  const redis = {
    get: vi.fn(async (key: string) => records.get(key) ?? null),
    set: vi.fn(async (key: string, value: string, _mode: 'PX', _ttl: number) => { records.set(key, value); return 'OK'; }),
    del: vi.fn(async (key: string) => Number(records.delete(key))),
  };
  const key = randomBytes(32).toString('base64url');
  return { records, redis, key, store: createSessionStore(redis, key) };
};
const session = (): Session => ({ auth: authentication(), cookie: { originalMaxAge: null, expires: new Date(Date.now() + 3600000), httpOnly: true, path: '/' }, _csrf: 'synthetic-csrf-secret' });

describe('encrypted Redis session store', () => {
  it('stores ciphertext, not the backend token or CSRF secret', async () => {
    const { store, records } = createFixture();
    await put(store, 'session-one', session());
    const stored = records.get('acb:bff:session:session-one');
    expect(stored).toBeTruthy();
    expect(stored).not.toContain('backend-token');
    expect(stored).not.toContain('synthetic-csrf');
    expect((await get(store, 'session-one'))?.auth?.user.role).toBe('MANAGER');
  });

  it('caps Redis TTL at the authenticated session expiry', async () => {
    const { store, redis } = createFixture();
    await put(store, 'session-one', session());
    const ttl = redis.set.mock.calls[0]?.[3];
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(60000);
  });

  it('rejects ciphertext copied into a different session key', async () => {
    const { store, records } = createFixture();
    await put(store, 'session-one', session());
    records.set('acb:bff:session:session-two', records.get('acb:bff:session:session-one')!);
    expect(await get(store, 'session-two')).toBeNull();
  });

  it('rejects corrupted ciphertext and incorrect encryption keys', async () => {
    const { store, redis, records } = createFixture();
    records.set('acb:bff:session:corrupted', 'invalid');
    expect(await get(store, 'corrupted')).toBeNull();
    await put(store, 'session-one', session());
    const otherStore = createSessionStore(redis, randomBytes(32).toString('base64url'));
    expect(await get(otherStore, 'session-one')).toBeNull();
  });

  it('does not persist expired sessions', async () => {
    const { store, records } = createFixture();
    const expired = session();
    expired.auth!.expiresAt = Date.now() - 1000;
    await put(store, 'expired', expired);
    expect(records.size).toBe(0);
  });

  it('destroys only the requested session', async () => {
    const { store } = createFixture();
    await put(store, 'session-one', session());
    await put(store, 'session-two', session());
    await remove(store, 'session-one');
    expect(await get(store, 'session-one')).toBeNull();
    expect(await get(store, 'session-two')).not.toBeNull();
  });

  it('fails closed on Redis transport failure', async () => {
    const { store, redis } = createFixture();
    redis.get.mockRejectedValue(new Error('private infrastructure error'));
    await expect(get(store, 'session-one')).rejects.toMatchObject({ statusCode: 503, code: 'SESSION_STORE_UNAVAILABLE' });
  });
});
