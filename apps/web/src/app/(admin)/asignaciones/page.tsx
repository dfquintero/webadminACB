import { AsignacionesPage } from '@/features/asignaciones/pages/AsignacionesPage';
import { requireAdmin } from '@/server/require-admin';
export default async function Page() { return requireAdmin(<AsignacionesPage />); }
