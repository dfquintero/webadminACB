import { FormSection } from '@/shared/components/molecules/FormSection';
import { FormField } from '@/shared/components/atoms/FormField';
import { SelectField } from '@/shared/components/atoms/SelectField';
import { FormRow } from '@/shared/components/molecules/FormRow';
import { documentTypeSchema } from '@acb/contracts';

const docTypes = documentTypeSchema.options.map(value => ({ value, label: value }));

export const EstudianteFormFields = ({ control }: { control: import('react-hook-form').Control<import('@/shared/api/types').EstudianteFormData> }) => (
  <FormSection>
    <FormRow>
      <SelectField name="documentType" label="Tipo de documento" control={control} options={docTypes} />
      <FormField name="documentNumber" label="Número de documento" control={control} />
    </FormRow>
    <FormField name="name" label="Nombre completo" control={control} />
    <FormField name="address" label="Dirección" control={control} />
    <FormField name="phone" label="Teléfono" control={control} />
    <FormRow>
      <FormField name="grade" label="Grado" control={control} />
      <FormField name="section" label="Sección" control={control} />
    </FormRow>
    <FormRow>
      <FormField name="schoolShift" label="Jornada" control={control} />
      <FormField name="schoolId" label="ID del colegio" control={control} type="number" />
    </FormRow>
  </FormSection>
);
