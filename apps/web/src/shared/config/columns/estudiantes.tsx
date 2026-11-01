import { StatusChip } from '../../components/molecules/StatusChip';

import type { Column } from '../../components/molecules/DataTable';
import type { Estudiante } from '../../api/types';

export const estudiantesColumns: Column<Estudiante>[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'edad', label: 'Edad' },
  { key: 'puntoRecogida', label: 'Punto de Recogida' },
  { key: 'telefonoPadre', label: 'Teléfono Padre' },
  { key: 'estado', label: 'Estado', render: (value) => <StatusChip value={value} /> },
];
