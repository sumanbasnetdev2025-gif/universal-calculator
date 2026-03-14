"use client";
import { useState, useEffect, useRef } from "react";
import { Timer, Copy, Check, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimeDiffResult {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalYears: number;
  isPast: boolean;
}

function calcDiff(from: Date, to: Date): TimeDiffResult {
  const isPast       = to < from;
  const [start, end] = isPast ? [to, from] : [from, to];
  const totalMs      = end.getTime() - start.getTime();

  let years  = end.getFullYear() - start.getFullYear();
  let months = end.getMonth()    - start.getMonth();
  let days   = end.getDate()     - start.getDate();
  let hours  = end.getHours()    - start.getHours();
  let mins   = end.getMinutes()  - start.getMinutes();
  let secs   = end.getSeconds()  - start.getSeconds();

  if (secs  < 0) { mins--;  secs  += 60; }
  if (mins  < 0) { hours--; mins  += 60; }
  if (hours < 0) { days--;  hours += 24; }
  if (days  < 0) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalDays   = Math.floor(totalMs / 86400000);
  const totalWeeks  = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalYears  = parseFloat((totalDays / 365.25).toFixed(2));

  return {
    years, months, weeks: Math.floor(days / 7),
    days, hours, minutes: mins, seconds: secs,
    totalDays, totalWeeks, totalMonths, totalYears,
    isPast,
  };
}

export default function TimeDifference() {
  const toLocal = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const now = new Date();
  const [date1,  setDate1]  = useState(now.toISOString().split("T")[0]);
  const [time1,  setTime1]  = useState("12:00");
  const [date2,  setDate2]  = useState(now.toISOString().split("T")[0]);
  const [time2,  setTime2]  = useState("12:00");
  const [result, setResult] = useState<TimeDiffResult | null>(null);
  const [error,  setError]  = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [live,   setLive]   = useState(false);
  const intervalRef         = useRef<NodeJS.Timeout | null>(null);

  const calculate = (
    d1 = date1, t1 = time1,
    d2 = date2, t2 = time2
  ) => {
    setError(null);
    if (!d1 || !d2) return setError("Please select both dates.");
    const dA = new Date(`${d1}T${t1 || "00:00"}`);
    const dB = new Date(`${d2}T${t2 || "00:00"}`);
    if (isNaN(dA.getTime()) || isNaN(dB.getTime()))
      return setError("Invalid date or time.");
    if (dA.getTime() === dB.getTime())
      return setError("Both date-times are identical.");
    setResult(calcDiff(dA, dB));
  };

  const toggleLive = () => {
    if (live) {
      clearInterval(intervalRef.current!);
      setLive(false);
    } else {
      setLive(true);
      const tick = () => {
        const n = new Date();
        const d = n.toISOString().split("T")[0];
        const t = n.toTimeString().slice(0, 5);
        setDate2(d); setTime2(t);
        calculate(date1, time1, d, t);
      };
      tick();
      intervalRef.current = setInterval(tick, 1000);
    }
  };

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (live) {
      const n = new Date();
      calculate(date1, time1,
        n.toISOString().split("T")[0],
        n.toTimeString().slice(0, 5));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date2, time2]);

  const setNowA = () => {
    const n = new Date();
    setDate1(n.toISOString().split("T")[0]);
    setTime1(n.toTimeString().slice(0, 5));
    setResult(null);
  };
  const setNowB = () => {
    const n = new Date();
    setDate2(n.toISOString().split("T")[0]);
    setTime2(n.toTimeString().slice(0, 5));
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    const text =
      `TIME DIFFERENCE RESULT\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `${result.days} Days  ${result.hours} Hours  ${result.minutes} Minutes  ${result.seconds} Seconds\n\n` +
      `SUMMARY\n` +
      `Total Days   : ${result.totalDays.toLocaleString()}\n` +
      `Total Weeks  : ${result.totalWeeks.toLocaleString()}\n` +
      `Total Months : ${result.totalMonths.toLocaleString()}\n` +
      `Total Years  : ${result.totalYears}\n` +
      `Direction    : ${result.isPast ? "In the Past" : "In the Future"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">

      {/* ── Input card ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-4 sm:p-6">

        {/* Title row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <Timer className="w-3.5 h-3.5 text-violet-500" />
            </div>
            <h2 className="font-display text-base sm:text-lg font-semibold">
              Date Difference Calculator
            </h2>
          </div>
          <button
            onClick={toggleLive}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
              live
                ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/25"
                : "bg-secondary text-muted-foreground border-border hover:border-violet-400 hover:text-violet-500"
            )}
          >
            {live
              ? <><Square className="w-3 h-3 fill-white" />Stop Live</>
              : <><Play   className="w-3 h-3" />Live</>}
          </button>
        </div>

        {/* Date-time inputs — 2 col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Start */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-sm font-semibold text-foreground">Start Date</Label>
                <button onClick={setNowA}
                  className="text-xs text-violet-500 hover:text-violet-600 font-medium">
                  Now
                </button>
              </div>
              <Input
                type="date"
                value={date1}
                onChange={(e) => { setDate1(e.target.value); setResult(null); }}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-foreground mb-1.5 block">
                Start Time
              </Label>
              <Input
                type="time"
                value={time1}
                onChange={(e) => { setTime1(e.target.value); setResult(null); }}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* End */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-sm font-semibold text-foreground">End Date</Label>
                {!live && (
                  <button onClick={setNowB}
                    className="text-xs text-violet-500 hover:text-violet-600 font-medium">
                    Now
                  </button>
                )}
                {live && (
                  <span className="text-xs text-red-500 font-semibold animate-pulse">
                    ● Live
                  </span>
                )}
              </div>
              <Input
                type="date"
                value={date2}
                onChange={(e) => { setDate2(e.target.value); if (!live) setResult(null); }}
                disabled={live}
                className={cn("rounded-xl", live && "opacity-50 cursor-not-allowed")}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-foreground mb-1.5 block">
                End Time
              </Label>
              <Input
                type="time"
                value={time2}
                onChange={(e) => { setTime2(e.target.value); if (!live) setResult(null); }}
                disabled={live}
                className={cn("rounded-xl", live && "opacity-50 cursor-not-allowed")}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {!live && (
          <Button
            onClick={() => calculate()}
            className="mt-5 w-full sm:w-auto rounded-xl bg-foreground hover:bg-foreground/90 text-background font-semibold px-8 gap-2"
          >
            Calculate Difference
            <span className="text-base">→</span>
          </Button>
        )}
      </div>

      {/* ── Result ─────────────────────────────────────────────── */}
      {result && (
        <div className="rounded-2xl overflow-hidden border border-border/60 shadow-sm">

          {/* Gradient banner */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest">
                Time Difference
              </p>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full",
                  result.isPast
                    ? "bg-white/20 text-white"
                    : "bg-white/20 text-white"
                )}>
                  {result.isPast ? "⏮ Past" : "⏭ Future"}
                </span>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                    copied
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  )}
                >
                  {copied
                    ? <><Check className="w-3.5 h-3.5" />Copied!</>
                    : <><Copy  className="w-3.5 h-3.5" />Copy</>}
                </button>
              </div>
            </div>

            {/* Main 4 units */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { label: "Days",    value: result.totalDays },
                { label: "Hours",   value: result.hours     },
                { label: "Minutes", value: result.minutes   },
                { label: "Seconds", value: result.seconds   },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tabular-nums leading-none">
                    {item.value.toLocaleString()}
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm mt-1.5 font-medium">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stat cards below */}
          <div className="bg-white dark:bg-white/5 p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "TOTAL DAYS",   value: result.totalDays,   accent: "border-l-teal-500"   },
                { label: "WEEKS",        value: result.totalWeeks,  accent: "border-l-blue-500"   },
                { label: "MONTHS",       value: result.totalMonths, accent: "border-l-violet-500" },
                { label: "YEARS",        value: result.totalYears,  accent: "border-l-green-500"  },
              ].map((s) => (
                <div
                  key={s.label}
                  className={cn(
                    "bg-secondary/50 dark:bg-white/5 rounded-xl p-3 sm:p-4 border-l-4",
                    s.accent
                  )}
                >
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                    {s.label}
                  </p>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {typeof s.value === "number"
                      ? s.value.toLocaleString()
                      : s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Breakdown row */}
            <div className="mt-3 bg-secondary/30 dark:bg-white/5 rounded-xl px-4 py-3 flex flex-wrap gap-x-4 gap-y-1">
              {[
                { label: "Years",   value: result.years   },
                { label: "Months",  value: result.months  },
                { label: "Days",    value: result.days    },
                { label: "Hours",   value: result.hours   },
                { label: "Minutes", value: result.minutes },
                { label: "Seconds", value: result.seconds },
              ].map((item, i) => (
                <span key={item.label} className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{item.value}</span>
                  {" "}{item.label}
                  {i < 5 && <span className="ml-4 text-border">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !error && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Timer className="w-7 h-7 text-violet-400" />
          </div>
          <p className="text-sm font-medium text-foreground">No calculation yet</p>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Select start and end date & time, then click Calculate Difference
          </p>
        </div>
      )}
    </div>
  );
}