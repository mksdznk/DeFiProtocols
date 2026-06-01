"use client";

import { useState, type ReactNode } from "react";
import { WagmiProvider, type State } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getConfig } from "@/lib/wagmi";

/**
 * Global client providers, rendered once near the root of the tree.
 *
 * Ordering matters: wagmi needs TanStack Query, and both must sit above any
 * component that reads wallet/query state. Kept as a single client boundary so
 * the rest of the app can stay in Server Components.
 */
export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  // Instantiate once per client; never recreate on re-render.
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
