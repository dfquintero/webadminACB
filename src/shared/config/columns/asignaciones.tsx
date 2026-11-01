import { Chip } from '@mui/material';

export const asignacionesColumns = [
  { key: 'ruta', label: 'Ruta', render: (_, row) => row.ruta?.nombre || '' },
  { key: 'guia1', label: 'Guía 1', render: (_, row) => `${row.guia1?.nombre || ''} ${row.guia1?.apellido || ''}` },
  { key: 'guia2', label: 'Guía 2', render: (_, row) => `${row.guia2?.nombre || ''} ${row.guia2?.apellido || ''}` },
  { key: 'fecha', label: 'Fecha' },
  { key: 'estado', label: 'Estado', render: (value) => {
    const colors = { pendiente: 'warning', en_curso: 'info', completada: 'success' };
    return <Chip label={value} color={colors[value]} size="small" />;
  }},
];
