"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-only loader for the Compound Easy Earn so its on-chain reads run in the
 * browser (not during SSR) and stay out of the initial payload.
 */
const CompoundEasyEarn = dynamic(
  () => import("./CompoundEasyEarn").then((m) => m.CompoundEasyEarn),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto w-full max-w-md">
        <Skeleton className="h-[26rem] w-full rounded-2xl" />
      </div>
    ),
  },
);

export function CompoundEarnWrapper() {
  return <CompoundEasyEarn />;
}
