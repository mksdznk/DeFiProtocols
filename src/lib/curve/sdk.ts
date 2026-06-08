// curve-js is the official Curve SDK. Its default export is a singleton bound to
// one network at a time, so switching networks (or moving between read and
// wallet modes) means re-initializing it. All such operations run through a
// single lock so they never overlap.
//
// Only ever imported by a client-only, lazily-loaded component (curve-js isn't
// SSR-safe), so it never runs on the server.
import curveDefault from "@curvefi/api";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";
import { RPC_URLS } from "@/lib/wagmi";

// The SDK's wallet-provider types are strict; use it loosely to interop with
// the wagmi connector's EIP-1193 provider.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const curve = curveDefault as any;

export interface CurveNetwork {
  chainId: number;
  name: string;
}

/** Curve deployments the app is configured for (has RPC + wallet support). */
export const CURVE_NETWORKS: CurveNetwork[] = [
  { chainId: mainnet.id, name: mainnet.name },
  { chainId: arbitrum.id, name: arbitrum.name },
  { chainId: optimism.id, name: optimism.name },
  { chainId: base.id, name: base.name },
  { chainId: polygon.id, name: polygon.name },
];

export interface CurveTokenInfo {
  address: string;
  symbol: string;
  decimals: number;
}

// Pool registries to load so the router and token list are complete.
const FETCHERS = [
  "factory",
  "stableNgFactory",
  "cryptoFactory",
  "twocryptoFactory",
  "tricryptoFactory",
  "crvUSDFactory",
];

let currentChain: number | null = null;
let lock: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lock.then(fn, fn);
  lock = run.then(
    () => {},
    () => {},
  );
  return run;
}

async function loadPools(): Promise<void> {
  await Promise.all(
    FETCHERS.map((f) =>
      curve[f]?.fetchPools ? curve[f].fetchPools(true).catch(() => {}) : null,
    ),
  );
}

async function initRead(chainId: number): Promise<void> {
  await curve.init("JsonRpc", { url: RPC_URLS[chainId] }, { chainId });
  await loadPools();
  currentChain = chainId;
}

/** All swappable underlying tokens on a chain (deduped by address). */
export function fetchCurveTokens(chainId: number): Promise<CurveTokenInfo[]> {
  return withLock(async () => {
    if (currentChain !== chainId) await initRead(chainId);
    const ids: string[] = curve.getPoolList();
    const map = new Map<string, CurveTokenInfo>();
    for (const id of ids) {
      try {
        const pool = curve.getPool(id);
        const symbols: string[] = pool.underlyingCoins ?? [];
        const addresses: string[] = pool.underlyingCoinAddresses ?? [];
        const decimals: number[] = pool.underlyingDecimals ?? [];
        for (let i = 0; i < addresses.length; i++) {
          const key = addresses[i]?.toLowerCase();
          if (key && !map.has(key)) {
            map.set(key, {
              address: addresses[i],
              symbol: symbols[i] ?? "?",
              decimals: Number(decimals[i]) || 18,
            });
          }
        }
      } catch {
        // skip pools that fail to load
      }
    }
    return [...map.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
  });
}

/** Expected output amount for a swap (read-only quote). */
export function getCurveExpected(
  chainId: number,
  fromToken: string,
  toToken: string,
  amount: string,
): Promise<string> {
  return withLock(async () => {
    if (currentChain !== chainId) await initRead(chainId);
    return curve.router.expected(fromToken, toToken, amount);
  });
}

/** Re-initialize with the connected wallet so a swap can be signed on `chainId`. */
export function initWriteForChain(
  provider: unknown,
  chainId: number,
): Promise<void> {
  return withLock(async () => {
    await curve.init("Web3", { externalProvider: provider }, { chainId });
    await loadPools();
    currentChain = chainId;
  });
}

/** Drop the current network binding (e.g. after a swap) so reads re-init fresh. */
export function resetCurveNetwork(): void {
  currentChain = null;
}
