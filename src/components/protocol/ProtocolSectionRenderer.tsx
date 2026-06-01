import type { ProtocolConfig } from "@/protocols/types";
import { getProtocolNavItems, SECTION_REGISTRY } from "./section-registry";

/**
 * The PDP engine: renders the ordered, enabled sections from a ProtocolConfig.
 * Each section component reads only the slice of config it needs.
 */
export function ProtocolSectionRenderer({
  config,
}: {
  config: ProtocolConfig;
}) {
  const items = getProtocolNavItems(config);

  return (
    <>
      {items.map((item) => {
        const { Component } = SECTION_REGISTRY[item.type];
        return (
          <Component
            key={item.type}
            config={config}
            id={item.id}
            title={item.title}
          />
        );
      })}
    </>
  );
}
