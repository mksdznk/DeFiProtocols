"use client";

import { FlaskConical } from "lucide-react";
import type { DataProvenance } from "@/lib/analytics/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRelativeTime } from "@/lib/format";

/**
 * Surfaces where a data set came from and how fresh it is. When the data is
 * sample/illustrative it says so explicitly — no fake precision presented as
 * real.
 */
export function DataProvenanceBadge({
  provenance,
}: {
  provenance: Pick<DataProvenance, "source" | "asOf" | "isSample">;
}) {
  const updated = formatRelativeTime(provenance.asOf);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="gap-1.5 font-normal text-muted-foreground"
        >
          {provenance.isSample && (
            <FlaskConical className="size-3 text-amber-500" aria-hidden />
          )}
          {provenance.source}
          <span aria-hidden>·</span>
          <span>updated {updated}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-60 text-xs">
        {provenance.isSample
          ? "Illustrative sample data for demonstration. Not live protocol figures."
          : `Source: ${provenance.source}.`}
      </TooltipContent>
    </Tooltip>
  );
}
