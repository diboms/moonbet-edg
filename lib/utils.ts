import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Bet, BetEvent, EventOption } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoons(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount));
}

export function getTimeLeft(lockDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalMs: number;
} {
  const now = Date.now();
  const lock = new Date(lockDate).getTime();
  const diff = lock - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalMs: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false, totalMs: diff };
}

export function calculateOdds(option: EventOption, totalPot: number): string {
  if (option.totalBets === 0 || totalPot === 0) return "—";
  const odds = totalPot / option.totalBets;
  return `x${odds.toFixed(2)}`;
}

export function calculatePayout(betAmount: number, optionTotalBets: number, totalPot: number): number {
  if (optionTotalBets === 0) return 0;
  return (betAmount / optionTotalBets) * totalPot;
}

export function getUserBetOnEvent(bets: Bet[], userId: string, eventId: string): Bet | undefined {
  return bets.find((b) => b.userId === userId && b.eventId === eventId);
}

export function getEventBets(bets: Bet[], eventId: string): Bet[] {
  return bets.filter((b) => b.eventId === eventId);
}

export function computeLeaderboard(bets: Bet[], events: BetEvent[], users: { id: string }[]) {
  return users
    .map((user) => {
      const userBets = bets.filter((b) => b.userId === user.id);
      const resolvedBets = userBets.filter((b) => {
        const event = events.find((e) => e.id === b.eventId);
        return event?.status === "resolved";
      });
      const totalBet = resolvedBets.reduce((sum, b) => sum + b.amount, 0);
      const totalWon = resolvedBets.reduce((sum, b) => sum + (b.payout ?? 0), 0);
      const wins = resolvedBets.filter((b) => (b.payout ?? 0) > 0).length;
      const roi = totalBet > 0 ? ((totalWon - totalBet) / totalBet) * 100 : 0;

      return {
        userId: user.id,
        totalWon,
        totalBet,
        wins,
        bets: resolvedBets.length,
        roi,
      };
    })
    .sort((a, b) => b.totalWon - a.totalWon);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
