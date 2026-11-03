'use client';

import { Alert, Box, Button } from '@mui/material';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <Box sx={{ p: 4 }}><Alert severity="error" action={<Button onClick={reset}>Reintentar</Button>}>No se pudo cargar esta sección. Inténtalo de nuevo.</Alert></Box>;
}
