import type { ProtocolConfig } from "@/protocols/types";
import { METRIC_META } from "@/lib/analytics/metrics-meta";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolSection } from "./ProtocolSection";

/**
 * KPI strip. Phase 1 renders the metric scaffold from `config.metricKeys`;
 * Phase 4 wires live values through the protocol's AnalyticsAdapter.
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
  if (config.metricKeys.length === 0) return null;

  return (
    <ProtocolSection id={id} title={title}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {config.metricKeys.map((key) => {
          const meta = METRIC_META[key];
          return (
            <Card key={key} className="bg-card/60">
              <CardContent className="space-y-1 py-4">
                <p className="text-xs text-muted-foreground">{meta.label}</p>
                <p className="font-mono text-xl font-semibold tabular-nums text-muted-foreground/50">
                  —
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ProtocolSection>
  );
}
