import type { ProtocolConfig } from "./types";
import { lifiConfig } from "./lifi/config";
import { aaveConfig } from "./aave/config";
import { compoundConfig } from "./compound/config";
import { curveConfig } from "./curve/config";
import { maverickConfig } from "./maverick/config";
import { lidoConfig } from "./lido/config";

/**
 * The protocol registry — the single place a protocol is registered.
 *
 * To add a protocol: author `src/protocols/<slug>/config.ts` and add one entry
 * here. The `[slug]` route, all section modules, SEO, and sitemap derive from
 * this map automatically.
 */
const registry: Record<string, ProtocolConfig> = {
  [lifiConfig.slug]: lifiConfig,
  [aaveConfig.slug]: aaveConfig,
  [compoundConfig.slug]: compoundConfig,
  [curveConfig.slug]: curveConfig,
  [maverickConfig.slug]: maverickConfig,
  [lidoConfig.slug]: lidoConfig,
};

export function getProtocol(slug: string): ProtocolConfig | undefined {
  return registry[slug];
}

export function getAllProtocols(): ProtocolConfig[] {
  return Object.values(registry);
}

export function getAllProtocolSlugs(): string[] {
  return Object.keys(registry);
}
