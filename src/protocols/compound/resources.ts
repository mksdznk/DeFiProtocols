import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Compound page.
 *
 * Links are real, verified destinations: Compound's official Compound III docs,
 * a reputable explainer (Gemini), a beginner guide (Coin Bureau), and
 * walkthrough videos (Finematics and community creators) covering both the
 * concepts and how to actually supply, earn, and borrow.
 */
export const compoundResources: ProtocolResources = {
  videos: [
    {
      id: "lending-borrowing-explained",
      title: "Lending & borrowing in DeFi explained",
      description:
        "An animated primer on how DeFi money markets like Compound let you earn interest or borrow against collateral.",
      url: "https://www.youtube.com/watch?v=aTp9er6S73M",
      thumbnailUrl: "https://i3.ytimg.com/vi/aTp9er6S73M/maxresdefault.jpg",
      difficulty: "beginner",
      source: "Finematics",
    },
    {
      id: "borrow-lend-easy-guide",
      title: "How to borrow & lend crypto on Compound",
      description:
        "A beginner-friendly walkthrough of connecting a wallet and supplying or borrowing on Compound.",
      url: "https://www.youtube.com/watch?v=o3Qp7N4DzzU",
      thumbnailUrl: "https://i3.ytimg.com/vi/o3Qp7N4DzzU/maxresdefault.jpg",
      difficulty: "beginner",
      source: "Krypto Cove",
    },
    {
      id: "compound-v3-tutorial",
      title: "How to use Compound v3 (Comet)",
      description:
        "A hands-on tutorial of the current Compound III interface: the base asset, collateral, and earning.",
      url: "https://www.youtube.com/watch?v=6O3YpZc202Q",
      thumbnailUrl: "https://i3.ytimg.com/vi/6O3YpZc202Q/maxresdefault.jpg",
      difficulty: "intermediate",
      source: "MoneyZG",
    },
    {
      id: "lend-earn-passive-income",
      title: "Lending to earn passive DeFi income",
      description:
        "How supplying assets like DAI and ETH on Compound earns interest over time.",
      url: "https://www.youtube.com/watch?v=K5WD_jmyKoA",
      thumbnailUrl: "https://i3.ytimg.com/vi/K5WD_jmyKoA/maxresdefault.jpg",
      difficulty: "intermediate",
      source: "IMineBlocks",
    },
  ],
  articles: [
    {
      id: "compound-lego-blocks",
      title: "Compound Finance: lego blocks of DeFi",
      description:
        "A clear introduction to Compound — supplying, borrowing, cTokens, and algorithmic interest rates.",
      url: "https://www.gemini.com/cryptopedia/compound-finance-defi-crypto",
      category: "Introduction",
    },
    {
      id: "compound-iii-docs",
      title: "Compound III documentation",
      description:
        "Compound's official docs: the single base-asset model, supplying to earn, and how the protocol works.",
      url: "https://docs.compound.finance/",
      category: "Documentation",
    },
    {
      id: "collateral-and-borrowing",
      title: "Collateral & borrowing",
      description:
        "How collateral assets back a borrow of the base asset, and how borrowing capacity is calculated.",
      url: "https://docs.compound.finance/collateral-and-borrowing/",
      category: "Concepts",
    },
    {
      id: "liquidation",
      title: "Liquidation",
      description:
        "What makes a position liquidatable, how liquidation works, and how to keep an account healthy.",
      url: "https://docs.compound.finance/liquidation/",
      category: "Risk",
    },
    {
      id: "governance-doc",
      title: "COMP governance",
      description:
        "How COMP holders propose, vote on, and execute changes to the protocol on-chain.",
      url: "https://docs.compound.finance/governance/",
      category: "Governance",
    },
    {
      id: "compound-beginners-guide",
      title: "Compound Finance: a beginner's guide",
      description:
        "A practical guide to lending and borrowing on Compound, with tips for getting started safely.",
      url: "https://coinbureau.com/guides/compound-finance-beginners",
      category: "Guides",
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
