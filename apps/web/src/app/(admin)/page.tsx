import { InicioPage } from '@/features/inicio/pages/InicioPage';
import { requireAdmin } from '@/server/require-admin';
export default async function Page() { return requireAdmin(<InicioPage />); }
