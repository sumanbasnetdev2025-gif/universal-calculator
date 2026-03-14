"use client";
import { useState } from "react";
import { Receipt, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, nepaliNumberFormat } from "@/lib/utils";
import {
  calculateIncomeTax,
  calculateSSF,
  INCOME_TAX_SLABS_INDIVIDUAL,
} from "@/lib/tax-rates";

interface TaxResult {
  annualIncome: number;
  ssfEmployee: number;
  taxableIncome: number;
  incomeTax: number;
  monthlyTax: number;
  effectiveRate: number;
  slabDetails: { label: string; taxable: number; rate: number; tax: number }[];
}

export default function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [includeSSF, setIncludeSSF] = useState(true);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const val = parseFloat(income);
    if (!val || val <= 0) return setError("Please enter a valid income amount.");

    const annualIncome = period === "monthly" ? val * 12 : val;
    const ssf = includeSSF ? calculateSSF(period === "monthly" ? val : val / 12) : { employee: 0 };
    const ssfAnnual = ssf.employee * 12;
    const taxableIncome = annualIncome - ssfAnnual;
    const incomeTax = calculateIncomeTax(taxableIncome);
    const monthlyTax = incomeTax / 12;
    const effectiveRate = (incomeTax / annualIncome) * 100;

    // Slab details
    const slabDetails: TaxResult["slabDetails"] = [];
    let remaining = taxableIncome;
    for (const slab of INCOME_TAX_SLABS_INDIVIDUAL) {
      if (remaining <= slab.min) break;
      const slabMax = slab.max ?? Infinity;
      const taxable = Math.min(remaining, slabMax) - slab.min;
      if (taxable > 0) {
        slabDetails.push({
          label: slab.label,
          taxable,
          rate: slab.rate * 100,
          tax: taxable * slab.rate,
        });
        remaining = Math.min(remaining, slabMax);
      }
    }

    setResult({ annualIncome, ssfEmployee: ssfAnnual, taxableIncome, incomeTax, monthlyTax, effectiveRate, slabDetails });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold mb-5">Income Details</h2>

        <div className="space-y-4">
          {/* Period toggle */}
          <div className="flex gap-2 p-1 bg-secondary rounded-xl">
            {(["monthly", "annual"] as const).map((p) => (
              <button
                key={p}
                onClick={() => { setPeriod(p); setResult(null); }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                  period === p
                    ? "bg-white dark:bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              {period === "monthly" ? "Monthly" : "Annual"} Income (NPR)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                Rs.
              </span>
              <Input
                type="number"
                placeholder={period === "monthly" ? "e.g. 80000" : "e.g. 960000"}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="rounded-xl pl-10"
              />
            </div>
          </div>

          {/* SSF toggle */}
          <div
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 cursor-pointer"
            onClick={() => setIncludeSSF(!includeSSF)}
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Include SSF (11%)</span>
            </div>
            <div className={cn(
              "w-10 h-5 rounded-full transition-colors relative",
              includeSSF ? "bg-emerald-500" : "bg-secondary"
            )}>
              <div className={cn(
                "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                includeSSF ? "left-5" : "left-0.5"
              )} />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <Button
          onClick={handleCalculate}
          className="w-full mt-5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
        >
          <Receipt className="w-4 h-4 mr-2" />
          Calculate Tax
        </Button>
      </div>

      {/* Result */}
      <div className={cn(
        "rounded-2xl border border-border/60 p-6",
        result
          ? "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800"
          : "bg-white dark:bg-white/5"
      )}>
        <h2 className="font-display text-lg font-semibold mb-4">Tax Summary</h2>

        {result ? (
          <div className="space-y-3">
            {[
              { label: "Annual Income", value: result.annualIncome },
              { label: "SSF Deduction", value: result.ssfEmployee, negative: true },
              { label: "Taxable Income", value: result.taxableIncome },
              { label: "Annual Tax", value: result.incomeTax, highlight: true },
              { label: "Monthly Tax", value: result.monthlyTax, highlight: true },
            ].map((row) => (
              <div
                key={row.label}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3",
                  row.highlight
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-white/10"
                )}
              >
                <span className={cn("text-sm font-medium", row.highlight ? "text-white" : "text-muted-foreground")}>
                  {row.label}
                </span>
                <span className={cn(
                  "font-display text-base font-bold font-mono",
                  row.highlight ? "text-white" : row.negative ? "text-red-500" : "text-foreground"
                )}>
                  {row.negative ? "- " : ""}Rs. {nepaliNumberFormat(row.value)}
                </span>
              </div>
            ))}

            <div className="bg-white dark:bg-white/10 rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Effective Tax Rate</p>
              <p className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {result.effectiveRate.toFixed(2)}%
              </p>
            </div>

            {/* Slab breakdown */}
            {result.slabDetails.length > 0 && (
              <div className="bg-white dark:bg-white/10 rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Slab Breakdown
                </p>
                <div className="space-y-2">
                  {result.slabDetails.map((s) => (
                    <div key={s.label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{s.label} @ {s.rate}%</span>
                      <span className="font-mono font-medium text-foreground">
                        Rs. {nepaliNumberFormat(s.tax)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your income to calculate tax
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}