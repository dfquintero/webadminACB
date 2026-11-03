import { Alert, Box, Button } from '@mui/material';
import { FormSection } from '@/shared/components/molecules/FormSection';
import { FormField } from '@/shared/components/atoms/FormField';
import { useForm } from '@/shared/hooks/useForm';
import { useLogin } from '../hooks/useLogin';
import { authSchemas } from '@/shared/config/schemas/auth';
import { authDefault } from '@/shared/config/defaults/auth';
import { getApiErrorMessage } from '@/shared/api/errors';

export const LoginForm = () => {
  const { control, submitForm, formState } = useForm(authSchemas.login, authDefault.login);
  const login = useLogin();
  const save = async (data: { username: string; password: string }) => { await login.mutateAsync(data); };
  return <Box component="form" onSubmit={submitForm(save, () => {}, error => getApiErrorMessage(error, 'No se pudo iniciar sesión. Revisa la conexión con el BFF.'))}>
    <FormSection>
      <FormField name="username" label="Usuario" control={control} autoComplete="username" />
      <FormField name="password" label="Contraseña" control={control} type="password" autoComplete="current-password" />
      {formState.errors.root?.message && <Alert severity="error">{formState.errors.root.message}</Alert>}
      <Button type="submit" variant="contained" disabled={formState.isSubmitting}>{formState.isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}</Button>
    </FormSection>
  </Box>;
};
