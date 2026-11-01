import { FormSection } from '@/shared/components/molecules/FormSection';
import { FormField } from '@/shared/components/atoms/FormField';
import { SwitchField } from '@/shared/components/atoms/SwitchField';

export const GuiaFormFields = ({ control }) => (
  <FormSection>
    <FormField name="nombre" label="Nombre" control={control} />
    <FormField name="apellido" label="Apellido" control={control} />
    <FormField name="documento" label="Documento" control={control} />
    <FormField name="telefono" label="Teléfono" control={control} />
    <FormField name="email" label="Email" control={control} type="email" />
    <FormField name="licencia" label="Licencia" control={control} />
    <SwitchField name="disponibilidad" label="Disponible" control={control} />
  </FormSection>
);
