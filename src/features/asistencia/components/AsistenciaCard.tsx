import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { CheckCircle, Cancel, Schedule, Warning } from '@mui/icons-material';
import { Chip } from '@mui/material';

export const AsistenciaCard = ({ estudiante, asistencia, onUpdate }) => {
  const getEstadoIcon = (estado) => {
    const icons = { recogido: <CheckCircle color="success" />, no_asistio: <Cancel color="error" />, justificado: <Warning color="warning" />, pendiente: <Schedule color="action" /> };
    return icons[estado] || icons.pendiente;
  };
  
  return (
    <Card>
      <CardContent>
        <Typography>{estudiante.nombre} {estudiante.apellido}</Typography>
        <Chip icon={getEstadoIcon(asistencia?.estado)} label={asistencia?.estado} size="small" />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button size="small" onClick={() => onUpdate(asistencia.id, 'recogido')} color="success">Recogido</Button>
          <Button size="small" onClick={() => onUpdate(asistencia.id, 'no_asistio')} color="error">No Asistió</Button>
          <Button size="small" onClick={() => onUpdate(asistencia.id, 'justificado')} color="warning">Justificado</Button>
        </Box>
      </CardContent>
    </Card>
  );
};
