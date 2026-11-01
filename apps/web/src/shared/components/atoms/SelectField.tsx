import { useId } from 'react';
import { FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export type SelectOption = { value: string; label: string; secondary?: string };
type Props<T extends FieldValues> = { name: Path<T>; label: string; control: Control<T>; options: SelectOption[] };

export const SelectField = <T extends FieldValues>({ name, label, control, options }: Props<T>) => {
  const id = useId();
  return <Controller name={name} control={control} render={({ field, fieldState }) => (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select {...field} value={field.value ?? ''} labelId={id} label={label}>
        {options.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
      </Select>
      {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
    </FormControl>
  )} />;
};
