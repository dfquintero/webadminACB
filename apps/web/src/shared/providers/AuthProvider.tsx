import { useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SessionResponse } from '@acb/contracts';
import { AuthContext } from './AuthContext';
import { authApi } from '@/shared/api/authApi';
import { SESSION_EXPIRED_EVENT } from '@/shared/api/client';

const sessionKey = ['auth', 'session'] as const;
const unavailableError = new Error('No se pudo comprobar la sesión con el BFF.');

export const AuthProvider = ({ children, initialUnavailable = false }: { children: ReactNode; initialUnavailable?: boolean }) => {
  const client = useQueryClient();
  const [serverError, setServerError] = useState(initialUnavailable);
  useEffect(() => {
    try {
      window.sessionStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
    } catch {}
  }, []);
  const session = useQuery({ queryKey: sessionKey, queryFn: authApi.getCurrentUser, retry: false, staleTime: 30000, refetchOnWindowFocus: 'always' });
  const replaceSession = async (value: SessionResponse | null) => {
    await client.cancelQueries();
    client.removeQueries({ predicate: query => query.queryKey[0] !== 'auth' });
    client.getMutationCache().clear();
    client.setQueryData(sessionKey, value);
    setServerError(false);
  };

  useEffect(() => {
    const expire = () => {
      void client.cancelQueries({ predicate: query => query.queryKey[0] !== 'auth' });
      client.removeQueries({ predicate: query => query.queryKey[0] !== 'auth' });
      client.getMutationCache().clear();
      client.setQueryData(sessionKey, null);
      setServerError(false);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, expire);
    const timeout = session.data ? window.setTimeout(expire, Math.max(0, Date.parse(session.data.expiresAt) - Date.now())) : undefined;
    return () => { window.removeEventListener(SESSION_EXPIRED_EVENT, expire); window.clearTimeout(timeout); };
  }, [client, session.data]);

  const login = async (username: string, password: string) => { await replaceSession(await authApi.login({ username, password })); };
  const logout = async () => { await authApi.logout(); await replaceSession(null); };
  const retry = () => { void session.refetch().then(result => setServerError(result.isError)); };
  const user = session.data?.user ?? null;
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading: session.isPending, error: session.error ?? (serverError ? unavailableError : null), retry, login, logout }}>{children}</AuthContext.Provider>;
};
