import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm } from '@/shared/hooks/useForm';
import { rutaSchema } from '@/shared/config/schemas/ruta';
import { rutaDefault } from '@/shared/config/defaults/ruta';
import { RutaFormFields } from './RutaFormFields';

export const RutaForm = ({ open, onClose, onSubmit, initialData }) => {
  const { control, handleSubmit, reset } = useForm(rutaSchema, rutaDefault, initialData);
  
  const submit = (data) => { 
    onSubmit(data); 
    reset(); 
    onClose(); 
  };
  
  return (
    <FormDialog open={open} onClose={onClose} onSubmit={handleSubmit(submit)} title="Ruta" maxWidth="md">
      <RutaFormFields control={control} />
    </FormDialog>
  );
};
