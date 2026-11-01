import { Chip } from '@mui/material';
import { StatusChip } from '../../components/molecules/StatusChip';

import type { Column } from '../../components/molecules/DataTable';
import type { Guia } from '../../api/types';

export const guiasColumns: Column<Guia>[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'documento', label: 'Documento' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'licencia', label: 'Licencia' },
  { key: 'disponibilidad', label: 'Disponible', render: (value) => <Chip label={value ? 'Disponible' : 'No disponible'} color={value ? 'success' : 'default'} size="small" /> },
  { key: 'estado', label: 'Estado', render: (value) => <StatusChip value={value} /> },
];
