import { asistenciaApi } from '@/shared/api/asistenciaApi';
import { useCrud } from '@/shared/hooks/useCrud';

export const useAsistencia = () => {
  const query = useCrud('asistencia', asistenciaApi);
  return { ...query, asistencia: query.data };
};
