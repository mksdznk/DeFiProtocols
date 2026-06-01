"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-only loader for the LI.FI widget.
 *
 * `ssr: false` keeps the widget (and its MUI/Emotion/zustand/i18next bundle)
 * out of server rendering and off the info-hub's initial payload; it streams in
 * only when this section mounts. A sized skeleton avoids layout shift.
 */
const LiFiWidgetInner = dynamic(() => import("./LiFiWidgetInner"), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
});

function WidgetSkeleton() {
  return (
    <Skeleton className="h-[600px] w-full max-w-[416px] rounded-2xl" />
  );
}

export function LiFiWidgetWrapper() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[416px]">
        <LiFiWidgetInner />
      </div>
    </div>
  );
}
