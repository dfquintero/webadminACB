import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ResourceKey } from '@acb/contracts';
import { FeatureUnavailableError, useCapabilities } from './useCapabilities';

type CrudApi<T, Input> = {
  getAll: (signal?: AbortSignal) => Promise<T[]>;
  create: (data: Input) => Promise<void>;
  update: (id: string, data: Input) => Promise<void>;
  delete: (id: string) => Promise<void>;
};

export const useCrud = <T, Input>(key: ResourceKey, api: CrudApi<T, Input>) => {
  const client = useQueryClient();
  const capabilities = useCapabilities();
  const available = capabilities.data?.[key] === true;
  const check = () => { if (!available) throw new FeatureUnavailableError(); };
  const query = useQuery({ queryKey: [key], queryFn: ({ signal }) => api.getAll(signal), enabled: available });
  const invalidate = () => client.invalidateQueries({ queryKey: [key] });
  const create = useMutation({ mutationFn: async (data: Input) => { check(); await api.create(data); }, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Input }) => { check(); await api.update(id, data); },
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: async (id: string) => { check(); await api.delete(id); }, onSuccess: invalidate });
  const error = capabilities.error ?? (capabilities.data && !available ? new FeatureUnavailableError() : query.error);
  return { ...query, isLoading: capabilities.isLoading || query.isLoading, isError: !!error, error, create, update, remove };
};
