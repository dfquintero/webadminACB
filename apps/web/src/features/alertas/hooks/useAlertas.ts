import { alertaApi } from '@/shared/api/alertaApi';
import { useCrud } from '@/shared/hooks/useCrud';

export const useAlertas = () => {
  const query = useCrud('alertas', alertaApi);
  return { ...query, alertas: query.data };
};
