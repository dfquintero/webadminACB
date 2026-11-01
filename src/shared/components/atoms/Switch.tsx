import { FormControlLabel, Switch } from '@mui/material';
import { Controller } from 'react-hook-form';

export const SwitchField = ({ name, label, control, ...props }) => (
  <Controller name={name} control={control} render={({ field }) => (
    <FormControlLabel control={<Switch {...field} checked={field.value} />} label={label} {...props} />
  )} />
);
