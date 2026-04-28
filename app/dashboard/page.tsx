"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, TrendingUp, Zap, Trophy, ArrowRight, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatMoons, getInitials, getUserBetOnEvent } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserLink } from "@/components/ui/user-link";
import { EventCard } from "@/components/events/event-card";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, events, bets, users } = useStore();

  useEffect(() => {
    if (!currentUser) router.replace("/");
  }, [currentUser, router]);

  if (!currentUser) return null;

  const activeEvents = events.filter((e) => e.status === "active").slice(0, 3);
  const userBets = bets.filter((b) => b.userId === currentUser.id);
  const activeBets = userBets.filter((b) => events.find((e) => e.id === b.eventId)?.status === "active");
  const resolvedBets = userBets.filter((b) => b.payout !== undefined);
  const totalWon = resolvedBets.reduce((sum, b) => sum + (b.payout ?? 0), 0);
  const wins = resolvedBets.filter((b) => (b.payout ?? 0) > 0).length;

  const leaderboard = users
    .map((u) => ({
      user: u,
      totalWon: bets.filter((b) => b.userId === u.id).reduce((s, b) => s + (b.payout ?? 0), 0),
    }))
    .sort((a, b) => b.totalWon - a.totalWon)
    .slice(0, 3);

  const rank = leaderboard.findIndex((l) => l.user.id === currentUser.id) + 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Dashboard</p>
          <h1 className="text-2xl font-black text-zinc-100 leading-tight">
            Salut, {currentUser.firstName} <span className="text-edg-gradient">✦</span>
          </h1>
        </div>
        <Avatar className="h-12 w-12 border-2 border-edg-500/30 ring-2 ring-edg-500/10 shadow-xl shadow-edg-500/10">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback className="bg-edg-gradient text-white text-sm font-bold">
            {getInitials(currentUser.firstName, currentUser.lastName)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Balance Hero Card */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* EDG gradient background */}
        <div className="absolute inset-0 bg-edg-gradient opacity-10" />
        <div className="absolute inset-0 halftone opacity-40" />
        {/* Glow orbs */}
        <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-edg-500/20 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-edgpink-500/10 blur-2xl" />

        <div className="relative border border-edg-500/20 bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6">
          {/* Top accent line */}
          <div className="absolute top-0 left-6 right-6 h-px bg-edg-gradient rounded-full" />

          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Ton solde</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tabular-nums" style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {formatMoons(currentUser.balance)}
                </span>
                <span className="text-3xl animate-float">🌙</span>
              </div>
              <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">Moons disponibles</p>
            </div>
            {/* EDG logo mark */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-edg-gradient shadow-xl glow-edg">
              <Moon className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: activeBets.length, label: "Paris actifs", color: "text-edg-400" },
              { value: wins, label: "Victoires", color: "text-emerald-400" },
              { value: rank > 0 ? `#${rank}` : "—", label: "Classement", color: "text-moon-400" },
            ].map(({ value, label, color }) => (
              <div key={label} className="rounded-xl bg-dark-700/60 border border-dark-500 p-3 text-center">
                <div className={`text-xl font-black ${color} tabular-nums`}>{value}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Weekly recharge */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-dark-700/40 border border-dark-500/50 px-3 py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-edg-400 animate-pulse" />
            <p className="text-xs text-zinc-500">
              <span className="text-edg-400 font-semibold">+100 Moons</span> automatiques chaque semaine
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/events/create">
          <Button variant="default" className="w-full h-12">
            <Plus className="h-4 w-4" />
            Créer un pari
          </Button>
        </Link>
        <Link href="/events">
          <Button variant="secondary" className="w-full h-12">
            <Zap className="h-4 w-4" />
            Voir les paris
          </Button>
        </Link>
      </div>

      {/* Active events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-zinc-100 flex items-center gap-2 uppercase tracking-wide text-sm">
            <Zap className="h-4 w-4 text-edg-400" />
            Paris en cours
          </h2>
          <Link href="/events" className="text-xs font-semibold text-edg-400 hover:text-edg-300 flex items-center gap-1 uppercase tracking-wide">
            Tout voir <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {activeEvents.length > 0 ? (
          <div className="space-y-3">
            {activeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-4xl mb-3">🎲</p>
              <p className="text-zinc-500 text-sm">Aucun pari en cours</p>
              <Link href="/events/create">
                <Button size="sm" className="mt-3">Créer le premier !</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mini leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-zinc-100 flex items-center gap-2 uppercase tracking-wide text-sm">
            <Trophy className="h-4 w-4 text-moon-400" />
            Top joueurs
          </h2>
          <Link href="/history" className="text-xs font-semibold text-edg-400 hover:text-edg-300 flex items-center gap-1 uppercase tracking-wide">
            Palmarès <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {leaderboard.map(({ user, totalWon: won }, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              const isMe = user.id === currentUser.id;
              return (
                <div key={user.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isMe ? "bg-edg-500/10 border border-edg-500/20" : "hover:bg-dark-700"}`}>
                  <span className="text-lg w-6 text-center shrink-0">{medals[i]}</span>
                  <div className="flex-1 min-w-0">
                    <UserLink user={user} showAvatar showCompany isMe={isMe} />
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-moon-400">🌙 {formatMoons(won)}</p>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wide">gagnés</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
