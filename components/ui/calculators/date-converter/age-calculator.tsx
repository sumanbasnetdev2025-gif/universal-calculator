"use client";
import { useState } from "react";
import { User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { calculateAge, calculateAgeInBS, bsToAD, NEPALI_MONTHS } from "@/lib/nepali-date";

type CalendarType = "AD" | "BS";

export default function AgeCalculator() {
  const [calType,  setCalType]  = useState<CalendarType>("AD");
  const [adDate,   setAdDate]   = useState("");
  const [bsYear,   setBsYear]   = useState("");
  const [bsMonth,  setBsMonth]  = useState("1");
  const [bsDay,    setBsDay]    = useState("");
  const [result,   setResult]   = useState<{ years: number; months: number; days: number; totalDays: number; nextBirthdayDays: number } | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      let age: { years: number; months: number; days: number };
      let birthDate: Date;
      if (calType === "AD") {
        if (!adDate) return setError("Please select your birth date.");
        birthDate = new Date(adDate);
        age = calculateAge(birthDate);
      } else {
        if (!bsYear || !bsDay) return setError("Please fill all BS date fields.");
        age = calculateAgeInBS(parseInt(bsYear), parseInt(bsMonth), parseInt(bsDay));
        birthDate = bsToAD(parseInt(bsYear), parseInt(bsMonth), parseInt(bsDay));
      }
      const totalDays = Math.floor((new Date().getTime() - birthDate.getTime()) / 86400000);
      const nextBirthday = new Date(birthDate);
      nextBirthday.setFullYear(new Date().getFullYear());
      if (nextBirthday < new Date()) nextBirthday.setFullYear(new Date().getFullYear() + 1);
      const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - new Date().getTime()) / 86400000);
      setResult({ ...age, totalDays, nextBirthdayDays });
    } catch { setError("Invalid date. Please check your input."); }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-4 sm:p-6">
        <h2 className="font-display text-base sm:text-lg font-semibold mb-4">Birth Date</h2>

        {/* Toggle */}
        <div className="flex gap-2 mb-4 p-1 bg-secondary rounded-xl">
          {(["AD", "BS"] as CalendarType[]).map((t) => (
            <button key={t} onClick={() => { setCalType(t); setResult(null); setError(null); }}
              className={cn("flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all",
                calType === t ? "bg-white dark:bg-white/10 text-foreground shadow-sm" : "text-muted-foreground")}>
              {t === "AD" ? "🇬🇧 AD" : "🇳🇵 BS (Nepali)"}
            </button>
          ))}
        </div>

        {calType === "AD" ? (
          <div>
            <Label className="text-sm font-medium mb-2 block">Date of Birth (AD)</Label>
            <Input type="date" value={adDate} onChange={(e) => setAdDate(e.target.value)} className="rounded-xl" max={new Date().toISOString().split("T")[0]} />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">BS Year</Label>
              <Input type="number" placeholder="e.g. 2055" value={bsYear} onChange={(e) => setBsYear(e.target.value)} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Month</Label>
                <select value={bsMonth} onChange={(e) => setBsMonth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {NEPALI_MONTHS.map((m, i) => <option key={m} value={i + 1}>{i + 1}. {m}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Day</Label>
                <Input type="number" placeholder="e.g. 15" value={bsDay} onChange={(e) => setBsDay(e.target.value)} min={1} max={32} className="rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>}

        <Button onClick={handleCalculate} className="w-full mt-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
          <User className="w-4 h-4 mr-2" /> Calculate Age
        </Button>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-4 sm:p-6 space-y-4">
          {/* Main age display */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 py-2">
            {[
              { value: result.years,  label: "Years",  big: true  },
              { value: result.months, label: "Months", big: false },
              { value: result.days,   label: "Days",   big: false },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className={cn("font-display font-bold text-foreground", item.big ? "text-5xl sm:text-6xl text-violet-600 dark:text-violet-400" : "text-3xl sm:text-4xl")}>
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[
              { label: "Total Days",       value: result.totalDays.toLocaleString()         },
              { label: "Days to Birthday", value: result.nextBirthdayDays.toString()         },
              { label: "Total Hours",      value: (result.totalDays * 24).toLocaleString()  },
              { label: "Total Weeks",      value: Math.floor(result.totalDays / 7).toLocaleString() },
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
              <CalendarDays className="w-7 h-7 text-violet-400" />
            </div>
            <p className="text-sm text-muted-foreground">Enter your birth date to calculate age</p>
          </div>
        </div>
      )}
    </div>
  );
}