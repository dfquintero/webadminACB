import { FormSection } from '@/shared/components/molecules/FormSection';
import { SelectField } from '@/shared/components/atoms/SelectField';
import { MultiSelect } from '@/shared/components/atoms/MultiSelect';
import { DateInput } from '@/shared/components/atoms/DateInput';

type Props = {
  control: import('react-hook-form').Control<import('@/shared/api/types').AsignacionFormData>;
  rutaOptions: import('@/shared/components/atoms/SelectField').SelectOption[];
  guiaOptions: import('@/shared/components/atoms/SelectField').SelectOption[];
  guia2Options: import('@/shared/components/atoms/SelectField').SelectOption[];
  estOptions: import('@/shared/components/atoms/SelectField').SelectOption[];
};

export const AsignacionFormFields = ({ control, rutaOptions, guiaOptions, guia2Options, estOptions }: Props) => (
  <FormSection>
    <SelectField name="rutaId" label="Ruta" control={control} options={rutaOptions} />
    <SelectField name="guia1Id" label="Guía 1" control={control} options={guiaOptions} />
    <SelectField name="guia2Id" label="Guía 2" control={control} options={guia2Options} />
    <DateInput name="fecha" label="Fecha" control={control} type="date" />
    <MultiSelect name="estudiantesAsignados" label="Estudiantes" control={control} options={estOptions} />
  </FormSection>
);
