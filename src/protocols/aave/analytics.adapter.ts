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
 * Aave analytics adapter — MOCK source (v1).
 *
 * Lending-market shape (TVL / supplied / borrowed / markets), all flagged
 * `isSample: true`. Same {@link AnalyticsAdapter} interface as LiFi — a real
 * adapter (Aave subgraph / DefiLlama) can replace this with no UI change.
 */

const BASE_VALUES: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 24_500_000_000,
  totalSupplied: 38_900_000_000,
  totalBorrowed: 14_400_000_000,
  availableLiquidity: 24_500_000_000,
  activeMarkets: 14,
  supportedAssets: 60,
  utilizationRate: 37.0,
};

const DELTAS: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 2.4,
  totalSupplied: 2.1,
  totalBorrowed: 3.8,
  availableLiquidity: 1.4,
  utilizationRate: 0.6,
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

export const aaveAnalyticsAdapter: AnalyticsAdapter = {
  getMetrics(keys: MetricKey[]): Promise<Provenanced<MetricResult[]>> {
    return delay(provenance(keys.map(buildMetric)));
  },

  getTimeseries(range: TimeRange): Promise<Provenanced<TimeseriesResult>> {
    return delay(
      provenance<TimeseriesResult>({
        label: "Total value locked",
        format: "currency",
        // Pass TVL as the base so the series oscillates around the level.
        points: buildTimeseries(range, BASE_VALUES.totalValueLocked!, 4242),
      }),
    );
  },

  getBreakdowns(): Promise<Provenanced<Breakdown[]>> {
    const markets = withShares(
      [
        { label: "USDC", sharePct: 22.6 },
        { label: "WETH", sharePct: 19.1 },
        { label: "USDT", sharePct: 14.8 },
        { label: "wstETH", sharePct: 12.3 },
        { label: "WBTC", sharePct: 9.4 },
        { label: "DAI", sharePct: 6.7 },
      ],
      BASE_VALUES.totalSupplied!,
    );
    const chains = withShares(
      [
        { label: "Ethereum", sharePct: 61.2 },
        { label: "Arbitrum", sharePct: 11.4 },
        { label: "Base", sharePct: 8.1 },
        { label: "Polygon", sharePct: 6.3 },
        { label: "Avalanche", sharePct: 5.2 },
        { label: "Optimism", sharePct: 3.8 },
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
