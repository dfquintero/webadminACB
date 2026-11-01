import { Chip } from '@mui/material';

export const StatusChip = ({ value, activeLabel = 'Activo', inactiveLabel = 'Inactivo' }: { value: unknown; activeLabel?: string; inactiveLabel?: string }) => (
  <Chip label={value === 'activo' ? activeLabel : inactiveLabel} color={value === 'activo' ? 'success' : 'default'} size="small" />
);
