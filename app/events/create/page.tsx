"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/events/event-form";

export default function CreateEventPage() {
  const router = useRouter();
  const { currentUser } = useStore();

  useEffect(() => {
    if (!currentUser) router.replace("/");
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-black text-zinc-100">🎯 Créer un événement</h1>
          <p className="text-zinc-500 text-xs">Définit les règles, tout le monde parie !</p>
        </div>
      </div>

      <EventForm />
    </div>
  );
}
