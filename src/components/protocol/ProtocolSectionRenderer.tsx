import type { ProtocolConfig } from "@/protocols/types";
import {
  getProtocolNavItems,
  SECTION_REGISTRY,
  type ProtocolNavItem,
} from "./section-registry";

/**
 * The PDP engine: renders the ordered, enabled sections from a ProtocolConfig.
 * Each section component reads only the slice of config it needs.
 *
 * Layout: sections stack full-width by default. Two consecutive `width: "half"`
 * sections are paired into one row and sit side by side on wide screens (and
 * stack on small ones) — e.g. the interaction panel beside the key metrics.
 */
export function ProtocolSectionRenderer({
  config,
}: {
  config: ProtocolConfig;
}) {
  const rows = groupIntoRows(getProtocolNavItems(config));

  return (
    <>
      {rows.map((row) =>
        row.length === 2 ? (
          <div
            key={row[0].type}
            className="grid items-start gap-x-8 md:grid-cols-2"
          >
            {row.map((item) => renderSection(config, item))}
          </div>
        ) : (
          renderSection(config, row[0])
        ),
      )}
    </>
  );
}

function renderSection(config: ProtocolConfig, item: ProtocolNavItem) {
  const { Component } = SECTION_REGISTRY[item.type];
  return (
    <Component key={item.type} config={config} id={item.id} title={item.title} />
  );
}

/**
 * Pack the ordered sections into rows: two adjacent `half` sections share a row;
 * everything else (including a lone trailing `half`) gets its own full row.
 */
function groupIntoRows(items: ProtocolNavItem[]): ProtocolNavItem[][] {
  const rows: ProtocolNavItem[][] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const next = items[i + 1];
    if (item.width === "half" && next?.width === "half") {
      rows.push([item, next]);
      i++;
    } else {
      rows.push([item]);
    }
  }
  return rows;
}
