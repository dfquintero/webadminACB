import { requireAdmin } from '@/server/require-admin';
import { AppLayout } from '@/shared/components/organisms/AppLayout';
import { ProtectedRoute } from '@/shared/providers/ProtectedRoute';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return requireAdmin(<ProtectedRoute><AppLayout>{children}</AppLayout></ProtectedRoute>);
}
