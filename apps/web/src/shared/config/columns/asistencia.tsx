import { Chip } from '@mui/material';
import type { Column } from '../../components/molecules/DataTable';
import type { Asistencia } from '../../api/types';

export const asistenciaColumns: Column<Asistencia>[] = [
  { key: 'estudianteId', label: 'Estudiante' },
  { key: 'asignacionId', label: 'Asignación' },
  { key: 'estado', label: 'Estado', render: (_, row) => <Chip label={row.estado} size="small" /> },
  { key: 'horaRegistro', label: 'Hora Registro' },
  { key: 'observaciones', label: 'Observaciones' },
];
