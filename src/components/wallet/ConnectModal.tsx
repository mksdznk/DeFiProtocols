"use client";

import { useEffect } from "react";
import { Loader2, Wallet } from "lucide-react";
import { useConnect, type Connector } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Wallet picker. Lists every available wagmi connector (injected wallets are
 * surfaced individually via EIP-6963), with per-connector pending and error
 * states. Closes itself on a successful connection.
 */
export function ConnectModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { connect, connectors, status, error, variables } = useConnect({
    mutation: {
      onSuccess: () => onOpenChange(false),
    },
  });

  // Reset nothing here; wagmi keeps last error until next attempt.
  useEffect(() => {
    if (!open) return;
  }, [open]);

  const pendingConnector =
    status === "pending"
      ? (variables?.connector as Connector | undefined)
      : undefined;

  // De-duplicate the generic "injected" connector when wallet-specific
  // (EIP-6963) connectors are present.
  const hasDiscovered = connectors.some((c) => c.id !== "injected");
  const visible = connectors.filter(
    (c) => !(hasDiscovered && c.id === "injected"),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Connect a wallet</DialogTitle>
          <DialogDescription>
            A wallet is like a secure key for crypto apps. Pick one to connect —
            it&apos;s free and only takes a few seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          {visible.map((connector) => {
            const isPending = pendingConnector?.uid === connector.uid;
            return (
              <button
                key={connector.uid}
                type="button"
                disabled={status === "pending"}
                onClick={() => connect({ connector })}
                className={cn(
                  "focus-visible:ring-ring flex items-center gap-3 rounded-lg border border-border bg-card/40 px-3 py-3 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
                )}
              >
                <ConnectorIcon connector={connector} />
                <span className="font-medium">{connector.name}</span>
                {isPending && (
                  <Loader2
                    className="ml-auto size-4 animate-spin text-muted-foreground"
                    aria-label="Connecting"
                  />
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {connectErrorMessage(error)}
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have a wallet yet?{" "}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2 hover:text-foreground"
          >
            Get MetaMask
          </a>{" "}
          — it&apos;s free.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function ConnectorIcon({ connector }: { connector: Connector }) {
  if (connector.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={connector.icon} alt="" className="size-7 rounded-md" />
    );
  }
  return (
    <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <Wallet className="size-4" aria-hidden />
    </span>
  );
}

function connectErrorMessage(error: Error): string {
  const message = error.message ?? "";
  if (/rejected|denied|user/i.test(message)) {
    return "Connection request was rejected.";
  }
  return "Couldn't connect. Please try again.";
}
