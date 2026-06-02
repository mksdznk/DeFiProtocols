"use client";

import { useState } from "react";
import type { ProtocolConfig } from "@/protocols/types";
import type { Breakdown, TimeRange } from "@/lib/analytics/types";
import { formatMetricValue } from "@/lib/analytics/metrics-meta";
import { useBreakdowns, useTimeseries } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProtocolSection } from "./ProtocolSection";
import { TrendChart } from "./TrendChart";
import { DataProvenanceBadge } from "./DataProvenanceBadge";

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

const RANGE_LONG: Record<TimeRange, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 90 days",
  "1y": "last year",
};

export function ProtocolAnalytics({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  const { slug, name } = config;
  const [range, setRange] = useState<TimeRange>("30d");

  const series = useTimeseries(slug, range);
  const breakdowns = useBreakdowns(slug);

  const provenance = series.data ?? breakdowns.data;

  return (
    <ProtocolSection
      id={id}
      title={title}
      description={`Usage and on-chain trends for ${name}.`}
      headerAside={provenance && <DataProvenanceBadge provenance={provenance} />}
    >
      <Card className="bg-card/60">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="text-base font-medium">
            {series.data?.data.label ?? "Trend"}
          </CardTitle>
          <RangeTabs range={range} onChange={setRange} />
        </CardHeader>
        <CardContent>
          {series.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : series.data ? (
            <TrendChart
              points={series.data.data.points}
              format={series.data.data.format}
              ariaLabel={`${series.data.data.label} over the ${RANGE_LONG[range]}. Sample data.`}
            />
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {breakdowns.isPending
          ? [0, 1].map((i) => (
              <Card key={i} className="bg-card/60">
                <CardContent className="py-6">
                  <RowsSkeleton />
                </CardContent>
              </Card>
            ))
          : breakdowns.data?.data.map((breakdown) => (
              <BreakdownTable key={breakdown.id} breakdown={breakdown} />
            ))}
      </div>
    </ProtocolSection>
  );
}

function BreakdownTable({ breakdown }: { breakdown: Breakdown }) {
  return (
    <Card className="bg-card/60">
      <CardHeader>
        <CardTitle className="text-base font-medium">{breakdown.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 text-right font-medium">
                {breakdown.valueHeader}
              </th>
              <th className="pb-2 text-right font-medium">Share</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.rows.map((row) => (
              <tr key={row.label} className="border-t border-border/60">
                <td className="py-2">{row.label}</td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {formatMetricValue(row.valueUsd, "currency")}
                </td>
                <td className="py-2 text-right font-mono tabular-nums text-muted-foreground">
                  {row.sharePct.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function RangeTabs({
  range,
  onChange,
}: {
  range: TimeRange;
  onChange: (range: TimeRange) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Time range"
      className="inline-flex rounded-md border border-border bg-background p-0.5"
    >
      {RANGES.map((option) => {
        const active = option.value === range;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-protocol/10 text-protocol"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function RowsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-full" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">
      Analytics are unavailable right now.
    </p>
  );
}
