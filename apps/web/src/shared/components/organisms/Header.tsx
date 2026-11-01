import { Alert, AppBar, Box, Button, Toolbar, Typography, IconButton, Snackbar } from '@mui/material';
import { Menu as MenuIcon, Logout, DirectionsBike } from '@mui/icons-material';
import { useAuthContext } from '@/shared/providers/AuthContext';
import { useLogout } from '@/features/auth/hooks/useLogout';

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user } = useAuthContext();
  const logout = useLogout();
  return <>
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#10151c', zIndex: t => t.zIndex.drawer + 1 }}>
      <Toolbar sx={{ minHeight: '56px !important', gap: 1.5 }}>
        <IconButton aria-label="Abrir menú" color="inherit" edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}><MenuIcon /></IconButton>
        <Box sx={{ display: 'grid', placeItems: 'center', bgcolor: 'primary.main', borderRadius: '4px', width: 36, height: 36, flexShrink: 0 }}><DirectionsBike /></Box>
        <Typography sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>Al Colegio en Bici</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ textAlign: 'right', minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: '.9375rem', maxWidth: { xs: 130, sm: 260 } }}>{user?.name}</Typography>
          <Typography sx={{ color: '#c8d0da', fontSize: '.8125rem' }}>Administración{user?.zone ? ` · ${user.zone}` : ''}</Typography>
        </Box>
        <Button color="inherit" onClick={() => logout.mutate()} disabled={logout.isPending} startIcon={<Logout />} sx={{ border: '2px solid #5b6574', px: 1.5, ml: 1, '&:hover': { borderColor: '#fff' } }}>{logout.isPending ? 'Saliendo…' : 'Salir'}</Button>
      </Toolbar>
    </AppBar>
    <Snackbar open={logout.isError} onClose={() => logout.reset()}><Alert severity="error">No se pudo cerrar la sesión. Inténtalo de nuevo.</Alert></Snackbar>
  </>;
};
