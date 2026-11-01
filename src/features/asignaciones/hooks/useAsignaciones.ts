import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { asignacionApi } from '@/shared/api/asignacionApi';

export const useAsignaciones = () => {
  const queryClient = useQueryClient();
  const { data: asignaciones, isLoading, error } = useQuery({
    queryKey: ['asignaciones'],
    queryFn: asignacionApi.getAll,
    select: (data) => data.data,
  });
  
  const create = useMutation({ 
    mutationFn: asignacionApi.create, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asignaciones'] }) 
  });
  
  const update = useMutation({ 
    mutationFn: ({ id, data }) => asignacionApi.update(id, data), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asignaciones'] }) 
  });
  
  const remove = useMutation({ 
    mutationFn: asignacionApi.delete, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asignaciones'] }) 
  });
  
  return { asignaciones, isLoading, error, create, update, remove };
};
