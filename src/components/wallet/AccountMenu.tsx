"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/useWallet";

export function AccountMenu() {
  const { address, displayName, chain } = useWallet();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  if (!address) return null;

  const explorerUrl = chain?.blockExplorers?.default?.url
    ? `${chain.blockExplorers.default.url}/address/${address}`
    : undefined;

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (insecure context); ignore.
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 font-mono">
          <span
            className="size-2 rounded-full bg-emerald-500"
            aria-hidden
          />
          {displayName}
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); copyAddress(); }}>
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? "Copied" : "Copy address"}
        </DropdownMenuItem>
        {explorerUrl && (
          <DropdownMenuItem asChild>
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" aria-hidden />
              View on explorer
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => disconnect()}
        >
          <LogOut className="size-4" aria-hidden />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
