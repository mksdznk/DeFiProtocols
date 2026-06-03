import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllProtocols } from "@/protocols/registry";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolLogo } from "@/components/protocol/ProtocolLogo";

export default function Home() {
  const protocols = getAllProtocols();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-5xl px-6 py-16 outline-none sm:py-24"
    >
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          DeFi Protocol Hub
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Explore and use the best of DeFi
        </h1>
        <p className="text-balance text-lg text-muted-foreground">
          Learn how leading protocols work, dig into their analytics, and
          interact with them directly — all in one place.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {protocols.map((protocol) => {
          const accentStyle = {
            "--protocol-accent": protocol.branding.accent,
            "--protocol-accent-foreground":
              protocol.branding.accentForeground ?? "white",
          } as CSSProperties;

          return (
            <li key={protocol.slug} style={accentStyle}>
              <Link
                href={`/protocols/${protocol.slug}`}
                className="focus-visible:ring-ring group block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <Card className="h-full bg-card/60 transition-colors group-hover:border-protocol/50">
                  <CardContent className="flex h-full flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <ProtocolLogo
                        branding={protocol.branding}
                        className="size-11 text-lg"
                      />
                      <div>
                        <h2 className="font-semibold">{protocol.name}</h2>
                        <p className="text-xs text-muted-foreground">
                          {protocol.category}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {protocol.tagline}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-protocol">
                      Explore
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
