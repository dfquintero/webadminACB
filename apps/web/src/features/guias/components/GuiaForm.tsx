import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm, type EntityFormProps } from '@/shared/hooks/useForm';
import { guiaSchema } from '@/shared/config/schemas/guia';
import { guiaDefault } from '@/shared/config/defaults/guia';
import type { GuiaFormData } from '@/shared/api/types';
import { GuiaFormFields } from './GuiaFormFields';

export const GuiaForm = ({ open, onClose, onSubmit, initialData }: EntityFormProps<GuiaFormData>) => {
  const { control, submitForm, formState } = useForm(guiaSchema, guiaDefault, initialData, open);
  return <FormDialog open={open} onClose={onClose} onSubmit={submitForm(onSubmit, onClose)} title="Guía"
    pending={formState.isSubmitting} error={formState.errors.root?.message}>
    <GuiaFormFields control={control} />
  </FormDialog>;
};
