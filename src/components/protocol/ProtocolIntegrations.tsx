import { ExternalLink } from "lucide-react";
import type { ProtocolConfig, ProtocolIntegration } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolSection } from "./ProtocolSection";

function groupByCategory(integrations: ProtocolIntegration[]) {
  const groups = new Map<string, ProtocolIntegration[]>();
  for (const item of integrations) {
    const key = item.category ?? "Other";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

export function ProtocolIntegrations({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  if (config.integrations.length === 0) return null;
  const groups = groupByCategory(config.integrations);

  return (
    <ProtocolSection
      id={id}
      title={title}
      description={`Liquidity sources and protocols ${config.name} routes through.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(([category, items]) => (
          <Card key={category} className="bg-card/60">
            <CardContent className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {category}
              </h3>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item.name}>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm hover:text-[var(--protocol-accent)]"
                      >
                        {item.name}
                        <ExternalLink className="size-3 opacity-60" aria-hidden />
                      </a>
                    ) : (
                      <span className="text-sm">{item.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </ProtocolSection>
  );
}
