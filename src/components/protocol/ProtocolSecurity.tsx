import { ExternalLink, ShieldCheck, ShieldAlert, FileCheck2 } from "lucide-react";
import type { ProtocolConfig } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolSection } from "./ProtocolSection";

export function ProtocolSecurity({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  const { security } = config;

  return (
    <ProtocolSection
      id={id}
      title={title}
      description="Audits, bug bounty, and what to keep in mind before transacting."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/60">
          <CardContent className="space-y-3">
            <h3 className="flex items-center gap-2 font-medium">
              <FileCheck2 className="size-4 text-protocol" aria-hidden />
              Audits
            </h3>
            <ul className="space-y-2">
              {security.audits.map((audit) => (
                <li
                  key={audit.auditor}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span>
                    {audit.auditor}
                    {audit.date && (
                      <span className="text-muted-foreground">
                        {" "}
                        · {audit.date}
                      </span>
                    )}
                  </span>
                  {audit.url && (
                    <a
                      href={audit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-protocol"
                    >
                      View
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {security.bugBounty && (
          <Card className="bg-card/60">
            <CardContent className="space-y-3">
              <h3 className="flex items-center gap-2 font-medium">
                <ShieldCheck
                  className="size-4 text-protocol"
                  aria-hidden
                />
                Bug bounty
              </h3>
              <p className="text-sm">
                Hosted on {security.bugBounty.provider}
                {security.bugBounty.maxReward && (
                  <> · rewards up to {security.bugBounty.maxReward}</>
                )}
                .
              </p>
              <a
                href={security.bugBounty.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-protocol"
              >
                View program
                <ExternalLink className="size-3" aria-hidden />
              </a>
            </CardContent>
          </Card>
        )}
      </div>

      {security.notes && security.notes.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
            <ShieldAlert className="size-4" aria-hidden />
            Before you transact
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {security.notes.map((note, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="text-amber-500">
                  •
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ProtocolSection>
  );
}
