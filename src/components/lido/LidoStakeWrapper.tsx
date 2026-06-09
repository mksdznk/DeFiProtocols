"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-only loader for the Lido stake surface so the Lido SDK (which pulls in
 * graphql/ipfs deps) runs only in the browser, never during SSR, and stays out
 * of the initial page payload.
 */
const LidoStake = dynamic(
  () => import("./LidoStake").then((m) => m.LidoStake),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto w-full max-w-md">
        <Skeleton className="h-[26rem] w-full rounded-2xl" />
      </div>
    ),
  },
);

export function LidoStakeWrapper() {
  return <LidoStake />;
}
