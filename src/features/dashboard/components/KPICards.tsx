import { Grid } from '@mui/material';
import { KPICard } from '@/shared/components/organisms/KPICard';
import { DirectionsBike, People, CheckCircle, AccessTime } from '@mui/icons-material';
import { useDashboard } from '../hooks/useDashboard';

export const KPICards = () => {
  const { estudiantes, rutasActivas } = useDashboard();
  
  const kpis = [
    { title: 'Rutas Activas', value: rutasActivas, icon: <DirectionsBike />, color: 'primary.main' },
    { title: 'Estudiantes', value: estudiantes?.length || 0, icon: <People />, color: 'secondary.main' },
    { title: 'Guías Activos', value: '??', icon: <CheckCircle />, color: 'warning.main' },
    { title: 'Tiempo Promedio', value: '??', icon: <AccessTime />, color: 'primary.dark' },
  ];
  
  return (
    <Grid container spacing={3}>
      {kpis.map((kpi, i) => (
        <Grid key={i} size={{ xs: 12, sm:6, md:3 }}>
          <KPICard title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />
        </Grid>
      ))}
    </Grid>
  );
};
