import type { ProtocolBranding } from "@/protocols/types";
import { cn } from "@/lib/utils";

/**
 * Protocol avatar: renders the brand logo when `logoSrc` is set, otherwise the
 * accent-colored monogram. Centralizing the fallback here means a logoless
 * protocol (e.g. Backed) degrades gracefully everywhere it's shown.
 *
 * Logos sit on a neutral plate so transparent marks (e.g. Compound's green mark)
 * stay legible — they'd disappear on the protocol's own accent. Square logos in
 * a square box fill cleanly with no cropping.
 *
 * `className` controls size (and monogram text size), e.g. "size-14 text-xl".
 */
export function ProtocolLogo({
  branding,
  className,
}: {
  branding: ProtocolBranding;
  className?: string;
}) {
  if (branding.logoSrc) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-border/60",
          className,
        )}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={branding.logoSrc}
          alt=""
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-semibold",
        className,
      )}
      style={{
        backgroundColor: "var(--protocol-accent)",
        color: branding.accentForeground ?? "white",
      }}
      aria-hidden
    >
      {branding.monogram}
    </span>
  );
}
