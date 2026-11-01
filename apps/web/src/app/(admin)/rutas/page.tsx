import { RutasPage } from '@/features/rutas/pages/RutasPage';
import { requireAdmin } from '@/server/require-admin';
export default async function Page() { return requireAdmin(<RutasPage />); }
