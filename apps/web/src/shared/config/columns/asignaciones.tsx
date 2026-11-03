import { Chip } from '@mui/material';
import type { Column } from '../../components/molecules/DataTable';
import type { Asignacion } from '../../api/types';

export const asignacionesColumns: Column<Asignacion>[] = [
  { key: 'rutaId', label: 'Ruta' },
  { key: 'guia1Id', label: 'Guía 1' },
  { key: 'guia2Id', label: 'Guía 2' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'estado', label: 'Estado', render: (_, row) => {
    const colors = { pendiente: 'warning', en_curso: 'info', completada: 'success' } as const;
    return <Chip label={row.estado} color={colors[row.estado]} size="small" />;
  } },
];
