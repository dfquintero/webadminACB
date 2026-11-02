import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { geoImportResultSchema, geoMeetingPointSchema, geoRouteEndpointsSchema, geoRouteSchema } from '@acb/contracts';
import { ApiFault } from '../../errors.js';
import { requireSession } from '../auth/session.js';
import type { UpstreamCall } from '../../upstreams/http.js';
import type { BffConfig } from '../../config.js';

const parse = <T>(schema: z.ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw new ApiFault(400, 'INVALID_INPUT', 'Revisa los datos enviados.');
  return result.data;
};

const MAX_KMZ_BYTES = 20 * 1024 * 1024;

export const registerGeoRoutes = async (app: FastifyInstance, call: UpstreamCall, config: BffConfig) => {
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
    return geoRouteEndpointsSchema.parse(await send(request, `/routes/${encodeURIComponent(id)}/endpoints`));
  });

  app.get('/bff/v1/geo/meeting-points', async request =>
    z.array(geoMeetingPointSchema).parse(await send(request, '/meeting-points')));

  app.post('/bff/v1/geo/imports/kmz', { onRequest: app.csrfProtection }, async request => {
    requireSession(request);
    const baseUrl = config.GEO_BASE_URL;
    if (!baseUrl) throw new ApiFault(503, 'FEATURE_UNAVAILABLE', 'Esta función está pendiente de un contrato backend disponible.');
    const file = await request.file();
    if (!file || !file.filename?.toLowerCase().endsWith('.kmz')) {
      throw new ApiFault(400, 'INVALID_INPUT', 'Debes adjuntar un archivo .kmz.');
    }
    let buffer: Buffer;
    try {
      buffer = await file.toBuffer();
    } catch {
      throw new ApiFault(413, 'INVALID_INPUT', 'El archivo supera el límite de 20 MB.');
    }
    if (!buffer.length || buffer.length > MAX_KMZ_BYTES) {
      throw new ApiFault(400, 'INVALID_INPUT', 'El archivo está vacío o supera el límite de 20 MB.');
    }
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(buffer)], { type: 'application/vnd.google-earth.kmz' }), file.filename);
    let response: Response;
    try {
      response = await fetch(new URL('/api/v1/imports/kmz', baseUrl), {
        method: 'POST', body: form, signal: AbortSignal.timeout(config.UPSTREAM_TIMEOUT_MS), redirect: 'error',
      });
    } catch {
      throw new ApiFault(503, 'UPSTREAM_UNAVAILABLE', 'El servicio no está disponible.');
    }
    if (response.status === 422) {
      const detail = await response.json().catch(() => null);
      throw new ApiFault(422, 'INVALID_INPUT', (detail as { detail?: string } | null)?.detail ?? 'El archivo no contiene datos válidos.');
    }
    if (response.status === 413 || response.status === 400) throw new ApiFault(400, 'INVALID_INPUT', 'El archivo no es válido.');
    if (!response.ok) throw new ApiFault(502, 'UPSTREAM_ERROR', 'El servicio devolvió un error.');
    return geoImportResultSchema.parse(await response.json());
  });
};
