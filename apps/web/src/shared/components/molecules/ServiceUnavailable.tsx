'use client';

import { useRouter } from 'next/navigation';
import { Alert, Box, Button } from '@mui/material';

export const ServiceUnavailable = () => {
  const router = useRouter();
  return <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
    <Alert severity="error" action={<Button onClick={() => router.refresh()}>Reintentar</Button>}>No se pudo comprobar la sesión con el BFF. No se cargaron datos administrativos.</Alert>
  </Box>;
};
