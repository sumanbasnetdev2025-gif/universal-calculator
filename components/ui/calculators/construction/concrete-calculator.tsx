"use client";
import { useState } from "react";
import { Layers, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MixRatio = "1:1.5:3" | "1:2:4" | "1:3:6" | "1:4:8";

const MIX_RATIOS: Record<MixRatio, { cement: number; sand: number; aggregate: number; grade: string }> = {
  "1:1.5:3": { cement: 1, sand: 1.5, aggregate: 3, grade: "M20" },
  "1:2:4":   { cement: 1, sand: 2,   aggregate: 4, grade: "M15" },
  "1:3:6":   { cement: 1, sand: 3,   aggregate: 6, grade: "M10" },
  "1:4:8":   { cement: 1, sand: 4,   aggregate: 8, grade: "M7.5" },
};

const DRY_FACTOR = 1.54;
const CEMENT_DENSITY = 1440; // kg/m³
const CEMENT_BAG_KG = 50;

interface ConcreteResult {
  volume: number;
  cement: number;
  sand: number;
  aggregate: number;
  water: number;
  cementBags: number;
  cementKg: number;
}

export default function ConcreteCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [unit, setUnit] = useState<"m" | "ft">("ft");
  const [mix, setMix] = useState<MixRatio>("1:2:4");
  const [result, setResult] = useState<ConcreteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);
    if (!l || !w || !d || l <= 0 || w <= 0 || d <= 0)
      return setError("Please enter valid positive dimensions.");

    // Convert to meters
    const factor = unit === "ft" ? 0.3048 : 1;
    const lm = l * factor;
    const wm = w * factor;
    const dm = d * factor;
    const volume = lm * wm * dm;

    const ratio = MIX_RATIOS[mix];
    const totalParts = ratio.cement + ratio.sand + ratio.aggregate;
    const dryVolume = volume * DRY_FACTOR;

    const cementVol = (ratio.cement / totalParts) * dryVolume;
    const sandVol = (ratio.sand / totalParts) * dryVolume;
    const aggregateVol = (ratio.aggregate / totalParts) * dryVolume;

    const cementKg = cementVol * CEMENT_DENSITY;
    const cementBags = Math.ceil(cementKg / CEMENT_BAG_KG);
    const water = cementKg * 0.45; // water-cement ratio 0.45

    setResult({
      volume: parseFloat(volume.toFixed(3)),
      cement: parseFloat(cementVol.toFixed(3)),
      sand: parseFloat(sandVol.toFixed(3)),
      aggregate: parseFloat(aggregateVol.toFixed(3)),
      water: parseFloat(water.toFixed(1)),
      cementBags,
      cementKg: parseFloat(cementKg.toFixed(1)),
    });
  };

  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
      {/* Input */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold mb-5">Dimensions</h2>

        {/* Unit toggle */}
        <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-5">
          {(["ft", "m"] as const).map((u) => (
            <button
              key={u}
              onClick={() => { setUnit(u); setResult(null); }}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                unit === u
                  ? "bg-white dark:bg-white/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {u === "ft" ? "Feet (ft)" : "Meters (m)"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
  {[
    { label: "Length", value: length, set: setLength, placeholder: unit === "ft" ? "e.g. 20" : "e.g. 6" },
    { label: "Width",  value: width,  set: setWidth,  placeholder: unit === "ft" ? "e.g. 15" : "e.g. 4.5" },
    { label: "Depth",  value: depth,  set: setDepth,  placeholder: unit === "ft" ? "e.g. 0.5": "e.g. 0.15"},
  ].map((f) => (
    <div key={f.label}>
      <Label className="text-sm font-medium mb-2 block">{f.label} ({unit})</Label>
      <Input type="number" placeholder={f.placeholder} value={f.value}
        onChange={(e) => f.set(e.target.value)} className="rounded-xl" min={0} step="0.01" />
    </div>
  ))}
</div>

        {/* Mix ratio */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Label className="text-sm font-medium mb-2 block">Mix Ratio (Cement:Sand:Aggregate)</Label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(MIX_RATIOS) as [MixRatio, typeof MIX_RATIOS[MixRatio]][]).map(([ratio, info]) => (
              <button
                key={ratio}
                onClick={() => setMix(ratio)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  mix === ratio
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-border bg-secondary/30 hover:border-orange-300"
                )}
              >
                <p className="text-sm font-bold text-foreground">{ratio}</p>
                <p className="text-xs text-muted-foreground">{info.grade}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 mb-4">
          <Info className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Results include 54% dry factor for volume expansion. Cement bag = 50kg.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <Button
          onClick={handleCalculate}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
        >
          <Layers className="w-4 h-4 mr-2" />
          Calculate Materials
        </Button>
      </div>

      {/* Result */}
      <div className={cn(
        "rounded-2xl border border-border/60 p-6",
        result
          ? "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800"
          : "bg-white dark:bg-white/5"
      )}>
        <h2 className="font-display text-lg font-semibold mb-4">Material Requirements</h2>

        {result ? (
          <div className="space-y-3">
            <div className="bg-orange-500 text-white rounded-xl p-4 text-center">
              <p className="text-sm opacity-80 mb-1">Total Concrete Volume</p>
              <p className="font-display text-3xl font-bold">{result.volume} m³</p>
            </div>

            {/* Cement */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-foreground">🏷️ Cement</span>
                <span className="font-display text-lg font-bold text-orange-600 dark:text-orange-400">
                  {result.cementBags} bags
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>{result.cementKg} kg total • {result.cement} m³</p>
              </div>
            </div>

            {/* Sand */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">🪨 Sand (Fine Aggregate)</span>
                <span className="font-display text-lg font-bold text-foreground">
                  {result.sand} m³
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ {(result.sand * 1400).toFixed(0)} kg
              </p>
            </div>

            {/* Aggregate */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">⬛ Coarse Aggregate</span>
                <span className="font-display text-lg font-bold text-foreground">
                  {result.aggregate} m³
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ {(result.aggregate * 1500).toFixed(0)} kg
              </p>
            </div>

            {/* Water */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">💧 Water</span>
                <span className="font-display text-lg font-bold text-foreground">
                  {result.water} L
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">W/C ratio = 0.45</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
                <Layers className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter dimensions to calculate materials
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}