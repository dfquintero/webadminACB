import { useMemo, useState } from 'react';
import {
  Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rutaApi } from '@/shared/api/rutaApi';
import type { GeoImportResult } from '@acb/contracts';
import { parseKmz, previewKmz, routeKey, withoutRoutes, type KmzPreview } from '../utils/kmzPreview';

type Parsed = Awaited<ReturnType<typeof parseKmz>>;

export const ImportKmzDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const client = useQueryClient();
  const existing = useQuery({ queryKey: ['rutas'], queryFn: ({ signal }) => rutaApi.getAll(signal), enabled: open });
  const [file, setFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [preview, setPreview] = useState<KmzPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [result, setResult] = useState<GeoImportResult | null>(null);

  const known = useMemo(() => new Set((existing.data ?? []).map(routeKey)), [existing.data]);
  const rows = useMemo(() => (preview?.routes ?? []).map(route => ({ ...route, exists: known.has(routeKey(route)) })), [preview, known]);
  const newCount = rows.filter(row => !row.exists).length;
  const existingCount = rows.length - newCount;
  const allExist = rows.length > 0 && newCount === 0;
  const mixed = newCount > 0 && existingCount > 0;

  const resetFile = () => { setFile(null); setParsed(null); setPreview(null); setPreviewError(null); setInputKey(key => key + 1); };
  const mutation = useMutation({
    mutationFn: (f: File) => rutaApi.importKmz(f),
    onSuccess: data => { setResult(data); resetFile(); void client.invalidateQueries({ queryKey: ['rutas'] }); void client.invalidateQueries({ queryKey: ['geo'] }); void client.invalidateQueries({ queryKey: ['meeting-points'] }); },
  });
  const close = () => { resetFile(); setResult(null); mutation.reset(); onClose(); };

  const select = async (selected: File | null) => {
    resetFile(); setResult(null); mutation.reset();
    if (!selected) return;
    setFile(selected);
    try { const data = await parseKmz(selected); setParsed(data); setPreview(previewKmz(data)); }
    catch (error) { setPreviewError(error instanceof Error ? error.message : 'No se pudo leer el archivo.'); }
  };

  const uploadError = axios.isAxiosError(mutation.error)
    ? (mutation.error.response?.data as { error?: { message?: string } } | undefined)?.error?.message ?? 'No se pudo importar el archivo.'
    : undefined;
  const canImport = !!file && !!parsed && rows.length > 0 && !allExist && !mutation.isPending && !existing.isPending;
  const submit = () => {
    if (!file || !parsed) return;
    if (!mixed) return mutation.mutate(file);
    const bytes = withoutRoutes(parsed, known);
    mutation.mutate(new File([bytes.slice().buffer], file.name, { type: 'application/vnd.google-earth.kmz' }));
  };

  return <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
    <DialogTitle>Importar KMZ</DialogTitle>
    <DialogContent>
      <Button component="label" variant="outlined" fullWidth disabled={mutation.isPending}>
        {file ? file.name : 'Seleccionar archivo .kmz'}
        <input key={inputKey} hidden type="file" accept=".kmz" onChange={e => void select(e.target.files?.[0] ?? null)} />
      </Button>

      {previewError && <Alert severity="error" sx={{ mt: 2 }}>{previewError}</Alert>}
      {preview && rows.length === 0 && <Alert severity="warning" sx={{ mt: 2 }}>El archivo no contiene rutas válidas para importar.</Alert>}

      {preview && rows.length > 0 && <>
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Se encontraron {rows.length} rutas ({newCount} nuevas, {existingCount} ya existentes), {preview.meetingPoints} puntos de encuentro y {preview.schools} colegios.
        </Typography>
        <Table size="small" sx={{ mt: 1 }}>
          <TableHead><TableRow><TableCell>Ruta</TableCell><TableCell>Código</TableCell><TableCell>Colegio</TableCell><TableCell>Estado</TableCell></TableRow></TableHead>
          <TableBody>{rows.map((row, index) => <TableRow key={`${routeKey(row)}-${index}`}>
            <TableCell>{row.name}</TableCell><TableCell>{row.code}</TableCell><TableCell>{row.routeCode ?? '—'}</TableCell>
            <TableCell><Chip size="small" color={row.exists ? 'default' : 'success'} label={row.exists ? 'Ya existe' : 'Nueva'} /></TableCell>
          </TableRow>)}</TableBody>
        </Table>
        {allExist && <Alert severity="info" sx={{ mt: 2 }}>Este archivo ya fue importado. No se importará de nuevo para evitar duplicados.</Alert>}
        {mixed && <Alert severity="info" sx={{ mt: 2 }}>
          Solo se importarán las {newCount} rutas nuevas con sus puntos; las {existingCount} existentes se omitirán.
        </Alert>}
      </>}

      {result && <Alert severity="success" sx={{ mt: 2 }}>
        Importado: {result.saved_routes} rutas y {result.saved_points} puntos
        {result.endpoints && <> — endpoints: {result.endpoints.resolved} resueltos, {result.endpoints.unresolved} sin resolver</>}
      </Alert>}
      {uploadError && <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>}
    </DialogContent>
    <DialogActions>
      <Button onClick={close}>Cerrar</Button>
      <Button variant="contained" disabled={!canImport} onClick={submit}>
        {mutation.isPending ? 'Importando…' : mixed ? 'Importar rutas nuevas' : 'Importar'}
      </Button>
    </DialogActions>
  </Dialog>;
};
