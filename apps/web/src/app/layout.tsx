import type { Metadata } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { getServerState } from '@/server/session';
import { AppProviders } from './providers';
import '../index.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Al Colegio en Bici · Administración', description: 'Panel administrativo de Al Colegio en Bici' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const state = await getServerState();
  const query = new QueryClient();
  query.setQueryData(['auth', 'session'], state.session);
  if (state.capabilities) query.setQueryData(['capabilities'], state.capabilities);
  return <html lang="es"><body>
    <AppProviders key={`${state.session?.user.id ?? 'anonymous'}:${state.unavailable}`} state={dehydrate(query)} unavailable={state.unavailable}>{children}</AppProviders>
  </body></html>;
}
