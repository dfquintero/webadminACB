import { Drawer, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { NavList } from '../molecules/NavList';

export const DRAWER_WIDTH = 240;

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{ width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
    >
      <Toolbar><Typography variant="h6" color="primary" fontWeight={700}>ACB Dashboard</Typography></Toolbar>
      <NavList onNavigate={isMobile ? onClose : undefined} />
    </Drawer>
  );
};
