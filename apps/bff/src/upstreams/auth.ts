import { z } from 'zod';
import { decodeJwt } from 'jose';
import { sessionUserSchema, type LoginInput } from '@acb/contracts';
import type { BffConfig } from '../config.js';
import { ApiFault } from '../errors.js';
import type { AuthenticatedSession } from '../modules/auth/session.js';

const responseSchema = z.object({
  token: z.string().min(1).max(16384),
  user: z.object({ id: z.union([z.string().min(1), z.number().int().nonnegative()]), name: z.string().min(1), role: z.string(), zone: z.string().nullable() }),
});

export const createAuthClient = (config: BffConfig, fetcher: typeof fetch = fetch) => async (input: LoginInput): Promise<AuthenticatedSession> => {
  try {
    const response = await fetcher(new URL('/api/v1/auth/login', config.AUTH_BASE_URL), {
      method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(input), signal: AbortSignal.timeout(config.UPSTREAM_TIMEOUT_MS), redirect: 'error',
    });
    if ([400, 401].includes(response.status)) throw new ApiFault(401, 'INVALID_CREDENTIALS', 'Usuario o contraseña incorrectos.');
    if (response.status === 403) throw new ApiFault(403, 'ACCESS_DENIED', 'No tienes acceso a este panel.');
    if (response.status === 429) throw new ApiFault(429, 'LOGIN_RATE_LIMIT', 'Demasiados intentos. Inténtalo más tarde.');
    if (response.status >= 500) throw new ApiFault(503, 'AUTH_UNAVAILABLE', 'El servicio de autenticación no está disponible.');
    if (!response.ok) throw new ApiFault(502, 'INVALID_UPSTREAM_RESPONSE', 'El servicio devolvió una respuesta no válida.');
    const result = responseSchema.safeParse(await response.json());
    if (!result.success) throw new ApiFault(502, 'INVALID_UPSTREAM_RESPONSE', 'El servicio devolvió una respuesta no válida.');
    if (result.data.user.role !== 'MANAGER') throw new ApiFault(403, 'MANAGER_REQUIRED', 'Este panel es exclusivo para MANAGER.');
    const user = sessionUserSchema.parse(result.data.user);
    const claims = decodeJwt(result.data.token);
    if (typeof claims.exp !== 'number' || !Number.isSafeInteger(claims.exp)) throw new ApiFault(502, 'INVALID_UPSTREAM_RESPONSE', 'El servicio devolvió una respuesta no válida.');
    const expiresAt = Math.min(claims.exp * 1000, Date.now() + config.SESSION_TTL_SECONDS * 1000);
    if (expiresAt <= Date.now()) throw new ApiFault(401, 'SESSION_EXPIRED', 'La sesión ha expirado.');
    return { token: result.data.token, user, expiresAt };
  } catch (error) {
    if (error instanceof ApiFault) throw error;
    if (error instanceof SyntaxError || error instanceof z.ZodError || (error instanceof Error && error.name.startsWith('JWT'))) {
      throw new ApiFault(502, 'INVALID_UPSTREAM_RESPONSE', 'El servicio devolvió una respuesta no válida.');
    }
    if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) throw new ApiFault(504, 'AUTH_TIMEOUT', 'El servicio de autenticación tardó demasiado.');
    throw new ApiFault(503, 'AUTH_UNAVAILABLE', 'El servicio de autenticación no está disponible.');
  }
};
