import { z } from 'zod';

export const alertaSchema = z.object({
  estudianteId: z.string(),
  tipo: z.enum(['guia_cerca', 'recogido', 'ruta_finalizada']),
  mensaje: z.string().min(10, 'Mínimo 10 caracteres'),
  canal: z.enum(['sms', 'email', 'push']),
});
