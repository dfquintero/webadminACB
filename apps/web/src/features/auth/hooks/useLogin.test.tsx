import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { useLogin } from './useLogin';

const { login } = vi.hoisted(() => ({ login: vi.fn() }));
vi.mock('@/shared/providers/AuthContext', () => ({ useAuthContext: () => ({ login }) }));

describe('useLogin', () => {
  it('calls the shared login exactly once with credentials, never with its response', async () => {
    login.mockResolvedValue(undefined);
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => { await result.current.mutateAsync({ username: 'manager', password: 'test-password' }); });
    expect(login).toHaveBeenCalledExactlyOnceWith('manager', 'test-password');
    client.clear();
  });
});
