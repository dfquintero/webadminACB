import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export const TableHeader = ({ title, onAdd }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Typography variant="h5">{title}</Typography>
    <Button variant="contained" startIcon={<Add />} onClick={onAdd}>Nuevo</Button>
  </Box>
);
