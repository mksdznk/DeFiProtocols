import type { ProtocolConfig } from "@/protocols/types";
import { lifiResources } from "./resources";

/**
 * LiFi (LI.FI) — the first protocol implemented on the PDP framework.
 *
 * Facts here are intentionally conservative and verifiable against official
 * sources (li.fi / docs.li.fi). The interaction widget reflects the live,
 * route-able chain/token set at runtime, so this config avoids hard-coding
 * exhaustive lists that would drift.
 */
export const lifiConfig: ProtocolConfig = {
  slug: "lifi",
  name: "LI.FI",
  tagline: "Any-to-any cross-chain swaps and bridging, aggregated.",
  category: "Cross-chain liquidity & messaging aggregator",
  branding: {
    logoSrc: "/images/lifi-logo.png",
    monogram: "Li",
    // LI.FI brand orange/red.
    accent: "oklch(0.8801 0.0997 321.97)",
    accentForeground: "oklch(0.99 0 0)",
  },
  links: {
    website: "https://li.fi",
    docs: "https://docs.li.fi",
    twitter: "https://x.com/lifiprotocol",
    github: "https://github.com/lifinance",
  },
  beginner: {
    inSimpleTerms:
      "LI.FI helps you move your crypto from one network to another, or swap one coin for another, in just a few clicks.",
    analogy:
      "It's like sending money between two different apps that don't normally talk to each other.",
    firstSteps: [
      "Connect your wallet using the button at the top.",
      "Choose the coin you have and the coin you want.",
      "Press the button and approve it in your wallet.",
    ],
  },
  overview: {
    summary:
      "LI.FI is a cross-chain liquidity aggregation and messaging protocol. It connects dozens of bridges and decentralized exchanges behind a single interface, then discovers, compares, and executes the best route to swap or move assets between blockchains — non-custodially, from your own wallet.",
    highlights: [
      "Aggregates many bridges and DEXs into one routing engine",
      "Any-to-any swaps and bridging across a large set of chains",
      "Route discovery and comparison with fees and time estimates",
      "Non-custodial: you sign every transaction",
    ],
    services: [
      {
        title: "Cross-chain swaps",
        description:
          "Swap a token on one chain for a token on another in a single flow.",
        icon: "ArrowLeftRight",
      },
      {
        title: "Bridging",
        description:
          "Move assets between chains using the most efficient available bridge.",
        icon: "Cable",
      },
      {
        title: "Route discovery & comparison",
        description:
          "Compare candidate routes by output, fees, and estimated time.",
        icon: "Route",
      },
      {
        title: "Execution & monitoring",
        description:
          "Execute the chosen route and track its status to completion.",
        icon: "Activity",
      },
    ],
    chains: [
      { name: "Ethereum" },
      { name: "Arbitrum" },
      { name: "Optimism" },
      { name: "Base" },
      { name: "Polygon" },
      { name: "BNB Chain" },
      { name: "Avalanche" },
      { name: "Gnosis" },
      { name: "Linea" },
      { name: "Scroll" },
      { name: "zkSync Era" },
      { name: "Solana" },
    ],
    wallets: ["MetaMask", "Rabby", "Coinbase Wallet", "WalletConnect"],
  },
  integrations: [
    { name: "Across", category: "Bridge" },
    { name: "Stargate", category: "Bridge" },
    { name: "Hop", category: "Bridge" },
    { name: "Circle CCTP", category: "Bridge" },
    { name: "1inch", category: "DEX aggregator" },
    { name: "0x", category: "DEX aggregator" },
    { name: "Uniswap", category: "DEX" },
    { name: "Sushi", category: "DEX" },
  ],
  security: {
    audits: [
      {
        auditor: "See official security disclosures",
        url: "https://docs.li.fi",
      },
    ],
    bugBounty: {
      provider: "Immunefi",
      url: "https://immunefi.com",
    },
    notes: [
      "LI.FI aggregates third-party bridges and exchanges. When you transact, you also take on the risk of the specific bridge/DEX selected for your route.",
      "Always review the destination chain, token, expected output, and fees before confirming, and verify contract approvals.",
      "Refer to the official documentation for the current, authoritative list of audits and security disclosures.",
    ],
  },
  resources: lifiResources,
  metricKeys: [
    "totalVolume",
    "volume24h",
    "totalTransactions",
    "activeUsers30d",
    "supportedChains",
    "routeSuccessRate",
  ],
  interaction: { kind: "lifi-sdk" },
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
