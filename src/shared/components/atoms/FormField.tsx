import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export const FormField = ({ name, label, control, type = 'text', ...props }) => (
  <Controller name={name} control={control} render={({ field }) => (
    <TextField {...field} label={label} type={type} fullWidth {...props} />
  )} />
);
