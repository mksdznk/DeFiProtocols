import Link from "next/link";
import { ArrowUpRight, AtSign, BookText, Code, Globe, Coins } from "lucide-react";
import type { ProtocolConfig } from "@/protocols/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProtocolLogo } from "./ProtocolLogo";

const LINK_META: {
  key: keyof ProtocolConfig["links"];
  label: string;
  icon: typeof Globe;
}[] = [
  { key: "website", label: "Website", icon: Globe },
  { key: "app", label: "App", icon: Coins },
  { key: "docs", label: "Docs", icon: BookText },
  { key: "twitter", label: "X", icon: AtSign },
  { key: "github", label: "GitHub", icon: Code },
];

export function ProtocolHeader({ config }: { config: ProtocolConfig }) {
  const { branding } = config;

  return (
    <header className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background: `radial-gradient(60% 120% at 0% 0%, var(--protocol-accent), transparent 60%)`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← All protocols
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <ProtocolLogo branding={branding} className="size-14 text-xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {config.name}
                </h1>
                <Badge variant="secondary" className="font-normal">
                  {config.category}
                </Badge>
              </div>
              <p className="max-w-xl text-muted-foreground">{config.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {LINK_META.map(({ key, label, icon: Icon }) => {
              const href = config.links[key];
              if (!href) return null;
              return (
                <Button
                  key={key}
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon className="size-3.5" aria-hidden />
                    {label}
                    <ArrowUpRight className="size-3 opacity-60" aria-hidden />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
