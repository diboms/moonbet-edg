"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useStore((s) => s.hydrate);
  const hydrated = useStore((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl animate-bounce">🌙</div>
          <p className="text-zinc-500 text-sm font-semibold uppercase tracking-widest">Chargement...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
