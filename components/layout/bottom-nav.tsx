"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, PlusCircle, Trophy, UserCircle, Moon } from "lucide-react";
import { cn, formatMoons, getInitials } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VincentCaricature } from "@/components/ui/vincent-caricature";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/events", icon: Zap, label: "Paris" },
  { href: "/events/create", icon: PlusCircle, label: "Créer", primary: true },
  { href: "/history", icon: Trophy, label: "Palmarès" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { currentUser } = useStore();

  return (
    <>
      {/* Barre mobile en haut */}
      {currentUser && (
        <header className="sticky top-0 z-50 md:hidden border-b border-dark-600 bg-dark-900/95 backdrop-blur-md">
          <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient" />
          <div className="flex items-center justify-between px-4 h-14">
            {/* Logo + Vincent */}
            <div className="flex items-center gap-1">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-edg-gradient shadow-lg">
                  <Moon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-black text-base text-white">Moon<span className="text-edg-400">Bet</span></span>
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
            {/* Balance */}
            <div className="flex items-center gap-1.5 rounded-full bg-moon-400/10 border border-moon-400/20 px-3 py-1.5">
              <Moon className="h-3 w-3 text-moon-400" />
              <span className="text-sm font-black text-moon-400 tabular-nums">{formatMoons(currentUser.balance)}</span>
            </div>
          </div>
        </header>
      )}

    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="h-px bg-edg-gradient" />
      <div className="flex items-center justify-around bg-dark-900/95 backdrop-blur-md px-1 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, primary }) => {
          const isActive = pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href) && href !== "/events/create");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200",
                primary ? "" : isActive ? "text-edg-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {primary ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-edg-gradient shadow-xl shadow-edg-600/40 glow-edg -mt-4">
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                    isActive ? "bg-edg-500/15 border border-edg-500/20" : ""
                  )}>
                    <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={cn("text-[10px] font-semibold tracking-wide", isActive ? "text-edg-400" : "")}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}

        {/* Avatar / Profil */}
        <Link href="/profile" className={cn(
          "flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all",
          pathname === "/profile" ? "text-edg-400" : "text-zinc-500 hover:text-zinc-300"
        )}>
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
            pathname === "/profile" ? "bg-edg-500/15 border border-edg-500/20" : ""
          )}>
            {currentUser ? (
              <Avatar className="h-6 w-6 border border-dark-500">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-[8px] bg-edg-gradient text-white font-bold">
                  {getInitials(currentUser.firstName, currentUser.lastName)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <UserCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
            )}
          </div>
          <span className={cn("text-[10px] font-semibold tracking-wide", pathname === "/profile" ? "text-edg-400" : "")}>
            Profil
          </span>
        </Link>
      </div>
    </nav>
    </>
  );
}
