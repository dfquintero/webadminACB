import { Chip } from '@mui/material';
import { CheckCircle, Error, Schedule } from '@mui/icons-material';
import type { Column } from '../../components/molecules/DataTable';
import type { Alerta } from '../../api/types';

export const alertasColumns: Column<Alerta>[] = [
  { key: 'estudianteId', label: 'Estudiante' },
  { key: 'tipo', label: 'Tipo', render: (_, row) => {
    const types = { guia_cerca: 'Guía Cerca', recogido: 'Recogido', ruta_finalizada: 'Ruta Finalizada' };
    return types[row.tipo];
  } },
  { key: 'mensaje', label: 'Mensaje' },
  { key: 'canal', label: 'Canal', render: (_, row) => <Chip label={row.canal.toUpperCase()} size="small" /> },
  { key: 'estado', label: 'Estado', render: (_, row) => {
    const config = {
      enviada: { icon: <CheckCircle />, color: 'success', label: 'Enviada' },
      pendiente: { icon: <Schedule />, color: 'default', label: 'Pendiente' },
      fallida: { icon: <Error />, color: 'error', label: 'Fallida' },
    } as const;
    const cfg = config[row.estado];
    return <Chip icon={cfg.icon} label={cfg.label} color={cfg.color} size="small" />;
  } },
  { key: 'fechaEnvio', label: 'Fecha' },
];
