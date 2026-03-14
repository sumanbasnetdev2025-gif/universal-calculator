"use client";
import { useState, useEffect } from "react";
import { ArrowLeftRight, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CalcShell, InfoTable, TwoColInfo, StyledSelect } from "@/components/ui-kit/calc-layout";
import { cn } from "@/lib/utils";

type UnitDef = { label: string; toBase: (v: number) => number; fromBase: (v: number) => number };

const CATS: Record<string, {
  label: string; icon: string;
  accent: string; accentText: string;
  units: Record<string, UnitDef>;
  commonConversions: { label: string; value: string }[];
  formulas: string[];
}> = {
  length: {
    label: "Length", icon: "📏",
    accent: "bg-pink-500", accentText: "text-pink-500",
    units: {
      mm:   { label:"Millimetre (mm)",  toBase:v=>v/1000,      fromBase:v=>v*1000      },
      cm:   { label:"Centimetre (cm)",  toBase:v=>v/100,       fromBase:v=>v*100       },
      m:    { label:"Meter (m)",        toBase:v=>v,           fromBase:v=>v           },
      km:   { label:"Kilometer (km)",   toBase:v=>v*1000,      fromBase:v=>v/1000      },
      inch: { label:"Inch (in)",        toBase:v=>v*0.0254,    fromBase:v=>v/0.0254    },
      ft:   { label:"Foot (ft)",        toBase:v=>v*0.3048,    fromBase:v=>v/0.3048    },
      yard: { label:"Yard (yd)",        toBase:v=>v*0.9144,    fromBase:v=>v/0.9144    },
      mile: { label:"Mile (mi)",        toBase:v=>v*1609.344,  fromBase:v=>v/1609.344  },
    },
    commonConversions: [
      { label:"1 meter",      value:"3.281 feet"   },
      { label:"1 kilometer",  value:"0.621 miles"  },
      { label:"1 inch",       value:"2.54 cm"      },
      { label:"1 foot",       value:"12 inches"    },
      { label:"1 mile",       value:"1.609 km"     },
      { label:"1 yard",       value:"3 feet"       },
    ],
    formulas: ["Results calculated in real-time.", "Maximum precision: 8 decimal places.", "Base unit: Metre (m)"],
  },
  weight: {
    label:"Weight", icon:"⚖️",
    accent:"bg-blue-500", accentText:"text-blue-500",
    units: {
      mg:    { label:"Milligram (mg)",  toBase:v=>v/1e6,       fromBase:v=>v*1e6       },
      g:     { label:"Gram (g)",        toBase:v=>v/1000,      fromBase:v=>v*1000      },
      kg:    { label:"Kilogram (kg)",   toBase:v=>v,           fromBase:v=>v           },
      tonne: { label:"Metric Tonne",    toBase:v=>v*1000,      fromBase:v=>v/1000      },
      lb:    { label:"Pound (lb)",      toBase:v=>v*0.453592,  fromBase:v=>v/0.453592  },
      oz:    { label:"Ounce (oz)",      toBase:v=>v*0.028350,  fromBase:v=>v/0.028350  },
      tola:  { label:"Tola (Nepal)",    toBase:v=>v*0.011664,  fromBase:v=>v/0.011664  },
    },
    commonConversions: [
      { label:"1 kilogram",   value:"2.205 pounds" },
      { label:"1 pound",      value:"453.6 grams"  },
      { label:"1 tonne",      value:"1000 kg"      },
      { label:"1 ounce",      value:"28.35 grams"  },
      { label:"1 tola",       value:"11.664 grams" },
    ],
    formulas: ["Base unit: Kilogram (kg)", "Tola is traditional Nepal gold unit (11.664g)"],
  },
  temperature: {
    label:"Temperature", icon:"🌡️",
    accent:"bg-orange-500", accentText:"text-orange-500",
    units: {
      c: { label:"Celsius (°C)",    toBase:v=>v,               fromBase:v=>v              },
      f: { label:"Fahrenheit (°F)", toBase:v=>(v-32)*5/9,     fromBase:v=>v*9/5+32       },
      k: { label:"Kelvin (K)",      toBase:v=>v-273.15,        fromBase:v=>v+273.15        },
    },
    commonConversions: [
      { label:"0°C",    value:"32°F / 273.15K" },
      { label:"100°C",  value:"212°F / 373.15K" },
      { label:"37°C",   value:"98.6°F (body temp)" },
      { label:"-40°C",  value:"-40°F (same point)" },
    ],
    formulas: ["°F = (°C × 9/5) + 32", "K = °C + 273.15", "°C = (°F − 32) × 5/9"],
  },
  speed: {
    label:"Speed", icon:"🚀",
    accent:"bg-violet-500", accentText:"text-violet-500",
    units: {
      mps:  { label:"m/s",   toBase:v=>v,           fromBase:v=>v           },
      kph:  { label:"km/h",  toBase:v=>v/3.6,       fromBase:v=>v*3.6       },
      mph:  { label:"mph",   toBase:v=>v*0.44704,   fromBase:v=>v/0.44704   },
      knot: { label:"Knot",  toBase:v=>v*0.514444,  fromBase:v=>v/0.514444  },
    },
    commonConversions: [
      { label:"1 m/s",   value:"3.6 km/h" },
      { label:"1 km/h",  value:"0.278 m/s" },
      { label:"1 mph",   value:"1.609 km/h" },
      { label:"1 knot",  value:"1.852 km/h" },
    ],
    formulas: ["Base unit: m/s", "Speed of light: 299,792,458 m/s"],
  },
  volume: {
    label:"Volume", icon:"🧴",
    accent:"bg-cyan-500", accentText:"text-cyan-500",
    units: {
      ml:   { label:"Millilitre (ml)", toBase:v=>v/1000,      fromBase:v=>v*1000      },
      l:    { label:"Litre (L)",       toBase:v=>v,           fromBase:v=>v           },
      m3:   { label:"Cubic Metre",     toBase:v=>v*1000,      fromBase:v=>v/1000      },
      gal:  { label:"Gallon (US)",     toBase:v=>v*3.78541,   fromBase:v=>v/3.78541   },
      pt:   { label:"Pint (US)",       toBase:v=>v*0.473176,  fromBase:v=>v/0.473176  },
      cup:  { label:"Cup (US)",        toBase:v=>v*0.236588,  fromBase:v=>v/0.236588  },
      tbsp: { label:"Tablespoon",      toBase:v=>v*0.014787,  fromBase:v=>v/0.014787  },
    },
    commonConversions: [
      { label:"1 litre",    value:"1000 ml" },
      { label:"1 gallon",   value:"3.785 litres" },
      { label:"1 cup",      value:"236.6 ml" },
      { label:"1 pint",     value:"473.2 ml" },
    ],
    formulas: ["Base unit: Litre (L)", "1 m³ = 1000 litres"],
  },
  area: {
    label:"Area", icon:"📐",
    accent:"bg-emerald-500", accentText:"text-emerald-500",
    units: {
      sqm:   { label:"m²",       toBase:v=>v,          fromBase:v=>v          },
      sqkm:  { label:"km²",      toBase:v=>v*1e6,      fromBase:v=>v/1e6      },
      sqft:  { label:"ft²",      toBase:v=>v*0.0929,   fromBase:v=>v/0.0929   },
      sqyd:  { label:"yd²",      toBase:v=>v*0.8361,   fromBase:v=>v/0.8361   },
      acre:  { label:"Acre",     toBase:v=>v*4046.86,  fromBase:v=>v/4046.86  },
      ha:    { label:"Hectare",  toBase:v=>v*10000,    fromBase:v=>v/10000    },
    },
    commonConversions: [
      { label:"1 hectare",   value:"10,000 m²" },
      { label:"1 acre",      value:"4,047 m²" },
      { label:"1 km²",       value:"100 hectares" },
      { label:"1 ft²",       value:"0.0929 m²" },
    ],
    formulas: ["Base unit: Square Metre (m²)", "1 km² = 1,000,000 m²"],
  },
  data: {
    label:"Data", icon:"💾",
    accent:"bg-amber-500", accentText:"text-amber-500",
    units: {
      bit:  { label:"Bit",       toBase:v=>v/8,          fromBase:v=>v*8          },
      byte: { label:"Byte",      toBase:v=>v,            fromBase:v=>v            },
      kb:   { label:"Kilobyte",  toBase:v=>v*1024,       fromBase:v=>v/1024       },
      mb:   { label:"Megabyte",  toBase:v=>v*1024**2,    fromBase:v=>v/1024**2    },
      gb:   { label:"Gigabyte",  toBase:v=>v*1024**3,    fromBase:v=>v/1024**3    },
      tb:   { label:"Terabyte",  toBase:v=>v*1024**4,    fromBase:v=>v/1024**4    },
    },
    commonConversions: [
      { label:"1 KB",   value:"1,024 bytes" },
      { label:"1 MB",   value:"1,024 KB" },
      { label:"1 GB",   value:"1,024 MB" },
      { label:"1 TB",   value:"1,024 GB" },
    ],
    formulas: ["Binary system: 1 KB = 1024 bytes", "Base unit: Byte"],
  },
};

