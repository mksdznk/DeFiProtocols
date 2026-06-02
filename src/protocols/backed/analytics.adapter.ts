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
 * Backed analytics adapter — MOCK source (v1).
 *
 * RWA shape (assets under management / products / holders + breakdown by product
 * and chain), all flagged `isSample: true`. Same {@link AnalyticsAdapter}
 * interface as the other protocols — a real adapter (Backed API / proof-of-reserves
 * feed / subgraph / DefiLlama) can replace this with no UI change.
 */

const BASE_VALUES: Partial<Record<MetricKey, number>> = {
  assetsUnderManagement: 240_000_000,
  tokenizedProducts: 32,
  totalHolders: 18_400,
  collateralization: 100,
  supportedChains: 6,
};

const DELTAS: Partial<Record<MetricKey, number>> = {
  assetsUnderManagement: 4.6,
  tokenizedProducts: 6.7,
  totalHolders: 9.1,
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

export const backedAnalyticsAdapter: AnalyticsAdapter = {
  getMetrics(keys: MetricKey[]): Promise<Provenanced<MetricResult[]>> {
    return delay(provenance(keys.map(buildMetric)));
  },

  getTimeseries(range: TimeRange): Promise<Provenanced<TimeseriesResult>> {
    return delay(
      provenance<TimeseriesResult>({
        label: "Assets under management",
        format: "currency",
        points: buildTimeseries(range, BASE_VALUES.assetsUnderManagement!, 8420),
      }),
    );
  },

  getBreakdowns(): Promise<Provenanced<Breakdown[]>> {
    const products = withShares(
      [
        { label: "bIB01 · US T-Bills 0–1y", sharePct: 31.4 },
        { label: "bCSPX · S&P 500", sharePct: 18.2 },
        { label: "bC3M · € T-Bills", sharePct: 12.6 },
        { label: "bIBTA · US Treasuries 1–3y", sharePct: 9.7 },
        { label: "bHIGH · HY Corp Bonds", sharePct: 6.3 },
        { label: "xStocks · Equities", sharePct: 5.4 },
      ],
      BASE_VALUES.assetsUnderManagement!,
    );
    const chains = withShares(
      [
        { label: "Ethereum", sharePct: 58.3 },
        { label: "Gnosis", sharePct: 13.1 },
        { label: "Base", sharePct: 10.4 },
        { label: "Solana", sharePct: 8.6 },
        { label: "Polygon", sharePct: 5.7 },
        { label: "Arbitrum", sharePct: 3.9 },
      ],
      BASE_VALUES.assetsUnderManagement!,
    );

    return delay(
      provenance<Breakdown[]>([
        {
          id: "top-products",
          title: "Top products",
          valueHeader: "AUM",
          rows: products,
        },
        {
          id: "top-chains",
          title: "Top chains",
          valueHeader: "AUM",
          rows: chains,
        },
      ]),
    );
  },
};
