"use client";

import { create } from "zustand";
import { supabase } from "./supabase";
import { Bet, BetEvent, Comment, User } from "./types";
import { calculatePayout } from "./utils";

// ── Mappers Supabase (snake_case) → TypeScript (camelCase) ──

function mapUser(row: any): User {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone ?? "",
    company: row.company,
    avatar: row.avatar ?? "",
    linkedin: row.linkedin,
    balance: row.balance,
    createdAt: row.created_at,
  };
}

function mapEvent(row: any): BetEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    category: row.category,
    lockDate: row.lock_date,
    eventDate: row.event_date,
    creatorId: row.creator_id,
    status: row.status,
    winnerOptionId: row.winner_option_id,
    scheduledResultOptionId: row.scheduled_result_option_id,
    resultSource: row.result_source,
    resultPhoto: row.result_photo,
    totalPot: row.total_pot,
    createdAt: row.created_at,
    options: (row.event_options ?? []).map((o: any) => ({
      id: o.id,
      label: o.label,
      totalBets: o.total_bets,
    })),
  };
}

function mapBet(row: any): Bet {
  return {
    id: row.id,
    userId: row.user_id,
    eventId: row.event_id,
    optionId: row.option_id,
    amount: row.amount,
    payout: row.payout ?? undefined,
    createdAt: row.created_at,
  };
}

// ── Interface du store ──

