import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import type { ReactNode } from 'react';

export const TableHeader = ({ title, onAdd, action }: { title: string; onAdd?: () => void; action?: { label: string; icon?: ReactNode; onClick: () => void } }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Typography variant="h5">{title}</Typography>
    <Box sx={{ display: 'flex', gap: 1 }}>
      {action && <Button variant="outlined" startIcon={action.icon} onClick={action.onClick}>{action.label}</Button>}
      {onAdd && <Button variant="contained" startIcon={<Add />} onClick={onAdd}>Nuevo</Button>}
    </Box>
  </Box>
);
