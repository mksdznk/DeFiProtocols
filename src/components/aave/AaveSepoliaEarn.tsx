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
import { TestnetToggle } from "@/components/shared/TestnetToggle";
import { ConnectModal } from "@/components/wallet/ConnectModal";
import {
  AAVE_SEPOLIA_CHAIN_ID,
  AAVE_SEPOLIA_POOL,
  aaveErc20Abi,
  aavePoolAbi,
} from "@/lib/aave/sepolia";
import { useAaveSepoliaReserves } from "@/hooks/useAaveSepoliaReserves";

type Phase = "form" | "working" | "done" | "error";

const EXPLORER = "https://sepolia.etherscan.io";

/**
 * Aave "Easy Earn" on the Sepolia testnet, built on the v3 Pool contract (the
 * SDK has no public testnet). Same friendly supply flow as mainnet — pick a
 * coin, deposit, earn — but with faucet test tokens and no real money at risk.
 */
export function AaveSepoliaEarn() {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const config = useConfig();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [connectOpen, setConnectOpen] = useState(false);
  const [assetAddr, setAssetAddr] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { data: reserves, isPending } = useAaveSepoliaReserves();
  const list = reserves ?? [];
  const selected = list.find((r) => r.asset === assetAddr) ?? list[0];

  const amountNumber = Number(amount);
  const validAmount = /^\d*\.?\d*$/.test(amount) && amountNumber > 0;
  const yearlyEarnings =
    validAmount && selected ? (amountNumber * selected.apy) / 100 : 0;

  async function handleSupply() {
    if (!selected || !address || !validAmount) return;
    setPhase("working");
    setTxHash(null);
    try {
      const amountWei = parseUnits(amount, selected.decimals);

      if (currentChainId !== AAVE_SEPOLIA_CHAIN_ID) {
        setStatusMsg("Switch to Sepolia in your wallet…");
        await switchChainAsync({ chainId: AAVE_SEPOLIA_CHAIN_ID });
      }

      const allowance = (await readContract(config, {
        address: selected.asset,
        abi: aaveErc20Abi,
        functionName: "allowance",
        args: [address, AAVE_SEPOLIA_POOL],
        chainId: AAVE_SEPOLIA_CHAIN_ID,
      })) as bigint;

      if (allowance < amountWei) {
        setStatusMsg(`Approve ${selected.symbol} in your wallet…`);
        const approveHash = await writeContractAsync({
          address: selected.asset,
          abi: aaveErc20Abi,
          functionName: "approve",
          args: [AAVE_SEPOLIA_POOL, amountWei],
          chainId: AAVE_SEPOLIA_CHAIN_ID,
        });
        await waitForTransactionReceipt(config, {
          hash: approveHash,
          chainId: AAVE_SEPOLIA_CHAIN_ID,
        });
      }

      setStatusMsg("Confirm the deposit in your wallet…");
      const supplyHash = await writeContractAsync({
        address: AAVE_SEPOLIA_POOL,
        abi: aavePoolAbi,
        functionName: "supply",
        args: [selected.asset, amountWei, address, 0],
        chainId: AAVE_SEPOLIA_CHAIN_ID,
      });
      setStatusMsg("Finishing your deposit…");
      await waitForTransactionReceipt(config, {
        hash: supplyHash,
        chainId: AAVE_SEPOLIA_CHAIN_ID,
      });
      setTxHash(supplyHash);
      setPhase("done");
    } catch (err) {
      setStatusMsg(friendlyError(err, selected.symbol));
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
          token={selected?.symbol}
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
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-sm font-medium text-protocol">
                <Sparkles className="size-4" aria-hidden />
                Earn on your crypto
              </p>
              <TestnetToggle network="Sepolia" />
            </div>
            <p className="text-sm text-muted-foreground">
              Deposit a test coin and earn interest on Aave v3 (Sepolia). Grab
              test tokens from the Aave faucet first — no real money is involved.
            </p>
          </div>

          {/* Network (fixed: Sepolia) */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Network</p>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
              <span className="text-sm font-medium">Sepolia</span>
              <a
                href="https://app.aave.com/faucet/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Faucet
                <ExternalLink className="size-3" aria-hidden />
              </a>
            </div>
          </div>

          {/* Coin */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Coin to deposit
            </p>
            {isPending && list.length === 0 ? (
              <Skeleton className="h-9 w-full" />
            ) : list.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reserves available right now.
              </p>
            ) : (
              <Select
                value={selected?.asset ?? ""}
                onValueChange={setAssetAddr}
              >
                <FieldTooltip label="The test coin you'll deposit to earn interest">
                  <SelectTrigger className="w-full" aria-label="Coin to deposit">
                    <SelectValue />
                  </SelectTrigger>
                </FieldTooltip>
                <SelectContent>
                  {list.map((r) => (
                    <SelectItem key={r.asset} value={r.asset}>
                      {r.symbol} — earn {r.apy.toFixed(2)}% / year
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Amount</p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3">
              <input
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
                }}
                aria-label="Amount to deposit"
                className="w-full bg-transparent py-2.5 text-2xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40"
              />
              <span className="text-sm font-medium text-muted-foreground">
                {selected?.symbol ?? ""}
              </span>
            </div>
          </div>

          {/* Plain-language earnings */}
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
            {selected && validAmount ? (
              <p>
                You&apos;ll earn about{" "}
                <span className="font-medium">{selected.apy.toFixed(2)}%</span> per
                year — roughly {formatAmount(yearlyEarnings)} {selected.symbol}.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Enter an amount to see what you&apos;ll earn.
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
              disabled={!validAmount || !selected}
              onClick={handleSupply}
            >
              {validAmount ? "Deposit" : "Enter an amount"}
            </Button>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Testnet only — nothing moves until you approve it in your wallet.
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
  token,
  onReset,
}: {
  phase: Phase;
  message: string | null;
  txHash: string | null;
  token?: string;
  onReset: () => void;
}) {
  const txLink = txHash ? `${EXPLORER}/tx/${txHash}` : null;
  return (
    <Card className="bg-card/60">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        {phase === "done" ? (
          <>
            <CheckCircle2 className="size-12 text-emerald-500" aria-hidden />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">You&apos;re earning! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Your {token ?? "deposit"} is now supplied on Aave (Sepolia) and
                earning interest.
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
            {phase === "done" ? "Deposit more" : "Try again"}
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
function friendlyError(err: any, token: string): string {
  const msg = String(err?.shortMessage ?? err?.message ?? err ?? "");
  if (/reject|denied|cancell?ed|user/i.test(msg)) {
    return "You cancelled the request in your wallet.";
  }
  if (/insufficient|balance|funds|transfer amount exceeds/i.test(msg)) {
    return `Not enough ${token} — grab some from the Aave faucet first.`;
  }
  return "Something went wrong. Please try again.";
}
