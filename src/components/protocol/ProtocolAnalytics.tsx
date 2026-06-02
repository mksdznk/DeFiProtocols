"use client";

import { useState } from "react";
import type { ProtocolConfig } from "@/protocols/types";
import type { TimeRange } from "@/lib/analytics/types";
import { formatMetricValue } from "@/lib/analytics/metrics-meta";
import {
  useTopChains,
  useTopRoutes,
  useVolumeSeries,
} from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProtocolSection } from "./ProtocolSection";
import { VolumeChart } from "./VolumeChart";
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

  const volume = useVolumeSeries(slug, range);
  const routes = useTopRoutes(slug);
  const chains = useTopChains(slug);

  const provenance = volume.data ?? routes.data ?? chains.data;

  return (
    <ProtocolSection
      id={id}
      title={title}
      description={`Usage, volume, and routing trends for ${name}.`}
      headerAside={provenance && <DataProvenanceBadge provenance={provenance} />}
    >
      <Card className="bg-card/60">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="text-base font-medium">Bridging volume</CardTitle>
          <RangeTabs range={range} onChange={setRange} />
        </CardHeader>
        <CardContent>
          {volume.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : volume.data ? (
            <VolumeChart points={volume.data.data} rangeLabel={RANGE_LONG[range]} />
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-medium">Top routes</CardTitle>
          </CardHeader>
          <CardContent>
            {routes.isPending ? (
              <RowsSkeleton />
            ) : routes.data ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Route</th>
                    <th className="pb-2 text-right font-medium">Volume (30d)</th>
                    <th className="pb-2 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.data.data.map((row) => (
                    <tr
                      key={`${row.fromChain}-${row.toChain}`}
                      className="border-t border-border/60"
                    >
                      <td className="py-2">
                        {row.fromChain}{" "}
                        <span className="text-muted-foreground" aria-label="to">
                          →
                        </span>{" "}
                        {row.toChain}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {formatMetricValue(row.volumeUsd, "currency")}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums text-muted-foreground">
                        {row.sharePct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Top source chains
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chains.isPending ? (
              <RowsSkeleton />
            ) : chains.data ? (
              <ul className="space-y-2.5">
                {chains.data.data.map((row) => (
                  <li key={row.chain} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{row.chain}</span>
                      <span className="font-mono tabular-nums text-muted-foreground">
                        {row.sharePct.toFixed(1)}%
                      </span>
                    </div>
                    <ShareBar
                      pct={row.sharePct}
                      max={chains.data.data[0].sharePct}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </div>
    </ProtocolSection>
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

function ShareBar({ pct, max }: { pct: number; max: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-protocol/70"
        style={{ width: `${Math.max(4, (pct / max) * 100)}%` }}
      />
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
