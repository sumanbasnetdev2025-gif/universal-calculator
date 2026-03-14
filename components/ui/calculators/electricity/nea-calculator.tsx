"use client";
import { useState } from "react";
import { Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CalcShell, CalcGrid, CalcCard, CalcButton, ErrorMsg,
  FieldRow, FieldLabel, ResultRow, BigResult, InfoTable, StyledSelect,
} from "@/components/ui-kit/calc-layout";
import { cn, nepaliNumberFormat } from "@/lib/utils";

// Updated NEA slabs (FY 2081/82)
const SLABS = [
  { min: 0,   max: 20,  rate: 4.00,  label: "0–20 units"    },
  { min: 21,  max: 30,  rate: 6.50,  label: "21–30 units"   },
  { min: 31,  max: 50,  rate: 8.00,  label: "31–50 units"   },
  { min: 51,  max: 100, rate: 9.50,  label: "51–100 units"  },
  { min: 101, max: 150, rate: 9.50,  label: "101–150 units" },
  { min: 151, max: 250, rate: 10.00, label: "151–250 units" },
  { min: 251, max: 400, rate: 11.00, label: "251–400 units" },
  { min: 401, max: null,rate: 12.00, label: "Above 400 units"},
];

const SERVICE_CHARGES: Record<string, number> = {
  "5A":30, "15A":50, "30A":75, "60A":100, "100A":150,
};

function calcBill(units: number, ampere: string) {
  let energy = 0;
  const breakdown: { slab: string; units: number; rate: number; amount: number }[] = [];
  let rem = units;

  for (const s of SLABS) {
    if (rem <= 0) break;
    const cap  = s.max ? s.max - s.min + 1 : rem;
    const used = Math.min(rem, cap);
    const amt  = used * s.rate;
    energy += amt;
    breakdown.push({ slab: s.label, units: used, rate: s.rate, amount: amt });
    rem -= used;
  }

  const service = SERVICE_CHARGES[ampere] ?? 30;
  const rebate  = units <= 20 ? energy * 0.1 : 0;
  return { energy, service, rebate, total: energy + service - rebate, breakdown };
}

// By Amount — reverse calculate units from bill amount
function unitsByAmount(targetAmt: number): number {
  let remaining = targetAmt;
  let units = 0;
  for (const s of SLABS) {
    const cap = s.max ? s.max - s.min + 1 : Infinity;
    const possible = Math.min(remaining / s.rate, cap);
    if (possible <= 0) break;
    units += possible;
    remaining -= possible * s.rate;
    if (remaining <= 0.01) break;
  }
  return Math.floor(units);
}

type TabKey = "direct" | "readings" | "amount";

