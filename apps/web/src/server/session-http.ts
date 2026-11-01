import { capabilitiesSchema, sessionResponseSchema, type Capabilities, type SessionResponse } from '@acb/contracts';
import type { ServerConfig } from './config';

export type ServerState = { session: SessionResponse | null; capabilities: Capabilities | null; unavailable: boolean };
const anonymous: ServerState = { session: null, capabilities: null, unavailable: false };

export const readServerState = async (cookie: string | undefined, config: ServerConfig, fetcher: typeof fetch = fetch): Promise<ServerState> => {
  if (!cookie) return { ...anonymous };
  const read = (path: string) => fetcher(new URL(path, config.BFF_INTERNAL_URL), {
    headers: { cookie, accept: 'application/json' }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000),
  });
  try {
    const response = await read('/bff/v1/auth/session');
    if ([401, 403].includes(response.status)) return { ...anonymous };
    if (!response.ok) return { ...anonymous, unavailable: true };
    const session = sessionResponseSchema.parse(await response.json());
    if (Date.parse(session.expiresAt) <= Date.now()) return { ...anonymous };
    const capabilities = await read('/bff/v1/capabilities');
    if ([401, 403].includes(capabilities.status)) return { ...anonymous };
    if (!capabilities.ok) return { session, capabilities: null, unavailable: true };
    return { session, capabilities: capabilitiesSchema.parse(await capabilities.json()), unavailable: false };
  } catch { return { ...anonymous, unavailable: true }; }
};
