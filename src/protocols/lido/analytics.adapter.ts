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
 * Lido analytics adapter — MOCK source (v1).
 *
 * Liquid-staking shape (staked value / APR / stakers / market share + where
 * stETH is used), all flagged `isSample: true`. Same {@link AnalyticsAdapter}
 * interface as the other protocols — a real adapter (Lido API / subgraph /
 * DefiLlama / Dune) can replace this with no UI change.
 */

const BASE_VALUES: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 28_600_000_000,
  stakingApr: 2.9,
  totalStakers: 540_000,
  marketShare: 26.4,
  supportedChains: 7,
};

const DELTAS: Partial<Record<MetricKey, number>> = {
  totalValueLocked: 2.2,
  totalStakers: 1.4,
  marketShare: -0.3,
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

export const lidoAnalyticsAdapter: AnalyticsAdapter = {
  getMetrics(keys: MetricKey[]): Promise<Provenanced<MetricResult[]>> {
    return delay(provenance(keys.map(buildMetric)));
  },

  getTimeseries(range: TimeRange): Promise<Provenanced<TimeseriesResult>> {
    return delay(
      provenance<TimeseriesResult>({
        label: "Total value staked",
        format: "currency",
        // Pass staked value as the base so the series tracks the level.
        points: buildTimeseries(range, BASE_VALUES.totalValueLocked!, 6060),
      }),
    );
  },

  getBreakdowns(): Promise<Provenanced<Breakdown[]>> {
    // Where stETH / wstETH is held across DeFi (illustrative shares of TVL).
    const venues = withShares(
      [
        { label: "Aave", sharePct: 24.8 },
        { label: "MakerDAO / Sky", sharePct: 16.3 },
        { label: "Curve", sharePct: 9.7 },
        { label: "Morpho", sharePct: 7.1 },
        { label: "Balancer", sharePct: 4.9 },
        { label: "Pendle", sharePct: 3.8 },
      ],
      BASE_VALUES.totalValueLocked!,
    );
    const chains = withShares(
      [
        { label: "Ethereum", sharePct: 88.6 },
        { label: "Arbitrum", sharePct: 4.1 },
        { label: "Base", sharePct: 2.9 },
        { label: "Optimism", sharePct: 2.1 },
        { label: "Polygon", sharePct: 1.3 },
        { label: "Scroll", sharePct: 1.0 },
      ],
      BASE_VALUES.totalValueLocked!,
    );

    return delay(
      provenance<Breakdown[]>([
        {
          id: "steth-in-defi",
          title: "stETH across DeFi",
          valueHeader: "Held",
          rows: venues,
        },
        {
          id: "top-chains",
          title: "Top chains (wstETH)",
          valueHeader: "TVL",
          rows: chains,
        },
      ]),
    );
  },
};
