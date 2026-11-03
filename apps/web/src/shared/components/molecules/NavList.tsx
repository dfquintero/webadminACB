'use client';

import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '../../config/navItems';

export const NavList = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  return <List component="nav" aria-label="Secciones administrativas" sx={{ py: 0 }}>
    {navItems.map(({ path, label, icon: Icon }) => {
      const active = pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));
      return <ListItemButton key={path} component={Link} href={path} selected={active} aria-current={active ? 'page' : undefined} onClick={onNavigate}
        sx={{ minHeight: 48, px: 3, borderLeft: '4px solid transparent', color: 'text.secondary', '&.Mui-selected': { bgcolor: 'primary.light', borderLeftColor: 'primary.main', color: 'primary.dark' }, '&.Mui-selected .MuiListItemIcon-root': { color: 'primary.dark' } }}>
        <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}><Icon /></ListItemIcon>
        <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '.9375rem' } } }} />
      </ListItemButton>;
    })}
  </List>;
};
