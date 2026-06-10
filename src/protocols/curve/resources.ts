import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Curve page.
 *
 * Links are real, verified destinations: Curve's official user resources and
 * technical docs, a reputable explainer (Gemini), a deep-dive guide (Bankless),
 * and walkthrough videos (Bankless and community creators) covering swapping,
 * earning, the stableswap design, and crvUSD.
 */
export const curveResources: ProtocolResources = {
  videos: [
    {
      id: "curve-swaps-yield",
      title: "Curve tutorial: swaps & yield farming",
      description:
        "A practical walkthrough of swapping stablecoins on Curve with low slippage and earning yield as a liquidity provider.",
      url: "https://www.youtube.com/watch?v=igJlQtcPaqE",
      thumbnailUrl: "https://i3.ytimg.com/vi/igJlQtcPaqE/maxresdefault.jpg",
      difficulty: "beginner",
      source: "MoneyZG",
    },
    {
      id: "curve-beginners-yield",
      title: "Curve for beginners: earning yield",
      description:
        "A beginner-friendly guide to connecting a wallet, depositing into a pool, and earning on Curve.",
      url: "https://www.youtube.com/watch?v=c9ipj98E9vU",
      thumbnailUrl: "https://i3.ytimg.com/vi/c9ipj98E9vU/maxresdefault.jpg",
      difficulty: "beginner",
      source: "Every Bit Helps",
    },
    {
      id: "farm-yield-stablecoins",
      title: "Farming yield with stablecoins on Curve",
      description:
        "How to provide stablecoin liquidity on Curve to earn trading fees and rewards, and the trade-offs involved.",
      url: "https://www.youtube.com/watch?v=fGxTwm-rf1s",
      thumbnailUrl: "https://i3.ytimg.com/vi/fGxTwm-rf1s/hqdefault.jpg",
      difficulty: "intermediate",
      source: "Bankless",
    },
    {
      id: "stableswap-equation",
      title: "Curve's stableswap AMM equation explained",
      description:
        "A deeper, technical look at the stableswap invariant that gives Curve its low-slippage swaps for like-assets.",
      url: "https://www.youtube.com/watch?v=oUqFeJPnq3s",
      thumbnailUrl: "https://i3.ytimg.com/vi/oUqFeJPnq3s/maxresdefault.jpg",
      difficulty: "advanced",
      source: "Smart Contract Programmer",
    },
  ],
  articles: [
    {
      id: "curve-how-it-works",
      title: "How Curve Finance, CRV & liquidity work",
      description:
        "A clear introduction to Curve — low-slippage stablecoin swaps, liquidity pools, fees, and the CRV token.",
      url: "https://www.gemini.com/cryptopedia/curve-finance-liquidity-provider-dao",
      category: "Introduction",
    },
    {
      id: "getting-started",
      title: "Getting started with Curve",
      description:
        "Curve's official user guide: connecting a wallet, swapping, and depositing into pools.",
      url: "https://resources.curve.finance/getting-started/",
      category: "Documentation",
    },
    {
      id: "bankless-guide",
      title: "The Bankless guide to Curve",
      description:
        "A deeper guide to trading and providing liquidity on Curve, and how the wider Curve ecosystem fits together.",
      url: "https://www.bankless.com/the-bankless-guide-to-curve",
      category: "Guides",
    },
    {
      id: "vecrv-overview",
      title: "veCRV & vote-locking",
      description:
        "How locking CRV produces veCRV — voting power over gauge weights, a share of fees, and boosted rewards.",
      url: "https://resources.curve.finance/vecrv/overview/",
      category: "Governance",
    },
    {
      id: "crvusd-faq",
      title: "crvUSD explained (FAQ)",
      description:
        "Curve's native stablecoin: how it's minted against collateral and its soft-liquidation (LLAMMA) design.",
      url: "https://resources.curve.finance/crvusd/faq/",
      category: "crvUSD",
    },
    {
      id: "how-to-borrow",
      title: "How to borrow on Curve",
      description:
        "A step-by-step guide to taking an overcollateralized loan and the liquidation risks to watch for.",
      url: "https://resources.curve.finance/lending/how-to-borrow/",
      category: "Borrowing",
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
