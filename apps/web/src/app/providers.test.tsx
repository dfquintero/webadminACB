import { act, useState } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { QueryClient, dehydrate, useQueryClient } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppProviders } from './providers';
import { useAuthContext } from '@/shared/providers/AuthContext';
import { authApi } from '@/shared/api/authApi';

vi.mock('@/shared/api/authApi', () => ({ authApi: { getCurrentUser: vi.fn(), login: vi.fn(), logout: vi.fn() } }));
const clients = new Set<QueryClient>();
const identity = (name: string) => {
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
  clients.add(client);
  client.setQueryData(['auth', 'session'], { user: { id: name, name, role: 'MANAGER', zone: null }, expiresAt: new Date(Date.now() + 3600000).toISOString() });
  return dehydrate(client);
};
const Consumer = () => {
  const { user } = useAuthContext();
  const [count, setCount] = useState(0);
  clients.add(useQueryClient());
  return <><span>{user?.name}</span><button onClick={() => setCount(count + 1)}>Count {count}</button></>;
};
afterEach(() => { clients.forEach(client => client.clear()); clients.clear(); vi.clearAllMocks(); });

describe('SSR query hydration', () => {
  it('hydrates the public identity without refetch or recoverable errors and remains interactive', async () => {
    const tree = <AppProviders state={identity('Manager One')}><Consumer /></AppProviders>;
    const html = renderToString(tree);
    expect(html).toContain('Manager One');
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const errors: unknown[] = [];
    let root: Root | undefined;
    try {
      await act(async () => { root = hydrateRoot(container, tree, { onRecoverableError: error => errors.push(error) }); });
      expect(errors).toEqual([]);
      expect(authApi.getCurrentUser).not.toHaveBeenCalled();
      await act(async () => { container.querySelector('button')!.click(); });
      expect(container.textContent).toContain('Count 1');
    } finally {
      await act(async () => { root?.unmount(); });
      container.remove();
    }
  });

  it('creates independent server query clients for different identities', () => {
    const first = renderToString(<AppProviders state={identity('Manager One')}><Consumer /></AppProviders>);
    const second = renderToString(<AppProviders state={identity('Manager Two')}><Consumer /></AppProviders>);
    expect(first).toContain('Manager One');
    expect(first).not.toContain('Manager Two');
    expect(second).toContain('Manager Two');
    expect(second).not.toContain('Manager One');
  });
});
