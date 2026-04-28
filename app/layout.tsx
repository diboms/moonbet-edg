import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Toaster } from "@/components/ui/toast";
import { HydrationProvider } from "@/components/hydration-provider";

export const metadata: Metadata = {
  title: "MoonBet EDG 🌙",
  description: "Paris internes pour l'équipe EDG — fun, fair, and full of Moons",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MoonBet",
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-dark-900 text-zinc-100 antialiased" suppressHydrationWarning>
        <HydrationProvider>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
          <Toaster />
        </HydrationProvider>
      </body>
    </html>
  );
}
