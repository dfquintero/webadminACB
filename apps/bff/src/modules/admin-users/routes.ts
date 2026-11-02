import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  assignGuardianInputSchema, createGuideInputSchema, createStudentInputSchema, createUserInputSchema,
  guideDtoSchema, pagedSchema, searchParamsSchema, studentDtoSchema, updateGuideInputSchema,
  updateStudentInputSchema, updateUserInputSchema, userDtoSchema,
} from '@acb/contracts';
import { ApiFault } from '../../errors.js';
import { requireSession } from '../auth/session.js';
import type { UpstreamCall } from '../../upstreams/http.js';

const idSchema = z.coerce.number().int().positive();
const pageSchema = z.object({ page: z.coerce.number().int().nonnegative().default(0), size: z.coerce.number().int().min(1).max(100).default(10) }).partial();

const parse = <T>(schema: z.ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw new ApiFault(400, 'INVALID_INPUT', 'Revisa los datos enviados.');
  return result.data;
};

export const registerAdminUsersRoutes = async (app: FastifyInstance, call: UpstreamCall) => {
  const csrf = { onRequest: app.csrfProtection };
  const send = async (request: Parameters<typeof requireSession>[0], method: string, path: string, body?: unknown) =>
    call(method, `/api/v1${path}`, body, requireSession(request));

  app.get('/bff/v1/students', async request => {
    const { page = 0, size = 10 } = parse(pageSchema, request.query ?? {});
    const data = await send(request, 'GET', `/students?page=${page}&size=${size}`);
    return pagedSchema(studentDtoSchema).parse(data ?? { content: [] });
  });
  app.post('/bff/v1/students', csrf, async request =>
    send(request, 'POST', '/students', parse(createStudentInputSchema, request.body)));
  app.get('/bff/v1/students/:id', async request =>
    studentDtoSchema.parse(await send(request, 'GET', `/students/${parse(idSchema, (request.params as { id: string }).id)}`)));
  app.put('/bff/v1/students/:id', csrf, async request =>
    send(request, 'PUT', `/students/${parse(idSchema, (request.params as { id: string }).id)}`, parse(updateStudentInputSchema, request.body)));
  app.post('/bff/v1/students/:id/guardians', csrf, async request =>
    send(request, 'POST', `/students/${parse(idSchema, (request.params as { id: string }).id)}/guardians`, parse(assignGuardianInputSchema, request.body)));
  app.get('/bff/v1/students/school/:schoolId', async request => {
    const schoolId = parse(idSchema, (request.params as { schoolId: string }).schoolId);
    const { page = 0, size = 10 } = parse(pageSchema, request.query ?? {});
    const data = await send(request, 'GET', `/students/school/${schoolId}?page=${page}&size=${size}`);
    return pagedSchema(studentDtoSchema).parse(data ?? { content: [] });
  });

  app.get('/bff/v1/guides', async request => {
    const { page = 0, size = 10 } = parse(pageSchema, request.query ?? {});
    const data = await send(request, 'GET', `/guides?page=${page}&size=${size}`);
    return pagedSchema(guideDtoSchema).parse(data ?? { content: [] });
  });
  app.post('/bff/v1/guides', csrf, async request =>
    send(request, 'POST', '/guides', parse(createGuideInputSchema, request.body)));
  app.get('/bff/v1/guides/:id', async request =>
    guideDtoSchema.parse(await send(request, 'GET', `/guides/${parse(idSchema, (request.params as { id: string }).id)}`)));
  app.put('/bff/v1/guides/:id', csrf, async request =>
    send(request, 'PUT', `/guides/${parse(idSchema, (request.params as { id: string }).id)}`, parse(updateGuideInputSchema, request.body)));
  app.delete('/bff/v1/guides/:id', csrf, async request =>
    send(request, 'DELETE', `/guides/${parse(idSchema, (request.params as { id: string }).id)}`));

  app.get('/bff/v1/users', async request => {
    const { page = 0, size = 10 } = parse(pageSchema, request.query ?? {});
    const data = await send(request, 'GET', `/users?page=${page}&size=${size}`);
    return pagedSchema(userDtoSchema).parse(data ?? { content: [] });
  });
  app.post('/bff/v1/users', csrf, async request =>
    send(request, 'POST', '/users', parse(createUserInputSchema, request.body)));
  app.get('/bff/v1/users/:id', async request =>
    userDtoSchema.parse(await send(request, 'GET', `/users/${parse(idSchema, (request.params as { id: string }).id)}`)));
  app.put('/bff/v1/users/:id', csrf, async request =>
    send(request, 'PUT', `/users/${parse(idSchema, (request.params as { id: string }).id)}`, parse(updateUserInputSchema, request.body)));
  app.delete('/bff/v1/users/:id', csrf, async request =>
    send(request, 'DELETE', `/users/${parse(idSchema, (request.params as { id: string }).id)}`));

  app.get('/bff/v1/search', async request => {
    const { type, number } = parse(searchParamsSchema, request.query ?? {});
    return send(request, 'GET', `/search?type=${encodeURIComponent(type)}&number=${encodeURIComponent(number)}`);
  });
};
