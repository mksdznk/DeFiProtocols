import type { ProtocolConfig } from "@/protocols/types";
import { aaveResources } from "./resources";

/**
 * Aave — a decentralized, non-custodial liquidity (lending) protocol.
 *
 * Demonstrates the PDP framework with a protocol of a different category from
 * LiFi: lending metrics, an external-app interaction (app.aave.com) instead of
 * an embedded widget, and its own analytics adapter — all via config + adapters,
 * with no changes to the page, renderer, or section modules.
 *
 * Facts are kept conservative and verifiable against official sources
 * (aave.com / docs.aave.com).
 */
export const aaveConfig: ProtocolConfig = {
  slug: "aave",
  name: "Aave",
  tagline: "Earn yield and borrow against your crypto, non-custodially.",
  category: "Lending & borrowing money market",
  branding: {
    logoSrc: "/images/aave-logo.png",
    monogram: "Aa",
    // Aave violet.
    accent: "oklch(0.62 0.19 295)",
    accentForeground: "oklch(0.99 0 0)",
  },
  links: {
    website: "https://aave.com",
    docs: "https://docs.aave.com",
    twitter: "https://x.com/aave",
    github: "https://github.com/aave",
  },
  overview: {
    summary:
      "Aave is a decentralized, non-custodial liquidity protocol where users supply assets to earn yield or borrow against collateral. Interest rates adjust algorithmically with supply and demand, and every position is held by audited smart contracts — never a company.",
    highlights: [
      "Supply assets to earn passive yield via interest-bearing aTokens",
      "Borrow against collateral with variable rates",
      "GHO — Aave's native overcollateralized stablecoin",
      "Non-custodial: you sign every transaction",
    ],
    services: [
      {
        title: "Supply & earn",
        description:
          "Deposit assets to earn yield from interest paid by borrowers.",
        icon: "PiggyBank",
      },
      {
        title: "Borrow",
        description:
          "Borrow assets against your supplied collateral at variable rates.",
        icon: "HandCoins",
      },
      {
        title: "GHO stablecoin",
        description:
          "Mint Aave's native, overcollateralized, decentralized stablecoin.",
        icon: "Coins",
      },
      {
        title: "Flash loans",
        description:
          "Borrow without collateral within a single atomic transaction.",
        icon: "Zap",
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
      { name: "Metis" },
      { name: "BNB Chain" },
      { name: "Scroll" },
      { name: "zkSync Era" },
    ],
    wallets: ["MetaMask", "Rabby", "Coinbase Wallet", "WalletConnect"],
  },
  integrations: [
    { name: "Chainlink", category: "Oracles" },
    { name: "Chaos Labs", category: "Risk" },
    { name: "Gauntlet", category: "Risk" },
    { name: "Lido (wstETH)", category: "Collateral" },
    { name: "Rocket Pool (rETH)", category: "Collateral" },
    { name: "Balancer", category: "GHO liquidity" },
  ],
  security: {
    audits: [
      { auditor: "See official security disclosures", url: "https://docs.aave.com" },
    ],
    bugBounty: {
      provider: "Immunefi",
      url: "https://immunefi.com/bug-bounty/aave",
    },
    notes: [
      "Borrowing carries liquidation risk: if your health factor falls below 1, collateral can be liquidated to repay debt.",
      "As with any DeFi protocol, smart-contract, oracle, and interest-rate risks apply. Review positions and the official docs before transacting.",
      "Refer to the official documentation for the current, authoritative list of audits and security disclosures.",
    ],
  },
  resources: aaveResources,
  metricKeys: [
    "totalValueLocked",
    "totalSupplied",
    "totalBorrowed",
    "activeMarkets",
    "supportedAssets",
    "utilizationRate",
  ],
  interaction: {
    kind: "external",
    url: "https://app.aave.com",
    label: "Open Aave app",
    note: "Supply, borrow, and manage positions in the official Aave app. Non-custodial — you sign every transaction and keep control of your funds.",
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
