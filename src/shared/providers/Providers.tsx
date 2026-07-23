/**
 * Shared Providers
 *
 * Composes all root-level providers into a single component.
 * The root layout wraps its children with this to keep `_layout.tsx` clean.
 *
 * Current providers (Batch 2A):
 * 1. GestureHandlerRootView — required by react-native-gesture-handler
 * 2. SafeAreaProvider — provides safe area insets
 * 3. QueryClientProvider — React Query data fetching context
 *
 * Additional providers will be added in future batches as needed.
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/query';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
