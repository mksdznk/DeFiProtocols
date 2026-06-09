// Backed's tokenized stocks ("xStocks") are standard ERC-20s deployed across
// several chains. The networks and the full product catalogue are sourced
// directly from Backed's official, machine-readable token list — never a
// hardcoded handful — so this stays correct as Backed adds stocks or chains.
//
// The friendly on-chain action is *buying* a tokenized stock: swap a stablecoin
// (USDC) into the xStock. Primary mint/redeem is KYC-gated to eligible
// participants, but the tokens trade permissionlessly on the secondary market,
// which is what a normal user can actually do here.

/** Backed's official xStocks token list (Uniswap token-list format). */
export const XSTOCKS_TOKENLIST_URL =
  "https://raw.githubusercontent.com/backed-fi/cowswap-xstocks-tokenlist/main/tokenlist.json";

export interface XStock {
  chainId: number;
  address: string;
  symbol: string;
  /** Display name, e.g. "Apple xStock". */
  name: string;
  decimals: number;
  logoURI?: string;
}

interface RawTokenList {
  tokens: XStock[];
}

let cache: XStock[] | null = null;

/** Fetch the full xStocks catalogue (cached for the session). */
export async function fetchXStocks(): Promise<XStock[]> {
  if (cache) return cache;
  const res = await fetch(XSTOCKS_TOKENLIST_URL);
  if (!res.ok) throw new Error(`xStocks list failed: ${res.status}`);
  const data: RawTokenList = await res.json();
  cache = data.tokens;
  return cache;
}

/** xStocks available on a given chain, sorted by symbol. */
export function xStocksForChain(tokens: XStock[], chainId: number): XStock[] {
  return tokens
    .filter((t) => t.chainId === chainId)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
}

export interface BackedNetwork {
  chainId: number;
  name: string;
}

/** Friendly names for the chains Backed deploys xStocks on. */
const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  56: "BNB Chain",
  42161: "Arbitrum",
  5000: "Mantle",
  999: "HyperEVM",
  57073: "Ink",
};

/**
 * The set of networks Backed offers xStocks on, derived from the token list
 * itself (so it grows automatically with Backed). Ethereum is surfaced first
 * since that's where secondary-market liquidity is currently deepest.
 */
export function backedNetworks(tokens: XStock[]): BackedNetwork[] {
  const ids = Array.from(new Set(tokens.map((t) => t.chainId)));
  ids.sort((a, b) => (a === 1 ? -1 : b === 1 ? 1 : a - b));
  return ids.map((chainId) => ({
    chainId,
    name: CHAIN_NAMES[chainId] ?? `Chain ${chainId}`,
  }));
}

export interface PayToken {
  address: string;
  symbol: string;
  decimals: number;
}

/**
 * The stablecoin used to buy on each chain (canonical USDC, resolved via LI.FI).
 * Kept simple — one "pay with" coin — so the flow stays beginner-friendly.
 */
export const USDC_BY_CHAIN: Record<number, PayToken> = {
  1: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", decimals: 6 },
  56: { address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", symbol: "USDC", decimals: 18 },
  42161: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", symbol: "USDC", decimals: 6 },
  5000: { address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9", symbol: "USDC", decimals: 6 },
  999: { address: "0xb88339CB7199b77E23DB6E890353E22632Ba630f", symbol: "USDC", decimals: 6 },
  57073: { address: "0x2D270e6886d130D724215A266106e6832161EAEd", symbol: "USDC", decimals: 6 },
};

const EXPLORERS: Record<number, string> = {
  1: "https://etherscan.io",
  56: "https://bscscan.com",
  42161: "https://arbiscan.io",
  5000: "https://mantlescan.xyz",
  999: "https://hyperevmscan.io",
  57073: "https://explorer.inkonchain.com",
};

/** Block-explorer link for a token address on a given chain. */
export function explorerTokenUrl(chainId: number, address: string): string | null {
  const base = EXPLORERS[chainId];
  return base ? `${base}/token/${address}` : null;
}
