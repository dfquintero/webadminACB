import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Typography, Chip } from '@mui/material';
import type { Asistencia, AsistenciaFormData, Estudiante } from '@/shared/api/types';

export type AttendanceUpdate = (values: { id: string; data: AsistenciaFormData }) => Promise<void>;
type Props = { estudiante: Estudiante; asistencia?: Asistencia; onUpdate: AttendanceUpdate };

export const AsistenciaCard = ({ estudiante, asistencia, onUpdate }: Props) => {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const update = async (estado: Asistencia['estado']) => {
    if (!asistencia || pending) return;
    setPending(true);
    setFailed(false);
    try { await onUpdate({ id: asistencia.id, data: { ...asistencia, estado } }); }
    catch { setFailed(true); }
    finally { setPending(false); }
  };
  return <Card><CardContent>
    <Typography>{estudiante.nombre} {estudiante.apellido}</Typography>
    <Chip label={asistencia?.estado ?? 'Sin registro de asistencia'} size="small" />
    {failed && <Alert severity="error">No se pudo actualizar la asistencia.</Alert>}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      <Button disabled={!asistencia || pending} size="small" onClick={() => update('recogido')} color="success">Recogido</Button>
      <Button disabled={!asistencia || pending} size="small" onClick={() => update('no_asistio')} color="error">No Asistió</Button>
      <Button disabled={!asistencia || pending} size="small" onClick={() => update('justificado')} color="warning">Justificado</Button>
    </Box>
  </CardContent></Card>;
};
