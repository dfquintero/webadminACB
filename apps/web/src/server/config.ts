import { z } from 'zod';

const origin = z.url().refine(value => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash;
}).transform(value => new URL(value).origin);

export const readServerConfig = (environment: Record<string, string | undefined>) => {
  const development = environment.NODE_ENV !== 'production';
  const result = z.object({
    BFF_INTERNAL_URL: development ? origin.default('http://127.0.0.1:3001') : origin,
    PUBLIC_ORIGIN: development ? origin.default('http://localhost:3000') : origin,
  }).safeParse(environment);
  if (!result.success) throw new Error(`Invalid web configuration: ${result.error.issues.map(issue => issue.path.join('.')).join(', ')}`);
  return result.data;
};

export type ServerConfig = ReturnType<typeof readServerConfig>;
