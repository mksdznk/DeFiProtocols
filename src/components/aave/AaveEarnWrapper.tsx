"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-only loader for the Aave SDK-based Easy Earn. `ssr: false` keeps the
 * Aave SDK (GraphQL client, urql) off the server and out of the initial payload.
 */
const AaveEasyEarn = dynamic(
  () => import("./AaveEasyEarn").then((m) => m.AaveEasyEarn),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto w-full max-w-md">
        <Skeleton className="h-[30rem] w-full rounded-2xl" />
      </div>
    ),
  },
);

export function AaveEarnWrapper() {
  return <AaveEasyEarn />;
}
