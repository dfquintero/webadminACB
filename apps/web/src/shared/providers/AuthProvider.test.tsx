import { useState } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SessionResponse } from '@acb/contracts';
import { AuthProvider } from './AuthProvider';
import { useAuthContext } from './AuthContext';
import { authApi } from '../api/authApi';
import { SESSION_EXPIRED_EVENT } from '../api/client';

vi.mock('../api/authApi', () => ({ authApi: { getCurrentUser: vi.fn(), login: vi.fn(), logout: vi.fn() } }));
const session: SessionResponse = { user: { id: '1', name: 'Synthetic Manager', role: 'MANAGER', zone: null }, expiresAt: new Date(Date.now() + 60000).toISOString() };
const clients: QueryClient[] = [];
const Harness = () => {
  const auth = useAuthContext();
  const [failed, setFailed] = useState(false);
  return <>
    <output>{auth.isLoading ? 'Loading' : auth.user?.name ?? 'Anonymous'}</output>
    <button onClick={() => { void auth.login('manager', 'synthetic-password'); }}>Login</button>
    <button onClick={() => { void auth.logout().catch(() => setFailed(true)); }}>Logout</button>
    {failed && <span>Logout failed</span>}
  </>;
};
const setup = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  clients.push(client);
  render(<QueryClientProvider client={client}><AuthProvider><Harness /></AuthProvider></QueryClientProvider>);
  return client;
};
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(authApi.getCurrentUser).mockResolvedValue(null);
  vi.mocked(authApi.login).mockResolvedValue(session);
  vi.mocked(authApi.logout).mockResolvedValue(undefined);
});
afterEach(() => { cleanup(); clients.splice(0).forEach(client => client.clear()); });

describe('cookie-session provider', () => {
  it('removes legacy browser tokens without reading or reusing them', async () => {
    window.sessionStorage.setItem('accessToken', 'legacy-token');
    window.localStorage.setItem('refreshToken', 'legacy-refresh');
    setup();
    await screen.findByText('Anonymous');
    expect(window.sessionStorage.getItem('accessToken')).toBeNull();
    expect(window.localStorage.getItem('refreshToken')).toBeNull();
  });
  it('starts unauthenticated without a development bypass', async () => {
    setup();
    await screen.findByText('Anonymous');
    expect(authApi.getCurrentUser).toHaveBeenCalledOnce();
  });

  it('logs in once and clears the previous user query data', async () => {
    const client = setup();
    await screen.findByText('Anonymous');
    client.setQueryData(['estudiantes'], ['previous-user-data']);
    const storage = vi.spyOn(Storage.prototype, 'setItem');
    fireEvent.click(screen.getByText('Login'));
    await screen.findByText('Synthetic Manager');
    expect(authApi.login).toHaveBeenCalledExactlyOnceWith({ username: 'manager', password: 'synthetic-password' });
    expect(client.getQueryData(['estudiantes'])).toBeUndefined();
    expect(storage).not.toHaveBeenCalled();
    storage.mockRestore();
  });

  it('clears the visible session and caches after a confirmed logout', async () => {
    vi.mocked(authApi.getCurrentUser).mockResolvedValue(session);
    const client = setup();
    await screen.findByText('Synthetic Manager');
    client.setQueryData(['estudiantes'], ['private-data']);
    fireEvent.click(screen.getByText('Logout'));
    await screen.findByText('Anonymous');
    expect(client.getQueryData(['estudiantes'])).toBeUndefined();
  });

  it('keeps the session visible when logout could not reach the server', async () => {
    vi.mocked(authApi.getCurrentUser).mockResolvedValue(session);
    vi.mocked(authApi.logout).mockRejectedValue(new Error('Offline'));
    setup();
    await screen.findByText('Synthetic Manager');
    fireEvent.click(screen.getByText('Logout'));
    await screen.findByText('Logout failed');
    expect(screen.getByText('Synthetic Manager')).toBeTruthy();
  });

  it('drops sensitive cached data when a protected request reports expiry', async () => {
    vi.mocked(authApi.getCurrentUser).mockResolvedValue(session);
    const client = setup();
    await screen.findByText('Synthetic Manager');
    client.setQueryData(['estudiantes'], ['private-data']);
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    await waitFor(() => expect(screen.getByText('Anonymous')).toBeTruthy());
    expect(client.getQueryData(['estudiantes'])).toBeUndefined();
  });
});
