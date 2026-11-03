import { useAuth } from './useAuth';

export const useLogout = () => useAuth().logout;
