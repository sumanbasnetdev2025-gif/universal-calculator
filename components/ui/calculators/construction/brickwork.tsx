"use client";
import { useState } from "react";
import { Square, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type WallThickness = "half" | "one" | "one-half";
type BrickType = "standard" | "modular";

const BRICK_SIZES: Record<BrickType, { l: number; w: number; h: number; label: string }> = {
  standard: { l: 0.230, w: 0.115, h: 0.075, label: "Standard (230×115×75mm)" },
  modular:  { l: 0.190, w: 0.090, h: 0.090, label: "Modular (190×90×90mm)" },
};

const WALL_THICKNESS: Record<WallThickness, { multiplier: number; label: string; mm: string }> = {
  half:     { multiplier: 0.115, label: "Half Brick", mm: "115mm" },
  one:      { multiplier: 0.230, label: "One Brick",  mm: "230mm" },
  "one-half": { multiplier: 0.345, label: "One & Half", mm: "345mm" },
};

const MORTAR_RATIO = 0.3; // 30% mortar in brickwork
const WASTAGE = 0.05;     // 5% wastage

interface BrickResult {
  wallArea: number;
  wallVolume: number;
  bricks: number;
  bricksWithWastage: number;
  mortarVolume: number;
  cementBags: number;
  sandVolume: number;
}

export default function Brickwork() {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<"m" | "ft">("ft");
  const [thickness, setThickness] = useState<WallThickness>("one");
  const [brickType, setBrickType] = useState<BrickType>("standard");
  const [result, setResult] = useState<BrickResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const l = parseFloat(length);
    const h = parseFloat(height);
    if (!l || !h || l <= 0 || h <= 0)
      return setError("Please enter valid dimensions.");

    const factor = unit === "ft" ? 0.3048 : 1;
    const lm = l * factor;
    const hm = h * factor;
    const wallThickM = WALL_THICKNESS[thickness].multiplier;

    const wallArea = lm * hm;
    const wallVolume = wallArea * wallThickM;

    const brick = BRICK_SIZES[brickType];
    const mortarThickness = 0.010; // 10mm mortar joints
    const brickVol = (brick.l + mortarThickness) * (brick.w + mortarThickness) * (brick.h + mortarThickness);
    const bricksPerM3 = (1 - MORTAR_RATIO) / brickVol;
    const bricks = Math.ceil(wallVolume * bricksPerM3);
    const bricksWithWastage = Math.ceil(bricks * (1 + WASTAGE));

    const mortarVolume = wallVolume * MORTAR_RATIO * 1.3; // dry factor
    const totalMortarParts = 1 + 6; // 1:6 mix
    const cementVol = (1 / totalMortarParts) * mortarVolume;
    const cementKg = cementVol * 1440;
    const cementBags = Math.ceil(cementKg / 50);
    const sandVolume = (6 / totalMortarParts) * mortarVolume;

    setResult({
      wallArea: parseFloat(wallArea.toFixed(2)),
      wallVolume: parseFloat(wallVolume.toFixed(3)),
      bricks,
      bricksWithWastage,
      mortarVolume: parseFloat(mortarVolume.toFixed(3)),
      cementBags,
      sandVolume: parseFloat(sandVolume.toFixed(3)),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold mb-5">Wall Details</h2>

        {/* Unit toggle */}
        <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-4">
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

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Wall Length ({unit})</Label>
            <Input
              type="number"
              placeholder={unit === "ft" ? "e.g. 20" : "e.g. 6"}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="rounded-xl"
              min={0}
              step="0.1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Wall Height ({unit})</Label>
            <Input
              type="number"
              placeholder={unit === "ft" ? "e.g. 10" : "e.g. 3"}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="rounded-xl"
              min={0}
              step="0.1"
            />
          </div>
        </div>

        {/* Wall thickness */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Wall Thickness</Label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(WALL_THICKNESS) as [WallThickness, typeof WALL_THICKNESS[WallThickness]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setThickness(key)}
                className={cn(
                  "p-2.5 rounded-xl border text-center transition-all",
                  thickness === key
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-border bg-secondary/30 hover:border-orange-300"
                )}
              >
                <p className="text-xs font-bold text-foreground">{val.label}</p>
                <p className="text-xs text-muted-foreground">{val.mm}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Brick type */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Brick Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(BRICK_SIZES) as [BrickType, typeof BRICK_SIZES[BrickType]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setBrickType(key)}
                className={cn(
                  "p-2.5 rounded-xl border text-center transition-all",
                  brickType === key
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-border bg-secondary/30 hover:border-orange-300"
                )}
              >
                <p className="text-xs font-bold text-foreground capitalize">{key}</p>
                <p className="text-xs text-muted-foreground">{val.label.split("(")[1]?.replace(")", "")}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 mb-4">
          <Info className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Mortar mix 1:6. Includes 5% brick wastage. 10mm mortar joints assumed.
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
          <Square className="w-4 h-4 mr-2" />
          Calculate Brickwork
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
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-500 text-white rounded-xl p-4 text-center">
                <p className="text-xs opacity-80 mb-1">Wall Area</p>
                <p className="font-display text-2xl font-bold">{result.wallArea}</p>
                <p className="text-xs opacity-70">m²</p>
              </div>
              <div className="bg-white dark:bg-white/10 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Wall Volume</p>
                <p className="font-display text-2xl font-bold text-foreground">{result.wallVolume}</p>
                <p className="text-xs text-muted-foreground">m³</p>
              </div>
            </div>

            {[
              { emoji: "🧱", label: "Bricks Required", value: `${result.bricks.toLocaleString()} nos`, sub: `With wastage: ${result.bricksWithWastage.toLocaleString()} nos` },
              { emoji: "🏷️", label: "Cement (1:6 mortar)", value: `${result.cementBags} bags`, sub: `${result.cementBags * 50} kg total` },
              { emoji: "🪨", label: "Sand", value: `${result.sandVolume} m³`, sub: `≈ ${(result.sandVolume * 1400).toFixed(0)} kg` },
              { emoji: "🪣", label: "Mortar Volume", value: `${result.mortarVolume} m³`, sub: "Dry volume" },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-foreground">
                    {item.emoji} {item.label}
                  </span>
                  <span className="font-display text-lg font-bold text-orange-600 dark:text-orange-400">
                    {item.value}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
                <Square className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter wall dimensions to calculate
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}