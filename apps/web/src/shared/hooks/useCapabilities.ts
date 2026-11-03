import { useQuery } from '@tanstack/react-query';
import { capabilitiesSchema } from '@acb/contracts';
import { apiClient } from '@/shared/api/client';
import { useAuthContext } from '@/shared/providers/AuthContext';

export class FeatureUnavailableError extends Error {
  constructor() {
    super('Esta función está pendiente de un contrato backend disponible. No se muestran datos simulados.');
    this.name = 'FeatureUnavailableError';
  }
}

export const useCapabilities = () => {
  const { isAuthenticated } = useAuthContext();
  return useQuery({
    queryKey: ['capabilities'], enabled: isAuthenticated, staleTime: 60000, retry: false,
    queryFn: async ({ signal }) => capabilitiesSchema.parse((await apiClient.get<unknown>('/capabilities', { signal })).data),
  });
};
