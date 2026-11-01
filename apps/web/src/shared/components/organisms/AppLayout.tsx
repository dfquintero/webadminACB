'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Sidebar, DRAWER_WIDTH } from './Sidebar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
    <Header onMenuClick={() => setOpen(true)} />
    <Sidebar open={open} onClose={() => setOpen(false)} />
    <Box component="main" sx={{ flexGrow: 1, minWidth: 0, pt: '56px', width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 2, sm: 3, lg: 4 } }}>{children}</Box>
    </Box>
  </Box>;
};
