"use client";
import { useState } from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CalcShell, CalcGrid, CalcCard, CalcButton, ErrorMsg,
  FieldRow, FieldLabel, ResultRow, BigResult, InfoTable, StyledSelect, ToggleGroup,
} from "@/components/ui-kit/calc-layout";
import { cn, nepaliNumberFormat } from "@/lib/utils";

// ── Concrete ──────────────────────────────────────────────────────────────────
function ConcreteCalc() {
  const [length,  setLength]  = useState("");
  const [width,   setWidth]   = useState("");
  const [depth,   setDepth]   = useState("");
  const [unit,    setUnit]    = useState("ft");
  const [mix,     setMix]     = useState("1:2:4");
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState<string|null>(null);

  const MIX: Record<string, { c:number; s:number; a:number; grade:string }> = {
    "1:1.5:3":{ c:1, s:1.5, a:3, grade:"M20" },
    "1:2:4":  { c:1, s:2,   a:4, grade:"M15" },
    "1:3:6":  { c:1, s:3,   a:6, grade:"M10" },
    "1:4:8":  { c:1, s:4,   a:8, grade:"M7.5"},
  };

  const calc = () => {
    setError(null);
    const l=parseFloat(length), w=parseFloat(width), d=parseFloat(depth);
    if (!l||!w||!d) return setError("Enter all dimensions.");
    const f = unit==="ft" ? 0.3048 : 1;
    const vol = l*f*w*f*d*f;
    const r = MIX[mix]; const tp = r.c+r.s+r.a; const dv = vol*1.54;
    const cVol=(r.c/tp)*dv, sVol=(r.s/tp)*dv, aVol=(r.a/tp)*dv;
    const cKg=cVol*1440; const bags=Math.ceil(cKg/50);
    setResult({ vol:vol.toFixed(3), cVol:cVol.toFixed(3), sVol:sVol.toFixed(3), aVol:aVol.toFixed(3),
      cKg:cKg.toFixed(1), bags, water:(cKg*0.45).toFixed(1) });
  };

  return (
    <CalcGrid>
      <CalcCard title="Dimensions">
        <div className="space-y-4">
          <ToggleGroup value={unit} onChange={setUnit} accent="bg-orange-500"
            options={[{value:"ft",label:"Feet"},{value:"m",label:"Metres"}]} />
          <div className="grid grid-cols-3 gap-3">
            {[["Length",length,setLength],["Width",width,setWidth],["Depth",depth,setDepth]].map(([lbl,val,set]:any)=>(
              <FieldRow key={lbl}>
                <FieldLabel>{lbl} ({unit})</FieldLabel>
                <Input type="number" placeholder="0" value={val} onChange={e=>set(e.target.value)} className="rounded-xl" />
              </FieldRow>
            ))}
          </div>
          <FieldRow>
            <FieldLabel>Mix Ratio</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(MIX).map(([r,m])=>(
                <button key={r} onClick={()=>setMix(r)} className={cn(
                  "p-2.5 rounded-xl border text-left text-sm transition-all",
                  mix===r?"border-orange-500 bg-orange-50 dark:bg-orange-900/20":"border-border hover:border-orange-300"
                )}>
                  <span className="font-bold">{r}</span>
                  <span className="text-xs text-muted-foreground ml-2">{m.grade}</span>
                </button>
              ))}
            </div>
          </FieldRow>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-orange-500 hover:bg-orange-600" icon={<Building2 className="w-4 h-4"/>}>
            Calculate Materials
          </CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Building2 className="w-10 h-10 text-orange-300 mb-3"/>
          <p className="text-sm text-muted-foreground">Enter dimensions to calculate</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <BigResult label="Concrete Volume" value={`${result.vol} m³`} gradient="bg-gradient-to-r from-orange-500 to-red-500"/>
          <div className="p-4 space-y-2">
            {[
              { label:"🏷️ Cement",          value:`${result.bags} bags (${result.cKg} kg)` },
              { label:"🪨 Sand",             value:`${result.sVol} m³` },
              { label:"⬛ Coarse Aggregate", value:`${result.aVol} m³` },
              { label:"💧 Water",            value:`${result.water} L` },
            ].map(r=><ResultRow key={r.label} label={r.label} value={r.value}/>)}
          </div>
        </div>
      )}
    </CalcGrid>
  );
}

