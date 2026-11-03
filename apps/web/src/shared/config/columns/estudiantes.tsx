import type { Column } from '../../components/molecules/DataTable';
import type { Estudiante } from '../../api/types';

export const estudiantesColumns: Column<Estudiante>[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'documentType', label: 'Tipo Doc.' },
  { key: 'documentNumber', label: 'Documento' },
  { key: 'grade', label: 'Grado' },
  { key: 'schoolShift', label: 'Jornada' },
  { key: 'section', label: 'Sección' },
];
