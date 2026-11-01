import { Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, type DialogProps } from '@mui/material';
import type { FormEventHandler, ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  title: string;
  children: ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  pending?: boolean;
  error?: string;
  submitLabel?: string;
  pendingLabel?: string;
  hideCancel?: boolean;
};

export const FormDialog = ({ open, onClose, onSubmit, title, children, maxWidth = 'sm', pending = false, error, submitLabel = 'Guardar', pendingLabel = 'Guardando…', hideCancel = false }: Props) => (
  <Dialog open={open} onClose={pending ? undefined : onClose} maxWidth={maxWidth} fullWidth aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent sx={{ display: 'grid', gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {children}
      </DialogContent>
      <DialogActions>
        {!hideCancel && <Button onClick={onClose} disabled={pending}>Cancelar</Button>}
        <Button type="submit" variant="contained" disabled={pending}>{pending ? pendingLabel : submitLabel}</Button>
      </DialogActions>
    </form>
  </Dialog>
);
