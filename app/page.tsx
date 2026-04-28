"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon, Zap, Trophy, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { AuthForm } from "@/components/auth/auth-form";

export default function HomePage() {
  const { currentUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) router.replace("/dashboard");
  }, [currentUser, router]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* LEFT — Hero branding (EDG style) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 overflow-hidden bg-dark-800">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-60" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-edg-600/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-edgpink-500/15 blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-edgblue-500/15 blur-2xl" />

        <div className="relative z-10 text-center max-w-md">
          {/* EDG Logo mark */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-edg-gradient shadow-2xl glow-edg animate-pulse-glow">
                <Moon className="h-10 w-10 text-white" strokeWidth={2} />
              </div>
              {/* Orbiting dot */}
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-moon-gradient shadow-lg" />
            </div>
          </div>

          <h1 className="text-6xl font-black tracking-tighter mb-3 leading-none">
            <span className="text-white">Moon</span>
            <span className="text-edg-gradient">Bet</span>
          </h1>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-12 bg-edg-gradient" />
            <span className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase">European Digital Group</span>
            <div className="h-px w-12 bg-edg-gradient" />
          </div>

          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            La plateforme de paris internes EDG.<br />
            <span className="text-edg-300">Fun. Fair. Entre collègues.</span>
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Moon, label: "500 Moons", sub: "offerts à l'inscription", color: "text-moon-400" },
              { icon: Zap, label: "Pari Mutuel", sub: "cotes dynamiques", color: "text-edg-400" },
              { icon: Trophy, label: "Palmarès", sub: "classement live", color: "text-edgpink-400" },
              { icon: TrendingUp, label: "+100/semaine", sub: "recharge auto", color: "text-edgblue-400" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="rounded-xl border border-dark-500 bg-dark-700/60 p-3 text-left">
                <Icon className={`h-4 w-4 ${color} mb-2`} />
                <p className="text-sm font-bold text-zinc-200">{label}</p>
                <p className="text-xs text-zinc-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Auth form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 lg:py-0 relative overflow-hidden">
        {/* Mobile background decoration */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-edg-900/30 to-transparent" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-edg-600/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-edg-gradient shadow-xl glow-edg">
              <Moon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">
                <span className="text-white">Moon</span><span className="text-edg-gradient">Bet</span>
              </h1>
              <p className="text-xs text-zinc-500 tracking-widest uppercase">EDG Internal</p>
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-dark-600 bg-dark-800/80 backdrop-blur-sm p-6 shadow-2xl shadow-black/50">
            <AuthForm />
          </div>

          <p className="text-center text-xs text-zinc-600 mt-4">
            © 2026 European Digital Group — Plateforme interne
          </p>
        </div>
      </div>
    </div>
  );
}
