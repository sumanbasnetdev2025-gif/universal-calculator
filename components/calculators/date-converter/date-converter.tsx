"use client";
import { useState } from "react";
import { Calendar, Copy, Check, ArrowLeftRight, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
 CalcGrid, CalcCard, CalcButton, ErrorMsg,
  FieldRow, FieldLabel, ResultRow, InfoTable, StyledSelect, ToggleGroup,
} from "@/components/ui-kit/calc-layout";
import { cn } from "@/lib/utils";
import { adToBS, bsToAD, calculateAge, calculateAgeInBS, dateDifference, NEPALI_MONTHS } from "@/lib/nepali-date";

// ── AD ↔ BS ───────────────────────────────────────────────────────────────────
function ADToBSCalc() {
  const [mode,   setMode]   = useState<"ad-to-bs"|"bs-to-ad">("ad-to-bs");
  const [adDate, setAdDate] = useState("");
  const [bsYear, setBsYear] = useState(""); const [bsMonth,setBsMonth]=useState("1"); const [bsDay,setBsDay]=useState("");
  const [result, setResult] = useState<{main:string;detail:string}|null>(null);
  const [error,  setError]  = useState<string|null>(null);
  const [copied, setCopied] = useState(false);

  const calc = () => {
    setError(null); setResult(null);
    try {
      if (mode==="ad-to-bs") {
        if (!adDate) return setError("Select an AD date.");
        const bs=adToBS(new Date(adDate));
        setResult({ main:`${bs.year} ${NEPALI_MONTHS[bs.month-1]} ${bs.day}`, detail:`${bs.year}-${String(bs.month).padStart(2,"0")}-${String(bs.day).padStart(2,"0")} BS` });
      } else {
        if (!bsYear||!bsDay) return setError("Fill all BS fields.");
        const ad=bsToAD(parseInt(bsYear),parseInt(bsMonth),parseInt(bsDay));
        setResult({ main:ad.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), detail:ad.toISOString().split("T")[0]+" AD" });
      }
    } catch { setError("Invalid date."); }
  };

  const today=new Date(); let bsToday="";
  try { const b=adToBS(today); bsToday=`${b.year} ${NEPALI_MONTHS[b.month-1]} ${b.day}`; } catch {}

  return (
    <CalcGrid>
      <CalcCard>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">{mode==="ad-to-bs"?"AD → BS":"BS → AD"}</h2>
            <button onClick={()=>{setMode(mode==="ad-to-bs"?"bs-to-ad":"ad-to-bs");setResult(null);setError(null);}}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
              <ArrowLeftRight className="w-3.5 h-3.5"/> Swap
            </button>
          </div>

          {mode==="ad-to-bs" ? (
            <FieldRow><FieldLabel>English Date (AD)</FieldLabel>
              <Input type="date" value={adDate} onChange={e=>setAdDate(e.target.value)} className="rounded-xl mt-1.5"/>
            </FieldRow>
          ) : (
            <div className="space-y-3">
              <FieldRow><FieldLabel>BS Year</FieldLabel>
                <Input type="number" placeholder="e.g. 2081" value={bsYear} onChange={e=>setBsYear(e.target.value)} className="rounded-xl mt-1.5"/>
              </FieldRow>
              <div className="grid grid-cols-2 gap-3">
                <FieldRow><FieldLabel>Month</FieldLabel>
                  <StyledSelect value={bsMonth} onChange={setBsMonth} options={NEPALI_MONTHS.map((m,i)=>({value:String(i+1),label:`${i+1}. ${m}`}))}/>
                </FieldRow>
                <FieldRow><FieldLabel>Day</FieldLabel>
                  <Input type="number" placeholder="1–32" value={bsDay} onChange={e=>setBsDay(e.target.value)} className="rounded-xl mt-1.5" min={1} max={32}/>
                </FieldRow>
              </div>
            </div>
          )}
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-violet-500 hover:bg-violet-600" icon={<Calendar className="w-4 h-4"/>}>
            Convert Date
          </CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground mb-1">Today (AD)</p>
              <p className="font-semibold text-foreground text-sm">{today.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-4">
              <p className="text-xs text-muted-foreground mb-1">Today (BS)</p>
              <p className="font-semibold text-violet-600 dark:text-violet-400 text-sm">{bsToday}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
            <Calendar className="w-8 h-8 text-violet-300 mb-2"/>
            <p className="text-sm text-muted-foreground">Select a date and convert</p>
          </div>
        </div>
      ) : (
        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-5 sm:p-6 flex flex-col justify-center">
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-3">
            {mode==="ad-to-bs"?"Nepali Date (BS)":"English Date (AD)"}
          </p>
          <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1 break-words">{result.main}</p>
          <p className="text-sm text-muted-foreground font-mono mb-5">{result.detail}</p>
          <button onClick={()=>{navigator.clipboard.writeText(result.main);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold w-fit transition-all",
              copied?"bg-green-500 text-white":"bg-white dark:bg-white/10 border border-border hover:bg-secondary")}>
            {copied?<><Check className="w-4 h-4"/>Copied!</>:<><Copy className="w-4 h-4"/>Copy Result</>}
          </button>
        </div>
      )}
    </CalcGrid>
  );
}

