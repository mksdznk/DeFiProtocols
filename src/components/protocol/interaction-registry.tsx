import type { ComponentType } from "react";
import { ArrowLeftRight, ArrowUpRight } from "lucide-react";
import type { InteractionConfig, ProtocolConfig } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EasySwapWrapper } from "@/components/lifi/EasySwapWrapper";
import { AaveEarnWrapper } from "@/components/aave/AaveEarnWrapper";
import { CompoundEarnWrapper } from "@/components/compound/CompoundEarnWrapper";
import { ProtocolLogo } from "./ProtocolLogo";

/**
 * Interaction-surface registry: maps `interaction.kind` to the component that
 * renders it. The interaction panel stays fully generic — it looks a surface up
 * here and renders it, with no protocol-specific branches. Adding a new way to
 * interact (a custom SDK UI, another widget, …) is one entry here plus the kind
 * in {@link InteractionConfig} — no changes to the panel or renderer.
 */

type InteractionKind = InteractionConfig["kind"];

interface SurfaceProps {
  config: ProtocolConfig;
}

// Thin surfaces that don't need protocol data (lazy, client-only wrappers).
function EasySwapSurface() {
  return <EasySwapWrapper />;
}

function AaveEarnSurface() {
  return <AaveEarnWrapper />;
}

function CompoundEarnSurface() {
  return <CompoundEarnWrapper />;
}

// A call-to-action out to a protocol's official app.
function ExternalSurface({ config }: SurfaceProps) {
  if (config.interaction.kind !== "external") return null;
  const { url, label, note } = config.interaction;
  return (
    <Card className="mx-auto max-w-md bg-card/60">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <ProtocolLogo branding={config.branding} className="size-12 text-lg" />
        <p className="text-sm text-muted-foreground">
          {note ??
            `${config.name} is used through its official app. You stay in control of your wallet and funds.`}
        </p>
        <Button asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {label}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Placeholder for a not-yet-built bespoke surface.
function CustomSurface({ config }: SurfaceProps) {
  return (
    <Card className="mx-auto max-w-md bg-card/60">
      <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
        <ArrowLeftRight className="size-8 opacity-50" aria-hidden />
        <p className="text-sm">
          A custom interaction surface for {config.name} is coming soon.
        </p>
      </CardContent>
    </Card>
  );
}

export interface InteractionSurface {
  Component: ComponentType<SurfaceProps>;
  /** Optional section description; receives the protocol for interpolation. */
  describe?: (config: ProtocolConfig) => string;
}

const swapDescribe = (config: ProtocolConfig) =>
  `Swap and bridge in a few simple steps — ${config.name} finds the route for you.`;

const appDescribe = (config: ProtocolConfig) =>
  `Use ${config.name} to interact on-chain.`;

const earnDescribe = (config: ProtocolConfig) =>
  `Deposit a coin and start earning with ${config.name} — no jargon, just a few taps.`;

/**
 * A `null` entry means "render no interaction section at all" (e.g. `none`),
 * so the panel needs no special-casing for it.
 */
export const INTERACTION_SURFACES: Record<
  InteractionKind,
  InteractionSurface | null
> = {
  "lifi-sdk": { Component: EasySwapSurface, describe: swapDescribe },
  "aave-sdk": { Component: AaveEarnSurface, describe: earnDescribe },
  "compound-sdk": { Component: CompoundEarnSurface, describe: earnDescribe },
  external: { Component: ExternalSurface, describe: appDescribe },
  custom: { Component: CustomSurface, describe: appDescribe },
  none: null,
};
