import type {
  BreakdownRow,
  DataProvenance,
  Provenanced,
  TimeRange,
  TimeseriesPoint,
} from "./types";

/**
 * Shared helpers for mock analytics adapters. Data is deterministic (seeded, no
 * Math.random) so server and client renders agree and numbers stay stable.
 */

const SAMPLE_SOURCE = "Sample data";

const RANGE_DAYS: Record<TimeRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

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
export function delay<T>(value: T, ms = 280): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function provenance<T>(data: T): Provenanced<T> {
  const meta: DataProvenance = {
    source: SAMPLE_SOURCE,
    asOf: new Date().toISOString(),
    isSample: true,
  };
  return { ...meta, data };
}

/**
 * Build a deterministic daily timeseries with a gentle upward trend, a weekly
 * ripple, and seeded noise around `dailyBase`.
 */
export function buildTimeseries(
  range: TimeRange,
  dailyBase: number,
  seed: number,
): TimeseriesPoint[] {
  const days = RANGE_DAYS[range];
  const rng = seededRng(seed + days);
  const points: TimeseriesPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() - i);

    const progress = (days - i) / days;
    const trend = 0.7 + 0.6 * progress;
    const weekly = 1 + 0.18 * Math.sin((i / 7) * Math.PI * 2);
    const noise = 0.85 + rng() * 0.3;
    points.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(dailyBase * trend * weekly * noise),
    });
  }
  return points;
}

/** Turn {label, sharePct} rows into BreakdownRows, deriving USD from a total. */
export function withShares(
  rows: { label: string; sharePct: number }[],
  total: number,
): BreakdownRow[] {
  return rows.map((row) => ({
    label: row.label,
    sharePct: row.sharePct,
    valueUsd: Math.round((row.sharePct / 100) * total),
  }));
}
