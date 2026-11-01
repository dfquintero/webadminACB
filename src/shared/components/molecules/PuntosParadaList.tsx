import { Box, IconButton, Button, TextField } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFieldArray } from 'react-hook-form';

export const PuntosParadaList = ({ control }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'puntosParada' });
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 1 }}>
          <TextField label={`Punto ${index + 1}`} defaultValue={field.nombre} fullWidth size="small" />
          {fields.length > 1 && <IconButton onClick={() => remove(index)} color="error"><DeleteIcon /></IconButton>}
        </Box>
      ))}
      <Button onClick={() => append({ nombre: '', orden: fields.length + 1 })} variant="outlined" startIcon={<AddIcon />}>Agregar Punto</Button>
    </Box>
  );
};
