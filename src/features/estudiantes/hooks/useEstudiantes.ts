import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { estudianteApi } from '@/shared/api/estudianteApi';

export const useEstudiantes = () => {
  const queryClient = useQueryClient();
  const { data: estudiantes, isLoading, error } = useQuery({
    queryKey: ['estudiantes'],
    queryFn: estudianteApi.getAll,
    select: (data) => data.data,
  });
  
  const create = useMutation({ 
    mutationFn: estudianteApi.create, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['estudiantes'] }) 
  });
  
  const update = useMutation({ 
    mutationFn: ({ id, data }: { id: string; data: any }) => estudianteApi.update(id, data), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['estudiantes'] }) 
  });
  
  const remove = useMutation({ 
    mutationFn: estudianteApi.delete, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['estudiantes'] }) 
  });
  
  return { estudiantes, isLoading, error, create, update, remove };
};
