import { ArrowLeftRight } from "lucide-react";
import type { ProtocolConfig } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { LiFiWidgetWrapper } from "@/components/lifi/LiFiWidgetWrapper";
import { ProtocolSection } from "./ProtocolSection";

/**
 * Interaction section. Mounts the surface selected by `config.interaction`:
 * the LI.FI widget today, a future custom SDK UI tomorrow — chosen by config,
 * with no change to the page or renderer.
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
  const { interaction } = config;
  if (interaction.kind === "none") return null;

  return (
    <ProtocolSection
      id={id}
      title={title}
      description={`Swap and bridge directly through ${config.name}.`}
    >
      {interaction.kind === "lifi-widget" ? (
        <LiFiWidgetWrapper />
      ) : (
        <Card className="mx-auto max-w-md bg-card/60">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
            <ArrowLeftRight className="size-8 opacity-50" aria-hidden />
            <p className="text-sm">
              A custom interaction surface for {config.name} is coming soon.
            </p>
          </CardContent>
        </Card>
      )}
    </ProtocolSection>
  );
}
