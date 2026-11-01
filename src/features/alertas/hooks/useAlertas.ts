import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertaApi } from '@/shared/api/alertaApi';

export const useAlertas = () => {
  const queryClient = useQueryClient();
  const { data: alertas, isLoading, error } = useQuery({
    queryKey: ['alertas'],
    queryFn: alertaApi.getAll,
  });
  
  const create = useMutation({ 
    mutationFn: alertaApi.create, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alertas'] }) 
  });
  
  const update = useMutation({ 
    mutationFn: ({ id, data }) => alertaApi.update(id, data), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alertas'] }) 
  });
  
  return { alertas, isLoading, error, create, update };
};
