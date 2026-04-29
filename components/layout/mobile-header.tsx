"use client";

import Link from "next/link";
import { Moon } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatMoons } from "@/lib/utils";
import { VincentCaricature } from "@/components/ui/vincent-caricature";

export function MobileHeader() {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-50 md:hidden border-b border-dark-600 bg-dark-900/95 backdrop-blur-md">
      <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient" />
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo + Vincent */}
        <div className="flex items-center gap-1">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-edg-gradient shadow-lg">
              <Moon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-base text-white">
              Moon<span className="text-edg-400">Bet</span>
            </span>
          </Link>
          <a
            href="https://fr.linkedin.com/in/vincentklingbeil"
            target="_blank"
            rel="noopener noreferrer"
            title="Vincent Klingbeil — CEO EDG"
            className="hover:scale-110 transition-transform duration-200 block"
          >
            <VincentCaricature className="h-12 w-12 drop-shadow-lg" />
          </a>
        </div>

        {/* Solde */}
        <div className="flex items-center gap-1.5 rounded-full bg-moon-400/10 border border-moon-400/20 px-3 py-1.5">
          <Moon className="h-3 w-3 text-moon-400" />
          <span className="text-sm font-black text-moon-400 tabular-nums">
            {formatMoons(currentUser.balance)}
          </span>
        </div>
      </div>
    </header>
  );
}
