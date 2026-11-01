import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export const RegisterForm = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Registro no disponible</DialogTitle>
    <DialogContent><Alert severity="info">El backend no dispone de un contrato de registro confirmado. Solicita tu cuenta al administrador.</Alert></DialogContent>
    <DialogActions><Button onClick={onClose}>Cerrar</Button></DialogActions>
  </Dialog>
);
