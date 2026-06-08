"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-only loader for the Curve swap. `ssr: false` keeps curve-js (+ ethers)
 * off the server and out of the initial payload; it streams in on mount.
 */
const CurveEasySwap = dynamic(
  () => import("./CurveEasySwap").then((m) => m.CurveEasySwap),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto w-full max-w-md">
        <Skeleton className="h-[24rem] w-full rounded-2xl" />
      </div>
    ),
  },
);

export function CurveSwapWrapper() {
  return <CurveEasySwap />;
}
