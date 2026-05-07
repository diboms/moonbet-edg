"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, User as UserIcon, X, UserPlus } from "lucide-react";
import { User } from "@/lib/types";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Format des IDs invités : "guest:Nom Prénom"
export const GUEST_PREFIX = "guest:";
export const isGuestId = (id: string) => id.startsWith(GUEST_PREFIX);
export const guestName = (id: string) => id.slice(GUEST_PREFIX.length);

interface PlayerSelectProps {
  users: User[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxPlayers?: number;
  excludeIds?: string[];
  placeholder?: string;
}

export function PlayerSelect({
  users,
  selectedIds,
  onChange,
  maxPlayers = 2,
  excludeIds = [],
  placeholder = "Sélectionner des joueurs…",
}: PlayerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = users
    .filter((u) => !excludeIds.includes(u.id))
    .filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const toggleUser = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else if (selectedIds.length < maxPlayers) {
      onChange([...selectedIds, userId]);
    }
  };

  const addGuest = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    const guestId = `${GUEST_PREFIX}${trimmed}`;
    if (selectedIds.includes(guestId)) return;
    if (selectedIds.length >= maxPlayers) return;
    onChange([...selectedIds, guestId]);
    setSearch("");
  };

  // Affichage des joueurs sélectionnés (mix users et guests)
  const selectedDisplay = selectedIds.map((id) => {
    if (isGuestId(id)) {
      return { id, isGuest: true, name: guestName(id), user: null };
    }
    const user = users.find((u) => u.id === id);
    return { id, isGuest: false, name: user ? `${user.firstName} ${user.lastName[0]}.` : "?", user };
  });

  // Vérifier si le terme cherché correspond à un joueur existant
  const exactMatch = filtered.some((u) => `${u.firstName} ${u.lastName}`.toLowerCase() === search.toLowerCase());
  const showGuestOption = search.trim().length > 1 && !exactMatch && selectedIds.length < maxPlayers;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border bg-dark-700 px-3 py-2.5 text-sm transition-all min-h-[3rem]",
          open ? "border-edg-500/60 ring-2 ring-edg-500/20" : "border-dark-500 hover:border-dark-400"
        )}
      >
        <UserIcon className="h-4 w-4 text-zinc-600 shrink-0" />
        <div className="flex-1 flex items-center gap-1.5 flex-wrap text-left">
          {selectedDisplay.length === 0 ? (
            <span className="text-zinc-600">{placeholder}</span>
          ) : (
            selectedDisplay.map((p) => (
              <span
                key={p.id}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                  p.isGuest
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                    : "bg-edg-500/15 border border-edg-500/30 text-edg-300"
                )}
              >
                {p.isGuest ? (
                  <UserPlus className="h-3 w-3" />
                ) : p.user ? (
                  <Avatar className="h-4 w-4 border border-edg-500/30">
                    <AvatarImage src={p.user.avatar} />
                    <AvatarFallback className="text-[7px] bg-edg-gradient text-white">
                      {getInitials(p.user.firstName, p.user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                {p.name}
                <X
                  className="h-3 w-3 hover:text-red-400 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedIds.filter((id) => id !== p.id));
                  }}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-zinc-600 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-dark-500 bg-dark-800 shadow-xl shadow-black/40 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-dark-600 px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && showGuestOption) {
                  e.preventDefault();
                  addGuest();
                }
              }}
              placeholder="Rechercher ou ajouter un joueur…"
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
            />
          </div>

          {showGuestOption && (
            <button
              type="button"
              onClick={addGuest}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors text-left border-b border-dark-600"
            >
              <UserPlus className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Ajouter "<strong>{search.trim()}</strong>" comme invité
              </span>
            </button>
          )}

          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && !showGuestOption ? (
              <p className="py-6 text-center text-xs text-zinc-600">Aucun joueur — tape un nom pour l'ajouter en invité</p>
            ) : filtered.length === 0 ? null : (
              filtered.map((u) => {
                const isSelected = selectedIds.includes(u.id);
                const disabled = !isSelected && selectedIds.length >= maxPlayers;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleUser(u.id)}
                    disabled={disabled}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors text-left",
                      isSelected ? "bg-edg-500/10 text-edg-300" : "text-zinc-300 hover:bg-dark-700",
                      disabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <Check className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "text-edg-400" : "invisible")} />
                    <Avatar className="h-6 w-6 border border-dark-600">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="text-[9px] bg-edg-gradient text-white font-bold">
                        {getInitials(u.firstName, u.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate">{u.firstName} {u.lastName}</span>
                    <span className="text-[10px] text-zinc-600 truncate">{u.company}</span>
                  </button>
                );
              })
            )}
          </div>

          {selectedIds.length >= maxPlayers && (
            <div className="border-t border-dark-600 px-3 py-2 text-[10px] text-zinc-600 text-center">
              Maximum {maxPlayers} joueurs atteint
            </div>
          )}
        </div>
      )}
    </div>
  );
}
