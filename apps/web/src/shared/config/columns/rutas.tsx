import { StatusChip } from '../../components/molecules/StatusChip';
import type { Column } from '../../components/molecules/DataTable';
import type { Ruta } from '../../api/types';

export const rutasColumns: Column<Ruta>[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'code', label: 'Código' },
  { key: 'routeCode', label: 'Colegio' },
  { key: 'dayShift', label: 'Jornada' },
  { key: 'distanceKm', label: 'Distancia (km)' },
  { key: 'meetingPoints', label: 'Puntos' },
  { key: 'endpointStatus', label: 'Estado', render: (value) => <StatusChip value={value} /> },
];
