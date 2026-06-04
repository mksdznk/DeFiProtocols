import type { ProtocolConfig } from "@/protocols/types";
import { INTERACTION_SURFACES } from "./interaction-registry";
import { ProtocolSection } from "./ProtocolSection";

/**
 * Interaction section — protocol-agnostic. It resolves the surface for the
 * configured `interaction.kind` from the registry and renders it; it has no
 * knowledge of any specific protocol or surface. A `null` registry entry (e.g.
 * `none`) renders nothing.
 */
export function ProtocolInteractionPanel({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  const surface = INTERACTION_SURFACES[config.interaction.kind];
  if (!surface) return null;

  const { Component, describe } = surface;

  return (
    <ProtocolSection id={id} title={title} description={describe?.(config)}>
      <Component config={config} />
    </ProtocolSection>
  );
}
