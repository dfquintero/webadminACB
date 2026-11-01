import { StatusChip } from '../../components/molecules/StatusChip';

export const estudiantesColumns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'edad', label: 'Edad' },
  { key: 'puntoRecogida', label: 'Punto de Recogida' },
  { key: 'telefonoPadre', label: 'Teléfono Padre' },
  { key: 'estado', label: 'Estado', render: (value) => <StatusChip value={value} /> },
];
