import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Compound page.
 *
 * URLs point at canonical, stable destinations (compound.finance /
 * docs.compound.finance / official channels). Deep links and thumbnails should
 * be curated/verified by the content team before launch.
 */
export const compoundResources: ProtocolResources = {
  videos: [
    {
      id: "what-is-compound",
      title: "What is Compound?",
      description:
        "An introduction to Compound as an algorithmic, non-custodial money market.",
      url: "https://www.youtube.com/@compoundfinance",
      difficulty: "beginner",
      source: "Compound",
    },
    {
      id: "supplying-walkthrough",
      title: "Supplying assets to earn interest",
      description:
        "How to connect a wallet and supply the base asset to start earning.",
      url: "https://www.youtube.com/@compoundfinance",
      difficulty: "beginner",
      source: "Compound",
    },
    {
      id: "borrowing-compound-iii",
      title: "Borrowing on Compound III",
      description:
        "How collateral and the single base-asset model work in Compound III.",
      url: "https://www.youtube.com/@compoundfinance",
      difficulty: "intermediate",
      source: "Compound",
    },
    {
      id: "comp-governance",
      title: "COMP and governance",
      description:
        "How COMP holders propose and vote on changes to the protocol.",
      url: "https://www.youtube.com/@compoundfinance",
      difficulty: "advanced",
      source: "Compound",
    },
  ],
  articles: [
    {
      id: "what-is-compound-doc",
      title: "What is Compound?",
      description: "Overview of the protocol and the problems it solves.",
      url: "https://docs.compound.finance",
      category: "Introduction",
      readingMinutes: 5,
    },
    {
      id: "compound-iii",
      title: "How Compound III works",
      description:
        "The single base-asset model, collateral assets, and account health.",
      url: "https://docs.compound.finance",
      category: "Concepts",
      readingMinutes: 8,
    },
    {
      id: "liquidations",
      title: "Borrowing & liquidations",
      description:
        "Borrow capacity, liquidation, and how to keep a position safe.",
      url: "https://docs.compound.finance",
      category: "Risk",
      readingMinutes: 7,
    },
    {
      id: "governance-doc",
      title: "COMP governance",
      description: "How proposals are made, voted on, and executed on-chain.",
      url: "https://docs.compound.finance",
      category: "Governance",
      readingMinutes: 6,
    },
  ],
  faqs: [
    {
      id: "what-is-compound",
      question: "What is Compound?",
      answer:
        "Compound is a decentralized, non-custodial money market protocol. Users supply assets to earn interest or borrow assets against collateral, with interest rates set algorithmically based on supply and demand in each market.",
    },
    {
      id: "is-it-custodial",
      question: "Does Compound take custody of my funds?",
      answer:
        "No. Compound is non-custodial — funds are held by audited smart contracts, not a company. You sign every transaction and keep control of your positions.",
    },
    {
      id: "how-earn",
      question: "How do I earn interest?",
      answer:
        "When you supply the base asset of a market, your balance accrues interest in real time from the interest paid by borrowers. You can withdraw your supplied balance plus accrued interest, subject to available liquidity.",
    },
    {
      id: "compound-iii",
      question: "What is Compound III?",
      answer:
        "Compound III (Comet) is the current version. Each market has a single borrowable base asset (such as USDC or ETH) and a set of collateral assets you can supply to borrow against — a design focused on capital efficiency and risk isolation.",
    },
    {
      id: "liquidation",
      question: "What happens if my position becomes unhealthy?",
      answer:
        "If the value of your borrow rises too high relative to your collateral, your position can be liquidated to repay the debt. Keeping a buffer between your borrow and your borrowing capacity reduces this risk.",
    },
    {
      id: "what-risks",
      question: "What are the risks?",
      answer:
        "Key risks include liquidation, smart-contract risk, oracle risk, and interest-rate variability. Only supply or borrow what you understand, monitor your positions, and review the official documentation.",
    },
  ],
};
