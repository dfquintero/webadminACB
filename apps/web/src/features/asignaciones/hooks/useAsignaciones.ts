import { asignacionApi } from '@/shared/api/asignacionApi';
import { useCrud } from '@/shared/hooks/useCrud';

export const useAsignaciones = () => {
  const query = useCrud('asignaciones', asignacionApi);
  return { ...query, asignaciones: query.data };
};
