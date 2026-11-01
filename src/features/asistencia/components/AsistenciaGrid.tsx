import { Box, Grid, Typography } from '@mui/material';
import { AsistenciaCard } from './AsistenciaCard';

export const AsistenciaGrid = ({ asignacion, estudiantes, asistencia, onUpdate }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" gutterBottom>{asignacion.ruta?.nombre}</Typography>
    <Grid container spacing={2}>
      {estudiantes?.filter(est => asignacion.estudiantesAsignados.includes(est.id)).map(est => {
        const asis = asistencia?.find(a => a.estudianteId === est.id && a.asignacionId === asignacion.id);
        return (
          <Grid key={est.id} size={{ xs: 12, sm:6, md: 4 }}>
            <AsistenciaCard estudiante={est} asistencia={asis} onUpdate={onUpdate} />
          </Grid>
        );
      })}
    </Grid>
  </Box>
);
