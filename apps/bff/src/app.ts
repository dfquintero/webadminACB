import Fastify, { LogController } from 'fastify';
import cookie from '@fastify/cookie';
import session, { type SessionStore } from '@fastify/session';
import csrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import type { Redis } from 'ioredis';
import type { BffConfig } from './config.js';
import { ApiFault } from './errors.js';
import { registerAuthRoutes, type Authenticate } from './modules/auth/routes.js';
import { registerAdminUsersRoutes } from './modules/admin-users/routes.js';
import { createUpstream } from './upstreams/http.js';

type Dependencies = { store: SessionStore; authenticate: Authenticate; ready: () => Promise<boolean>; redis?: Redis; close?: () => Promise<void> };

export const buildApp = async (config: BffConfig, dependencies: Dependencies) => {
  const secure = config.PUBLIC_ORIGIN.startsWith('https://');
  const app = Fastify({
    bodyLimit: 16384, requestTimeout: 15000, trustProxy: config.TRUSTED_PROXY?.split(',').map(value => value.trim()) ?? false,
    logController: new LogController({ disableRequestLogging: true }),
    logger: config.NODE_ENV === 'test' ? false : { redact: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'] },
  });

  app.setErrorHandler((error, request, reply) => {
    const fault = error instanceof ApiFault ? error : null;
    const frameworkStatus = error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : 500;
    const status = fault?.statusCode ?? ([400, 403, 413, 415, 429].includes(frameworkStatus) ? frameworkStatus : 500);
    const codes: Record<number, string> = { 400: 'INVALID_REQUEST', 403: 'CSRF_REJECTED', 413: 'BODY_TOO_LARGE', 415: 'UNSUPPORTED_MEDIA_TYPE', 429: 'RATE_LIMITED' };
    const code = fault?.code ?? codes[status] ?? 'INTERNAL_ERROR';
    return reply.code(status).send({ error: { code, message: fault?.message ?? 'No se pudo procesar la solicitud.', requestId: request.id } });
  });
  app.setNotFoundHandler((request, reply) => reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'La operación no está disponible.', requestId: request.id } }));
  app.addHook('onRequest', async request => {
    if (!request.url.startsWith('/bff/')) return;
    const origin = request.headers.origin;
    const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
    if (request.headers['sec-fetch-site'] === 'cross-site' || (origin && origin !== config.PUBLIC_ORIGIN) || (mutation && origin !== config.PUBLIC_ORIGIN)) {
      throw new ApiFault(403, 'ORIGIN_REJECTED', 'El origen de la solicitud no está permitido.');
    }
  });
  app.addHook('onSend', async (_request, reply, payload) => { reply.header('cache-control', 'no-store'); return payload; });
  app.addHook('onResponse', async (request, reply) => { app.log.info({ route: request.routeOptions.url ?? 'unknown', status: reply.statusCode, requestId: request.id }, 'request completed'); });
  if (dependencies.close) app.addHook('onClose', dependencies.close);

  await app.register(helmet);
  await app.register(cookie);
  await app.register(session, {
    secret: config.SESSION_SIGNING_SECRET, cookieName: secure ? '__Host-acb_session' : 'acb_session_dev',
    cookie: { path: '/', httpOnly: true, sameSite: 'lax', secure, maxAge: 600000 },
    store: dependencies.store, saveUninitialized: false, rolling: false,
  });
  await app.register(csrf, { sessionPlugin: '@fastify/session', getToken: request => String(request.headers['x-csrf-token'] ?? ''), logLevel: 'warn' });
  await app.register(rateLimit, { global: false, redis: dependencies.redis, skipOnError: false });

  app.get('/health/live', async () => ({ status: 'ok' }));
  app.get('/health/ready', async (_request, reply) => {
    const ready = await dependencies.ready().catch(() => false);
    return reply.code(ready ? 200 : 503).send({ status: ready ? 'ready' : 'unavailable' });
  });
  await registerAuthRoutes(app, dependencies.authenticate, secure, config.ADMIN_USERS_BASE_URL !== undefined);
  await registerAdminUsersRoutes(app, createUpstream(config.ADMIN_USERS_BASE_URL, config));
  return app;
};
