import { StatusChip } from '../../components/molecules/StatusChip';

export const rutasColumns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'distancia', label: 'Distancia (km)' },
  { key: 'tiempoEstimado', label: 'Tiempo (min)' },
  { key: 'horario', label: 'Horario', render: (_, row) => `${row.horarioInicio} - ${row.horarioFin}` },
  { key: 'puntosParada', label: 'Puntos', render: (value) => `${value.length} puntos` },
  { key: 'estado', label: 'Estado', render: (value) => <StatusChip value={value} /> },
];
