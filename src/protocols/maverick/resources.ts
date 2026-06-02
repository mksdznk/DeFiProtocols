import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Maverick page.
 *
 * URLs point at canonical, stable destinations (mav.xyz / docs.mav.xyz /
 * official channels). Deep links and thumbnails should be curated/verified by
 * the content team before launch.
 */
export const maverickResources: ProtocolResources = {
  videos: [
    {
      id: "what-is-maverick",
      title: "What is Maverick Protocol?",
      description:
        "An introduction to Maverick and its Dynamic Distribution AMM (DDAMM).",
      url: "https://www.youtube.com/@maverickprotocol",
      difficulty: "beginner",
      source: "Maverick",
    },
    {
      id: "swapping-walkthrough",
      title: "Swapping on Maverick",
      description:
        "How to connect a wallet and swap tokens across Maverick's concentrated liquidity.",
      url: "https://www.youtube.com/@maverickprotocol",
      difficulty: "beginner",
      source: "Maverick",
    },
    {
      id: "liquidity-modes",
      title: "Providing liquidity & Liquidity Modes",
      description:
        "How Maverick's directional Liquidity Modes move liquidity as price changes.",
      url: "https://www.youtube.com/@maverickprotocol",
      difficulty: "intermediate",
      source: "Maverick",
    },
    {
      id: "vemav-boosted",
      title: "veMAV & Boosted Positions",
      description:
        "Locking MAV for veMAV, directing incentives, and Boosted Positions.",
      url: "https://www.youtube.com/@maverickprotocol",
      difficulty: "advanced",
      source: "Maverick",
    },
  ],
  articles: [
    {
      id: "what-is-maverick-doc",
      title: "What is Maverick?",
      description: "Overview of the protocol and the problems it solves.",
      url: "https://docs.mav.xyz",
      category: "Introduction",
      readingMinutes: 5,
    },
    {
      id: "ddamm",
      title: "The Dynamic Distribution AMM",
      description:
        "How Maverick's AMM concentrates and automatically moves liquidity.",
      url: "https://docs.mav.xyz",
      category: "Concepts",
      readingMinutes: 9,
    },
    {
      id: "liquidity-modes-doc",
      title: "Liquidity Modes explained",
      description:
        "Static, Right, Left, and Both modes — and when to use each.",
      url: "https://docs.mav.xyz",
      category: "Concepts",
      readingMinutes: 7,
    },
    {
      id: "boosted-vemav",
      title: "Boosted Positions & veMAV",
      description:
        "How incentives are directed and how veMAV boosts rewards.",
      url: "https://docs.mav.xyz",
      category: "Concepts",
      readingMinutes: 6,
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
