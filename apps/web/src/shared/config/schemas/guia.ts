import { z } from 'zod';
import { documentTypeSchema } from '@acb/contracts';

export const guiaSchema = z.object({
  documentType: documentTypeSchema,
  documentNumber: z.string().min(4, 'Mínimo 4 caracteres').max(20, 'Máximo 20 caracteres'),
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  address: z.string().optional(),
  phone: z.string().optional(),
  contractNumber: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  zone: z.string().min(1, 'Requerido'),
});
