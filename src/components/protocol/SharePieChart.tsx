"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { MetricFormat } from "@/lib/analytics/types";
import { formatMetricValue } from "@/lib/analytics/metrics-meta";

export interface SharePieDatum {
  label: string;
  /** Raw value used to size the slice (e.g. USD value). */
  value: number;
  /** Optional precomputed share (0–100). Derived from values when omitted. */
  sharePct?: number;
}

interface Slice extends SharePieDatum {
  sharePct: number;
  color: string;
}

/**
 * Slice colors are derived from the page's per-protocol accent (the same token
 * the trend chart and KPIs use), blending toward the background so a single
 * brand hue yields a cohesive, readable palette on any protocol. A grouped
 * "Other" slice uses a neutral so it reads as a remainder, not a category.
 */
function sliceColor(index: number, count: number, isOther: boolean): string {
  if (isOther) return "var(--muted-foreground)";
  // 100% accent for the leading slice, stepping toward the background.
  const weight = Math.max(30, 100 - index * (count > 4 ? 15 : 18));
  return `color-mix(in oklch, var(--protocol-accent) ${weight}%, var(--background))`;
}

function PieTooltip({
  active,
  payload,
  format,
}: {
  active?: boolean;
  payload?: { payload: Slice }[];
  format: MetricFormat;
}) {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium">{slice.label}</p>
      <p className="font-mono tabular-nums text-muted-foreground">
        {formatMetricValue(slice.value, format)} · {slice.sharePct.toFixed(1)}%
      </p>
    </div>
  );
}

/**
 * Reusable donut/pie for protocol "share of …" breakdowns (market share, share
 * of volume, top chains, …). Self-contained and accessible: the SVG is
 * decorative (`aria-hidden`) while the visible legend carries the same numbers
 * as real text, so screen readers and sighted users get the breakdown.
 *
 * Long tails are grouped into a single "Other" slice (see `maxSlices`) so the
 * chart stays readable regardless of how many rows the adapter returns.
 */
export function SharePieChart({
  data,
  format = "currency",
  ariaLabel,
  valueHeader,
  maxSlices = 6,
}: {
  data: SharePieDatum[];
  format?: MetricFormat;
  ariaLabel: string;
  /** Optional column label for the legend's value, e.g. "TVL", "Volume (30d)". */
  valueHeader?: string;
  maxSlices?: number;
}) {
  const slices = useMemo<Slice[]>(() => {
    const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0) || 1;
    const withShare = data
      .map((d) => ({ ...d, sharePct: d.sharePct ?? (d.value / total) * 100 }))
      .sort((a, b) => b.value - a.value);

    // Collapse the tail beyond maxSlices into one neutral "Other" slice.
    const head = withShare.slice(0, maxSlices - 1);
    const tail = withShare.slice(maxSlices - 1);
    const visible =
      tail.length > 1
        ? [
            ...head,
            {
              label: "Other",
              value: tail.reduce((s, d) => s + d.value, 0),
              sharePct: tail.reduce((s, d) => s + d.sharePct, 0),
            },
          ]
        : withShare;

    return visible.map((d, i) => ({
      ...d,
      color: sliceColor(i, visible.length, d.label === "Other"),
    }));
  }, [data, maxSlices]);

  if (slices.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No breakdown data available.
      </p>
    );
  }

  return (
    <figure
      className="m-0 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
      role="img"
      aria-label={ariaLabel}
    >
      <div className="h-44 w-44 shrink-0" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="58%"
              outerRadius="100%"
              paddingAngle={1.5}
              stroke="var(--card)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {slices.map((slice) => (
                <Cell key={slice.label} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              content={<PieTooltip format={format} />}
              wrapperStyle={{ outline: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Visible legend = the accessible text alternative for the chart. */}
      <ul className="w-full min-w-0 flex-1 space-y-1.5 text-sm">
        {valueHeader && (
          <li className="flex items-center gap-2 pb-0.5 text-xs text-muted-foreground">
            <span className="size-2.5 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate">Name</span>
            <span className="shrink-0">{valueHeader}</span>
            <span className="w-12 shrink-0 text-right">Share</span>
          </li>
        )}
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: slice.color }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate">{slice.label}</span>
            <span className="shrink-0 font-mono tabular-nums text-muted-foreground">
              {formatMetricValue(slice.value, format)}
            </span>
            <span className="w-12 shrink-0 text-right font-mono tabular-nums font-medium">
              {slice.sharePct.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
