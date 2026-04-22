'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Provedor de Contexto para o React Query.
 * Gerencia o cache global de requisições, revalidações e estados de loading
 * para toda a aplicação.
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Criamos o QueryClient dentro de um state para garantir que seja instanciado apenas uma vez no client-side
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Cache de 5 minutos
        retry: 1,                // Tenta novamente apenas 1 vez em caso de falha
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
