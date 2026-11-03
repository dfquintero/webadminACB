import dynamic from 'next/dynamic';
import { Alert, Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, Typography } from '@mui/material';
import { School } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { rutaApi } from '@/shared/api/rutaApi';
import type { Ruta } from '@/shared/api/types';

const RoutesMap = dynamic(() => import('@/features/inicio/components/RoutesMap').then(m => m.RoutesMap), {
  ssr: false, loading: () => <CircularProgress aria-label="Cargando mapa" />,
});

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => <Box>
  <Typography variant="caption" color="text.secondary">{label}</Typography>
  <Typography variant="body2" sx={{ fontWeight: 500 }}>{value ?? '—'}</Typography>
</Box>;

export const RutaDetailDialog = ({ ruta, onClose }: { ruta: Ruta | null; onClose: () => void }) => {
  const routes = useQuery({ queryKey: ['geo', 'routes'], queryFn: ({ signal }) => rutaApi.getGeoRoutes(signal), enabled: !!ruta });
  const endpoints = useQuery({ queryKey: ['rutas', ruta?.id, 'endpoints'], queryFn: () => rutaApi.getEndpoints(ruta!.id), enabled: !!ruta });
  const points = useQuery({ queryKey: ['meeting-points'], queryFn: ({ signal }) => rutaApi.getMeetingPoints(signal), enabled: !!ruta });

  const geoRoute = routes.data?.find(route => route._id === ruta?.id);
  const byId = new Map((points.data ?? []).map(point => [point._id, point]));
  const ordered = (ruta?.meetingPointIds ?? []).flatMap(id => byId.get(id) ?? []).filter(point => point.kind !== 'school');
  const schoolId = endpoints.data?.end?.meeting_point_id;
  const school = schoolId ? byId.get(schoolId) : undefined;
  const loading = routes.isPending || endpoints.isPending || points.isPending;
  const failed = routes.isError || endpoints.isError || points.isError;

  return <Dialog open={!!ruta} onClose={onClose} maxWidth="lg" fullWidth>
    {ruta && <>
      <DialogTitle>{ruta.name}</DialogTitle>
      <DialogContent>
        {loading ? <CircularProgress /> : failed ? <Alert severity="error">No se pudo cargar el detalle.</Alert> :
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, gap: 3 }}>
            <Box>{geoRoute && <RoutesMap routes={[geoRoute]} points={[...ordered, ...(school ? [school] : [])]} height="60vh" numbered />}</Box>
            <Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Field label="Código" value={ruta.code} />
                <Field label="Colegio" value={ruta.routeCode} />
                <Field label="Jornada" value={ruta.dayShift} />
                <Field label="Distancia" value={ruta.distanceKm != null ? `${ruta.distanceKm} km` : null} />
                <Field label="Puntos de encuentro" value={ordered.length} />
                <Field label="Estado" value={<Chip size="small" color={ruta.endpointStatus === 'resolved' ? 'success' : 'warning'}
                  label={ruta.endpointStatus === 'resolved' ? 'Resuelta' : ruta.endpointStatus ?? '—'} />} />
              </Box>
              <Typography variant="subtitle2">Recorrido</Typography>
              <List dense sx={{ maxHeight: '45vh', overflow: 'auto' }}>
                {ordered.map((point, index) => <ListItem key={point._id} sx={{ gap: 1 }}>
                  <Chip size="small" label={index + 1} sx={{ bgcolor: '#0d47a1', color: '#fff', minWidth: 32 }} />
                  <ListItemText primary={<>{point.name}{point._id === endpoints.data?.start?.meeting_point_id && <Chip size="small" label="Inicio" color="primary" variant="outlined" sx={{ ml: 1 }} />}</>}
                    secondary={point.description ?? '—'} />
                </ListItem>)}
                {school && <ListItem sx={{ gap: 1 }}>
                  <Chip size="small" label={<School fontSize="small" />} sx={{ bgcolor: '#b71c1c', color: '#fff', minWidth: 32 }} />
                  <ListItemText primary={<>{school.name}<Chip size="small" label="Destino" color="error" variant="outlined" sx={{ ml: 1 }} /></>} secondary="Colegio" />
                </ListItem>}
              </List>
            </Box>
          </Box>}
      </DialogContent>
    </>}
  </Dialog>;
};
