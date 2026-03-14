"use client";
import { useState } from "react";
import { Wallet, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, nepaliNumberFormat } from "@/lib/utils";
import { calculateNetSalary } from "@/lib/tax-rates";

export default function NetPay() {
  const [gross,       setGross]       = useState("");
  const [allowances,  setAllowances]  = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [result,      setResult]      = useState<any>(null);
  const [error,       setError]       = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const grossVal = parseFloat(gross);
    if (!grossVal || grossVal <= 0) return setError("Please enter a valid gross salary.");
    const totalGross = grossVal + (parseFloat(allowances) || 0);
    const calc = calculateNetSalary(totalGross);
    const totalDeductions = calc.ssfEmployee + calc.monthlyTax;
    setResult({ ...calc, grossMonthly: totalGross, totalDeductions,
      ssfEmployer: calc.ssfEmployer, takeHomePercent: (calc.netSalary / totalGross) * 100 });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-4 sm:p-6">
        <h2 className="font-display text-base sm:text-lg font-semibold mb-4">Salary Details</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Gross Monthly Salary (NPR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">Rs.</span>
              <Input type="number" placeholder="e.g. 75000" value={gross} onChange={(e) => setGross(e.target.value)} className="rounded-xl pl-10" />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Allowances (NPR) <span className="text-muted-foreground font-normal text-xs">optional</span></Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">Rs.</span>
              <Input type="number" placeholder="e.g. 10000" value={allowances} onChange={(e) => setAllowances(e.target.value)} className="rounded-xl pl-10" />
            </div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
            <p>• SSF Employee: <strong>11%</strong> · Employer: <strong>20%</strong></p>
            <p>• Income tax as per FY 2081/82 slabs</p>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>}
        <Button onClick={handleCalculate} className="w-full mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white">
          <Wallet className="w-4 h-4 mr-2" /> Calculate Net Pay
        </Button>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-4 sm:p-6 space-y-3">
          <div className="bg-emerald-500 rounded-xl p-4 sm:p-5 text-center text-white">
            <p className="text-sm font-medium opacity-80 mb-1">Monthly Take-Home</p>
            <p className="font-display text-3xl sm:text-4xl font-bold">Rs. {nepaliNumberFormat(result.netSalary)}</p>
            <p className="text-sm opacity-70 mt-1">{result.takeHomePercent.toFixed(1)}% of gross</p>
          </div>

          {/* Visual bar */}
          <div className="bg-white dark:bg-white/10 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Composition</p>
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-2">
              <div className="bg-emerald-500 h-full" style={{ width: `${result.takeHomePercent}%` }} />
              <div className="bg-orange-400 h-full" style={{ width: `${(result.monthlyTax / result.grossMonthly) * 100}%` }} />
              <div className="bg-blue-400 h-full" style={{ width: `${(result.ssfEmployee / result.grossMonthly) * 100}%` }} />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-muted-foreground">
              {[
                { color: "bg-emerald-500", label: "Net Pay" },
                { color: "bg-orange-400",  label: "Tax"     },
                { color: "bg-blue-400",    label: "SSF"     },
              ].map((s) => (
                <span key={s.label} className="flex items-center gap-1">
                  <span className={cn("w-2 h-2 rounded-full", s.color)} />{s.label}
                </span>
              ))}
            </div>
          </div>

          <button onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between bg-white dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-medium">
            <span>View Deductions</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="bg-white dark:bg-white/10 rounded-xl p-4 space-y-2">
              {[
                { label: "Gross Salary",        value: result.grossMonthly,   type: "neutral"  },
                { label: "SSF Employee (11%)",   value: result.ssfEmployee,    type: "negative" },
                { label: "Income Tax",           value: result.monthlyTax,     type: "negative" },
                { label: "Total Deductions",     value: result.totalDeductions,type: "negative" },
                { label: "Net Take-Home",        value: result.netSalary,      type: "positive" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground text-xs sm:text-sm">{row.label}</span>
                  <span className={cn("font-mono font-semibold text-xs sm:text-sm",
                    row.type === "positive" ? "text-emerald-600 dark:text-emerald-400" :
                    row.type === "negative" ? "text-red-500" : "text-foreground")}>
                    {row.type === "negative" ? "- " : ""}Rs. {nepaliNumberFormat(row.value)}
                  </span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                Employer SSF: Rs. {nepaliNumberFormat(result.ssfEmployer)} (not deducted from your pay)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}