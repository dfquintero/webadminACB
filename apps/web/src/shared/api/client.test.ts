import { afterEach, describe, expect, it, vi } from 'vitest';
import { AxiosError, type AxiosAdapter } from 'axios';
import { apiClient, SESSION_EXPIRED_EVENT } from './client';

const originalAdapter = apiClient.defaults.adapter;
afterEach(() => { apiClient.defaults.adapter = originalAdapter; });

describe('browser BFF client', () => {
  it('obtains CSRF protection before a mutation and never adds a bearer', async () => {
    const adapter = vi.fn<AxiosAdapter>().mockImplementation(async config => ({ data: config.url === '/auth/csrf' ? { token: 'synthetic-csrf' } : {}, status: 200, statusText: 'OK', headers: {}, config }));
    apiClient.defaults.adapter = adapter;
    await apiClient.post('/auth/login', { username: 'manager', password: 'synthetic-password' });
    expect(adapter).toHaveBeenCalledTimes(2);
    expect(adapter.mock.calls[0]?.[0].url).toBe('/auth/csrf');
    const mutation = adapter.mock.calls[1]?.[0];
    expect(mutation?.baseURL).toBe('/bff/v1');
    expect(mutation?.headers.get('x-csrf-token')).toBe('synthetic-csrf');
    expect(mutation?.headers.get('Authorization')).toBeUndefined();
  });

  it('notifies the session boundary on 401 without requesting refresh', async () => {
    const listener = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, listener);
    const adapter = vi.fn<AxiosAdapter>().mockImplementation(async config => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, { data: {}, status: 401, statusText: 'Unauthorized', headers: {}, config });
    });
    apiClient.defaults.adapter = adapter;
    await expect(apiClient.get('/auth/session')).rejects.toBeInstanceOf(AxiosError);
    expect(adapter).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
  });

  it('does not send a mutation if CSRF bootstrap fails', async () => {
    const adapter = vi.fn<AxiosAdapter>().mockImplementation(async config => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config }));
    apiClient.defaults.adapter = adapter;
    await expect(apiClient.post('/auth/logout')).rejects.toThrow();
    expect(adapter).toHaveBeenCalledOnce();
  });
});
