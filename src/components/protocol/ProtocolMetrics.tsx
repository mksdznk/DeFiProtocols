"use client";

import type { ProtocolConfig } from "@/protocols/types";
import { METRIC_META, formatMetricValue } from "@/lib/analytics/metrics-meta";
import { useMetrics } from "@/hooks/useAnalytics";
import { MetricCard } from "./MetricCard";
import { ProtocolSection } from "./ProtocolSection";
import { DataProvenanceBadge } from "./DataProvenanceBadge";

/**
 * KPI strip, wired to the protocol's AnalyticsAdapter (mock in v1). Renders
 * loading skeletons while fetching, then formatted values + deltas, with a
 * provenance/sample badge in the section header.
 */
export function ProtocolMetrics({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  const { data, isLoading } = useMetrics(config.slug, config.metricKeys);

  if (config.metricKeys.length === 0) return null;

  const byKey = new Map(data?.data.map((m) => [m.key, m]));

  return (
    <ProtocolSection
      id={id}
      title={title}
      headerAside={data && <DataProvenanceBadge provenance={data} />}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {config.metricKeys.map((key) => {
          const meta = METRIC_META[key];
          const metric = byKey.get(key);
          return (
            <MetricCard
              key={key}
              label={meta.label}
              hint={meta.hint}
              loading={isLoading}
              value={
                metric ? formatMetricValue(metric.value, metric.format) : undefined
              }
              delta={metric?.delta}
            />
          );
        })}
      </div>
    </ProtocolSection>
  );
}
