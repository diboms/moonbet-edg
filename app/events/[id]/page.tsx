"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Users, Lock, CheckCircle2, Crown, Moon,
  Calendar, Zap, Bot, ExternalLink, ChevronDown, Camera, Image
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatMoons, getEventBets, getUserBetOnEvent, formatDate, calculatePayout } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";
import { UserLink } from "@/components/ui/user-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/toast";
import { CountdownTimer } from "@/components/events/countdown-timer";
import { BetSlider } from "@/components/events/bet-slider";
import { CommentsSection } from "@/components/events/comments-section";
import { cn } from "@/lib/utils";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { currentUser, events, bets, users, resolveEvent } = useStore();
  const [resolveOpen, setResolveOpen] = useState(false);
  const [autoResolved, setAutoResolved] = useState(false);
  const [resultPhoto, setResultPhoto] = useState("");

  useEffect(() => {
    if (!currentUser) router.replace("/");
  }, [currentUser, router]);

  // Auto-résolution : si l'heure de l'événement est passée et qu'un résultat est planifié
  useEffect(() => {
    if (!currentUser || autoResolved) return;
    const event = events.find((e) => e.id === params.id);
    if (!event) return;
    if (event.status === "resolved") return;
    if (!event.scheduledResultOptionId) return;
    if (new Date(event.eventDate) > new Date()) return;

    setAutoResolved(true);
    resolveEvent(event.id, event.scheduledResultOptionId).then(() => {
      toast({
        title: "🤖 Résolution automatique !",
        description: "Le résultat préconfiguré a été appliqué.",
        variant: "success",
      });
    });
  }, [events, params.id, currentUser, autoResolved, resolveEvent]);

  if (!currentUser) return null;

  const event = events.find((e) => e.id === params.id);
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-5xl">🔍</p>
        <p className="text-zinc-400">Événement introuvable</p>
        <Button onClick={() => router.push("/events")}>Retour aux paris</Button>
      </div>
    );
  }

  const eventBets = getEventBets(bets, event.id);
  const userBet = getUserBetOnEvent(bets, currentUser.id, event.id);
  const bettersCount = new Set(eventBets.map((b) => b.userId)).size;
  const isCreator = event.creatorId === currentUser.id;
  const lockPassed = new Date(event.lockDate) < new Date();
  const isLocked = event.status === "locked" || lockPassed;
  const isResolved = event.status === "resolved";
  const canBet = event.status === "active" && !lockPassed;
  const canResolve = isCreator && !isResolved && lockPassed;

  const winnerOption = event.winnerOptionId
    ? event.options.find((o) => o.id === event.winnerOptionId)
    : null;
  const userWon = !!(userBet && event.winnerOptionId && userBet.optionId === event.winnerOptionId);

  const handleResolve = async (optionId: string) => {
    const result = await resolveEvent(event.id, optionId, resultPhoto.trim() || undefined);
    setResolveOpen(false);
    setResultPhoto("");
    if ((result as any)?.success !== false) {
      toast({ title: "🏆 Résultat enregistré !", description: "Les gains ont été distribués.", variant: "success" });
    } else {
      toast({ title: "Erreur", description: (result as any)?.error || "Une erreur est survenue", variant: "error" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9 mt-0.5 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge className={CATEGORY_COLORS[event.category]} variant="outline">
              {CATEGORY_LABELS[event.category]}
            </Badge>
            {!isResolved && !isLocked && (
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 animate-pulse">
                ● Paris ouverts
              </Badge>
            )}
            {isResolved && (
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3" /> Résolu
              </Badge>
            )}
            {isLocked && !isResolved && (
              <Badge variant="destructive">
                <Lock className="h-3 w-3" /> Paris fermés
              </Badge>
            )}
            {event.scheduledResultOptionId && !isResolved && (
              <Badge variant="default" className="border-edg-500/30 bg-edg-500/10 text-edg-300">
                <Bot className="h-3 w-3" /> Auto
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-black text-zinc-100 leading-tight">{event.title}</h1>
          {event.description && (
            <p className="text-zinc-500 text-sm mt-1 leading-relaxed">{event.description}</p>
          )}
          {event.resultSource && (
            <a href={event.resultSource} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-edg-400 hover:text-edg-300 mt-1.5 transition-colors">
              <ExternalLink className="h-3 w-3" />
              Source du résultat
            </a>
          )}
        </div>
      </div>

      {/* Résultat banner */}
      {isResolved && winnerOption && (
        <div className={cn(
          "rounded-2xl border relative overflow-hidden",
          userWon ? "border-moon-400/30 bg-moon-400/5" : "border-dark-500 bg-dark-800"
        )}>
          {userWon && <div className="absolute top-0 left-0 right-0 h-px bg-moon-gradient" />}
          {/* Photo du résultat */}
          {event.resultPhoto && (
            <div className="w-full overflow-hidden rounded-t-2xl max-h-64">
              <img
                src={event.resultPhoto}
                alt="Photo du résultat"
                className="w-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-3 p-4">
            <span className="text-3xl">{userWon ? "🏆" : "😔"}</span>
            <div>
              <p className={`font-black text-base ${userWon ? "text-moon-400" : "text-zinc-300"}`}>
                {userWon ? "Tu as gagné !" : "Résultat final"}
              </p>
              <p className="text-sm text-zinc-400 mt-0.5">
                Gagnant : <strong className="text-zinc-200">{winnerOption.label}</strong>
              </p>
              {userBet && (
                <p className="text-sm mt-1">
                  {userWon ? (
                    <span className="text-emerald-400 font-bold">
                      +{formatMoons((userBet.payout ?? 0) - userBet.amount)} profit 🌙
                    </span>
                  ) : (
                    <span className="text-red-400">-{formatMoons(userBet.amount)} Moons perdus</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="h-4 w-4 text-zinc-600 mx-auto mb-1" />
            <div className="text-lg font-black text-zinc-100">{bettersCount}</div>
            <div className="text-xs text-zinc-600 uppercase tracking-wide">Parieurs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Moon className="h-4 w-4 text-moon-400 mx-auto mb-1" />
            <div className="text-lg font-black text-moon-400">{formatMoons(event.totalPot)}</div>
            <div className="text-xs text-zinc-600 uppercase tracking-wide">Pot</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Calendar className="h-4 w-4 text-zinc-600 mx-auto mb-1" />
            {isResolved ? (
              <>
                <div className="text-lg">✅</div>
                <div className="text-xs text-zinc-600 uppercase tracking-wide">Terminé</div>
              </>
            ) : isLocked ? (
              <>
                <div className="text-lg">🔒</div>
                <div className="text-xs text-zinc-600 uppercase tracking-wide">Fermé</div>
              </>
            ) : (
              <>
                <CountdownTimer lockDate={event.lockDate} compact className="justify-center text-sm font-bold" />
                <div className="text-xs text-zinc-600 mt-0.5 uppercase tracking-wide">Lock</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Répartition des mises */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold">
            📊 Répartition des mises
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {event.options.map((opt) => {
            const pct = event.totalPot > 0 ? (opt.totalBets / event.totalPot) * 100 : 0;
            const odds = event.totalPot > 0 ? (event.totalPot / (opt.totalBets || 1)).toFixed(2) : "—";
            const isWinner = opt.id === event.winnerOptionId;
            const isUserChoice = userBet?.optionId === opt.id;
            const isScheduled = opt.id === event.scheduledResultOptionId && !isResolved;

            return (
              <div key={opt.id} className={cn(
                "rounded-xl p-3 border transition-colors",
                isWinner ? "border-moon-400/30 bg-moon-400/5" :
                isUserChoice ? "border-edg-500/30 bg-edg-500/5" :
                "border-dark-500 bg-dark-700/30"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isWinner && <Crown className="h-4 w-4 text-moon-400 shrink-0" />}
                    {isScheduled && <Bot className="h-3.5 w-3.5 text-edg-400 shrink-0" />}
                    <span className={cn(
                      "text-sm font-bold",
                      isWinner ? "text-moon-400" :
                      isUserChoice ? "text-edg-300" :
                      "text-zinc-300"
                    )}>
                      {isUserChoice && !isWinner && "✓ "}{opt.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-zinc-600 font-mono">x{odds}</span>
                    <span className="text-xs font-bold text-zinc-400">🌙 {formatMoons(opt.totalBets)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={pct}
                    className="flex-1 h-1.5"
                    indicatorClassName={
                      isWinner ? "bg-moon-gradient" :
                      isUserChoice ? "bg-edg-gradient" :
                      undefined
                    }
                  />
                  <span className="text-xs text-zinc-600 w-9 text-right font-mono">{pct.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Section pari */}
      {canBet && (
        <Card className="border-edg-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-widest text-edg-300 font-bold">
              {userBet ? "✏️ Modifier ton pari" : "🎲 Placer ton pari"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BetSlider event={event} existingBet={userBet ?? undefined} />
          </CardContent>
        </Card>
      )}

      {/* Bouton résolution (créateur uniquement) */}
      {canResolve && (
        <Button
          variant="success"
          className="w-full h-12 text-sm"
          onClick={() => setResolveOpen(true)}
        >
          <CheckCircle2 className="h-5 w-5" />
          Clôturer et indiquer le résultat
        </Button>
      )}

      {/* Liste des parieurs */}
      {eventBets.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold">
              👥 Parieurs ({bettersCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventBets.map((bet) => {
              const betUser = users.find((u) => u.id === bet.userId);
              if (!betUser) return null;
              const option = event.options.find((o) => o.id === bet.optionId);
              const isWin = isResolved && bet.optionId === event.winnerOptionId;
              return (
                <div key={bet.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <UserLink user={betUser} showAvatar isMe={betUser.id === currentUser.id} size="sm" />
                    <p className="text-xs text-zinc-600 truncate mt-0.5 pl-10">{option?.label}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-sm font-bold", isWin ? "text-emerald-400" : "text-zinc-400")}>
                      {isWin ? "+" : ""}🌙{" "}
                      {isWin && bet.payout ? formatMoons(bet.payout) : formatMoons(bet.amount)}
                    </p>
                    {isResolved && (
                      <p className="text-xs text-zinc-600">{isWin ? "gagné" : "perdu"}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Commentaires */}
      <Card>
        <CardContent className="p-4 pt-4">
          <CommentsSection eventId={event.id} />
        </CardContent>
      </Card>

      {/* ─── RESOLVE MODAL — inline, pas de Dialog Radix ─── */}
      {resolveOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setResolveOpen(false); }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Panel */}
          <div className="relative w-full max-w-md rounded-2xl border border-dark-500 bg-dark-800 shadow-2xl shadow-black/60 overflow-hidden">
            {/* EDG accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-black text-zinc-100">🏆 Clôturer l'événement</h2>
                <button
                  onClick={() => setResolveOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-dark-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-zinc-500 mb-5">
                Sélectionne le résultat gagnant. Les gains seront distribués en Pari Mutuel.
              </p>

              {/* Photo optionnelle */}
              <div className="mb-5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  <Camera className="h-3.5 w-3.5" />
                  Photo du résultat (optionnel)
                </label>
                <input
                  type="text"
                  value={resultPhoto}
                  onChange={(e) => setResultPhoto(e.target.value)}
                  placeholder="https://... (URL d'une photo preuve / célébration)"
                  className="w-full rounded-xl border border-dark-500 bg-dark-700 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-edg-500/50 transition-colors"
                />
                {resultPhoto && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-dark-500 max-h-40">
                    <img src={resultPhoto} alt="Aperçu" className="w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {event.options.map((opt) => {
                  const pct = event.totalPot > 0
                    ? ((opt.totalBets / event.totalPot) * 100).toFixed(0)
                    : "0";
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleResolve(opt.id)}
                      className="w-full text-left rounded-xl border border-dark-500 bg-dark-700 hover:border-moon-400/50 hover:bg-moon-400/8 p-4 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-dark-500 group-hover:bg-moon-400 transition-colors shrink-0" />
                          <span className="font-bold text-zinc-200 group-hover:text-moon-400 transition-colors">
                            {opt.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <span>{pct}%</span>
                          <span>🌙 {formatMoons(opt.totalBets)}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setResolveOpen(false)}
                className="w-full mt-4 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-300 hover:bg-dark-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
