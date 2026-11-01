import { Grid } from '@mui/material';
import { useDashboard } from '../hooks/useDashboard';
import { EstudiantesPorRutaChart } from './EstudiantesPorRutaChart';
import { AsistenciaSemanalChart } from './AsistenciaSemanalChart';

export const Charts = () => {
  const { estudiantes, rutas } = useDashboard();
  
  const estudiantesPorRuta = rutas?.map(r => ({ name: r.nombre, value: estudiantes?.filter(e => e.rutaId === r.id).length || 0 })) || [];
  const asistenciaSemanal = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map(dia => ({ name: dia, recogidos: Math.floor(Math.random() * 20) + 10, noAsistio: Math.floor(Math.random() * 5) }));
  
  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      <EstudiantesPorRutaChart data={estudiantesPorRuta} />
      <AsistenciaSemanalChart data={asistenciaSemanal} />
    </Grid>
  );
};