interface AppState {
  currentUser: User | null;
  users: User[];
  events: BetEvent[];
  bets: Bet[];
  comments: Comment[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Omit<User, "id" | "balance" | "createdAt"> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  createEvent: (data: Omit<BetEvent, "id" | "createdAt" | "status" | "totalPot">) => Promise<BetEvent>;
  resolveEvent: (eventId: string, winnerOptionId: string, resultPhoto?: string) => Promise<void>;
  lockEvent: (eventId: string) => Promise<void>;
  placeBet: (eventId: string, optionId: string, amount: number) => Promise<{ success: boolean; error?: string }>;
  changeBet: (eventId: string, newOptionId: string, newAmount: number) => Promise<{ success: boolean; error?: string }>;
  addComment: (eventId: string, content: string, parentId?: string) => void;
  likeComment: (commentId: string) => void;
}

export const useStore = create<AppState>()((set, get) => ({
  currentUser: null,
  users: [],
  events: [],
  bets: [],
  comments: [],
  hydrated: false,

  // ── Chargement initial depuis Supabase ──
  hydrate: async () => {
    const [usersRes, eventsRes, betsRes] = await Promise.all([
      supabase.from("users").select("*"),
      supabase.from("events").select("*, event_options(*)").order("created_at", { ascending: false }),
      supabase.from("bets").select("*"),
    ]);

    const users = (usersRes.data ?? []).map(mapUser);
    const events = (eventsRes.data ?? []).map(mapEvent);
    const bets = (betsRes.data ?? []).map(mapBet);

    // Restaurer l'utilisateur courant depuis localStorage
    const storedId = typeof window !== "undefined" ? localStorage.getItem("moonbet-user-id") : null;
    const currentUser = storedId ? (users.find((u) => u.id === storedId) ?? null) : null;

    set({ users, events, bets, currentUser, hydrated: true });
  },

  // ── Auth ──
  login: async (email, password) => {
    const { data: row } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!row) return { success: false, error: "Aucun compte trouvé avec cet email." };
    if (row.password !== password) return { success: false, error: "Mot de passe incorrect." };

    const user = mapUser(row);
    if (typeof window !== "undefined") localStorage.setItem("moonbet-user-id", user.id);
    set({ currentUser: user });
    return { success: true };
  },

  register: async (data) => {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", data.email.toLowerCase().trim())
      .maybeSingle();

    if (existing) return { success: false, error: "Un compte existe déjà avec cet email." };

    const newRow = {
      id: `user-${Date.now()}`,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email.toLowerCase().trim(),
      password: (data as any).password,
      phone: data.phone ?? "",
      company: data.company,
      avatar: data.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.firstName}&backgroundColor=b6e3f4`,
      linkedin: data.linkedin ?? "",
      balance: 500,
    };

    const { data: created, error } = await supabase.from("users").insert(newRow).select().single();
    if (error || !created) return { success: false, error: error?.message ?? "Erreur création compte." };

    const user = mapUser(created);
    if (typeof window !== "undefined") localStorage.setItem("moonbet-user-id", user.id);
    set((s) => ({ users: [...s.users, user], currentUser: user }));
    return { success: true };
  },

  logout: () => {
    if (typeof window !== "undefined") localStorage.removeItem("moonbet-user-id");
    set({ currentUser: null });
  },

  updateUser: async (data) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updates: any = {};
    if (data.firstName !== undefined) updates.first_name = data.firstName;
    if (data.lastName !== undefined) updates.last_name = data.lastName;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.company !== undefined) updates.company = data.company;
    if (data.avatar !== undefined) updates.avatar = data.avatar;
    if (data.linkedin !== undefined) updates.linkedin = data.linkedin;
    if (data.balance !== undefined) updates.balance = data.balance;

    await supabase.from("users").update(updates).eq("id", currentUser.id);

    const updated = { ...currentUser, ...data };
    set((s) => ({
      currentUser: updated,
      users: s.users.map((u) => (u.id === updated.id ? updated : u)),
    }));
  },

  // ── Événements ──
  createEvent: async (data) => {
    const eventId = `event-${Date.now()}`;
    const eventRow = {
      id: eventId,
      title: data.title,
      description: data.description,
      category: data.category,
      lock_date: data.lockDate,
      event_date: data.eventDate,
      creator_id: data.creatorId,
      status: "active",
      total_pot: 0,
      scheduled_result_option_id: data.scheduledResultOptionId ?? null,
      result_source: data.resultSource ?? null,
    };

    const { data: created, error } = await supabase.from("events").insert(eventRow).select().single();
    if (error || !created) throw new Error(error?.message ?? "Erreur création événement.");

    await supabase.from("event_options").insert(
      data.options.map((opt) => ({
        id: opt.id,
        event_id: eventId,
        label: opt.label,
        total_bets: 0,
      }))
    );

    const newEvent: BetEvent = { ...mapEvent(created), options: data.options.map((o) => ({ ...o, totalBets: 0 })) };
    set((s) => ({ events: [newEvent, ...s.events] }));
    return newEvent;
  },

  resolveEvent: async (eventId, winnerOptionId, resultPhoto) => {
    const state = get();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return;

    const winnerOption = event.options.find((o) => o.id === winnerOptionId);
    if (!winnerOption) return;

    // Calcule les gains
    const eventBets = state.bets.filter((b) => b.eventId === eventId);
    const payoutsByBet: { id: string; payout: number }[] = eventBets.map((bet) => ({
      id: bet.id,
      payout: bet.optionId === winnerOptionId
        ? calculatePayout(bet.amount, winnerOption.totalBets, event.totalPot)
        : 0,
    }));

    // Aggrege les gains par user
    const payoutsByUser = new Map<string, number>();
    for (const bet of eventBets) {
      if (bet.optionId === winnerOptionId) {
        const payout = calculatePayout(bet.amount, winnerOption.totalBets, event.totalPot);
        payoutsByUser.set(bet.userId, (payoutsByUser.get(bet.userId) ?? 0) + payout);
      }
    }

    // Mise à jour Supabase
    await supabase.from("events").update({
      status: "resolved",
      winner_option_id: winnerOptionId,
      ...(resultPhoto ? { result_photo: resultPhoto } : {}),
    }).eq("id", eventId);

    for (const { id, payout } of payoutsByBet) {
      await supabase.from("bets").update({ payout }).eq("id", id);
    }

    for (const [userId, payout] of payoutsByUser) {
      const user = state.users.find((u) => u.id === userId);
      if (user) {
        await supabase.from("users").update({ balance: Math.round(user.balance + payout) }).eq("id", userId);
      }
    }

    // Mise à jour locale
    const updatedUsers = state.users.map((u) => {
      const payout = payoutsByUser.get(u.id);
      return payout ? { ...u, balance: Math.round(u.balance + payout) } : u;
    });
    const updatedCurrentUser = state.currentUser
      ? updatedUsers.find((u) => u.id === state.currentUser!.id) ?? state.currentUser
      : null;

    set({
      events: state.events.map((e) =>
        e.id === eventId ? { ...e, status: "resolved", winnerOptionId, ...(resultPhoto ? { resultPhoto } : {}) } : e
      ),
      bets: state.bets.map((b) => {
        const found = payoutsByBet.find((p) => p.id === b.id);
        return found ? { ...b, payout: found.payout } : b;
      }),
      users: updatedUsers,
      currentUser: updatedCurrentUser,
    });
  },

  lockEvent: async (eventId) => {
    await supabase.from("events").update({ status: "locked" }).eq("id", eventId);
    set((s) => ({
      events: s.events.map((e) => (e.id === eventId ? { ...e, status: "locked" } : e)),
    }));
  },

  // ── Paris ──
  placeBet: async (eventId, optionId, amount) => {
    const state = get();
    if (!state.currentUser) return { success: false, error: "Non connecté." };

    const event = state.events.find((e) => e.id === eventId);
    if (!event) return { success: false, error: "Événement introuvable." };
    if (event.status !== "active") return { success: false, error: "Les paris sont fermés." };
    if (new Date(event.lockDate) < new Date()) return { success: false, error: "La date limite est passée." };

    const existingBet = state.bets.find((b) => b.userId === state.currentUser!.id && b.eventId === eventId);
    if (existingBet) return { success: false, error: "Tu as déjà parié sur cet événement." };

    if (state.currentUser.balance < amount) return { success: false, error: "Solde insuffisant." };
    if (amount < 10) return { success: false, error: "Mise minimum : 10 Moons." };

    const option = event.options.find((o) => o.id === optionId);
    if (!option) return { success: false, error: "Option introuvable." };

    const newBetRow = {
      id: `bet-${Date.now()}`,
      user_id: state.currentUser.id,
      event_id: eventId,
      option_id: optionId,
      amount,
    };

    const { error } = await supabase.from("bets").insert(newBetRow);
    if (error) return { success: false, error: error.message };

    const newBalance = state.currentUser.balance - amount;
    await Promise.all([
      supabase.from("event_options").update({ total_bets: option.totalBets + amount }).eq("id", optionId),
      supabase.from("events").update({ total_pot: event.totalPot + amount }).eq("id", eventId),
      supabase.from("users").update({ balance: newBalance }).eq("id", state.currentUser.id),
    ]);

    const newBet: Bet = { id: newBetRow.id, userId: state.currentUser.id, eventId, optionId, amount, createdAt: new Date().toISOString() };
    const updatedUser = { ...state.currentUser, balance: newBalance };

    set((s) => ({
      bets: [...s.bets, newBet],
      currentUser: updatedUser,
      users: s.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      events: s.events.map((e) =>
        e.id !== eventId ? e : {
          ...e,
          totalPot: e.totalPot + amount,
          options: e.options.map((o) => o.id === optionId ? { ...o, totalBets: o.totalBets + amount } : o),
        }
      ),
    }));

    return { success: true };
  },

  changeBet: async (eventId, newOptionId, newAmount) => {
    const state = get();
    if (!state.currentUser) return { success: false, error: "Non connecté." };

    const event = state.events.find((e) => e.id === eventId);
    if (!event) return { success: false, error: "Événement introuvable." };
    if (event.status !== "active") return { success: false, error: "Les paris sont fermés." };
    if (new Date(event.lockDate) < new Date()) return { success: false, error: "La date limite est passée." };
    if (newAmount < 10) return { success: false, error: "Mise minimum : 10 Moons." };

    const existingBet = state.bets.find((b) => b.userId === state.currentUser!.id && b.eventId === eventId);
    if (!existingBet) return { success: false, error: "Aucun pari à modifier." };

    const availableBalance = state.currentUser.balance + existingBet.amount;
    if (availableBalance < newAmount) return { success: false, error: "Solde insuffisant." };

    const newBalance = availableBalance - newAmount;

    // Update bets
    await supabase.from("bets").update({ option_id: newOptionId, amount: newAmount }).eq("id", existingBet.id);

    // Update option totalBets
    const updates: Promise<any>[] = [];
    if (existingBet.optionId !== newOptionId) {
      const oldOption = event.options.find((o) => o.id === existingBet.optionId);
      const newOption = event.options.find((o) => o.id === newOptionId);
      if (oldOption) updates.push(supabase.from("event_options").update({ total_bets: oldOption.totalBets - existingBet.amount }).eq("id", existingBet.optionId));
      if (newOption) updates.push(supabase.from("event_options").update({ total_bets: newOption.totalBets + newAmount }).eq("id", newOptionId));
    } else {
      const opt = event.options.find((o) => o.id === newOptionId);
      if (opt) updates.push(supabase.from("event_options").update({ total_bets: opt.totalBets - existingBet.amount + newAmount }).eq("id", newOptionId));
    }

    const newTotalPot = event.totalPot - existingBet.amount + newAmount;
    updates.push(supabase.from("events").update({ total_pot: newTotalPot }).eq("id", eventId));
    updates.push(supabase.from("users").update({ balance: newBalance }).eq("id", state.currentUser.id));

    await Promise.all(updates);

    const updatedUser = { ...state.currentUser, balance: newBalance };
    const updatedBet = { ...existingBet, optionId: newOptionId, amount: newAmount };

    set((s) => ({
      bets: s.bets.map((b) => (b.id === existingBet.id ? updatedBet : b)),
      currentUser: updatedUser,
      users: s.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      events: s.events.map((e) =>
        e.id !== eventId ? e : {
          ...e,
          totalPot: newTotalPot,
          options: e.options.map((o) => {
            if (existingBet.optionId !== newOptionId) {
              if (o.id === existingBet.optionId) return { ...o, totalBets: o.totalBets - existingBet.amount };
              if (o.id === newOptionId) return { ...o, totalBets: o.totalBets + newAmount };
            } else if (o.id === newOptionId) {
              return { ...o, totalBets: o.totalBets - existingBet.amount + newAmount };
            }
            return o;
          }),
        }
      ),
    }));

    return { success: true };
  },

  // ── Commentaires (en mémoire) ──
  addComment: (eventId, content, parentId) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      eventId,
      userId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
      likes: [],
      parentId,
    };
    set((s) => ({ comments: [...s.comments, newComment] }));
  },

  likeComment: (commentId) => {
    const { currentUser } = get();
    if (!currentUser) return;
    set((s) => ({
      comments: s.comments.map((c) => {
        if (c.id !== commentId) return c;
        const hasLiked = c.likes.includes(currentUser.id);
        return {
          ...c,
          likes: hasLiked
            ? c.likes.filter((id) => id !== currentUser.id)
            : [...c.likes, currentUser.id],
        };
      }),
    }));
  },
}));
