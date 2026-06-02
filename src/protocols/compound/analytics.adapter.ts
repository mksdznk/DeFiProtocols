import type {
  AnalyticsAdapter,
  Breakdown,
  MetricKey,
  MetricResult,
  Provenanced,
  TimeRange,
  TimeseriesResult,
} from "@/lib/analytics/types";
import { METRIC_META } from "@/lib/analytics/metrics-meta";
import {
  buildTimeseries,
  delay,
  provenance,
  withShares,
} from "@/lib/analytics/mock";

/**
 * Compound analytics adapter — MOCK source (v1).
 *
 * Lending-market shape (TVL / supplied / borrowed / markets), all flagged
 * `isSample: true`. Same {@link AnalyticsAdapter} interface as LiFi and Aave — a
 * real adapter (Compound subgraph / DefiLlama) can replace this with no UI change.
 */

const BASE_VALUES: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 2_900_000_000,
  totalSupplied: 3_600_000_000,
  totalBorrowed: 1_350_000_000,
  availableLiquidity: 2_250_000_000,
  activeMarkets: 9,
  supportedAssets: 24,
  utilizationRate: 37.5,
};

const DELTAS: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 1.6,
  totalSupplied: 1.2,
  totalBorrowed: 2.9,
  availableLiquidity: 0.8,
  utilizationRate: 0.4,
};

function buildMetric(key: MetricKey): MetricResult {
  const meta = METRIC_META[key];
  const changePct = DELTAS[key];
  return {
    key,
    label: meta.label,
    value: BASE_VALUES[key] ?? 0,
    format: meta.format,
    hint: meta.hint,
    delta:
      changePct === undefined
        ? undefined
        : {
            changePct,
            direction: changePct > 0 ? "up" : changePct < 0 ? "down" : "flat",
            windowLabel: "vs. prev. month",
          },
  };
}

export const compoundAnalyticsAdapter: AnalyticsAdapter = {
  getMetrics(keys: MetricKey[]): Promise<Provenanced<MetricResult[]>> {
    return delay(provenance(keys.map(buildMetric)));
  },

  getTimeseries(range: TimeRange): Promise<Provenanced<TimeseriesResult>> {
    return delay(
      provenance<TimeseriesResult>({
        label: "Total value locked",
        format: "currency",
        points: buildTimeseries(range, BASE_VALUES.totalValueLocked!, 7777),
      }),
    );
  },

  getBreakdowns(): Promise<Provenanced<Breakdown[]>> {
    const markets = withShares(
      [
        { label: "USDC · Ethereum", sharePct: 28.4 },
        { label: "WETH · Ethereum", sharePct: 19.7 },
        { label: "USDC · Base", sharePct: 12.1 },
        { label: "USDT · Ethereum", sharePct: 10.6 },
        { label: "USDC · Arbitrum", sharePct: 8.3 },
        { label: "USDC · Polygon", sharePct: 5.4 },
      ],
      BASE_VALUES.totalSupplied!,
    );
    const chains = withShares(
      [
        { label: "Ethereum", sharePct: 64.8 },
        { label: "Base", sharePct: 12.6 },
        { label: "Arbitrum", sharePct: 9.7 },
        { label: "Optimism", sharePct: 5.2 },
        { label: "Polygon", sharePct: 4.5 },
        { label: "Scroll", sharePct: 3.2 },
      ],
      BASE_VALUES.totalValueLocked!,
    );

    return delay(
      provenance<Breakdown[]>([
        {
          id: "top-markets",
          title: "Top markets",
          valueHeader: "Supplied",
          rows: markets,
        },
        {
          id: "top-chains",
          title: "Top chains",
          valueHeader: "TVL",
          rows: chains,
        },
      ]),
    );
  },
};
