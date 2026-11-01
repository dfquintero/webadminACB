import { estudianteApi } from '@/shared/api/estudianteApi';
import { useCrud } from '@/shared/hooks/useCrud';

export const useEstudiantes = () => {
  const query = useCrud('estudiantes', estudianteApi);
  return { ...query, estudiantes: query.data };
};
