import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

/**
 * Chains exposed to wagmi (page-level wallet connection + network switching).
 * This is intentionally a curated EVM set aligned with LiFi's most-used chains;
 * the LiFi widget discovers the full route-able chain list independently.
 */
export const chains = [
  mainnet,
  arbitrum,
  optimism,
  base,
  polygon,
  sepolia,
] as const;

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "";

/**
 * wagmi config factory.
 *
 * Created via a factory (not a module-level singleton) so it can be
 * instantiated once per client in `Providers` while staying SSR-safe.
 * `ssr: true` makes wagmi render a deterministic disconnected state on the
 * server and reconnect on the client (no hydration mismatch), and
 * `cookieStorage` persists the last connection across reloads.
 */
export function getConfig() {
  return createConfig({
    chains,
    connectors: [
      injected(),
      coinbaseWallet({ appName: "LiFi Interface" }),
      // WalletConnect requires a projectId from https://cloud.reown.com.
      // Only register it when configured, so missing config doesn't init
      // WalletConnect Core (avoids noisy "Project ID Not Configured" logs).
      ...(walletConnectProjectId
        ? [walletConnect({ projectId: walletConnectProjectId, showQrModal: true })]
        : []),
    ],
    storage: createStorage({ storage: cookieStorage }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [arbitrum.id]: http(),
      [optimism.id]: http(),
      [base.id]: http(),
      [polygon.id]: http(),
      [sepolia.id]: http(),
    },
  });
}

// Register the config type globally for wagmi hooks' type inference.
declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
