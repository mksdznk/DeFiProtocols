import { ArrowLeftRight } from "lucide-react";
import type { ProtocolConfig } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolSection } from "./ProtocolSection";

/**
 * Interaction section. Mounts the surface selected by `config.interaction`.
 * Phase 1 placeholder; Phase 5 mounts the lazy-loaded LiFi widget (or a future
 * custom SDK UI) via an interaction-surface registry.
 */
export function ProtocolInteractionPanel({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  if (config.interaction.kind === "none") return null;

  return (
    <ProtocolSection
      id={id}
      title={title}
      description={`Swap and bridge directly through ${config.name}.`}
    >
      <Card className="mx-auto max-w-md bg-card/60">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
          <ArrowLeftRight className="size-8 opacity-50" aria-hidden />
          <p className="text-sm">The interaction widget arrives in the next phase.</p>
        </CardContent>
      </Card>
    </ProtocolSection>
  );
}
