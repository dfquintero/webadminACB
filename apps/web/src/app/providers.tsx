'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { DehydratedState } from '@tanstack/react-query';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { AuthProvider } from '@/shared/providers/AuthProvider';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

export const AppProviders = ({ children, state, unavailable = false }: { children: React.ReactNode; state?: DehydratedState; unavailable?: boolean }) => (
  <AppRouterCacheProvider>
    <QueryProvider state={state}>
      <AuthProvider initialUnavailable={unavailable}>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  </AppRouterCacheProvider>
);
