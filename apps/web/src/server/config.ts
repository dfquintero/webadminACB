import { z } from 'zod';

const origin = z.url().refine(value => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash;
}).transform(value => new URL(value).origin);

// Optional: when unset, the session cookie uses a scheme-neutral name so the
// same deployment works over HTTP on the LAN and HTTPS through a tunnel.
const optionalOrigin = z.preprocess(
  value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  origin.optional(),
);

export const readServerConfig = (environment: Record<string, string | undefined>) => {
  const development = environment.NODE_ENV !== 'production';
  const result = z.object({
    BFF_INTERNAL_URL: development ? origin.default('http://127.0.0.1:3001') : origin,
    PUBLIC_ORIGIN: optionalOrigin,
  }).safeParse(environment);
  if (!result.success) throw new Error(`Invalid web configuration: ${result.error.issues.map(issue => issue.path.join('.')).join(', ')}`);
  return result.data;
};

export type ServerConfig = ReturnType<typeof readServerConfig>;
