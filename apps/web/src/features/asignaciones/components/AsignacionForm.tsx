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
  const rutaOptions = rutas.filter(r => r.estado === 'activo').map(r => ({ value: r.id, label: r.nombre }));
  const guiaOptions = guias.filter(g => g.disponibilidad && g.estado === 'activo').map(g => ({ value: g.id, label: `${g.nombre} ${g.apellido}` }));
  const guia2Options = guiaOptions.filter(g => g.value !== guia1Id);
  const estOptions = estudiantes.filter(e => e.estado === 'activo').map(e => ({ value: e.id, label: `${e.nombre} ${e.apellido}`, secondary: e.puntoRecogida }));
  return <FormDialog open={open} onClose={onClose} onSubmit={submitForm(onSubmit, onClose)} title="Asignación"
    pending={formState.isSubmitting} error={formState.errors.root?.message}>
    <AsignacionFormFields control={control} rutaOptions={rutaOptions} guiaOptions={guiaOptions} guia2Options={guia2Options} estOptions={estOptions} />
  </FormDialog>;
};
