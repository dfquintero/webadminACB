import type { FieldValues } from 'react-hook-form';
import { FormField, type FormFieldProps } from './FormField';

export const DateInput = <T extends FieldValues>({ type = 'date', ...props }: FormFieldProps<T>) => (
  <FormField {...props} type={type} slotProps={{ inputLabel: { shrink: true } }} />
);
