"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { parseUnits } from "viem";
import { arbitrum, base, mainnet, polygon, avalancheFuji, hardhat, linea, mantle, optimism, ronin, scroll, sepolia, unichain } from "viem/chains";
import {
  useAccount,
  useChainId,
  useConfig,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldTooltip } from "@/components/shared/FieldTooltip";
import { ConnectModal } from "@/components/wallet/ConnectModal";
import { cometAbi, erc20Abi } from "@/lib/compound/markets";
import {
  useCompoundMarkets,
  type CompoundMarket,
} from "@/hooks/useCompoundMarkets";

// Network metadata (name + explorer) derived from viem's chain objects.
const VIEM_CHAINS = [mainnet, base, arbitrum, polygon, avalancheFuji, hardhat, linea, mantle, optimism, ronin, scroll, sepolia, unichain];
function chainOf(id: number) {
  return VIEM_CHAINS.find((c) => c.id === id);
}

type Phase = "form" | "working" | "done" | "error";

/**
 * Compound "Easy Earn": a beginner-friendly Supply & Earn on Compound III.
 * Supplying a market's base coin earns interest with no borrowing or liquidation
 * risk. Markets, tokens, and live APYs are read straight from the Comet
 * contracts; the deposit (approve + supply) runs through the connected wallet.
 */
