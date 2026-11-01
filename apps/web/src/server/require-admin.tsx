import 'server-only';
import { redirect } from 'next/navigation';
import { getServerState } from './session';
import { ServiceUnavailable } from '@/shared/components/molecules/ServiceUnavailable';

export const requireAdmin = async (content: React.ReactNode) => {
  const state = await getServerState();
  if (state.unavailable) return <ServiceUnavailable />;
  if (!state.session) redirect('/login');
  return content;
};
