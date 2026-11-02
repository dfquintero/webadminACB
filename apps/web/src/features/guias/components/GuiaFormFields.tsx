import { FormSection } from '@/shared/components/molecules/FormSection';
import { FormField } from '@/shared/components/atoms/FormField';
import { FormRow } from '@/shared/components/molecules/FormRow';

export const GuiaFormFields = ({ control }: { control: import('react-hook-form').Control<import('@/shared/api/types').GuiaFormData> }) => (
  <FormSection>
    <FormRow>
      <FormField name="documentType" label="Tipo de documento" control={control} />
      <FormField name="documentNumber" label="Número de documento" control={control} />
    </FormRow>
    <FormField name="name" label="Nombre completo" control={control} />
    <FormField name="address" label="Dirección" control={control} />
    <FormField name="phone" label="Teléfono" control={control} />
    <FormField name="contractNumber" label="Número de contrato" control={control} />
    <FormField name="email" label="Email" control={control} type="email" />
    <FormField name="zone" label="Zona" control={control} />
  </FormSection>
);
