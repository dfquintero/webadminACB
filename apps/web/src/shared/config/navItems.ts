import { Dashboard, People, DirectionsBike, Badge, Assignment, CheckCircle, Notifications } from '@mui/icons-material';

export const navItems = [
  { path: '/', label: 'Dashboard', icon: Dashboard },
  { path: '/estudiantes', label: 'Estudiantes', icon: People },
  { path: '/rutas', label: 'Rutas', icon: DirectionsBike },
  { path: '/guias', label: 'Guías', icon: Badge },
  { path: '/asignaciones', label: 'Asignaciones', icon: Assignment },
  { path: '/asistencia', label: 'Asistencia', icon: CheckCircle },
  { path: '/alertas', label: 'Alertas', icon: Notifications },
];
