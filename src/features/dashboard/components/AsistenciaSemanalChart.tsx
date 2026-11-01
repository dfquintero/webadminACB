import { Grid } from '@mui/material';
import { ChartCard } from '@/shared/components/organisms/ChartCard';
import { LineChart, Line } from 'recharts';

export const AsistenciaSemanalChart = ({ data }) => (
  <Grid size={{ xs: 12, md: 4 }}>
    <ChartCard title="Asistencia Semanal" height={300}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="recogidos" stroke="#4CAF50" />
        <Line type="monotone" dataKey="noAsistio" stroke="#F44336" />
      </LineChart>
    </ChartCard>
  </Grid>
);
