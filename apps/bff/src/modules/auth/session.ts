import { z } from 'zod';
import { sessionUserSchema } from '@acb/contracts';
import type { SessionUser } from '@acb/contracts';
import type { FastifyRequest } from 'fastify';
import { ApiFault } from '../../errors.js';

export const authenticatedSessionSchema = z.object({
  token: z.string().min(1).max(16384),
  user: sessionUserSchema,
  expiresAt: z.number().int().positive(),
});

export type AuthenticatedSession = { token: string; user: SessionUser; expiresAt: number };

declare module 'fastify' {
  interface Session {
    auth?: AuthenticatedSession;
    _csrf?: string;
  }
}

export const requireSession = (request: FastifyRequest): AuthenticatedSession => {
  const parsed = authenticatedSessionSchema.safeParse(request.session.auth);
  if (!parsed.success || parsed.data.expiresAt <= Date.now()) {
    throw new ApiFault(401, 'SESSION_REQUIRED', 'Inicia sesión para continuar.');
  }
  return parsed.data;
};
