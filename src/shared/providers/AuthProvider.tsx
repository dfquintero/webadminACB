import { ReactNode, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authApi } from '@/shared/api/authApi';

const DEV_BYPASS = import.meta.env.VITE_AUTH_BYPASS === 'true';
const DEV_USER = { id: 'dev', nombre: 'Dev', apellido: 'Admin', email: 'dev@acb.local', rol: 'admin' };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(DEV_BYPASS ? DEV_USER : null);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    sessionStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
