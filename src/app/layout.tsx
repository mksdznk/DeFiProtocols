import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const siteName = "DeFi Protocol Hub";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${siteName} — Explore & use DeFi protocols`,
    template: `%s — ${siteName}`,
  },
  description:
    "Learn about and interact with leading DeFi protocols. Analytics, education, and direct on-chain access — starting with LiFi cross-chain swaps and bridging.",
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — Explore & use DeFi protocols`,
    description:
      "Learn about and interact with leading DeFi protocols, starting with LiFi.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <Providers>
          <a
            href="#main-content"
            className="focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:not-sr-only"
          >
            Skip to content
          </a>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
