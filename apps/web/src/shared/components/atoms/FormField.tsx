import { TextField, type TextFieldProps } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export type FormFieldProps<T extends FieldValues> = Omit<TextFieldProps, 'name' | 'defaultValue' | 'value' | 'onChange'> & {
  name: Path<T>;
  control: Control<T>;
};

export const FormField = <T extends FieldValues>({ name, control, type = 'text', ...props }: FormFieldProps<T>) => (
  <Controller name={name} control={control} render={({ field, fieldState }) => (
    <TextField {...props} {...field} value={field.value ?? ''} type={type} fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message ?? props.helperText}
      onChange={(event) => field.onChange(type === 'number' ? (event.target.value === '' ? undefined : Number(event.target.value)) : event.target.value)} />
  )} />
);