export default function NEACalculator() {
  const [tab,       setTab]      = useState<TabKey>("direct");
  const [units,     setUnits]    = useState("");
  const [ampere,    setAmpere]   = useState("5A");
  const [prevRead,  setPrevRead] = useState("");
  const [currRead,  setCurrRead] = useState("");
  const [amount,    setAmount]   = useState("");
  const [result,    setResult]   = useState<ReturnType<typeof calcBill> | null>(null);
  const [estUnits,  setEstUnits] = useState<number | null>(null);
  const [error,     setError]    = useState<string | null>(null);

  const handleCalc = () => {
    setError(null); setResult(null); setEstUnits(null);
    if (tab === "direct") {
      const u = parseFloat(units);
      if (!u || u <= 0) return setError("Please enter valid units consumed.");
      setResult(calcBill(u, ampere));
    } else if (tab === "readings") {
      const prev = parseFloat(prevRead), curr = parseFloat(currRead);
      if (isNaN(prev) || isNaN(curr)) return setError("Enter both meter readings.");
      if (curr < prev) return setError("Current reading must be greater than previous.");
      setResult(calcBill(curr - prev, ampere));
    } else {
      const amt = parseFloat(amount);
      if (!amt || amt <= 0) return setError("Enter a valid bill amount.");
      setEstUnits(unitsByAmount(amt));
    }
  };

  return (
    <CalcShell
      icon={Zap} iconColor="text-amber-500" iconBg="bg-amber-50 dark:bg-amber-900/20"
      title="Electricity Bill Calculator" description="NEA slab-based calculation"
      tabs={[
        { key: "direct",   label: "Direct"     },
        { key: "readings", label: "Readings"   },
        { key: "amount",   label: "By Amount"  },
      ]}
      activeTab={tab} onTab={(k) => { setTab(k as TabKey); setResult(null); setError(null); setEstUnits(null); }}
      accentColor="bg-amber-500"
    >
      <CalcGrid>
        {/* Left — input */}
        <CalcCard title="Enter Consumption">
          <div className="space-y-4">
            {tab === "direct" && (
              <FieldRow>
                <FieldLabel>Units Consumed (kWh)</FieldLabel>
                <Input
                  type="number" placeholder="Enter units"
                  value={units} onChange={(e) => setUnits(e.target.value)}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <span className="text-amber-500">ⓘ</span>
                  Enter total units consumed during the billing period.
                </p>
              </FieldRow>
            )}

            {tab === "readings" && (
              <>
                <FieldRow>
                  <FieldLabel>Previous Reading</FieldLabel>
                  <Input type="number" placeholder="e.g. 1200" value={prevRead}
                    onChange={(e) => setPrevRead(e.target.value)} className="rounded-xl" />
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Current Reading</FieldLabel>
                  <Input type="number" placeholder="e.g. 1350" value={currRead}
                    onChange={(e) => setCurrRead(e.target.value)} className="rounded-xl" />
                </FieldRow>
                {prevRead && currRead && parseFloat(currRead) > parseFloat(prevRead) && (
                  <div className="text-sm bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 text-amber-600">
                    Units used: <strong>{(parseFloat(currRead) - parseFloat(prevRead)).toFixed(0)}</strong>
                  </div>
                )}
              </>
            )}

            {tab === "amount" && (
              <FieldRow>
                <FieldLabel>Bill Amount (NPR)</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">Rs.</span>
                  <Input type="number" placeholder="e.g. 850" value={amount}
                    onChange={(e) => setAmount(e.target.value)} className="rounded-xl pl-10" />
                </div>
              </FieldRow>
            )}

            {tab !== "amount" && (
              <FieldRow>
                <FieldLabel>Meter Capacity</FieldLabel>
                <StyledSelect
                  value={ampere} onChange={setAmpere}
                  options={Object.entries(SERVICE_CHARGES).map(([k, v]) => ({
                    value: k, label: `${k} — Service charge Rs. ${v}`,
                  }))}
                />
              </FieldRow>
            )}

            <ErrorMsg message={error} />
            <CalcButton onClick={handleCalc} color="bg-amber-500 hover:bg-amber-600">
              Calculate Bill
            </CalcButton>
          </div>
        </CalcCard>

        {/* Right — result */}
        {!result && !estUnits ? (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8 min-h-[200px]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {tab === "amount" ? "Enter amount to estimate units" : "Enter units to calculate bill"}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
            {result && (
              <>
                <BigResult
                  label="Total Bill Amount"
                  value={`Rs. ${nepaliNumberFormat(result.total)}`}
                  sub={`${(tab === "readings" ? parseFloat(currRead) - parseFloat(prevRead) : parseFloat(units)).toFixed(0)} kWh consumed`}
                  gradient="bg-gradient-to-r from-amber-500 to-yellow-500"
                />
                <div className="p-4 space-y-2">
                  <ResultRow label="Energy Charge"  value={`Rs. ${nepaliNumberFormat(result.energy)}`} />
                  <ResultRow label="Service Charge" value={`Rs. ${nepaliNumberFormat(result.service)}`} />
                  {result.rebate > 0 && (
                    <ResultRow label="Rebate (≤20 units)" value={`- Rs. ${nepaliNumberFormat(result.rebate)}`} />
                  )}
                  <ResultRow label="Total Payable" value={`Rs. ${nepaliNumberFormat(result.total)}`} highlight accent="bg-amber-500" />

                  {result.breakdown.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Slab Breakdown</p>
                      {result.breakdown.map((b) => (
                        <div key={b.slab} className="flex justify-between text-xs py-1">
                          <span className="text-muted-foreground">{b.slab} × Rs. {b.rate}</span>
                          <span className="font-mono font-semibold">Rs. {nepaliNumberFormat(b.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {estUnits !== null && (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Estimated Units for Rs. {amount}</p>
                <p className="font-display text-5xl font-bold text-amber-500">{estUnits}</p>
                <p className="text-sm text-muted-foreground mt-2">kWh (approximate)</p>
              </div>
            )}
          </div>
        )}
      </CalcGrid>

      {/* NEA Domestic Tariff table */}
      <div className="mt-4">
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5 sm:p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> NEA Domestic Tariff
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-50 dark:bg-amber-900/20">
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-foreground rounded-l-lg">Units</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold text-foreground rounded-r-lg">Rate (Rs/unit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {SLABS.map((s) => (
                  <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-2.5 text-muted-foreground">{s.label}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-foreground">
                      Rs. {s.rate.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">* Rates as per NEA FY 2081/82</p>
        </div>
      </div>
    </CalcShell>
  );
}