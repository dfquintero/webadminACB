import { Chip } from '@mui/material';
import { CheckCircle, Error, Warning, Schedule } from '@mui/icons-material';

export const alertasColumns = [
  { key: 'estudiante', label: 'Estudiante', render: (_, row) => `${row.estudiante?.nombre || ''} ${row.estudiante?.apellido || ''}` },
  { key: 'tipo', label: 'Tipo', render: (value) => {
    const types = { guia_cerca: 'Guía Cerca', recogido: 'Recogido', ruta_finalizada: 'Ruta Finalizada' };
    return types[value] || value;
  }},
  { key: 'mensaje', label: 'Mensaje' },
  { key: 'canal', label: 'Canal', render: (value) => <Chip label={value.toUpperCase()} size="small" /> },
  { key: 'estado', label: 'Estado', render: (value) => {
    const config = {
      enviada: { icon: <CheckCircle />, color: 'success', label: 'Enviada' },
      pendiente: { icon: <Schedule />, color: 'default', label: 'Pendiente' },
      fallida: { icon: <Error />, color: 'error', label: 'Fallida' },
    };
    const cfg = config[value] || config.pendiente;
    return <Chip icon={cfg.icon} label={cfg.label} color={cfg.color} size="small" />;
  }},
  { key: 'fechaEnvio', label: 'Fecha Envío' },
];
