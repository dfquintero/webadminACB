import { FormSection } from '@/shared/components/molecules/FormSection';
import { SelectField } from '@/shared/components/atoms/SelectField';
import { MultiSelect } from '@/shared/components/atoms/MultiSelect';
import { DateInput } from '@/shared/components/atoms/DateInput';

export const AsignacionFormFields = ({ control, rutaOptions, guiaOptions, guia2Options, estOptions }) => (
  <FormSection>
    <SelectField name="rutaId" label="Ruta" control={control} options={rutaOptions} />
    <SelectField name="guia1Id" label="Guía 1" control={control} options={guiaOptions} />
    <SelectField name="guia2Id" label="Guía 2" control={control} options={guia2Options} />
    <DateInput name="fecha" label="Fecha" control={control} type="date" />
    <MultiSelect name="estudiantesAsignados" label="Estudiantes" control={control} options={estOptions} />
  </FormSection>
);
