import { z } from 'zod';

export const rutaSchema = z.object({
  nombre: z.string().min(3),
  distancia: z.number().min(0.1),
  tiempoEstimado: z.number().min(1),
  horarioInicio: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  horarioFin: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  puntosParada: z.array(z.object({ nombre: z.string().min(3), direccion: z.string().min(5) })),
  estado: z.enum(['activo', 'inactivo']),
});
