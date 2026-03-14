"use client";
// ════════════════════════════════════════════
// FINANCIAL CALCULATOR
// ════════════════════════════════════════════
import { useState } from "react";
import { CreditCard, TrendingUp, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CalcShell, CalcGrid, CalcCard, CalcButton, ErrorMsg,
  FieldRow, FieldLabel, ResultRow, BigResult, InfoTable, ToggleGroup,
} from "@/components/ui-kit/calc-layout";
import { cn, nepaliNumberFormat } from "@/lib/utils";
import { VAT_RATE } from "@/lib/tax-rates";

function EMICalc() {
  const [principal,  setPrincipal]  = useState("");
  const [rate,       setRate]       = useState("");
  const [tenure,     setTenure]     = useState("");
  const [tenureType, setTenureType] = useState<"years"|"months">("years");
  const [result,     setResult]     = useState<any>(null);
  const [showSched,  setShowSched]  = useState(false);
  const [error,      setError]      = useState<string|null>(null);

  const calc = () => {
    setError(null);
    const p=parseFloat(principal), r=parseFloat(rate), t=parseFloat(tenure);
    if (!p||p<=0) return setError("Enter valid loan amount.");
    if (!r||r<=0) return setError("Enter valid interest rate.");
    if (!t||t<=0) return setError("Enter valid tenure.");
    const months = tenureType==="years"?t*12:t;
    const mr = r/100/12;
    const emi = mr===0 ? p/months : (p*mr*Math.pow(1+mr,months))/(Math.pow(1+mr,months)-1);
    const total=emi*months, interest=total-p;
    // Build schedule (first 24)
    const sched=[]; let bal=p;
    for (let m=1;m<=Math.min(months,24);m++) {
      const int=bal*mr, prin=emi-int; bal-=prin;
      sched.push({m,emi:emi.toFixed(2),prin:prin.toFixed(2),int:int.toFixed(2),bal:Math.max(bal,0).toFixed(2)});
    }
    setResult({emi,total,interest,principal:p,months,sched});
  };

  return (
    <CalcGrid>
      <CalcCard title="Loan Details">
        <div className="space-y-4">
          <FieldRow><FieldLabel>Loan Amount (NPR)</FieldLabel>
            <div className="relative mt-1.5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs.</span>
              <Input type="number" placeholder="e.g. 5000000" value={principal} onChange={e=>setPrincipal(e.target.value)} className="rounded-xl pl-10"/>
            </div>
          </FieldRow>
          <FieldRow><FieldLabel>Annual Interest Rate (%)</FieldLabel>
            <Input type="number" placeholder="e.g. 11.5" value={rate} onChange={e=>setRate(e.target.value)} className="rounded-xl mt-1.5" step="0.1"/>
          </FieldRow>
          <FieldRow>
            <FieldLabel>Loan Tenure</FieldLabel>
            <div className="flex gap-2 mt-1.5">
              <Input type="number" placeholder={tenureType==="years"?"e.g. 20":"e.g. 240"} value={tenure} onChange={e=>setTenure(e.target.value)} className="rounded-xl flex-1" min={1}/>
              <div className="flex gap-1 p-1 bg-secondary rounded-xl">
                {[{v:"years",l:"Yrs"},{v:"months",l:"Mo"}].map(o=>(
                  <button key={o.v} onClick={()=>setTenureType(o.v as any)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",tenureType===o.v?"bg-white dark:bg-white/10 text-foreground shadow-sm":"text-muted-foreground")}>{o.l}</button>
                ))}
              </div>
            </div>
          </FieldRow>
          <div className="flex flex-wrap gap-2">
            {[{l:"Home ~11%",r:"11"},{l:"Car ~12%",r:"12"},{l:"Personal ~15%",r:"15"}].map(p=>(
              <button key={p.l} onClick={()=>setRate(p.r)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors">{p.l}</button>
            ))}
          </div>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-blue-500 hover:bg-blue-600" icon={<CreditCard className="w-4 h-4"/>}>Calculate EMI</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <CreditCard className="w-8 h-8 text-blue-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter loan details to calculate EMI</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <BigResult label="Monthly EMI" value={`Rs. ${nepaliNumberFormat(result.emi)}`} gradient="bg-gradient-to-r from-blue-500 to-indigo-600"/>
          <div className="p-4 space-y-2">
            <ResultRow label="Principal"      value={`Rs. ${nepaliNumberFormat(result.principal)}`}/>
            <ResultRow label="Total Interest" value={`Rs. ${nepaliNumberFormat(result.interest)}`}/>
            <ResultRow label="Total Payment"  value={`Rs. ${nepaliNumberFormat(result.total)}`} highlight accent="bg-blue-500"/>
          </div>
          <div className="px-4 pb-4">
            <div className="h-3 rounded-full bg-secondary overflow-hidden flex gap-0.5">
              <div className="bg-blue-500 h-full" style={{width:`${(result.principal/result.total*100)}%`}}/>
              <div className="bg-orange-400 h-full" style={{width:`${(result.interest/result.total*100)}%`}}/>
            </div>
            <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>Principal {(result.principal/result.total*100).toFixed(1)}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block"/>Interest {(result.interest/result.total*100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="lg:col-span-2">
          <button onClick={()=>setShowSched(!showSched)} className="w-full flex items-center justify-between bg-white dark:bg-white/5 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors">
            <span>Amortisation Schedule (first 24 months)</span>
            <span>{showSched?"▲":"▼"}</span>
          </button>
          {showSched && (
            <div className="mt-2 bg-white dark:bg-white/5 rounded-xl border border-border overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border bg-secondary/30">
                  {["Month","EMI","Principal","Interest","Balance"].map(h=><th key={h} className="px-3 py-2 text-right first:text-left font-semibold text-muted-foreground">{h}</th>)}
                </tr></thead>
                <tbody>
                  {result.sched.map((r:any)=>(
                    <tr key={r.m} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className="px-3 py-2 text-muted-foreground">{r.m}</td>
                      <td className="px-3 py-2 text-right font-mono">{nepaliNumberFormat(parseFloat(r.emi))}</td>
                      <td className="px-3 py-2 text-right font-mono text-blue-500">{nepaliNumberFormat(parseFloat(r.prin))}</td>
                      <td className="px-3 py-2 text-right font-mono text-orange-500">{nepaliNumberFormat(parseFloat(r.int))}</td>
                      <td className="px-3 py-2 text-right font-mono">{nepaliNumberFormat(parseFloat(r.bal))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </CalcGrid>
  );
}

function VATCalc() {
  const [amount, setAmount]   = useState("");
  const [mode,   setMode]     = useState<"add"|"extract">("add");
  const [custom, setCustom]   = useState("");
  const [useCustom,setUseCustom]=useState(false);
  const [result, setResult]   = useState<any>(null);
  const [error,  setError]    = useState<string|null>(null);

  const calc = () => {
    setError(null);
    const val=parseFloat(amount);
    if (!val||val<=0) return setError("Enter valid amount.");
    const vr=useCustom?parseFloat(custom)/100:VAT_RATE;
    if (isNaN(vr)||vr<=0) return setError("Enter valid rate.");
    let base:number,vat:number,total:number;
    if (mode==="add") { base=val; vat=val*vr; total=val+vat; }
    else { total=val; base=val/(1+vr); vat=total-base; }
    setResult({base,vat,total,rate:vr*100});
  };

  return (
    <CalcGrid>
      <CalcCard title="VAT Details">
        <div className="space-y-4">
          <ToggleGroup value={mode} onChange={v=>{ setMode(v as any); setResult(null); }} accent="bg-blue-500"
            options={[{value:"add",label:"Add VAT"},{value:"extract",label:"Extract VAT"}]}/>
          <FieldRow><FieldLabel>{mode==="add"?"Amount Before VAT":"VAT-Inclusive Amount"} (NPR)</FieldLabel>
            <div className="relative mt-1.5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs.</span>
              <Input type="number" placeholder="e.g. 10000" value={amount} onChange={e=>setAmount(e.target.value)} className="rounded-xl pl-10"/>
            </div>
          </FieldRow>
          <div>
            <div className="flex items-center justify-between mb-1.5"><FieldLabel>VAT Rate</FieldLabel>
              <button onClick={()=>setUseCustom(!useCustom)} className="text-xs text-blue-500 hover:text-blue-600">{useCustom?"Use Nepal 13%":"Custom rate"}</button>
            </div>
            {useCustom ? (
              <div className="relative"><Input type="number" placeholder="Rate %" value={custom} onChange={e=>setCustom(e.target.value)} className="rounded-xl pr-8"/><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span></div>
            ) : (
              <div className="rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400">13% (Nepal Standard VAT)</div>
            )}
          </div>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-blue-500 hover:bg-blue-600" icon={<Receipt className="w-4 h-4"/>}>Calculate VAT</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Receipt className="w-8 h-8 text-blue-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter amount to calculate VAT</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <BigResult label={`VAT Amount (${result.rate}%)`} value={`Rs. ${nepaliNumberFormat(result.vat)}`} gradient="bg-gradient-to-r from-blue-500 to-indigo-600"/>
          <div className="p-4 space-y-2">
            <ResultRow label="Base Price (excl. VAT)" value={`Rs. ${nepaliNumberFormat(result.base)}`}/>
            <ResultRow label={`VAT @ ${result.rate}%`} value={`Rs. ${nepaliNumberFormat(result.vat)}`}/>
            <ResultRow label="Total (incl. VAT)" value={`Rs. ${nepaliNumberFormat(result.total)}`} highlight accent="bg-blue-500"/>
          </div>
        </div>
      )}
    </CalcGrid>
  );
}

function BreakEvenCalc() {
  const [fixed,  setFixed]  = useState("");
  const [varCost,setVarCost]= useState("");
  const [price,  setPrice]  = useState("");
  const [target, setTarget] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error,  setError]  = useState<string|null>(null);

  const calc = () => {
    setError(null);
    const fc=parseFloat(fixed), vc=parseFloat(varCost), sp=parseFloat(price);
    if (!fc||fc<0) return setError("Enter valid fixed costs.");
    if (!vc||vc<0) return setError("Enter valid variable cost.");
    if (!sp||sp<=0) return setError("Enter valid selling price.");
    if (sp<=vc) return setError("Selling price must exceed variable cost.");
    const cm=sp-vc, cmr=(cm/sp)*100;
    const beUnits=Math.ceil(fc/cm), beRev=beUnits*sp;
    const tp=parseFloat(target)||0;
    const tUnits=tp>0?Math.ceil((fc+tp)/cm):undefined;
    setResult({cm,cmr,beUnits,beRev,tUnits,tRev:tUnits?tUnits*sp:undefined});
  };

  return (
    <CalcGrid>
      <CalcCard title="Cost & Price Details">
        <div className="space-y-4">
          {[
            {l:"Fixed Costs (NPR)", p:"e.g. 500000", v:fixed, s:setFixed, h:"Rent, salaries, utilities"},
            {l:"Variable Cost per Unit", p:"e.g. 250", v:varCost, s:setVarCost, h:"Material, labour per unit"},
            {l:"Selling Price per Unit", p:"e.g. 400", v:price, s:setPrice, h:"Your selling price"},
            {l:"Target Profit (optional)", p:"e.g. 100000", v:target, s:setTarget, h:"Units needed for target"},
          ].map(f=>(
            <FieldRow key={f.l}>
              <FieldLabel>{f.l}</FieldLabel>
              <p className="text-xs text-muted-foreground mb-1">{f.h}</p>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs.</span>
                <Input type="number" placeholder={f.p} value={f.v} onChange={e=>f.s(e.target.value)} className="rounded-xl pl-10"/>
              </div>
            </FieldRow>
          ))}
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-blue-500 hover:bg-blue-600" icon={<TrendingUp className="w-4 h-4"/>}>Calculate Break-Even</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <TrendingUp className="w-8 h-8 text-blue-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter costs to calculate break-even</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <div className="grid grid-cols-2 gap-0">
            <div className="bg-blue-500 p-4 text-white text-center">
              <p className="text-xs opacity-75 mb-1">Break-Even Units</p>
              <p className="font-display text-3xl font-bold">{result.beUnits.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-600 p-4 text-white text-center">
              <p className="text-xs opacity-75 mb-1">Break-Even Revenue</p>
              <p className="font-display text-xl font-bold">Rs. {nepaliNumberFormat(result.beRev)}</p>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <ResultRow label="Contribution Margin" value={`Rs. ${nepaliNumberFormat(result.cm)}/unit`}/>
            <ResultRow label="CM Ratio" value={`${result.cmr.toFixed(2)}%`}/>
            {result.tUnits && <>
              <ResultRow label="Units for Target Profit" value={result.tUnits.toLocaleString()} highlight accent="bg-blue-500"/>
              <ResultRow label="Revenue for Target" value={`Rs. ${nepaliNumberFormat(result.tRev)}`}/>
            </>}
          </div>
        </div>
      )}
    </CalcGrid>
  );
}

export function FinancialCalculator() {
  const [tab,setTab]=useState<"emi"|"vat"|"breakeven">("emi");
  return (
    <CalcShell icon={CreditCard} iconColor="text-blue-500" iconBg="bg-blue-50 dark:bg-blue-900/20"
      title="Financial Calculator" description="EMI, VAT, break-even analysis"
      tabs={[{key:"emi",label:"EMI Calculator",icon:"🏦"},{key:"vat",label:"VAT Calculator",icon:"🧾"},{key:"breakeven",label:"Break-Even",icon:"📈"}]}
      activeTab={tab} onTab={(k)=>setTab(k as any)} accentColor="bg-blue-500">
      {tab==="emi"       && <EMICalc/>}
      {tab==="vat"       && <VATCalc/>}
      {tab==="breakeven" && <BreakEvenCalc/>}
    </CalcShell>
  );
}
export default FinancialCalculator;