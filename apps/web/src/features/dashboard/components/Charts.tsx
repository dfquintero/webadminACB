import { Alert } from '@mui/material';

export const Charts = () => (
  <Alert severity="info" sx={{ mt: 3 }}>
    Los gráficos por ruta y de asistencia estarán disponibles cuando el backend entregue esas métricas. No se muestran datos simulados.
  </Alert>
);
