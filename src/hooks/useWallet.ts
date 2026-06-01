"use client";

import { useAccount, useChainId, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { truncateAddress } from "@/lib/format";

/**
 * Convenience view over wagmi account state for UI components.
 * Keeps wallet-display logic in one place (address truncation, ENS, chain).
 */
export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting, connector, chain } =
    useAccount();
  const chainId = useChainId();
  // ENS only resolves on mainnet; querying there regardless of active chain.
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });

  return {
    address,
    ensName: ensName ?? undefined,
    displayName: ensName ?? (address ? truncateAddress(address) : undefined),
    isConnected,
    isConnecting: isConnecting || isReconnecting,
    connector,
    chain,
    chainId,
  };
}
