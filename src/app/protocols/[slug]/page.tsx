import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProtocolSlugs, getProtocol } from "@/protocols/registry";
import { ProtocolHeader } from "@/components/protocol/ProtocolHeader";
import { ProtocolSectionRenderer } from "@/components/protocol/ProtocolSectionRenderer";

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

  return (
    <main style={accentStyle}>
      <ProtocolHeader config={config} />
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <ProtocolSectionRenderer config={config} />
      </div>
    </main>
  );
}
