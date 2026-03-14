"use client";
// ═══════════════════════════════════════════════════════════
// SALARY & PAYROLL CALCULATOR
// ═══════════════════════════════════════════════════════════
import { useState } from "react";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CalcShell, CalcGrid, CalcCard, CalcButton, ErrorMsg,
  FieldRow, FieldLabel, ResultRow, BigResult, InfoTable, StyledSelect, ToggleGroup,
} from "@/components/ui-kit/calc-layout";
import { cn, nepaliNumberFormat } from "@/lib/utils";
import { calculateNetSalary, calculateIncomeTax, calculateSSF, INCOME_TAX_SLABS_INDIVIDUAL, VAT_RATE } from "@/lib/tax-rates";

// ── Hourly to Salary ──────────────────────────────────────────────────────────
function HourlyCalc() {
  const [rate,  setRate]  = useState("");
  const [hrs,   setHrs]   = useState("8");
  const [days,  setDays]  = useState("5");
  const [result,setResult]= useState<any>(null);
  const [error, setError] = useState<string|null>(null);

  const calc = () => {
    setError(null);
    const r=parseFloat(rate), h=parseFloat(hrs), d=parseFloat(days);
    if (!r||r<=0) return setError("Enter valid hourly rate.");
    const daily=r*h, weekly=daily*d;
    setResult({ hourly:r, daily, weekly, monthly:weekly*(52/12), annual:weekly*52 });
  };

  return (
    <CalcGrid>
      <CalcCard title="Hourly Details">
        <div className="space-y-4">
          <FieldRow><FieldLabel>Hourly Rate (NPR)</FieldLabel>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs.</span>
              <Input type="number" placeholder="e.g. 500" value={rate} onChange={e=>setRate(e.target.value)} className="rounded-xl pl-10"/>
            </div>
          </FieldRow>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow><FieldLabel>Hours/Day</FieldLabel>
              <Input type="number" value={hrs} onChange={e=>setHrs(e.target.value)} className="rounded-xl mt-1.5" min={1} max={24}/>
            </FieldRow>
            <FieldRow><FieldLabel>Days/Week</FieldLabel>
              <Input type="number" value={days} onChange={e=>setDays(e.target.value)} className="rounded-xl mt-1.5" min={1} max={7}/>
            </FieldRow>
          </div>
          <div className="flex flex-wrap gap-2">
            {[{l:"Full-time",h:"8",d:"5"},{l:"Part-time",h:"4",d:"5"},{l:"6-day",h:"8",d:"6"}].map(p=>(
              <button key={p.l} onClick={()=>{setHrs(p.h);setDays(p.d);}} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/70 transition-colors">{p.l}</button>
            ))}
          </div>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-emerald-500 hover:bg-emerald-600">Calculate Salary</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Briefcase className="w-8 h-8 text-emerald-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter hourly rate to see breakdown</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-white dark:bg-white/5 p-4 space-y-2">
          {[
            {l:"Hourly",  v:result.hourly,  h:false},
            {l:"Daily",   v:result.daily,   h:false},
            {l:"Weekly",  v:result.weekly,  h:false},
            {l:"Monthly", v:result.monthly, h:true },
            {l:"Annual",  v:result.annual,  h:true },
          ].map(r=><ResultRow key={r.l} label={r.l} value={`Rs. ${nepaliNumberFormat(r.v)}`} highlight={r.h} accent="bg-emerald-500"/>)}
        </div>
      )}
    </CalcGrid>
  );
}

// ── Tax Calculator ────────────────────────────────────────────────────────────
function TaxCalc() {
  const [income,  setIncome]  = useState("");
  const [period,  setPeriod]  = useState<"monthly"|"annual">("monthly");
  const [ssf,     setSSF]     = useState(true);
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState<string|null>(null);

  const calc = () => {
    setError(null);
    const val=parseFloat(income);
    if (!val||val<=0) return setError("Enter valid income.");
    const annual = period==="monthly" ? val*12 : val;
    const ssfAmt = ssf ? calculateSSF(period==="monthly"?val:val/12).employee*12 : 0;
    const taxable = annual-ssfAmt;
    const annualTax = calculateIncomeTax(taxable);
    const monthlyTax = annualTax/12;
    const eff = (annualTax/annual)*100;
    setResult({ annual, ssfAmt, taxable, annualTax, monthlyTax, eff });
  };

  return (
    <CalcGrid>
      <CalcCard title="Income Details">
        <div className="space-y-4">
          <ToggleGroup value={period} onChange={v=>setPeriod(v as any)} accent="bg-emerald-500"
            options={[{value:"monthly",label:"Monthly"},{value:"annual",label:"Annual"}]}/>
          <FieldRow><FieldLabel>{period==="monthly"?"Monthly":"Annual"} Income (NPR)</FieldLabel>
            <div className="relative mt-1.5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs.</span>
              <Input type="number" placeholder={period==="monthly"?"e.g. 80000":"e.g. 960000"} value={income} onChange={e=>setIncome(e.target.value)} className="rounded-xl pl-10"/>
            </div>
          </FieldRow>
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 cursor-pointer" onClick={()=>setSSF(!ssf)}>
            <span className="text-sm font-medium">Include SSF (11%)</span>
            <div className={cn("w-10 h-5 rounded-full relative transition-colors",ssf?"bg-emerald-500":"bg-secondary border border-border")}>
              <div className={cn("w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",ssf?"left-5":"left-0.5")}/>
            </div>
          </div>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-emerald-500 hover:bg-emerald-600">Calculate Tax</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Briefcase className="w-8 h-8 text-emerald-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter income to calculate tax</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <BigResult label="Annual Tax" value={`Rs. ${nepaliNumberFormat(result.annualTax)}`} sub={`Effective rate: ${result.eff.toFixed(2)}%`} gradient="bg-gradient-to-r from-emerald-500 to-green-500"/>
          <div className="p-4 space-y-2">
            <ResultRow label="Annual Income"  value={`Rs. ${nepaliNumberFormat(result.annual)}`}/>
            <ResultRow label="SSF Deduction" value={`- Rs. ${nepaliNumberFormat(result.ssfAmt)}`}/>
            <ResultRow label="Taxable Income" value={`Rs. ${nepaliNumberFormat(result.taxable)}`}/>
            <ResultRow label="Monthly Tax"   value={`Rs. ${nepaliNumberFormat(result.monthlyTax)}`} highlight accent="bg-emerald-500"/>
          </div>
        </div>
      )}

      <div className="lg:col-span-2">
        <InfoTable title="Nepal Tax Slabs (FY 2081/82)" icon="📊" rows={
          INCOME_TAX_SLABS_INDIVIDUAL.map(s=>({ label:s.label, value:`${(s.rate*100).toFixed(0)}%` }))
        }/>
      </div>
    </CalcGrid>
  );
}

