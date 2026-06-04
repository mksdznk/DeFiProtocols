"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-only loader for the SDK-based Easy Swap. `ssr: false` keeps the LI.FI
 * SDK off the server and out of the initial payload; it streams in when the
 * interaction section mounts.
 */
const EasySwap = dynamic(
  () => import("./EasySwap").then((m) => m.EasySwap),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto w-full max-w-md">
        <Skeleton className="h-[26rem] w-full rounded-2xl" />
      </div>
    ),
  },
);

export function EasySwapWrapper() {
  return <EasySwap />;
}
