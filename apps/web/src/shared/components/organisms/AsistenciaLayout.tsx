import { Box, Typography } from '@mui/material';

export const AsistenciaLayout = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box>
    <Typography variant="h4" gutterBottom>{title}</Typography>
    <Typography variant="body2" color="textSecondary" gutterBottom>
      Control de asistencia de estudiantes
    </Typography>
    {children}
  </Box>
);
