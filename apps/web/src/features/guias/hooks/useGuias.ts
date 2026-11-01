import { guiaApi } from '@/shared/api/guiaApi';
import { useCrud } from '@/shared/hooks/useCrud';

export const useGuias = () => {
  const query = useCrud('guias', guiaApi);
  return { ...query, guias: query.data };
};
