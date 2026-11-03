import { useEstudiantes } from '@/features/estudiantes/hooks/useEstudiantes';
import { useGuias } from '@/features/guias/hooks/useGuias';
import { useRutas } from '@/features/rutas/hooks/useRutas';
import { useAsignaciones } from '@/features/asignaciones/hooks/useAsignaciones';

export const useDashboard = () => {
  const estudiantes = useEstudiantes();
  const rutas = useRutas();
  const guias = useGuias();
  const asignaciones = useAsignaciones();
  const queries = [estudiantes, rutas, guias, asignaciones];
  return {
    estudiantes: estudiantes.data, rutas: rutas.data, guias: guias.data, asignaciones: asignaciones.data,
    isLoading: queries.some(query => query.isLoading), error: queries.find(query => query.error)?.error,
  };
};
