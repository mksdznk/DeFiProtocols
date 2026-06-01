"use client";

import { AlertTriangle, Check, ChevronDown } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Network indicator + switcher. Shows the active chain (or a clear
 * "wrong network" warning when connected to a chain outside our config) and
 * lets the user switch to any configured chain.
 */
export function NetworkSwitcher() {
  const { isConnected, chain } = useAccount();
  const { chains, switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  const unsupported = !chain;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={isPending}
        >
          {unsupported ? (
            <>
              <AlertTriangle className="size-3.5 text-amber-500" aria-hidden />
              <span className="text-amber-600 dark:text-amber-400">
                Wrong network
              </span>
            </>
          ) : (
            <span>{chain.name}</span>
          )}
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Switch network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {chains.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onSelect={() => switchChain({ chainId: c.id })}
            disabled={c.id === chain?.id}
          >
            <span className="flex-1">{c.name}</span>
            {c.id === chain?.id && <Check className="size-4" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