function fmt(n: number): string {
  if (!isFinite(n)) return "∞";
  if (n === 0) return "0";
  if (Math.abs(n) < 1e-9) return n.toExponential(4);
  if (Math.abs(n) >= 1e12) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toLocaleString("en", { maximumFractionDigits: 8 });
}

export default function UnitConverter() {
  const [catKey,   setCatKey]   = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit,   setToUnit]   = useState("km");
  const [input,    setInput]    = useState("");
  const [result,   setResult]   = useState("");
  const [copied,   setCopied]   = useState(false);

  const cat   = CATS[catKey];
  const units = cat.units;

  useEffect(() => {
    const keys = Object.keys(units);
    setFromUnit(keys[0]); setToUnit(keys[1] ?? keys[0]);
    setInput(""); setResult("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catKey]);

  useEffect(() => {
    const v = parseFloat(input);
    if (isNaN(v) || input === "") { setResult(""); return; }
    setResult(fmt(units[toUnit].fromBase(units[fromUnit].toBase(v))));
  }, [input, fromUnit, toUnit, units]);

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${input} ${units[fromUnit].label} = ${result} ${units[toUnit].label}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const unitOptions = Object.entries(units).map(([k, u]) => ({ value: k, label: u.label }));

  return (
    <CalcShell
      icon={ArrowLeftRight} iconColor={cat.accentText} iconBg={cat.accent.replace("bg-", "bg-") + "/10"}
      title="Unit Converter" description="Length, weight, temperature, speed, volume, area, data"
      tabs={Object.entries(CATS).map(([k, c]) => ({ key: k, label: c.label, icon: c.icon }))}
      activeTab={catKey} onTab={setCatKey} accentColor={cat.accent}
    >
      {/* Converter card */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5 sm:p-6 mb-4">
        <h2 className="font-display text-base font-semibold text-foreground mb-5 flex items-center gap-2">
          <span>{cat.icon}</span> {cat.label} Converter
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_44px_1fr] gap-3 sm:gap-4 items-end">
          {/* Left */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Value</label>
            <Input
              type="number" placeholder="Enter value"
              value={input} onChange={(e) => setInput(e.target.value)}
              className="rounded-xl h-12 text-base"
              step="any"
            />
            <label className="block text-sm font-medium text-foreground pt-1">From</label>
            <StyledSelect value={fromUnit} onChange={setFromUnit} options={unitOptions} />
          </div>

          {/* Swap */}
          <div className="flex sm:flex-col items-center justify-center sm:pt-6">
            <button
              onClick={swap}
              className={cn(
                "w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center",
                "border border-border bg-secondary hover:bg-secondary/70 transition-all hover:scale-110",
                cat.accentText
              )}
            >
              <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Right */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Result</label>
            <div className={cn(
              "relative h-12 rounded-xl border flex items-center px-4",
              result
                ? `border-current/30 bg-secondary/50 ${cat.accentText} font-mono font-bold text-base`
                : "border-border bg-secondary/30 text-muted-foreground/50 text-base"
            )}>
              <span className="flex-1 truncate">{result || "—"}</span>
              {result && (
                <button onClick={copy} className="ml-2 p-1 rounded hover:bg-black/5 transition-colors">
                  {copied
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <Copy  className="w-4 h-4 text-muted-foreground" />}
                </button>
              )}
            </div>
            <label className="block text-sm font-medium text-foreground pt-1">To</label>
            <StyledSelect value={toUnit} onChange={setToUnit} options={unitOptions} />
          </div>
        </div>

        {/* Summary */}
        {result && input && (
          <div className="mt-4 rounded-xl bg-secondary/50 px-4 py-3 text-sm text-center">
            <span className="text-muted-foreground">{input}</span>
            {" "}<span className="text-muted-foreground text-xs">{units[fromUnit].label}</span>
            {" = "}
            <span className={cn("font-bold", cat.accentText)}>{result}</span>
            {" "}<span className="text-muted-foreground text-xs">{units[toUnit].label}</span>
          </div>
        )}
      </div>

      {/* Bottom 2-col: common conversions + formulas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoTable
          title="Common Conversions" icon="🔄"
          rows={cat.commonConversions}
        />
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5 sm:p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>📐</span> Formulas
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            All conversions use standard conversion factors.
          </p>
          <div className="space-y-2">
            {cat.formulas.map((f) => (
              <div key={f} className="text-sm bg-secondary/50 rounded-lg px-3 py-2">
                <span className="font-medium text-foreground">{f.includes(":") ? f.split(":")[0] + ":" : "Note:"}</span>
                {" "}<span className="text-muted-foreground">{f.includes(":") ? f.split(":").slice(1).join(":") : f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalcShell>
  );
}