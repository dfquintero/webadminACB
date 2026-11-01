import { Card, CardContent, Typography } from '@mui/material';
import { ResponsiveContainer } from 'recharts';

export const ChartCard = ({ title, children, height = 300 }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
