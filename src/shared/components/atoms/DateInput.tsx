import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export const DateInput = ({ name, label, control, type = 'date', ...props }) => (
  <Controller name={name} control={control} render={({ field }) => (
    <TextField {...field} label={label} type={type} fullWidth slotProps={{ inputLabel: { shrink: true } }} {...props} />
  )} />
);
