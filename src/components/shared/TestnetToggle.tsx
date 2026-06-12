"use client";

import { FlaskConical } from "lucide-react";
import { useTestnetMode } from "@/hooks/useTestnetMode";
import { cn } from "@/lib/utils";

/**
 * Small switch that flips the app into testnet mode for surfaces that support
 * it. Rendered only on those surfaces (Aave, Compound, Lido). Accessible as a
 * `switch`; the label names the testnet so it's clear which network you'll land
 * on (e.g. "Sepolia", "Hoodi").
 */
export function TestnetToggle({ network }: { network: string }) {
  const { isTestnet, toggle } = useTestnetMode();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isTestnet}
      onClick={toggle}
      className={cn(
        "focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
        isTestnet
          ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      <FlaskConical className="size-3.5" aria-hidden />
      {isTestnet ? `Testnet · ${network}` : "Testnet"}
      <span
        className={cn(
          "relative ml-0.5 inline-flex h-3.5 w-6 items-center rounded-full transition-colors",
          isTestnet ? "bg-amber-500" : "bg-muted-foreground/30",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "inline-block size-2.5 rounded-full bg-white transition-transform",
            isTestnet ? "translate-x-3" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}
