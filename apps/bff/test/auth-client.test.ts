import { describe, expect, it, vi } from 'vitest';
import { createAuthClient } from '../src/upstreams/auth.js';
import { testConfig } from './fixtures.js';

const jwt = (expires = Math.floor(Date.now() / 1000) + 3600) => `${Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')}.${Buffer.from(JSON.stringify({ exp: expires, role: 'MANAGER' })).toString('base64url')}.synthetic-signature`;
const user = { id: 1, name: 'Synthetic Manager', role: 'MANAGER', zone: null };
const input = { username: 'manager', password: 'synthetic-password' };
const mockFetch = (response: Response) => vi.fn<typeof fetch>().mockResolvedValue(response);

describe('authentication upstream adapter', () => {
  it('uses the confirmed backend path and payload exactly once', async () => {
    const fetcher = mockFetch(Response.json({ token: jwt(), user }));
    const result = await createAuthClient(testConfig(), fetcher)(input);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(String(fetcher.mock.calls[0]?.[0])).toBe('http://auth.test/api/v1/auth/login');
    expect(fetcher.mock.calls[0]?.[1]?.body).toBe(JSON.stringify(input));
    expect(result.user.id).toBe('1');
    expect(result.user.role).toBe('MANAGER');
  });

  it('does not grant MANAGER based on an unverified claim when backend user is GUIDE', async () => {
    const fetcher = mockFetch(Response.json({ token: jwt(), user: { ...user, role: 'GUIDE' } }));
    await expect(createAuthClient(testConfig(), fetcher)(input)).rejects.toMatchObject({ statusCode: 403, code: 'MANAGER_REQUIRED' });
  });

  it('caps session lifetime at the configured maximum', async () => {
    const fetcher = mockFetch(Response.json({ token: jwt(Math.floor(Date.now() / 1000) + 86400), user }));
    const before = Date.now();
    const result = await createAuthClient(testConfig({ SESSION_TTL_SECONDS: '60' }), fetcher)(input);
    expect(result.expiresAt).toBeGreaterThanOrEqual(before + 60000);
    expect(result.expiresAt).toBeLessThanOrEqual(Date.now() + 60000);
  });

  it('rejects an expired token', async () => {
    const fetcher = mockFetch(Response.json({ token: jwt(Math.floor(Date.now() / 1000) - 60), user }));
    await expect(createAuthClient(testConfig(), fetcher)(input)).rejects.toMatchObject({ statusCode: 401 });
  });

  it.each([400, 401])('normalizes credential rejection %s', async status => {
    await expect(createAuthClient(testConfig(), mockFetch(new Response('', { status })))(input)).rejects.toMatchObject({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
  });

  it('does not retry a failed login', async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error('private upstream detail'));
    await expect(createAuthClient(testConfig(), fetcher)(input)).rejects.toMatchObject({ statusCode: 503 });
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it('rejects malformed upstream data without leaking it', async () => {
    await expect(createAuthClient(testConfig(), mockFetch(Response.json({ secret: 'private' })))(input)).rejects.toMatchObject({ statusCode: 502, code: 'INVALID_UPSTREAM_RESPONSE' });
  });
});
