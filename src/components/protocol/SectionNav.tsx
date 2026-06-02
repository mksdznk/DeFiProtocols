"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProtocolNavItem } from "./section-registry";

/**
 * Sticky in-page section navigation with scroll-spy.
 *
 * Renders one anchor per enabled section and highlights the section currently
 * in view via IntersectionObserver. Horizontally scrollable on narrow screens
 * so it stays a single, accessible pattern across breakpoints (real anchors +
 * `aria-current`, smooth scroll handled by CSS with reduced-motion respected).
 */
export function SectionNav({ items }: { items: ProtocolNavItem[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Activate the intersecting section nearest the top of the viewport.
        const topMost = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (topMost) setActiveId(topMost.target.id);
      },
      // Bias the "active" band toward the upper third of the viewport.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 z-30 -mx-6 mb-2 border-b border-border/60 bg-background/80 px-6 backdrop-blur-md"
    >
      <ul className="flex gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "focus-visible:ring-ring inline-block rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  active
                    ? "bg-protocol/10 text-protocol"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
