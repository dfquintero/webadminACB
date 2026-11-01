'use client';

import { Alert, CircularProgress } from '@mui/material';
import { AsistenciaLayout } from '@/shared/components/organisms/AsistenciaLayout';
import { AsistenciaGrid } from '../components/AsistenciaGrid';
import { useAsistencia } from '../hooks/useAsistencia';
import { useEstudiantes } from '@/features/estudiantes/hooks/useEstudiantes';
import { useAsignaciones } from '@/features/asignaciones/hooks/useAsignaciones';
import { FeatureUnavailableError } from '@/shared/hooks/useCapabilities';

export const AsistenciaPage = () => {
  const asistencia = useAsistencia();
  const estudiantes = useEstudiantes();
  const asignaciones = useAsignaciones();
  const queries = [asistencia, estudiantes, asignaciones];
  const error = queries.find(query => query.error)?.error;
  return <AsistenciaLayout title="Control de Asistencia">
    {queries.some(item => item.isLoading) ? <CircularProgress aria-label="Cargando asistencia" /> : queries.some(item => item.error) ?
      <Alert severity={error instanceof FeatureUnavailableError ? 'info' : 'error'}>{error instanceof FeatureUnavailableError ? error.message : 'No se pudo cargar la asistencia o sus datos relacionados.'}</Alert> : !asignaciones.asignaciones?.length ?
      <Alert severity="info">No hay asignaciones disponibles.</Alert> : asignaciones.asignaciones.map(asignacion => (
        <AsistenciaGrid key={asignacion.id} asignacion={asignacion} estudiantes={estudiantes.estudiantes ?? []} asistencia={asistencia.asistencia ?? []} onUpdate={asistencia.update.mutateAsync} />
      ))}
  </AsistenciaLayout>;
};
