import { createConfig, EVM } from "@lifi/sdk";
import { getWalletClient, switchChain } from "@wagmi/core";
import type { Config } from "wagmi";

/**
 * One-time LI.FI SDK setup, wired to the app's wagmi wallet.
 *
 * The SDK keeps a single global config, so this is idempotent. The EVM provider
 * borrows the connected wallet (via wagmi-core) so quotes execute and chains
 * switch through the same wallet the page already uses — no separate connection.
 */

export const LIFI_INTEGRATOR = "defi-protocol-hub";

let initialized = false;

export function ensureLifiConfig(wagmiConfig: Config) {
  if (initialized) return;
  initialized = true;

  createConfig({
    integrator: LIFI_INTEGRATOR,
    providers: [
      EVM({
        getWalletClient: () => getWalletClient(wagmiConfig),
        switchChain: async (chainId) => {
          const chain = await switchChain(wagmiConfig, { chainId });
          return getWalletClient(wagmiConfig, { chainId: chain.id });
        },
      }),
    ],
  });
}
