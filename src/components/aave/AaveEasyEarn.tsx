"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useAccount, useWalletClient } from "wagmi";
import {
  AaveClient,
  AaveProvider,
  bigDecimal,
  chainId,
  evmAddress,
  production,
  useChains,
  useReserves,
  useSpokes,
  useSupply,
} from "@aave/react";
import { useSendTransaction } from "@aave/react/viem";
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

// Placeholder used only while a read is paused (no real query is sent).
const ZERO = "0x0000000000000000000000000000000000000000";

type Phase = "form" | "supplying" | "done" | "error";

/**
 * Aave "Easy Earn": a beginner-friendly Supply & Earn built on the official Aave
 * SDK. Supplying is the safest first action — you simply deposit a coin to earn
 * interest, with no borrowing or liquidation risk. Live APYs come from Aave's
 * production API; the deposit executes through the same wallet the page uses.
 */
export function AaveEasyEarn() {
  // The SDK client is created once and provided to the Aave hooks below.
  const [client] = useState(() => AaveClient.create({ environment: production }));
  return (
    <AaveProvider client={client}>
      <EarnUI />
    </AaveProvider>
  );
}

function EarnUI() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [connectOpen, setConnectOpen] = useState(false);

  // User overrides for the network and market; `null` means "use the first one
  // Aave returns". Everything is fetched from the SDK — nothing is hardcoded.
  const [chainOverride, setChainOverride] = useState<number | null>(null);
  const [spokeOverride, setSpokeOverride] = useState<string | null>(null);
  const [reserveId, setReserveId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Supported networks, straight from Aave.
  const { data: chains, loading: chainsLoading } = useChains();
  const networks = chains ?? [];
  const activeChainId = chainOverride ?? networks[0]?.chainId;

  // Markets (spokes) on the active network, then the reserves in the chosen
  // market — all from the SDK. No hardcoded chains, markets, or assets.
  const { data: spokes, loading: spokesLoading } = useSpokes({
    query: { chainIds: activeChainId ? [chainId(activeChainId)] : [] },
    pause: !activeChainId,
  });
  const activeSpoke =
    spokes?.find((s) => s.address === spokeOverride) ?? spokes?.[0];
  const { data: reserves, loading: reservesLoading } = useReserves({
    query: {
      spoke: {
        address: evmAddress(activeSpoke?.address ?? ZERO),
        // Placeholder chain id while paused; the query never runs without one.
        chainId: chainId(activeChainId ?? 1),
      },
    },
    pause: !activeSpoke || !activeChainId,
  });

  const supplyable = useMemo(
    () =>
      (reserves ?? [])
        .filter((r) => r.canSupply && r.asset?.underlying)
        .slice()
        .sort((a, b) => apyOf(b) - apyOf(a)),
    [reserves],
  );

  const selected =
    supplyable.find((r) => r.id === reserveId) ?? supplyable[0];
  const symbol = selected?.asset.underlying.info.symbol;
  const apy = selected ? apyOf(selected) : 0;

  const amountNumber = Number(amount);
  const validAmount = /^\d*\.?\d*$/.test(amount) && amountNumber > 0;
  const yearlyEarnings = validAmount ? (amountNumber * apy) / 100 : 0;

  // Send the SDK's execution plan through the connected wallet. A supply can
  // arrive as a direct transaction, an ERC-20 approval, or a pre-action step;
  // each branch forwards the matching transaction to the wallet, per the Aave
  // docs. With no wallet client connected, the operation cancels cleanly.
  // Cast needed because the wagmi config now includes zkSync Era, whose chain
  // type widens useWalletClient's return into a union the Aave SDK doesn't accept.
  const [sendTransaction] = useSendTransaction(
    walletClient as Parameters<typeof useSendTransaction>[0],
  );
  const [supply] = useSupply((plan, { cancel }) => {
    switch (plan.__typename) {
      case "TransactionRequest":
        return sendTransaction(plan);
      case "Erc20Approval":
        return sendTransaction(plan.byTransaction);
      case "PreContractActionRequired":
        return sendTransaction(plan.transaction);
      default:
        return cancel("This deposit step isn't supported.");
    }
  });

  async function handleSupply() {
    if (!selected || !address || !validAmount) return;
    setPhase("supplying");
    setStatusMsg("Confirm the deposit in your wallet…");
    setTxHash(null);
    try {
      const result = await supply({
        reserve: selected.id,
        amount: { erc20: { value: bigDecimal(amount) } },
        sender: evmAddress(address),
      });

      if (result.isErr()) {
        setStatusMsg(friendlyError(result.error, symbol));
        setPhase("error");
        return;
      }
      setTxHash(result.value?.txHash ?? null);
      setPhase("done");
    } catch (err) {
      setStatusMsg(friendlyError(err, symbol));
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
          token={symbol}
          explorer={activeSpoke?.chain?.explorerUrl}
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
            {chainsLoading && networks.length === 0 ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                value={activeChainId ? String(activeChainId) : ""}
                onValueChange={(v) => {
                  setChainOverride(Number(v));
                  setSpokeOverride(null);
                  setReserveId("");
                }}
              >
                <SelectTrigger className="w-full" aria-label="Network">
                  <SelectValue placeholder="Choose a network" />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((c) => (
                    <SelectItem key={c.chainId} value={String(c.chainId)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          {/* Market */}
          <Field label="Market">
            {spokesLoading && !spokes ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                value={activeSpoke?.address ?? ""}
                onValueChange={(v) => {
                  setSpokeOverride(v);
                  setReserveId("");
                }}
                disabled={!spokes?.length}
              >
                <SelectTrigger className="w-full" aria-label="Market">
                  <SelectValue placeholder="Choose a market" />
                </SelectTrigger>
                <SelectContent>
                  {(spokes ?? []).map((s) => (
                    <SelectItem key={s.address} value={s.address}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          {/* Coin */}
          <Field label="Coin to deposit">
            {reservesLoading && supplyable.length === 0 ? (
              <Skeleton className="h-9 w-full" />
            ) : supplyable.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No coins available here right now.
              </p>
            ) : (
              <Select
                value={selected?.id ?? ""}
                onValueChange={setReserveId}
              >
                <SelectTrigger className="w-full" aria-label="Coin to deposit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supplyable.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.asset.underlying.info.symbol} — earn{" "}
                      {apyOf(r).toFixed(2)}% / year
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
                {symbol}
              </span>
            </div>
          </Field>

          {/* Plain-language earnings */}
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
            {selected ? (
              validAmount ? (
                <p>
                  At today&apos;s rate of{" "}
                  <span className="font-medium">{apy.toFixed(2)}%</span>, you&apos;d
                  earn about{" "}
                  <span className="font-medium">
                    {yearlyEarnings.toLocaleString("en-US", {
                      maximumFractionDigits: yearlyEarnings < 1 ? 4 : 2,
                    })}{" "}
                    {symbol}
                  </span>{" "}
                  per year.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Enter an amount to see what you&apos;d earn at {apy.toFixed(2)}%
                  / year.
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
              disabled={!selected || !validAmount}
              onClick={handleSupply}
            >
              {validAmount ? `Deposit ${symbol ?? ""}` : "Enter an amount"}
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

// Reserve supply APY as a plain percentage number (e.g. 3.02 for 3.02%).
// `supplyApy.normalized` is the percentage; `.value` is the fraction. The field
// is a BigDecimal, so read it via its helper (or a string fallback).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apyOf(reserve: any): number {
  const apy = reserve?.asset?.summary?.supplyApy?.normalized;
  if (apy == null) return 0;
  if (typeof apy.toApproximateNumber === "function") return apy.toApproximateNumber();
  return parseFloat(String(apy)) || 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function friendlyError(error: any, symbol?: string): string {
  const name = error?.name ?? "";
  if (/Cancel/i.test(name)) return "You cancelled the request in your wallet.";
  if (/Validation|InsufficientBalance/i.test(name)) {
    return `You don't have enough ${symbol ?? "of that coin"} for this deposit.`;
  }
  if (/Timeout/i.test(name))
    return "The transaction timed out. Please try again.";
  return "Something went wrong. Please try again.";
}
