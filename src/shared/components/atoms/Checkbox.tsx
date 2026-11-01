import { Checkbox } from '@mui/material';
import { Controller } from 'react-hook-form';

export const CheckboxField = ({ name, label, control, ...props }) => (
  <Controller name={name} control={control} render={({ field }) => <Checkbox {...field} {...props} />} />
);
