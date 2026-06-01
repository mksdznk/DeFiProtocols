import { BarChart3 } from "lucide-react";
import type { ProtocolConfig } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolSection } from "./ProtocolSection";

/**
 * Analytics section. Phase 1 placeholder; Phase 4 renders volume timeseries,
 * top routes, and top chains via the protocol's AnalyticsAdapter (mock in v1,
 * real sources later) with source/freshness/sample labels.
 */
export function ProtocolAnalytics({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  return (
    <ProtocolSection
      id={id}
      title={title}
      description={`Usage, volume, and routing trends for ${config.name}.`}
    >
      <Card className="bg-card/60">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
          <BarChart3 className="size-8 opacity-50" aria-hidden />
          <p className="text-sm">Analytics charts arrive in the next phase.</p>
        </CardContent>
      </Card>
    </ProtocolSection>
  );
}
