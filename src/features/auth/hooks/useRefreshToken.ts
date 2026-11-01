import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/shared/api/authApi';
import { tokenRefresh } from '@/shared/api/tokenRefresh';

export const useRefreshToken = () => {
  const { data: user } = useQuery({ 
    queryKey: ['auth', 'user'], 
    queryFn: authApi.getCurrentUser, 
    enabled: false 
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      tokenRefresh();
    }, 14 * 60 * 1000); // 14 minutos
    return () => clearInterval(interval);
  }, []);
  
  return { user };
};
