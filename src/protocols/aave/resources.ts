import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Aave page.
 *
 * URLs point at canonical, stable destinations (aave.com / docs.aave.com /
 * official channels). Deep links and thumbnails should be curated/verified by
 * the content team before launch.
 */
export const aaveResources: ProtocolResources = {
  videos: [
    {
      id: "what-is-aave",
      title: "What is Aave?",
      description:
        "An introduction to Aave as a decentralized, non-custodial liquidity protocol.",
      url: "https://www.youtube.com/@aave",
      difficulty: "beginner",
      source: "Aave",
    },
    {
      id: "supplying-walkthrough",
      title: "Supplying assets to earn yield",
      description:
        "How to connect a wallet and supply assets to start earning interest.",
      url: "https://www.youtube.com/@aave",
      difficulty: "beginner",
      source: "Aave",
    },
    {
      id: "borrowing-health-factor",
      title: "Borrowing and the health factor",
      description:
        "How collateral, borrowing, and liquidations work — and how to stay safe.",
      url: "https://www.youtube.com/@aave",
      difficulty: "intermediate",
      source: "Aave",
    },
    {
      id: "gho-explained",
      title: "GHO: Aave's native stablecoin",
      description:
        "What GHO is, how it's minted against collateral, and how it stays pegged.",
      url: "https://www.youtube.com/@aave",
      difficulty: "advanced",
      source: "Aave",
    },
  ],
  articles: [
    {
      id: "what-is-aave-doc",
      title: "What is Aave?",
      description: "Overview of the protocol and the problems it solves.",
      url: "https://docs.aave.com",
      category: "Introduction",
      readingMinutes: 5,
    },
    {
      id: "supplying-borrowing",
      title: "Supplying & borrowing",
      description:
        "How lenders earn yield and borrowers take loans against collateral.",
      url: "https://docs.aave.com",
      category: "Concepts",
      readingMinutes: 8,
    },
    {
      id: "liquidations",
      title: "Liquidations & health factor",
      description: "What the health factor is and how positions get liquidated.",
      url: "https://docs.aave.com",
      category: "Risk",
      readingMinutes: 7,
    },
    {
      id: "gho-doc",
      title: "The GHO stablecoin",
      description: "How GHO is minted, repaid, and kept overcollateralized.",
      url: "https://docs.aave.com",
      category: "Concepts",
      readingMinutes: 6,
    },
  ],
  faqs: [
    {
      id: "what-is-aave",
      question: "What is Aave?",
      answer:
        "Aave is a decentralized, non-custodial liquidity protocol where users can supply assets to earn yield or borrow assets against collateral. Interest rates adjust algorithmically based on supply and demand in each market.",
    },
    {
      id: "is-it-custodial",
      question: "Does Aave take custody of my funds?",
      answer:
        "No. Aave is non-custodial — your funds are held by audited smart contracts, not a company. You sign every transaction and retain control of your positions.",
    },
    {
      id: "how-earn",
      question: "How do I earn yield?",
      answer:
        "When you supply an asset, you receive an interest-bearing aToken that accrues yield in real time from the interest paid by borrowers. You can withdraw your supplied assets plus accrued interest, subject to available liquidity.",
    },
    {
      id: "health-factor",
      question: "What is the health factor?",
      answer:
        "The health factor represents the safety of your borrow position relative to your collateral. If it falls below 1, part of your collateral can be liquidated to repay your debt. Keeping a healthy buffer reduces liquidation risk.",
    },
    {
      id: "what-is-gho",
      question: "What is GHO?",
      answer:
        "GHO is Aave's native, overcollateralized, decentralized stablecoin. Users can mint GHO against supplied collateral; interest paid on GHO accrues to the Aave DAO treasury.",
    },
    {
      id: "what-risks",
      question: "What are the risks?",
      answer:
        "Key risks include liquidation if your health factor drops, smart-contract risk, oracle risk, and interest-rate variability. Only supply or borrow what you understand, monitor your positions, and review the official documentation.",
    },
  ],
};
