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
 * Maverick analytics adapter — MOCK source (v1).
 *
 * DEX/AMM shape (TVL + trading volume + top pools), all flagged `isSample: true`.
 * Same {@link AnalyticsAdapter} interface as the other protocols — a real adapter
 * (Maverick API / subgraph / DefiLlama) can replace this with no UI change.
 */

const BASE_VALUES: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 95_000_000,
  volume24h: 38_000_000,
  volume7d: 240_000_000,
  totalVolume: 42_000_000_000,
  supportedChains: 5,
  supportedTokens: 260,
};

const DELTAS: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 0.9,
  volume24h: 11.2,
  volume7d: -4.1,
  totalVolume: 1.3,
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
            windowLabel: key.includes("24h")
              ? "vs. prev. day"
              : key.includes("7d")
                ? "vs. prev. week"
                : "30d",
          },
  };
}

export const maverickAnalyticsAdapter: AnalyticsAdapter = {
  getMetrics(keys: MetricKey[]): Promise<Provenanced<MetricResult[]>> {
    return delay(provenance(keys.map(buildMetric)));
  },

  getTimeseries(range: TimeRange): Promise<Provenanced<TimeseriesResult>> {
    return delay(
      provenance<TimeseriesResult>({
        label: "Trading volume",
        format: "currency",
        points: buildTimeseries(range, BASE_VALUES.volume24h!, 5150),
      }),
    );
  },

  getBreakdowns(): Promise<Provenanced<Breakdown[]>> {
    const pools = withShares(
      [
        { label: "ETH/USDC", sharePct: 21.6 },
        { label: "wstETH/ETH", sharePct: 16.4 },
        { label: "USDC/USDT", sharePct: 12.9 },
        { label: "MAV/ETH", sharePct: 9.7 },
        { label: "cbETH/ETH", sharePct: 7.2 },
        { label: "USDe/USDC", sharePct: 5.8 },
      ],
      BASE_VALUES.volume24h!,
    );
    const chains = withShares(
      [
        { label: "Ethereum", sharePct: 44.8 },
        { label: "Base", sharePct: 27.3 },
        { label: "zkSync Era", sharePct: 13.1 },
        { label: "Arbitrum", sharePct: 9.2 },
        { label: "BNB Chain", sharePct: 5.6 },
      ],
      BASE_VALUES.totalValueLocked!,
    );

    return delay(
      provenance<Breakdown[]>([
        {
          id: "top-pools",
          title: "Top pools",
          valueHeader: "Volume (24h)",
          rows: pools,
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
