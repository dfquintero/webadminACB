import type { FastifyInstance } from 'fastify';
import { loginInputSchema, sessionResponseSchema, type LoginInput } from '@acb/contracts';
import { ApiFault } from '../../errors.js';
import { requireSession, type AuthenticatedSession } from './session.js';

export type Authenticate = (input: LoginInput) => Promise<AuthenticatedSession>;

export const registerAuthRoutes = async (app: FastifyInstance, authenticate: Authenticate, secure: boolean, adminUsersAvailable = false, geoAvailable = false) => {
  const cookieName = secure ? '__Host-acb_session' : 'acb_session_dev';
  app.get('/bff/v1/auth/csrf', { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } }, async (request, reply) => {
    const token = await reply.generateCsrf();
    await request.session.save();
    return { token };
  });

  app.post('/bff/v1/auth/login', { onRequest: app.csrfProtection, config: { rateLimit: { max: 5, timeWindow: '5 minutes' } } }, async (request, reply) => {
    const input = loginInputSchema.safeParse(request.body);
    if (!input.success) throw new ApiFault(400, 'INVALID_INPUT', 'Revisa el usuario y la contraseña.');
    const authentication = await authenticate(input.data);
    await request.session.regenerate();
    request.session.auth = authentication;
    request.session.cookie.originalMaxAge = null;
    request.session.cookie.expires = new Date(authentication.expiresAt);
    await request.session.save();
    reply.header('cache-control', 'no-store');
    return sessionResponseSchema.parse({ user: authentication.user, expiresAt: new Date(authentication.expiresAt).toISOString() });
  });

  app.get('/bff/v1/auth/session', async request => {
    const authentication = requireSession(request);
    return sessionResponseSchema.parse({ user: authentication.user, expiresAt: new Date(authentication.expiresAt).toISOString() });
  });

  app.post('/bff/v1/auth/logout', { onRequest: app.csrfProtection }, async (request, reply) => {
    await request.session.destroy();
    reply.clearCookie(cookieName, { path: '/', httpOnly: true, secure, sameSite: 'lax' });
    return reply.code(204).send();
  });

  app.get('/bff/v1/capabilities', async request => {
    requireSession(request);
    return { auth: true, estudiantes: adminUsersAvailable, guias: adminUsersAvailable, rutas: geoAvailable, asignaciones: false, asistencia: false, alertas: false, dashboard: false, geo: geoAvailable };
  });
};
