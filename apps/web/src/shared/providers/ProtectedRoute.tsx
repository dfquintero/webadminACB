'use client';

import { useEffect } from 'react';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, error, retry } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !error && !user) { router.replace('/login'); router.refresh(); }
  }, [user, isLoading, error, router]);
  if (isLoading) return <Box sx={{ p: 4 }}><CircularProgress aria-label="Verificando sesión" /></Box>;
  if (error) return <Alert severity="error" action={<Button onClick={retry}>Reintentar</Button>}>No se pudo comprobar la sesión. Revisa la disponibilidad del BFF.</Alert>;
  if (!user || user.role !== 'MANAGER') return null;
  return <>{children}</>;
};
