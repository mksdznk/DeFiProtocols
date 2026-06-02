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
 * Curve analytics adapter — MOCK source (v1).
 *
 * DEX/AMM shape (TVL + trading volume + top pools), all flagged `isSample: true`.
 * Same {@link AnalyticsAdapter} interface as the other protocols — a real adapter
 * (Curve API / subgraph / DefiLlama) can replace this with no UI change.
 */

const BASE_VALUES: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 2_400_000_000,
  volume24h: 120_000_000,
  volume7d: 980_000_000,
  totalVolume: 480_000_000_000,
  supportedChains: 14,
  supportedTokens: 850,
};

const DELTAS: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 1.2,
  volume24h: 8.4,
  volume7d: -2.6,
  totalVolume: 0.9,
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

export const curveAnalyticsAdapter: AnalyticsAdapter = {
  getMetrics(keys: MetricKey[]): Promise<Provenanced<MetricResult[]>> {
    return delay(provenance(keys.map(buildMetric)));
  },

  getTimeseries(range: TimeRange): Promise<Provenanced<TimeseriesResult>> {
    return delay(
      provenance<TimeseriesResult>({
        label: "Trading volume",
        format: "currency",
        points: buildTimeseries(range, BASE_VALUES.volume24h!, 9091),
      }),
    );
  },

  getBreakdowns(): Promise<Provenanced<Breakdown[]>> {
    const pools = withShares(
      [
        { label: "3pool · DAI/USDC/USDT", sharePct: 17.8 },
        { label: "stETH · ETH/stETH", sharePct: 14.2 },
        { label: "crvUSD/USDC", sharePct: 11.5 },
        { label: "tricrypto · USDT/WBTC/ETH", sharePct: 9.1 },
        { label: "FRAX/USDC", sharePct: 7.3 },
        { label: "USDe/USDC", sharePct: 5.6 },
      ],
      BASE_VALUES.volume24h!,
    );
    const chains = withShares(
      [
        { label: "Ethereum", sharePct: 71.4 },
        { label: "Arbitrum", sharePct: 9.2 },
        { label: "Optimism", sharePct: 5.1 },
        { label: "Base", sharePct: 4.6 },
        { label: "Polygon", sharePct: 3.7 },
        { label: "Fraxtal", sharePct: 2.4 },
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
