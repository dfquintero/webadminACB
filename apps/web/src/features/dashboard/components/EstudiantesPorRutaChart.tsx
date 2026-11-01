import { Grid } from '@mui/material';
import { ChartCard } from '@/shared/components/organisms/ChartCard';
import { BarChart, Bar } from 'recharts';

export const EstudiantesPorRutaChart = ({ data }: { data: { name: string; value: number }[] }) => (
  <Grid size={{ xs: 12, md: 4 }}>
    <ChartCard title="Estudiantes por Ruta" height={300}>
      <BarChart data={data}>
        <Bar dataKey="value" fill="#4CAF50" />
      </BarChart>
    </ChartCard>
  </Grid>
);
