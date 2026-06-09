import { arbitrum, base, bsc, mainnet, scroll, zksync } from "viem/chains";
import type { SupportedChainId } from "@/lib/wagmi";

/**
 * Maverick V2 data + contracts.
 *
 * The supported networks, tokens, and pools all come from Maverick's own API
 * (nothing hardcoded) — the network list is derived from the chains the API
 * reports, intersected with the chains this app is configured for. Quotes and
 * swaps go through Maverick's Quoter/Router contracts: the same addresses across
 * EVM chains (CREATE2), with zkSync Era deployed separately (different VM).
 */

const API = "https://v2-api.mav.xyz";

// EVM-equivalent chains share the same CREATE2 addresses; zkSync Era differs.
const EVM_QUOTER = "0xb40AfdB85a07f37aE217E7D6462e609900dD8D7A" as const;
const EVM_ROUTER = "0x62e31802c6145A2D5E842EeD8efe01fC224422fA" as const;

export interface MaverickContracts {
  quoter: `0x${string}`;
  router: `0x${string}`;
}

export const MAVERICK_CONTRACTS: Record<number, MaverickContracts> = {
  [mainnet.id]: { quoter: EVM_QUOTER, router: EVM_ROUTER },
  [base.id]: { quoter: EVM_QUOTER, router: EVM_ROUTER },
  [arbitrum.id]: { quoter: EVM_QUOTER, router: EVM_ROUTER },
  [bsc.id]: { quoter: EVM_QUOTER, router: EVM_ROUTER },
  [scroll.id]: { quoter: EVM_QUOTER, router: EVM_ROUTER },
  [zksync.id]: {
    quoter: "0x3e1c4b57c9d9624f2841f07C6328D3c25ca30C79",
    router: "0xad8262e847676E7eDdAFEe664c4fd492789260ba",
  },
};

// Swap fully (no price limit): max tick when selling tokenA, min tick otherwise.
export const TICK_MAX = 2_147_483_647;
export const TICK_MIN = -2_147_483_648;

// Chains the app supports (wagmi config) where Maverick is deployed.
const SUPPORTED: Record<number, { name: string; chainId: SupportedChainId }> = {
  [mainnet.id]: { name: mainnet.name, chainId: mainnet.id },
  [base.id]: { name: base.name, chainId: base.id },
  [arbitrum.id]: { name: arbitrum.name, chainId: arbitrum.id },
  [bsc.id]: { name: "BNB Chain", chainId: bsc.id },
  [zksync.id]: { name: "zkSync Era", chainId: zksync.id },
  [scroll.id]: { name: scroll.name, chainId: scroll.id },
};

export interface MaverickNetwork {
  chainId: SupportedChainId;
  name: string;
}

export interface MaverickToken {
  address: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

export interface MaverickPool {
  id: `0x${string}`;
  tokenA: string;
  tokenB: string;
  tvl: number;
}

export interface MaverickData {
  tokens: MaverickToken[];
  pools: MaverickPool[];
}

export const quoterAbi = [
  {
    name: "calculateSwap",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "pool", type: "address" },
      { name: "amount", type: "uint128" },
      { name: "tokenAIn", type: "bool" },
      { name: "exactOutput", type: "bool" },
      { name: "tickLimit", type: "int32" },
    ],
    outputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOut", type: "uint256" },
      { name: "gasEstimate", type: "uint256" },
    ],
  },
] as const;

export const routerAbi = [
  {
    name: "inputSingleWithTickLimit",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "pool", type: "address" },
      { name: "tokenAIn", type: "bool" },
      { name: "amountIn", type: "uint256" },
      { name: "tickLimit", type: "int32" },
      { name: "amountOutMinimum", type: "uint256" },
    ],
    outputs: [
      { name: "amountIn_", type: "uint256" },
      { name: "amountOut", type: "uint256" },
    ],
  },
] as const;

export const erc20Abi = [
  { name: "allowance", type: "function", stateMutability: "view", inputs: [{ type: "address" }, { type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;

interface ApiToken {
  address?: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
}
interface ApiPool {
  id?: string;
  chainId?: number;
  tokenA?: ApiToken;
  tokenB?: ApiToken;
  tvl?: number | { amount?: number };
}

function tvlOf(pool: ApiPool): number {
  return typeof pool.tvl === "object" ? (pool.tvl?.amount ?? 0) : (pool.tvl ?? 0);
}

/** Networks Maverick reports, intersected with the chains this app supports. */
export async function fetchMaverickNetworks(): Promise<MaverickNetwork[]> {
  const res = await fetch(`${API}/api/v5/pools`);
  if (!res.ok) throw new Error(`Failed to load Maverick networks (${res.status})`);
  const data = (await res.json()) as { pools?: ApiPool[] };

  const ids = new Set<number>();
  for (const pool of data.pools ?? []) {
    if (pool.chainId != null && SUPPORTED[pool.chainId]) ids.add(pool.chainId);
  }
  return [...ids]
    .map((id) => SUPPORTED[id])
    .sort((a, b) => a.chainId - b.chainId);
}

/** Tokens + pools for a network, from the Maverick API. */
export async function fetchMaverickData(chainId: number): Promise<MaverickData> {
  const res = await fetch(`${API}/api/v5/pools/${chainId}`);
  if (!res.ok) throw new Error(`Failed to load Maverick pools (${res.status})`);
  const data = (await res.json()) as { pools?: ApiPool[] };

  const tokens = new Map<string, MaverickToken>();
  const pools: MaverickPool[] = [];

  for (const pool of data.pools ?? []) {
    const a = pool.tokenA;
    const b = pool.tokenB;
    if (!pool.id || !a?.address || !b?.address) continue;
    addToken(tokens, a);
    addToken(tokens, b);
    pools.push({
      id: pool.id as `0x${string}`,
      tokenA: a.address,
      tokenB: b.address,
      tvl: tvlOf(pool),
    });
  }

  return {
    tokens: [...tokens.values()].sort((a, b) => a.symbol.localeCompare(b.symbol)),
    pools,
  };
}

function addToken(map: Map<string, MaverickToken>, t: ApiToken) {
  const key = t.address?.toLowerCase();
  if (!key || map.has(key) || t.symbol == null || t.decimals == null) return;
  map.set(key, {
    address: t.address!,
    symbol: t.symbol,
    decimals: t.decimals,
    logoURI: t.logoURI,
  });
}
