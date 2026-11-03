'use client';

import { useState, type ReactNode } from 'react';
import { HydrationBoundary, QueryClient, QueryClientProvider, type DehydratedState } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const QueryProvider = ({ children, state }: { children: ReactNode; state?: DehydratedState }) => {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 300000 } } }));
  return <QueryClientProvider client={client}>
    <HydrationBoundary state={state}>{children}</HydrationBoundary>
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>;
};
