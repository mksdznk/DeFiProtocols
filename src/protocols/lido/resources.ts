import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Lido page.
 *
 * Links are real, verified destinations: Lido's official "How Lido works" user
 * pages and technical docs, a beginner step-by-step guide (CoinLedger), and
 * walkthrough videos covering what liquid staking is and how to stake ETH for
 * stETH.
 */
export const lidoResources: ProtocolResources = {
  videos: [
    {
      id: "liquid-staking-explained",
      title: "Liquid staking explained: Lido, stETH & DeFi",
      description:
        "A full-guide primer on what liquid staking is, how stETH works, and why it lets you earn rewards while staying liquid.",
      url: "https://www.youtube.com/watch?v=wiwb-uxwvKo",
      thumbnailUrl: "https://i3.ytimg.com/vi/wiwb-uxwvKo/maxresdefault.jpg",
      difficulty: "beginner",
      source: "Rosario Borgesi",
    },
    {
      id: "lido-eth-staking-tutorial",
      title: "How to stake ETH with Lido (stETH)",
      description:
        "A step-by-step walkthrough of connecting a wallet, staking ETH on Lido, and receiving reward-bearing stETH.",
      url: "https://www.youtube.com/watch?v=5zCCRx6IudY",
      thumbnailUrl: "https://i3.ytimg.com/vi/5zCCRx6IudY/maxresdefault.jpg",
      difficulty: "beginner",
      source: "MoneyZG",
    },
    {
      id: "learn-to-defi-lido",
      title: "Lido liquid staking tutorial (Learn to DeFi)",
      description:
        "A guided tutorial on staking ETH with Lido while keeping custody of your own assets, as part of a DeFi basics series.",
      url: "https://www.youtube.com/watch?v=l4SIT7T3Vf4",
      thumbnailUrl: "https://i3.ytimg.com/vi/l4SIT7T3Vf4/maxresdefault.jpg",
      difficulty: "intermediate",
      source: "Crypto Banter",
    },
    {
      id: "lido-staking-tutorial",
      title: "Lido staking tutorial",
      description:
        "A hands-on walkthrough of staking ETH with Lido and receiving stETH that earns rewards automatically.",
      url: "https://www.youtube.com/watch?v=aBj0oP3rsfA",
      thumbnailUrl: "https://i3.ytimg.com/vi/aBj0oP3rsfA/maxresdefault.jpg",
      difficulty: "intermediate",
      source: "MoneyZG",
    },
  ],
  articles: [
    {
      id: "how-lido-works",
      title: "How Lido works",
      description:
        "Lido's official overview of liquid staking: stake ETH, get stETH, and earn rewards while staying liquid.",
      url: "https://lido.fi/how-lido-works",
      category: "Introduction",
    },
    {
      id: "steth-and-wsteth",
      title: "stETH and wstETH",
      description:
        "How rebasing stETH accrues rewards in your balance and how non-rebasing wstETH wraps it for use across DeFi.",
      url: "https://lido.fi/how-lido-works/steth-and-wsteth",
      category: "Concepts",
    },
    {
      id: "rewards-and-penalties",
      title: "Rewards & penalties",
      description:
        "Where staking rewards come from, how they reach your stETH, and how penalties and the protocol fee work.",
      url: "https://lido.fi/how-lido-works/rewards-and-penalties",
      category: "Rewards",
    },
    {
      id: "lido-staking-guide",
      title: "Lido staking: step-by-step for beginners",
      description:
        "A practical, beginner-friendly guide to staking ETH on Lido and what to expect at each step.",
      url: "https://coinledger.io/learn/lido-staking",
      category: "Guides",
    },
    {
      id: "lido-dao",
      title: "Lido DAO & governance",
      description:
        "How the Lido DAO and the LDO token govern node operators and protocol parameters.",
      url: "https://docs.lido.fi/lido-dao",
      category: "Governance",
    },
    {
      id: "security-audits",
      title: "Security & audits",
      description:
        "Lido's smart-contract audits and security disclosures — useful context on the protocol's risk surface.",
      url: "https://docs.lido.fi/security/audits",
      category: "Security",
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
