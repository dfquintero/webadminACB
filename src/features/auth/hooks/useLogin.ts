import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/authApi';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const { login } = useAuth();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login.mutate(data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};
