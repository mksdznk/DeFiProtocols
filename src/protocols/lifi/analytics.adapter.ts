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
 * LiFi analytics adapter — MOCK source (v1).
 *
 * Deterministic, realistic-looking sample data so the analytics UI can be built
 * and reviewed without a live pipeline. Everything is flagged `isSample: true`
 * and labeled "Sample data" in the UI. A real adapter (LiFi API / DefiLlama /
 * Dune / subgraph) can replace this behind the same {@link AnalyticsAdapter}.
 */

const BASE_VALUES: Partial<Record<MetricKey, number>> = {
  totalVolume: 62_400_000_000,
  volume24h: 84_300_000,
  volume7d: 612_000_000,
  volume30d: 2_580_000_000,
  totalTransactions: 12_450_000,
  transactions24h: 41_200,
  totalUsers: 1_920_000,
  activeUsers24h: 23_400,
  activeUsers30d: 186_000,
  supportedChains: 36,
  supportedTokens: 31_000,
  supportedRoutes: 4_300_000,
  avgCompletionTimeSec: 96,
  routeSuccessRate: 98.7,
};

const DELTAS: Partial<Record<MetricKey, number>> = {
  totalVolume: 1.8,
  volume24h: 6.2,
  volume7d: -3.1,
  volume30d: 4.5,
  totalTransactions: 2.0,
  transactions24h: 5.4,
  totalUsers: 1.1,
  activeUsers24h: -2.3,
  activeUsers30d: 3.7,
  routeSuccessRate: 0.2,
};

const MONTHLY_VOLUME = BASE_VALUES.volume30d!;

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
            windowLabel: key.includes("24h")
              ? "vs. prev. day"
              : key.includes("7d")
                ? "vs. prev. week"
                : key.includes("30d")
                  ? "vs. prev. month"
                  : "30d",
          },
  };
}

export const lifiAnalyticsAdapter: AnalyticsAdapter = {
  getMetrics(keys: MetricKey[]): Promise<Provenanced<MetricResult[]>> {
    return delay(provenance(keys.map(buildMetric)));
  },

  getTimeseries(range: TimeRange): Promise<Provenanced<TimeseriesResult>> {
    return delay(
      provenance<TimeseriesResult>({
        label: "Bridging volume",
        format: "currency",
        points: buildTimeseries(range, BASE_VALUES.volume24h!, 1337),
      }),
    );
  },

  getBreakdowns(): Promise<Provenanced<Breakdown[]>> {
    const routes = withShares(
      [
        { label: "Ethereum → Arbitrum", sharePct: 18.4 },
        { label: "Ethereum → Base", sharePct: 15.1 },
        { label: "Arbitrum → Ethereum", sharePct: 11.7 },
        { label: "Polygon → Ethereum", sharePct: 9.3 },
        { label: "Base → Optimism", sharePct: 7.8 },
        { label: "BNB Chain → Ethereum", sharePct: 6.2 },
      ],
      MONTHLY_VOLUME,
    );
    const chains = withShares(
      [
        { label: "Ethereum", sharePct: 34.2 },
        { label: "Arbitrum", sharePct: 19.6 },
        { label: "Base", sharePct: 14.1 },
        { label: "Polygon", sharePct: 10.3 },
        { label: "Optimism", sharePct: 8.7 },
        { label: "BNB Chain", sharePct: 6.4 },
      ],
      MONTHLY_VOLUME,
    );

    return delay(
      provenance<Breakdown[]>([
        {
          id: "top-routes",
          title: "Top routes",
          valueHeader: "Volume (30d)",
          rows: routes,
        },
        {
          id: "top-chains",
          title: "Top source chains",
          valueHeader: "Volume (30d)",
          rows: chains,
        },
      ]),
    );
  },
};
