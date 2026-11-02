import { Alert, CircularProgress, Grid } from '@mui/material';
import { KPICard } from '@/shared/components/organisms/KPICard';
import { DirectionsBike, People, CheckCircle, AccessTime } from '@mui/icons-material';
import { useDashboard } from '../hooks/useDashboard';
import { FeatureUnavailableError } from '@/shared/hooks/useCapabilities';

export const KPICards = () => {
  const { estudiantes, guias, asignaciones, isLoading, error } = useDashboard();
  if (isLoading) return <CircularProgress aria-label="Cargando métricas" />;
  if (error) return <Alert severity={error instanceof FeatureUnavailableError ? 'info' : 'error'}>{error instanceof FeatureUnavailableError ? error.message : 'No se pudieron cargar las métricas. Comprueba la disponibilidad del BFF.'}</Alert>;
  const kpis = [
    { title: 'Asignaciones en curso', value: asignaciones?.filter(item => item.estado === 'en_curso').length ?? 'No disponible', icon: <DirectionsBike />, color: 'primary.main' },
    { title: 'Estudiantes', value: estudiantes?.length ?? 'No disponible', icon: <People />, color: 'secondary.main' },
    { title: 'Guías', value: guias?.length ?? 'No disponible', icon: <CheckCircle />, color: 'warning.main' },
    { title: 'Tiempo promedio', value: 'No disponible', icon: <AccessTime />, color: 'primary.dark' },
  ];
  return <Grid container spacing={3}>{kpis.map(kpi => (
    <Grid key={kpi.title} size={{ xs: 12, sm: 6, md: 3 }}><KPICard {...kpi} /></Grid>
  ))}</Grid>;
};
