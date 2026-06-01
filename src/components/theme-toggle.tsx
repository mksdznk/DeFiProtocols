"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: theme is only known on the client.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" aria-hidden />
        ) : (
          <Moon className="size-4" aria-hidden />
        )
      ) : (
        <Sun className="size-4 opacity-0" aria-hidden />
      )}
    </Button>
  );
}
