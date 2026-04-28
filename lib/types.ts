export type Company =
  | "EDG HQ"
  | "Equancy"
  | "Optimize matter"
  | "Semantiweb"
  | "Metsys"
  | "2PACE"
  | "WEFY Group"
  | "Caboost"
  | "Axome"
  | "Garaje de Ideas"
  | "WOLD"
  | "Ad's up Consulting"
  | "Dataventure"
  | "Lift"
  | "Ad's up Campus"
  | "Ores Group"
  | "Follow"
  | "Kindai"
  | "Digital Prod"
  | "Band Originale"
  | "Ghosts Play Music"
  | "Aura"
  | "Andy"
  | "COVER"
  | "LesBigBoss"
  | "Digitalinkers"
  | "Autre";

export const COMPANIES: Company[] = [
  "EDG HQ",
  "Equancy",
  "Optimize matter",
  "Semantiweb",
  "Metsys",
  "2PACE",
  "WEFY Group",
  "Caboost",
  "Axome",
  "Garaje de Ideas",
  "WOLD",
  "Ad's up Consulting",
  "Dataventure",
  "Lift",
  "Ad's up Campus",
  "Ores Group",
  "Follow",
  "Kindai",
  "Digital Prod",
  "Band Originale",
  "Ghosts Play Music",
  "Aura",
  "Andy",
  "COVER",
  "LesBigBoss",
  "Digitalinkers",
  "Autre",
];

export type EventCategory = "padel" | "bureau" | "autre";

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  padel: "🏓 Padel",
  bureau: "💼 Bureau",
  autre: "🎲 Autre",
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  padel: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  bureau: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  autre: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export type EventStatus = "active" | "locked" | "resolved";

export interface EventOption {
  id: string;
  label: string;
  totalBets: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: Company;
  avatar: string;
  linkedin?: string;
  balance: number;
  createdAt: string;
}

export interface BetEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  lockDate: string;
  eventDate: string;
  options: EventOption[];
  creatorId: string;
  status: EventStatus;
  winnerOptionId?: string;
  scheduledResultOptionId?: string;
  resultSource?: string;
  resultPhoto?: string;
  totalPot: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
  parentId?: string;
}

export interface Bet {
  id: string;
  userId: string;
  eventId: string;
  optionId: string;
  amount: number;
  createdAt: string;
  payout?: number;
}

export interface LeaderboardEntry {
  userId: string;
  user: User;
  totalWon: number;
  totalBet: number;
  wins: number;
  bets: number;
  roi: number;
}
