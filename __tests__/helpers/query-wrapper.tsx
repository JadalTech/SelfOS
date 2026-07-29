/**
 * Test React Query Wrapper Utility
 * SelfOS Testing Infrastructure
 *
 * Provides a clean QueryClientProvider test wrapper configured with zero retries
 * and disabled gc/stale times for predictable unit and component testing.
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function createQueryWrapper(queryClient: QueryClient = createTestQueryClient()) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
}
