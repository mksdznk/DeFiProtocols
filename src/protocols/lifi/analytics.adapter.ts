import type {
  AnalyticsAdapter,
  MetricKey,
  MetricResult,
  Provenanced,
  TimeRange,
  TimeseriesPoint,
  TopChainRow,
  TopRouteRow,
} from "@/lib/analytics/types";
import { METRIC_META } from "@/lib/analytics/metrics-meta";

/**
 * LiFi analytics adapter — MOCK source (v1).
 *
 * Returns deterministic, realistic-looking sample data so the analytics UI can
 * be built and reviewed without a live data pipeline. Everything is flagged
 * `isSample: true` and labeled "Sample data" in the UI — no fake precision is
 * presented as real. A real adapter (LiFi API / DefiLlama / Dune / subgraph)
 * can replace this behind the same {@link AnalyticsAdapter} interface with no
 * change to the components.
 *
 * Data is seeded (no Math.random) so server and client renders agree and the
 * numbers stay stable across reloads.
 */

const SAMPLE_SOURCE = "Sample data";

/** Deterministic PRNG (mulberry32). */
function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Simulate a small network delay so loading states are visible/realistic. */
function delay<T>(value: T, ms = 280): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function provenance<T>(data: T): Provenanced<T> {
  return {
    data,
    source: SAMPLE_SOURCE,
    asOf: new Date().toISOString(),
    isSample: true,
  };
}

// Baseline sample figures (clearly illustrative, LiFi-scale order of magnitude).
const BASE_VALUES: Record<MetricKey, number> = {
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

// Deterministic deltas (signed % change vs. the prior comparable window).
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

function buildMetric(key: MetricKey): MetricResult {
  const meta = METRIC_META[key];
  const changePct = DELTAS[key];
  return {
    key,
    label: meta.label,
    value: BASE_VALUES[key],
    format: meta.format,
    hint: meta.hint,
    delta:
      changePct === undefined
        ? undefined
        : {
            changePct,
            direction:
              changePct > 0 ? "up" : changePct < 0 ? "down" : "flat",
            windowLabel: deltaWindowLabel(key),
          },
  };
}

function deltaWindowLabel(key: MetricKey): string {
  if (key.includes("24h")) return "vs. prev. day";
  if (key.includes("7d")) return "vs. prev. week";
  if (key.includes("30d")) return "vs. prev. month";
  return "30d";
}

const RANGE_DAYS: Record<TimeRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

export const lifiAnalyticsAdapter: AnalyticsAdapter = {
  getMetrics(keys: MetricKey[]) {
    return delay(provenance(keys.map(buildMetric)));
  },

  getVolumeSeries(range: TimeRange) {
    const days = RANGE_DAYS[range];
    const rng = seededRng(1337 + days);
    const daily = BASE_VALUES.volume24h;
    const points: TimeseriesPoint[] = [];

    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setUTCDate(now.getUTCDate() - i);

      const progress = (days - i) / days;
      const trend = 0.7 + 0.6 * progress; // gentle upward drift
      const weekly = 1 + 0.18 * Math.sin((i / 7) * Math.PI * 2);
      const noise = 0.85 + rng() * 0.3;
      points.push({
        date: date.toISOString().slice(0, 10),
        value: Math.round(daily * trend * weekly * noise),
      });
    }
    return delay(provenance(points));
  },

  getTopRoutes(limit = 6) {
    const rows: TopRouteRow[] = [
      { fromChain: "Ethereum", toChain: "Arbitrum", volumeUsd: 0, sharePct: 18.4 },
      { fromChain: "Ethereum", toChain: "Base", volumeUsd: 0, sharePct: 15.1 },
      { fromChain: "Arbitrum", toChain: "Ethereum", volumeUsd: 0, sharePct: 11.7 },
      { fromChain: "Polygon", toChain: "Ethereum", volumeUsd: 0, sharePct: 9.3 },
      { fromChain: "Base", toChain: "Optimism", volumeUsd: 0, sharePct: 7.8 },
      { fromChain: "BNB Chain", toChain: "Ethereum", volumeUsd: 0, sharePct: 6.2 },
      { fromChain: "Optimism", toChain: "Base", volumeUsd: 0, sharePct: 5.1 },
      { fromChain: "Avalanche", toChain: "Arbitrum", volumeUsd: 0, sharePct: 4.4 },
    ].slice(0, limit);

    const total = BASE_VALUES.volume30d;
    for (const row of rows) row.volumeUsd = Math.round((row.sharePct / 100) * total);
    return delay(provenance(rows));
  },

  getTopChains(limit = 6) {
    const rows: TopChainRow[] = [
      { chain: "Ethereum", volumeUsd: 0, sharePct: 34.2 },
      { chain: "Arbitrum", volumeUsd: 0, sharePct: 19.6 },
      { chain: "Base", volumeUsd: 0, sharePct: 14.1 },
      { chain: "Polygon", volumeUsd: 0, sharePct: 10.3 },
      { chain: "Optimism", volumeUsd: 0, sharePct: 8.7 },
      { chain: "BNB Chain", volumeUsd: 0, sharePct: 6.4 },
      { chain: "Avalanche", volumeUsd: 0, sharePct: 4.2 },
    ].slice(0, limit);

    const total = BASE_VALUES.volume30d;
    for (const row of rows) row.volumeUsd = Math.round((row.sharePct / 100) * total);
    return delay(provenance(rows));
  },
};
