"use client";
import { useState } from "react";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, nepaliNumberFormat } from "@/lib/utils";
import { VAT_RATE } from "@/lib/tax-rates";

type VATMode = "add" | "extract";

interface VATResult {
  baseAmount:  number;
  vatAmount:   number;
  totalAmount: number;
  vatRate:     number;
}

export default function VATCalculator() {
  const [amount, setAmount]   = useState("");
  const [mode, setMode]       = useState<VATMode>("add");
  const [customRate, setCustomRate] = useState("");
  const [useCustom, setUseCustom]   = useState(false);
  const [result, setResult]   = useState<VATResult | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const val = parseFloat(amount);
    if (!val || val <= 0) return setError("Enter a valid amount.");
    const vr = useCustom ? parseFloat(customRate) / 100 : VAT_RATE;
    if (isNaN(vr) || vr <= 0) return setError("Enter a valid VAT rate.");

    let base: number, vatAmt: number, total: number;
    if (mode === "add") {
      base   = val;
      vatAmt = val * vr;
      total  = val + vatAmt;
    } else {
      total  = val;
      base   = val / (1 + vr);
      vatAmt = total - base;
    }

    setResult({ baseAmount: base, vatAmount: vatAmt, totalAmount: total, vatRate: vr * 100 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold mb-5">VAT Details</h2>

        <div className="space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-2 p-1 bg-secondary rounded-xl">
            {([
              { key: "add",     label: "Add VAT",     sub: "Price → VAT inclusive" },
              { key: "extract", label: "Extract VAT", sub: "VAT inclusive → Base" },
            ] as { key: VATMode; label: string; sub: string }[]).map((m) => (
              <button
                key={m.key}
                onClick={() => { setMode(m.key); setResult(null); }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-left transition-all",
                  mode === m.key
                    ? "bg-white dark:bg-white/10 shadow-sm"
                    : "hover:bg-secondary/80"
                )}
              >
                <p className={cn("text-sm font-medium", mode === m.key ? "text-foreground" : "text-muted-foreground")}>
                  {m.label}
                </p>
                <p className="text-xs text-muted-foreground">{m.sub}</p>
              </button>
            ))}
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              {mode === "add" ? "Amount Before VAT (NPR)" : "VAT-Inclusive Amount (NPR)"}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">Rs.</span>
              <Input
                type="number"
                placeholder="e.g. 10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl pl-10"
                min={0}
              />
            </div>
          </div>

          {/* VAT rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">VAT Rate</Label>
              <button
                onClick={() => setUseCustom(!useCustom)}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                {useCustom ? "Use Nepal 13%" : "Custom rate"}
              </button>
            </div>
            {useCustom ? (
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Enter rate %"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="rounded-xl pr-8"
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                13% (Nepal Standard VAT)
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <Button
          onClick={handleCalculate}
          className="w-full mt-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          <Receipt className="w-4 h-4 mr-2" />
          Calculate VAT
        </Button>
      </div>

      {/* Result */}
      <div className={cn(
        "rounded-2xl border border-border/60 p-6",
        result
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
          : "bg-white dark:bg-white/5"
      )}>
        <h2 className="font-display text-lg font-semibold mb-4">VAT Breakdown</h2>

        {result ? (
          <div className="space-y-3">
            <div className="bg-blue-500 text-white rounded-xl p-5 text-center">
              <p className="text-sm opacity-80 mb-1">VAT Amount ({result.vatRate}%)</p>
              <p className="font-display text-4xl font-bold">
                Rs. {nepaliNumberFormat(result.vatAmount)}
              </p>
            </div>

            {[
              { label: "Base Price (excl. VAT)", value: result.baseAmount },
              { label: `VAT @ ${result.vatRate}%`, value: result.vatAmount, accent: true },
              { label: "Total (incl. VAT)",       value: result.totalAmount, bold: true },
            ].map((r) => (
              <div
                key={r.label}
                className={cn(
                  "flex justify-between rounded-xl px-4 py-3",
                  r.bold
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-white/10"
                )}
              >
                <span className={cn("text-sm", r.bold ? "text-white font-medium" : "text-muted-foreground")}>
                  {r.label}
                </span>
                <span className={cn(
                  "font-mono font-bold",
                  r.bold ? "text-white" : r.accent ? "text-orange-500" : "text-foreground"
                )}>
                  Rs. {nepaliNumberFormat(r.value)}
                </span>
              </div>
            ))}

            <div className="bg-white dark:bg-white/10 rounded-xl p-4">
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: `${(result.baseAmount / result.totalAmount) * 100}%` }}
                />
                <div
                  className="bg-orange-400 h-full"
                  style={{ width: `${(result.vatAmount / result.totalAmount) * 100}%` }}
                />
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  Base {((result.baseAmount / result.totalAmount) * 100).toFixed(1)}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                  VAT {((result.vatAmount / result.totalAmount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-sm text-muted-foreground">Enter an amount to calculate VAT</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}