import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { navItems } from '../../config/navItems';

export const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
  <List>
    {navItems.map(({ path, label, icon: Icon }) => (
      <ListItemButton
        key={path}
        component={RouterNavLink}
        to={path}
        end={path === '/'}
        onClick={onNavigate}
        sx={{ '&.active': { bgcolor: 'primary.light', '& .MuiListItemIcon-root': { color: 'primary.main' } } }}
      >
        <ListItemIcon><Icon /></ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    ))}
  </List>
);
