import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/shared/api/authApi';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({ 
    queryKey: ['auth', 'user'], 
    queryFn: authApi.getCurrentUser, 
    retry: false 
  });
  
  const login = useMutation({ 
    mutationFn: authApi.login, 
    onSuccess: ({ accessToken, refreshToken }) => {
      sessionStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  });
  
  const logout = useMutation({ 
    mutationFn: authApi.logout, 
    onSuccess: () => {
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
    }
  });
  
  return { user, isLoading, login, logout };
};
