import { useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rutaApi } from '@/shared/api/rutaApi';
import type { GeoImportResult } from '@acb/contracts';

export const ImportKmzDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<GeoImportResult | null>(null);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (f: File) => rutaApi.importKmz(f),
    onSuccess: data => { setResult(data); void client.invalidateQueries({ queryKey: ['rutas'] }); },
  });
  const close = () => { setFile(null); setResult(null); mutation.reset(); onClose(); };
  const error = mutation.error;
  const message = axios.isAxiosError(error)
    ? (error.response?.data as { error?: { message?: string } } | undefined)?.error?.message ?? 'No se pudo importar el archivo.'
    : undefined;

  return <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
    <DialogTitle>Importar KMZ</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Sube el archivo KMZ con las rutas y puntos de encuentro. Reemplaza o agrega los datos geográficos existentes.
      </Typography>
      <Button component="label" variant="outlined" fullWidth disabled={mutation.isPending}>
        {file ? file.name : 'Seleccionar archivo .kmz'}
        <input hidden type="file" accept=".kmz" onChange={e => { setFile(e.target.files?.[0] ?? null); setResult(null); }} />
      </Button>
      {result && <Alert severity="success" sx={{ mt: 2 }}>
        Importado: {result.saved_routes} rutas y {result.saved_points} puntos
        {result.endpoints && <> — endpoints: {result.endpoints.resolved} resueltos, {result.endpoints.unresolved} sin resolver</>}
      </Alert>}
      {message && <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>}
      <Box />
    </DialogContent>
    <DialogActions>
      <Button onClick={close}>Cerrar</Button>
      <Button variant="contained" disabled={!file || mutation.isPending} onClick={() => file && mutation.mutate(file)}>
        {mutation.isPending ? 'Importando…' : 'Importar'}
      </Button>
    </DialogActions>
  </Dialog>;
};
