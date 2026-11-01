import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useForm } from '@/shared/hooks/useForm';
import { useLogin } from '../hooks/useLogin';

export const ForgotPassword = ({ open, onClose }) => {
  const { control, handleSubmit, reset } = useForm(undefined, { email: '' }, undefined);
  const login = useLogin();
  
  const submit = (data) => { 
    login.mutate(data); 
    reset(); 
    onClose(); 
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Recuperar Contraseña</DialogTitle>
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <TextField name="email" label="Email" type="email" fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">Enviar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
