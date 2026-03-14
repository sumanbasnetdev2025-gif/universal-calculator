"use client";
import { useState } from "react";
import { Percent } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CalcMode =
  | "percent-of"
  | "what-percent"
  | "percent-change"
  | "add-percent"
  | "subtract-percent"
  | "marks";

const MODES: { key: CalcMode; label: string; desc: string }[] = [
  { key: "percent-of",      label: "% of Number",      desc: "X% of Y = ?"         },
  { key: "what-percent",    label: "What % is X of Y", desc: "X is what % of Y"     },
  { key: "percent-change",  label: "% Change",         desc: "Old → New % change"   },
  { key: "add-percent",     label: "Add %",            desc: "Y + X% = ?"           },
  { key: "subtract-percent",label: "Subtract %",       desc: "Y − X% = ?"           },
  { key: "marks",           label: "Marks / CGPA",     desc: "Score to percentage"  },
];

function calcResult(mode: CalcMode, a: number, b: number, c = 0): string {
  switch (mode) {
    case "percent-of":       return `${((a / 100) * b).toFixed(4).replace(/\.?0+$/, "")}`;
    case "what-percent":     return `${((a / b) * 100).toFixed(4).replace(/\.?0+$/, "")}%`;
    case "percent-change":   return `${(((b - a) / a) * 100).toFixed(4).replace(/\.?0+$/, "")}%`;
    case "add-percent":      return `${(b + (b * a) / 100).toFixed(4).replace(/\.?0+$/, "")}`;
    case "subtract-percent": return `${(b - (b * a) / 100).toFixed(4).replace(/\.?0+$/, "")}`;
    case "marks":            return `${((a / b) * 100).toFixed(2)}%`;
    default: return "";
  }
}

export default function PercentageCalc() {
  const [mode,   setMode]   = useState<CalcMode>("percent-of");
  const [valA,   setValA]   = useState("");
  const [valB,   setValB]   = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleCalc = () => {
    const a = parseFloat(valA);
    const b = parseFloat(valB);
    if (isNaN(a) || isNaN(b) || b === 0) { setResult(null); return; }
    setResult(calcResult(mode, a, b));
  };

  const getLabels = (): [string, string, string] => {
    switch (mode) {
      case "percent-of":       return ["Percentage (%)", "Number",          "Result"];
      case "what-percent":     return ["Value (X)",      "Total (Y)",       "X is ?% of Y"];
      case "percent-change":   return ["Old Value",      "New Value",       "% Change"];
      case "add-percent":      return ["Percentage (%)", "Number",          "Result"];
      case "subtract-percent": return ["Percentage (%)", "Number",          "Result"];
      case "marks":            return ["Marks Obtained", "Total Marks",     "Percentage"];
    }
  };

  const [labelA, labelB, labelResult] = getLabels();

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Calculation Type
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setResult(null); setValA(""); setValB(""); }}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                mode === m.key
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-border bg-secondary/30 hover:border-green-300"
              )}
            >
              <p className="text-sm font-semibold text-foreground">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
          <h2 className="font-display text-lg font-semibold mb-5">
            {MODES.find((m) => m.key === mode)?.label}
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">{labelA}</Label>
              <Input
                type="number"
                placeholder="Enter value"
                value={valA}
                onChange={(e) => { setValA(e.target.value); setResult(null); }}
                className="rounded-xl"
                step="any"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">{labelB}</Label>
              <Input
                type="number"
                placeholder="Enter value"
                value={valB}
                onChange={(e) => { setValB(e.target.value); setResult(null); }}
                className="rounded-xl"
                step="any"
              />
            </div>
          </div>

          <button
            onClick={handleCalc}
            className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium flex items-center justify-center gap-2 transition-all"
          >
            <Percent className="w-4 h-4" />
            Calculate
          </button>
        </div>

        {/* Result */}
        <div className={cn(
          "rounded-2xl border border-border/60 p-6 flex flex-col",
          result
            ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
            : "bg-white dark:bg-white/5"
        )}>
          <h2 className="font-display text-lg font-semibold mb-4">{labelResult}</h2>

          {result ? (
            <div className="flex-1 flex flex-col justify-center items-center py-6">
              <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/25">
                <Percent className="w-10 h-10 text-white" />
              </div>
              <p className="font-display text-5xl font-bold text-foreground mb-2">
                {result}
              </p>
              <p className="text-sm text-muted-foreground text-center">
                {MODES.find((m) => m.key === mode)?.desc}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <Percent className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm text-muted-foreground">Enter values to calculate</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick % reference */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h3 className="font-display text-base font-semibold mb-4">
          Quick Reference — Common Percentages
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[10, 15, 20, 25, 50, 75].map((pct) => {
            const base = parseFloat(valB) || parseFloat(valA) || 100;
            return (
              <div key={pct} className="bg-secondary/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{pct}%</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {((pct / 100) * base).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">of {base}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}