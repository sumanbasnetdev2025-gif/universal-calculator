"use client";
// ════════════════════════════════════════
// LAND UNITS CALCULATOR
// ════════════════════════════════════════
import { useState, useEffect } from "react";
import { MapPin, Fuel, Heart, Activity, CalendarCheck, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CalcShell, CalcGrid, CalcCard, CalcButton, ErrorMsg,
  FieldRow, FieldLabel, ResultRow, BigResult, InfoTable, StyledSelect, ToggleGroup,
} from "@/components/ui-kit/calc-layout";
import { cn, nepaliNumberFormat } from "@/lib/utils";

// ─────────────────────────────────────────
// LAND UNITS
// ─────────────────────────────────────────
const HILLY: Record<string,{label:string;toSqM:number}> = {
  ropani:  {label:"Ropani",       toSqM:508.72 },
  aana:    {label:"Aana",         toSqM:31.795 },
  paisa:   {label:"Paisa",        toSqM:7.9488 },
  daam:    {label:"Daam",         toSqM:1.9872 },
  sqft:    {label:"Sq. Feet",     toSqM:0.0929 },
  sqm:     {label:"Sq. Metres",   toSqM:1      },
  sqyard:  {label:"Sq. Yards",    toSqM:0.8361 },
  hectare: {label:"Hectare",      toSqM:10000  },
};
const TERAI: Record<string,{label:string;toSqM:number}> = {
  bigha:   {label:"Bigha",        toSqM:6772.63},
  kattha:  {label:"Kattha",       toSqM:338.63 },
  dhur:    {label:"Dhur",         toSqM:16.929 },
  sqft:    {label:"Sq. Feet",     toSqM:0.0929 },
  sqm:     {label:"Sq. Metres",   toSqM:1      },
  sqyard:  {label:"Sq. Yards",    toSqM:0.8361 },
  hectare: {label:"Hectare",      toSqM:10000  },
  ropani:  {label:"Ropani (hill)",toSqM:508.72 },
};

