import { useState } from 'react';
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { documentTypeSchema, type DocumentType } from '@acb/contracts';
import { searchApi, type SearchResult } from '@/shared/api/searchApi';

const fields: Record<SearchResult['kind'], [string, string][]> = {
  Estudiante: [['name', 'Nombre'], ['grade', 'Grado'], ['section', 'Sección'], ['schoolShift', 'Jornada'], ['schoolId', 'Colegio'], ['phone', 'Teléfono']],
  'Guía': [['name', 'Nombre'], ['contractNumber', 'Contrato'], ['email', 'Email'], ['zone', 'Zona'], ['phone', 'Teléfono']],
};

export const DocumentSearch = () => {
  const [type, setType] = useState<DocumentType>('NUIP');
  const [number, setNumber] = useState('');
  const search = useMutation({ mutationFn: () => searchApi.byDocument(type, number.trim()) });
  const result = search.data;
  return <Paper sx={{ p: 2, mb: 3 }}>
    <Typography variant="subtitle1" gutterBottom>Buscar por documento</Typography>
    <Box component="form" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }} onSubmit={e => { e.preventDefault(); if (number.trim()) search.mutate(); }}>
      <TextField select size="small" label="Tipo" value={type} onChange={e => setType(e.target.value as DocumentType)} sx={{ minWidth: 110 }}>
        {documentTypeSchema.options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
      </TextField>
      <TextField size="small" label="Número" value={number} onChange={e => setNumber(e.target.value)} />
      <Button type="submit" variant="contained" startIcon={<Search />} disabled={!number.trim() || search.isPending}>Buscar</Button>
    </Box>
    {search.isError && <Alert severity="warning" sx={{ mt: 2 }}>No se encontró ninguna persona con ese documento.</Alert>}
    {result && <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">{result.kind} · {result.dto.documentType} {result.dto.documentNumber}</Typography>
      {fields[result.kind].map(([key, label]) =>
        <Typography key={key} variant="body2"><b>{label}:</b> {String((result.dto as Record<string, unknown>)[key] ?? '—')}</Typography>)}
    </Box>}
  </Paper>;
};
