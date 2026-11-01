import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useForm, useWatch } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';
import { FormField } from './FormField';

const NumericField = () => {
  const { control } = useForm({ defaultValues: { edad: 5 } });
  const edad = useWatch({ control, name: 'edad' });
  return <><FormField name="edad" label="Edad" control={control} type="number" /><output>{typeof edad}</output></>;
};

afterEach(cleanup);

describe('FormField', () => {
  it('keeps numeric input as a number for Zod validation', () => {
    render(<NumericField />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '12' } });
    expect(screen.getByRole('status').textContent).toBe('number');
  });
});
