"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { EventCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventCard } from "@/components/events/event-card";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: EventCategory | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "🏓 Padel", value: "padel" },
  { label: "💼 Bureau", value: "bureau" },
  { label: "🎲 Autre", value: "autre" },
];

export default function EventsPage() {
  const router = useRouter();
  const { currentUser, events } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EventCategory | "all">("all");

  useEffect(() => {
    if (!currentUser) router.replace("/");
  }, [currentUser, router]);

  if (!currentUser) return null;

  const activeEvents = events.filter((e) => e.status === "active" || e.status === "locked");
  const filtered = activeEvents.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Live</p>
          <h1 className="text-2xl font-black text-zinc-100">⚡ Paris en cours</h1>
          <p className="text-zinc-600 text-xs mt-0.5">{activeEvents.length} événement{activeEvents.length > 1 ? "s" : ""} actif{activeEvents.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/events/create">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Créer
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
        <Input placeholder="Rechercher un pari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTERS.map(({ label, value }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all border uppercase tracking-wide",
              filter === value
                ? "bg-edg-gradient text-white border-transparent shadow-lg shadow-edg-500/20"
                : "bg-dark-700 text-zinc-500 border-dark-500 hover:border-dark-400 hover:text-zinc-300"
            )}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-zinc-400 font-bold uppercase tracking-wide text-sm">Aucun pari trouvé</p>
          <p className="text-zinc-600 text-xs mt-1">Sois le premier à en créer un !</p>
          <Link href="/events/create">
            <Button className="mt-4" size="sm"><Plus className="h-4 w-4 mr-1.5" />Créer un pari</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
