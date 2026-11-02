import { z } from 'zod';

export const estudianteSchema = z.object({
  documentType: z.string().min(1, 'Requerido'),
  documentNumber: z.string().min(4, 'Mínimo 4 caracteres').max(20, 'Máximo 20 caracteres'),
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  address: z.string().optional(),
  phone: z.string().optional(),
  grade: z.string().min(1, 'Requerido'),
  schoolShift: z.string().min(1, 'Requerido'),
  section: z.string().min(1, 'Requerido'),
});
