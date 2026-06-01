"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "./AccountMenu";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { ConnectModal } from "./ConnectModal";

/**
 * Primary wallet entry point. Renders a "Connect" button when disconnected and
 * the network switcher + account menu when connected. Safe across SSR: wagmi
 * (`ssr: true`) renders a deterministic disconnected state on the server and
 * reconnects on the client, so the server/client first render agree.
 */
export function ConnectButton() {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <NetworkSwitcher />
        </div>
        <AccountMenu />
      </div>
    );
  }

  return (
    <>
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Wallet className="size-4" aria-hidden />
        <span className="hidden sm:inline">Connect wallet</span>
        <span className="sm:hidden">Connect</span>
      </Button>
      <ConnectModal open={open} onOpenChange={setOpen} />
    </>
  );
}
