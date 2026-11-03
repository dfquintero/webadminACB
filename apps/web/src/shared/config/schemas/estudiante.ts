import { z } from 'zod';
import { documentTypeSchema } from '@acb/contracts';

export const estudianteSchema = z.object({
  documentType: documentTypeSchema,
  documentNumber: z.string().min(4, 'Mínimo 4 caracteres').max(20, 'Máximo 20 caracteres'),
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  address: z.string().min(1, 'Requerido'),
  phone: z.string().min(1, 'Requerido'),
  grade: z.string().min(1, 'Requerido'),
  schoolShift: z.string().min(1, 'Requerido'),
  section: z.string().min(1, 'Requerido'),
  schoolId: z.number().int().positive('Requerido'),
});
