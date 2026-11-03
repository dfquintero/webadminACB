import { useQuery } from '@tanstack/react-query';
import { rutaApi } from '@/shared/api/rutaApi';
import { FeatureUnavailableError, useCapabilities } from '@/shared/hooks/useCapabilities';

export const useRutas = () => {
  const capabilities = useCapabilities();
  const available = capabilities.data?.rutas === true;
  const query = useQuery({ queryKey: ['rutas'], queryFn: ({ signal }) => rutaApi.getAll(signal), enabled: available });
  const error = capabilities.error ?? (capabilities.data && !available ? new FeatureUnavailableError() : query.error);
  return { ...query, isLoading: capabilities.isLoading || query.isLoading, error, rutas: query.data };
};
