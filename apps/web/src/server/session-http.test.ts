import { describe, expect, it, vi } from 'vitest';
import { readServerState } from './session-http';
import { readServerConfig } from './config';

const config = { BFF_INTERNAL_URL: 'http://bff.test', PUBLIC_ORIGIN: 'https://dashboard.test' };
const capabilities = { auth: true, estudiantes: false, guias: false, rutas: false, asignaciones: false, asistencia: false, alertas: false, dashboard: false, geo: false };
const profile = (name = 'Manager') => ({ user: { id: name, name, role: 'MANAGER', zone: null }, expiresAt: new Date(Date.now() + 3600000).toISOString(), token: 'BACKEND_TOKEN_MUST_NOT_LEAK' });

describe('SSR BFF adapter', () => {
  it('does not contact the BFF for an anonymous request', async () => {
    const fetcher = vi.fn<typeof fetch>();
    expect((await readServerState(undefined, config, fetcher)).session).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('forwards only the opaque cookie and disables fetch caching', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json(profile())).mockResolvedValueOnce(Response.json(capabilities));
    const state = await readServerState('__Host-acb_session=opaque', config, fetcher);
    expect(state.session?.user.role).toBe('MANAGER');
    expect(JSON.stringify(state)).not.toContain('BACKEND_TOKEN');
    const options = fetcher.mock.calls[0]?.[1];
    expect(options?.headers).toEqual({ cookie: '__Host-acb_session=opaque', accept: 'application/json' });
    expect(options?.cache).toBe('no-store');
    expect(options?.redirect).toBe('error');
  });

  it('keeps concurrent identities isolated', async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (url, options) => {
      const cookie = (options?.headers as Record<string, string> | undefined)?.cookie;
      return Response.json(String(url).endsWith('/capabilities') ? capabilities : profile(cookie ?? 'anonymous'));
    });
    const [first, second] = await Promise.all([readServerState('cookie=one', config, fetcher), readServerState('cookie=two', config, fetcher)]);
    expect(first.session?.user.name).toBe('cookie=one');
    expect(second.session?.user.name).toBe('cookie=two');
  });

  it('treats 401 as anonymous instead of an infrastructure error', async () => {
    const state = await readServerState('cookie=expired', config, vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 401 })));
    expect(state).toMatchObject({ session: null, unavailable: false });
  });

  it('does not grant access from a malformed or non-manager response', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ ...profile(), user: { ...profile().user, role: 'GUIDE' } }));
    expect(await readServerState('cookie=invalid', config, fetcher)).toMatchObject({ session: null, unavailable: true });
  });

  it('fails closed on timeout without exposing the exception', async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error('private network detail'));
    const state = await readServerState('cookie=one', config, fetcher);
    expect(state).toMatchObject({ session: null, unavailable: true });
    expect(JSON.stringify(state)).not.toContain('private network');
  });

  it('drops identity if the session expires during capability loading', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json(profile())).mockResolvedValueOnce(new Response('', { status: 401 }));
    expect(await readServerState('cookie=expired', config, fetcher)).toMatchObject({ session: null, unavailable: false });
  });

  it('requires explicit private production origins and rejects embedded credentials', () => {
    expect(() => readServerConfig({ NODE_ENV: 'production' })).toThrow('BFF_INTERNAL_URL');
    expect(() => readServerConfig({ BFF_INTERNAL_URL: 'http://user:secret@bff.test' })).toThrow('BFF_INTERNAL_URL');
  });
});
