import { useQuery } from '@tanstack/react-query';
import { estudianteApi, rutaApi, guiaApi, asignacionApi } from '@/shared/api';

export const useDashboard = () => {
  const { data: estudiantes } = useQuery({ queryKey: ['estudiantes'], queryFn: estudianteApi.getAll });
  const { data: rutas } = useQuery({ queryKey: ['rutas'], queryFn: rutaApi.getAll });
  const { data: guias } = useQuery({ queryKey: ['guias'], queryFn: guiaApi.getAll });
  const { data: asignaciones } = useQuery({ queryKey: ['asignaciones'], queryFn: asignacionApi.getAll });
  
  const today = new Date().toISOString().split('T')[0];
  const asignacionesHoy = asignaciones?.filter(a => a.fecha === today) || [];
  const rutasActivas = asignacionesHoy?.filter(a => a.estado === 'en_curso').length || 0;
  
  return { estudiantes, rutas, guias, asignacionesHoy, rutasActivas };
};
