import type { ProtocolConfig } from "@/protocols/types";
import { maverickResources } from "./resources";

/**
 * Maverick — a Dynamic Distribution AMM (DEX) with concentrated liquidity and
 * directional Liquidity Modes that automatically follow price.
 *
 * Fifth protocol on the PDP framework; same DEX/AMM family as Curve, added as
 * pure config + adapter (volume + TVL metrics, external-app interaction) with no
 * framework changes.
 *
 * Facts are kept conservative and verifiable against official sources
 * (mav.xyz / docs.mav.xyz).
 */
export const maverickConfig: ProtocolConfig = {
  slug: "maverick",
  name: "Maverick",
  tagline: "Capital-efficient swaps and directional liquidity with the Maverick AMM.",
  category: "Dynamic Distribution AMM (DEX)",
  branding: {
    logoSrc: "/images/maverick-logo.png",
    monogram: "Mv",
    // Maverick teal.
    accent: "oklch(0.4862 0.2682 291.23)",
    accentForeground: "oklch(0.99 0 0)",
  },
  links: {
    website: "https://mav.xyz",
    app: "https://app.mav.xyz",
    docs: "https://docs.mav.xyz",
    twitter: "https://x.com/mavprotocol",
    github: "https://github.com/maverickprotocol",
  },
  beginner: {
    inSimpleTerms:
      "Maverick is a place to swap coins, and to earn by providing coins for other people to trade with.",
    analogy:
      "It's like a smart marketplace where the money you add can automatically follow where the trading is happening.",
    firstSteps: [
      "Connect your wallet.",
      "Choose the two coins you want to swap.",
      "Confirm the swap in your wallet.",
    ],
  },
  overview: {
    summary:
      "Maverick is a decentralized exchange powered by a Dynamic Distribution AMM (DDAMM). Its concentrated liquidity can automatically follow the price through directional Liquidity Modes, aiming for higher capital efficiency for both traders and liquidity providers. MAV governance (veMAV) and Boosted Positions direct incentives across the ecosystem — all non-custodial.",
    highlights: [
      "Concentrated liquidity that can automatically follow price",
      "Directional Liquidity Modes (Static, Right, Left, Both)",
      "Boosted Positions to direct incentives to pools",
      "veMAV governance and reward boosting",
    ],
    services: [
      {
        title: "Swap",
        description:
          "Swap tokens efficiently across Maverick's concentrated liquidity.",
        icon: "ArrowLeftRight",
      },
      {
        title: "Provide liquidity",
        description:
          "Add liquidity with a Liquidity Mode that fits your market view.",
        icon: "Coins",
      },
      {
        title: "Boosted Positions",
        description:
          "Direct or earn incentives through Boosted Positions.",
        icon: "Zap",
      },
      {
        title: "Lock & govern (veMAV)",
        description:
          "Lock MAV for veMAV to vote and direct incentives.",
        icon: "Landmark",
      },
    ],
    chains: [
      { name: "Ethereum" },
      { name: "Base" },
      { name: "Arbitrum" },
      { name: "zkSync Era" },
      { name: "BNB Chain" },
    ],
    wallets: ["MetaMask", "Rabby", "Coinbase Wallet", "WalletConnect"],
  },
  integrations: [
    { name: "Chainlink", category: "Oracles" },
    { name: "LayerZero", category: "Cross-chain (MAV OFT)" },
    { name: "1inch", category: "Aggregators" },
    { name: "0x", category: "Aggregators" },
    { name: "ParaSwap", category: "Aggregators" },
  ],
  security: {
    audits: [
      { auditor: "See official security disclosures", url: "https://docs.mav.xyz" },
    ],
    bugBounty: {
      provider: "Immunefi",
      url: "https://immunefi.com",
    },
    notes: [
      "Providing liquidity exposes you to impermanent loss, which directional Liquidity Modes can amplify if the market moves against your chosen mode.",
      "Smart-contract and oracle risks apply. Understand each pool and Liquidity Mode before depositing.",
      "Refer to the official documentation for the current, authoritative list of audits and security disclosures.",
    ],
  },
  resources: maverickResources,
  metricKeys: [
    "totalValueLocked",
    "volume24h",
    "volume7d",
    "totalVolume",
    "supportedChains",
    "supportedTokens",
  ],
  interaction: { kind: "maverick-sdk" },
  sections: [
    { type: "beginner" },
    // Interaction panel and the headline metrics sit side by side on wide
    // screens (they stack on small ones).
    { type: "interaction", width: "half" },
    { type: "metrics", width: "half" },
    { type: "analytics" },
    { type: "overview" },
    { type: "integrations" },
    { type: "resources" },
    { type: "security" },
    { type: "faq" },
  ],
};
