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

/** Union of the chain ids wagmi is configured for (used to type chainId args). */
export type SupportedChainId = (typeof chains)[number]["id"];

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "";

/**
 * Reliable, CORS-enabled public RPC endpoints per chain. viem's built-in
 * defaults (e.g. eth.merkle.io for mainnet) are rate-limited and frequently
 * fail multicall reads, which would silently drop on-chain data (e.g. a whole
 * chain's Compound markets). Override any of these via env if you have a
 * dedicated provider.
 */
const RPC_URLS: Record<number, string> = {
  [mainnet.id]:
    process.env.NEXT_PUBLIC_RPC_MAINNET ?? "https://ethereum-rpc.publicnode.com",
  [arbitrum.id]:
    process.env.NEXT_PUBLIC_RPC_ARBITRUM ??
    "https://arbitrum-one-rpc.publicnode.com",
  [optimism.id]:
    process.env.NEXT_PUBLIC_RPC_OPTIMISM ?? "https://optimism-rpc.publicnode.com",
  [base.id]:
    process.env.NEXT_PUBLIC_RPC_BASE ?? "https://base-rpc.publicnode.com",
  [polygon.id]:
    process.env.NEXT_PUBLIC_RPC_POLYGON ??
    "https://polygon-bor-rpc.publicnode.com",
  [sepolia.id]:
    process.env.NEXT_PUBLIC_RPC_SEPOLIA ??
    "https://ethereum-sepolia-rpc.publicnode.com",
};

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
      [mainnet.id]: http(RPC_URLS[mainnet.id]),
      [arbitrum.id]: http(RPC_URLS[arbitrum.id]),
      [optimism.id]: http(RPC_URLS[optimism.id]),
      [base.id]: http(RPC_URLS[base.id]),
      [polygon.id]: http(RPC_URLS[polygon.id]),
      [sepolia.id]: http(RPC_URLS[sepolia.id]),
    },
  });
}

// Register the config type globally for wagmi hooks' type inference.
declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
