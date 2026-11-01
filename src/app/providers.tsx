import { QueryProvider } from '@/shared/providers/QueryProvider';
import { AuthProvider } from '@/shared/providers/AuthProvider';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

export const AppProviders = ({ children }) => (
  <QueryProvider>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </QueryProvider>
);
