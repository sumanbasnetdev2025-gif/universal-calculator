"use client";
import { useState, useEffect } from "react";
import { adToBS } from "@/lib/nepali-date";

export function useNepaliDate() {
  const [todayBS, setTodayBS] = useState<{ year: number; month: number; day: number; formatted: string } | null>(null);
  const [todayAD, setTodayAD] = useState<Date | null>(null);

  useEffect(() => {
    const today = new Date();
    setTodayAD(today);
    try {
      setTodayBS(adToBS(today));
    } catch {
      setTodayBS(null);
    }
  }, []);

  return { todayBS, todayAD };
}