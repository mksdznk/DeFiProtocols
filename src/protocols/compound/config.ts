import type { ProtocolConfig } from "@/protocols/types";
import { compoundResources } from "./resources";

/**
 * Compound — an algorithmic, non-custodial money market (lending) protocol.
 *
 * Third protocol on the PDP framework, same category as Aave — added as pure
 * config + adapter, reusing the lending metrics, the external-app interaction,
 * and the generalized analytics with no framework changes.
 *
 * Facts are kept conservative and verifiable against official sources
 * (compound.finance / docs.compound.finance).
 */
export const compoundConfig: ProtocolConfig = {
  slug: "compound",
  name: "Compound",
  tagline: "Earn interest and borrow assets through an algorithmic money market.",
  category: "Lending & borrowing money market",
  branding: {
    logoSrc: "/images/compound-logo.png",
    monogram: "Co",
    // Compound green.
    accent: "oklch(0.767 0.1651 163.27)",
    accentForeground: "oklch(0.21 0.02 165)",
  },
  links: {
    website: "https://compound.finance",
    docs: "https://docs.compound.finance",
    twitter: "https://x.com/compoundfinance",
    github: "https://github.com/compound-finance",
  },
  beginner: {
    inSimpleTerms:
      "Compound lets you earn interest by lending out your crypto, or borrow crypto by putting some of your own up as a deposit.",
    analogy:
      "It's like a shared money pool: lenders earn a little, borrowers pay a little, and code keeps it fair.",
    firstSteps: [
      "Get a wallet with some crypto in it.",
      "Open the Compound app and connect your wallet.",
      "Choose a coin to supply and confirm in your wallet.",
    ],
  },
  overview: {
    summary:
      "Compound is a decentralized, non-custodial money market protocol. Users supply assets to earn interest or borrow against collateral, with rates set algorithmically by supply and demand. Compound III focuses each market on a single borrowable base asset with a set of collateral assets, for capital efficiency and clearer risk.",
    highlights: [
      "Supply the base asset to earn algorithmic interest",
      "Borrow a single base asset against multiple collateral types",
      "Earn COMP rewards on supported markets",
      "Non-custodial: you sign every transaction",
    ],
    services: [
      {
        title: "Supply & earn",
        description:
          "Deposit a market's base asset to earn interest from borrowers.",
        icon: "PiggyBank",
      },
      {
        title: "Borrow",
        description:
          "Borrow the base asset against your supplied collateral.",
        icon: "HandCoins",
      },
      {
        title: "Provide collateral",
        description:
          "Supply collateral assets to unlock borrowing capacity.",
        icon: "Landmark",
      },
      {
        title: "Earn COMP",
        description:
          "Accrue COMP rewards for participating in supported markets.",
        icon: "Coins",
      },
    ],
    chains: [
      { name: "Ethereum" },
      { name: "Arbitrum" },
      { name: "Optimism" },
      { name: "Base" },
      { name: "Polygon" },
      { name: "Scroll" },
      { name: "Mantle" },
    ],
    wallets: ["MetaMask", "Rabby", "Coinbase Wallet", "WalletConnect"],
  },
  integrations: [
    { name: "Chainlink", category: "Oracles" },
    { name: "Gauntlet", category: "Risk" },
    { name: "Chaos Labs", category: "Risk" },
    { name: "OpenZeppelin", category: "Governance & security" },
  ],
  security: {
    audits: [
      {
        auditor: "See official security disclosures",
        url: "https://docs.compound.finance",
      },
    ],
    bugBounty: {
      provider: "Immunefi",
      url: "https://immunefi.com",
    },
    notes: [
      "Borrowing carries liquidation risk: if your borrow rises too high relative to your collateral, your position can be liquidated.",
      "As with any DeFi protocol, smart-contract, oracle, and interest-rate risks apply. Review positions and the official docs before transacting.",
      "Refer to the official documentation for the current, authoritative list of audits and security disclosures.",
    ],
  },
  resources: compoundResources,
  metricKeys: [
    "totalValueLocked",
    "totalSupplied",
    "totalBorrowed",
    "activeMarkets",
    "supportedAssets",
    "utilizationRate",
  ],
  interaction: { kind: "compound-sdk" },
  sections: [
    { type: "beginner" },
    { type: "interaction" },
    { type: "overview" },
    { type: "metrics" },
    { type: "analytics" },
    { type: "integrations" },
    { type: "resources" },
    { type: "security" },
    { type: "faq" },
  ],
};
