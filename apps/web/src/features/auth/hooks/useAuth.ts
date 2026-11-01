import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '@/shared/providers/AuthContext';
import { useLogin } from './useLogin';

export const useAuth = () => {
  const context = useAuthContext();
  const login = useLogin();
  const logout = useMutation({ mutationFn: async () => context.logout() });
  return { user: context.user, isLoading: context.isLoading, error: context.error, login, logout };
};