// ── Brickwork ─────────────────────────────────────────────────────────────────
function BrickworkCalc() {
  const [length,   setLength]   = useState("");
  const [height,   setHeight]   = useState("");
  const [unit,     setUnit]     = useState("ft");
  const [thickness,setThickness]= useState("one");
  const [result,   setResult]   = useState<any>(null);
  const [error,    setError]    = useState<string|null>(null);

  const THICK: Record<string,{m:number;label:string}> = {
    half:     {m:0.115,label:"Half Brick (115mm)"},
    one:      {m:0.230,label:"One Brick (230mm)"},
    "one-half":{m:0.345,label:"One & Half (345mm)"},
  };

  const calc = () => {
    setError(null);
    const l=parseFloat(length), h=parseFloat(height);
    if (!l||!h) return setError("Enter wall length and height.");
    const f=unit==="ft"?0.3048:1;
    const lm=l*f, hm=h*f, tm=THICK[thickness].m;
    const vol=lm*hm*tm, area=lm*hm;
    const bricks=Math.ceil(vol/(0.230*0.115*0.075)*0.7*1.05);
    const mortarVol=vol*0.30*1.3;
    const tp=7; const cBags=Math.ceil((mortarVol/tp)*1440/50);
    const sand=parseFloat(((6/tp)*mortarVol).toFixed(3));
    setResult({ area:area.toFixed(2), vol:vol.toFixed(3), bricks, cBags, sand });
  };

  return (
    <CalcGrid>
      <CalcCard title="Wall Details">
        <div className="space-y-4">
          <ToggleGroup value={unit} onChange={setUnit} accent="bg-orange-500"
            options={[{value:"ft",label:"Feet"},{value:"m",label:"Metres"}]}/>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow>
              <FieldLabel>Length ({unit})</FieldLabel>
              <Input type="number" placeholder="0" value={length} onChange={e=>setLength(e.target.value)} className="rounded-xl"/>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Height ({unit})</FieldLabel>
              <Input type="number" placeholder="0" value={height} onChange={e=>setHeight(e.target.value)} className="rounded-xl"/>
            </FieldRow>
          </div>
          <FieldRow>
            <FieldLabel>Wall Thickness</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(THICK).map(([k,v])=>(
                <button key={k} onClick={()=>setThickness(k)} className={cn(
                  "p-2 rounded-xl border text-xs text-center transition-all",
                  thickness===k?"border-orange-500 bg-orange-50 dark:bg-orange-900/20":"border-border hover:border-orange-300"
                )}>{v.label}</button>
              ))}
            </div>
          </FieldRow>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-orange-500 hover:bg-orange-600">Calculate Brickwork</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Building2 className="w-10 h-10 text-orange-300 mb-3"/>
          <p className="text-sm text-muted-foreground">Enter dimensions to calculate</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <BigResult label="Wall Area" value={`${result.area} m²`} sub={`${result.vol} m³ volume`} gradient="bg-gradient-to-r from-orange-500 to-red-500"/>
          <div className="p-4 space-y-2">
            {[
              {label:"🧱 Bricks Required", value:`${result.bricks.toLocaleString()} nos`},
              {label:"🏷️ Cement (1:6)",    value:`${result.cBags} bags`},
              {label:"🪨 Sand",            value:`${result.sand} m³`},
            ].map(r=><ResultRow key={r.label} label={r.label} value={r.value}/>)}
          </div>
        </div>
      )}
    </CalcGrid>
  );
}

// ── Plastering ────────────────────────────────────────────────────────────────
function PlasteringCalc() {
  const [area,    setArea]    = useState("");
  const [thick,   setThick]   = useState("12");
  const [ratio,   setRatio]   = useState("1:4");
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState<string|null>(null);

  const calc = () => {
    setError(null);
    const a=parseFloat(area), t=parseFloat(thick)/1000;
    if (!a||a<=0) return setError("Enter a valid area.");
    const vol=a*t*1.35;
    const parts=ratio==="1:3"?4:ratio==="1:4"?5:6;
    const cVol=(1/parts)*vol, cKg=cVol*1440, bags=Math.ceil(cKg/50);
    const sVol=parseFloat(((parts-1)/parts*vol).toFixed(3));
    setResult({ vol:vol.toFixed(3), bags, cKg:cKg.toFixed(1), sVol, water:(cKg*0.55).toFixed(1) });
  };

  return (
    <CalcGrid>
      <CalcCard title="Plastering Details">
        <div className="space-y-4">
          <FieldRow>
            <FieldLabel>Surface Area (m²)</FieldLabel>
            <Input type="number" placeholder="e.g. 100" value={area} onChange={e=>setArea(e.target.value)} className="rounded-xl"/>
          </FieldRow>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow>
              <FieldLabel>Thickness (mm)</FieldLabel>
              <StyledSelect value={thick} onChange={setThick} options={[{value:"6",label:"6 mm"},{value:"10",label:"10 mm"},{value:"12",label:"12 mm"},{value:"20",label:"20 mm"}]}/>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Mix Ratio</FieldLabel>
              <StyledSelect value={ratio} onChange={setRatio} options={[{value:"1:3",label:"1:3 (Rich)"},{value:"1:4",label:"1:4 (Standard)"},{value:"1:5",label:"1:5 (Lean)"}]}/>
            </FieldRow>
          </div>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-orange-500 hover:bg-orange-600">Calculate Plastering</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Building2 className="w-10 h-10 text-orange-300 mb-3"/>
          <p className="text-sm text-muted-foreground">Enter area to calculate materials</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <BigResult label="Dry Mortar Volume" value={`${result.vol} m³`} gradient="bg-gradient-to-r from-orange-500 to-red-500"/>
          <div className="p-4 space-y-2">
            {[
              {label:"🏷️ Cement", value:`${result.bags} bags (${result.cKg} kg)`},
              {label:"🪨 Sand",   value:`${result.sVol} m³`},
              {label:"💧 Water",  value:`${result.water} L`},
            ].map(r=><ResultRow key={r.label} label={r.label} value={r.value}/>)}
          </div>
        </div>
      )}
    </CalcGrid>
  );
}

