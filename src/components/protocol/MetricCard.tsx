import { ArrowDown, ArrowUp, Info, Minus } from "lucide-react";
import type { MetricDelta } from "@/lib/analytics/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  /** Pre-formatted value. Omitted (and not loading) renders an em dash. */
  value?: string;
  /** Short explanation shown in an info tooltip. */
  hint?: string;
  delta?: MetricDelta;
  loading?: boolean;
}

/**
 * Design-system KPI tile. Presentational only — callers format the value and
 * pass loading state. Used by the metrics strip and the analytics section.
 */
export function MetricCard({
  label,
  value,
  hint,
  delta,
  loading,
}: MetricCardProps) {
  return (
    <Card className="bg-card/60">
      <CardContent className="space-y-1.5 py-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">{label}</span>
          {hint && (
            <Tooltip>
              <TooltipTrigger
                className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:outline-none"
                aria-label={`About ${label}`}
              >
                <Info className="size-3 opacity-70" aria-hidden />
              </TooltipTrigger>
              <TooltipContent className="max-w-52 text-xs">
                {hint}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <p className="font-mono text-xl font-semibold tabular-nums">
            {value ?? <span className="text-muted-foreground/40">—</span>}
          </p>
        )}

        {delta && !loading && <DeltaChip delta={delta} />}
      </CardContent>
    </Card>
  );
}

function DeltaChip({ delta }: { delta: MetricDelta }) {
  const Icon =
    delta.direction === "up"
      ? ArrowUp
      : delta.direction === "down"
        ? ArrowDown
        : Minus;
  return (
    <p
      className={cn(
        "flex items-center gap-0.5 text-xs font-medium tabular-nums",
        delta.direction === "up" && "text-emerald-600 dark:text-emerald-400",
        delta.direction === "down" && "text-red-600 dark:text-red-400",
        delta.direction === "flat" && "text-muted-foreground",
      )}
    >
      <Icon className="size-3" aria-hidden />
      {Math.abs(delta.changePct).toFixed(1)}%
      {delta.windowLabel && (
        <span className="ml-1 font-normal text-muted-foreground">
          {delta.windowLabel}
        </span>
      )}
    </p>
  );
}
