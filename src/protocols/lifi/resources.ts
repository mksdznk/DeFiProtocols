import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the LiFi page.
 *
 * NOTE: URLs point at canonical, stable destinations (li.fi / docs.li.fi /
 * official channels). Deep links and thumbnails should be curated/verified by
 * the content team before launch — the structure here is what the Resources
 * section renders against.
 */
export const lifiResources: ProtocolResources = {
  videos: [
    {
      id: "what-is-lifi",
      title: "What is LI.FI?",
      description:
        "A short introduction to LI.FI as a cross-chain liquidity and messaging layer for DeFi.",
      url: "https://www.youtube.com/@LIFIofficial",
      difficulty: "beginner",
      source: "LI.FI",
    },
    {
      id: "bridging-walkthrough",
      title: "Bridging your first asset",
      description:
        "Step-by-step walkthrough of connecting a wallet and moving funds across chains.",
      url: "https://www.youtube.com/@LIFIofficial",
      difficulty: "beginner",
      source: "LI.FI",
    },
    {
      id: "routing-deep-dive",
      title: "How cross-chain routing works",
      description:
        "A deeper look at how LI.FI aggregates bridges and DEXs to find and compare routes.",
      url: "https://www.youtube.com/@LIFIofficial",
      difficulty: "advanced",
      source: "LI.FI",
    },
  ],
  articles: [
    {
      id: "what-is-lifi-doc",
      title: "What is LI.FI?",
      description:
        "Overview of the protocol, the problems it solves, and who it is for.",
      url: "https://docs.li.fi/",
      category: "Introduction",
      readingMinutes: 5,
    },
    {
      id: "how-it-works",
      title: "How LI.FI works",
      description:
        "Aggregation across bridges and exchanges, route discovery, and execution.",
      url: "https://docs.li.fi/",
      category: "Concepts",
      readingMinutes: 8,
    },
    {
      id: "bridge-mechanics",
      title: "Bridge mechanics & message passing",
      description:
        "How assets and messages move between chains, and the trade-offs involved.",
      url: "https://docs.li.fi/",
      category: "Concepts",
      readingMinutes: 10,
    },
    {
      id: "security-considerations",
      title: "Security considerations",
      description:
        "Understanding aggregated-bridge risk and how to transact safely.",
      url: "https://docs.li.fi/",
      category: "Security",
      readingMinutes: 7,
    },
  ],
  faqs: [
    {
      id: "what-is-lifi",
      question: "What is LI.FI?",
      answer:
        "LI.FI is a cross-chain liquidity aggregation and messaging protocol. It connects bridges and decentralized exchanges so you can swap and move assets between blockchains through a single interface, automatically finding and comparing routes.",
    },
    {
      id: "is-it-custodial",
      question: "Does LI.FI ever take custody of my funds?",
      answer:
        "No. Swaps and bridges execute non-custodially from your own wallet. You approve and sign every transaction; LI.FI routes liquidity but never holds your assets.",
    },
    {
      id: "what-fees",
      question: "What fees will I pay?",
      answer:
        "You pay the underlying bridge/DEX fees and network gas on each chain involved. The interface shows the expected output, fees, and estimated time before you confirm a route.",
    },
    {
      id: "how-long",
      question: "How long does a cross-chain transfer take?",
      answer:
        "It depends on the chains and bridge selected — many routes complete in a few minutes, while some take longer. The estimated time is shown for each route before you execute.",
    },
    {
      id: "which-chains",
      question: "Which chains and tokens are supported?",
      answer:
        "LI.FI supports a large and growing set of EVM chains (and beyond) and thousands of tokens. The interaction widget always reflects the current, route-able set at the time you use it.",
    },
    {
      id: "what-if-fails",
      question: "What happens if a cross-chain transaction fails?",
      answer:
        "Cross-chain transfers can partially complete or be refunded depending on the route. Always keep the transaction reference, monitor its status, and consult the official docs and support channels if a transfer does not arrive.",
    },
  ],
};
