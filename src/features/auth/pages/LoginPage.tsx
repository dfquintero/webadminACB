import { Box, Typography, Container, Link } from '@mui/material';
import { LoginForm } from '../components/LoginForm';
import { useAuthContext } from '@/shared/providers/AuthContext';

export const LoginPage = () => {
  const { user } = useAuthContext();
  
  if (user) window.location.href = '/';
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>ACB Dashboard</Typography>
      <Typography variant="body2" gutterBottom>Inicia sesión para continuar</Typography>
      <LoginForm open={true} onClose={() => {}} />
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">¿No tienes cuenta? <Link href="/register">Regístrate</Link></Typography>
      </Box>
    </Container>
  );
}
