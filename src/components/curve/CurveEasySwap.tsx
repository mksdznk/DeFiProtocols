"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Wallet,
} from "lucide-react";
import type { Chain } from "viem";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConnectModal } from "@/components/wallet/ConnectModal";
import type { SupportedChainId } from "@/lib/wagmi";
import { TokenCombobox } from "@/components/shared/TokenCombobox";
import {
  curve,
  CURVE_NETWORKS,
  fetchCurveTokens,
  getCurveExpected,
  initWriteForChain,
  resetCurveNetwork,
  type CurveTokenInfo,
} from "@/lib/curve/sdk";
import { Tooltip, TooltipContent } from "../ui/tooltip";

type Phase = "form" | "working" | "done" | "error";

const CHAIN_BY_ID: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [arbitrum.id]: arbitrum,
  [optimism.id]: optimism,
  [base.id]: base,
  [polygon.id]: polygon,
};

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

function pickToken(
  tokens: CurveTokenInfo[],
  prefer: string[],
  exclude?: string,
): string | undefined {
  for (const sym of prefer) {
    const t = tokens.find(
      (x) => x.symbol.toUpperCase() === sym && x.address !== exclude,
    );
    if (t) return t.address;
  }
  return tokens.find((x) => x.address !== exclude)?.address;
}

/**
 * A beginner-friendly Curve swap. Network and the full token list are loaded
 * live from curve-js (every swappable coin, searchable); Curve routes across its
 * pools. The swap runs through the same wallet the page uses.
 */
export function CurveEasySwap() {
  const { isConnected, connector } = useAccount();
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const [connectOpen, setConnectOpen] = useState(false);
  const [chainId, setChainId] = useState<SupportedChainId>(mainnet.id);
  const [fromOverride, setFromOverride] = useState<string | null>(null);
  const [toOverride, setToOverride] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const tokensQuery = useQuery({
    queryKey: ["curve", "tokens", chainId],
    queryFn: () => fetchCurveTokens(chainId),
    staleTime: 5 * 60_000,
    retry: 1,
  });
  const tokens = tokensQuery.data ?? [];

  const fromAddr = fromOverride ?? pickToken(tokens, ["USDC", "DAI", "WETH"]);
  const toAddr =
    toOverride ?? pickToken(tokens, ["USDT", "crvUSD", "USDC", "DAI"], fromAddr);

  const fromToken = tokens.find((t) => t.address === fromAddr);
  const toToken = tokens.find((t) => t.address === toAddr);
  const sameToken =
    !!fromAddr && !!toAddr && fromAddr.toLowerCase() === toAddr.toLowerCase();

  const debouncedAmount = useDebounced(amount, 400);
  const amountNumber = Number(debouncedAmount);
  const validAmount = /^\d*\.?\d*$/.test(debouncedAmount) && amountNumber > 0;

  const quote = useQuery({
    queryKey: ["curve", "quote", chainId, fromAddr, toAddr, debouncedAmount],
    enabled:
      phase === "form" && !!fromAddr && !!toAddr && !sameToken && validAmount,
    staleTime: 15_000,
    retry: false,
    queryFn: () => getCurveExpected(chainId, fromAddr!, toAddr!, debouncedAmount),
  });

  function changeNetwork(id: number) {
    setChainId(id as SupportedChainId);
    setFromOverride(null);
    setToOverride(null);
  }
  function flip() {
    setFromOverride(toAddr ?? null);
    setToOverride(fromAddr ?? null);
  }

  async function handleSwap() {
    if (!isConnected || !fromToken || !toToken || !validAmount || sameToken)
      return;
    setPhase("working");
    setTxHash(null);
    try {
      if (currentChainId !== chainId) {
        setStatusMsg("Switch network in your wallet…");
        await switchChainAsync({ chainId });
      }
      const provider = await connector?.getProvider();
      if (!provider) throw new Error("No wallet provider available.");

      setStatusMsg("Getting ready…");
      await initWriteForChain(provider, chainId);

      if (!(await curve.router.isApproved(fromAddr, amount))) {
        setStatusMsg(`Approve ${fromToken.symbol} in your wallet…`);
        await curve.router.approve(fromAddr, amount);
      }

      setStatusMsg("Confirm the swap in your wallet…");
      const tx = await curve.router.swap(fromAddr, toAddr, amount, 0.5);
      setStatusMsg("Finishing your swap…");
      await tx.wait();

      setTxHash(tx.hash);
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
    resetCurveNetwork();
  }

  if (phase !== "form") {
    return (
      <div className="mx-auto w-full max-w-md">
        <ResultPanel
          phase={phase}
          message={statusMsg}
          txHash={txHash}
          toSymbol={toToken?.symbol}
          explorer={CHAIN_BY_ID[chainId]?.blockExplorers?.default?.url}
          onReset={reset}
        />
      </div>
    );
  }

  const tokensLoading = tokensQuery.isPending;

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="bg-card/60">
        <CardContent className="space-y-3">
          {/* Network */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Network</p>
            <Select
              value={String(chainId)}
              onValueChange={(v) => changeNetwork(Number(v))}
            >
              <SelectTrigger className="w-full" aria-label="Network">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURVE_NETWORKS.map((n) => (
                  <SelectItem key={n.chainId} value={String(n.chainId)}>
                    {n.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* You pay */}
          <TokenPanel label="You pay">
            <input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
              }}
              aria-label="Amount to pay"
              className="w-full bg-transparent text-3xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40"
            />
            <TokenCombobox
              tokens={tokens}
              value={fromAddr}
              onChange={setFromOverride}
              loading={tokensLoading}
            />
          </TokenPanel>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={flip}
              aria-label="Swap direction"
              className="focus-visible:ring-ring flex size-8 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
            </button>
          </div>

          {/* You get */}
          <TokenPanel label="You get">
            <div className="text-3xl font-semibold tabular-nums">
              {quote.isFetching ? (
                <span className="text-muted-foreground/50">…</span>
              ) : quote.data ? (
                <>≈ {formatAmount(quote.data)}</>
              ) : (
                <span className="text-muted-foreground/40">0</span>
              )}
            </div>
            <TokenCombobox
              tokens={tokens}
              value={toAddr}
              onChange={setToOverride}
              loading={tokensLoading}
            />
          </TokenPanel>

          <QuoteSummary
            tokensLoading={tokensLoading}
            loading={quote.isFetching}
            output={quote.data}
            error={quote.isError}
            sameToken={sameToken}
            hasAmount={validAmount}
            fromSymbol={fromToken?.symbol}
            toSymbol={toToken?.symbol}
            amount={debouncedAmount}
          />

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
              disabled={sameToken || !validAmount || !quote.data}
              onClick={handleSwap}
            >
              {sameToken
                ? "Pick two different coins"
                : !validAmount
                  ? "Enter an amount"
                  : quote.isFetching
                    ? "Getting your best price…"
                    : "Swap now"}
            </Button>
          )}

          <p className="text-center text-xs text-muted-foreground">
            You stay in control — nothing happens until you approve it in your
            wallet.
          </p>
        </CardContent>
      </Card>
      <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}