// ── Rebar Weight ──────────────────────────────────────────────────────────────
// Unit weight = (D²/162) kg/m   where D = diameter in mm
const REBAR_SIZES = [8,10,12,16,20,25,32].map(d=>({
  value:String(d), label:`${d} mm`,
  weightPerMeter: parseFloat((d*d/162).toFixed(4)),
}));

function RebarCalc() {
  const [dia,    setDia]    = useState("12");
  const [length, setLength] = useState("");
  const [qty,    setQty]    = useState("1");
  const [result, setResult] = useState<any>(null);
  const [error,  setError]  = useState<string|null>(null);

  const info = REBAR_SIZES.find(r=>r.value===dia)!;

  const calc = () => {
    setError(null);
    const l=parseFloat(length), q=parseInt(qty)||1;
    if (!l||l<=0) return setError("Enter a valid length.");
    const lenM = l*0.3048; // ft to m
    const totalM = lenM*q;
    const weight = parseFloat((totalM*info.weightPerMeter).toFixed(3));
    setResult({ lengthM:totalM.toFixed(2), weight, weightPerBar:(lenM*info.weightPerMeter).toFixed(3) });
  };

  return (
    <CalcGrid>
      <CalcCard title="Rebar Weight Calculator">
        <div className="space-y-4">
          <FieldRow>
            <FieldLabel>Bar Diameter (mm)</FieldLabel>
            <StyledSelect value={dia} onChange={setDia} options={REBAR_SIZES.map(r=>({value:r.value,label:r.label}))}/>
          </FieldRow>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow>
              <FieldLabel>Length (ft)</FieldLabel>
              <Input type="number" placeholder="e.g. 40" value={length} onChange={e=>setLength(e.target.value)} className="rounded-xl"/>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Quantity</FieldLabel>
              <Input type="number" placeholder="1" value={qty} onChange={e=>setQty(e.target.value)} className="rounded-xl" min={1}/>
            </FieldRow>
          </div>
          <div className="text-xs text-muted-foreground bg-secondary/50 rounded-xl p-3">
            Weight/m for {dia}mm = <strong>{info.weightPerMeter} kg/m</strong>
            {" "}(Formula: D²/162)
          </div>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-orange-500 hover:bg-orange-600">Calculate</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Building2 className="w-10 h-10 text-orange-300 mb-3"/>
          <p className="text-sm text-muted-foreground">Enter bar details to calculate weight</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
          <BigResult label="Total Weight" value={`${result.weight} kg`} sub={`${result.lengthM} m total length`} gradient="bg-gradient-to-r from-orange-500 to-red-500"/>
          <div className="p-4 space-y-2">
            <ResultRow label="Weight per bar" value={`${result.weightPerBar} kg`}/>
            <ResultRow label="Total length"   value={`${result.lengthM} m`}/>
            <ResultRow label="Unit weight"    value={`${info.weightPerMeter} kg/m`}/>
          </div>
        </div>
      )}

      {/* Reference table */}
      <div className="lg:col-span-2 mt-0">
        <InfoTable title="Rebar Weight Reference (kg/m)" icon="🔩" rows={
          REBAR_SIZES.map(r=>({ label:`${r.label} dia`, value:`${r.weightPerMeter} kg/m` }))
        }/>
      </div>
    </CalcGrid>
  );
}

