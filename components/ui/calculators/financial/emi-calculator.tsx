"use client";
import { useState } from "react";
import { CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, nepaliNumberFormat } from "@/lib/utils";

interface EMIResult {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
  schedule: {
    month: number; emi: number;
    principal: number; interest: number; balance: number;
  }[];
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate]           = useState("");
  const [tenure, setTenure]       = useState("");
  const [tenureType, setTenureType] = useState<"months" | "years">("years");
  const [result, setResult]       = useState<EMIResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(tenure);
    if (!p || p <= 0) return setError("Enter a valid loan amount.");
    if (!r || r <= 0) return setError("Enter a valid interest rate.");
    if (!t || t <= 0) return setError("Enter a valid tenure.");

    const months = tenureType === "years" ? t * 12 : t;
    const monthlyRate = r / 100 / 12;

    const emi = monthlyRate === 0
      ? p / months
      : (p * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount  = emi * months;
    const totalInterest = totalAmount - p;

    // Amortisation schedule
    const schedule = [];
    let balance = p;
    for (let m = 1; m <= Math.min(months, 360); m++) {
      const interest  = balance * monthlyRate;
      const prinPaid  = emi - interest;
      balance -= prinPaid;
      schedule.push({
        month: m,
        emi: parseFloat(emi.toFixed(2)),
        principal: parseFloat(prinPaid.toFixed(2)),
        interest: parseFloat(interest.toFixed(2)),
        balance: parseFloat(Math.max(balance, 0).toFixed(2)),
      });
    }

    setResult({ emi, totalAmount, totalInterest, principal: p, schedule });
  };

  const principalPercent = result
    ? (result.principal / result.totalAmount) * 100 : 0;
  const interestPercent = result
    ? (result.totalInterest / result.totalAmount) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold mb-5">Loan Details</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Loan Amount (NPR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">Rs.</span>
              <Input
                type="number"
                placeholder="e.g. 5000000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="rounded-xl pl-10"
                min={0}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Annual Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g. 11.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="rounded-xl"
              min={0}
              step="0.1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Loan Tenure</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={tenureType === "years" ? "e.g. 20" : "e.g. 240"}
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="rounded-xl flex-1"
                min={1}
              />
              <div className="flex gap-1 p-1 bg-secondary rounded-xl">
                {(["years", "months"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTenureType(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                      tenureType === t
                        ? "bg-white dark:bg-white/10 text-foreground shadow-sm"
                        : "text-muted-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bank rate presets */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Nepal bank rates (approx)</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Home Loan ~11%", rate: "11" },
                { label: "Car Loan ~12%",  rate: "12" },
                { label: "Personal ~15%",  rate: "15" },
                { label: "Business ~13%",  rate: "13" },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setRate(p.rate)}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                >
                  {p.label}
                </button>
              ))}
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
          className="w-full mt-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Calculate EMI
        </Button>
      </div>

      {/* Result */}
      <div className={cn(
        "rounded-2xl border border-border/60 p-6",
        result
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
          : "bg-white dark:bg-white/5"
      )}>
        <h2 className="font-display text-lg font-semibold mb-4">EMI Summary</h2>

        {result ? (
          <div className="space-y-3">
            {/* Monthly EMI */}
            <div className="bg-blue-500 text-white rounded-xl p-5 text-center">
              <p className="text-sm opacity-80 mb-1">Monthly EMI</p>
              <p className="font-display text-4xl font-bold">
                Rs. {nepaliNumberFormat(result.emi)}
              </p>
            </div>

            {/* Summary rows */}
            {[
              { label: "Principal Amount",   value: result.principal,      color: "text-blue-600 dark:text-blue-400" },
              { label: "Total Interest",     value: result.totalInterest,  color: "text-orange-500" },
              { label: "Total Payment",      value: result.totalAmount,    color: "text-foreground" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between bg-white dark:bg-white/10 rounded-xl px-4 py-3">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className={cn("font-mono font-bold text-sm", r.color)}>
                  Rs. {nepaliNumberFormat(r.value)}
                </span>
              </div>
            ))}

            {/* Visual bar */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Composition
              </p>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-2">
                <div className="bg-blue-500 h-full" style={{ width: `${principalPercent}%` }} />
                <div className="bg-orange-400 h-full" style={{ width: `${interestPercent}%` }} />
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  Principal {principalPercent.toFixed(1)}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                  Interest {interestPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Amortisation toggle */}
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full flex items-center justify-between bg-white dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              <span>Amortisation Schedule</span>
              {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-sm text-muted-foreground">Enter loan details to calculate EMI</p>
            </div>
          </div>
        )}
      </div>

      {/* Amortisation schedule (full width) */}
      {result && showSchedule && (
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
          <h3 className="font-display text-base font-semibold mb-4">
            Amortisation Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Month", "EMI", "Principal", "Interest", "Balance"].map((h) => (
                    <th key={h} className="py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right first:text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.schedule.slice(0, 24).map((row, idx) => (
                  <tr key={row.month} className={cn(
                    "border-b border-border/30 hover:bg-secondary/30 transition-colors",
                    idx % 2 === 0 ? "" : "bg-secondary/10"
                  )}>
                    <td className="py-2 px-3 text-muted-foreground">{row.month}</td>
                    <td className="py-2 px-3 text-right font-mono">{nepaliNumberFormat(row.emi)}</td>
                    <td className="py-2 px-3 text-right font-mono text-blue-600 dark:text-blue-400">{nepaliNumberFormat(row.principal)}</td>
                    <td className="py-2 px-3 text-right font-mono text-orange-500">{nepaliNumberFormat(row.interest)}</td>
                    <td className="py-2 px-3 text-right font-mono">{nepaliNumberFormat(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.schedule.length > 24 && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Showing first 24 months of {result.schedule.length} total months
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}