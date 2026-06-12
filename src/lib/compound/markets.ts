import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";
import type { SupportedChainId } from "@/lib/wagmi";

/**
 * Compound III markets.
 *
 * The market list (Comet contract addresses, per chain) is sourced from the
 * community-maintained aggregator rather than hardcoded — so new markets appear
 * automatically. Everything else (base token, symbol, decimals, supply APY,
 * allowances, balances) is read live from the Comet contracts.
 *
 * Markets on chains the app isn't configured for are skipped (we can't read or
 * transact without a transport/connector for them).
 */
export interface CometMarket {
  chainId: SupportedChainId;
  comet: `0x${string}`;
}

const MARKETS_SOURCE_URL =
  "https://raw.githubusercontent.com/woof-software/compound-docs-aggregator/main/output.json";

/** Aggregator network names → chain ids we support in the wagmi config. */
const NETWORK_TO_CHAIN_ID: Record<string, SupportedChainId> = {
  mainnet: mainnet.id,
  arbitrum: arbitrum.id,
  base: base.id,
  optimism: optimism.id,
  polygon: polygon.id,
};

interface AggregatorMarket {
  contracts?: { comet?: string };
}
interface AggregatorOutput {
  markets?: Record<string, Record<string, AggregatorMarket>>;
}

/**
 * Compound III testnet markets (Sepolia). The aggregator only lists mainnet
 * deployments, so the test market is named here; everything else (base token,
 * symbol, APY) is still read live from the Comet contract, same as mainnet.
 */
const TESTNET_MARKETS: CometMarket[] = [
  // cUSDCv3 on Sepolia (base asset: USDC). Faucet via app.compound.finance.
  { chainId: sepolia.id, comet: "0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e" },
];

/**
 * Fetch the current Compound III market list (Comet addresses) per chain.
 * In testnet mode, returns the test deployments instead of the mainnet markets.
 */
export async function fetchCometMarkets(
  testnet = false,
): Promise<CometMarket[]> {
  if (testnet) return TESTNET_MARKETS;

  const res = await fetch(MARKETS_SOURCE_URL);
  if (!res.ok) {
    throw new Error(`Failed to load Compound markets (${res.status})`);
  }
  const data = (await res.json()) as AggregatorOutput;

  const out: CometMarket[] = [];
  for (const [network, group] of Object.entries(data.markets ?? {})) {
    const chainId = NETWORK_TO_CHAIN_ID[network];
    if (!chainId) continue; // chain not configured in this app
    for (const market of Object.values(group ?? {})) {
      const comet = market?.contracts?.comet;
      if (typeof comet === "string" && comet.startsWith("0x")) {
        out.push({ chainId, comet: comet as `0x${string}` });
      }
    }
  }
  return out;
}

export const cometAbi = [
  { name: "baseToken", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { name: "getUtilization", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "getSupplyRate", type: "function", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "uint64" }] },
  { name: "supply", type: "function", stateMutability: "nonpayable", inputs: [{ name: "asset", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] },
] as const;

export const erc20Abi = [
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "allowance", type: "function", stateMutability: "view", inputs: [{ type: "address" }, { type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;

/** Comet's per-second supply rate (1e18-scaled) as an annual percentage. */
export function aprPercent(supplyRatePerSecond: bigint): number {
  return (Number(supplyRatePerSecond) / 1e18) * 31_536_000 * 100;
}
