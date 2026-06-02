"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalyticsAdapter } from "@/lib/analytics/registry";
import type { MetricKey, TimeRange } from "@/lib/analytics/types";

/**
 * TanStack Query hooks over a protocol's AnalyticsAdapter. Each section reads
 * only what it needs; queries are independent so widgets render as data lands.
 * Provenance (`source`, `asOf`, `isSample`) rides along in every result.
 */

const STALE_TIME = 5 * 60 * 1000; // analytics doesn't need to be real-time

export function useMetrics(slug: string, keys: MetricKey[]) {
  return useQuery({
    queryKey: ["analytics", slug, "metrics", keys],
    queryFn: () => getAnalyticsAdapter(slug)!.getMetrics(keys),
    enabled: Boolean(getAnalyticsAdapter(slug)) && keys.length > 0,
    staleTime: STALE_TIME,
  });
}

export function useTimeseries(slug: string, range: TimeRange) {
  return useQuery({
    queryKey: ["analytics", slug, "timeseries", range],
    queryFn: () => getAnalyticsAdapter(slug)!.getTimeseries(range),
    enabled: Boolean(getAnalyticsAdapter(slug)),
    staleTime: STALE_TIME,
  });
}

export function useBreakdowns(slug: string) {
  return useQuery({
    queryKey: ["analytics", slug, "breakdowns"],
    queryFn: () => getAnalyticsAdapter(slug)!.getBreakdowns(),
    enabled: Boolean(getAnalyticsAdapter(slug)),
    staleTime: STALE_TIME,
  });
}
