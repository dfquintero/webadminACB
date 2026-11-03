import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCrud } from './useCrud';
import { FeatureUnavailableError } from './useCapabilities';

const flags = vi.hoisted(() => ({ available: false }));
vi.mock('./useCapabilities', async original => ({
  ...await original<typeof import('./useCapabilities')>(),
  useCapabilities: () => ({ data: { estudiantes: flags.available }, isLoading: false, error: null }),
}));
const clients: QueryClient[] = [];
const api = {
  getAll: vi.fn(async () => [{ id: '1' }]),
  create: vi.fn(async (_data: { nombre: string }) => {}),
  update: vi.fn(async (_id: string, _data: { nombre: string }) => {}),
  delete: vi.fn(async (_id: string) => {}),
};
const setup = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  clients.push(client);
  return renderHook(() => useCrud('estudiantes', api), { wrapper: ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider> });
};
beforeEach(() => { vi.clearAllMocks(); flags.available = false; });
afterEach(() => { cleanup(); clients.splice(0).forEach(client => client.clear()); });

describe('resource availability', () => {
  it('does not query or mutate endpoints that have no confirmed contract', async () => {
    const { result } = setup();
    expect(result.current.error).toBeInstanceOf(FeatureUnavailableError);
    expect(result.current.isLoading).toBe(false);
    expect(api.getAll).not.toHaveBeenCalled();
    await act(async () => { await expect(result.current.create.mutateAsync({ nombre: 'Synthetic' })).rejects.toBeInstanceOf(FeatureUnavailableError); });
    expect(api.create).not.toHaveBeenCalled();
  });

  it('queries a resource only after the BFF declares it available', async () => {
    flags.available = true;
    const { result } = setup();
    await waitFor(() => expect(result.current.data).toEqual([{ id: '1' }]));
    expect(api.getAll).toHaveBeenCalledOnce();
    expect(result.current.error).toBeNull();
  });
});
