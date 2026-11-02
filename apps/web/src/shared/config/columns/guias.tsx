import type { Column } from '../../components/molecules/DataTable';
import type { Guia } from '../../api/types';

export const guiasColumns: Column<Guia>[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'documentType', label: 'Tipo Doc.' },
  { key: 'documentNumber', label: 'Documento' },
  { key: 'contractNumber', label: 'Contrato' },
  { key: 'zone', label: 'Zona' },
  { key: 'email', label: 'Email' },
];
