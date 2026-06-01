import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          DeFi Protocol Hub
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Explore and use the best of DeFi
        </h1>
        <p className="text-balance text-lg text-muted-foreground">
          Learn how leading protocols work, dig into their analytics, and
          interact with them directly. Starting with LiFi cross-chain swaps and
          bridging.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/protocols/lifi">
          Open LiFi
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </main>
  );
}
