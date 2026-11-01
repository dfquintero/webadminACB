import { randomBytes } from 'node:crypto';
import { MemoryStore } from '@fastify/session';
import { readConfig } from '../src/config.js';
import type { AuthenticatedSession } from '../src/modules/auth/session.js';

export const testConfig = (extra: NodeJS.ProcessEnv = {}) => readConfig({
  NODE_ENV: 'test', PUBLIC_ORIGIN: 'http://localhost:5173', AUTH_BASE_URL: 'http://auth.test', REDIS_URL: 'redis://localhost:6379',
  SESSION_SIGNING_SECRET: randomBytes(48).toString('base64url'), SESSION_ENCRYPTION_KEY: randomBytes(32).toString('base64url'), ...extra,
});

export const authentication = (name = 'Test Manager', id = '1'): AuthenticatedSession => ({
  token: 'backend-token-never-public', user: { id, name, role: 'MANAGER', zone: null }, expiresAt: Date.now() + 60000,
});

export const testStore = () => new MemoryStore();
