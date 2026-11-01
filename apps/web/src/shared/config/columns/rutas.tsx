import { StatusChip } from '../../components/molecules/StatusChip';

import type { Column } from '../../components/molecules/DataTable';
import type { Ruta } from '../../api/types';

export const rutasColumns: Column<Ruta>[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'distancia', label: 'Distancia (km)' },
  { key: 'tiempoEstimado', label: 'Tiempo (min)' },
  { key: 'horario', label: 'Horario', render: (_, row) => `${row.horarioInicio} - ${row.horarioFin}` },
  { key: 'puntosParada', label: 'Puntos', render: (_, row) => `${row.puntosParada.length} puntos` },
  { key: 'estado', label: 'Estado', render: (value) => <StatusChip value={value} /> },
];
