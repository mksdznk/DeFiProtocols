"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { LiFiWidget, type WidgetConfig } from "@lifi/widget";

/**
 * The actual LI.FI widget. Loaded only on the client (see LiFiWidgetWrapper) —
 * it ships its own MUI + Emotion runtime, so it must stay out of SSR and off the
 * info-hub's initial bundle.
 *
 * Wallet sharing: `usePartialWalletManagement` makes the widget consume the
 * host wagmi config (our `WagmiProvider` from `Providers`) for EVM, so the page
 * header's Connect button and the widget share a single connection. The widget
 * provides its own internal providers for non-EVM ecosystems.
 */

// Brand accent (LI.FI orange) as hex — MUI's palette needs hex/rgb, not oklch.
const LIFI_ACCENT = "#f5610f";
const INTEGRATOR = "lifi-protocol-hub";

export default function LiFiWidgetInner() {
  const { resolvedTheme } = useTheme();
  const appearance = resolvedTheme === "light" ? "light" : "dark";

  const config = useMemo<WidgetConfig>(
    () => ({
      integrator: INTEGRATOR,
      variant: "compact",
      appearance,
      walletConfig: { usePartialWalletManagement: true },
      theme: {
        colorSchemes: {
          light: { palette: { primary: { main: LIFI_ACCENT } } },
          dark: { palette: { primary: { main: LIFI_ACCENT } } },
        },
        container: {
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "none",
        },
      },
    }),
    [appearance],
  );

  return <LiFiWidget integrator={INTEGRATOR} config={config} />;
}
