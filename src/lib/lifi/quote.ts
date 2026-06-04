import { formatUnits } from "viem";
import type { LiFiStep, RouteExtended } from "@lifi/sdk";

/** Format a raw on-chain amount into a friendly, trimmed number string. */
export function formatTokenAmount(raw: string, decimals: number): string {
  const value = Number(formatUnits(BigInt(raw), decimals));
  if (value === 0) return "0";
  const maxFrac = value < 1 ? 6 : value < 1000 ? 4 : 2;
  return value.toLocaleString("en-US", { maximumFractionDigits: maxFrac });
}

/** Total estimated cost (network gas + bridge/swap fees) in USD. */
export function quoteCostUsd(step: LiFiStep): number {
  const gas = (step.estimate.gasCosts ?? []).reduce(
    (sum, g) => sum + Number(g.amountUSD ?? 0),
    0,
  );
  const fees = (step.estimate.feeCosts ?? []).reduce(
    (sum, f) => sum + (f.included ? 0 : Number(f.amountUSD ?? 0)),
    0,
  );
  return gas + fees;
}

/** Friendly duration, e.g. "about 30 seconds", "about 3 minutes". */
export function friendlyDuration(seconds: number): string {
  if (seconds < 90) return `about ${Math.max(5, Math.round(seconds))} seconds`;
  const minutes = Math.round(seconds / 60);
  return `about ${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export type ExecutionPhaseKind = "action" | "pending" | "done" | "failed";

export interface ExecutionStatus {
  kind: ExecutionPhaseKind;
  message: string;
}

/** Translate raw route process state into one plain-language status line. */
export function deriveExecutionStatus(route: RouteExtended): ExecutionStatus {
  const processes = route.steps.flatMap((s) => s.execution?.process ?? []);

  const failed = processes.find((p) => p.status === "FAILED");
  if (failed) {
    return { kind: "failed", message: friendlyProcessError(failed.error?.message) };
  }

  const lastStep = route.steps[route.steps.length - 1];
  if (lastStep?.execution?.status === "DONE") {
    return { kind: "done", message: "All done — your funds are on the way!" };
  }

  const action = processes.find((p) => p.status === "ACTION_REQUIRED");
  if (action) {
    const approving = action.type === "TOKEN_ALLOWANCE" || action.type === "PERMIT";
    return {
      kind: "action",
      message: approving
        ? "Approve access to your token in your wallet…"
        : "Confirm the transaction in your wallet…",
    };
  }

  const pending = [...processes]
    .reverse()
    .find((p) => p.status === "PENDING" || p.status === "STARTED");
  if (pending) {
    const message =
      pending.type === "CROSS_CHAIN"
        ? "Moving your funds across networks…"
        : pending.type === "RECEIVING_CHAIN"
          ? "Almost there — finishing up…"
          : pending.type === "SWAP"
            ? "Swapping your tokens…"
            : "Working on it…";
    return { kind: "pending", message };
  }

  return { kind: "pending", message: "Getting started…" };
}

export function friendlyProcessError(message?: string): string {
  if (!message) return "Something went wrong. Please try again.";
  if (/reject|denied|user/i.test(message)) {
    return "You cancelled the request in your wallet.";
  }
  if (/insufficient|balance|funds/i.test(message)) {
    return "Not enough balance to cover the amount plus network fees.";
  }
  return "Something went wrong. Please try again.";
}
