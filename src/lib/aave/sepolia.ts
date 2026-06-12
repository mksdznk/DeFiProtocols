import { sepolia } from "wagmi/chains";

/**
 * Aave v3 on Sepolia (testnet), read/written via its contracts directly.
 *
 * Aave's unified SDK/API doesn't expose a usable public testnet, so the app's
 * testnet mode talks to the v3 Sepolia Pool itself: the reserve list, each
 * reserve's symbol/decimals, and the live supply APY are read on-chain, and a
 * deposit is an `approve` + `Pool.supply`. Faucet test tokens are available from
 * the Aave testnet faucet, so the whole earn flow can be tried with no real money.
 */
export const AAVE_SEPOLIA_CHAIN_ID = sepolia.id;

/** Aave v3 Sepolia Pool proxy. */
export const AAVE_SEPOLIA_POOL =
  "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951" as const;

export const aavePoolAbi = [
  {
    name: "getReservesList",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address[]" }],
  },
  {
    name: "getReserveData",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "configuration", type: "uint256" },
          { name: "liquidityIndex", type: "uint128" },
          { name: "currentLiquidityRate", type: "uint128" },
          { name: "variableBorrowIndex", type: "uint128" },
          { name: "currentVariableBorrowRate", type: "uint128" },
          { name: "currentStableBorrowRate", type: "uint128" },
          { name: "lastUpdateTimestamp", type: "uint40" },
          { name: "id", type: "uint16" },
          { name: "aTokenAddress", type: "address" },
          { name: "stableDebtTokenAddress", type: "address" },
          { name: "variableDebtTokenAddress", type: "address" },
          { name: "interestRateStrategyAddress", type: "address" },
          { name: "accruedToTreasury", type: "uint128" },
          { name: "unbacked", type: "uint128" },
          { name: "isolationModeTotalDebt", type: "uint128" },
        ],
      },
    ],
  },
  {
    name: "supply",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
] as const;

export const aaveErc20Abi = [
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "allowance", type: "function", stateMutability: "view", inputs: [{ type: "address" }, { type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;

/** Aave's per-reserve liquidity rate is a RAY (1e27) APR; render as a percentage. */
export function raySupplyApy(currentLiquidityRate: bigint): number {
  return (Number(currentLiquidityRate) / 1e27) * 100;
}
