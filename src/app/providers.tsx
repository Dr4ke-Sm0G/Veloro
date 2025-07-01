"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { ReactNode, useState } from "react";
import superjson from "superjson";
import { SessionProvider } from 'next-auth/react'


export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true, // log toutes les requêtes, succès et erreurs
        }),
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson, 
        }),
      ],
    }),
  );

  return (
    <SessionProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
    </SessionProvider>
  );
}
