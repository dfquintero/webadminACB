import { Box, IconButton, Button } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFieldArray, type Control } from 'react-hook-form';
import { FormField } from '../atoms/FormField';
import type { RutaFormData } from '../../api/types';

export const PuntosParadaList = ({ control }: { control: Control<RutaFormData> }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'puntosParada' });
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 1 }}>
          <FormField name={`puntosParada.${index}.nombre`} label={`Punto ${index + 1}`} control={control} size="small" />
          <FormField name={`puntosParada.${index}.direccion`} label={`Dirección ${index + 1}`} control={control} size="small" />
          <IconButton aria-label={`Eliminar punto ${index + 1}`} onClick={() => remove(index)} color="error"><DeleteIcon /></IconButton>
        </Box>
      ))}
      <Button onClick={() => append({ nombre: '', direccion: '' })} variant="outlined" startIcon={<AddIcon />}>Agregar Punto</Button>
    </Box>
  );
};
