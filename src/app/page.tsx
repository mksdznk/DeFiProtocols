import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, MousePointerClick, Sparkles, Wallet } from "lucide-react";
import { getAllProtocols } from "@/protocols/registry";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolLogo } from "@/components/protocol/ProtocolLogo";

const START_STEPS = [
  {
    icon: Wallet,
    title: "Get a wallet",
    description:
      "A wallet is your digital pocket for crypto. It's free and takes a few minutes to set up.",
  },
  {
    icon: MousePointerClick,
    title: "Connect it",
    description:
      "Click “Connect wallet” at the top. No sign-ups, no passwords — just one click.",
  },
  {
    icon: Sparkles,
    title: "Pick a protocol",
    description:
      "Choose one below. Each page explains, in plain words, what it does and how to start.",
  },
];

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
          Your friendly start to crypto
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          New to crypto? Start here.
        </h1>
        <p className="text-balance text-lg text-muted-foreground">
          A simple, jargon-free way to explore what you can do with crypto — and
          try it, one easy step at a time.
        </p>
      </div>

      {/* How to start, in three plain steps. */}
      <section aria-labelledby="how-to-start" className="mt-12">
        <h2 id="how-to-start" className="sr-only">
          How to start
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {START_STEPS.map((step, i) => (
            <li key={step.title}>
              <Card className="h-full bg-card/60">
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                      {i + 1}
                    </span>
                    <step.icon
                      className="size-4 text-muted-foreground"
                      aria-hidden
                    />
                  </div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <h2 className="mt-14 mb-4 text-lg font-semibold">Pick something to try</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
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
                        <h3 className="font-semibold">{protocol.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {protocol.category}
                        </p>
                      </div>
                    </div>
                    {/* Plain-language description, not the technical tagline. */}
                    <p className="text-sm text-muted-foreground">
                      {protocol.beginner.inSimpleTerms}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-protocol">
                      Start here
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
