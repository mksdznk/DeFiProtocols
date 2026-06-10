"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldTooltip } from "./FieldTooltip";

export interface ComboToken {
  address: string;
  symbol: string;
  /** Optional fuller name (e.g. "Apple xStock"); used for search + subtitle. */
  name?: string;
}

/**
 * Searchable token picker. Some protocols expose 1,000+ tokens on a network, so
 * this filters by symbol or address and renders only the top matches (no giant
 * dropdown). Self-contained popover with click-outside + Escape handling.
 */
export function TokenCombobox<T extends ComboToken>({
  tokens,
  value,
  onChange,
  loading,
  tooltip,
}: {
  tokens: T[];
  value?: string;
  onChange: (address: string) => void;
  loading?: boolean;
  /** Optional label shown on hover/focus, e.g. "The coin you'll receive". */
  tooltip?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = tokens.find((t) => t.address === value);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens.slice(0, 60);
    return tokens
      .filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          (t.name?.toLowerCase().includes(q) ?? false) ||
          t.address.toLowerCase().includes(q),
      )
      .sort((a, b) => score(b.symbol, q) - score(a.symbol, q))
      .slice(0, 60);
  }, [tokens, query]);

  const trigger = (
    <button
      type="button"
      disabled={loading || tokens.length === 0}
      onClick={() => setOpen((o) => !o)}
      className="focus-visible:ring-ring flex h-9 min-w-28 items-center justify-between gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
    >
      <span className="truncate">
        {loading ? "…" : (selected?.symbol ?? "Select")}
      </span>
      <ChevronDown className="size-3.5 shrink-0 opacity-60" aria-hidden />
    </button>
  );

  return (
    <div ref={ref} className="relative shrink-0">
      {tooltip ? <FieldTooltip label={tooltip}>{trigger}</FieldTooltip> : trigger}

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-64 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          <div className="flex items-center gap-2 border-b border-border px-2.5">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or address"
              aria-label="Search tokens"
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {results.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                No tokens found
              </li>
            ) : (
              results.map((t) => (
                <li key={t.address}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(t.address);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-accent",
                      t.address === value && "bg-accent/60",
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{t.symbol}</span>
                      {t.name && (
                        <span className="truncate text-xs text-muted-foreground">
                          {t.name}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {t.address.slice(0, 6)}…{t.address.slice(-4)}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function score(symbol: string, q: string): number {
  const s = symbol.toLowerCase();
  if (s === q) return 3;
  if (s.startsWith(q)) return 2;
  if (s.includes(q)) return 1;
  return 0;
}
