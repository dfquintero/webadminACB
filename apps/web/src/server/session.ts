import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { readServerConfig } from './config';
import { readServerState } from './session-http';

export const getServerState = cache(async () => {
  const jar = await cookies();
  const config = readServerConfig(process.env);
  const name = config.PUBLIC_ORIGIN.startsWith('https://') ? '__Host-acb_session' : 'acb_session_dev';
  const value = jar.get(name)?.value;
  return readServerState(value ? `${name}=${encodeURIComponent(value)}` : undefined, config);
});