function TokenPanel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-4">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between gap-3">{children}</div>
    </div>
  );
}

function QuoteSummary({
  tokensLoading,
  loading,
  output,
  error,
  sameToken,
  hasAmount,
  fromSymbol,
  toSymbol,
  amount,
}: {
  tokensLoading: boolean;
  loading: boolean;
  output?: string;
  error: boolean;
  sameToken: boolean;
  hasAmount: boolean;
  fromSymbol?: string;
  toSymbol?: string;
  amount: string;
}) {
  if (tokensLoading) return <Hint>Loading Curve markets…</Hint>;
  if (sameToken) return <Hint>Pick two different coins to swap between.</Hint>;
  if (!hasAmount)
    return <Hint>Type an amount above to see what you&apos;ll get.</Hint>;
  if (loading) return <Hint>Finding you the best price on Curve…</Hint>;
  if (error || !output)
    return <Hint>We couldn&apos;t find a route for those coins right now.</Hint>;

  const rate = Number(output) / Number(amount);
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
      <p>
        You&apos;ll get about{" "}
        <span className="font-medium">
          {formatAmount(output)} {toSymbol}
        </span>
        .
      </p>
      {Number.isFinite(rate) && (
        <p className="text-xs text-muted-foreground">
          1 {fromSymbol} ≈{" "}
          {rate.toLocaleString("en-US", { maximumFractionDigits: 6 })} {toSymbol}{" "}
          · best route via Curve
        </p>
      )}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
      {children}
    </p>
  );
}

function ResultPanel({
  phase,
  message,
  txHash,
  toSymbol,
  explorer,
  onReset,
}: {
  phase: Phase;
  message: string | null;
  txHash: string | null;
  toSymbol?: string;
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
              <h3 className="text-lg font-semibold">Swap complete! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Your {toSymbol ?? "tokens"} are now in your wallet.
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
              <h3 className="text-lg font-semibold">Working on your swap</h3>
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
            {phase === "done" ? "Make another swap" : "Try again"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function formatAmount(raw: string): string {
  const value = Number(raw);
  if (!Number.isFinite(value)) return raw;
  const maxFrac = value < 1 ? 6 : value < 1000 ? 4 : 2;
  return value.toLocaleString("en-US", { maximumFractionDigits: maxFrac });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function friendlyError(err: any): string {
  const msg = String(err?.shortMessage ?? err?.message ?? err ?? "");
  if (/reject|denied|cancell?ed|user/i.test(msg)) {
    return "You cancelled the request in your wallet.";
  }
  if (/slippage|price|exceeded/i.test(msg)) {
    return "The price moved while confirming. Please try again.";
  }
  if (/insufficient|balance|funds/i.test(msg)) {
    return "Not enough balance to cover the amount plus network fees.";
  }
  return "Something went wrong. Please try again.";
}
