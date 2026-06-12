"use client";

import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { readContract, readContracts } from "@wagmi/core";
import {
  AAVE_SEPOLIA_CHAIN_ID,
  AAVE_SEPOLIA_POOL,
  aaveErc20Abi,
  aavePoolAbi,
  raySupplyApy,
} from "@/lib/aave/sepolia";

export interface AaveSepoliaReserve {
  asset: `0x${string}`;
  symbol: string;
  decimals: number;
  apy: number;
}

/**
 * Loads the Aave v3 Sepolia reserves live from the Pool: the reserve list, then
 * each reserve's symbol/decimals and current supply APY. Nothing is hardcoded
 * beyond the Pool address.
 */
export function useAaveSepoliaReserves() {
  const config = useConfig();

  return useQuery({
    queryKey: ["aave", "sepolia", "reserves"],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<AaveSepoliaReserve[]> => {
      const list = (await readContract(config, {
        address: AAVE_SEPOLIA_POOL,
        abi: aavePoolAbi,
        functionName: "getReservesList",
        chainId: AAVE_SEPOLIA_CHAIN_ID,
      })) as readonly `0x${string}`[];

      const reads = await readContracts(config, {
        allowFailure: true,
        contracts: list.flatMap((asset) => [
          { address: asset, abi: aaveErc20Abi, functionName: "symbol", chainId: AAVE_SEPOLIA_CHAIN_ID } as const,
          { address: asset, abi: aaveErc20Abi, functionName: "decimals", chainId: AAVE_SEPOLIA_CHAIN_ID } as const,
          { address: AAVE_SEPOLIA_POOL, abi: aavePoolAbi, functionName: "getReserveData", args: [asset], chainId: AAVE_SEPOLIA_CHAIN_ID } as const,
        ]),
      });

      const reserves: AaveSepoliaReserve[] = [];
      list.forEach((asset, i) => {
        const symbol = reads[i * 3]?.result as string | undefined;
        const decimals = reads[i * 3 + 1]?.result as number | undefined;
        const data = reads[i * 3 + 2]?.result as
          | { currentLiquidityRate: bigint }
          | undefined;
        if (symbol == null || decimals == null || data == null) return;
        reserves.push({
          asset,
          symbol,
          decimals,
          apy: raySupplyApy(data.currentLiquidityRate),
        });
      });

      return reserves.sort((a, b) => b.apy - a.apy);
    },
  });
}
