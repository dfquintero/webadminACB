import { useId } from 'react';
import { FormControl, FormHelperText, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options: { value: string; label: string; secondary?: string }[];
  renderValue?: (value: string[]) => React.ReactNode;
};

export const MultiSelect = <T extends FieldValues>({ name, label, control, options, renderValue }: Props<T>) => {
  const id = useId();
  return <Controller name={name} control={control} render={({ field, fieldState }) => (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select {...field} value={field.value ?? []} labelId={id} label={label} multiple
        renderValue={renderValue ?? ((selected: string[]) => selected.map(value => options.find(option => option.value === value)?.label ?? value).join(', '))}>
        {options.map(option => <MenuItem key={option.value} value={option.value}>
          <Checkbox checked={Array.isArray(field.value) && field.value.includes(option.value)} />
          <ListItemText primary={option.label} secondary={option.secondary} />
        </MenuItem>)}
      </Select>
      {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
    </FormControl>
  )} />;
};
