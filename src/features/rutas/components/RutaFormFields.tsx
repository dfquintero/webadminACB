import { FormSection } from '@/shared/components/molecules/FormSection';
import { FormField } from '@/shared/components/atoms/FormField';
import { FormRow } from '@/shared/components/molecules/FormRow';
import { DateInput } from '@/shared/components/atoms/DateInput';
import { PuntosParadaList } from '@/shared/components/molecules/PuntosParadaList';

export const RutaFormFields = ({ control }) => (
  <>
    <FormSection title="Información">
      <FormField name="nombre" label="Nombre" control={control} />
      <FormRow>
        <FormField name="distancia" label="Distancia (km)" control={control} type="number" />
        <FormField name="tiempoEstimado" label="Tiempo (min)" control={control} type="number" />
      </FormRow>
      <FormRow>
        <DateInput name="horarioInicio" label="Inicio" control={control} type="time" />
        <DateInput name="horarioFin" label="Fin" control={control} type="time" />
      </FormRow>
    </FormSection>
    <FormSection title="Puntos de Parada">
      <PuntosParadaList control={control} />
    </FormSection>
  </>
);
