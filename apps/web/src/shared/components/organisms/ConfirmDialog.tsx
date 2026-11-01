import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

type Props = { open: boolean; onClose: () => void; onConfirm: () => void; message?: string; pending?: boolean };

export const ConfirmDialog = ({ open, onClose, onConfirm, message = '¿Confirmar?', pending = false }: Props) => (
  <Dialog open={open} onClose={pending ? undefined : onClose} aria-labelledby="confirm-dialog-title">
    <DialogTitle id="confirm-dialog-title">Confirmar</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={pending}>Cancelar</Button>
      <Button onClick={onConfirm} disabled={pending} color="error" variant="contained">{pending ? 'Eliminando…' : 'Confirmar'}</Button>
    </DialogActions>
  </Dialog>
);
