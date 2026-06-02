import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Lido page.
 *
 * URLs point at canonical, stable destinations (lido.fi / docs.lido.fi /
 * official channels). Deep links and thumbnails should be curated/verified by
 * the content team before launch.
 */
export const lidoResources: ProtocolResources = {
  videos: [
    {
      id: "what-is-lido",
      title: "What is Lido?",
      description:
        "An introduction to Lido and liquid staking for Ethereum.",
      url: "https://www.youtube.com/@Lidofinance",
      difficulty: "beginner",
      source: "Lido",
    },
    {
      id: "staking-walkthrough",
      title: "Staking ETH with Lido",
      description:
        "How to connect a wallet, stake ETH, and receive stETH that earns rewards.",
      url: "https://www.youtube.com/@Lidofinance",
      difficulty: "beginner",
      source: "Lido",
    },
    {
      id: "steth-wsteth",
      title: "stETH vs wstETH",
      description:
        "The difference between rebasing stETH and wrapped wstETH, and when to use each.",
      url: "https://www.youtube.com/@Lidofinance",
      difficulty: "intermediate",
      source: "Lido",
    },
    {
      id: "withdrawals-governance",
      title: "Withdrawals & LDO governance",
      description:
        "How unstaking and the withdrawal queue work, and how the Lido DAO governs.",
      url: "https://www.youtube.com/@Lidofinance",
      difficulty: "advanced",
      source: "Lido",
    },
  ],
  articles: [
    {
      id: "what-is-lido-doc",
      title: "What is Lido?",
      description: "Overview of liquid staking and the problems Lido solves.",
      url: "https://docs.lido.fi",
      category: "Introduction",
      readingMinutes: 5,
    },
    {
      id: "how-staking-works",
      title: "How Lido staking works",
      description:
        "Staking ETH, node operators, rewards, and the role of stETH.",
      url: "https://docs.lido.fi",
      category: "Concepts",
      readingMinutes: 8,
    },
    {
      id: "steth-mechanics",
      title: "stETH & wstETH mechanics",
      description:
        "How rebasing stETH accrues rewards and how wstETH wraps it for DeFi.",
      url: "https://docs.lido.fi",
      category: "Concepts",
      readingMinutes: 7,
    },
    {
      id: "risks-doc",
      title: "Risks of liquid staking",
      description:
        "Smart-contract, slashing, and secondary-market (peg) risks to understand.",
      url: "https://docs.lido.fi",
      category: "Risk",
      readingMinutes: 7,
    },
  ],
  faqs: [
    {
      id: "what-is-lido",
      question: "What is Lido?",
      answer:
        "Lido is a liquid staking protocol for Ethereum. You stake ETH and receive stETH, a token that represents your staked ETH plus accruing rewards and remains liquid — so you can use it across DeFi while still earning staking yield.",
    },
    {
      id: "is-it-custodial",
      question: "Does Lido take custody of my funds?",
      answer:
        "Lido is non-custodial — you hold stETH in your own wallet and staking is handled by audited smart contracts and a set of DAO-curated node operators. You never hand your assets to a company.",
    },
    {
      id: "steth-vs-wsteth",
      question: "What's the difference between stETH and wstETH?",
      answer:
        "stETH is rebasing — your balance grows as rewards accrue. wstETH wraps stETH into a fixed-balance token whose value increases instead, which is often easier to use in DeFi protocols that don't support rebasing tokens.",
    },
    {
      id: "how-earn",
      question: "How do I earn rewards?",
      answer:
        "Once you stake, your stETH automatically accrues Ethereum staking rewards roughly daily — there's nothing else to claim. The displayed APR reflects current network reward rates and can change over time.",
    },
    {
      id: "withdrawals",
      question: "Can I unstake back to ETH?",
      answer:
        "Yes. You can request a withdrawal to redeem stETH for ETH through the protocol, subject to the Ethereum withdrawal queue, or swap stETH/wstETH for ETH on the secondary market for immediate liquidity.",
    },
    {
      id: "what-risks",
      question: "What are the risks?",
      answer:
        "Key risks include smart-contract risk, validator slashing (mitigated by curated operators), and the chance that stETH trades below ETH on secondary markets. Review the official documentation before staking.",
    },
  ],
};
