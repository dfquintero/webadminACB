import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm, type EntityFormProps } from '@/shared/hooks/useForm';
import { alertaSchema } from '@/shared/config/schemas/alerta';
import { alertaDefault } from '@/shared/config/defaults/alerta';
import type { AlertaFormData, Estudiante } from '@/shared/api/types';
import { AlertaFormFields } from './AlertaFormFields';

type Props = EntityFormProps<AlertaFormData> & { estudiantes: Estudiante[] };

export const AlertaForm = ({ open, onClose, onSubmit, estudiantes }: Props) => {
  const { control, submitForm, formState } = useForm(alertaSchema, alertaDefault, undefined, open);
  return <FormDialog open={open} onClose={onClose} onSubmit={submitForm(onSubmit, onClose)} title="Crear Alerta"
    pending={formState.isSubmitting} error={formState.errors.root?.message}>
    <AlertaFormFields control={control} estudiantes={estudiantes} />
  </FormDialog>;
};
