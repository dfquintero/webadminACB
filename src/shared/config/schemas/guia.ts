import { z } from 'zod';
import { basePersona } from './base';

export const guiaSchema = basePersona.extend({
  documento: z.string().regex(/^\d{8,10}$/, '8-10 dígitos'),
  licencia: z.string().min(3),
  disponibilidad: z.boolean(),
  estado: z.enum(['activo', 'inactivo']),
});
