"use client";
import { useState } from "react";
import { Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, nepaliNumberFormat } from "@/lib/utils";

interface SalaryResult { hourly: number; daily: number; weekly: number; monthly: number; annual: number; }

export default function HourlyToSalary() {
  const [hourlyRate,  setHourlyRate]  = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [result,      setResult]      = useState<SalaryResult | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const rate = parseFloat(hourlyRate), hours = parseFloat(hoursPerDay), days = parseFloat(daysPerWeek);
    if (!rate || rate <= 0)           return setError("Please enter a valid hourly rate.");
    if (!hours || hours <= 0 || hours > 24) return setError("Hours per day must be 1–24.");
    if (!days  || days  <= 0 || days  > 7)  return setError("Days per week must be 1–7.");
    const daily = rate * hours, weekly = daily * days;
    setResult({ hourly: rate, daily, weekly, monthly: weekly * (52 / 12), annual: weekly * 52 });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-4 sm:p-6">
        <h2 className="font-display text-base sm:text-lg font-semibold mb-4">Hourly Rate Details</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Hourly Rate (NPR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">Rs.</span>
              <Input type="number" placeholder="e.g. 500" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="rounded-xl pl-10" min={0} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Hours / Day</Label>
              <Input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} className="rounded-xl" min={1} max={24} />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Days / Week</Label>
              <Input type="number" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className="rounded-xl" min={1} max={7} />
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Quick presets</p>
            <div className="flex flex-wrap gap-2">
              {[{ label: "Full-time", hours: "8", days: "5" }, { label: "Part-time", hours: "4", days: "5" }, { label: "6-day", hours: "8", days: "6" }].map((p) => (
                <button key={p.label} onClick={() => { setHoursPerDay(p.hours); setDaysPerWeek(p.days); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>}

        <Button onClick={handleCalculate} className="w-full mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white">
          <Clock className="w-4 h-4 mr-2" /> Calculate Salary
        </Button>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-4 sm:p-6 space-y-2">
          {[
            { label: "Hourly",  value: result.hourly,  highlight: false },
            { label: "Daily",   value: result.daily,   highlight: false },
            { label: "Weekly",  value: result.weekly,  highlight: false },
            { label: "Monthly", value: result.monthly, highlight: true  },
            { label: "Annual",  value: result.annual,  highlight: true  },
          ].map((row) => (
            <div key={row.label} className={cn("flex items-center justify-between rounded-xl px-4 py-3", row.highlight ? "bg-emerald-500 text-white" : "bg-white dark:bg-white/10")}>
              <span className={cn("text-sm font-medium", row.highlight ? "text-white" : "text-muted-foreground")}>{row.label}</span>
              <span className={cn("font-display text-base sm:text-lg font-bold font-mono", row.highlight ? "text-white" : "text-foreground")}>
                Rs. {nepaliNumberFormat(row.value)}
              </span>
            </div>
          ))}
          <div className="bg-white dark:bg-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs text-muted-foreground">{hoursPerDay}hrs/day × {daysPerWeek}days/week</span>
          </div>
        </div>
      )}
    </div>
  );
}