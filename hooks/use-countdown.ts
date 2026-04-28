"use client";

import { useEffect, useState } from "react";
import { getTimeLeft } from "@/lib/utils";

export function useCountdown(lockDate: string) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(lockDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(lockDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockDate]);

  return timeLeft;
}
