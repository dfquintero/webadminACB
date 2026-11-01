import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

export const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, user } = useAuthContext();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.rol !== requiredRole) return <Navigate to="/unauthorized" replace />;
  
  return <>{children}</>;
};
