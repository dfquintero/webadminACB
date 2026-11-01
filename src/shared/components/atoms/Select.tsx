import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';

export const SelectField = ({ name, label, control, options, ...props }) => (
  <Controller name={name} control={control} render={({ field }) => (
    <FormControl fullWidth {...props}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect {...field} label={label}>
        {options.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
      </MuiSelect>
    </FormControl>
  )} />
);
