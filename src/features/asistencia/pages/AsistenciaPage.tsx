import { AsistenciaLayout } from '@/shared/components/organisms/AsistenciaLayout';
import { AsistenciaGrid } from '../components/AsistenciaGrid';
import { useAsistencia } from '../hooks/useAsistencia';
import { useEstudiantes } from '@/features/estudiantes/hooks/useEstudiantes';
import { useAsignaciones } from '@/features/asignaciones/hooks/useAsignaciones';
import { CircularProgress } from '@mui/material';

export const AsistenciaPage = () => {
  const { asistencia, isLoading, update } = useAsistencia();
  const { estudiantes } = useEstudiantes();
  const { asignaciones } = useAsignaciones();
  
  if (isLoading) return <CircularProgress />;
  
  return (
    <AsistenciaLayout title="Control de Asistencia">
      {asignaciones?.map(asignacion => (
        <AsistenciaGrid key={asignacion.id} asignacion={asignacion} estudiantes={estudiantes} asistencia={asistencia} onUpdate={update.mutate} />
      ))}
    </AsistenciaLayout>
  );
}
