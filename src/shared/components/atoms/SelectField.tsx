import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';

export const SelectField = ({ name, label, control, options, ...props }) => (
  <Controller name={name} control={control} render={({ field }) => <FormControl fullWidth {...props}><InputLabel>{label}</InputLabel><Select {...field} label={label}>{options.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}</Select></FormControl>} />
);
