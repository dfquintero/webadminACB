import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm } from '@/shared/hooks/useForm';
import { guiaSchema } from '@/shared/config/schemas/guia';
import { guiaDefault } from '@/shared/config/defaults/guia';
import { GuiaFormFields } from './GuiaFormFields';

export const GuiaForm = ({ open, onClose, onSubmit, initialData }) => {
  const { control, handleSubmit, reset } = useForm(guiaSchema, guiaDefault, initialData);
  
  const submit = (data) => { 
    onSubmit(data); 
    reset(); 
    onClose(); 
  };
  
  return (
    <FormDialog open={open} onClose={onClose} onSubmit={handleSubmit(submit)} title="Guía">
      <GuiaFormFields control={control} />
    </FormDialog>
  );
};
