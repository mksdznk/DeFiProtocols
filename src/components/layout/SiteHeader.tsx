import Link from "next/link";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Global top bar: brand, primary nav, theme toggle, and wallet connection.
 * Rendered in the root layout so it appears on every route. The interactive
 * pieces (wallet, theme) are client islands; the shell stays a Server Component.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span
            className="flex size-6 items-center justify-center rounded bg-foreground text-xs text-background"
            aria-hidden
          >
            D
          </span>
          <span className="hidden sm:inline">DeFi Protocol Hub</span>
        </Link>
        <nav className="ml-2 hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
          <Link href="/protocols/lifi" className="hover:text-foreground">
            Protocols
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
