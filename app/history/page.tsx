"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Crown, Moon, Users, CheckCircle2, Building2, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatMoons, getInitials, getEventBets, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserLink } from "@/components/ui/user-link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const POSITION_COLORS = [
  "bg-moon-gradient text-white",      // 1er — or
  "bg-zinc-400 text-dark-900",        // 2e — argent
  "bg-amber-700 text-white",          // 3e — bronze
];

const STRIPE_COLORS = [
  "border-l-4 border-l-moon-400",
  "border-l-4 border-l-zinc-400",
  "border-l-4 border-l-amber-700",
];

const COMPANY_COLORS = [
  "#e11d48", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b",
  "#ec4899", "#8b5cf6", "#06b6d4", "#22c55e", "#f97316",
  "#6366f1", "#14b8a6", "#84cc16", "#ef4444", "#a855f7",
  "#3b82f6", "#eab308", "#64748b", "#d946ef", "#0d9488",
  "#4ade80", "#fb923c", "#38bdf8", "#c084fc", "#fbbf24",
  "#f43f5e", "#a3e635",
];

export default function HistoryPage() {
  const router = useRouter();
  const { currentUser, events, bets, users } = useStore();

  useEffect(() => {
    if (!currentUser) router.replace("/");
  }, [currentUser, router]);

  if (!currentUser) return null;

  const resolvedEvents = events.filter((e) => e.status === "resolved");

  /* ── Classement pilotes ── */
  const pilotes = users
    .map((u) => {
      const userBets = bets.filter((b) => b.userId === u.id);
      const resolvedBets = userBets.filter((b) => events.find((e) => e.id === b.eventId)?.status === "resolved");
      const totalBet = resolvedBets.reduce((s, b) => s + b.amount, 0);
      const totalWon = resolvedBets.reduce((s, b) => s + (b.payout ?? 0), 0);
      const wins = resolvedBets.filter((b) => (b.payout ?? 0) > 0).length;
      const losses = resolvedBets.filter((b) => (b.payout ?? 0) === 0 && b.payout !== undefined).length;
      const roi = totalBet > 0 ? ((totalWon - totalBet) / totalBet) * 100 : 0;
      return { user: u, totalBet, totalWon, wins, losses, bets: resolvedBets.length, roi, pts: totalWon };
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
      const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  /* ── Classement constructeurs ── */
  const companyMap = new Map<string, { totalWon: number; totalBet: number; wins: number; bets: number; members: number }>();
  for (const entry of pilotes) {
    const c = entry.user.company;
    const prev = companyMap.get(c) ?? { totalWon: 0, totalBet: 0, wins: 0, bets: 0, members: 0 };
    companyMap.set(c, {
      totalWon: prev.totalWon + entry.totalWon,
      totalBet: prev.totalBet + entry.totalBet,
      wins: prev.wins + entry.wins,
      bets: prev.bets + entry.bets,
      members: prev.members + 1,
    });
  }
  const constructeurs = Array.from(companyMap.entries())
    .map(([company, stats]) => ({ company, ...stats, roi: stats.totalBet > 0 ? ((stats.totalWon - stats.totalBet) / stats.totalBet) * 100 : 0 }))
    .sort((a, b) => {
      if (b.totalWon !== a.totalWon) return b.totalWon - a.totalWon;
      return a.company.localeCompare(b.company);
    });

  const allCompanies = constructeurs.map((c) => c.company);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Classement</p>
        <h1 className="text-2xl font-black text-zinc-100 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-moon-400" />
          Palmarès EDG
        </h1>
        <p className="text-zinc-600 text-xs mt-0.5">{resolvedEvents.length} événement{resolvedEvents.length > 1 ? "s" : ""} terminé{resolvedEvents.length > 1 ? "s" : ""}</p>
      </div>

      <Tabs defaultValue="pilotes">
        <TabsList className="bg-dark-800 border border-dark-600 w-full">
          <TabsTrigger value="pilotes" className="flex-1 data-[state=active]:bg-dark-700 data-[state=active]:text-edg-300">
            👤 Individuel
          </TabsTrigger>
          <TabsTrigger value="constructeurs" className="flex-1 data-[state=active]:bg-dark-700 data-[state=active]:text-edg-300">
            🏢 Sociétés
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-dark-700 data-[state=active]:text-edg-300">
            📜 Historique
          </TabsTrigger>
        </TabsList>

        {/* ═══ INDIVIDUEL ═══ */}
        <TabsContent value="pilotes" className="space-y-4 mt-4">

          {/* Podium */}
          {pilotes.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 items-end mb-2">
              {([1, 0, 2] as const).map((pos, col) => {
                const entry = pilotes[pos];
                if (!entry) return <div key={col} />;
                const isMe = entry.user.id === currentUser.id;
                const heights = ["h-24", "h-32", "h-20"];
                const podiumH = heights[col];
                return (
                  <div key={entry.user.id} className="flex flex-col items-center gap-2">
                    <Avatar className={cn(
                      "border-2 shrink-0",
                      pos === 0 ? "h-14 w-14 border-moon-400/60 shadow-lg shadow-moon-400/20" :
                      pos === 1 ? "h-11 w-11 border-zinc-400/60" : "h-10 w-10 border-amber-700/50"
                    )}>
                      <AvatarImage src={entry.user.avatar} />
                      <AvatarFallback className="text-xs bg-edg-gradient text-white">
                        {getInitials(entry.user.firstName, entry.user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-xs font-black text-zinc-200 leading-tight">{entry.user.firstName}</p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[80px]">{entry.user.company}</p>
                      <p className={cn("text-xs font-black mt-0.5", pos === 0 ? "text-moon-400" : "text-zinc-400")}>
                        🌙 {formatMoons(entry.totalWon)}
                      </p>
                    </div>
                    {/* Podium block */}
                    <div className={cn(
                      podiumH, "w-full rounded-t-lg flex items-start justify-center pt-2",
                      pos === 0 ? "bg-moon-gradient" : pos === 1 ? "bg-zinc-600" : "bg-amber-800"
                    )}>
                      <span className="text-lg font-black text-white/90">#{pos + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tableau complet */}
          <Card>
            <CardContent className="p-0 divide-y divide-dark-600">
              {/* En-tête */}
              <div className="grid grid-cols-[2rem_1fr_4rem_4rem_4rem] gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                <span>#</span>
                <span>Joueur</span>
                <span className="text-center">V/D</span>
                <span className="text-right">ROI</span>
                <span className="text-right">🌙 Pts</span>
              </div>

              {pilotes.map((entry, i) => {
                const isMe = entry.user.id === currentUser.id;
                const companyColor = COMPANY_COLORS[allCompanies.indexOf(entry.user.company) % COMPANY_COLORS.length];
                return (
                  <div
                    key={entry.user.id}
                    className={cn(
                      "grid grid-cols-[2rem_1fr_4rem_4rem_4rem] gap-2 px-4 py-3 items-center transition-colors",
                      isMe ? "bg-edg-500/8" : "hover:bg-dark-700/40"
                    )}
                    style={{ borderLeft: `3px solid ${companyColor}` }}
                  >
                    {/* Position */}
                    <div className="flex items-center justify-center">
                      {i < 3 ? (
                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0", POSITION_COLORS[i])}>
                          {i + 1}
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-600 font-black">{i + 1}</span>
                      )}
                    </div>

                    {/* Pilote */}
                    <div className="min-w-0">
                      <UserLink user={entry.user} showAvatar isMe={isMe} size="sm" />
                      <p className="text-[10px] text-zinc-600 mt-0.5 pl-9 truncate">{entry.user.company}</p>
                    </div>

                    {/* V/D */}
                    <div className="text-center">
                      <span className="text-xs font-bold text-emerald-400">{entry.wins}</span>
                      <span className="text-zinc-600 text-xs">/</span>
                      <span className="text-xs font-bold text-red-400">{entry.losses}</span>
                    </div>

                    {/* ROI */}
                    <div className="text-right">
                      <span className={cn("text-xs font-black", entry.roi >= 0 ? "text-emerald-400" : "text-red-400")}>
                        {entry.roi >= 0 ? "+" : ""}{entry.roi.toFixed(0)}%
                      </span>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <span className="text-sm font-black text-moon-400">{formatMoons(entry.totalWon)}</span>
                    </div>
                  </div>
                );
              })}

              {pilotes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🏁</p>
                  <p className="text-zinc-500 text-sm uppercase tracking-wide font-bold">Aucun résultat</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ SOCIÉTÉS ═══ */}
        <TabsContent value="constructeurs" className="space-y-4 mt-4">

          {/* Top 3 constructeurs */}
          {constructeurs.length >= 1 && (
            <div className="space-y-2">
              {constructeurs.slice(0, 3).map((entry, i) => {
                const color = COMPANY_COLORS[allCompanies.indexOf(entry.company) % COMPANY_COLORS.length];
                const pct = constructeurs[0].totalWon > 0 ? (entry.totalWon / constructeurs[0].totalWon) * 100 : 0;
                return (
                  <div key={entry.company} className="rounded-2xl border border-dark-600 bg-dark-800 overflow-hidden relative">
                    {i === 0 && <div className="absolute top-0 left-0 right-0 h-px bg-moon-gradient" />}
                    <div className="flex items-center gap-4 px-4 py-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-sm font-black shrink-0",
                        i < 3 ? POSITION_COLORS[i] : "bg-dark-600 text-zinc-400"
                      )}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                          <span className="font-black text-zinc-100 text-sm truncate">{entry.company}</span>
                          <span className="text-[10px] text-zinc-600 shrink-0">{entry.members} pilote{entry.members > 1 ? "s" : ""}</span>
                        </div>
                        <div className="h-2 rounded-full bg-dark-600 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-black text-moon-400">🌙 {formatMoons(entry.totalWon)}</p>
                        <p className={cn("text-[10px] font-bold", entry.roi >= 0 ? "text-emerald-400" : "text-red-400")}>
                          {entry.roi >= 0 ? "+" : ""}{entry.roi.toFixed(0)}% ROI
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tableau complet */}
          <Card>
            <CardContent className="p-0 divide-y divide-dark-600">
              <div className="grid grid-cols-[2rem_1fr_3.5rem_3.5rem_4.5rem] gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                <span>#</span>
                <span>Société</span>
                <span className="text-center">V</span>
                <span className="text-right">ROI</span>
                <span className="text-right">🌙 Pts</span>
              </div>

              {constructeurs.map((entry, i) => {
                const color = COMPANY_COLORS[allCompanies.indexOf(entry.company) % COMPANY_COLORS.length];
                return (
                  <div
                    key={entry.company}
                    className="grid grid-cols-[2rem_1fr_3.5rem_3.5rem_4.5rem] gap-2 px-4 py-3 items-center hover:bg-dark-700/40 transition-colors"
                    style={{ borderLeft: `3px solid ${color}` }}
                  >
                    <div className="flex items-center justify-center">
                      {i < 3 ? (
                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black", POSITION_COLORS[i])}>
                          {i + 1}
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-600 font-black">{i + 1}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-sm font-black text-zinc-200 truncate">{entry.company}</span>
                      </div>
                      <span className="text-[10px] text-zinc-600 pl-4">{entry.members} pilote{entry.members > 1 ? "s" : ""} · {entry.bets} paris</span>
                    </div>

                    <div className="text-center">
                      <span className="text-xs font-bold text-emerald-400">{entry.wins}</span>
                    </div>

                    <div className="text-right">
                      <span className={cn("text-xs font-black", entry.roi >= 0 ? "text-emerald-400" : "text-red-400")}>
                        {entry.roi >= 0 ? "+" : ""}{entry.roi.toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-moon-400">{formatMoons(entry.totalWon)}</span>
                    </div>
                  </div>
                );
              })}

              {constructeurs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🏢</p>
                  <p className="text-zinc-500 text-sm uppercase tracking-wide font-bold">Aucun résultat</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ HISTORIQUE ═══ */}
        <TabsContent value="history" className="space-y-3 mt-4">
          {resolvedEvents.length > 0 ? (
            resolvedEvents.map((event) => {
              const eventBets = getEventBets(bets, event.id);
              const bettersCount = new Set(eventBets.map((b) => b.userId)).size;
              const winnerOption = event.options.find((o) => o.id === event.winnerOptionId);
              const userBet = eventBets.find((b) => b.userId === currentUser.id);
              const userWon = userBet && userBet.optionId === event.winnerOptionId;
              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="hover:border-edg-500/30 transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge className={CATEGORY_COLORS[event.category]} variant="outline">
                              {CATEGORY_LABELS[event.category]}
                            </Badge>
                            <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Résolu</Badge>
                          </div>
                          <h3 className="font-black text-zinc-100 text-sm group-hover:text-edg-300 transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                        </div>
                        {userBet && <span className="text-2xl shrink-0">{userWon ? "🏆" : "😔"}</span>}
                      </div>

                      {winnerOption && (
                        <div className="flex items-center gap-2 mb-3 rounded-lg bg-moon-400/5 border border-moon-400/15 px-3 py-2">
                          <Crown className="h-3.5 w-3.5 text-moon-400 shrink-0" />
                          <span className="text-xs font-bold text-moon-400">{winnerOption.label}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-zinc-600">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{bettersCount}</span>
                          <span className="flex items-center gap-1"><Moon className="h-3.5 w-3.5 text-moon-400" />{formatMoons(event.totalPot)}</span>
                        </div>
                        <span className="font-mono text-xs">{formatDate(event.eventDate)}</span>
                      </div>

                      {userBet && (
                        <div className="mt-3 pt-3 border-t border-dark-600 flex items-center justify-between">
                          <span className="text-xs text-zinc-600">Mise: 🌙 {formatMoons(userBet.amount)}</span>
                          {userWon ? (
                            <span className="text-xs font-black text-emerald-400">+{formatMoons((userBet.payout ?? 0) - userBet.amount)} 🎉</span>
                          ) : (
                            <span className="text-xs font-black text-red-400">Perdu</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📜</p>
              <p className="text-zinc-400 font-black uppercase tracking-wide text-sm">Aucun événement terminé</p>
              <p className="text-zinc-600 text-xs mt-1">L'historique apparaîtra après résolution</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
