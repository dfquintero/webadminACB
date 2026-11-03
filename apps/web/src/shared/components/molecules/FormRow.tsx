import { Box } from '@mui/material';

export const FormRow = ({ children, gap = 2 }: { children: React.ReactNode; gap?: number }) => (
  <Box sx={{ display: 'flex', gap, alignItems: 'flex-start' }}>{children}</Box>
);
