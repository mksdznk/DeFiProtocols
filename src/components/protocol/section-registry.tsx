import type { ComponentType } from "react";
import type { ProtocolConfig, SectionType } from "@/protocols/types";
import { ProtocolBeginnerGuide } from "./ProtocolBeginnerGuide";
import { ProtocolOverview } from "./ProtocolOverview";
import { ProtocolMetrics } from "./ProtocolMetrics";
import { ProtocolInteractionPanel } from "./ProtocolInteractionPanel";
import { ProtocolAnalytics } from "./ProtocolAnalytics";
import { ProtocolIntegrations } from "./ProtocolIntegrations";
import { ProtocolResources } from "./ProtocolResources";
import { ProtocolSecurity } from "./ProtocolSecurity";
import { FAQSection } from "./FAQSection";

export interface SectionComponentProps {
  config: ProtocolConfig;
  id: string;
  title: string;
}

interface SectionMeta {
  /** Anchor id used for in-page navigation. */
  id: string;
  /** Default heading; overridable per-config via SectionConfig.title. */
  title: string;
  Component: ComponentType<SectionComponentProps>;
}

/**
 * The engine's lookup table: section type → anchor id, default title, component.
 * Adding a new section type is a single entry here plus its component.
 */
export const SECTION_REGISTRY: Record<SectionType, SectionMeta> = {
  beginner: {
    id: "start",
    title: "Start here",
    Component: ProtocolBeginnerGuide,
  },
  interaction: {
    id: "interact",
    title: "Interact with protocol",
    Component: ProtocolInteractionPanel,
  },
  overview: { id: "overview", title: "Overview", Component: ProtocolOverview },
  metrics: { id: "metrics", title: "Key metrics", Component: ProtocolMetrics },
  analytics: { id: "analytics", title: "Analytics", Component: ProtocolAnalytics },
  integrations: {
    id: "integrations",
    title: "Integrations",
    Component: ProtocolIntegrations,
  },
  resources: { id: "resources", title: "Learn", Component: ProtocolResources },
  security: { id: "security", title: "Security", Component: ProtocolSecurity },
  faq: { id: "faq", title: "FAQ", Component: FAQSection },
};

export interface ProtocolNavItem {
  type: SectionType;
  id: string;
  title: string;
  /** Column width within the page layout ("full" | "half"). */
  width: "full" | "half";
}

/** Ordered, enabled sections with resolved id/title — used by renderer & nav. */
export function getProtocolNavItems(config: ProtocolConfig): ProtocolNavItem[] {
  return config.sections
    .filter((section) => section.enabled !== false)
    .map((section) => {
      const meta = SECTION_REGISTRY[section.type];
      return {
        type: section.type,
        id: meta.id,
        title: section.title ?? meta.title,
        width: section.width ?? "full",
      };
    });
}