// ── BOQ ───────────────────────────────────────────────────────────────────────
function BOQCalc() {
  const [items,  setItems]  = useState<{id:string;desc:string;unit:string;qty:number;rate:number}[]>([]);
  const [desc,   setDesc]   = useState("");
  const [unit,   setUnit]   = useState("m²");
  const [qty,    setQty]    = useState("");
  const [rate,   setRate]   = useState("");
  const [error,  setError]  = useState<string|null>(null);

  const add = () => {
    setError(null);
    if (!desc.trim()) return setError("Enter description.");
    const q=parseFloat(qty), r=parseFloat(rate);
    if (!q||!r) return setError("Enter valid quantity and rate.");
    setItems([...items, {id:Date.now().toString(),desc:desc.trim(),unit,qty:q,rate:r}]);
    setDesc(""); setQty(""); setRate("");
  };

  const total    = items.reduce((s,i)=>s+i.qty*i.rate, 0);
  const contingency = total*0.05;

  return (
    <div className="space-y-4">
      <CalcCard title="Add Item">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
          <div className="sm:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <Input placeholder="Work item" value={desc} onChange={e=>setDesc(e.target.value)} className="rounded-xl mt-1.5"/>
          </div>
          <div>
            <FieldLabel>Unit</FieldLabel>
            <StyledSelect value={unit} onChange={setUnit} options={["m²","m³","m","nos","kg","bags","ls"].map(u=>({value:u,label:u}))}/>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:col-span-1">
            <div><FieldLabel>Qty</FieldLabel><Input type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} className="rounded-xl mt-1.5"/></div>
            <div><FieldLabel>Rate</FieldLabel><Input type="number" placeholder="0" value={rate} onChange={e=>setRate(e.target.value)} className="rounded-xl mt-1.5"/></div>
          </div>
        </div>
        <ErrorMsg message={error}/>
        <button onClick={add} className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4"/> Add Item
        </button>
      </CalcCard>

      {items.length > 0 ? (
        <CalcCard title="Bill of Quantities">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                {["#","Description","Unit","Qty","Rate","Amount",""].map(h=>(
                  <th key={h} className="text-left py-2 px-2 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {items.map((item,i)=>(
                  <tr key={item.id} className="border-b border-border/30 hover:bg-secondary/20">
                    <td className="py-2.5 px-2 text-muted-foreground">{i+1}</td>
                    <td className="py-2.5 px-2 font-medium">{item.desc}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{item.unit}</td>
                    <td className="py-2.5 px-2 font-mono">{item.qty}</td>
                    <td className="py-2.5 px-2 font-mono">{nepaliNumberFormat(item.rate)}</td>
                    <td className="py-2.5 px-2 font-mono font-semibold">{nepaliNumberFormat(item.qty*item.rate)}</td>
                    <td className="py-2.5 px-2">
                      <button onClick={()=>setItems(items.filter(x=>x.id!==item.id))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="space-y-1.5 w-64">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">Rs. {nepaliNumberFormat(total)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Contingency (5%)</span><span className="font-mono">Rs. {nepaliNumberFormat(contingency)}</span></div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                <span>Grand Total</span>
                <span className="font-mono text-orange-500">Rs. {nepaliNumberFormat(total+contingency)}</span>
              </div>
            </div>
          </div>
        </CalcCard>
      ) : (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-12 text-center">
          <Building2 className="w-10 h-10 text-orange-300 mb-3"/>
          <p className="text-sm font-medium text-foreground">No items yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add items above to build your BOQ</p>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
type ConstructionTab = "concrete"|"brickwork"|"plastering"|"rebar"|"boq";

export default function ConstructionCalculator() {
  const [tab, setTab] = useState<ConstructionTab>("concrete");

  return (
    <CalcShell
      icon={Building2} iconColor="text-orange-500" iconBg="bg-orange-50 dark:bg-orange-900/20"
      title="Construction Calculator" description="Concrete, brickwork, plastering & more"
      tabs={[
        {key:"concrete",   label:"Concrete"  },
        {key:"brickwork",  label:"Brickwork" },
        {key:"plastering", label:"Plastering"},
        {key:"rebar",      label:"Rebar"     },
        {key:"boq",        label:"BOQ"       },
      ]}
      activeTab={tab} onTab={(k)=>setTab(k as ConstructionTab)} accentColor="bg-orange-500"
    >
      {tab==="concrete"   && <ConcreteCalc/>}
      {tab==="brickwork"  && <BrickworkCalc/>}
      {tab==="plastering" && <PlasteringCalc/>}
      {tab==="rebar"      && <RebarCalc/>}
      {tab==="boq"        && <BOQCalc/>}
    </CalcShell>
  );
}