export function CompoundEasyEarn() {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const config = useConfig();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [connectOpen, setConnectOpen] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [selectedComet, setSelectedComet] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { data: markets, isPending } = useCompoundMarkets();
  const sorted = (markets ?? []).slice().sort((a, b) => b.apy - a.apy);

  // Networks available, derived from the markets (no hardcoded chain list).
  const chainIds = [...new Set((markets ?? []).map((m) => m.chainId))];
  const activeChainId = selectedChainId ?? chainIds[0];

  // Coins available on the active network.
  const coins = sorted.filter((m) => m.chainId === activeChainId);
  const market = coins.find((m) => m.comet === selectedComet) ?? coins[0];

  const amountNumber = Number(amount);
  const validAmount = /^\d*\.?\d*$/.test(amount) && amountNumber > 0;
  const yearlyEarnings =
    validAmount && market ? (amountNumber * market.apy) / 100 : 0;

  async function handleSupply() {
    if (!market || !address || !validAmount) return;
    setPhase("working");
    setTxHash(null);
    try {
      const amountWei = parseUnits(amount, market.decimals);

      if (currentChainId !== market.chainId) {
        setStatusMsg("Switch network in your wallet…");
        await switchChainAsync({ chainId: market.chainId });
      }

      const allowance = (await readContract(config, {
        address: market.baseToken,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, market.comet],
        chainId: market.chainId,
      })) as bigint;

      if (allowance < amountWei) {
        setStatusMsg(`Approve ${market.symbol} in your wallet…`);
        const approveHash = await writeContractAsync({
          address: market.baseToken,
          abi: erc20Abi,
          functionName: "approve",
          args: [market.comet, amountWei],
          chainId: market.chainId,
        });
        await waitForTransactionReceipt(config, {
          hash: approveHash,
          chainId: market.chainId,
        });
      }

      setStatusMsg("Confirm the deposit in your wallet…");
      const supplyHash = await writeContractAsync({
        address: market.comet,
        abi: cometAbi,
        functionName: "supply",
        args: [market.baseToken, amountWei],
        chainId: market.chainId,
      });
      setStatusMsg("Finishing your deposit…");
      await waitForTransactionReceipt(config, {
        hash: supplyHash,
        chainId: market.chainId,
      });
      setTxHash(supplyHash);
      setPhase("done");
    } catch (err) {
      setStatusMsg(friendlyError(err, market.symbol));
      setPhase("error");
    }
  }

  function reset() {
    setPhase("form");
    setStatusMsg(null);
    setTxHash(null);
    setAmount("");
  }

  if (phase !== "form") {
    return (
      <div className="mx-auto w-full max-w-md">
        <ResultPanel
          phase={phase}
          message={statusMsg}
          txHash={txHash}
          token={market?.symbol}
          explorer={market ? chainOf(market.chainId)?.blockExplorers?.default?.url : undefined}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="bg-card/60">
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-sm font-medium text-protocol">
              <Sparkles className="size-4" aria-hidden />
              Earn on your crypto
            </p>
            <p className="text-sm text-muted-foreground">
              Deposit a coin and earn interest over time. You can take it out
              whenever you like — no borrowing, no lock-up.
            </p>
          </div>

          {/* Network */}
          <Field label="Network">
            {isPending && chainIds.length === 0 ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                value={activeChainId ? String(activeChainId) : ""}
                onValueChange={(v) => {
                  setSelectedChainId(Number(v));
                  setSelectedComet("");
                }}
              >
                <FieldTooltip label="The network this Compound market is on">
                  <SelectTrigger className="w-full" aria-label="Network">
                    <SelectValue placeholder="Choose a network" />
                  </SelectTrigger>
                </FieldTooltip>
                <SelectContent>
                  {chainIds.map((id) => (
                    <SelectItem key={id} value={String(id)}>
                      {chainOf(id)?.name ?? `Chain ${id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          {/* Coin */}
          <Field label="Coin to deposit">
            {isPending && sorted.length === 0 ? (
              <Skeleton className="h-9 w-full" />
            ) : coins.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No coins available on this network right now.
              </p>
            ) : (
              <Select
                value={market?.comet ?? ""}
                onValueChange={setSelectedComet}
              >
                <FieldTooltip label="The coin you'll deposit to earn interest">
                  <SelectTrigger className="w-full" aria-label="Coin to deposit">
                    <SelectValue />
                  </SelectTrigger>
                </FieldTooltip>
                <SelectContent>
                  {coins.map((m) => (
                    <SelectItem key={m.comet} value={m.comet}>
                      {m.symbol} — earn {m.apy.toFixed(2)}% / year
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          {/* Amount */}
          <Field label="Amount">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3">
              <input
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  if (/^\d*\.?\d*$/.test(e.target.value))
                    setAmount(e.target.value);
                }}
                aria-label="Amount to deposit"
                className="w-full bg-transparent py-2.5 text-2xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40"
              />
              <span className="text-sm font-medium text-muted-foreground">
                {market?.symbol}
              </span>
            </div>
          </Field>

          {/* Plain-language earnings */}
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
            {market ? (
              validAmount ? (
                <p>
                  At today&apos;s rate of{" "}
                  <span className="font-medium">{market.apy.toFixed(2)}%</span>,
                  you&apos;d earn about{" "}
                  <span className="font-medium">
                    {yearlyEarnings.toLocaleString("en-US", {
                      maximumFractionDigits: yearlyEarnings < 1 ? 4 : 2,
                    })}{" "}
                    {market.symbol}
                  </span>{" "}
                  per year.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Enter an amount to see what you&apos;d earn at{" "}
                  {market.apy.toFixed(2)}% / year.
                </p>
              )
            ) : (
              <p className="text-muted-foreground">
                Pick a coin to see how much you can earn.
              </p>
            )}
          </div>

          {!isConnected ? (
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => setConnectOpen(true)}
            >
              <Wallet className="size-4" aria-hidden />
              Connect wallet
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full"
              disabled={!market || !validAmount}
              onClick={handleSupply}
            >
              {validAmount ? `Deposit ${market?.symbol ?? ""}` : "Enter an amount"}
            </Button>
          )}

          <p className="text-center text-xs text-muted-foreground">
            You stay in control — nothing moves until you approve it in your
            wallet, and you can withdraw anytime.
          </p>
        </CardContent>
      </Card>
      <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ResultPanel({
  phase,
  message,
  txHash,
  token,
  explorer,
  onReset,
}: {
  phase: Phase;
  message: string | null;
  txHash: string | null;
  token?: string;
  explorer?: string;
  onReset: () => void;
}) {
  const txLink = txHash && explorer ? `${explorer}/tx/${txHash}` : null;
  return (
    <Card className="bg-card/60">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        {phase === "done" ? (
          <>
            <CheckCircle2 className="size-12 text-emerald-500" aria-hidden />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">You&apos;re earning! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Your {token ?? "deposit"} is now earning interest. You can
                withdraw it whenever you like.
              </p>
            </div>
          </>
        ) : phase === "error" ? (
          <>
            <AlertCircle className="size-12 text-destructive" aria-hidden />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">That didn&apos;t go through</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </>
        ) : (
          <>
            <Loader2
              className="size-12 animate-spin text-[var(--protocol-accent)]"
              aria-hidden
            />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Working on your deposit</h3>
              <p className="text-sm text-muted-foreground">
                {message ?? "Getting started…"}
              </p>
            </div>
          </>
        )}

        {txLink && (
          <a
            href={txLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View transaction
            <ExternalLink className="size-3" aria-hidden />
          </a>
        )}

        {(phase === "done" || phase === "error") && (
          <Button
            onClick={onReset}
            variant={phase === "done" ? "default" : "outline"}
          >
            {phase === "done" ? "Make another deposit" : "Try again"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function friendlyError(err: any, symbol?: string): string {
  const msg = String(err?.shortMessage ?? err?.message ?? err ?? "");
  if (/reject|denied|cancell?ed|user/i.test(msg)) {
    return "You cancelled the request in your wallet.";
  }
  if (/insufficient|exceeds balance|transfer amount/i.test(msg)) {
    return `You don't have enough ${symbol ?? "of that coin"} for this deposit.`;
  }
  return "Something went wrong. Please try again.";
}

export type { CompoundMarket };
