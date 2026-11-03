import { Box, Grid, Typography } from '@mui/material';
import { AsistenciaCard, type AttendanceUpdate } from './AsistenciaCard';
import type { Asignacion, Asistencia, Estudiante } from '@/shared/api/types';

type Props = { asignacion: Asignacion; estudiantes: Estudiante[]; asistencia: Asistencia[]; onUpdate: AttendanceUpdate };

export const AsistenciaGrid = ({ asignacion, estudiantes, asistencia, onUpdate }: Props) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" gutterBottom>Ruta {asignacion.rutaId} — {asignacion.fecha}</Typography>
    <Grid container spacing={2}>
      {estudiantes.filter(est => asignacion.estudiantesAsignados.includes(est.id)).map(est => (
        <Grid key={est.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <AsistenciaCard estudiante={est} asistencia={asistencia.find(item => item.estudianteId === est.id && item.asignacionId === asignacion.id)} onUpdate={onUpdate} />
        </Grid>
      ))}
    </Grid>
  </Box>
);
