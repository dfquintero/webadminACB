import { EstudiantesPage } from '@/features/estudiantes/pages/EstudiantesPage';
import { requireAdmin } from '@/server/require-admin';
export default async function Page() { return requireAdmin(<EstudiantesPage />); }
