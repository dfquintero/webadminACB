import { useMutation } from '@tanstack/react-query';
import type { LoginInput } from '@acb/contracts';
import { useAuthContext } from '@/shared/providers/AuthContext';

export const useLogin = () => {
  const { login } = useAuthContext();
  return useMutation({ mutationFn: ({ username, password }: LoginInput) => login(username, password) });
};
