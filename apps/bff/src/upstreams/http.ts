import type { BffConfig } from '../config.js';
import { ApiFault } from '../errors.js';
import type { AuthenticatedSession } from '../modules/auth/session.js';

export type UpstreamCall = (method: string, path: string, body?: unknown, session?: AuthenticatedSession) => Promise<unknown>;

export const createUpstream = (baseUrl: string | undefined, config: BffConfig, fetcher: typeof fetch = fetch): UpstreamCall => {
  return async (method, path, body, session) => {
    if (!baseUrl) throw new ApiFault(503, 'FEATURE_UNAVAILABLE', 'Esta función está pendiente de un contrato backend disponible.');
    let response: Response;
    try {
      response = await fetcher(new URL(path, baseUrl), {
        method,
        headers: {
          accept: 'application/json',
          ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
          ...(session ? { authorization: `Bearer ${session.token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(config.UPSTREAM_TIMEOUT_MS),
        redirect: 'error',
      });
    } catch (error) {
      if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) {
        throw new ApiFault(504, 'UPSTREAM_TIMEOUT', 'El servicio tardó demasiado en responder.');
      }
      throw new ApiFault(503, 'UPSTREAM_UNAVAILABLE', 'El servicio no está disponible.');
    }
    if (response.status === 401) throw new ApiFault(401, 'SESSION_EXPIRED', 'La sesión ha expirado. Inicia sesión de nuevo.');
    if (response.status === 403) throw new ApiFault(403, 'ACCESS_DENIED', 'No tienes acceso a esta operación.');
    if (response.status === 404) throw new ApiFault(404, 'NOT_FOUND', 'El recurso no existe.');
    if (response.status === 409) throw new ApiFault(409, 'CONFLICT', 'La operación está en conflicto con datos existentes.');
    if (response.status === 422 || response.status === 400) throw new ApiFault(400, 'INVALID_INPUT', 'Revisa los datos enviados.');
    if (response.status >= 500) throw new ApiFault(502, 'UPSTREAM_ERROR', 'El servicio devolvió un error.');
    if (response.status === 204) return null;
    try {
      return await response.json();
    } catch {
      throw new ApiFault(502, 'INVALID_UPSTREAM_RESPONSE', 'El servicio devolvió una respuesta no válida.');
    }
  };
};
