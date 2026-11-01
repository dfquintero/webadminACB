import { Chip } from '@mui/material';
import { CheckCircle, Cancel, Warning, Schedule } from '@mui/icons-material';

export const asistenciaColumns = [
  { key: 'estudiante', label: 'Estudiante', render: (_, row) => `${row.estudiante?.nombre || ''} ${row.estudiante?.apellido || ''}` },
  { key: 'asignacion', label: 'Asignación', render: (_, row) => row.asignacion?.ruta?.nombre || '' },
  { key: 'estado', label: 'Estado', render: (value) => {
    const config = {
      recogido: { icon: <CheckCircle />, color: 'success', label: 'Recogido' },
      no_asistio: { icon: <Cancel />, color: 'error', label: 'No Asistió' },
      justificado: { icon: <Warning />, color: 'warning', label: 'Justificado' },
      pendiente: { icon: <Schedule />, color: 'default', label: 'Pendiente' },
    };
    const cfg = config[value] || config.pendiente;
    return <Chip icon={cfg.icon} label={cfg.label} color={cfg.color} size="small" />;
  }},
  { key: 'horaRegistro', label: 'Hora Registro' },
  { key: 'observaciones', label: 'Observaciones' },
];
