import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ApiError } from '../services/httpClient';
import { useToast } from '../context/ToastContext';

/**
 * Provides React Query with a global error handler that surfaces every failed
 * query/mutation as a toast. Centralising it here means pages never have to
 * handle `isError` for user feedback — the notification is automatic.
 *
 * The client is created inside this component (via useState) so its cache
 * handlers can close over the toast function from context.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  const [queryClient] = useState(() => {
    const showError = (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
      toast.error(message);
    };

    return new QueryClient({
      defaultOptions: {
        queries: { retry: 1, staleTime: 30_000 },
      },
      queryCache: new QueryCache({ onError: showError }),
      mutationCache: new MutationCache({ onError: showError }),
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
