import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { useForm } from '@/shared/hooks/useForm';
import { useWatch } from 'react-hook-form';
import { asignacionSchema } from '@/shared/config/schemas/asignacion';
import { asignacionDefault } from '@/shared/config/defaults/asignacion';
import { AsignacionFormFields } from './AsignacionFormFields';

export const AsignacionForm = ({ open, onClose, onSubmit, initialData, rutas, guias, estudiantes }) => {
  const { control, handleSubmit, reset, watch } = useForm(asignacionSchema, asignacionDefault, initialData);
  const guia1Id = watch('guia1Id');
  
  const rutaOptions = rutas.filter(r => r.estado === 'activo').map(r => ({ value: r.id, label: r.nombre }));
  const guiaOptions = guias.filter(g => g.disponibilidad && g.estado === 'activo').map(g => ({ value: g.id, label: `${g.nombre} ${g.apellido}` }));
  const guia2Options = guiaOptions.filter(g => g.value !== guia1Id);
  const estOptions = estudiantes.filter(e => e.estado === 'activo').map(e => ({ value: e.id, label: `${e.nombre} ${e.apellido}`, secondary: e.puntoRecogida }));
  
  const submit = (data) => { 
    onSubmit(data); 
    reset(); 
    onClose(); 
  };
  
  return (
    <FormDialog open={open} onClose={onClose} onSubmit={handleSubmit(submit)} title="Asignación">
      <AsignacionFormFields control={control} rutaOptions={rutaOptions} guiaOptions={guiaOptions} guia2Options={guia2Options} estOptions={estOptions} />
    </FormDialog>
  );
};
