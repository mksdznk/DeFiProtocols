import type { ProtocolConfig } from "@/protocols/types";

/**
 * Build a schema.org JSON-LD graph for a protocol page: the protocol as a
 * SoftwareApplication plus a FAQPage from its FAQ content. Rendered as a native
 * <script type="application/ld+json"> in the page (see ProtocolJsonLd).
 */
export function buildProtocolJsonLd(config: ProtocolConfig, pageUrl: string) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "SoftwareApplication",
      name: config.name,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: config.tagline,
      url: config.links.website ?? pageUrl,
      ...(config.links.website && {
        sameAs: Object.values(config.links).filter(Boolean),
      }),
    },
  ];

  if (config.resources.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: config.resources.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Serialize JSON-LD with `<` escaped to prevent XSS via injected strings. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
