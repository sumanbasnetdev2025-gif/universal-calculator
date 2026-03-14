"use client";
import { useState } from "react";
import { CalendarRange, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { dateDifference } from "@/lib/nepali-date";

export default function DateDifference() {
  const [date1,  setDate1]  = useState("");
  const [date2,  setDate2]  = useState("");
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number; totalWeeks: number; totalHours: number } | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    if (!date1 || !date2) return setError("Please select both dates.");
    const d1 = new Date(date1), d2 = new Date(date2);
    if (d1.getTime() === d2.getTime()) return setError("Both dates are the same.");
    const diff = dateDifference(d1, d2);
    setResult({ ...diff, totalWeeks: Math.floor(diff.totalDays / 7), totalHours: diff.totalDays * 24 });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-4 sm:p-6">
        <h2 className="font-display text-base sm:text-lg font-semibold mb-4">Select Two Dates</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Start Date</Label>
            <Input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="rounded-xl" />
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <ArrowDown className="w-4 h-4 text-violet-500" />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">End Date</Label>
            <Input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="rounded-xl" />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>}
        <Button onClick={handleCalculate} className="w-full mt-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
          <CalendarRange className="w-4 h-4 mr-2" /> Calculate Difference
        </Button>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-4 sm:p-6 space-y-3">
          <div className="bg-white dark:bg-white/10 rounded-xl p-4 text-center">
            <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {result.years > 0 && `${result.years}y `}{result.months > 0 && `${result.months}m `}{result.days}d
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Total Days",  value: result.totalDays.toLocaleString()  },
              { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
              { label: "Total Hours", value: result.totalHours.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-white/10 rounded-xl p-3 text-center">
                <p className="font-display text-lg sm:text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && (
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-3">
              <CalendarRange className="w-7 h-7 text-violet-400" />
            </div>
            <p className="text-sm text-muted-foreground">Select two dates to see the difference</p>
          </div>
        </div>
      )}
    </div>
  );
}