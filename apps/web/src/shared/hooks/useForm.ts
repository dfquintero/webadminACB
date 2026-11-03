import { useEffect } from 'react';
import { useForm as useRHForm, type DefaultValues, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

export type EntityFormProps<T> = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
  initialData?: T | null;
};

export const useForm = <T extends FieldValues>(schema: z.ZodType<T, T> | undefined, defaultValues: DefaultValues<T>, initialData?: T | null, open = true) => {
  const form = useRHForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });
  const { reset } = form;

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, defaultValues, reset, open]);

  const submitForm = (save: (values: T) => Promise<void>, onClose: () => void, errorMessage?: (error: unknown) => string) => form.handleSubmit(async values => {
    form.clearErrors('root');
    try {
      await save(values);
      reset(defaultValues);
      onClose();
    } catch (error) {
      form.setError('root', { message: errorMessage?.(error) ?? 'No se pudo guardar. Revisa la conexión e inténtalo de nuevo.' });
    }
  });

  return { ...form, submitForm };
};
