import { redirect } from 'next/navigation';
import { getServerState } from '@/server/session';
import { LoginPage } from '@/features/auth/pages/LoginPage';

export default async function Page() {
  const state = await getServerState();
  if (state.session && !state.unavailable) redirect('/');
  return <LoginPage />;
}
