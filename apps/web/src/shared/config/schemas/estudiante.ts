import { z } from 'zod';
import { basePersona } from './base';

export const estudianteSchema = basePersona.omit({ email: true }).extend({
  emailPadre: z.string().email('Email inválido'),
  edad: z.number().min(5, 'Mínimo 5 años').max(18, 'Máximo 18 años'),
  direccion: z.string().min(10, 'Mínimo 10 caracteres'),
  puntoRecogida: z.string().min(3),
  telefonoPadre: z.string().regex(/^\d{10}$/, '10 dígitos'),
  estado: z.enum(['activo', 'inactivo']),
});
