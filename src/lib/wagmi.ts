import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import {
  arbitrum,
  base,
  bsc,
  hoodi,
  hyperEvm,
  ink,
  mainnet,
  mantle,
  optimism,
  polygon,
  scroll,
  sepolia,
  zksync,
} from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

/**
 * Chains exposed to wagmi (page-level wallet connection + network switching).
 * Covers the deployments used by the integrated protocols (e.g. Maverick on
 * BNB / zkSync Era / Scroll, Backed xStocks on Mantle / HyperEVM / Ink); each
 * protocol still discovers its own chain list.
 */
export const chains = [
  mainnet,
  arbitrum,
  optimism,
  base,
  polygon,
  bsc,
  zksync,
  scroll,
  mantle,
  hyperEvm,
  ink,
  // Testnets (opt-in via the in-app "Testnet" toggle): Sepolia for Aave &
  // Compound, Hoodi for Lido staking.
  sepolia,
  hoodi,
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
export const RPC_URLS: Record<number, string> = {
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
  [bsc.id]:
    process.env.NEXT_PUBLIC_RPC_BSC ?? "https://bsc-rpc.publicnode.com",
  [zksync.id]:
    process.env.NEXT_PUBLIC_RPC_ZKSYNC ?? "https://mainnet.era.zksync.io",
  [scroll.id]:
    process.env.NEXT_PUBLIC_RPC_SCROLL ?? "https://scroll-rpc.publicnode.com",
  [mantle.id]:
    process.env.NEXT_PUBLIC_RPC_MANTLE ?? "https://mantle-rpc.publicnode.com",
  [hyperEvm.id]:
    process.env.NEXT_PUBLIC_RPC_HYPEREVM ?? "https://rpc.hyperliquid.xyz/evm",
  [ink.id]:
    process.env.NEXT_PUBLIC_RPC_INK ?? "https://rpc-gel.inkonchain.com",
  [hoodi.id]:
    process.env.NEXT_PUBLIC_RPC_HOODI ?? "https://ethereum-hoodi-rpc.publicnode.com",
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
      [bsc.id]: http(RPC_URLS[bsc.id]),
      [zksync.id]: http(RPC_URLS[zksync.id]),
      [scroll.id]: http(RPC_URLS[scroll.id]),
      [mantle.id]: http(RPC_URLS[mantle.id]),
      [hyperEvm.id]: http(RPC_URLS[hyperEvm.id]),
      [ink.id]: http(RPC_URLS[ink.id]),
      [sepolia.id]: http(RPC_URLS[sepolia.id]),
      [hoodi.id]: http(RPC_URLS[hoodi.id]),
    },
  });
}

// Register the config type globally for wagmi hooks' type inference.
declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
