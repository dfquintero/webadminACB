import { z } from 'zod';

const origin = z.url().refine(value => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash;
}).transform(value => new URL(value).origin);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  PUBLIC_ORIGIN: origin,
  AUTH_BASE_URL: origin,
  ADMIN_USERS_BASE_URL: origin.optional(),
  REDIS_URL: z.url().refine(value => URL.canParse(value) && ['redis:', 'rediss:'].includes(new URL(value).protocol)),
  SESSION_SIGNING_SECRET: z.string().min(48).max(256),
  SESSION_ENCRYPTION_KEY: z.string().regex(/^[A-Za-z0-9_-]+$/).refine(value => Buffer.from(value, 'base64url').length === 32),
  SESSION_TTL_SECONDS: z.coerce.number().int().min(60).max(28800).default(3600),
  UPSTREAM_TIMEOUT_MS: z.coerce.number().int().min(100).max(30000).default(8000),
  TRUSTED_PROXY: z.string().min(1).optional(),
}).superRefine((value, context) => {
  if (value.NODE_ENV === 'production' && !value.PUBLIC_ORIGIN.startsWith('https://')) {
    context.addIssue({ code: 'custom', path: ['PUBLIC_ORIGIN'], message: 'HTTPS required' });
  }
  if (value.TRUSTED_PROXY === 'true' || value.TRUSTED_PROXY === '*') {
    context.addIssue({ code: 'custom', path: ['TRUSTED_PROXY'], message: 'Explicit proxy addresses required' });
  }
});

export type BffConfig = z.infer<typeof schema>;

export const readConfig = (environment: NodeJS.ProcessEnv): BffConfig => {
  const result = schema.safeParse(environment);
  if (!result.success) throw new Error(`Invalid BFF configuration: ${[...new Set(result.error.issues.map(issue => issue.path.join('.')))].join(', ')}`);
  return result.data;
};
