import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm, type EntityFormProps } from '@/shared/hooks/useForm';
import { rutaSchema } from '@/shared/config/schemas/ruta';
import { rutaDefault } from '@/shared/config/defaults/ruta';
import type { RutaFormData } from '@/shared/api/types';
import { RutaFormFields } from './RutaFormFields';

export const RutaForm = ({ open, onClose, onSubmit, initialData }: EntityFormProps<RutaFormData>) => {
  const { control, submitForm, formState } = useForm(rutaSchema, rutaDefault, initialData, open);
  return <FormDialog open={open} onClose={onClose} onSubmit={submitForm(onSubmit, onClose)} title="Ruta" maxWidth="md"
    pending={formState.isSubmitting} error={formState.errors.root?.message}>
    <RutaFormFields control={control} />
  </FormDialog>;
};
