import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { requireAdmin } from '@/server/require-admin';
export default async function Page() { return requireAdmin(<DashboardPage />); }