// ── Age Calculator ────────────────────────────────────────────────────────────
function AgeCalc() {
  const [cal,    setCal]    = useState<"AD"|"BS">("AD");
  const [adDate, setAdDate] = useState("");
  const [bsYear, setBsYear] = useState(""); const [bsMonth,setBsMonth]=useState("1"); const [bsDay,setBsDay]=useState("");
  const [result, setResult] = useState<{years:number;months:number;days:number;totalDays:number;nextBday:number}|null>(null);
  const [error,  setError]  = useState<string|null>(null);

  const calc = () => {
    setError(null);
    try {
      let age: any; let bDate: Date;
      if (cal==="AD") {
        if (!adDate) return setError("Select birth date.");
        bDate=new Date(adDate); age=calculateAge(bDate);
      } else {
        if (!bsYear||!bsDay) return setError("Fill all fields.");
        age=calculateAgeInBS(parseInt(bsYear),parseInt(bsMonth),parseInt(bsDay));
        bDate=bsToAD(parseInt(bsYear),parseInt(bsMonth),parseInt(bsDay));
      }
      const totalDays=Math.floor((Date.now()-bDate.getTime())/86400000);
      const next=new Date(bDate); next.setFullYear(new Date().getFullYear());
      if (next<new Date()) next.setFullYear(new Date().getFullYear()+1);
      const nextBday=Math.ceil((next.getTime()-Date.now())/86400000);
      setResult({...age,totalDays,nextBday});
    } catch { setError("Invalid date."); }
  };

  return (
    <CalcGrid>
      <CalcCard title="Date of Birth">
        <div className="space-y-4">
          <ToggleGroup value={cal} onChange={v=>{ setCal(v as any); setResult(null); setError(null); }} accent="bg-violet-500"
            options={[{value:"AD",label:"AD (English)"},{value:"BS",label:"BS (Nepali)"}]}/>
          {cal==="AD" ? (
            <FieldRow><FieldLabel>Birth Date</FieldLabel>
              <Input type="date" value={adDate} onChange={e=>setAdDate(e.target.value)} className="rounded-xl mt-1.5" max={new Date().toISOString().split("T")[0]}/>
            </FieldRow>
          ) : (
            <div className="space-y-3">
              <FieldRow><FieldLabel>BS Year</FieldLabel>
                <Input type="number" placeholder="e.g. 2055" value={bsYear} onChange={e=>setBsYear(e.target.value)} className="rounded-xl mt-1.5"/>
              </FieldRow>
              <div className="grid grid-cols-2 gap-3">
                <FieldRow><FieldLabel>Month</FieldLabel>
                  <StyledSelect value={bsMonth} onChange={setBsMonth} options={NEPALI_MONTHS.map((m,i)=>({value:String(i+1),label:`${i+1}. ${m}`}))}/>
                </FieldRow>
                <FieldRow><FieldLabel>Day</FieldLabel>
                  <Input type="number" placeholder="1–32" value={bsDay} onChange={e=>setBsDay(e.target.value)} className="rounded-xl mt-1.5" min={1} max={32}/>
                </FieldRow>
              </div>
            </div>
          )}
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-violet-500 hover:bg-violet-600">Calculate Age</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Calendar className="w-8 h-8 text-violet-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter birth date to calculate age</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5 text-white text-center">
            <div className="flex items-end justify-center gap-4">
              {[{v:result.years,l:"Years",big:true},{v:result.months,l:"Months"},{v:result.days,l:"Days"}].map(item=>(
                <div key={item.l} className="text-center">
                  <p className={cn("font-display font-bold", item.big?"text-5xl":"text-3xl")}>{item.v}</p>
                  <p className="text-xs opacity-75 mt-1">{item.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {[
              {l:"Total Days",      v:result.totalDays.toLocaleString()},
              {l:"Days to Birthday",v:result.nextBday.toString()},
              {l:"Total Hours",     v:(result.totalDays*24).toLocaleString()},
              {l:"Total Weeks",     v:Math.floor(result.totalDays/7).toLocaleString()},
            ].map(s=>(
              <div key={s.l} className="bg-secondary/50 rounded-xl p-3 text-center">
                <p className="font-bold text-base text-foreground">{s.v}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </CalcGrid>
  );
}

// ── Date Difference ───────────────────────────────────────────────────────────
function DateDiffCalc() {
  const [d1,setD1]=useState(""); const [d2,setD2]=useState("");
  const [result,setResult]=useState<any>(null); const [error,setError]=useState<string|null>(null);

  const calc=()=>{
    setError(null);
    if (!d1||!d2) return setError("Select both dates.");
    const a=new Date(d1),b=new Date(d2);
    if (a.getTime()===b.getTime()) return setError("Both dates are the same.");
    const diff=dateDifference(a,b);
    setResult({...diff,totalWeeks:Math.floor(diff.totalDays/7),totalHours:diff.totalDays*24});
  };

  return (
    <CalcGrid>
      <CalcCard title="Select Dates">
        <div className="space-y-4">
          <FieldRow><FieldLabel>Start Date</FieldLabel>
            <Input type="date" value={d1} onChange={e=>setD1(e.target.value)} className="rounded-xl mt-1.5"/>
          </FieldRow>
          <FieldRow><FieldLabel>End Date</FieldLabel>
            <Input type="date" value={d2} onChange={e=>setD2(e.target.value)} className="rounded-xl mt-1.5"/>
          </FieldRow>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-violet-500 hover:bg-violet-600">Calculate Difference</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Calendar className="w-8 h-8 text-violet-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Select two dates</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 text-center text-white">
            <p className="font-display text-2xl font-bold">
              {result.years>0&&`${result.years}y `}{result.months>0&&`${result.months}m `}{result.days}d
            </p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {[{l:"Total Days",v:result.totalDays.toLocaleString()},{l:"Total Weeks",v:result.totalWeeks.toLocaleString()},{l:"Total Hours",v:result.totalHours.toLocaleString()},{l:"Years",v:result.years.toString()}].map(s=>(
              <div key={s.l} className="bg-secondary/50 rounded-xl p-3 text-center">
                <p className="font-bold text-base text-foreground">{s.v}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </CalcGrid>
  );
}

// ── Time Difference (inline from earlier) ─────────────────────────────────────
// (Import the existing TimeDifference component)
import TimeDifference from "./time-difference";
import { CalcShell } from "../ui-kit/calc-layout";

// ── Main export ───────────────────────────────────────────────────────────────
type DateTab = "convert"|"age"|"date-diff"|"time-diff";

export default function DateConverter() {
  const [tab, setTab] = useState<DateTab>("convert");

  return (
    <CalcShell
      icon={Calendar} iconColor="text-violet-500" iconBg="bg-violet-50 dark:bg-violet-900/20"
      title="Date Converter" description="BS/AD conversion, age, date & time differences"
      tabs={[
        {key:"convert",   label:"AD ↔ BS",     icon:"📅"},
        {key:"age",       label:"Age Calc",     icon:"🎂"},
        {key:"date-diff", label:"Date Diff",    icon:"📆"},
        {key:"time-diff", label:"Time Diff",    icon:"⏱️"},
      ]}
      activeTab={tab} onTab={(k)=>setTab(k as DateTab)} accentColor="bg-violet-500"
    >
      {tab==="convert"   && <ADToBSCalc/>}
      {tab==="age"       && <AgeCalc/>}
      {tab==="date-diff" && <DateDiffCalc/>}
      {tab==="time-diff" && <TimeDifference/>}
    </CalcShell>
  );
}