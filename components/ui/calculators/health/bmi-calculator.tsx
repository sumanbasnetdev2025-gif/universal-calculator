"use client";
import { useState } from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const BMI_CATEGORIES = [
  { max: 18.5, label: "Underweight",   color: "text-blue-500",   bg: "bg-blue-500"   },
  { max: 25.0, label: "Normal weight", color: "text-green-500",  bg: "bg-green-500"  },
  { max: 30.0, label: "Overweight",    color: "text-yellow-500", bg: "bg-yellow-500" },
  { max: 35.0, label: "Obese I",       color: "text-orange-500", bg: "bg-orange-500" },
  { max: Infinity, label: "Obese II+", color: "text-red-500",    bg: "bg-red-500"    },
];

type UnitSystem = "metric" | "imperial";

export default function BMICalculator() {
  const [system,   setSystem]   = useState<UnitSystem>("metric");
  const [weight,   setWeight]   = useState("");
  const [height,   setHeight]   = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result,   setResult]   = useState<any>(null);
  const [error,    setError]    = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    let weightKg = parseFloat(weight), heightM: number;
    if (system === "metric") {
      heightM = parseFloat(height) / 100;
    } else {
      heightM = ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 0.0254;
      weightKg = weightKg * 0.453592;
    }
    if (!weightKg || weightKg <= 0) return setError("Enter a valid weight.");
    if (!heightM  || heightM  <= 0) return setError("Enter a valid height.");
    const bmi = weightKg / (heightM * heightM);
    const cat = BMI_CATEGORIES.find((c) => bmi < c.max)!;
    const healthyMin = parseFloat((18.5 * heightM * heightM).toFixed(1));
    const healthyMax = parseFloat((24.9 * heightM * heightM).toFixed(1));
    setResult({ bmi: parseFloat(bmi.toFixed(1)), ...cat, healthyMin, healthyMax });
  };

  const bmiPercent = result ? Math.min(100, Math.max(0, ((result.bmi - 10) / 35) * 100)) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-4 sm:p-6">
        <h2 className="font-display text-base sm:text-lg font-semibold mb-4">Your Measurements</h2>

        <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-4">
          {(["metric", "imperial"] as UnitSystem[]).map((s) => (
            <button key={s} onClick={() => { setSystem(s); setResult(null); setError(null); }}
              className={cn("flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all",
                system === s ? "bg-white dark:bg-white/10 text-foreground shadow-sm" : "text-muted-foreground")}>
              {s === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Weight ({system === "metric" ? "kg" : "lbs"})</Label>
            <Input type="number" placeholder={system === "metric" ? "e.g. 70" : "e.g. 154"} value={weight} onChange={(e) => setWeight(e.target.value)} className="rounded-xl" min={1} step="0.1" />
          </div>
          {system === "metric" ? (
            <div>
              <Label className="text-sm font-medium mb-2 block">Height (cm)</Label>
              <Input type="number" placeholder="e.g. 170" value={height} onChange={(e) => setHeight(e.target.value)} className="rounded-xl" />
            </div>
          ) : (
            <div>
              <Label className="text-sm font-medium mb-2 block">Height</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Input type="number" placeholder="5" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="rounded-xl pr-8" min={1} max={8} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ft</span>
                </div>
                <div className="relative">
                  <Input type="number" placeholder="7" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="rounded-xl pr-8" min={0} max={11} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">in</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>}

        <Button onClick={handleCalculate} className="w-full mt-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
          <Activity className="w-4 h-4 mr-2" /> Calculate BMI
        </Button>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-4 sm:p-6 space-y-4">
          {/* Score */}
          <div className="text-center py-2">
            <p className="font-display text-6xl sm:text-7xl font-bold text-foreground">{result.bmi}</p>
            <p className={cn("text-base sm:text-lg font-semibold mt-2", result.color)}>{result.label}</p>
          </div>

          {/* Scale */}
          <div className="bg-white dark:bg-white/10 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">BMI Scale</p>
            <div className="relative h-4 rounded-full overflow-hidden flex">
              <div className="flex-1 bg-blue-400" /><div className="flex-1 bg-green-400" />
              <div className="flex-1 bg-yellow-400" /><div className="flex-1 bg-orange-400" />
              <div className="flex-1 bg-red-500" />
            </div>
            <div className="relative h-3 mt-0.5">
              <div className="absolute w-3 h-3 bg-foreground rounded-full top-0 transition-all" style={{ left: `calc(${bmiPercent}% - 6px)` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
            </div>
          </div>

          {/* Healthy range */}
          <div className="bg-white dark:bg-white/10 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Healthy Weight Range</p>
            <p className="font-display text-lg sm:text-xl font-bold text-foreground">{result.healthyMin} – {result.healthyMax} kg</p>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-white/10 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
            <div className="space-y-1.5">
              {[
                { range: "< 18.5",    label: "Underweight",   color: "text-blue-500"   },
                { range: "18.5–24.9", label: "Normal weight", color: "text-green-500"  },
                { range: "25–29.9",   label: "Overweight",    color: "text-yellow-500" },
                { range: "≥ 30",      label: "Obese",         color: "text-red-500"    },
              ].map((c) => (
                <div key={c.label} className="flex justify-between text-xs">
                  <span className="font-mono text-muted-foreground">{c.range}</span>
                  <span className={cn("font-medium", c.color)}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-7 h-7 text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground">Enter your measurements to calculate BMI</p>
          </div>
        </div>
      )}
    </div>
  );
}