import { ArrowLeftRight, ArrowUpRight } from "lucide-react";
import type { ProtocolConfig } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LiFiWidgetWrapper } from "@/components/lifi/LiFiWidgetWrapper";
import { ProtocolSection } from "./ProtocolSection";

/**
 * Interaction section. Mounts the surface selected by `config.interaction`:
 * an embedded widget (LI.FI), an external-app CTA (e.g. Aave), a future custom
 * SDK UI, or nothing — chosen by config, with no change to the page or renderer.
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

  const description =
    interaction.kind === "lifi-widget"
      ? `Swap and bridge directly through ${config.name}.`
      : `Use ${config.name} to interact on-chain.`;

  return (
    <ProtocolSection id={id} title={title} description={description}>
      {interaction.kind === "lifi-widget" && <LiFiWidgetWrapper />}

      {interaction.kind === "external" && (
        <Card className="mx-auto max-w-md bg-card/60">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span
              className="flex size-12 items-center justify-center rounded-xl text-lg font-semibold"
              style={{
                backgroundColor: "var(--protocol-accent)",
                color: "var(--protocol-accent-foreground)",
              }}
              aria-hidden
            >
              {config.branding.monogram}
            </span>
            <p className="text-sm text-muted-foreground">
              {interaction.note ??
                `${config.name} is used through its official app. You stay in control of your wallet and funds.`}
            </p>
            <Button asChild>
              <a
                href={interaction.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {interaction.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {interaction.kind === "custom" && (
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
