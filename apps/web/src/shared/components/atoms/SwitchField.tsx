import { FormControlLabel, Switch } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type Props<T extends FieldValues> = { name: Path<T>; label: string; control: Control<T> };

export const SwitchField = <T extends FieldValues>({ name, label, control }: Props<T>) => (
  <Controller name={name} control={control} render={({ field }) => (
    <FormControlLabel control={<Switch {...field} checked={!!field.value} />} label={label} />
  )} />
);
