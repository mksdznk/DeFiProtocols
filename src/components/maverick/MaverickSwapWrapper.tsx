"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-only loader for the Maverick swap so its API/on-chain calls run in the
 * browser (not during SSR) and stay out of the initial payload.
 */
const MaverickEasySwap = dynamic(
  () => import("./MaverickEasySwap").then((m) => m.MaverickEasySwap),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto w-full max-w-md">
        <Skeleton className="h-[26rem] w-full rounded-2xl" />
      </div>
    ),
  },
);

export function MaverickSwapWrapper() {
  return <MaverickEasySwap />;
}
