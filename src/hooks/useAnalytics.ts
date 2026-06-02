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

export function useVolumeSeries(slug: string, range: TimeRange) {
  return useQuery({
    queryKey: ["analytics", slug, "volume", range],
    queryFn: () => getAnalyticsAdapter(slug)!.getVolumeSeries(range),
    enabled: Boolean(getAnalyticsAdapter(slug)),
    staleTime: STALE_TIME,
  });
}

export function useTopRoutes(slug: string, limit?: number) {
  return useQuery({
    queryKey: ["analytics", slug, "top-routes", limit],
    queryFn: () => getAnalyticsAdapter(slug)!.getTopRoutes(limit),
    enabled: Boolean(getAnalyticsAdapter(slug)),
    staleTime: STALE_TIME,
  });
}

export function useTopChains(slug: string, limit?: number) {
  return useQuery({
    queryKey: ["analytics", slug, "top-chains", limit],
    queryFn: () => getAnalyticsAdapter(slug)!.getTopChains(limit),
    enabled: Boolean(getAnalyticsAdapter(slug)),
    staleTime: STALE_TIME,
  });
}
