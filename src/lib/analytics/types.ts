/**
 * Analytics contracts.
 *
 * Every protocol exposes its metrics through an {@link AnalyticsAdapter}. The
 * UI never talks to a data source directly — it talks to an adapter. v1 ships a
 * mock adapter per protocol; real sources (LiFi API, DefiLlama, Dune, subgraphs)
 * can be swapped in behind the same interface without touching components.
 *
 * Every payload carries provenance (`source`, `asOf`, `isSample`) so the UI can
 * always show where a number came from, how fresh it is, and whether it's real.
 */

/** Canonical metric identifiers a protocol config can request for its KPI strip. */
export type MetricKey =
  | "totalVolume"
  | "volume24h"
  | "volume7d"
  | "volume30d"
  | "totalTransactions"
  | "transactions24h"
  | "totalUsers"
  | "activeUsers24h"
  | "activeUsers30d"
  | "supportedChains"
  | "supportedTokens"
  | "supportedRoutes"
  | "avgCompletionTimeSec"
  | "routeSuccessRate";

export type MetricFormat = "currency" | "number" | "compact" | "percent" | "duration";

export interface MetricDelta {
  /** Signed percentage change over the metric's comparison window. */
  changePct: number;
  direction: "up" | "down" | "flat";
  /** Human label for the window, e.g. "vs. last 24h". */
  windowLabel?: string;
}

export interface MetricResult {
  key: MetricKey;
  label: string;
  /** Raw numeric value; formatting is applied by the UI via `format`. */
  value: number;
  format: MetricFormat;
  delta?: MetricDelta;
  /** Short help text shown in a tooltip. */
  hint?: string;
}

export interface TimeseriesPoint {
  /** ISO date (UTC) for the bucket. */
  date: string;
  value: number;
}

export type TimeRange = "7d" | "30d" | "90d" | "1y";

export interface TopRouteRow {
  fromChain: string;
  toChain: string;
  /** Volume in USD for the period. */
  volumeUsd: number;
  sharePct: number;
}

export interface TopChainRow {
  chain: string;
  volumeUsd: number;
  sharePct: number;
}

/** Provenance attached to every adapter response. */
export interface DataProvenance {
  /** Human-readable source label, e.g. "Sample data" or "DefiLlama". */
  source: string;
  /** ISO timestamp of when the data was produced/last refreshed. */
  asOf: string;
  /** True when the numbers are illustrative placeholders, not real. */
  isSample: boolean;
}

export type Provenanced<T> = DataProvenance & { data: T };

/**
 * The single seam every protocol implements to feed its analytics section.
 * Methods are independent so the UI can render each widget as its data lands.
 */
export interface AnalyticsAdapter {
  getMetrics(keys: MetricKey[]): Promise<Provenanced<MetricResult[]>>;
  getVolumeSeries(range: TimeRange): Promise<Provenanced<TimeseriesPoint[]>>;
  getTopRoutes(limit?: number): Promise<Provenanced<TopRouteRow[]>>;
  getTopChains(limit?: number): Promise<Provenanced<TopChainRow[]>>;
}
