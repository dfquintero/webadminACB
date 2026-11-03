import { GuiasPage } from '@/features/guias/pages/GuiasPage';
import { requireAdmin } from '@/server/require-admin';
export default async function Page() { return requireAdmin(<GuiasPage />); }
