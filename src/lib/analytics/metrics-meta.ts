import type { MetricFormat, MetricKey } from "./types";

interface MetricMeta {
  label: string;
  format: MetricFormat;
  hint?: string;
}

/** Display metadata for every supported metric. Single source of truth. */
export const METRIC_META: Record<MetricKey, MetricMeta> = {
  totalVolume: {
    label: "Total volume",
    format: "currency",
    hint: "Cumulative USD value routed through the protocol.",
  },
  volume24h: { label: "Volume (24h)", format: "currency" },
  volume7d: { label: "Volume (7d)", format: "currency" },
  volume30d: { label: "Volume (30d)", format: "currency" },
  totalTransactions: { label: "Total transactions", format: "compact" },
  transactions24h: { label: "Transactions (24h)", format: "compact" },
  totalUsers: { label: "Total users", format: "compact" },
  activeUsers24h: { label: "Active users (24h)", format: "compact" },
  activeUsers30d: { label: "Active users (30d)", format: "compact" },
  supportedChains: { label: "Supported chains", format: "number" },
  supportedTokens: { label: "Supported tokens", format: "compact" },
  supportedRoutes: { label: "Supported routes", format: "compact" },
  avgCompletionTimeSec: {
    label: "Avg. completion time",
    format: "duration",
    hint: "Average time for a cross-chain transfer to complete.",
  },
  routeSuccessRate: {
    label: "Route success rate",
    format: "percent",
    hint: "Share of routes that complete successfully.",
  },
  totalValueLocked: {
    label: "Total value locked",
    format: "currency",
    hint: "Total USD value of assets deposited in the protocol.",
  },
  totalSupplied: {
    label: "Total supplied",
    format: "currency",
    hint: "USD value of all assets supplied by lenders.",
  },
  totalBorrowed: {
    label: "Total borrowed",
    format: "currency",
    hint: "USD value of all outstanding borrows.",
  },
  availableLiquidity: { label: "Available liquidity", format: "currency" },
  activeMarkets: {
    label: "Active markets",
    format: "number",
    hint: "Number of deployments/markets across chains.",
  },
  supportedAssets: { label: "Supported assets", format: "number" },
  utilizationRate: {
    label: "Utilization rate",
    format: "percent",
    hint: "Share of supplied liquidity currently borrowed.",
  },
  stakingApr: {
    label: "Staking APR",
    format: "percent",
    hint: "Annualized staking reward rate.",
  },
  totalStakers: {
    label: "Total stakers",
    format: "compact",
    hint: "Number of unique staking addresses.",
  },
  marketShare: {
    label: "Market share",
    format: "percent",
    hint: "Share of all staked ETH held through this protocol.",
  },
};

/** Format a raw metric value for display. */
export function formatMetricValue(value: number, format: MetricFormat): string {
  switch (format) {
    case "currency":
      return formatCompactCurrency(value);
    case "compact":
      return formatCompactNumber(value);
    case "number":
      return new Intl.NumberFormat("en-US").format(value);
    case "percent":
      return `${value.toFixed(value < 10 ? 1 : 0)}%`;
    case "duration":
      return formatDuration(value);
  }
}

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(minutes < 10 ? 1 : 0)}m`;
  return `${(minutes / 60).toFixed(1)}h`;
}
