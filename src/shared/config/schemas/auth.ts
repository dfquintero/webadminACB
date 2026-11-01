import { z } from 'zod';

export const authSchemas = {
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
  }),
  register: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    nombre: z.string().min(2),
    apellido: z.string().min(2),
  }),
};
