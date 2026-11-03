import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type Props<T extends FieldValues> = { name: Path<T>; label: string; control: Control<T> };

export const CheckboxField = <T extends FieldValues>({ name, label, control }: Props<T>) => (
  <Controller name={name} control={control} render={({ field }) => (
    <FormControlLabel label={label} control={<Checkbox {...field} checked={!!field.value} />} />
  )} />
);
