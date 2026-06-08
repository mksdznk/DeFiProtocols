"use client";

import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { readContracts } from "@wagmi/core";
import {
  aprPercent,
  cometAbi,
  erc20Abi,
  fetchCometMarkets,
} from "@/lib/compound/markets";
import type { SupportedChainId } from "@/lib/wagmi";

export interface CompoundMarket {
  chainId: SupportedChainId;
  comet: `0x${string}`;
  baseToken: `0x${string}`;
  symbol: string;
  decimals: number;
  apy: number;
}

/**
 * Loads the Compound III market list from the aggregator, then reads each market
 * live from its Comet contract: the base token, its symbol/decimals, and the
 * current supply APY (from utilization + supply rate). The market list and all
 * the data are sourced dynamically — nothing is hardcoded.
 */
export function useCompoundMarkets() {
  const config = useConfig();

  return useQuery({
    queryKey: ["compound", "markets"],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<CompoundMarket[]> => {
      const cometMarkets = await fetchCometMarkets();

      // Round 1: base token + utilization for each market.
      const r1 = await readContracts(config, {
        allowFailure: true,
        contracts: cometMarkets.flatMap((m) => [
          { address: m.comet, abi: cometAbi, functionName: "baseToken", chainId: m.chainId } as const,
          { address: m.comet, abi: cometAbi, functionName: "getUtilization", chainId: m.chainId } as const,
        ]),
      });

      const markets = await Promise.all(
        cometMarkets.map(async (m, i) => {
          const baseToken = r1[i * 2]?.result as `0x${string}` | undefined;
          const util = r1[i * 2 + 1]?.result as bigint | undefined;
          if (!baseToken || util == null) return null;

          // Round 2: token symbol/decimals + supply rate at current utilization.
          const r2 = await readContracts(config, {
            allowFailure: true,
            contracts: [
              { address: baseToken, abi: erc20Abi, functionName: "symbol", chainId: m.chainId } as const,
              { address: baseToken, abi: erc20Abi, functionName: "decimals", chainId: m.chainId } as const,
              { address: m.comet, abi: cometAbi, functionName: "getSupplyRate", args: [util], chainId: m.chainId } as const,
            ],
          });
          const symbol = r2[0]?.result as string | undefined;
          const decimals = r2[1]?.result as number | undefined;
          const rate = r2[2]?.result as bigint | undefined;
          if (symbol == null || decimals == null || rate == null) return null;

          return {
            chainId: m.chainId,
            comet: m.comet,
            baseToken,
            symbol,
            decimals,
            apy: aprPercent(rate),
          } satisfies CompoundMarket;
        }),
      );

      return markets.filter((m): m is CompoundMarket => m !== null);
    },
  });
}
