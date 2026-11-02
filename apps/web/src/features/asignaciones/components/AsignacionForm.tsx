import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm, type EntityFormProps } from '@/shared/hooks/useForm';
import { asignacionSchema } from '@/shared/config/schemas/asignacion';
import { asignacionDefault } from '@/shared/config/defaults/asignacion';
import type { AsignacionFormData, Ruta, Guia, Estudiante } from '@/shared/api/types';
import { AsignacionFormFields } from './AsignacionFormFields';

type Props = EntityFormProps<AsignacionFormData> & { rutas: Ruta[]; guias: Guia[]; estudiantes: Estudiante[] };

export const AsignacionForm = ({ open, onClose, onSubmit, initialData, rutas, guias, estudiantes }: Props) => {
  const { control, submitForm, formState, watch } = useForm(asignacionSchema, asignacionDefault, initialData, open);
  const guia1Id = watch('guia1Id');
  const rutaOptions = rutas.map(r => ({ value: r.id, label: r.name }));
  const guiaOptions = guias.map(g => ({ value: g.id, label: g.name }));
  const guia2Options = guiaOptions.filter(g => g.value !== guia1Id);
  const estOptions = estudiantes.map(e => ({ value: e.id, label: e.name, secondary: e.documentNumber }));
  return <FormDialog open={open} onClose={onClose} onSubmit={submitForm(onSubmit, onClose)} title="Asignación"
    pending={formState.isSubmitting} error={formState.errors.root?.message}>
    <AsignacionFormFields control={control} rutaOptions={rutaOptions} guiaOptions={guiaOptions} guia2Options={guia2Options} estOptions={estOptions} />
  </FormDialog>;
};
