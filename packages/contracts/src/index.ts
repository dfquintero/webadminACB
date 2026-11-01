import { z } from 'zod';

export const loginInputSchema = z.object({
  username: z.string().trim().min(1).max(128),
  password: z.string().min(1).max(256),
}).strict();

export const sessionUserSchema = z.object({
  id: z.union([z.string().min(1), z.number().int().nonnegative()]).transform(String),
  name: z.string().min(1),
  role: z.literal('MANAGER'),
  zone: z.string().nullable(),
});

export const sessionResponseSchema = z.object({
  user: sessionUserSchema,
  expiresAt: z.string().datetime(),
});

export const apiErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string(), requestId: z.string() }),
});

export const capabilitiesSchema = z.object({
  auth: z.literal(true), estudiantes: z.boolean(), guias: z.boolean(), rutas: z.boolean(),
  asignaciones: z.boolean(), asistencia: z.boolean(), alertas: z.boolean(), dashboard: z.boolean(), geo: z.boolean(),
});

export type Capabilities = z.infer<typeof capabilitiesSchema>;
export type ResourceKey = Exclude<keyof Capabilities, 'auth'>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
