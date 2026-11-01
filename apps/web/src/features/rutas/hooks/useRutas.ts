import { rutaApi } from '@/shared/api/rutaApi';
import { useCrud } from '@/shared/hooks/useCrud';

export const useRutas = () => {
  const query = useCrud('rutas', rutaApi);
  return { ...query, rutas: query.data };
};
