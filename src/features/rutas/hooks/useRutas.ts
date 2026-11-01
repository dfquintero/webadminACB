import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rutaApi } from '@/shared/api/rutaApi';

export const useRutas = () => {
  const queryClient = useQueryClient();
  const { data: rutas, isLoading, error } = useQuery({
    queryKey: ['rutas'],
    queryFn: rutaApi.getAll,
    select: (data) => data.data,
  });
  
  const create = useMutation({ 
    mutationFn: rutaApi.create, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rutas'] }) 
  });
  
  const update = useMutation({ 
    mutationFn: ({ id, data }) => rutaApi.update(id, data), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rutas'] }) 
  });
  
  const remove = useMutation({ 
    mutationFn: rutaApi.delete, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rutas'] }) 
  });
  
  return { rutas, isLoading, error, create, update, remove };
};
