import {
  Activity,
  ArrowLeftRight,
  Cable,
  Check,
  Route,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ProtocolConfig } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtocolSection } from "./ProtocolSection";

/** Curated, tree-shakeable icon map for service icons referenced by config. */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Cable,
  Route,
  Activity,
  Wallet,
};

export function ProtocolOverview({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  const { overview } = config;

  return (
    <ProtocolSection id={id} title={title}>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <p className="text-lg leading-relaxed text-foreground/90">
            {overview.summary}
          </p>
          {overview.highlights && overview.highlights.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-2">
              {overview.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--protocol-accent)]"
                    aria-hidden
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Card className="bg-card/60">
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Supported chains
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {overview.chains.map((chain) => (
                  <Badge key={chain.name} variant="secondary">
                    {chain.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Supported wallets
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {overview.wallets.map((wallet) => (
                  <Badge key={wallet} variant="outline">
                    {wallet}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overview.services.map((service) => {
          const Icon = (service.icon && SERVICE_ICONS[service.icon]) || Route;
          return (
            <Card key={service.title} className="bg-card/60">
              <CardContent className="space-y-3">
                <span className="inline-flex size-9 items-center justify-center rounded-md bg-[var(--protocol-accent)]/12 text-[var(--protocol-accent)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-medium">{service.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ProtocolSection>
  );
}
