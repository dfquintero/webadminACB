import { Alert, CircularProgress, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { rutaApi } from '@/shared/api/rutaApi';
import type { Ruta } from '@/shared/api/types';

const label = (source?: string | null, distance?: number | null) =>
  `${source ?? '—'}${distance != null ? ` · ${Math.round(distance)} m` : ''}`;

export const RutaDetailDialog = ({ ruta, onClose }: { ruta: Ruta | null; onClose: () => void }) => {
  const endpoints = useQuery({ queryKey: ['rutas', ruta?.id, 'endpoints'], queryFn: () => rutaApi.getEndpoints(ruta!.id), enabled: !!ruta });
  const points = useQuery({ queryKey: ['meeting-points'], queryFn: ({ signal }) => rutaApi.getMeetingPoints(signal), enabled: !!ruta });
  const ids = new Set(ruta?.meetingPointIds ?? []);
  const rutaPoints = points.data?.filter(p => ids.has(p._id)) ?? [];

  return <Dialog open={!!ruta} onClose={onClose} maxWidth="sm" fullWidth>
    {ruta && <>
      <DialogTitle>{ruta.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Código {ruta.code ?? '—'} · {ruta.routeCode ?? '—'} · {ruta.dayShift ?? '—'} · {ruta.distanceKm != null ? `${ruta.distanceKm} km` : '—'}
        </Typography>
        {endpoints.isPending || points.isPending ? <CircularProgress sx={{ mt: 2 }} /> :
          endpoints.isError || points.isError ? <Alert severity="error" sx={{ mt: 2 }}>No se pudo cargar el detalle.</Alert> : <>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Endpoints ({endpoints.data?.status ?? '—'})</Typography>
            <List dense>
              <ListItem><ListItemText primary={`Inicio: ${endpoints.data?.start?.name ?? '—'}`} secondary={label(endpoints.data?.start?.source, endpoints.data?.start?.distance_m)} /></ListItem>
              <ListItem><ListItemText primary={`Fin: ${endpoints.data?.end?.name ?? '—'}`} secondary={label(endpoints.data?.end?.source, endpoints.data?.end?.distance_m)} /></ListItem>
            </List>
            <Typography variant="subtitle2">Puntos de encuentro ({rutaPoints.length})</Typography>
            <List dense sx={{ maxHeight: 240, overflow: 'auto' }}>
              {rutaPoints.map(p => <ListItem key={p._id}><ListItemText primary={p.name} secondary={p.description ?? '—'} /></ListItem>)}
            </List>
          </>}
      </DialogContent>
    </>}
  </Dialog>;
};
