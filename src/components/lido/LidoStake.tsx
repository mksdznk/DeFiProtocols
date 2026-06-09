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
import { mainnet } from "viem/chains";
import { useAccount, useChainId, useSwitchChain, useWalletClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectModal } from "@/components/wallet/ConnectModal";
import {
  getLidoApr,
  LIDO_CHAIN_ID,
  LIDO_NETWORKS,
  stakeEth,
} from "@/lib/lido/sdk";

type Phase = "form" | "working" | "done" | "error";

/**
 * Lido liquid staking, made simple: deposit ETH and receive stETH that earns
 * staking rewards while staying usable across DeFi. Liquid staking is an
 * Ethereum action, so the network is fixed to Ethereum (from the Lido SDK).
 */
export function LidoStake() {
  const { isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();

  const [connectOpen, setConnectOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const aprQuery = useQuery({
    queryKey: ["lido", "apr"],
    queryFn: getLidoApr,
    staleTime: 5 * 60_000,
  });
  const apr = aprQuery.data;

  const amountNumber = Number(amount);
  const validAmount = /^\d*\.?\d*$/.test(amount) && amountNumber > 0;
  const yearlyEarnings =
    validAmount && apr != null ? (amountNumber * apr) / 100 : 0;

  const network = LIDO_NETWORKS[0];

  async function handleStake() {
    if (!isConnected || !walletClient || !validAmount) return;
    setPhase("working");
    setTxHash(null);
    try {
      if (currentChainId !== LIDO_CHAIN_ID) {
        setStatusMsg("Switch to Ethereum in your wallet…");
        await switchChainAsync({ chainId: LIDO_CHAIN_ID });
      }
      setStatusMsg("Confirm the stake in your wallet…");
      const hash = await stakeEth(walletClient, amount);
      setTxHash(hash);
      setPhase("done");
    } catch (err) {
      setStatusMsg(friendlyError(err));
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
          explorer={mainnet.blockExplorers?.default?.url}
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
              Earn on your ETH
            </p>
            <p className="text-sm text-muted-foreground">
              Stake ETH and get stETH — it earns staking rewards over time and
              stays usable across DeFi. You can unstake whenever you like.
            </p>
          </div>

          {/* Network (Lido staking is on Ethereum) */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Network
            </span>
            <span className="text-sm font-medium">{network.name}</span>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Amount to stake
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3">
              <input
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
                }}
                aria-label="Amount of ETH to stake"
                className="w-full bg-transparent py-2.5 text-2xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40"
              />
              <span className="text-sm font-medium text-muted-foreground">
                ETH
              </span>
            </div>
          </div>

          {/* Plain-language earnings */}
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
            {apr == null ? (
              <p className="text-muted-foreground">Loading today&apos;s rate…</p>
            ) : validAmount ? (
              <p>
                You&apos;ll get about{" "}
                <span className="font-medium">{formatAmount(amountNumber)} stETH</span>{" "}
                and earn around{" "}
                <span className="font-medium">{apr.toFixed(2)}%</span> per year (≈{" "}
                {formatAmount(yearlyEarnings)} stETH).
              </p>
            ) : (
              <p className="text-muted-foreground">
                Enter an amount to see your rewards at {apr.toFixed(2)}% per year.
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
              disabled={!validAmount || !walletClient}
              onClick={handleStake}
            >
              {validAmount ? "Stake ETH" : "Enter an amount"}
            </Button>
          )}

          <p className="text-center text-xs text-muted-foreground">
            You stay in control — nothing moves until you approve it in your
            wallet, and your stETH stays yours.
          </p>
        </CardContent>
      </Card>
      <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}

function ResultPanel({
  phase,
  message,
  txHash,
  explorer,
  onReset,
}: {
  phase: Phase;
  message: string | null;
  txHash: string | null;
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
              <h3 className="text-lg font-semibold">You&apos;re staking! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Your stETH is now earning rewards. You can use it across DeFi or
                unstake whenever you like.
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
              <h3 className="text-lg font-semibold">Working on your stake</h3>
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
            {phase === "done" ? "Stake more" : "Try again"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const maxFrac = value < 1 ? 6 : value < 1000 ? 4 : 2;
  return value.toLocaleString("en-US", { maximumFractionDigits: maxFrac });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function friendlyError(err: any): string {
  const msg = String(err?.shortMessage ?? err?.message ?? err ?? "");
  if (/reject|denied|cancell?ed|user/i.test(msg)) {
    return "You cancelled the request in your wallet.";
  }
  if (/insufficient|balance|funds/i.test(msg)) {
    return "Not enough ETH to cover the amount plus network fees.";
  }
  return "Something went wrong. Please try again.";
}
