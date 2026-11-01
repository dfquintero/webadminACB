import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export const FormDialog = ({ open, onClose, onSubmit, title, children, maxWidth = 'sm' }) => (
  <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </form>
  </Dialog>
);