export function LandCalculator() {
  const [system,   setSystem]   = useState<"hilly"|"terai">("hilly");
  const [fromUnit, setFromUnit] = useState("ropani");
  const [toUnit,   setToUnit]   = useState("sqft");
  const [value,    setValue]    = useState("");
  const [result,   setResult]   = useState<number|null>(null);

  const units = system==="hilly" ? HILLY : TERAI;

  useEffect(() => {
    if (system==="hilly") { setFromUnit("ropani"); setToUnit("sqft"); }
    else { setFromUnit("bigha"); setToUnit("sqft"); }
    setResult(null); setValue("");
  }, [system]);

  useEffect(() => {
    const v=parseFloat(value);
    if (!v||v<=0) { setResult(null); return; }
    setResult((v*units[fromUnit].toSqM)/units[toUnit].toSqM);
  }, [value,fromUnit,toUnit,units]);

  const allConv = value&&parseFloat(value)>0
    ? Object.entries(units).map(([k,u])=>({key:k,label:u.label,value:(parseFloat(value)*units[fromUnit].toSqM)/u.toSqM}))
    : [];

  const unitOpts = Object.entries(units).map(([k,u])=>({value:k,label:u.label}));

  return (
    <CalcShell icon={MapPin} iconColor="text-teal-500" iconBg="bg-teal-50 dark:bg-teal-900/20"
      title="Land Units Converter" description="Ropani, Aana, Bigha, Kattha, Dhur and more"
      tabs={[{key:"hilly",label:"Hilly (Pahadi)",icon:"🏔️"},{key:"terai",label:"Terai",icon:"🌾"}]}
      activeTab={system} onTab={(k)=>setSystem(k as any)} accentColor="bg-teal-500">

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5 sm:p-6 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_44px_1fr] gap-3 sm:gap-4 items-end">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Value</label>
            <Input type="number" placeholder="Enter value" value={value} onChange={e=>setValue(e.target.value)} className="rounded-xl h-12 text-base" step="any"/>
            <label className="block text-sm font-medium pt-1">From</label>
            <StyledSelect value={fromUnit} onChange={setFromUnit} options={unitOpts}/>
          </div>
          <div className="flex sm:flex-col items-center justify-center sm:pt-6">
            <button onClick={()=>{setFromUnit(toUnit);setToUnit(fromUnit);}} className="w-10 h-10 rounded-xl border border-border bg-secondary hover:bg-secondary/70 flex items-center justify-center text-teal-500 transition-all hover:scale-110">⇄</button>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Result</label>
            <div className={cn("h-12 rounded-xl border flex items-center px-4 font-mono text-base font-bold",result?"border-teal-300 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300":"border-border bg-secondary/30 text-muted-foreground/50")}>
              {result!==null ? result.toLocaleString("en",{maximumFractionDigits:6}) : "—"}
            </div>
            <label className="block text-sm font-medium pt-1">To</label>
            <StyledSelect value={toUnit} onChange={setToUnit} options={unitOpts}/>
          </div>
        </div>
        {result!==null && (
          <div className="mt-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl px-4 py-3 text-sm text-center font-semibold text-teal-700 dark:text-teal-300">
            {parseFloat(value).toLocaleString()} {units[fromUnit].label} = {result.toLocaleString("en",{maximumFractionDigits:6})} {units[toUnit].label}
          </div>
        )}
      </div>

      {allConv.length>0 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5 mb-4">
          <h3 className="text-sm font-semibold mb-4">All Conversions for {parseFloat(value).toLocaleString()} {units[fromUnit].label}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allConv.map(c=>(
              <div key={c.key} className={cn("rounded-xl p-3 border",c.key===fromUnit?"border-teal-400 bg-teal-50 dark:bg-teal-900/20":"border-border bg-secondary/30")}>
                <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                <p className={cn("font-mono text-sm font-bold",c.key===fromUnit?"text-teal-600":"text-foreground")}>
                  {c.value<0.0001?c.value.toExponential(3):c.value.toLocaleString("en",{maximumFractionDigits:5})}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <InfoTable title={system==="hilly"?"Hilly Region Reference":"Terai Region Reference"} icon="ℹ️"
       rows={system==="hilly"
  ? [
      {label:"1 Ropani",         value:"16 Aana"       },
      {label:"1 Aana",           value:"4 Paisa"       },
      {label:"1 Paisa",          value:"4 Daam"        },
      {label:"1 Ropani (sq.ft)", value:"5,476 sq.ft"   },
      {label:"1 Ropani (sq.m)",  value:"508.72 sq.m"   },
    ]
  : [
      {label:"1 Bigha",          value:"20 Kattha"     },
      {label:"1 Kattha",         value:"20 Dhur"       },
      {label:"1 Bigha (sq.ft)",  value:"72,900 sq.ft"  },
      {label:"1 Bigha (sq.m)",   value:"6,772 sq.m"    },
      {label:"1 Kattha (sq.ft)", value:"3,645 sq.ft"   },
    ]
}/>
    </CalcShell>
  );
}

// ─────────────────────────────────────────
// FUEL COST
// ─────────────────────────────────────────
const FUEL_TYPES = [
  {key:"petrol",label:"Petrol",price:179,icon:"⛽"},
  {key:"diesel",label:"Diesel",price:163,icon:"🛢️"},
];
const VEHICLES = [
  {label:"Motorcycle",km:45,icon:"🏍️"},{label:"Hatchback",km:15,icon:"🚗"},
  {label:"Sedan",km:13,icon:"🚙"},{label:"SUV/Jeep",km:10,icon:"🚐"},
  {label:"Microbus",km:8,icon:"🚌"},{label:"Truck",km:5,icon:"🚛"},
];
const ROUTES = [
  {from:"Kathmandu",to:"Pokhara",km:200},{from:"Kathmandu",to:"Chitwan",km:150},
  {from:"Kathmandu",to:"Biratnagar",km:400},{from:"Kathmandu",to:"Butwal",km:270},
  {from:"Pokhara",to:"Chitwan",km:120},{from:"Kathmandu",to:"Nepalgunj",km:530},
];

export function FuelCalculator() {
  const [fuelType,   setFuelType]   = useState("petrol");
  const [distance,   setDistance]   = useState("");
  const [mileage,    setMileage]    = useState("");
  const [customPrice,setCustomPrice]= useState("");
  const [useCustom,  setUseCustom]  = useState(false);
  const [roundTrip,  setRoundTrip]  = useState(false);
  const [passengers, setPassengers] = useState("1");
  const [result,     setResult]     = useState<any>(null);
  const [error,      setError]      = useState<string|null>(null);

  const selFuel = FUEL_TYPES.find(f=>f.key===fuelType)!;
  const fuelPrice = useCustom ? parseFloat(customPrice)||0 : selFuel.price;

  const calc = () => {
    setError(null);
    const d=parseFloat(distance), m=parseFloat(mileage);
    if (!d||d<=0) return setError("Enter valid distance.");
    if (!m||m<=0) return setError("Enter valid mileage.");
    if (!fuelPrice||fuelPrice<=0) return setError("Enter valid fuel price.");
    const litres=d/m, cost=litres*fuelPrice, costPerKm=cost/d;
    setResult({dist:d,litres,cost,costPerKm,rtLitres:roundTrip?litres*2:undefined,rtCost:roundTrip?cost*2:undefined});
  };

  return (
    <CalcShell icon={Fuel} iconColor="text-red-500" iconBg="bg-red-50 dark:bg-red-900/20"
      title="Fuel Cost Calculator" description="Calculate fuel costs for any journey"
      tabs={[{key:"calc",label:"Calculator",icon:"⛽"},{key:"routes",label:"Popular Routes",icon:"🗺️"}]}
      activeTab="calc" onTab={()=>{}} accentColor="bg-red-500">

      <CalcGrid>
        <CalcCard title="Journey Details">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {FUEL_TYPES.map(f=>(
                <button key={f.key} onClick={()=>{setFuelType(f.key);setUseCustom(false);}} className={cn("flex items-center gap-2 p-3 rounded-xl border text-sm transition-all",fuelType===f.key&&!useCustom?"border-red-400 bg-red-50 dark:bg-red-900/20":"border-border hover:border-red-300")}>
                  <span>{f.icon}</span><div className="text-left"><p className="font-semibold text-xs">{f.label}</p><p className="text-xs text-muted-foreground">Rs. {f.price}/L</p></div>
                </button>
              ))}
            </div>

            {useCustom ? (
              <FieldRow><FieldLabel>Custom Price (Rs/L)</FieldLabel>
                <Input type="number" value={customPrice} onChange={e=>setCustomPrice(e.target.value)} className="rounded-xl mt-1.5"/>
              </FieldRow>
            ) : (
              <div className="flex justify-end"><button onClick={()=>setUseCustom(true)} className="text-xs text-red-500 hover:text-red-600">Use custom price</button></div>
            )}

            <FieldRow><FieldLabel>Distance (km)</FieldLabel>
              <Input type="number" placeholder="e.g. 200" value={distance} onChange={e=>setDistance(e.target.value)} className="rounded-xl mt-1.5"/>
            </FieldRow>

            <FieldRow>
              <FieldLabel>Vehicle Mileage (km/L)</FieldLabel>
              <Input type="number" placeholder="e.g. 15" value={mileage} onChange={e=>setMileage(e.target.value)} className="rounded-xl mt-1.5"/>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {VEHICLES.map(v=>(
                  <button key={v.label} onClick={()=>setMileage(String(v.km))} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-secondary hover:bg-secondary/70 transition-colors">
                    {v.icon} {v.label} (~{v.km})
                  </button>
                ))}
              </div>
            </FieldRow>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 cursor-pointer" onClick={()=>setRoundTrip(!roundTrip)}>
                <span className="text-sm font-medium">Round Trip</span>
                <div className={cn("w-10 h-5 rounded-full relative transition-colors",roundTrip?"bg-red-500":"bg-secondary border border-border")}>
                  <div className={cn("w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",roundTrip?"left-5":"left-0.5")}/>
                </div>
              </div>
              <FieldRow><FieldLabel>Passengers</FieldLabel>
                <Input type="number" value={passengers} onChange={e=>setPassengers(e.target.value)} className="rounded-xl h-11" min={1} max={50}/>
              </FieldRow>
            </div>

            <ErrorMsg message={error}/>
            <CalcButton onClick={calc} color="bg-red-500 hover:bg-red-600" icon={<Fuel className="w-4 h-4"/>}>Calculate Cost</CalcButton>
          </div>
        </CalcCard>

        {!result ? (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
            <Fuel className="w-8 h-8 text-red-300 mb-2"/>
            <p className="text-sm text-muted-foreground">Enter journey details to calculate</p>
            <div className="mt-4 grid grid-cols-2 gap-2 w-full">
              {ROUTES.map(r=>(
                <button key={r.from+r.to} onClick={()=>setDistance(String(r.km))} className="text-left p-2.5 rounded-xl border border-border hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <p className="text-xs text-muted-foreground">{r.from} → {r.to}</p>
                  <p className="font-mono text-sm font-bold">~{r.km} km</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 overflow-hidden bg-white dark:bg-white/5">
            <BigResult label="Total Fuel Cost" value={`Rs. ${nepaliNumberFormat(result.cost)}`} sub={`${result.litres.toFixed(2)} litres needed`} gradient="bg-gradient-to-r from-red-500 to-rose-600"/>
            <div className="p-4 space-y-2">
              <ResultRow label="Distance" value={`${result.dist} km`}/>
              <ResultRow label="Fuel Needed" value={`${result.litres.toFixed(2)} L`}/>
              <ResultRow label="Cost per km" value={`Rs. ${result.costPerKm.toFixed(2)}`}/>
              {result.rtCost && <ResultRow label="Round Trip Cost" value={`Rs. ${nepaliNumberFormat(result.rtCost)}`} highlight accent="bg-red-500"/>}
              {parseInt(passengers)>1 && (
                <ResultRow label={`Per person (${passengers} pax)`} value={`Rs. ${nepaliNumberFormat(result.cost/(parseInt(passengers)||1))}`}/>
              )}
            </div>
          </div>
        )}
      </CalcGrid>
    </CalcShell>
  );
}

// ─────────────────────────────────────────
// HEALTH & LIFESTYLE
// ─────────────────────────────────────────
function BMICalc() {
  const [sys,    setSys]    = useState<"metric"|"imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [htFt,   setHtFt]   = useState(""); const [htIn,setHtIn]=useState("");
  const [result, setResult] = useState<any>(null);
  const [error,  setError]  = useState<string|null>(null);

  const CATS=[
    {max:18.5,l:"Underweight",c:"text-blue-500",b:"bg-blue-500"},
    {max:25,  l:"Normal weight",c:"text-green-500",b:"bg-green-500"},
    {max:30,  l:"Overweight",c:"text-yellow-500",b:"bg-yellow-500"},
    {max:35,  l:"Obese Class I",c:"text-orange-500",b:"bg-orange-500"},
    {max:Infinity,l:"Obese Class II+",c:"text-red-500",b:"bg-red-500"},
  ];

  const calc=()=>{
    setError(null);
    let wkg=parseFloat(weight), hm: number;
    if (sys==="metric") { hm=parseFloat(height)/100; }
    else { hm=((parseFloat(htFt)||0)*12+(parseFloat(htIn)||0))*0.0254; wkg=wkg*0.453592; }
    if (!wkg||wkg<=0) return setError("Enter valid weight.");
    if (!hm||hm<=0)   return setError("Enter valid height.");
    const bmi=wkg/(hm*hm);
    const cat=CATS.find(c=>bmi<c.max)!;
    const hMin=parseFloat((18.5*hm*hm).toFixed(1)), hMax=parseFloat((24.9*hm*hm).toFixed(1));
    const pct=Math.min(100,Math.max(0,((bmi-10)/35)*100));
    setResult({bmi:parseFloat(bmi.toFixed(1)),...cat,hMin,hMax,pct});
  };

  return (
    <CalcGrid>
      <CalcCard title="Your Measurements">
        <div className="space-y-4">
          <ToggleGroup value={sys} onChange={v=>{setSys(v as any);setResult(null);setError(null);}} accent="bg-green-500"
            options={[{value:"metric",label:"Metric (kg/cm)"},{value:"imperial",label:"Imperial (lb/ft)"}]}/>
          <FieldRow><FieldLabel>Weight ({sys==="metric"?"kg":"lbs"})</FieldLabel>
            <Input type="number" placeholder={sys==="metric"?"e.g. 70":"e.g. 154"} value={weight} onChange={e=>setWeight(e.target.value)} className="rounded-xl mt-1.5" step="0.1"/>
          </FieldRow>
          {sys==="metric" ? (
            <FieldRow><FieldLabel>Height (cm)</FieldLabel>
              <Input type="number" placeholder="e.g. 170" value={height} onChange={e=>setHeight(e.target.value)} className="rounded-xl mt-1.5"/>
            </FieldRow>
          ) : (
            <FieldRow><FieldLabel>Height</FieldLabel>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <div className="relative"><Input type="number" placeholder="5" value={htFt} onChange={e=>setHtFt(e.target.value)} className="rounded-xl pr-8"/><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ft</span></div>
                <div className="relative"><Input type="number" placeholder="7" value={htIn} onChange={e=>setHtIn(e.target.value)} className="rounded-xl pr-8"/><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">in</span></div>
              </div>
            </FieldRow>
          )}
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-green-500 hover:bg-green-600" icon={<Activity className="w-4 h-4"/>}>Calculate BMI</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <Activity className="w-8 h-8 text-green-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter measurements to calculate BMI</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-white dark:bg-white/5 p-5 space-y-4">
          <div className="text-center py-2">
            <p className="font-display text-7xl font-bold text-foreground">{result.bmi}</p>
            <p className={cn("text-lg font-semibold mt-2",result.c)}>{result.l}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">BMI Scale</p>
            <div className="relative h-4 rounded-full overflow-hidden flex">
              <div className="flex-1 bg-blue-400"/><div className="flex-1 bg-green-400"/><div className="flex-1 bg-yellow-400"/><div className="flex-1 bg-orange-400"/><div className="flex-1 bg-red-500"/>
            </div>
            <div className="relative h-3 mt-0.5">
              <div className="absolute w-3 h-3 bg-foreground rounded-full top-0" style={{left:`calc(${result.pct}% - 6px)`}}/>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Healthy weight range for your height</p>
            <p className="font-display text-lg font-bold text-foreground">{result.hMin} – {result.hMax} kg</p>
          </div>
        </div>
      )}

      <div className="lg:col-span-2">
        <InfoTable title="BMI Categories" icon="📊" rows={[
          {label:"< 18.5",value:"Underweight"},
          {label:"18.5 – 24.9",value:"Normal weight"},
          {label:"25 – 29.9",value:"Overweight"},
          {label:"30 – 34.9",value:"Obese Class I"},
          {label:"≥ 35",value:"Obese Class II+"},
        ]}/>
      </div>
    </CalcGrid>
  );
}

function ExpiryCalc() {
  const [mfg,    setMfg]    = useState("");
  const [expiry, setExpiry] = useState("");
  const [name,   setName]   = useState("");
  const [result, setResult] = useState<any>(null);
  const [error,  setError]  = useState<string|null>(null);

  const calc=()=>{
    setError(null);
    if (!expiry) return setError("Enter expiry date.");
    const today=new Date(), exp=new Date(expiry);
    if (isNaN(exp.getTime())) return setError("Invalid expiry date.");
    const days=Math.ceil((exp.getTime()-today.getTime())/86400000);
    const mfgDate=mfg?new Date(mfg):null;
    const shelf=mfgDate?Math.ceil((exp.getTime()-mfgDate.getTime())/86400000):0;
    const mfgAgo=mfgDate?Math.ceil((today.getTime()-mfgDate.getTime())/86400000):0;
    const pct=shelf>0?Math.min(100,(mfgAgo/shelf)*100):0;
    const status=days<0?"expired":days<=30?"expiring":"fresh";
    const colors={expired:{bg:"bg-red-50 dark:bg-red-900/20",border:"border-red-200",text:"text-red-600",label:"Expired"},
      expiring:{bg:"bg-orange-50 dark:bg-orange-900/20",border:"border-orange-200",text:"text-orange-600",label:"Expiring Soon"},
      fresh:{bg:"bg-green-50 dark:bg-green-900/20",border:"border-green-200",text:"text-green-600",label:"Fresh"}};
    setResult({days,shelf,mfgAgo,pct,status,...colors[status]});
  };

  return (
    <CalcGrid>
      <CalcCard title="Product Details">
        <div className="space-y-4">
          <FieldRow><FieldLabel>Product Name <span className="text-muted-foreground font-normal text-xs">optional</span></FieldLabel>
            <Input placeholder="e.g. Milk, Medicine" value={name} onChange={e=>setName(e.target.value)} className="rounded-xl mt-1.5"/>
          </FieldRow>
          <FieldRow><FieldLabel>Manufacture Date <span className="text-muted-foreground font-normal text-xs">optional</span></FieldLabel>
            <Input type="date" value={mfg} onChange={e=>setMfg(e.target.value)} className="rounded-xl mt-1.5"/>
          </FieldRow>
          <FieldRow><FieldLabel>Expiry / Best Before Date</FieldLabel>
            <Input type="date" value={expiry} onChange={e=>setExpiry(e.target.value)} className="rounded-xl mt-1.5"/>
          </FieldRow>
          <ErrorMsg message={error}/>
          <CalcButton onClick={calc} color="bg-green-500 hover:bg-green-600" icon={<CalendarCheck className="w-4 h-4"/>}>Check Expiry</CalcButton>
        </div>
      </CalcCard>

      {!result ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
          <CalendarCheck className="w-8 h-8 text-green-300 mb-2"/>
          <p className="text-sm text-muted-foreground">Enter dates to check expiry</p>
        </div>
      ) : (
        <div className={cn("rounded-2xl border p-5 space-y-4",result.bg,result.border)}>
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl",result.bg)}>
              {result.status==="fresh"?"✅":result.status==="expiring"?"⚠️":"❌"}
            </div>
            <div>
              <p className={cn("font-display text-lg font-bold",result.text)}>{result.label}</p>
              {name && <p className="text-sm text-muted-foreground">{name}</p>}
            </div>
          </div>
          <p className={cn("text-2xl font-bold font-display",result.text)}>
            {result.days<0?`Expired ${Math.abs(result.days)} days ago`:`${result.days} days remaining`}
          </p>
          {result.shelf>0 && (
            <div className="space-y-2">
              <div className="h-2.5 bg-white/60 dark:bg-white/10 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all",result.status==="fresh"?"bg-green-500":result.status==="expiring"?"bg-orange-500":"bg-red-500")} style={{width:`${result.pct}%`}}/>
              </div>
              <p className="text-xs text-muted-foreground">{result.pct.toFixed(0)}% of shelf life used · {result.shelf} days total shelf life</p>
            </div>
          )}
        </div>
      )}
    </CalcGrid>
  );
}

