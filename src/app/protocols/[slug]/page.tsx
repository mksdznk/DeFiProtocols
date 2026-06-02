import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProtocolSlugs, getProtocol } from "@/protocols/registry";
import { ProtocolHeader } from "@/components/protocol/ProtocolHeader";
import { ProtocolSectionRenderer } from "@/components/protocol/ProtocolSectionRenderer";
import { SectionNav } from "@/components/protocol/SectionNav";
import { getProtocolNavItems } from "@/components/protocol/section-registry";
import { buildProtocolJsonLd, serializeJsonLd } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type PageParams = { params: Promise<{ slug: string }> };

/** Prerender every registered protocol at build time. */
export function generateStaticParams() {
  return getAllProtocolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const config = getProtocol(slug);
  if (!config) return { title: "Protocol not found" };

  return {
    title: config.name,
    description: config.tagline,
    alternates: { canonical: `/protocols/${slug}` },
    openGraph: {
      title: `${config.name} — ${config.category}`,
      description: config.tagline,
      url: `/protocols/${slug}`,
    },
  };
}

export default async function ProtocolPage({ params }: PageParams) {
  const { slug } = await params;
  const config = getProtocol(slug);
  if (!config) notFound();

  // Expose the protocol's accent as a CSS variable to every section below.
  const accentStyle = {
    "--protocol-accent": config.branding.accent,
    "--protocol-accent-foreground":
      config.branding.accentForeground ?? "white",
  } as CSSProperties;

  const navItems = getProtocolNavItems(config);
  const jsonLd = buildProtocolJsonLd(config, `${SITE_URL}/protocols/${slug}`);

  return (
    <main id="main-content" tabIndex={-1} style={accentStyle} className="outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <ProtocolHeader config={config} />
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <SectionNav items={navItems} />
        <ProtocolSectionRenderer config={config} />
      </div>
    </main>
  );
}
