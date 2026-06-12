"use client";

import { useSyncExternalStore } from "react";

/**
 * App-wide "testnet mode" flag, shared across interaction surfaces.
 *
 * When on, the surfaces that support a testnet (Aave → Sepolia, Compound →
 * Sepolia, Lido → Hoodi) point their network, data, and transactions at the
 * test deployment instead of mainnet — so you can try the real flows with
 * faucet funds and no real money at risk.
 *
 * Backed by a tiny external store (persisted to localStorage) read through
 * `useSyncExternalStore`, which is SSR-safe and hydrates without a mismatch — so
 * no React context/provider is needed.
 */
const STORAGE_KEY = "defi-testnet-mode";

let cached: boolean | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): boolean {
  if (cached === null) {
    cached =
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY) === "1";
  }
  return cached;
}

function getServerSnapshot(): boolean {
  return false;
}

function setTestnet(next: boolean): void {
  cached = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

export interface TestnetMode {
  isTestnet: boolean;
  setTestnet: (next: boolean) => void;
  toggle: () => void;
}

export function useTestnetMode(): TestnetMode {
  const isTestnet = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return {
    isTestnet,
    setTestnet,
    toggle: () => setTestnet(!getSnapshot()),
  };
}
