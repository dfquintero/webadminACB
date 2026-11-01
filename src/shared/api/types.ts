import { z } from 'zod';

const basePersona = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
});

export const schemas = {
  auth: {
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
  },
  estudiante: basePersona.extend({
    edad: z.number().min(5, 'Mínimo 5 años').max(18, 'Máximo 18 años'),
    direccion: z.string().min(10, 'Mínimo 10 caracteres'),
    puntoRecogida: z.string().min(3),
    telefonoPadre: z.string().regex(/^\d{10}$/, '10 dígitos'),
    estado: z.enum(['activo', 'inactivo']),
  }),
  guia: basePersona.extend({
    documento: z.string().regex(/^\d{8,10}$/, '8-10 dígitos'),
    licencia: z.string().min(3),
    disponibilidad: z.boolean(),
    estado: z.enum(['activo', 'inactivo']),
  }),
  ruta: z.object({
    nombre: z.string().min(3),
    distancia: z.number().min(0.1),
    tiempoEstimado: z.number().min(1),
    horarioInicio: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    horarioFin: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    puntosParada: z.array(z.object({ nombre: z.string().min(3), direccion: z.string().min(5) })),
    estado: z.enum(['activo', 'inactivo']),
  }),
  asignacion: z.object({
    rutaId: z.string(),
    guia1Id: z.string(),
    guia2Id: z.string(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    estudiantesAsignados: z.array(z.string()).min(1),
    estado: z.enum(['pendiente', 'en_curso', 'completada']),
  }),
};

export type Estudiante = z.infer<typeof schemas.estudiante>;
export type EstudianteFormData = Omit<Estudiante, 'id'>;
export type Guia = z.infer<typeof schemas.guia>;
export type GuiaFormData = Omit<Guia, 'id'>;
export type Ruta = z.infer<typeof schemas.ruta>;
export type RutaFormData = Omit<Ruta, 'id'>;
export type Asignacion = z.infer<typeof schemas.asignacion>;
export type AsignacionFormData = Omit<Asignacion, 'id'>;
