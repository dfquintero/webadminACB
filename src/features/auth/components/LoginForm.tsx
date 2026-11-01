import { FormDialog } from '@/shared/components/organisms/FormDialog';
import { FormSection } from '@/shared/components/molecules/FormSection';
import { FormField } from '@/shared/components/atoms/FormField';
import { useForm } from '@/shared/hooks/useForm';
import { useLogin } from '../hooks/useLogin';
import { authSchemas } from '@/shared/config/schemas/auth';
import { authDefault } from '@/shared/config/defaults/auth';

export const LoginForm = ({ open, onClose }) => {
  const { control, handleSubmit, reset } = useForm(authSchemas.login, authDefault.login, undefined);
  const login = useLogin();
  
  const submit = (data) => { 
    login.mutate(data); 
    reset(); 
    onClose(); 
  };
  
  return (
    <FormDialog open={open} onClose={onClose} onSubmit={handleSubmit(submit)} title="Iniciar Sesión">
      <FormSection>
        <FormField name="email" label="Email" control={control} type="email" />
        <FormField name="password" label="Contraseña" control={control} type="password" />
      </FormSection>
    </FormDialog>
  );
};
