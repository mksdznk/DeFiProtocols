import type { ProtocolConfig } from "@/protocols/types";
import { curveResources } from "./resources";

/**
 * Curve — a stableswap AMM / DEX optimized for low-slippage swaps of pegged
 * assets, plus liquidity pools, CRV governance, and the crvUSD stablecoin.
 *
 * Fourth protocol on the PDP framework and a third category (DEX/AMM, distinct
 * from LiFi's bridge and Aave/Compound's lending). Added as pure config +
 * adapter: it mixes volume metrics (like a bridge) with TVL (like a lending
 * market), both already in the generic metric set — no framework changes.
 *
 * Facts are kept conservative and verifiable against official sources
 * (curve.finance / docs.curve.fi).
 */
export const curveConfig: ProtocolConfig = {
  slug: "curve",
  name: "Curve",
  tagline: "Low-slippage swaps and deep liquidity for stablecoins and pegged assets.",
  category: "Stableswap AMM & DEX",
  branding: {
    logoSrc: "/images/curve-logo.png",
    monogram: "Cr",
    // Curve blue.
    accent: "oklch(0.58 0.18 255)",
    accentForeground: "oklch(0.99 0 0)",
  },
  links: {
    website: "https://curve.finance",
    docs: "https://docs.curve.fi",
    twitter: "https://x.com/CurveFinance",
    github: "https://github.com/curvefi",
  },
  beginner: {
    inSimpleTerms:
      "Curve lets you swap similar coins — like different dollar-coins — with very small fees, and earn by adding your coins to a shared pool.",
    analogy:
      "It's like a money-exchange booth that's really good at swapping things worth about the same.",
    firstSteps: [
      "Connect your wallet.",
      "Pick the coin you have and the coin you want.",
      "Make the swap and approve it in your wallet.",
    ],
  },
  overview: {
    summary:
      "Curve is a decentralized exchange and automated market maker built for swapping stablecoins and other pegged assets with minimal slippage. Liquidity providers earn trading fees and CRV rewards, while CRV governance (veCRV) and the crvUSD stablecoin round out the ecosystem — all non-custodial.",
    highlights: [
      "Low-slippage swaps for stablecoins and pegged assets",
      "Earn trading fees and CRV rewards by providing liquidity",
      "veCRV governance and reward boosting",
      "crvUSD — Curve's native overcollateralized stablecoin",
    ],
    services: [
      {
        title: "Swap",
        description:
          "Swap stablecoins and pegged assets with very low slippage.",
        icon: "ArrowLeftRight",
      },
      {
        title: "Provide liquidity",
        description:
          "Deposit into pools to earn trading fees and CRV rewards.",
        icon: "Coins",
      },
      {
        title: "Lock & govern (veCRV)",
        description:
          "Lock CRV for veCRV to vote on gauges and boost rewards.",
        icon: "Landmark",
      },
      {
        title: "crvUSD",
        description:
          "Mint Curve's native stablecoin against collateral via LLAMMA.",
        icon: "HandCoins",
      },
    ],
    chains: [
      { name: "Ethereum" },
      { name: "Arbitrum" },
      { name: "Optimism" },
      { name: "Base" },
      { name: "Polygon" },
      { name: "Avalanche" },
      { name: "Gnosis" },
      { name: "Fraxtal" },
      { name: "Mantle" },
    ],
    wallets: ["MetaMask", "Rabby", "Coinbase Wallet", "WalletConnect"],
  },
  integrations: [
    { name: "Convex Finance", category: "Yield" },
    { name: "Yearn", category: "Yield" },
    { name: "Stake DAO", category: "Yield" },
    { name: "Chainlink", category: "Oracles" },
    { name: "Frax", category: "Stablecoin" },
  ],
  security: {
    audits: [
      {
        auditor: "See official security disclosures",
        url: "https://docs.curve.fi",
      },
    ],
    bugBounty: {
      provider: "Immunefi",
      url: "https://immunefi.com",
    },
    notes: [
      "Providing liquidity exposes you to impermanent loss and the risk that a pegged asset loses its peg.",
      "crvUSD borrowing carries liquidation risk via the soft-liquidation (LLAMMA) mechanism.",
      "Smart-contract and oracle risks apply. Review each pool or market and the official docs before transacting.",
    ],
  },
  resources: curveResources,
  metricKeys: [
    "totalValueLocked",
    "volume24h",
    "volume7d",
    "totalVolume",
    "supportedChains",
    "supportedTokens",
  ],
  interaction: { kind: "curve-sdk" },
  sections: [
    { type: "beginner" },
    { type: "overview" },
    { type: "metrics" },
    { type: "interaction" },
    { type: "analytics" },
    { type: "integrations" },
    { type: "resources" },
    { type: "security" },
    { type: "faq" },
  ],
};
