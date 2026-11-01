import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const useForm = (schema, defaultValues, initialData) => {
  return useRHForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialData || defaultValues,
  });
};
