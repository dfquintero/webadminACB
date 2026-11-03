import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm, type EntityFormProps } from '@/shared/hooks/useForm';
import { estudianteSchema } from '@/shared/config/schemas/estudiante';
import { estudianteDefault } from '@/shared/config/defaults/estudiante';
import type { EstudianteFormData } from '@/shared/api/types';
import { EstudianteFormFields } from './EstudianteFormFields';

export const EstudianteForm = ({ open, onClose, onSubmit, initialData }: EntityFormProps<EstudianteFormData>) => {
  const { control, submitForm, formState } = useForm(estudianteSchema, estudianteDefault, initialData, open);
  return <FormDialog open={open} onClose={onClose} onSubmit={submitForm(onSubmit, onClose)} title="Estudiante"
    pending={formState.isSubmitting} error={formState.errors.root?.message}>
    <EstudianteFormFields control={control} />
  </FormDialog>;
};
