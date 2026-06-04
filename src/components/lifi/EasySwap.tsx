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
import { parseUnits } from "viem";
import { useAccount, useConfig } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import {
  convertQuoteToRoute,
  executeRoute,
  getQuote,
  type LiFiStep,
  type RouteExtended,
  type Token,
} from "@lifi/sdk";
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
import { ConnectModal } from "@/components/wallet/ConnectModal";
import { ensureLifiConfig, LIFI_INTEGRATOR } from "@/lib/lifi/sdk";
import {
  EASY_CHAINS,
  fetchEasyTokens,
  type EasyTokenMap,
} from "@/lib/lifi/easy-tokens";
import {
  deriveExecutionStatus,
  formatTokenAmount,
  friendlyDuration,
  friendlyProcessError,
  quoteCostUsd,
} from "@/lib/lifi/quote";

type Phase = "form" | "executing" | "done" | "error";

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

/**
 * A beginner-friendly swap & bridge built on the LI.FI SDK.
 *
 * Plain language at every step: pick what you have and what you want, see one
 * clear quote ("You'll get about…"), and tap once. Wallet prompts and cross-chain
 * progress are translated into simple sentences. The wallet is shared with the
 * rest of the app, so there's nothing extra to connect.
 */
export function EasySwap() {
  const wagmiConfig = useConfig();
  ensureLifiConfig(wagmiConfig);

  const { address, isConnected } = useAccount();
  const [connectOpen, setConnectOpen] = useState(false);

  const tokensQuery = useQuery({
    queryKey: ["lifi", "easy-tokens"],
    queryFn: fetchEasyTokens,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="mx-auto w-full max-w-md">
      {tokensQuery.isPending ? (
        <Skeleton className="h-[26rem] w-full rounded-2xl" />
      ) : tokensQuery.data ? (
        <SwapForm
          tokens={tokensQuery.data}
          address={address}
          isConnected={isConnected}
          onConnect={() => setConnectOpen(true)}
        />
      ) : (
        <Card className="bg-card/60">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            We couldn&apos;t load the coin list. Please refresh and try again.
          </CardContent>
        </Card>
      )}
      <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}

function firstTokenAddress(tokens: EasyTokenMap, chainId: number): string {
  return tokens[chainId]?.[0]?.address ?? "";
}

function SwapForm({
  tokens,
  address,
  isConnected,
  onConnect,
}: {
  tokens: EasyTokenMap;
  address?: string;
  isConnected: boolean;
  onConnect: () => void;
}) {
  // Sensible defaults: ETH on Ethereum → USDC on Base.
  const [fromChainId, setFromChainId] = useState(1);
  const [toChainId, setToChainId] = useState(8453);
  const [fromTokenAddr, setFromTokenAddr] = useState(() =>
    firstTokenAddress(tokens, 1),
  );
  const [toTokenAddr, setToTokenAddr] = useState(() => {
    const list = tokens[8453] ?? [];
    return (list.find((t) => t.symbol === "USDC") ?? list[0])?.address ?? "";
  });
  const [amount, setAmount] = useState("");

  const [phase, setPhase] = useState<Phase>("form");
  const [liveRoute, setLiveRoute] = useState<RouteExtended | null>(null);
  const [execError, setExecError] = useState<string | null>(null);

  // Changing a network also resets that side's coin to a valid one for it,
  // keeping selection consistent without a state-syncing effect.
  function changeFromChain(id: number) {
    setFromChainId(id);
    setFromTokenAddr(firstTokenAddress(tokens, id));
  }
  function changeToChain(id: number) {
    setToChainId(id);
    const list = tokens[id] ?? [];
    setToTokenAddr(
      (list.find((t) => t.symbol === "USDC") ?? list[0])?.address ?? "",
    );
  }

  const fromToken = tokens[fromChainId]?.find((t) => t.address === fromTokenAddr);
  const toToken = tokens[toChainId]?.find((t) => t.address === toTokenAddr);

  const debouncedAmount = useDebounced(amount, 400);
  const amountNumber = Number(debouncedAmount);
  const validAmount =
    /^\d*\.?\d*$/.test(debouncedAmount) && amountNumber > 0;
  const sameToken =
    fromChainId === toChainId &&
    fromTokenAddr.toLowerCase() === toTokenAddr.toLowerCase();

  const quoteEnabled =
    Boolean(address) &&
    Boolean(fromToken) &&
    Boolean(toToken) &&
    validAmount &&
    !sameToken &&
    phase === "form";

  const quoteQuery = useQuery({
    queryKey: [
      "lifi",
      "quote",
      fromChainId,
      fromTokenAddr,
      toChainId,
      toTokenAddr,
      debouncedAmount,
      address,
    ],
    enabled: quoteEnabled,
    staleTime: 20_000,
    retry: false,
    queryFn: async (): Promise<LiFiStep> => {
      return getQuote({
        fromChain: fromChainId,
        toChain: toChainId,
        fromToken: fromTokenAddr,
        toToken: toTokenAddr,
        fromAmount: parseUnits(debouncedAmount, fromToken!.decimals).toString(),
        fromAddress: address!,
        integrator: LIFI_INTEGRATOR,
        slippage: 0.005,
      });
    },
  });

  const quote = quoteQuery.data;

  async function handleSwap() {
    if (!quote) return;
    setPhase("executing");
    setExecError(null);
    setLiveRoute(null);
    try {
      const route = convertQuoteToRoute(quote);
      await executeRoute(route, {
        updateRouteHook: (updated) => setLiveRoute(updated),
      });
      setPhase("done");
    } catch (err) {
      setExecError(friendlyProcessError((err as Error)?.message));
      setPhase("error");
    }
  }

  function reset() {
    setPhase("form");
    setLiveRoute(null);
    setExecError(null);
    setAmount("");
  }

  if (phase === "executing" || phase === "done" || phase === "error") {
    return (
      <ExecutionPanel
        phase={phase}
        route={liveRoute}
        error={execError}
        toToken={toToken}
        onDone={reset}
      />
    );
  }

  return (
    <Card className="bg-card/60">
      <CardContent className="space-y-3">
        {/* You pay */}
        <TokenPanel label="You pay">
          <input
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*\.?\d*$/.test(v)) setAmount(v);
            }}
            aria-label="Amount to pay"
            className="w-full bg-transparent text-3xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40"
          />
          <TokenChainPicker
            tokens={tokens}
            chainId={fromChainId}
            tokenAddr={fromTokenAddr}
            onChain={changeFromChain}
            onToken={setFromTokenAddr}
          />
        </TokenPanel>

        <div className="flex justify-center">
          <span className="flex size-8 items-center justify-center rounded-full border border-border bg-background">
            <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
          </span>
        </div>

        {/* You get */}
        <TokenPanel label="You get">
          <div className="text-3xl font-semibold tabular-nums">
            {quoteQuery.isFetching ? (
              <span className="text-muted-foreground/50">…</span>
            ) : quote && toToken ? (
              <>≈ {formatTokenAmount(quote.estimate.toAmount, toToken.decimals)}</>
            ) : (
              <span className="text-muted-foreground/40">0</span>
            )}
          </div>
          <TokenChainPicker
            tokens={tokens}
            chainId={toChainId}
            tokenAddr={toTokenAddr}
            onChain={changeToChain}
            onToken={setToTokenAddr}
          />
        </TokenPanel>

        {/* Plain-language quote summary */}
        <QuoteSummary
          loading={quoteQuery.isFetching}
          quote={quote}
          toToken={toToken}
          error={quoteQuery.isError}
          sameToken={sameToken}
          hasAmount={validAmount}
          connected={Boolean(address)}
        />

        <PrimaryButton
          isConnected={isConnected}
          hasAmount={validAmount}
          sameToken={sameToken}
          quoteLoading={quoteQuery.isFetching}
          quoteReady={Boolean(quote)}
          quoteError={quoteQuery.isError}
          onConnect={onConnect}
          onSwap={handleSwap}
        />

        <p className="text-center text-xs text-muted-foreground">
          You stay in control — nothing happens until you approve it in your
          wallet.
        </p>
      </CardContent>
    </Card>
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

function TokenChainPicker({
  tokens,
  chainId,
  tokenAddr,
  onChain,
  onToken,
}: {
  tokens: EasyTokenMap;
  chainId: number;
  tokenAddr: string;
  onChain: (id: number) => void;
  onToken: (addr: string) => void;
}) {
  const list = tokens[chainId] ?? [];
  return (
    <div className="flex shrink-0 flex-col gap-1.5">
      <Select value={tokenAddr} onValueChange={onToken}>
        <SelectTrigger size="sm" className="min-w-28" aria-label="Coin">
          <SelectValue placeholder="Coin" />
        </SelectTrigger>
        <SelectContent>
          {list.map((t: Token) => (
            <SelectItem key={t.address} value={t.address}>
              {t.symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={String(chainId)} onValueChange={(v) => onChain(Number(v))}>
        <SelectTrigger size="sm" className="min-w-28" aria-label="Network">
          <SelectValue placeholder="Network" />
        </SelectTrigger>
        <SelectContent>
          {EASY_CHAINS.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function QuoteSummary({
  loading,
  quote,
  toToken,
  error,
  sameToken,
  hasAmount,
  connected,
}: {
  loading: boolean;
  quote?: LiFiStep;
  toToken?: Token;
  error: boolean;
  sameToken: boolean;
  hasAmount: boolean;
  connected: boolean;
}) {
  if (sameToken) {
    return (
      <Hint>Pick two different coins (or networks) to swap between.</Hint>
    );
  }
  if (!connected) {
    return <Hint>Connect your wallet to see your price.</Hint>;
  }
  if (!hasAmount) {
    return <Hint>Type an amount above to see what you&apos;ll get.</Hint>;
  }
  if (loading) {
    return <Hint>Finding you the best price…</Hint>;
  }
  if (error || !quote || !toToken) {
    return (
      <Hint>
        We couldn&apos;t find a route for those coins. Try a different pair.
      </Hint>
    );
  }
  return (
    <div className="space-y-1 rounded-lg bg-muted/50 px-3 py-2 text-sm">
      <p>
        You&apos;ll get about{" "}
        <span className="font-medium">
          {formatTokenAmount(quote.estimate.toAmount, toToken.decimals)}{" "}
          {toToken.symbol}
        </span>
        {quote.estimate.toAmountUSD && (
          <span className="text-muted-foreground">
            {" "}
            (≈ ${Number(quote.estimate.toAmountUSD).toFixed(2)})
          </span>
        )}
        .
      </p>
      <p className="text-xs text-muted-foreground">
        Network fee ≈ ${quoteCostUsd(quote).toFixed(2)} · takes{" "}
        {friendlyDuration(quote.estimate.executionDuration)}.
      </p>
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

function PrimaryButton({
  isConnected,
  hasAmount,
  sameToken,
  quoteLoading,
  quoteReady,
  quoteError,
  onConnect,
  onSwap,
}: {
  isConnected: boolean;
  hasAmount: boolean;
  sameToken: boolean;
  quoteLoading: boolean;
  quoteReady: boolean;
  quoteError: boolean;
  onConnect: () => void;
  onSwap: () => void;
}) {
  if (!isConnected) {
    return (
      <Button className="w-full gap-2" size="lg" onClick={onConnect}>
        <Wallet className="size-4" aria-hidden />
        Connect wallet
      </Button>
    );
  }
  if (sameToken || !hasAmount) {
    return (
      <Button className="w-full" size="lg" disabled>
        Enter an amount
      </Button>
    );
  }
  if (quoteLoading) {
    return (
      <Button className="w-full gap-2" size="lg" disabled>
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Getting your best price…
      </Button>
    );
  }
  if (quoteError || !quoteReady) {
    return (
      <Button className="w-full" size="lg" disabled>
        No route found
      </Button>
    );
  }
  return (
    <Button className="w-full" size="lg" onClick={onSwap}>
      Swap now
    </Button>
  );
}

function ExecutionPanel({
  phase,
  route,
  error,
  toToken,
  onDone,
}: {
  phase: Phase;
  route: RouteExtended | null;
  error: string | null;
  toToken?: Token;
  onDone: () => void;
}) {
  const status = route ? deriveExecutionStatus(route) : null;
  const txLink = route?.steps
    .flatMap((s) => s.execution?.process ?? [])
    .reverse()
    .find((p) => p.txLink)?.txLink;

  return (
    <Card className="bg-card/60">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        {phase === "done" ? (
          <>
            <CheckCircle2 className="size-12 text-emerald-500" aria-hidden />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">All done! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Your {toToken?.symbol ?? "tokens"} are on the way. Cross-chain
                transfers can take a little longer to arrive.
              </p>
            </div>
          </>
        ) : phase === "error" ? (
          <>
            <AlertCircle className="size-12 text-destructive" aria-hidden />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">That didn&apos;t go through</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </>
        ) : (
          <>
            <Loader2
              className="size-12 animate-spin text-[var(--protocol-accent)]"
              aria-hidden
            />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                {status?.kind === "action"
                  ? "Action needed"
                  : "Working on your swap"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {status?.message ?? "Getting started…"}
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
          <Button onClick={onDone} variant={phase === "done" ? "default" : "outline"}>
            {phase === "done" ? "Make another swap" : "Try again"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
