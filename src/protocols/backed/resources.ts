import type { ProtocolResources } from "@/protocols/types";

/**
 * Educational content for the Backed page.
 *
 * Links are real, verified destinations: Backed's official xStocks docs and
 * issuer site, reputable explainers (Chainlink, MetaMask), and walkthrough
 * videos (Kraken, CNA, and community creators). Backed's tokenized stocks are
 * distributed as "xStocks", so much of the best beginner material lives under
 * that brand and on the venues that list them.
 */
export const backedResources: ProtocolResources = {
  videos: [
    {
      id: "tokenized-equities-explained",
      title: "Tokenized equities explained: how xStocks work",
      description:
        "A clear primer on how Backed's xStocks bring real equities on-chain as 1:1-backed tokens, and why that matters.",
      url: "https://www.youtube.com/watch?v=OpiyVve5URM",
      thumbnailUrl: "https://i3.ytimg.com/vi/OpiyVve5URM/maxresdefault.jpg",
      difficulty: "beginner",
      source: "Kraken",
    },
    {
      id: "what-are-tokenized-stocks",
      title: "CNA Explains: What are tokenised stocks?",
      description:
        "A short, news-style explainer on what tokenized stocks are and how they differ from buying shares the traditional way.",
      url: "https://www.youtube.com/watch?v=XaD3K_JSzbs",
      thumbnailUrl: "https://i3.ytimg.com/vi/XaD3K_JSzbs/hqdefault.jpg",
      difficulty: "beginner",
      source: "CNA",
    },
    {
      id: "how-to-buy-xstocks",
      title: "How to buy tokenized stocks (xStocks)",
      description:
        "A step-by-step walkthrough of buying a Backed xStock, from finding the ticker to holding it in your wallet.",
      url: "https://www.youtube.com/watch?v=DOL8TC-dtw0",
      thumbnailUrl: "https://i3.ytimg.com/vi/DOL8TC-dtw0/maxresdefault.jpg",
      difficulty: "beginner",
      source: "MoneyZG",
    },
    {
      id: "buy-xstocks-24-7",
      title: "Buying tokenized stocks 24/7 across venues",
      description:
        "How xStocks trade around the clock and how to buy them on different exchanges and wallets.",
      url: "https://www.youtube.com/watch?v=sdf_Khl4C1k",
      thumbnailUrl: "https://i3.ytimg.com/vi/sdf_Khl4C1k/maxresdefault.jpg",
      difficulty: "intermediate",
      source: "Crypto AiMan",
    },
  ],
  articles: [
    {
      id: "tokenized-stocks-explained",
      title: "Tokenized stocks & equities explained",
      description:
        "What tokenized equities are, how 1:1 backing works, and a look at Backed/xStocks as a real-world example.",
      url: "https://chain.link/education-hub/tokenized-stocks-equities-explained",
      category: "Introduction",
    },
    {
      id: "xstocks-docs",
      title: "xStocks documentation",
      description:
        "Backed's official docs: what xStocks are, how they're backed and redeemed, and the legal framework behind them.",
      url: "https://docs.xstocks.fi/docs",
      category: "Documentation",
    },
    {
      id: "backed-issuer-site",
      title: "Backed Assets: tokenized RWA issuer",
      description:
        "Backed's issuer site for its tokenized real-world assets — products, collateral, and proof of reserves.",
      url: "https://assets.backed.fi/",
      category: "Products",
    },
    {
      id: "rwa-explained",
      title: "Real-world assets (RWAs) explained",
      description:
        "Background on the broader RWA category that Backed sits in: tokenizing off-chain assets and bringing them on-chain.",
      url: "https://chain.link/education-hub/real-world-assets-rwas-explained",
      category: "Concepts",
    },
    {
      id: "rwa-metamask",
      title: "What are tokenized real-world assets?",
      description:
        "A wallet-user's guide to RWAs: legal structure, custody, risks, and the terms you'll come across.",
      url: "https://metamask.io/news/understanding-tokenized-real-world-assets-rwa",
      category: "Concepts",
    },
    {
      id: "getting-started-xstocks",
      title: "Getting started with xStocks",
      description:
        "A practical guide to buying and holding Backed's tokenized stocks, including how tickers and settlement work.",
      url: "https://support.kraken.com/articles/getting-started-with-xstocks",
      category: "Guides",
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
