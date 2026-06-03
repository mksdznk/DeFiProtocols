import type { ProtocolConfig } from "@/protocols/types";
import { lidoResources } from "./resources";

/**
 * Lido — Ethereum liquid staking.
 *
 * Sixth protocol and a fourth category (liquid staking, distinct from bridge,
 * lending, and DEX). Added as pure config + adapter; it introduces staking
 * metrics (APR / stakers / market share) that now live in the generic metric
 * set, so no framework or component changes were needed.
 *
 * Facts are kept conservative and verifiable against official sources
 * (lido.fi / docs.lido.fi). Staking is on Ethereum; wstETH is available on
 * several L2s.
 */
export const lidoConfig: ProtocolConfig = {
  slug: "lido",
  name: "Lido",
  tagline: "Stake ETH, stay liquid with stETH, and earn staking rewards.",
  category: "Ethereum liquid staking",
  branding: {
    logoSrc: "/images/lido-logo.png",
    monogram: "Ld",
    // Lido coral/rose.
    accent: "oklch(0.66 0.16 350)",
    accentForeground: "oklch(0.99 0 0)",
  },
  links: {
    website: "https://lido.fi",
    docs: "https://docs.lido.fi",
    twitter: "https://x.com/LidoFinance",
    github: "https://github.com/lidofinance",
  },
  overview: {
    summary:
      "Lido is a liquid staking protocol for Ethereum. Stake ETH and receive stETH — a token that represents your staked ETH plus accruing rewards while staying liquid and usable across DeFi. Staking is non-custodial and delegated to a set of DAO-curated node operators, with LDO governance overseeing the protocol.",
    highlights: [
      "Stake any amount of ETH and receive reward-bearing stETH",
      "Use stETH / wstETH across DeFi while still earning staking yield",
      "Non-custodial, with DAO-curated node operators",
      "LDO governance over operators and protocol parameters",
    ],
    services: [
      {
        title: "Stake ETH",
        description: "Stake ETH to receive stETH and start earning rewards.",
        icon: "PiggyBank",
      },
      {
        title: "Earn staking rewards",
        description: "stETH accrues Ethereum staking rewards automatically.",
        icon: "Coins",
      },
      {
        title: "Use stETH in DeFi",
        description: "Use stETH / wstETH as collateral or liquidity elsewhere.",
        icon: "Landmark",
      },
      {
        title: "Unstake",
        description: "Redeem stETH for ETH via the withdrawal queue.",
        icon: "Wallet",
      },
    ],
    chains: [
      { name: "Ethereum" },
      { name: "Arbitrum" },
      { name: "Optimism" },
      { name: "Base" },
      { name: "Polygon" },
      { name: "Scroll" },
      { name: "Linea" },
    ],
    wallets: ["MetaMask", "Rabby", "Coinbase Wallet", "WalletConnect"],
  },
  integrations: [
    { name: "Aave", category: "Lending" },
    { name: "MakerDAO / Sky", category: "Lending" },
    { name: "Curve", category: "Liquidity" },
    { name: "Balancer", category: "Liquidity" },
    { name: "Chainlink", category: "Oracles" },
  ],
  security: {
    audits: [
      { auditor: "See official security disclosures", url: "https://docs.lido.fi" },
    ],
    bugBounty: {
      provider: "Immunefi",
      url: "https://immunefi.com",
    },
    notes: [
      "stETH can trade below the price of ETH on secondary markets, especially during periods of stress or long withdrawal queues.",
      "Validator slashing is a risk, mitigated by DAO-curated node operators; smart-contract and oracle risks also apply.",
      "Refer to the official documentation for the current, authoritative list of audits and security disclosures.",
    ],
  },
  resources: lidoResources,
  metricKeys: [
    "totalValueLocked",
    "stakingApr",
    "totalStakers",
    "marketShare",
    "supportedChains",
  ],
  interaction: {
    kind: "external",
    url: "https://stake.lido.fi",
    label: "Open Lido app",
    note: "Stake ETH, wrap/unwrap stETH, and request withdrawals in the official Lido app. Non-custodial — you sign every transaction and keep control of your funds.",
  },
  sections: [
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
