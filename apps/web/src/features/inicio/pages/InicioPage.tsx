'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Alert, Box, Chip, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { rutaApi } from '@/shared/api/rutaApi';
import { useCapabilities } from '@/shared/hooks/useCapabilities';

const RoutesMap = dynamic(() => import('../components/RoutesMap').then(m => m.RoutesMap), {
  ssr: false, loading: () => <CircularProgress aria-label="Cargando mapa" />,
});

export const InicioPage = () => {
  const capabilities = useCapabilities();
  const enabled = capabilities.data?.geo === true;
  const routes = useQuery({ queryKey: ['geo', 'routes'], queryFn: ({ signal }) => rutaApi.getGeoRoutes(signal), enabled });
  const points = useQuery({ queryKey: ['meeting-points'], queryFn: ({ signal }) => rutaApi.getMeetingPoints(signal), enabled });
  const [selected, setSelected] = useState('all');

  const view = useMemo(() => {
    const all = routes.data ?? [];
    const visible = selected === 'all' ? all : all.filter(route => route._id === selected);
    const ids = new Set(visible.flatMap(route => route.meeting_point_ids ?? []));
    const pts = (points.data ?? []).filter(p => p.kind === 'school' || selected === 'all' || ids.has(p._id));
    return { visible, pts, schools: pts.filter(p => p.kind === 'school').length };
  }, [routes.data, points.data, selected]);

  if (capabilities.data && !enabled) return <Alert severity="info">El servicio de rutas no está disponible.</Alert>;
  if (routes.isError || points.isError) return <Alert severity="error">No se pudieron cargar las rutas.</Alert>;
  if (!routes.data || !points.data) return <CircularProgress aria-label="Cargando rutas" />;

  return <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
      <Typography variant="h5">Inicio</Typography>
      <TextField select size="small" label="Ruta" value={selected} onChange={e => setSelected(e.target.value)} sx={{ minWidth: 280 }}>
        <MenuItem value="all">Todas las rutas</MenuItem>
        {routes.data.map(route => <MenuItem key={route._id} value={route._id}>{route.name}</MenuItem>)}
      </TextField>
    </Box>
    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
      <Chip label={`${view.visible.length} rutas`} />
      <Chip label={`${view.pts.length - view.schools} puntos de encuentro`} sx={{ bgcolor: '#0d47a1', color: '#fff' }} />
      <Chip label={`${view.schools} colegios`} sx={{ bgcolor: '#b71c1c', color: '#fff' }} />
    </Box>
    <RoutesMap routes={view.visible} points={view.pts} />
  </Box>;
};
