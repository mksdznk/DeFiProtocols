"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Info,
  Loader2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { parseUnits } from "viem";
import { useAccount, useChainId, useConfig, useSwitchChain } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import {
  convertQuoteToRoute,
  executeRoute,
  getQuote,
  type LiFiStep,
  type RouteExtended,
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
import { TokenCombobox } from "@/components/shared/TokenCombobox";
import { FieldTooltip } from "@/components/shared/FieldTooltip";
import { ConnectModal } from "@/components/wallet/ConnectModal";
import { ensureLifiConfig, LIFI_INTEGRATOR } from "@/lib/lifi/sdk";
import {
  deriveExecutionStatus,
  formatTokenAmount,
  friendlyDuration,
  friendlyProcessError,
  quoteCostUsd,
} from "@/lib/lifi/quote";
import {
  backedNetworks,
  explorerTokenUrl,
  fetchXStocks,
  USDC_BY_CHAIN,
  xStocksForChain,
  type XStock,
} from "@/lib/backed/sdk";
import type { SupportedChainId } from "@/lib/wagmi";

type Phase = "form" | "executing" | "done" | "error";

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

/** "Apple xStock" -> "Apple". Falls back to the full name. */
function underlyingName(name: string): string {
  return name.replace(/\s*xStock$/i, "").trim() || name;
}

/**
 * Buy tokenized stocks (Backed "xStocks") in plain language: pick a network and
 * a stock, type how many dollars to spend, and see roughly how many shares
 * you'll get. The buy is a same-chain swap from USDC routed through the LI.FI
 * SDK, sharing the app's wallet. Networks and the full catalogue come straight
 * from Backed's official token list.
 */
export function BackedBuy() {
  const wagmiConfig = useConfig();
  ensureLifiConfig(wagmiConfig);

  const { address, isConnected } = useAccount();
  const [connectOpen, setConnectOpen] = useState(false);

  const tokensQuery = useQuery({
    queryKey: ["backed", "xstocks"],
    queryFn: fetchXStocks,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="mx-auto w-full max-w-md">
      {tokensQuery.isPending ? (
        <Skeleton className="h-[28rem] w-full rounded-2xl" />
      ) : tokensQuery.data ? (
        <BuyForm
          tokens={tokensQuery.data}
          address={address}
          isConnected={isConnected}
          onConnect={() => setConnectOpen(true)}
        />
      ) : (
        <Card className="bg-card/60">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            We couldn&apos;t load the tokenized stocks list. Please refresh and
            try again.
          </CardContent>
        </Card>
      )}
      <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}

function defaultStock(list: XStock[]): string {
  // Prefer a recognizable index (S&P 500) as the friendly default.
  return (list.find((t) => t.symbol === "SPYx") ?? list[0])?.address ?? "";
}

function BuyForm({
  tokens,
  address,
  isConnected,
  onConnect,
}: {
  tokens: XStock[];
  address?: string;
  isConnected: boolean;
  onConnect: () => void;
}) {
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const networks = useMemo(() => backedNetworks(tokens), [tokens]);

  const [chainId, setChainId] = useState(networks[0]?.chainId ?? 1);
  const stocks = useMemo(
    () => xStocksForChain(tokens, chainId),
    [tokens, chainId],
  );
  const [stockAddr, setStockAddr] = useState(() => defaultStock(stocks));
  const [amount, setAmount] = useState("");

  const [phase, setPhase] = useState<Phase>("form");
  const [liveRoute, setLiveRoute] = useState<RouteExtended | null>(null);
  const [execError, setExecError] = useState<string | null>(null);

  // Switching network picks a valid default stock for it (no syncing effect).
  function changeChain(id: number) {
    setChainId(id);
    setStockAddr(defaultStock(xStocksForChain(tokens, id)));
  }

  const pay = USDC_BY_CHAIN[chainId];
  const stock = stocks.find((t) => t.address === stockAddr);

  const comboTokens = useMemo(
    () => stocks.map((t) => ({ address: t.address, symbol: t.symbol, name: underlyingName(t.name) })),
    [stocks],
  );

  const debouncedAmount = useDebounced(amount, 400);
  const amountNumber = Number(debouncedAmount);
  const validAmount = /^\d*\.?\d*$/.test(debouncedAmount) && amountNumber > 0;

  const quoteEnabled =
    Boolean(address) &&
    Boolean(pay) &&
    Boolean(stock) &&
    validAmount &&
    phase === "form";

  const quoteQuery = useQuery({
    queryKey: ["backed", "quote", chainId, stockAddr, debouncedAmount, address],
    enabled: quoteEnabled,
    staleTime: 20_000,
    retry: false,
    queryFn: async (): Promise<LiFiStep> => {
      return getQuote({
        fromChain: chainId,
        toChain: chainId,
        fromToken: pay!.address,
        toToken: stockAddr,
        fromAmount: parseUnits(debouncedAmount, pay!.decimals).toString(),
        fromAddress: address!,
        integrator: LIFI_INTEGRATOR,
        slippage: 0.01,
      });
    },
  });

  const quote = quoteQuery.data;
  const shares =
    quote && stock
      ? Number(formatTokenAmount(quote.estimate.toAmount, stock.decimals).replace(/,/g, ""))
      : 0;
  const pricePerShare = shares > 0 ? amountNumber / shares : 0;

  async function handleBuy() {
    if (!quote) return;
    setPhase("executing");
    setExecError(null);
    setLiveRoute(null);
    try {
      if (currentChainId !== chainId) {
        await switchChainAsync({ chainId: chainId as SupportedChainId });
      }
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

  if (phase !== "form") {
    return (
      <ExecutionPanel
        phase={phase}
        route={liveRoute}
        error={execError}
        stockSymbol={stock?.symbol}
        onDone={reset}
      />
    );
  }

  const networkName = networks.find((n) => n.chainId === chainId)?.name ?? "";
  const noRoute = Boolean(address) && validAmount && !quoteQuery.isFetching &&
    (quoteQuery.isError || !quote);

  return (
    <Card className="bg-card/60">
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-sm font-medium text-protocol">
            <TrendingUp className="size-4" aria-hidden />
            Buy a tokenized stock
          </p>
          <p className="text-sm text-muted-foreground">
            Own a token that tracks a real stock, ETF, or index — held 1:1 by the
            real thing. Pay with USDC and it lands in your wallet.
          </p>
        </div>

        {/* Network + stock */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Network</p>
            <Select
              value={String(chainId)}
              onValueChange={(v) => changeChain(Number(v))}
            >
              <FieldTooltip label="The network you'll buy on">
                <SelectTrigger className="w-full" aria-label="Network">
                  <SelectValue placeholder="Network" />
                </SelectTrigger>
              </FieldTooltip>
              <SelectContent>
                {networks.map((n) => (
                  <SelectItem key={n.chainId} value={String(n.chainId)}>
                    {n.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Stock</p>
            <TokenCombobox
              tokens={comboTokens}
              value={stockAddr}
              onChange={setStockAddr}
              tooltip="The tokenized stock you'll buy"
            />
          </div>
        </div>

        {/* Amount to spend */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Amount to spend
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3">
            <input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
              }}
              aria-label="Amount of USDC to spend"
              className="w-full bg-transparent py-2.5 text-2xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40"
            />
            <span className="text-sm font-medium text-muted-foreground">
              {pay?.symbol ?? "USDC"}
            </span>
          </div>
        </div>

        {/* Plain-language quote / hints */}
        <QuoteSummary
          connected={Boolean(address)}
          hasAmount={validAmount}
          loading={quoteQuery.isFetching}
          noRoute={noRoute}
          pricePerShare={pricePerShare}
          quote={quote}
          stock={stock}
          networkName={networkName}
        />

        <PrimaryButton
          isConnected={isConnected}
          hasAmount={validAmount}
          quoteLoading={quoteQuery.isFetching}
          quoteReady={Boolean(quote)}
          noRoute={noRoute}
          onConnect={onConnect}
          onBuy={handleBuy}
        />

        <p className="text-center text-xs text-muted-foreground">
          Tokenized stocks carry the market risk of the real stock. You stay in
          control — nothing happens until you approve it in your wallet.
        </p>
      </CardContent>
    </Card>
  );
}

function QuoteSummary({
  connected,
  hasAmount,
  loading,
  noRoute,
  pricePerShare,
  quote,
  stock,
  networkName,
}: {
  connected: boolean;
  hasAmount: boolean;
  loading: boolean;
  noRoute: boolean;
  pricePerShare: number;
  quote?: LiFiStep;
  stock?: XStock;
  networkName: string;
}) {
  if (!connected) return <Hint>Connect your wallet to see live prices.</Hint>;
  if (!hasAmount)
    return <Hint>Type a dollar amount to see how many shares you&apos;ll get.</Hint>;
  if (loading) return <Hint>Finding you the best price…</Hint>;

  if (noRoute && stock) {
    const link = explorerTokenUrl(stock.chainId, stock.address);
    return (
      <div className="space-y-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm">
        <p className="flex items-start gap-1.5">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span>
            On-chain buying isn&apos;t available for{" "}
            <span className="font-medium">{stock.symbol}</span> on {networkName}{" "}
            right now. The token is real and verified — it also trades on Kraken,
            Bybit, and native DEXs.
          </span>
        </p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-5.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View verified contract
            <ExternalLink className="size-3" aria-hidden />
          </a>
        )}
      </div>
    );
  }

  if (!quote || !stock) {
    return <Hint>Pick a stock and amount to see your price.</Hint>;
  }

  return (
    <div className="space-y-1 rounded-lg bg-muted/50 px-3 py-2 text-sm">
      <p>
        You&apos;ll get about{" "}
        <span className="font-medium">
          {formatTokenAmount(quote.estimate.toAmount, stock.decimals)}{" "}
          {stock.symbol}
        </span>{" "}
        {pricePerShare > 0 && (
          <span className="text-muted-foreground">
            (≈ ${pricePerShare.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
            per share)
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
  quoteLoading,
  quoteReady,
  noRoute,
  onConnect,
  onBuy,
}: {
  isConnected: boolean;
  hasAmount: boolean;
  quoteLoading: boolean;
  quoteReady: boolean;
  noRoute: boolean;
  onConnect: () => void;
  onBuy: () => void;
}) {
  if (!isConnected) {
    return (
      <Button className="w-full gap-2" size="lg" onClick={onConnect}>
        <Wallet className="size-4" aria-hidden />
        Connect wallet
      </Button>
    );
  }
  if (!hasAmount) {
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
  if (noRoute || !quoteReady) {
    return (
      <Button className="w-full" size="lg" disabled>
        Not available here
      </Button>
    );
  }
  return (
    <Button className="w-full" size="lg" onClick={onBuy}>
      Buy now
    </Button>
  );
}

function ExecutionPanel({
  phase,
  route,
  error,
  stockSymbol,
  onDone,
}: {
  phase: Phase;
  route: RouteExtended | null;
  error: string | null;
  stockSymbol?: string;
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
              <h3 className="text-lg font-semibold">You own a piece! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Your {stockSymbol ?? "tokenized stock"} is now in your wallet and
                tracks the real thing.
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
                {status?.kind === "action" ? "Action needed" : "Working on your buy"}
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
            {phase === "done" ? "Buy another" : "Try again"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
