import type { MetadataRoute } from "next";
import { getAllProtocolSlugs } from "@/protocols/registry";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const protocols = getAllProtocolSlugs().map((slug) => ({
    url: `${baseUrl}/protocols/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...protocols,
  ];
}
