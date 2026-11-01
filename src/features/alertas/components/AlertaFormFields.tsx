import { FormSection } from '@/shared/components/molecules/FormSection';
import { SelectField } from '@/shared/components/atoms/SelectField';
import { FormField } from '@/shared/components/atoms/FormField';

export const AlertaFormFields = ({ control, estudiantes }) => {
  const estOptions = estudiantes.filter(e => e.estado === 'activo').map(e => ({ value: e.id, label: `${e.nombre} ${e.apellido}` }));
  
  return (
    <FormSection>
      <SelectField name="estudianteId" label="Estudiante" control={control} options={estOptions} />
      <SelectField name="tipo" label="Tipo" control={control} options={[
        { value: 'guia_cerca', label: 'Guía Cerca' },
        { value: 'recogido', label: 'Recogido' },
        { value: 'ruta_finalizada', label: 'Ruta Finalizada' },
      ]} />
      <SelectField name="canal" label="Canal" control={control} options={[
        { value: 'sms', label: 'SMS' },
        { value: 'email', label: 'Email' },
        { value: 'push', label: 'Push' },
      ]} />
      <FormField name="mensaje" label="Mensaje" control={control} multiline rows={3} />
    </FormSection>
  );
};
