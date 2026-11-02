import { describe, expect, it, vi } from 'vitest';
import { createUpstream } from '../src/upstreams/http.js';
import { authentication, testConfig } from './fixtures.js';

const config = testConfig();
const responder = (response: Response) => vi.fn<typeof fetch>().mockResolvedValue(response);

describe('upstream HTTP adapter', () => {
  it('reports the feature as unavailable without a base URL', async () => {
    await expect(createUpstream(undefined, config)('GET', '/api/v1/students')).rejects.toMatchObject({ statusCode: 503, code: 'FEATURE_UNAVAILABLE' });
  });

  it('maps a transport timeout to 504', async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(Object.assign(new Error('timed out'), { name: 'TimeoutError' }));
    await expect(createUpstream('http://up.test', config, fetcher)('GET', '/api/v1/x')).rejects.toMatchObject({ statusCode: 504, code: 'UPSTREAM_TIMEOUT' });
  });

  it('maps other transport failures to 503', async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error('connection refused'));
    await expect(createUpstream('http://up.test', config, fetcher)('GET', '/api/v1/x')).rejects.toMatchObject({ statusCode: 503, code: 'UPSTREAM_UNAVAILABLE' });
  });

  it.each([
    [401, 401, 'SESSION_EXPIRED'],
    [403, 403, 'ACCESS_DENIED'],
    [404, 404, 'NOT_FOUND'],
    [409, 409, 'CONFLICT'],
    [400, 400, 'INVALID_INPUT'],
    [422, 400, 'INVALID_INPUT'],
    [500, 502, 'UPSTREAM_ERROR'],
    [503, 502, 'UPSTREAM_ERROR'],
  ])('maps upstream status %s to %s %s', async (upstream, statusCode, code) => {
    const call = createUpstream('http://up.test', config, responder(new Response('error', { status: upstream })));
    await expect(call('GET', '/api/v1/x')).rejects.toMatchObject({ statusCode, code });
  });

  it('returns null for a 204 response', async () => {
    await expect(createUpstream('http://up.test', config, responder(new Response(null, { status: 204 })))('DELETE', '/api/v1/x')).resolves.toBeNull();
  });

  it('omits the authorization header without a session and forwards the bearer with one', async () => {
    const anonymous = responder(Response.json({ ok: true }));
    await createUpstream('http://up.test', config, anonymous)('GET', '/api/v1/x');
    expect(anonymous.mock.calls[0]?.[1]?.headers ?? {}).not.toHaveProperty('authorization');
    const authed = responder(Response.json({ ok: true }));
    await createUpstream('http://up.test', config, authed)('GET', '/api/v1/x', undefined, authentication());
    expect(authed.mock.calls[0]?.[1]?.headers).toMatchObject({ authorization: 'Bearer backend-token-never-public' });
  });
});
