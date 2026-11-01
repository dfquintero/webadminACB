import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guiaApi } from '@/shared/api/guiaApi';

export const useGuias = () => {
  const queryClient = useQueryClient();
  const { data: guias, isLoading, error } = useQuery({
    queryKey: ['guias'],
    queryFn: guiaApi.getAll,
    select: (data) => data.data,
  });
  
  const create = useMutation({ 
    mutationFn: guiaApi.create, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guias'] }) 
  });
  
  const update = useMutation({ 
    mutationFn: ({ id, data }) => guiaApi.update(id, data), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guias'] }) 
  });
  
  const remove = useMutation({ 
    mutationFn: guiaApi.delete, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guias'] }) 
  });
  
  return { guias, isLoading, error, create, update, remove };
};
