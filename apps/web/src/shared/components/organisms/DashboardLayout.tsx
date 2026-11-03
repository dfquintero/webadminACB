import { Box, Typography } from '@mui/material';

export const DashboardLayout = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box>
    <Typography variant="h4" gutterBottom>{title}</Typography>
    {children}
  </Box>
);
