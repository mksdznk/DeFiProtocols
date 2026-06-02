import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Curve page.
 *
 * URLs point at canonical, stable destinations (curve.finance / docs.curve.fi /
 * official channels). Deep links and thumbnails should be curated/verified by
 * the content team before launch.
 */
export const curveResources: ProtocolResources = {
  videos: [
    {
      id: "what-is-curve",
      title: "What is Curve?",
      description:
        "An introduction to Curve as a stableswap AMM built for low-slippage swaps.",
      url: "https://www.youtube.com/@CurveFinance",
      difficulty: "beginner",
      source: "Curve",
    },
    {
      id: "swapping-walkthrough",
      title: "Swapping on Curve",
      description:
        "How to connect a wallet and swap stablecoins or pegged assets with low slippage.",
      url: "https://www.youtube.com/@CurveFinance",
      difficulty: "beginner",
      source: "Curve",
    },
    {
      id: "providing-liquidity",
      title: "Providing liquidity & earning",
      description:
        "How LPs earn trading fees and CRV rewards — and what impermanent loss means.",
      url: "https://www.youtube.com/@CurveFinance",
      difficulty: "intermediate",
      source: "Curve",
    },
    {
      id: "vecrv-crvusd",
      title: "veCRV, governance & crvUSD",
      description:
        "Vote-escrowed CRV, gauge weights, and Curve's native stablecoin crvUSD.",
      url: "https://www.youtube.com/@CurveFinance",
      difficulty: "advanced",
      source: "Curve",
    },
  ],
  articles: [
    {
      id: "what-is-curve-doc",
      title: "What is Curve?",
      description: "Overview of the protocol and the problems it solves.",
      url: "https://docs.curve.fi",
      category: "Introduction",
      readingMinutes: 5,
    },
    {
      id: "stableswap",
      title: "Stableswap explained",
      description:
        "How Curve's invariant enables deep liquidity and low slippage for like-assets.",
      url: "https://docs.curve.fi",
      category: "Concepts",
      readingMinutes: 9,
    },
    {
      id: "liquidity-il",
      title: "Providing liquidity & impermanent loss",
      description:
        "How pools work, where fees and rewards come from, and the risks involved.",
      url: "https://docs.curve.fi",
      category: "Risk",
      readingMinutes: 8,
    },
    {
      id: "crvusd-doc",
      title: "crvUSD & LLAMMA",
      description:
        "Curve's native stablecoin and its soft-liquidation (LLAMMA) mechanism.",
      url: "https://docs.curve.fi",
      category: "Concepts",
      readingMinutes: 7,
    },
  ],
  faqs: [
    {
      id: "what-is-curve",
      question: "What is Curve?",
      answer:
        "Curve is a decentralized exchange and automated market maker optimized for swapping stablecoins and other pegged assets with very low slippage. It also offers liquidity pools, the CRV governance token, and crvUSD, its native stablecoin.",
    },
    {
      id: "is-it-custodial",
      question: "Does Curve take custody of my funds?",
      answer:
        "No. Curve is non-custodial — swaps and liquidity provision execute from your own wallet through audited smart contracts. You sign every transaction and keep control of your assets.",
    },
    {
      id: "how-earn",
      question: "How do liquidity providers earn?",
      answer:
        "When you deposit into a pool you receive LP tokens and earn a share of the pool's trading fees. Many pools also distribute CRV rewards, which can be boosted by locking CRV as veCRV.",
    },
    {
      id: "what-is-vecrv",
      question: "What are CRV and veCRV?",
      answer:
        "CRV is Curve's governance and rewards token. Locking CRV produces veCRV (vote-escrowed CRV), which grants voting power over gauge weights and can boost your liquidity rewards.",
    },
    {
      id: "what-is-crvusd",
      question: "What is crvUSD?",
      answer:
        "crvUSD is Curve's native, overcollateralized stablecoin. It uses a soft-liquidation mechanism called LLAMMA that gradually converts collateral as prices move, rather than liquidating a position all at once.",
    },
    {
      id: "what-risks",
      question: "What are the risks?",
      answer:
        "Liquidity providers face impermanent loss and the risk that a pegged asset loses its peg. crvUSD borrowing carries liquidation risk, and smart-contract and oracle risks apply. Understand each pool or market and review the official docs before transacting.",
    },
  ],
};
