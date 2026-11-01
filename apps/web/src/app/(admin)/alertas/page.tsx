import { AlertasPage } from '@/features/alertas/pages/AlertasPage';
import { requireAdmin } from '@/server/require-admin';
export default async function Page() { return requireAdmin(<AlertasPage />); }
