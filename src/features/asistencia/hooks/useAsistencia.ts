import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { asistenciaApi } from '@/shared/api/asistenciaApi';

export const useAsistencia = () => {
  const queryClient = useQueryClient();
  const { data: asistencia, isLoading, error } = useQuery({
    queryKey: ['asistencia'],
    queryFn: asistenciaApi.getAll,
  });
  
  const create = useMutation({ 
    mutationFn: asistenciaApi.create, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asistencia'] }) 
  });
  
  const update = useMutation({ 
    mutationFn: ({ id, data }) => asistenciaApi.update(id, data), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asistencia'] }) 
  });
  
  return { asistencia, isLoading, error, create, update };
};
