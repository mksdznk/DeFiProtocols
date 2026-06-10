import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Maverick page.
 *
 * Links are real, verified destinations: Maverick's official docs and an
 * official tutorial, a reputable explainer (CoinMarketCap Academy) and research
 * deep-dive (Shoal), plus walkthrough videos (DeFi Dad and community creators)
 * covering the Dynamic Distribution AMM, swapping, and Liquidity Modes.
 */
export const maverickResources: ProtocolResources = {
  videos: [
    {
      id: "maverick-amm-explained",
      title: "Maverick: an AMM for all market conditions",
      description:
        "A clear walkthrough of how Maverick's Dynamic Distribution AMM works and why it aims for greater capital efficiency.",
      url: "https://www.youtube.com/watch?v=kkHO0go42bI",
      thumbnailUrl: "https://i3.ytimg.com/vi/kkHO0go42bI/maxresdefault.jpg",
      difficulty: "beginner",
      source: "DeFi Dad",
    },
    {
      id: "maverick-earn-yield",
      title: "Maverick tutorial: earn yield with liquidity pools",
      description:
        "A hands-on guide to connecting a wallet and providing liquidity on Maverick to earn swap fees.",
      url: "https://www.youtube.com/watch?v=J3CjwV0kOFs",
      thumbnailUrl: "https://i3.ytimg.com/vi/J3CjwV0kOFs/maxresdefault.jpg",
      difficulty: "beginner",
      source: "Krypto Cove",
    },
    {
      id: "liquidity-shaping-tutorial",
      title: "Liquidity shaping tutorial (Liquidity Modes)",
      description:
        "Maverick's official walkthrough of shaping a liquidity position with the directional Liquidity Modes.",
      url: "https://www.youtube.com/watch?v=mC-WI3pvo9s",
      thumbnailUrl: "https://i3.ytimg.com/vi/mC-WI3pvo9s/maxresdefault.jpg",
      difficulty: "intermediate",
      source: "Maverick Protocol",
    },
    {
      id: "maverick-amm-deep-dive",
      title: "Maverick's next-gen AMM (team interview)",
      description:
        "A deeper conversation with the Maverick team on the design of its AMM and what directional liquidity unlocks.",
      url: "https://www.youtube.com/watch?v=1D_W0sokCbw",
      thumbnailUrl: "https://i3.ytimg.com/vi/1D_W0sokCbw/maxresdefault.jpg",
      difficulty: "advanced",
      source: "Crypto Coin Show",
    },
  ],
  articles: [
    {
      id: "what-is-maverick",
      title: "What is Maverick Protocol?",
      description:
        "A clear introduction to Maverick — directional liquidity providing and its Dynamic Distribution AMM.",
      url: "https://coinmarketcap.com/academy/article/what-is-maverick-protocol",
      category: "Introduction",
    },
    {
      id: "introducing-maverick-docs",
      title: "Maverick documentation",
      description:
        "Maverick's official docs: the Dynamic Distribution AMM and how trading and liquidity work.",
      url: "https://docs.mav.xyz/",
      category: "Documentation",
    },
    {
      id: "guide-traders",
      title: "Guide: swapping on Maverick",
      description:
        "A step-by-step guide to swapping tokens on Maverick from your own wallet.",
      url: "https://docs.mav.xyz/guides/traders",
      category: "Guides",
    },
    {
      id: "liquidity-strategies",
      title: "Liquidity Modes & strategies",
      description:
        "How Static, Right, Left, and Both modes move your liquidity with price — and when to use each.",
      url: "https://docs.mav.xyz/guides/liquidity-providers/liquidity-strategies",
      category: "Concepts",
    },
    {
      id: "maverick-deep-dive",
      title: "Maverick: the dynamic liquidity provision AMM",
      description:
        "A research deep-dive into Maverick's design, capital efficiency, and how it compares to other AMMs.",
      url: "https://www.shoal.gg/p/maverick-the-dynamic-liquidity-provision",
      category: "Deep dive",
    },
    {
      id: "mav-token-explained",
      title: "MAV & veMAV explained",
      description:
        "How the MAV token and vote-escrowed veMAV power governance and direct liquidity incentives.",
      url: "https://onekey.so/blog/ecosystem/mav-token-explained-governance-and-liquidity-in-the-maverick-protocol/",
      category: "Governance",
    },
  ],
  faqs: [
    {
      id: "what-is-maverick",
      question: "What is Maverick Protocol?",
      answer:
        "Maverick is a decentralized exchange built on a Dynamic Distribution Automated Market Maker (DDAMM). It offers concentrated liquidity that can automatically follow the price, aiming for greater capital efficiency for traders and liquidity providers.",
    },
    {
      id: "is-it-custodial",
      question: "Does Maverick take custody of my funds?",
      answer:
        "No. Maverick is non-custodial — swaps and liquidity provision execute from your own wallet through audited smart contracts. You sign every transaction and keep control of your assets.",
    },
    {
      id: "liquidity-modes",
      question: "What are Liquidity Modes?",
      answer:
        "Liquidity Modes determine how your liquidity behaves as price moves. Static keeps liquidity in place, while Right, Left, and Both automatically shift it in a chosen direction — letting you express a view on price while providing liquidity.",
    },
    {
      id: "how-earn",
      question: "How do liquidity providers earn?",
      answer:
        "LPs earn a share of swap fees in the pools they provide to. Pools can also receive directed incentives via Boosted Positions, and locking MAV as veMAV can increase rewards.",
    },
    {
      id: "what-is-mav",
      question: "What are MAV and veMAV?",
      answer:
        "MAV is Maverick's governance and incentive token. Locking MAV produces veMAV (vote-escrowed MAV), which grants voting power and the ability to direct incentives toward chosen pools.",
    },
    {
      id: "what-risks",
      question: "What are the risks?",
      answer:
        "Liquidity providers face impermanent loss, which directional Liquidity Modes can amplify if the market moves against your chosen mode. Smart-contract and oracle risks also apply. Understand each pool and mode and review the official docs before transacting.",
    },
  ],
};
