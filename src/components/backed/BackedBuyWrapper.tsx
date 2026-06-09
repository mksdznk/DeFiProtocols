"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-only loader for the Backed xStocks buy surface so the LI.FI SDK and
 * token-list fetch run only in the browser (not during SSR) and stay out of the
 * initial page payload.
 */
const BackedBuy = dynamic(() => import("./BackedBuy").then((m) => m.BackedBuy), {
  ssr: false,
  loading: () => (
    <div className="mx-auto w-full max-w-md">
      <Skeleton className="h-[28rem] w-full rounded-2xl" />
    </div>
  ),
});

export function BackedBuyWrapper() {
  return <BackedBuy />;
}
