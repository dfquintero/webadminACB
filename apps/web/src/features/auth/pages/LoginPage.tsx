'use client';

import { useEffect } from 'react';
import { Alert, Box, Button, Card, CircularProgress, Typography, Container } from '@mui/material';
import { DirectionsBike } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { LoginForm } from '../components/LoginForm';
import { useAuthContext } from '@/shared/providers/AuthContext';

export const LoginPage = () => {
  const { user, isLoading, error, retry } = useAuthContext();
  const router = useRouter();
  useEffect(() => { if (user) { router.replace('/'); router.refresh(); } }, [user, router]);
  if (isLoading || user) return <CircularProgress aria-label="Verificando sesión" />;
  return <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}><DirectionsBike color="primary" fontSize="large" /><Typography variant="h5">Al Colegio en Bici</Typography></Box>
    <Card sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography component="h1" variant="h4" gutterBottom>Administración</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Inicia sesión con tu cuenta MANAGER.</Typography>
      {!!error && <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={retry}>Reintentar</Button>}>No se pudo comprobar la sesión con el BFF.</Alert>}
      <LoginForm />
    </Card>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>La creación y recuperación de cuentas se gestionan con el administrador.</Typography>
  </Container>;
};
