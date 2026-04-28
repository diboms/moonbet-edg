"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import { Home, Zap, PlusCircle, Trophy, LogOut, Moon, UserCircle } from "lucide-react";
import { cn, formatMoons, getInitials } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VincentCaricature } from "@/components/ui/vincent-caricature";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/events", icon: Zap, label: "Paris en cours" },
  { href: "/events/create", icon: PlusCircle, label: "Créer" },
  { href: "/history", icon: Trophy, label: "Palmarès" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-50 hidden md:flex border-b border-dark-600 bg-dark-900/95 backdrop-blur-md">
      {/* EDG top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient" />

      <div className="flex h-16 w-full max-w-7xl mx-auto items-center justify-between px-6">
        {/* Logo EDG style */}
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-edg-gradient shadow-lg">
              <Moon className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-black text-lg text-white">Moon</span>
              <span className="font-black text-lg text-edg-gradient">Bet</span>
              <span className="text-xs text-zinc-600 font-medium ml-1 tracking-wider uppercase">EDG</span>
            </div>
          </Link>
          <a
            href="https://fr.linkedin.com/in/vincentklingbeil"
            target="_blank"
            rel="noopener noreferrer"
            title="Vincent Klingbeil — CEO EDG"
            className="relative ml-1 hover:scale-110 transition-transform duration-200 block"
          >
            <VincentCaricature className="h-14 w-14 drop-shadow-lg" />
          </a>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (pathname.startsWith(href) && href !== "/dashboard" && href !== "/events/create");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all",
                  isActive
                    ? "bg-edg-500/15 text-edg-300 border border-edg-500/20"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-dark-700"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          {/* Moon balance */}
          <div className="flex items-center gap-1.5 rounded-full bg-moon-400/10 border border-moon-400/20 px-3 py-1.5">
            <Moon className="h-3.5 w-3.5 text-moon-400" />
            <span className="text-sm font-black text-moon-400 tabular-nums">{formatMoons(currentUser.balance)}</span>
          </div>
          <Link href="/profile" title="Mon profil">
            <Avatar className="h-8 w-8 border-2 border-edg-500/30 ring-1 ring-edg-500/10 hover:ring-edg-400/40 hover:border-edg-400/50 transition-all cursor-pointer">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-xs bg-edg-gradient text-white">{getInitials(currentUser.firstName, currentUser.lastName)}</AvatarFallback>
            </Avatar>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-zinc-500">
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
