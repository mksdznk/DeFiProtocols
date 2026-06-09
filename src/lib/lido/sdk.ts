// Lido's official SDK (viem-based). Liquid staking — depositing ETH for stETH —
// is an Ethereum-mainnet action: the SDK's L2 modules only wrap/unwrap wstETH,
// they don't stake. So the one "available network" for staking is Ethereum,
// taken from the SDK's own CHAINS enum rather than a hardcoded id.
//
// Only imported by a client-only, lazily-loaded component (the SDK pulls in
// graphql/ipfs deps), so it never runs on the server.
import { CHAINS, LidoSDK } from "@lidofinance/lido-ethereum-sdk";
import { parseEther } from "viem";
import { RPC_URLS } from "@/lib/wagmi";

export const LIDO_CHAIN_ID = CHAINS.Mainnet;

export interface LidoNetwork {
  chainId: number;
  name: string;
}

/** Networks where Lido staking is available (from the SDK — currently Ethereum). */
export const LIDO_NETWORKS: LidoNetwork[] = [
  { chainId: CHAINS.Mainnet, name: "Ethereum" },
];

const RPC = RPC_URLS[LIDO_CHAIN_ID];

let readSdk: LidoSDK | null = null;
function getReadSdk(): LidoSDK {
  if (!readSdk) {
    readSdk = new LidoSDK({ chainId: LIDO_CHAIN_ID, rpcUrls: [RPC] });
  }
  return readSdk;
}

/** Current Lido staking APR, as a percentage (e.g. 2.58 = 2.58%). */
export async function getLidoApr(): Promise<number> {
  return getReadSdk().statistics.apr.getLastApr();
}

/**
 * Stake ETH and receive stETH, signed through the connected wallet. Resolves to
 * the transaction hash once confirmed.
 */
export async function stakeEth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any,
  amountEth: string,
): Promise<string> {
  const sdk = new LidoSDK({
    chainId: LIDO_CHAIN_ID,
    rpcUrls: [RPC],
    walletClient,
  });
  const result = await sdk.stake.stakeEth({ value: parseEther(amountEth) });
  return result.hash;
}
