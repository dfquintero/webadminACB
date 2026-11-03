import { Box, Drawer, Typography, useMediaQuery, useTheme } from '@mui/material';
import { NavList } from '../molecules/NavList';

export const DRAWER_WIDTH = 248;

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return <Drawer variant={isMobile ? 'temporary' : 'permanent'} open={isMobile ? open : true} onClose={onClose}
    sx={{ display: { xs: isMobile ? 'block' : 'none', md: 'block' }, width: { xs: 0, md: DRAWER_WIDTH }, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', top: 56, height: 'calc(100% - 56px)', borderRight: '1px solid', borderColor: 'divider' } }}>
    <Box sx={{ px: 3, pt: 3, pb: 1.5 }}><Typography sx={{ color: 'text.secondary', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Panel administrativo</Typography></Box>
    <NavList onNavigate={isMobile ? onClose : undefined} />
  </Drawer>;
};
