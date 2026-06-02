import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Backed page.
 *
 * URLs point at canonical, stable destinations (backed.fi / docs.backed.fi /
 * official channels). Deep links and thumbnails should be curated/verified by
 * the content team before launch.
 */
export const backedResources: ProtocolResources = {
  videos: [
    {
      id: "what-is-backed",
      title: "What is Backed?",
      description:
        "An introduction to Backed and tokenized real-world assets (bTokens).",
      url: "https://www.youtube.com/@backedfi",
      difficulty: "beginner",
      source: "Backed",
    },
    {
      id: "tokenized-securities",
      title: "How tokenized securities work",
      description:
        "How a bToken tracks a real stock, ETF, or bond held 1:1 in custody.",
      url: "https://www.youtube.com/@backedfi",
      difficulty: "beginner",
      source: "Backed",
    },
    {
      id: "btokens-in-defi",
      title: "Using bTokens in DeFi",
      description:
        "How composable, ERC-20 bTokens can be used as collateral and liquidity.",
      url: "https://www.youtube.com/@backedfi",
      difficulty: "intermediate",
      source: "Backed",
    },
    {
      id: "xstocks",
      title: "xStocks: tokenized equities",
      description:
        "How Backed powers tokenized stocks available across multiple chains.",
      url: "https://www.youtube.com/@backedfi",
      difficulty: "advanced",
      source: "Backed",
    },
  ],
  articles: [
    {
      id: "what-is-backed-doc",
      title: "What is Backed?",
      description: "Overview of tokenized real-world assets and how Backed works.",
      url: "https://docs.backed.fi",
      category: "Introduction",
      readingMinutes: 5,
    },
    {
      id: "collateralization",
      title: "How bTokens are collateralized",
      description:
        "1:1 backing, custody of the underlying, and proof of reserves.",
      url: "https://docs.backed.fi",
      category: "Concepts",
      readingMinutes: 8,
    },
    {
      id: "mint-redeem",
      title: "Minting & redemption",
      description:
        "How eligible participants mint and redeem bTokens against the underlying.",
      url: "https://docs.backed.fi",
      category: "Concepts",
      readingMinutes: 6,
    },
    {
      id: "regulatory",
      title: "Regulatory framework",
      description:
        "The Swiss DLT framework and prospectus model Backed issues under.",
      url: "https://docs.backed.fi",
      category: "Compliance",
      readingMinutes: 7,
    },
  ],
  faqs: [
    {
      id: "what-is-backed",
      question: "What is Backed?",
      answer:
        "Backed is an issuer of tokenized real-world assets. It creates ERC-20 tokens (bTokens) that track real securities — such as stocks, ETFs, and bonds — with each token fully collateralized 1:1 by the underlying asset held with a custodian.",
    },
    {
      id: "how-backed",
      question: "How are the tokens backed?",
      answer:
        "Every issued token is backed 1:1 by the corresponding real-world security held in custody. Backed publishes proof of reserves so holders can verify that issuance is fully collateralized.",
    },
    {
      id: "who-can-mint",
      question: "Who can mint and redeem?",
      answer:
        "Primary minting and redemption against the underlying are available to eligible, KYC-verified participants under Backed's regulatory framework. Once issued, the tokens are freely transferable on-chain.",
    },
    {
      id: "secondary-market",
      question: "Can I trade bTokens without being an eligible participant?",
      answer:
        "Yes. bTokens are standard, permissionlessly transferable ERC-20s, so they can be bought and sold on secondary markets and DEXs, and used across composable DeFi applications.",
    },
    {
      id: "what-products",
      question: "What products are available?",
      answer:
        "Backed issues tokenized versions of instruments such as short-term US and EU treasury ETFs, broad equity index ETFs, and individual equities (xStocks), among others. The available set evolves over time.",
    },
    {
      id: "what-risks",
      question: "What are the risks?",
      answer:
        "Each token carries the market risk of its underlying security (price moves, interest-rate risk for bonds). Custody, issuer/counterparty, smart-contract, and secondary-market price risks also apply. Review the official documentation and product prospectuses before transacting.",
    },
  ],
};
