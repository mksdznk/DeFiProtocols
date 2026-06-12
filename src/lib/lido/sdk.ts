// Lido's official SDK (viem-based). Liquid staking — depositing ETH for stETH —
// is an Ethereum-mainnet action: the SDK's L2 modules only wrap/unwrap wstETH,
// they don't stake. So the one "available network" for staking is Ethereum,
// taken from the SDK's own CHAINS enum rather than a hardcoded id.
//
// Lido also runs a public testnet (Hoodi); when the app's testnet mode is on we
// point staking at Hoodi so the real flow can be tried with faucet ETH. Both the
// mainnet and testnet chain ids come from the SDK's CHAINS enum.
//
// Only imported by a client-only, lazily-loaded component (the SDK pulls in
// graphql/ipfs deps), so it never runs on the server.
import { CHAINS, LidoSDK } from "@lidofinance/lido-ethereum-sdk";
import { parseEther } from "viem";
import { RPC_URLS } from "@/lib/wagmi";

export interface LidoNetwork {
  chainId: number;
  name: string;
}

const MAINNET: LidoNetwork = { chainId: CHAINS.Mainnet, name: "Ethereum" };
const TESTNET: LidoNetwork = { chainId: CHAINS.Hoodi, name: "Hoodi" };

/** The staking network for the current mode (mainnet Ethereum or Hoodi testnet). */
export function lidoNetwork(testnet = false): LidoNetwork {
  return testnet ? TESTNET : MAINNET;
}

/** Networks where Lido staking is available — one per mode (from the SDK). */
export function lidoNetworks(testnet = false): LidoNetwork[] {
  return [lidoNetwork(testnet)];
}

/** Block-explorer base for the active staking network. */
export function lidoExplorer(testnet = false): string {
  return testnet ? "https://hoodi.etherscan.io" : "https://etherscan.io";
}

const readSdks = new Map<number, LidoSDK>();
function getReadSdk(testnet: boolean): LidoSDK {
  const chainId = lidoNetwork(testnet).chainId;
  let sdk = readSdks.get(chainId);
  if (!sdk) {
    sdk = new LidoSDK({ chainId, rpcUrls: [RPC_URLS[chainId]] });
    readSdks.set(chainId, sdk);
  }
  return sdk;
}

/**
 * Current Lido staking APR as a percentage (e.g. 2.58 = 2.58%). Returns `null`
 * when unavailable — the statistics endpoint may not serve the testnet — so the
 * UI can degrade gracefully without blocking staking.
 */
export async function getLidoApr(testnet = false): Promise<number | null> {
  try {
    return await getReadSdk(testnet).statistics.apr.getLastApr();
  } catch {
    return null;
  }
}

/**
 * Stake ETH and receive stETH, signed through the connected wallet. Resolves to
 * the transaction hash once confirmed.
 */
export async function stakeEth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any,
  amountEth: string,
  testnet = false,
): Promise<string> {
  const chainId = lidoNetwork(testnet).chainId;
  const sdk = new LidoSDK({
    chainId,
    rpcUrls: [RPC_URLS[chainId]],
    walletClient,
  });
  const result = await sdk.stake.stakeEth({ value: parseEther(amountEth) });
  return result.hash;
}
