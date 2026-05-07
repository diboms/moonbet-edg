"use client";

import { useState } from "react";
import { Moon, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { Bet, BetEvent, EventOption } from "@/lib/types";
import { calculatePayout, cn, formatMoons } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface BetSliderProps {
  event: BetEvent;
  existingBet?: Bet;
  onSuccess?: () => void;
}

export function BetSlider({ event, existingBet, onSuccess }: BetSliderProps) {
  const { currentUser, placeBet, changeBet } = useStore() as any;
  const isEditing = !!existingBet;

  const initialOption = existingBet
    ? event.options.find((o) => o.id === existingBet.optionId) ?? null
    : null;

  const [selectedOption, setSelectedOption] = useState<EventOption | null>(initialOption);
  const [amount, setAmount] = useState(existingBet?.amount ?? 50);
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  // In edit mode, available balance includes the refunded existing bet
  const availableBalance = isEditing
    ? currentUser.balance + (existingBet?.amount ?? 0)
    : currentUser.balance;
  const maxBet = Math.min(availableBalance, 1000);
  const minBet = 10;

  const selectedCote = selectedOption?.cote ?? 2;
  const estimatedPayout = selectedOption ? amount * selectedCote : 0;

  const hasChanged = isEditing &&
    (selectedOption?.id !== existingBet?.optionId || amount !== existingBet?.amount);

  const handleBet = async () => {
    if (!selectedOption) {
      toast({ title: "Choisis une option !", variant: "error" });
      return;
    }
    if (isEditing && !hasChanged) {
      toast({ title: "Aucune modification", description: "Change l'option ou la mise pour modifier ton pari.", variant: "error" });
      return;
    }
    setLoading(true);
    const result = await (isEditing
      ? changeBet(event.id, selectedOption.id, amount)
      : placeBet(event.id, selectedOption.id, amount));
    setLoading(false);
    {
      if (result.success) {
        toast({
          title: isEditing ? "✏️ Pari modifié !" : "🌙 Pari placé !",
          description: `${formatMoons(amount)} Moons sur "${selectedOption.label}"`,
          variant: "success",
        });
        onSuccess?.();
      } else {
        toast({ title: "Erreur", description: result.error, variant: "error" });
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Option selection */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">1. Choisis ton camp</p>
        <div className="grid gap-2">
          {event.options.map((opt) => {
            const pct = event.totalPot > 0 ? (opt.totalBets / event.totalPot) * 100 : 0;
            const isSelected = selectedOption?.id === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOption(opt)}
                className={cn(
                  "w-full text-left rounded-xl border p-3.5 transition-all duration-200 relative overflow-hidden",
                  isSelected
                    ? "border-edg-500/50 bg-edg-500/10 shadow-lg shadow-edg-500/10"
                    : "border-dark-500 bg-dark-700/50 hover:border-dark-400 hover:bg-dark-700"
                )}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-sm font-bold", isSelected ? "text-edg-300" : "text-zinc-200")}>
                    {isSelected && "✓ "}{opt.label}
                  </span>
                  <span className={cn(
                    "text-xs font-black rounded-full px-2.5 py-0.5 border",
                    isSelected
                      ? "bg-edg-500/20 text-edg-300 border-edg-500/30"
                      : "bg-dark-600 text-zinc-500 border-dark-500"
                  )}>
                    x{(opt.cote ?? 2).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-dark-600 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", isSelected ? "bg-edg-gradient" : "bg-dark-500")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0 font-mono">
                    🌙 {formatMoons(opt.totalBets)} ({pct.toFixed(0)}%)
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400">2. Ta mise</p>
          <div className="flex items-center gap-1.5 rounded-full bg-moon-400/10 border border-moon-400/20 px-3 py-1.5">
            <Moon className="h-3.5 w-3.5 text-moon-400" />
            <span className="text-base font-black text-moon-400 tabular-nums">{formatMoons(amount)}</span>
          </div>
        </div>

        <Slider min={minBet} max={maxBet} step={10} value={[amount]} onValueChange={(v) => setAmount(v[0])} className="mb-3" />

        <div className="flex justify-between text-xs text-zinc-600 font-mono mb-3">
          <span>Min {minBet} 🌙</span>
          <span>{isEditing ? "Dispo" : "Solde"} {formatMoons(availableBalance)} 🌙</span>
        </div>

        <div className="flex gap-2">
          {[25, 50, 100, 200].filter((v) => v <= maxBet).map((v) => (
            <button key={v} onClick={() => setAmount(v)}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-black transition-all uppercase tracking-wide",
                amount === v
                  ? "bg-edg-500/20 text-edg-300 border border-edg-500/30"
                  : "bg-dark-700 text-zinc-500 hover:bg-dark-600 hover:text-zinc-300 border border-dark-500"
              )}>
              {v}
            </button>
          ))}
          <button onClick={() => setAmount(maxBet)}
            className={cn(
              "flex-1 rounded-lg py-2 text-xs font-black transition-all uppercase tracking-wide",
              amount === maxBet
                ? "bg-edg-500/20 text-edg-300 border border-edg-500/30"
                : "bg-dark-700 text-zinc-500 hover:bg-dark-600 hover:text-zinc-300 border border-dark-500"
            )}>
            MAX
          </button>
        </div>
      </div>

      {/* Payout estimate */}
      {selectedOption && (
        <div className="rounded-xl bg-dark-700/60 border border-dark-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wide font-semibold">
              <TrendingUp className="h-4 w-4" />
              Gain potentiel
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-moon-400">🌙 {formatMoons(estimatedPayout)}</div>
              <div className="text-xs">
                {estimatedPayout > amount ? (
                  <span className="text-emerald-400 font-bold">+{formatMoons(estimatedPayout - amount)} profit</span>
                ) : (
                  <span className="text-red-400 font-bold">-{formatMoons(amount - estimatedPayout)}</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-700 mt-2">* Estimation Pari Mutuel — varie selon les mises</p>
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={handleBet}
        disabled={!selectedOption || loading || availableBalance < minBet || (isEditing && !hasChanged)}
        variant={isEditing ? "secondary" : "default"}
        className="w-full h-12 text-sm"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Confirmation...
          </span>
        ) : isEditing ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Modifier mon pari — {formatMoons(amount)} Moons
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Miser {formatMoons(amount)} Moons
          </span>
        )}
      </Button>
    </div>
  );
}
