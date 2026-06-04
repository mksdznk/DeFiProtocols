import { getTokens } from "@lifi/sdk";
import type { Token } from "@lifi/sdk";

/**
 * A small, curated set of chains and tokens for the beginner swap UI. Keeping
 * the choices short (a few popular networks and coins) is what makes the
 * experience simple — the full long-tail lives in the advanced widget.
 *
 * Real token addresses/decimals come from the LI.FI token API, so quotes and
 * execution use correct on-chain data — we only curate which symbols to show.
 */

export interface EasyChain {
  id: number;
  name: string;
}

export const EASY_CHAINS: EasyChain[] = [
  { id: 1, name: "Ethereum" },
  { id: 8453, name: "Base" },
  { id: 42161, name: "Arbitrum" },
  { id: 10, name: "Optimism" },
  { id: 137, name: "Polygon" },
];

export function chainName(id: number): string {
  return EASY_CHAINS.find((c) => c.id === id)?.name ?? `Chain ${id}`;
}

/** Symbols to surface, in display order. */
const CURATED_SYMBOLS = ["ETH", "WETH", "USDC", "USDT", "DAI", "POL", "MATIC"];

export type EasyTokenMap = Record<number, Token[]>;

/** Fetch the real token list for the curated chains, filtered to popular coins. */
export async function fetchEasyTokens(): Promise<EasyTokenMap> {
  const res = await getTokens({ chains: EASY_CHAINS.map((c) => c.id) });
  const out: EasyTokenMap = {};

  for (const chain of EASY_CHAINS) {
    const all = res.tokens[chain.id] ?? [];
    const picked: Token[] = [];
    for (const symbol of CURATED_SYMBOLS) {
      const match = all.find((t) => t.symbol.toUpperCase() === symbol);
      if (match && !picked.some((p) => p.symbol.toUpperCase() === symbol)) {
        picked.push(match);
      }
    }
    out[chain.id] = picked.length > 0 ? picked : all.slice(0, 6);
  }

  return out;
}