// ── Net Pay ───────────────────────────────────────────────────────────────────
function NetPayCalc() {
  const [gross,      setGross]      = useState("");
  const [allowances, setAllowances] = useState("");
  const [result,     setResult]     = useState<any>(null);
  const [error,      setError]      = useState<string|null>(null);

  const calc = () => {
    setError(null);
    const g=parseFloat(gross);
    if (!g||g<=0) return setError("Enter valid gross salary.");
    const total=g+(parseFloat(allowances)||0);
    const c=calculateNetSalary(total);
    setResult({ ...c, grossMonthly:total, totalDeductions:c.ssfEmployee+c.monthlyTax,
      takeHome:(c.netSalary/total)*100 });
  };

  return (
    <CalcGrid>
      <CalcCard title="Salary Details">
        <div className="space-y-4">
          <FieldRow><FieldLabel>Gross Monthly Salary (NPR)</FieldLabel>
            <div className="relative mt-1.5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs.</span>
              <Input type="number" placeholder="e.g. 75000" value={gross} onChange={e=>setGross(e.target.value)} className="rounded-xl pl-10"/>
            </div>
          </FieldRow>
          <FieldRow><FieldLabel>Allowances (NPR) <span className="text-muted-foreground font-normal text-xs">optional</span></FieldLabel>
            <div className="relative mt-1.5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs.</span>
              <Input type="number" placeholder="e.g. 10000" value={allowances} onChange={e=>setAllowances(e.target.value)} className="rounded-xl pl-10"/>
            </div>
          </FieldRow>
          <div className="text-xs text-muted-foreground bg-secondary/50 rounded-xl p-3 space-y-1">
            <p>• SSF Employee: <strong>11%</strong> of gross</p>
            <p>• SSF Employer: <strong>20%</strong> of gross</p>
            <p>• Income tax per FY 2081/82 slabs</p>
          </div>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-emerald-500 hover:bg-emerald-600">Calculate Net Pay</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Briefcase className="w-8 h-8 text-emerald-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter salary to see net pay</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <BigResult label="Monthly Take-Home" value={`Rs. ${nepaliNumberFormat(result.netSalary)}`}
            sub={`${result.takeHome.toFixed(1)}% of gross`} gradient="bg-gradient-to-r from-emerald-500 to-green-500"/>
          <div className="p-4 space-y-2">
            <ResultRow label="Gross Salary"       value={`Rs. ${nepaliNumberFormat(result.grossMonthly)}`}/>
            <ResultRow label="SSF (Employee 11%)" value={`- Rs. ${nepaliNumberFormat(result.ssfEmployee)}`}/>
            <ResultRow label="Income Tax"         value={`- Rs. ${nepaliNumberFormat(result.monthlyTax)}`}/>
            <ResultRow label="Net Take-Home"      value={`Rs. ${nepaliNumberFormat(result.netSalary)}`} highlight accent="bg-emerald-500"/>
          </div>
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground">Employer SSF: Rs. {nepaliNumberFormat(result.ssfEmployer)} (not deducted)</p>
          </div>
        </div>
      )}
    </CalcGrid>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
type SalaryTab = "hourly"|"tax"|"netpay";

export default function SalaryCalculator() {
  const [tab, setTab] = useState<SalaryTab>("hourly");
  return (
    <CalcShell
      icon={Briefcase} iconColor="text-emerald-500" iconBg="bg-emerald-50 dark:bg-emerald-900/20"
      title="Salary & Payroll" description="Hourly to salary, Nepal tax, net pay"
      tabs={[{key:"hourly",label:"Hourly to Salary",icon:"⏰"},{key:"tax",label:"Tax Calculator",icon:"📊"},{key:"netpay",label:"Net Pay",icon:"💰"}]}
      activeTab={tab} onTab={(k)=>setTab(k as SalaryTab)} accentColor="bg-emerald-500"
    >
      {tab==="hourly" && <HourlyCalc/>}
      {tab==="tax"    && <TaxCalc/>}
      {tab==="netpay" && <NetPayCalc/>}
    </CalcShell>
  );
}