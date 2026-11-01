import { Box, Typography } from '@mui/material';

export const FormSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {title && <Typography variant="h6">{title}</Typography>}
    {children}
  </Box>
);
