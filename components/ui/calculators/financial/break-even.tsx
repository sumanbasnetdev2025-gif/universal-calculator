"use client";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, nepaliNumberFormat } from "@/lib/utils";

interface BEResult {
  breakEvenUnits:    number;
  breakEvenRevenue:  number;
  profitMargin:      number;
  contributionMargin: number;
  cmRatio:           number;
  targetUnits?:      number;
  targetRevenue?:    number;
}

export default function BreakEven() {
  const [fixedCost,    setFixedCost]    = useState("");
  const [variableCost, setVariableCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [targetProfit, setTargetProfit] = useState("");
  const [result,       setResult]       = useState<BEResult | null>(null);
  const [error,        setError]        = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const fc = parseFloat(fixedCost);
    const vc = parseFloat(variableCost);
    const sp = parseFloat(sellingPrice);
    if (!fc || fc < 0) return setError("Enter valid fixed costs.");
    if (!vc || vc < 0) return setError("Enter valid variable cost per unit.");
    if (!sp || sp <= 0) return setError("Enter valid selling price.");
    if (sp <= vc)       return setError("Selling price must be greater than variable cost.");

    const cm       = sp - vc;
    const cmRatio  = (cm / sp) * 100;
    const beUnits  = Math.ceil(fc / cm);
    const beRev    = beUnits * sp;
    const profitMargin = cmRatio;

    const tp = parseFloat(targetProfit);
    const targetUnits   = tp > 0 ? Math.ceil((fc + tp) / cm) : undefined;
    const targetRevenue = targetUnits ? targetUnits * sp : undefined;

    setResult({
      breakEvenUnits: beUnits,
      breakEvenRevenue: beRev,
      profitMargin,
      contributionMargin: cm,
      cmRatio,
      targetUnits,
      targetRevenue,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold mb-5">Cost & Price Details</h2>

        <div className="space-y-4">
          {[
            { label: "Fixed Costs (NPR)", placeholder: "e.g. 500000", value: fixedCost, set: setFixedCost,
              hint: "Rent, salaries, utilities etc." },
            { label: "Variable Cost per Unit (NPR)", placeholder: "e.g. 250", value: variableCost, set: setVariableCost,
              hint: "Material, labour per unit" },
            { label: "Selling Price per Unit (NPR)", placeholder: "e.g. 400", value: sellingPrice, set: setSellingPrice,
              hint: "Price you sell each unit" },
            { label: "Target Profit (NPR) — optional", placeholder: "e.g. 100000", value: targetProfit, set: setTargetProfit,
              hint: "Calculate units needed for target" },
          ].map((f) => (
            <div key={f.label}>
              <Label className="text-sm font-medium mb-1 block">{f.label}</Label>
              <p className="text-xs text-muted-foreground mb-2">{f.hint}</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">Rs.</span>
                <Input
                  type="number"
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="rounded-xl pl-10"
                  min={0}
                />
              </div>
            </div>
          ))}
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
          <TrendingUp className="w-4 h-4 mr-2" />
          Calculate Break-Even
        </Button>
      </div>

      {/* Result */}
      <div className={cn(
        "rounded-2xl border border-border/60 p-6",
        result
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
          : "bg-white dark:bg-white/5"
      )}>
        <h2 className="font-display text-lg font-semibold mb-4">Break-Even Analysis</h2>

        {result ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500 text-white rounded-xl p-4 text-center">
                <p className="text-xs opacity-80 mb-1">Break-Even Units</p>
                <p className="font-display text-3xl font-bold">
                  {result.breakEvenUnits.toLocaleString()}
                </p>
                <p className="text-xs opacity-70">units</p>
              </div>
              <div className="bg-white dark:bg-white/10 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Break-Even Revenue</p>
                <p className="font-display text-xl font-bold text-foreground">
                  Rs. {nepaliNumberFormat(result.breakEvenRevenue)}
                </p>
              </div>
            </div>

            {[
              { label: "Contribution Margin / unit", value: `Rs. ${nepaliNumberFormat(result.contributionMargin)}` },
              { label: "CM Ratio",                   value: `${result.cmRatio.toFixed(2)}%` },
              { label: "Profit Margin",              value: `${result.profitMargin.toFixed(2)}%` },
            ].map((r) => (
              <div key={r.label} className="flex justify-between bg-white dark:bg-white/10 rounded-xl px-4 py-3">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="font-mono font-bold text-sm text-foreground">{r.value}</span>
              </div>
            ))}

            {result.targetUnits && (
              <div className="bg-indigo-500 text-white rounded-xl p-4">
                <p className="text-xs opacity-80 mb-2">To reach your profit target:</p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs opacity-70">Units Needed</p>
                    <p className="font-display text-2xl font-bold">
                      {result.targetUnits.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70">Revenue Needed</p>
                    <p className="font-display text-2xl font-bold">
                      Rs. {nepaliNumberFormat(result.targetRevenue!)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter cost details to calculate break-even
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}