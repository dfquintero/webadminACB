import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm } from '@/shared/hooks/useForm';
import { estudianteSchema } from '@/shared/config/schemas/estudiante';
import { estudianteDefault } from '@/shared/config/defaults/estudiante';
import { EstudianteFormFields } from './EstudianteFormFields';

export const EstudianteForm = ({ open, onClose, onSubmit, initialData }) => {
  const { control, handleSubmit, reset } = useForm(estudianteSchema, estudianteDefault, initialData);
  
  const submit = (data) => { 
    onSubmit(data); 
    reset(); 
    onClose(); 
  };
  
  return (
    <FormDialog open={open} onClose={onClose} onSubmit={handleSubmit(submit)} title="Estudiante">
      <EstudianteFormFields control={control} />
    </FormDialog>
  );
};
