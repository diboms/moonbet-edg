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

export function calculatePayout(betAmount: number, optionTotalBets: number, totalPot: number, cote: number = 2): number {
  // Le payout est la mise multipliée par la cote (default x2)
  return betAmount * cote;
}

/**
 * Calcule la cote suggérée pour 2 équipes en fonction de la moyenne des ratings.
 * Retourne [coteEquipe1, coteEquipe2] avec une marge de 5% (équilibre Bookmaker).
 *
 * Formule : la probabilité d'une équipe de gagner suit la formule ELO classique :
 *   P(A) = 1 / (1 + 10^((Rb - Ra) / 400))
 * On inverse pour avoir la cote brute = 1 / P, puis on applique 95% pour avoir une marge raisonnable.
 */
export function suggestCotes(team1Rating: number, team2Rating: number): [number, number] {
  const probA = 1 / (1 + Math.pow(10, (team2Rating - team1Rating) / 400));
  const probB = 1 - probA;
  // Cote inversement proportionnelle à la probabilité, avec marge
  const margin = 0.95;
  const coteA = Math.max(1.05, Math.round((1 / probA) * margin * 100) / 100);
  const coteB = Math.max(1.05, Math.round((1 / probB) * margin * 100) / 100);
  return [coteA, coteB];
}

/**
 * Met à jour les ratings ELO de 2 équipes après un match.
 * Retourne les nouveaux ratings INDIVIDUELS de chaque joueur des 2 équipes.
 *
 * @param team1PlayersRatings - ratings actuels des joueurs équipe 1
 * @param team2PlayersRatings - ratings actuels des joueurs équipe 2
 * @param team1Won - true si l'équipe 1 a gagné
 * @param k - facteur K (par défaut 32, classique pour amateurs)
 */
export function updateElo(
  team1PlayersRatings: number[],
  team2PlayersRatings: number[],
  team1Won: boolean,
  k: number = 32
): { team1: number[]; team2: number[] } {
  const avg1 = team1PlayersRatings.reduce((s, r) => s + r, 0) / team1PlayersRatings.length;
  const avg2 = team2PlayersRatings.reduce((s, r) => s + r, 0) / team2PlayersRatings.length;
  const expected1 = 1 / (1 + Math.pow(10, (avg2 - avg1) / 400));
  const expected2 = 1 - expected1;
  const score1 = team1Won ? 1 : 0;
  const score2 = team1Won ? 0 : 1;

  // Chaque joueur gagne/perd k * (réel - attendu) points en partant de la moyenne de son équipe
  const delta1 = Math.round(k * (score1 - expected1));
  const delta2 = Math.round(k * (score2 - expected2));

  return {
    team1: team1PlayersRatings.map((r) => r + delta1),
    team2: team2PlayersRatings.map((r) => r + delta2),
  };
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
