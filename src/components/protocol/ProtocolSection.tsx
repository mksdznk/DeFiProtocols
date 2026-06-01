import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Consistent wrapper for every PDP section: anchor target (for in-page nav),
 * accessible heading association, and shared vertical rhythm.
 */
export function ProtocolSection({
  id,
  title,
  description,
  children,
  className,
  headerAside,
}: {
  id: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAside?: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn("scroll-mt-24 border-t border-border/60 py-12", className)}
    >
      {title && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2
              id={`${id}-heading`}
              className="text-2xl font-semibold tracking-tight"
            >
              {title}
            </h2>
            {description && (
              <p className="max-w-2xl text-muted-foreground">{description}</p>
            )}
          </div>
          {headerAside}
        </div>
      )}
      {children}
    </section>
  );
}
