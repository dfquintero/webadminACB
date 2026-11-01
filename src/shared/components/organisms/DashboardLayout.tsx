import { Box, Typography } from '@mui/material';

export const DashboardLayout = ({ title, children }) => (
  <Box>
    <Typography variant="h4" gutterBottom>{title}</Typography>
    {children}
  </Box>
);
