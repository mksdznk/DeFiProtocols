"use client";

import type { ReactElement } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Wraps a single control (a Select trigger, a combobox button, …) with a
 * hover/focus tooltip that labels what the control selects — e.g. "The network
 * you're paying from". Keeps the interaction surfaces' dropdowns self-explanatory
 * for newcomers without cluttering the layout with extra inline labels.
 *
 * The child must be a single element that forwards DOM props (Radix triggers and
 * native buttons both do), since the tooltip attaches its handlers via `asChild`.
 */
export function FieldTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
