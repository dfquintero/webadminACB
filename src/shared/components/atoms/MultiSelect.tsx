import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Controller } from 'react-hook-form';

export const MultiSelect = ({ name, label, control, options, renderValue, ...props }) => (
  <Controller name={name} control={control} render={({ field }) => (
    <FormControl fullWidth {...props}>
      <InputLabel>{label}</InputLabel>
      <Select {...field} label={label} multiple renderValue={renderValue}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Checkbox checked={field.value.includes(opt.value)} />
            <ListItemText primary={opt.label} secondary={opt.secondary} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )} />
);
