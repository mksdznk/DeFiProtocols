import type { AnalyticsAdapter } from "./types";
import { lifiAnalyticsAdapter } from "@/protocols/lifi/analytics.adapter";
import { aaveAnalyticsAdapter } from "@/protocols/aave/analytics.adapter";

/**
 * Maps a protocol slug to its analytics adapter. A protocol opts into analytics
 * by registering one entry here; the section components look the adapter up by
 * slug (keeping ProtocolConfig serializable across the server/client boundary).
 */
const adapters: Record<string, AnalyticsAdapter> = {
  lifi: lifiAnalyticsAdapter,
  aave: aaveAnalyticsAdapter,
};

export function getAnalyticsAdapter(slug: string): AnalyticsAdapter | undefined {
  return adapters[slug];
}
