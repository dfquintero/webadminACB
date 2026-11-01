import { z } from 'zod';

export const asignacionSchema = z.object({
  rutaId: z.string(),
  guia1Id: z.string(),
  guia2Id: z.string(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estudiantesAsignados: z.array(z.string()).min(1),
  estado: z.enum(['pendiente', 'en_curso', 'completada']),
});
