import { z } from 'zod';

export const loginInputSchema = z.object({
  username: z.string().trim().min(1).max(128),
  password: z.string().min(1).max(256),
}).strict();

export const sessionUserSchema = z.object({
  id: z.union([z.string().min(1), z.number().int().nonnegative()]).transform(String),
  name: z.string().optional(),
  role: z.literal('MANAGER'),
  zone: z.string().nullable().optional(),
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

export const guardianLinkSchema = z.object({
  userId: z.number().int(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  relationship: z.string(),
  isPrimary: z.boolean(),
}).loose();

export const studentDtoSchema = z.object({
  userId: z.number().int(),
  documentType: z.string(),
  documentNumber: z.string(),
  name: z.string(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  schoolShift: z.string().nullable().optional(),
  section: z.string().nullable().optional(),
  schoolId: z.number().int().nullable().optional(),
  guardians: z.array(guardianLinkSchema).optional(),
}).loose();

export const guideDtoSchema = z.object({
  guideId: z.number().int(),
  userId: z.number().int().optional(),
  role: z.string().optional(),
  documentType: z.string(),
  documentNumber: z.string(),
  name: z.string(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  contractNumber: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  zone: z.string().nullable().optional(),
}).loose();

export const userDtoSchema = z.object({
  userId: z.number().int(),
  documentType: z.string(),
  documentNumber: z.string(),
  name: z.string(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().optional(),
  active: z.boolean().optional(),
}).loose();

export const pagedSchema = <T extends z.ZodType>(item: T) => z.object({
  content: z.array(item).default([]),
  totalElements: z.number().int().nonnegative().optional(),
  totalPages: z.number().int().nonnegative().optional(),
  pageable: z.unknown().optional(),
}).loose();

export const documentTypeSchema = z.enum(['CC', 'CE', 'NUIP', 'PPT', 'PPE']);

export type DocumentType = z.infer<typeof documentTypeSchema>;

export const relationshipSchema = z.enum(['FATHER', 'MOTHER', 'UNCLE_AUNT', 'RELATIVE', 'NEIGHBOR']);

const personInputSchema = z.object({
  documentType: documentTypeSchema,
  documentNumber: z.string().trim().min(1).max(32),
  name: z.string().trim().min(1).max(160),
  address: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(25),
}).strict();

export const createStudentInputSchema = z.object({
  user: personInputSchema,
  student: z.object({
    grade: z.string().trim().min(1).max(32),
    schoolShift: z.string().trim().min(1).max(32),
    section: z.string().trim().min(1).max(16),
    schoolId: z.number().int().positive(),
  }).strict(),
}).strict();

export const updateStudentInputSchema = z.object({
  grade: z.string().trim().min(1).max(32),
  schoolShift: z.string().trim().min(1).max(32),
  section: z.string().trim().min(1).max(16),
  schoolId: z.number().int().positive(),
}).strict();

export const createGuideInputSchema = z.object({
  user: personInputSchema,
  guide: z.object({
    contractNumber: z.string().trim().min(1).max(32),
    email: z.email().max(160),
    zone: z.string().trim().min(1).max(64),
  }).strict(),
}).strict();

export const updateGuideInputSchema = z.object({
  contractNumber: z.string().trim().min(1).max(32),
  email: z.email().max(160),
  zone: z.string().trim().min(1).max(64),
}).strict();

export const createUserInputSchema = personInputSchema.extend({
  role: z.enum(['GUARDIAN', 'MANAGER', 'LEADER']),
}).strict();

export const updateUserInputSchema = personInputSchema.extend({
  role: z.enum(['GUARDIAN', 'MANAGER', 'LEADER']),
}).strict();

export const assignGuardianInputSchema = z.object({
  guardianId: z.number().int().positive(),
  relationship: relationshipSchema,
  isPrimary: z.boolean(),
}).strict();

export const searchParamsSchema = z.object({
  type: z.string().trim().min(1).max(16),
  number: z.string().trim().min(1).max(32),
}).strict();

export type StudentDto = z.infer<typeof studentDtoSchema>;
export type GuideDto = z.infer<typeof guideDtoSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentInputSchema>;
export type CreateGuideInput = z.infer<typeof createGuideInputSchema>;
export type UpdateGuideInput = z.infer<typeof updateGuideInputSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type AssignGuardianInput = z.infer<typeof assignGuardianInputSchema>;
export type Capabilities = z.infer<typeof capabilitiesSchema>;
export type ResourceKey = Exclude<keyof Capabilities, 'auth'>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;

const lonLat = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

export const geoMeetingPointSchema = z.object({
  _id: z.string(),
  name: z.string(),
  kind: z.string(),
  description: z.string().nullable().optional(),
  location: z.object({ type: z.literal('Point'), coordinates: lonLat }).loose(),
}).loose();

export const geoRouteSchema = z.object({
  _id: z.string(),
  name: z.string(),
  route_code: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  day_shift: z.string().nullable().optional(),
  endpoint_status: z.string().optional(),
  geometry: z.object({ type: z.literal('LineString'), coordinates: z.array(lonLat) }).loose().optional(),
  meeting_point_ids: z.array(z.string()).optional(),
}).loose();

export type GeoMeetingPoint = z.infer<typeof geoMeetingPointSchema>;
export type GeoRoute = z.infer<typeof geoRouteSchema>;

export const geoRouteEndpointPointSchema = z.object({
  meeting_point_id: z.string(),
  name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  source: z.string().nullable().optional(),
  distance_m: z.number().nullable().optional(),
}).loose();

export const geoRouteEndpointsSchema = z.object({
  route_id: z.string(),
  status: z.string(),
  start: geoRouteEndpointPointSchema.nullable().optional(),
  end: geoRouteEndpointPointSchema.nullable().optional(),
}).loose();

export const geoImportResultSchema = z.object({
  message: z.string().optional(),
  saved_routes: z.number().int().nonnegative(),
  saved_points: z.number().int().nonnegative(),
  endpoints: z.object({
    resolved: z.number().int().nonnegative(),
    unresolved: z.number().int().nonnegative(),
    not_applicable: z.number().int().nonnegative(),
  }).loose().optional(),
}).loose();

export type GeoRouteEndpoints = z.infer<typeof geoRouteEndpointsSchema>;
export type GeoImportResult = z.infer<typeof geoImportResultSchema>;
