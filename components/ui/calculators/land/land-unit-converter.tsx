"use client";
import { useState, useEffect } from "react";
import { ArrowLeftRight, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Conversion tables (base = sq metres) ──────────────────────────────────────
const HILLY: Record<string, { label: string; toSqM: number }> = {
  ropani:  { label: "Ropani",       toSqM: 508.72  },
  aana:    { label: "Aana",         toSqM: 31.7950 },
  paisa:   { label: "Paisa",        toSqM: 7.9488  },
  daam:    { label: "Daam",         toSqM: 1.9872  },
  sqft:    { label: "Sq. Feet",     toSqM: 0.09290 },
  sqm:     { label: "Sq. Metres",   toSqM: 1       },
  sqyard:  { label: "Sq. Yards",    toSqM: 0.83613 },
  hectare: { label: "Hectare",      toSqM: 10000   },
  bigha:   { label: "Bigha (hill)", toSqM: 6772.63 },
};

const TERAI: Record<string, { label: string; toSqM: number }> = {
  bigha:   { label: "Bigha",        toSqM: 6772.63 },
  kattha:  { label: "Kattha",       toSqM: 338.63  },
  dhur:    { label: "Dhur",         toSqM: 16.93   },
  sqft:    { label: "Sq. Feet",     toSqM: 0.09290 },
  sqm:     { label: "Sq. Metres",   toSqM: 1       },
  sqyard:  { label: "Sq. Yards",    toSqM: 0.83613 },
  hectare: { label: "Hectare",      toSqM: 10000   },
  ropani:  { label: "Ropani (hill)",toSqM: 508.72  },
};

type System = "hilly" | "terai";

export default function LandUnitConverter() {
  const [system, setSystem]   = useState<System>("hilly");
  const [fromUnit, setFromUnit] = useState("ropani");
  const [toUnit, setToUnit]   = useState("sqft");
  const [value, setValue]     = useState("");
  const [result, setResult]   = useState<number | null>(null);

  const units = system === "hilly" ? HILLY : TERAI;

  // reset units when system changes
  useEffect(() => {
    if (system === "hilly") { setFromUnit("ropani"); setToUnit("sqft"); }
    else                    { setFromUnit("bigha");  setToUnit("sqft"); }
    setResult(null);
    setValue("");
  }, [system]);

  // live convert
  useEffect(() => {
    const v = parseFloat(value);
    if (!v || v <= 0) { setResult(null); return; }
    const sqM = v * units[fromUnit].toSqM;
    setResult(sqM / units[toUnit].toSqM);
  }, [value, fromUnit, toUnit, units]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Show all-units table
  const allConversions = value && parseFloat(value) > 0
    ? Object.entries(units).map(([key, u]) => ({
        key,
        label: u.label,
        value: (parseFloat(value) * units[fromUnit].toSqM) / u.toSqM,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* System toggle */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-5 max-w-xs">
          {(["hilly", "terai"] as System[]).map((s) => (
            <button
              key={s}
              onClick={() => setSystem(s)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                system === s
                  ? "bg-white dark:bg-white/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "hilly" ? "🏔️ Hilly (Pahadi)" : "🌾 Terai"}
            </button>
          ))}
        </div>

        {/* Converter row */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Value</Label>
              <Input
                type="number"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="rounded-xl text-lg font-mono"
                min={0}
                step="any"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">From Unit</Label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.entries(units).map(([key, u]) => (
                  <option key={key} value={key}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <div className="flex justify-center pb-1">
            <button
              onClick={swap}
              className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </button>
          </div>

          {/* To */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Result</Label>
              <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 px-4 py-2.5 font-mono text-lg font-bold text-teal-700 dark:text-teal-300 min-h-[42px]">
                {result !== null ? result.toLocaleString("en", { maximumFractionDigits: 6 }) : "—"}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">To Unit</Label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.entries(units).map(([key, u]) => (
                  <option key={key} value={key}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {result !== null && (
          <div className="mt-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Conversion Result</p>
            <p className="font-display text-2xl font-bold text-teal-700 dark:text-teal-300">
              {parseFloat(value).toLocaleString()} {units[fromUnit].label}
              {" = "}
              {result.toLocaleString("en", { maximumFractionDigits: 6 })} {units[toUnit].label}
            </p>
          </div>
        )}
      </div>

      {/* All conversions table */}
      {allConversions.length > 0 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
          <h3 className="font-display text-base font-semibold mb-4">
            All Conversions for {parseFloat(value).toLocaleString()} {units[fromUnit].label}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allConversions.map((c) => (
              <div
                key={c.key}
                className={cn(
                  "rounded-xl p-3 border",
                  c.key === fromUnit
                    ? "border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                    : "border-border bg-secondary/30"
                )}
              >
                <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {c.value < 0.0001
                    ? c.value.toExponential(3)
                    : c.value.toLocaleString("en", { maximumFractionDigits: 5 })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reference card */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-teal-500" />
          <h3 className="font-display text-base font-semibold">
            {system === "hilly" ? "Hilly Region Reference" : "Terai Region Reference"}
          </h3>
        </div>
        {system === "hilly" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              "1 Ropani = 16 Aana",
              "1 Aana = 4 Paisa",
              "1 Paisa = 4 Daam",
              "1 Ropani = 5,476 sq.ft",
              "1 Ropani = 508.72 sq.m",
              "1 Bigha = 13.31 Ropani",
            ].map((r) => (
              <div key={r} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                <span className="text-muted-foreground">{r}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              "1 Bigha = 20 Kattha",
              "1 Kattha = 20 Dhur",
              "1 Bigha = 400 Dhur",
              "1 Bigha = 72,900 sq.ft",
              "1 Bigha = 6,772.63 sq.m",
              "1 Kattha = 3,645 sq.ft",
            ].map((r) => (
              <div key={r} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                <span className="text-muted-foreground">{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}