function PercentCalc() {
  type Mode="percent-of"|"what-percent"|"change"|"add"|"subtract"|"marks";
  const MODES: {key:Mode;label:string;desc:string}[]=[
    {key:"percent-of",  label:"% of Number",    desc:"X% of Y = ?"},
    {key:"what-percent",label:"What % is X of Y",desc:"X is what % of Y"},
    {key:"change",      label:"% Change",        desc:"Old → New % change"},
    {key:"add",         label:"Add %",           desc:"Y + X% = ?"},
    {key:"subtract",    label:"Subtract %",      desc:"Y − X% = ?"},
    {key:"marks",       label:"Marks / Score",   desc:"Score to percentage"},
  ];
  const [mode,  setMode]  = useState<Mode>("percent-of");
  const [a,     setA]     = useState("");
  const [b,     setB]     = useState("");
  const [result,setResult]= useState<string|null>(null);

  const labels: Record<Mode,[string,string,string]>={
    "percent-of":  ["Percentage (%)","Number","Result"],
    "what-percent":["Value (X)","Total (Y)","X is ?% of Y"],
    "change":      ["Old Value","New Value","% Change"],
    "add":         ["Percentage (%)","Number","Result"],
    "subtract":    ["Percentage (%)","Number","Result"],
    "marks":       ["Marks Obtained","Total Marks","Percentage"],
  };

  const calc=()=>{
    const av=parseFloat(a), bv=parseFloat(b);
    if (isNaN(av)||isNaN(bv)||bv===0) { setResult(null); return; }
    let r: string;
    switch(mode) {
      case "percent-of":   r=String(parseFloat(((av/100)*bv).toFixed(6)).toString()); break;
      case "what-percent": r=`${((av/bv)*100).toFixed(4)}%`; break;
      case "change":       r=`${(((bv-av)/av)*100).toFixed(4)}%`; break;
      case "add":          r=String(parseFloat((bv+(bv*av/100)).toFixed(6))); break;
      case "subtract":     r=String(parseFloat((bv-(bv*av/100)).toFixed(6))); break;
      case "marks":        r=`${((av/bv)*100).toFixed(2)}%`; break;
      default: r="";
    }
    setResult(r);
  };

  const [la,lb,lr]=labels[mode];

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Calculation Type</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MODES.map(m=>(
            <button key={m.key} onClick={()=>{setMode(m.key);setResult(null);setA("");setB("");}} className={cn("p-3 rounded-xl border text-left transition-all",mode===m.key?"border-green-500 bg-green-50 dark:bg-green-900/20":"border-border hover:border-green-300")}>
              <p className="text-sm font-semibold text-foreground">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <CalcGrid>
        <CalcCard>
          <div className="space-y-4">
            <FieldRow><FieldLabel>{la}</FieldLabel>
              <Input type="number" placeholder="Enter value" value={a} onChange={e=>{setA(e.target.value);setResult(null);}} className="rounded-xl mt-1.5" step="any"/>
            </FieldRow>
            <FieldRow><FieldLabel>{lb}</FieldLabel>
              <Input type="number" placeholder="Enter value" value={b} onChange={e=>{setB(e.target.value);setResult(null);}} className="rounded-xl mt-1.5" step="any"/>
            </FieldRow>
            <CalcButton onClick={calc} color="bg-green-500 hover:bg-green-600" icon={<Percent className="w-4 h-4"/>}>Calculate</CalcButton>
          </div>
        </CalcCard>

        {!result ? (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center p-8">
            <Percent className="w-8 h-8 text-green-300 mb-2"/>
            <p className="text-sm text-muted-foreground">Enter values to calculate</p>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-5 flex flex-col items-center justify-center">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-3">{lr}</p>
            <p className="font-display text-5xl font-bold text-foreground">{result}</p>
          </div>
        )}
      </CalcGrid>

      {(a||b) && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick % Reference</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[10,15,20,25,50,75].map(pct=>{
              const base=parseFloat(b)||parseFloat(a)||100;
              return (
                <div key={pct} className="bg-secondary/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{pct}%</p>
                  <p className="font-mono text-sm font-bold text-foreground">{((pct/100)*base).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">of {base}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function HealthCalculator() {
  const [tab,setTab]=useState<"bmi"|"expiry"|"percentage">("bmi");
  return (
    <CalcShell icon={Heart} iconColor="text-green-500" iconBg="bg-green-50 dark:bg-green-900/20"
      title="Health & Lifestyle" description="BMI, expiry date, percentage calculator"
      tabs={[{key:"bmi",label:"BMI Calculator",icon:"⚖️"},{key:"expiry",label:"Expiry Date",icon:"📅"},{key:"percentage",label:"Percentage",icon:"%"}]}
      activeTab={tab} onTab={(k)=>setTab(k as any)} accentColor="bg-green-500">
      {tab==="bmi"        && <BMICalc/>}
      {tab==="expiry"     && <ExpiryCalc/>}
      {tab==="percentage" && <PercentCalc/>}
    </CalcShell>
  );
}