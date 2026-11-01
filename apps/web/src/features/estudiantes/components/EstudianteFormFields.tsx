import { FormSection } from '@/shared/components/molecules/FormSection';
import { FormField } from '@/shared/components/atoms/FormField';
import { FormRow } from '@/shared/components/molecules/FormRow';

export const EstudianteFormFields = ({ control }: { control: import('react-hook-form').Control<import('@/shared/api/types').EstudianteFormData> }) => (
  <FormSection>
    <FormField name="nombre" label="Nombre" control={control} />
    <FormField name="apellido" label="Apellido" control={control} />
    <FormRow>
      <FormField name="edad" label="Edad" control={control} type="number" />
      <FormField name="telefonoPadre" label="Teléfono" control={control} />
    </FormRow>
    <FormField name="direccion" label="Dirección" control={control} />
    <FormField name="puntoRecogida" label="Punto Recogida" control={control} />
    <FormField name="emailPadre" label="Email" control={control} type="email" />
  </FormSection>
);
