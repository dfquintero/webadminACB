import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export const ForgotPassword = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Recuperación no disponible</DialogTitle>
    <DialogContent><Alert severity="info">El servicio de recuperación está pendiente de integración. Contacta al administrador.</Alert></DialogContent>
    <DialogActions><Button onClick={onClose}>Cerrar</Button></DialogActions>
  </Dialog>
);
