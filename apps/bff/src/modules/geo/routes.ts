import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { geoMeetingPointSchema, geoRouteSchema } from '@acb/contracts';
import { ApiFault } from '../../errors.js';
import { requireSession } from '../auth/session.js';
import type { UpstreamCall } from '../../upstreams/http.js';

const parse = <T>(schema: z.ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw new ApiFault(400, 'INVALID_INPUT', 'Revisa los datos enviados.');
  return result.data;
};

export const registerGeoRoutes = async (app: FastifyInstance, call: UpstreamCall) => {
  const send = async (request: Parameters<typeof requireSession>[0], path: string) => {
    requireSession(request);
    return call('GET', `/api/v1${path}`);
  };

  app.get('/bff/v1/geo/routes', async request =>
    z.array(geoRouteSchema).parse(await send(request, '/routes')));

  app.get('/bff/v1/geo/routes/search', async request => {
    const { code, route_code } = parse(
      z.object({ code: z.string().trim().min(1).max(16), route_code: z.string().trim().min(1).max(16) }).strict(),
      request.query ?? {});
    return z.array(geoRouteSchema).parse(
      await send(request, `/routes/search?code=${encodeURIComponent(code)}&route_code=${encodeURIComponent(route_code)}`));
  });

  app.get('/bff/v1/geo/routes/:id', async request => {
    const id = parse(z.string().trim().min(1).max(64), (request.params as { id: string }).id);
    return geoRouteSchema.parse(await send(request, `/routes/${encodeURIComponent(id)}`));
  });

  app.get('/bff/v1/geo/routes/:id/endpoints', async request => {
    const id = parse(z.string().trim().min(1).max(64), (request.params as { id: string }).id);
    return send(request, `/routes/${encodeURIComponent(id)}/endpoints`);
  });

  app.get('/bff/v1/geo/meeting-points', async request =>
    z.array(geoMeetingPointSchema).parse(await send(request, '/meeting-points')));
};
