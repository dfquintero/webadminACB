import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm } from '@/shared/hooks/useForm';
import { alertaSchema } from '@/shared/config/schemas/alerta';
import { alertaDefault } from '@/shared/config/defaults/alerta';
import { AlertaFormFields } from './AlertaFormFields';

export const AlertaForm = ({ open, onClose, onSubmit, estudiantes }) => {
  const { control, handleSubmit, reset } = useForm(alertaSchema, alertaDefault, undefined);
  
  const submit = (data) => { 
    onSubmit(data); 
    reset(); 
    onClose(); 
  };
  
  return (
    <FormDialog open={open} onClose={onClose} onSubmit={handleSubmit(submit)} title="Enviar Alerta">
      <AlertaFormFields control={control} estudiantes={estudiantes} />
    </FormDialog>
  );
};
