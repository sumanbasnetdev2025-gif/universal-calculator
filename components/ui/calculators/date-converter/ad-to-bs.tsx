"use client";
import { useState } from "react";
import { ArrowLeftRight, Calendar, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { adToBS, bsToAD, NEPALI_MONTHS } from "@/lib/nepali-date";

type Mode = "ad-to-bs" | "bs-to-ad";

export default function ADToBS() {
  const [mode,         setMode]         = useState<Mode>("ad-to-bs");
  const [adDate,       setAdDate]       = useState("");
  const [bsYear,       setBsYear]       = useState("");
  const [bsMonth,      setBsMonth]      = useState("1");
  const [bsDay,        setBsDay]        = useState("");
  const [result,       setResult]       = useState<string | null>(null);
  const [resultDetail, setResultDetail] = useState<string | null>(null);
  const [error,        setError]        = useState<string | null>(null);
  const [copied,       setCopied]       = useState(false);

  const handleConvert = () => {
    setError(null); setResult(null);
    try {
      if (mode === "ad-to-bs") {
        if (!adDate) return setError("Please select an AD date.");
        const bs = adToBS(new Date(adDate));
        setResult(`${bs.year} ${NEPALI_MONTHS[bs.month - 1]} ${bs.day}`);
        setResultDetail(`${bs.year}-${String(bs.month).padStart(2,"0")}-${String(bs.day).padStart(2,"0")} BS`);
      } else {
        if (!bsYear || !bsDay) return setError("Please fill all BS date fields.");
        const ad = bsToAD(parseInt(bsYear), parseInt(bsMonth), parseInt(bsDay));
        setResult(ad.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
        setResultDetail(ad.toISOString().split("T")[0] + " AD");
      }
    } catch { setError("Invalid date. Please check your input."); }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // today
  const today = new Date();
  let bsToday = "";
  try { const bs = adToBS(today); bsToday = `${bs.year} ${NEPALI_MONTHS[bs.month - 1]} ${bs.day}`; } catch {}

  return (
    <div className="space-y-4">
      {/* Today strip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-white/5 rounded-xl border border-border/60 p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1">Today (AD)</p>
          <p className="font-display text-sm sm:text-base font-bold text-foreground">
            {today.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800 p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1">Today (BS)</p>
          <p className="font-display text-sm sm:text-base font-bold text-violet-600 dark:text-violet-400">
            {bsToday}
          </p>
        </div>
      </div>

      {/* Converter */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="font-display text-base sm:text-lg font-semibold">
            {mode === "ad-to-bs" ? "AD → BS" : "BS → AD"}
          </h2>
          <Button variant="outline" size="sm" onClick={() => { setMode(mode === "ad-to-bs" ? "bs-to-ad" : "ad-to-bs"); setResult(null); setError(null); }} className="gap-1.5 rounded-xl text-xs sm:text-sm h-8 sm:h-9">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Swap
          </Button>
        </div>

        {mode === "ad-to-bs" ? (
          <div>
            <Label className="text-sm font-medium mb-2 block">English Date (AD)</Label>
            <Input type="date" value={adDate} onChange={(e) => setAdDate(e.target.value)} className="rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Nepali Year (BS)</Label>
              <Input type="number" placeholder="e.g. 2081" value={bsYear} onChange={(e) => setBsYear(e.target.value)} min={1970} max={2100} className="rounded-xl" />
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

        <Button onClick={handleConvert} className="w-full mt-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
          <Calendar className="w-4 h-4 mr-2" /> Convert Date
        </Button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-4 sm:p-6">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-2">
              {mode === "ad-to-bs" ? "Nepali Date (BS)" : "English Date (AD)"}
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-foreground break-words">{result}</p>
            {resultDetail && <p className="text-sm text-muted-foreground font-mono mt-1">{resultDetail}</p>}
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy} className="w-full rounded-xl gap-2">
            {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Result</>}
          </Button>
        </div>
      )}
    </div>
  );
}