import { AsistenciaPage } from '@/features/asistencia/pages/AsistenciaPage';
import { requireAdmin } from '@/server/require-admin';
export default async function Page() { return requireAdmin(<AsistenciaPage />); }
