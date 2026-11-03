import { EncryptJWT, jwtDecrypt } from 'jose';
import { z } from 'zod';
import type { Session } from 'fastify';
import type { SessionStore } from '@fastify/session';
import { storageUnavailable } from '../errors.js';
import { authenticatedSessionSchema } from '../modules/auth/session.js';

const storedSessionSchema = z.object({
  cookie: z.object({
    originalMaxAge: z.number().nullable(),
    expires: z.string().datetime().nullable().optional().transform(value => value ? new Date(value) : null),
  }).passthrough(),
  auth: authenticatedSessionSchema.optional(),
  _csrf: z.string().optional(),
});

type RedisSessionClient = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode: 'PX', ttl: number): Promise<unknown>;
  del(key: string): Promise<number>;
};

export const createSessionStore = (redis: RedisSessionClient, encryptionKey: string): SessionStore => {
  const key = Buffer.from(encryptionKey, 'base64url');
  const prefix = 'acb:bff:session:';
  return {
    set(sessionId, session: Session, callback) {
      const expiresAt = Math.min(session.auth?.expiresAt ?? Date.now() + 600000, session.cookie.expires?.getTime() ?? Date.now() + 600000);
      const persist = async () => {
        if (expiresAt <= Date.now()) { await redis.del(prefix + sessionId); return; }
        const sealed = await new EncryptJWT({ sessionId, data: JSON.stringify(session) })
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }).setAudience('acb-bff-session')
          .setIssuedAt().setExpirationTime(Math.floor(expiresAt / 1000)).encrypt(key);
        await redis.set(prefix + sessionId, sealed, 'PX', Math.max(1, expiresAt - Date.now()));
      };
      void persist().then(() => callback()).catch(() => callback(storageUnavailable()));
    },
    get(sessionId, callback) {
      const load = async (): Promise<Session | null> => {
        const value = await redis.get(prefix + sessionId);
        if (!value) return null;
        try {
          const { payload } = await jwtDecrypt(value, key, { audience: 'acb-bff-session', keyManagementAlgorithms: ['dir'], contentEncryptionAlgorithms: ['A256GCM'] });
          if (payload.sessionId !== sessionId || typeof payload.data !== 'string') return null;
          const parsed = storedSessionSchema.safeParse(JSON.parse(payload.data));
          if (!parsed.success || (parsed.data.auth && parsed.data.auth.expiresAt <= Date.now())) return null;
          return parsed.data;
        } catch { return null; }
      };
      void load().then(value => callback(null, value)).catch(() => callback(storageUnavailable()));
    },
    destroy(sessionId, callback) {
      void redis.del(prefix + sessionId).then(() => callback()).catch(() => callback(storageUnavailable()));
    },
  };
};
