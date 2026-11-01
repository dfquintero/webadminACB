import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export const ConfirmDialog = ({ open, onClose, onConfirm, message = '¿Confirmar?' }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmar</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} color="error" variant="contained">Confirmar</Button>
    </DialogActions>
  </Dialog>
);
