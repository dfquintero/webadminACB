import { z } from 'zod';
import { guideDtoSchema, studentDtoSchema } from '@acb/contracts';
import { estudianteSchema } from '../config/schemas/estudiante';
import { guiaSchema } from '../config/schemas/guia';
import { asignacionSchema } from '../config/schemas/asignacion';
import { alertaSchema } from '../config/schemas/alerta';

const id = z.union([z.string().min(1), z.number().int().nonnegative()]).transform(String);
export const estudianteResponse = studentDtoSchema.transform(dto => ({
  id: String(dto.userId),
  documentType: dto.documentType,
  documentNumber: dto.documentNumber,
  name: dto.name,
  address: dto.address ?? '',
  phone: dto.phone ?? '',
  grade: dto.grade ?? '',
  schoolShift: dto.schoolShift ?? '',
  section: dto.section ?? '',
  schoolId: dto.schoolId ?? null,
  guardians: dto.guardians ?? [],
}));
export const guiaResponse = guideDtoSchema.transform(dto => ({
  id: String(dto.userId),
  documentType: dto.documentType,
  documentNumber: dto.documentNumber,
  name: dto.name,
  address: dto.address ?? '',
  phone: dto.phone ?? '',
  contractNumber: dto.contractNumber ?? '',
  email: dto.email ?? '',
  zone: dto.zone ?? '',
}));
export const rutaResponse = z.object({
  id: z.string(), name: z.string(),
  code: z.string().nullable().optional(), routeCode: z.string().nullable().optional(),
  dayShift: z.string().nullable().optional(), endpointStatus: z.string().optional(),
  meetingPoints: z.number().int().nonnegative(), distanceKm: z.number().nonnegative().optional(),
});
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
export type Ruta = z.infer<typeof rutaResponse>;
export type AsignacionFormData = z.infer<typeof asignacionSchema>;
export type Asignacion = z.infer<typeof asignacionResponse>;
export type AlertaFormData = z.infer<typeof alertaSchema>;
export type Alerta = z.infer<typeof alertaResponse>;
export type AsistenciaFormData = z.infer<typeof asistenciaSchema>;
export type Asistencia = z.infer<typeof asistenciaResponse>;
