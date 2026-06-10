import type { ProtocolConfig } from "@/protocols/types";
import { backedResources } from "./resources";

/**
 * Backed — tokenized real-world assets (RWA).
 *
 * Seventh protocol and a fifth category (RWA / tokenized securities, distinct
 * from bridge, lending, DEX, and liquid staking). Added as pure config +
 * adapter; it introduces RWA metrics (AUM / products / collateralization /
 * holders) that now live in the generic metric set — no framework changes.
 *
 * Facts are kept conservative and verifiable against official sources
 * (backed.fi / docs.backed.fi).
 */
export const backedConfig: ProtocolConfig = {
  slug: "backed",
  name: "Backed",
  tagline: "Tokenized stocks, ETFs, and bonds, backed 1:1 by real-world securities.",
  category: "Tokenized real-world assets (RWA)",
  branding: {
    monogram: "Bk",
    logoSrc: "/images/backed-logo.png",
    // Backed amber/gold.
    accent: "oklch(0.5599 0.2429 261.16)",
    accentForeground: "oklch(0.22 0.03 80)",
  },
  links: {
    website: "https://backed.fi",
    docs: "https://docs.backed.fi",
    twitter: "https://x.com/backed_fi",
    github: "https://github.com/backed-fi",
  },
  beginner: {
    inSimpleTerms:
      "Backed turns real-world things like company shares and bonds into tokens you can hold in a crypto wallet.",
    analogy:
      "It's like a digital sticker that's always worth the same as the real thing it stands for.",
    firstSteps: [
      "Get a crypto wallet.",
      "Browse the tokenized products on Backed.",
      "Buy one on a supported exchange or marketplace.",
    ],
  },
  overview: {
    summary:
      "Backed issues tokenized real-world assets: ERC-20 tokens (bTokens) that track real securities — stocks, ETFs, and bonds — each fully collateralized 1:1 by the underlying held with a custodian. Primary minting and redemption are available to eligible participants under a Swiss regulatory framework, while the tokens themselves are permissionlessly transferable and composable across DeFi.",
    highlights: [
      "Tokenized stocks, ETFs, and bonds as standard ERC-20s",
      "Each token backed 1:1 by the underlying, with proof of reserves",
      "Permissionlessly transferable and usable across DeFi",
      "Issued under a regulated Swiss framework",
    ],
    services: [
      {
        title: "Tokenized securities",
        description:
          "Hold tokens that track real stocks, ETFs, and bonds.",
        icon: "Coins",
      },
      {
        title: "Backed 1:1",
        description:
          "Each token is fully collateralized by the underlying in custody.",
        icon: "Landmark",
      },
      {
        title: "Composable in DeFi",
        description:
          "Use bTokens as collateral or liquidity across protocols.",
        icon: "Zap",
      },
      {
        title: "Mint & redeem",
        description:
          "Eligible participants mint and redeem against the underlying.",
        icon: "ArrowLeftRight",
      },
    ],
    chains: [
      { name: "Ethereum" },
      { name: "Gnosis" },
      { name: "Base" },
      { name: "Polygon" },
      { name: "Arbitrum" },
      { name: "Solana" },
    ],
    wallets: ["MetaMask", "Rabby", "Coinbase Wallet", "WalletConnect"],
  },
  integrations: [
    { name: "Morpho", category: "Lending" },
    { name: "Curve", category: "Liquidity" },
    { name: "Chainlink", category: "Oracles & proof of reserves" },
    { name: "Kraken", category: "Distribution (xStocks)" },
    { name: "Bybit", category: "Distribution (xStocks)" },
  ],
  security: {
    audits: [
      {
        auditor: "See official security disclosures",
        url: "https://docs.backed.fi",
      },
    ],
    notes: [
      "Backed tokens are issued by a regulated entity and fully collateralized 1:1 by the underlying securities held with a custodian; primary minting and redemption are limited to eligible participants.",
      "Each token carries the market risk of its underlying security (e.g. price moves and interest-rate risk for bonds), and secondary-market prices can differ from net asset value.",
      "Smart-contract, custody, and issuer/counterparty risks apply. Review the official documentation and product prospectuses before transacting.",
    ],
  },
  resources: backedResources,
  metricKeys: [
    "assetsUnderManagement",
    "tokenizedProducts",
    "totalHolders",
    "collateralization",
    "supportedChains",
  ],
  interaction: {
    kind: "backed-sdk",
  },
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
