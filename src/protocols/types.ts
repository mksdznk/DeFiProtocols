import type { MetricKey } from "@/lib/analytics/types";

/**
 * The Protocol Detail Page (PDP) framework.
 *
 * A protocol is described entirely by a {@link ProtocolConfig}. The `[slug]`
 * route renders an ordered list of section modules from that config, so adding
 * a new protocol is "author one config + register one line" — no new page code.
 *
 * Keep this shape lean. Add fields only when a section genuinely needs them.
 */

/** Identifiers for the section modules the renderer knows how to mount. */
export type SectionType =
  | "beginner"
  | "overview"
  | "metrics"
  | "interaction"
  | "analytics"
  | "integrations"
  | "resources"
  | "security"
  | "faq";

export interface SectionConfig {
  type: SectionType;
  /** Defaults to true. Set false to keep a section authored but hidden. */
  enabled?: boolean;
  /** Optional override for the section heading. */
  title?: string;
}

export interface ProtocolBranding {
  /** Path to a logo asset (under /public) or remote URL. Optional. */
  logoSrc?: string;
  /** 1–2 char fallback shown when no logo is available. */
  monogram: string;
  /** Accent color as a CSS color (oklch/hex). Drives per-protocol theming. */
  accent: string;
  /** Foreground color to pair with `accent` for contrast on accent fills. */
  accentForeground?: string;
}

export interface ProtocolLinks {
  website?: string;
  docs?: string;
  twitter?: string;
  github?: string;
  discord?: string;
  blog?: string;
}

export interface ProtocolService {
  title: string;
  description: string;
  /** Lucide icon name (resolved by the Overview section). */
  icon?: string;
}

export interface SupportedChain {
  name: string;
  /** Optional chain logo (under /public) or remote URL. */
  iconSrc?: string;
}

export interface ProtocolIntegration {
  name: string;
  category?: string;
  url?: string;
}

export interface SecurityAudit {
  auditor: string;
  url?: string;
  /** ISO date of the audit. */
  date?: string;
}

export interface SecurityInfo {
  audits: SecurityAudit[];
  bugBounty?: {
    provider: string;
    url: string;
    /** e.g. "$1,000,000". */
    maxReward?: string;
  };
  notes?: string[];
}

export type ResourceDifficulty = "beginner" | "intermediate" | "advanced";

export interface VideoResource {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  difficulty: ResourceDifficulty;
  /** Publisher/source, e.g. "LiFi", "Bankless". */
  source: string;
  durationMinutes?: number;
}

export interface ArticleResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  readingMinutes?: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProtocolResources {
  videos: VideoResource[];
  articles: ArticleResource[];
  faqs: FaqItem[];
}

/** Which interaction surface to mount in the Interaction section. */
export type InteractionConfig =
  | { kind: "lifi-sdk" }
  | { kind: "aave-sdk" }
  | { kind: "compound-sdk" }
  | { kind: "curve-sdk" }
  | { kind: "custom"; component: string }
  | { kind: "external"; url: string; label: string; note?: string }
  | { kind: "none" };

/**
 * Plain-language onboarding for absolute beginners. Authored for someone brand
 * new to crypto — no jargon — so the protocol page can open with a friendly,
 * understandable "Start here" instead of dense terminology.
 */
export interface BeginnerGuide {
  /** What it is, in one or two jargon-free sentences. */
  inSimpleTerms: string;
  /** A friendly "it's like…" comparison to an everyday thing. */
  analogy: string;
  /** A few simple first steps to actually get going. */
  firstSteps: string[];
}

export interface ProtocolConfig {
  slug: string;
  name: string;
  /** Short, single-line positioning statement. */
  tagline: string;
  /** Category label, e.g. "Cross-chain liquidity aggregator". */
  category: string;
  branding: ProtocolBranding;
  links: ProtocolLinks;

  /** Plain-language intro shown first, for newcomers. */
  beginner: BeginnerGuide;

  overview: {
    /** A few sentences. Plain text (no markdown rendering in v1). */
    summary: string;
    highlights?: string[];
    services: ProtocolService[];
    chains: SupportedChain[];
    wallets: string[];
  };

  integrations: ProtocolIntegration[];
  security: SecurityInfo;
  resources: ProtocolResources;

  /** KPI keys shown in the Metrics strip (order preserved). */
  metricKeys: MetricKey[];

  interaction: InteractionConfig;

  /** Ordered list of sections to render under the header. */
  sections: SectionConfig[];
}
