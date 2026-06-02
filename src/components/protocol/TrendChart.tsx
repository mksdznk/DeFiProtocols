"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MetricFormat, TimeseriesPoint } from "@/lib/analytics/types";
import { formatMetricValue } from "@/lib/analytics/metrics-meta";

const ACCENT = "var(--protocol-accent)";

function formatAxisDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ChartTooltip({
  active,
  payload,
  label,
  format,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  format: MetricFormat;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="text-muted-foreground">{label && formatAxisDate(label)}</p>
      <p className="font-mono font-medium tabular-nums">
        {formatMetricValue(payload[0].value, format)}
      </p>
    </div>
  );
}

/**
 * Generic trend area chart for any protocol timeseries (volume, TVL, …).
 * Decorative at the SVG level (screen readers get the summary via the labelled
 * wrapper + the accompanying breakdown tables); accent-themed for sighted users.
 */
export function TrendChart({
  points,
  format,
  ariaLabel,
}: {
  points: TimeseriesPoint[];
  format: MetricFormat;
  ariaLabel: string;
}) {
  return (
    <figure className="m-0" role="img" aria-label={ariaLabel}>
      <div className="h-64 w-full" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={(v: number) => formatMetricValue(v, format)}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={56}
            />
            <Tooltip
              content={<ChartTooltip format={format} />}
              cursor={{ stroke: "var(--border)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={ACCENT}
              strokeWidth={2}
              fill="url(#trend-fill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
