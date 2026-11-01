import { z } from 'zod';
import { estudianteSchema } from '../config/schemas/estudiante';
import { guiaSchema } from '../config/schemas/guia';
import { rutaSchema } from '../config/schemas/ruta';
import { asignacionSchema } from '../config/schemas/asignacion';
import { alertaSchema } from '../config/schemas/alerta';

const id = z.union([z.string().min(1), z.number().int().nonnegative()]).transform(String);
export const estudianteResponse = estudianteSchema.extend({ id });
export const guiaResponse = guiaSchema.extend({ id });
export const rutaResponse = rutaSchema.extend({ id });
export const asignacionResponse = asignacionSchema.extend({ id });
export const alertaResponse = alertaSchema.extend({
  id, fechaEnvio: z.string(), estado: z.enum(['pendiente', 'enviada', 'fallida']),
});
export const asistenciaSchema = z.object({
  asignacionId: z.string().min(1), estudianteId: z.string().min(1),
  estado: z.enum(['pendiente', 'recogido', 'no_asistio', 'justificado']),
  horaRegistro: z.string().optional(), observaciones: z.string().optional(),
});
export const asistenciaResponse = asistenciaSchema.extend({ id });

export type EstudianteFormData = z.infer<typeof estudianteSchema>;
export type Estudiante = z.infer<typeof estudianteResponse>;
export type GuiaFormData = z.infer<typeof guiaSchema>;
export type Guia = z.infer<typeof guiaResponse>;
export type RutaFormData = z.infer<typeof rutaSchema>;
export type Ruta = z.infer<typeof rutaResponse>;
export type AsignacionFormData = z.infer<typeof asignacionSchema>;
export type Asignacion = z.infer<typeof asignacionResponse>;
export type AlertaFormData = z.infer<typeof alertaSchema>;
export type Alerta = z.infer<typeof alertaResponse>;
export type AsistenciaFormData = z.infer<typeof asistenciaSchema>;
export type Asistencia = z.infer<typeof asistenciaResponse>;
