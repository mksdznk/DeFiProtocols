"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Wallet,
} from "lucide-react";
import type { Chain } from "viem";
import { formatUnits, parseUnits } from "viem";
import { arbitrum, base, bsc, mainnet, scroll, zksync } from "viem/chains";
import {
  useAccount,
  useChainId,
  useConfig,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { readContract, simulateContract, waitForTransactionReceipt } from "@wagmi/core";
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
import { TokenCombobox } from "@/components/shared/TokenCombobox";
import { FieldTooltip } from "@/components/shared/FieldTooltip";
import type { SupportedChainId } from "@/lib/wagmi";
import {
  erc20Abi,
  fetchMaverickData,
  fetchMaverickNetworks,
  MAVERICK_CONTRACTS,
  type MaverickPool,
  type MaverickToken,
  quoterAbi,
  routerAbi,
  TICK_MAX,
  TICK_MIN,
} from "@/lib/maverick/sdk";

type Phase = "form" | "working" | "done" | "error";

const CHAIN_BY_ID: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [base.id]: base,
  [arbitrum.id]: arbitrum,
  [bsc.id]: bsc,
  [zksync.id]: zksync,
  [scroll.id]: scroll,
};

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

function pick(
  tokens: MaverickToken[],
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

function bestPool(
  pools: MaverickPool[],
  from?: string,
  to?: string,
): MaverickPool | undefined {
  if (!from || !to) return undefined;
  const f = from.toLowerCase();
  const t = to.toLowerCase();
  return pools
    .filter((p) => {
      const pair = [p.tokenA.toLowerCase(), p.tokenB.toLowerCase()];
      return pair.includes(f) && pair.includes(t);
    })
    .sort((a, b) => b.tvl - a.tvl)[0];
}

/**
 * A beginner-friendly Maverick swap. Networks, tokens, and pools are loaded live
 * from Maverick's API; quotes and swaps go through Maverick's Quoter/Router. The
 * "to" choices are constrained to coins that share a pool with the "from" coin.
 */
export function MaverickEasySwap() {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const config = useConfig();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [connectOpen, setConnectOpen] = useState(false);
  const [chainId, setChainId] = useState<SupportedChainId>(mainnet.id);
  const [fromOverride, setFromOverride] = useState<string | null>(null);
  const [toOverride, setToOverride] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const contracts = MAVERICK_CONTRACTS[chainId];

  const networksQuery = useQuery({
    queryKey: ["maverick", "networks"],
    queryFn: fetchMaverickNetworks,
    staleTime: 30 * 60_000,
  });
  const networks = networksQuery.data ?? [];

  const dataQuery = useQuery({
    queryKey: ["maverick", "data", chainId],
    queryFn: () => fetchMaverickData(chainId),
    staleTime: 5 * 60_000,
  });
  const data = dataQuery.data;
  const tokens = useMemo(() => data?.tokens ?? [], [data]);
  const pools = useMemo(() => data?.pools ?? [], [data]);

  const fromAddr = fromOverride ?? pick(tokens, ["USDC", "WETH", "ETH"]);

  // Coins reachable from `fromAddr` in a single pool.
  const partners = useMemo(() => {
    if (!fromAddr) return tokens;
    const f = fromAddr.toLowerCase();
    const set = new Set<string>();
    for (const p of pools) {
      const a = p.tokenA.toLowerCase();
      const b = p.tokenB.toLowerCase();
      if (a === f) set.add(b);
      else if (b === f) set.add(a);
    }
    return tokens.filter((t) => set.has(t.address.toLowerCase()));
  }, [tokens, pools, fromAddr]);

  const toValid =
    toOverride && partners.some((p) => p.address === toOverride)
      ? toOverride
      : undefined;
  const toAddr = toValid ?? pick(partners, ["USDT", "USDS", "WETH", "USDC"]);

  const fromToken = tokens.find((t) => t.address === fromAddr);
  const toToken = tokens.find((t) => t.address === toAddr);
  const pool = bestPool(pools, fromAddr, toAddr);
  const tokenAIn = !!pool && fromAddr?.toLowerCase() === pool.tokenA.toLowerCase();

  const debouncedAmount = useDebounced(amount, 400);
  const amountNumber = Number(debouncedAmount);
  const validAmount = /^\d*\.?\d*$/.test(debouncedAmount) && amountNumber > 0;

  const quote = useQuery({
    queryKey: ["maverick", "quote", chainId, pool?.id, tokenAIn, debouncedAmount],
    enabled:
      phase === "form" &&
      !!pool &&
      !!fromToken &&
      !!toToken &&
      !!contracts &&
      validAmount,
    staleTime: 15_000,
    retry: false,
    queryFn: async (): Promise<bigint> => {
      const amountIn = parseUnits(debouncedAmount, fromToken!.decimals);
      const { result } = await simulateContract(config, {
        address: contracts!.quoter,
        abi: quoterAbi,
        functionName: "calculateSwap",
        args: [pool!.id, amountIn, tokenAIn, false, tokenAIn ? TICK_MAX : TICK_MIN],
        chainId,
      });
      return result[1];
    },
  });

  const outFormatted =
    quote.data != null && toToken
      ? Number(formatUnits(quote.data, toToken.decimals))
      : undefined;

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
    if (!isConnected || !address || !pool || !fromToken || !validAmount) return;
    if (quote.data == null || !contracts) return;
    setPhase("working");
    setTxHash(null);
    try {
      const amountIn = parseUnits(amount, fromToken.decimals);
      const minOut = (quote.data * BigInt(995)) / BigInt(1000); // 0.5% slippage

      if (currentChainId !== chainId) {
        setStatusMsg("Switch network in your wallet…");
        await switchChainAsync({ chainId });
      }

      const allowance = (await readContract(config, {
        address: fromToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, contracts.router],
        chainId,
      })) as bigint;

      if (allowance < amountIn) {
        setStatusMsg(`Approve ${fromToken.symbol} in your wallet…`);
        const approveHash = await writeContractAsync({
          address: fromToken.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [contracts.router, amountIn],
          chainId,
        });
        await waitForTransactionReceipt(config, { hash: approveHash, chainId });
      }

      setStatusMsg("Confirm the swap in your wallet…");
      const swapHash = await writeContractAsync({
        address: contracts.router,
        abi: routerAbi,
        functionName: "inputSingleWithTickLimit",
        args: [
          address,
          pool.id,
          tokenAIn,
          amountIn,
          tokenAIn ? TICK_MAX : TICK_MIN,
          minOut,
        ],
        chainId,
      });
      setStatusMsg("Finishing your swap…");
      await waitForTransactionReceipt(config, { hash: swapHash, chainId });

      setTxHash(swapHash);
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
          toSymbol={toToken?.symbol}
          explorer={CHAIN_BY_ID[chainId]?.blockExplorers?.default?.url}
          onReset={reset}
        />
      </div>
    );
  }

  const dataLoading = dataQuery.isPending || networksQuery.isPending;

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
              disabled={networks.length === 0}
            >
              <FieldTooltip label="The network you're swapping on">
                <SelectTrigger className="w-full" aria-label="Network">
                  <SelectValue placeholder="Choose a network" />
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
              onChange={(a) => {
                setFromOverride(a);
                setToOverride(null);
              }}
              loading={dataLoading}
              tooltip="The coin you'll pay with"
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
              ) : outFormatted != null ? (
                <>≈ {formatAmount(outFormatted)}</>
              ) : (
                <span className="text-muted-foreground/40">0</span>
              )}
            </div>
            <TokenCombobox
              tokens={partners}
              value={toAddr}
              onChange={setToOverride}
              loading={dataLoading}
              tooltip="The coin you'll receive"
            />
          </TokenPanel>

          <QuoteSummary
            dataLoading={dataLoading}
            loading={quote.isFetching}
            out={outFormatted}
            error={quote.isError}
            hasPool={!!pool}
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
              disabled={!pool || !validAmount || quote.data == null}
              onClick={handleSwap}
            >
              {!validAmount
                ? "Enter an amount"
                : !pool
                  ? "Pick coins with a pool"
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
  dataLoading,
  loading,
  out,
  error,
  hasPool,
  hasAmount,
  fromSymbol,
  toSymbol,
  amount,
}: {
  dataLoading: boolean;
  loading: boolean;
  out?: number;
  error: boolean;
  hasPool: boolean;
  hasAmount: boolean;
  fromSymbol?: string;
  toSymbol?: string;
  amount: string;
}) {
  if (dataLoading) return <Hint>Loading Maverick markets…</Hint>;
  if (!hasPool)
    return <Hint>These two coins don&apos;t share a pool. Try another pair.</Hint>;
  if (!hasAmount)
    return <Hint>Type an amount above to see what you&apos;ll get.</Hint>;
  if (loading) return <Hint>Finding you the best price on Maverick…</Hint>;
  if (error || out == null)
    return <Hint>We couldn&apos;t price that swap right now. Try again.</Hint>;

  const rate = out / Number(amount);
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
      <p>
        You&apos;ll get about{" "}
        <span className="font-medium">
          {formatAmount(out)} {toSymbol}
        </span>
        .
      </p>
      {Number.isFinite(rate) && (
        <p className="text-xs text-muted-foreground">
          1 {fromSymbol} ≈{" "}
          {rate.toLocaleString("en-US", { maximumFractionDigits: 6 })} {toSymbol}{" "}
          · via Maverick
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
  if (/slippage|price|exceeded|min/i.test(msg)) {
    return "The price moved while confirming. Please try again.";
  }
  if (/insufficient|balance|funds/i.test(msg)) {
    return "Not enough balance to cover the amount plus network fees.";
  }
  return "Something went wrong. Please try again.";
}
