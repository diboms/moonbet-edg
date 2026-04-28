"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  lockDate: string;
  className?: string;
  compact?: boolean;
}

export function CountdownTimer({ lockDate, className, compact = false }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(lockDate);

  if (isExpired) {
    return (
      <span className={cn("text-red-400 text-xs font-bold uppercase tracking-wide", className)}>
        🔒 Paris fermés
      </span>
    );
  }

  if (compact) {
    if (days > 0) return <span className={cn("text-edg-400 text-xs font-bold", className)}>⏰ {days}j {hours}h</span>;
    if (hours > 0) return <span className={cn("text-edg-400 text-xs font-bold", className)}>⏰ {hours}h {minutes}m</span>;
    return <span className={cn("text-edgpink-400 text-xs font-bold animate-pulse", className)}>⚡ {minutes}m {seconds}s</span>;
  }

  const isUrgent = days === 0 && hours < 2;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[
        { value: days, label: "J" },
        { value: hours, label: "H" },
        { value: minutes, label: "M" },
        { value: seconds, label: "S" },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-black tabular-nums border",
              isUrgent
                ? "bg-edgpink-500/10 text-edgpink-400 border-edgpink-500/20"
                : "bg-dark-700 text-zinc-100 border-dark-500"
            )}
          >
            {String(value).padStart(2, "0")}
          </div>
          <span className="text-[9px] text-zinc-600 font-bold mt-0.5 uppercase tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  );
}
