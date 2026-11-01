import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, Logout } from '@mui/icons-material';
import { useAuthContext } from '@/shared/providers/AuthContext';

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user, logout } = useAuthContext();

  return (
    <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>Rutas Escolares</Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>{user?.nombre} {user?.apellido}</Typography>
        <IconButton color="inherit" onClick={logout} title="Cerrar sesión"><Logout /></IconButton>
      </Toolbar>
    </AppBar>
  );
};
