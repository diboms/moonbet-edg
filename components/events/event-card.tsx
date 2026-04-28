"use client";

import Link from "next/link";
import { Users, TrendingUp, Lock, ArrowUpRight } from "lucide-react";
import { BetEvent, CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";
import { formatMoons, getUserBetOnEvent, getEventBets } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CountdownTimer } from "./countdown-timer";

interface EventCardProps {
  event: BetEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { currentUser, bets } = useStore();
  const userBet = currentUser ? getUserBetOnEvent(bets, currentUser.id, event.id) : null;
  const eventBets = getEventBets(bets, event.id);
  const bettersCount = new Set(eventBets.map((b) => b.userId)).size;
  const isOpen = event.status === "active" && new Date(event.lockDate) > new Date();

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group hover:border-edg-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-edg-500/5 cursor-pointer relative overflow-hidden">
        {/* EDG top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient opacity-0 group-hover:opacity-100 transition-opacity" />

        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge className={CATEGORY_COLORS[event.category]} variant="outline">
                  {CATEGORY_LABELS[event.category]}
                </Badge>
                {isOpen && (
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 animate-pulse">
                    ● Paris ouverts
                  </Badge>
                )}
                {event.status === "locked" && (
                  <Badge variant="secondary">
                    <Lock className="h-3 w-3 mr-0.5" /> Fermé
                  </Badge>
                )}
                {userBet && (
                  <Badge variant="default" className="border-edg-500/30 bg-edg-500/10 text-edg-300">
                    ✓ Parié
                  </Badge>
                )}
              </div>
              <h3 className="font-black text-zinc-100 text-sm leading-tight group-hover:text-edg-gradient transition-all line-clamp-2">
                {event.title}
              </h3>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-edg-400 transition-colors shrink-0 mt-0.5" />
          </div>

          {/* Options preview */}
          <div className="space-y-2 mb-3">
            {event.options.slice(0, 2).map((opt) => {
              const pct = event.totalPot > 0 ? (opt.totalBets / event.totalPot) * 100 : 0;
              const isUserChoice = userBet?.optionId === opt.id;
              return (
                <div key={opt.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold truncate max-w-[60%] ${isUserChoice ? "text-edg-300" : "text-zinc-400"}`}>
                      {isUserChoice && "✓ "}{opt.label}
                    </span>
                    <span className="text-xs text-zinc-600 font-mono">{pct.toFixed(0)}%</span>
                  </div>
                  <Progress
                    value={pct}
                    indicatorClassName={isUserChoice ? "bg-edg-gradient" : "bg-dark-500"}
                  />
                </div>
              );
            })}
            {event.options.length > 2 && (
              <p className="text-xs text-zinc-600">+{event.options.length - 2} autre(s)...</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-dark-600">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-zinc-600">
                <Users className="h-3.5 w-3.5" />
                <span>{bettersCount}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-moon-400 font-semibold">
                <span>🌙</span>
                <span>{formatMoons(event.totalPot)}</span>
              </div>
            </div>
            {event.status === "active" && (
              <CountdownTimer lockDate={event.lockDate} compact />
            )}
            {userBet && (
              <span className="text-xs font-bold text-moon-400">🌙 {formatMoons(userBet.amount)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
