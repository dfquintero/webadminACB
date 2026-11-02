import { FormSection } from '@/shared/components/molecules/FormSection';
import { FormField } from '@/shared/components/atoms/FormField';
import { FormRow } from '@/shared/components/molecules/FormRow';

export const EstudianteFormFields = ({ control }: { control: import('react-hook-form').Control<import('@/shared/api/types').EstudianteFormData> }) => (
  <FormSection>
    <FormRow>
      <FormField name="documentType" label="Tipo de documento" control={control} />
      <FormField name="documentNumber" label="Número de documento" control={control} />
    </FormRow>
    <FormField name="name" label="Nombre completo" control={control} />
    <FormField name="address" label="Dirección" control={control} />
    <FormField name="phone" label="Teléfono" control={control} />
    <FormRow>
      <FormField name="grade" label="Grado" control={control} />
      <FormField name="section" label="Sección" control={control} />
    </FormRow>
    <FormField name="schoolShift" label="Jornada" control={control} />
  </FormSection>
);
