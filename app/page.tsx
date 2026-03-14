import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar, Briefcase, Building2, MapPin,
  CreditCard, ArrowLeftRight, Zap, Fuel, Heart,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title:       "CalcNepal — Smart Calculators for Nepal",
  description: "Free calculators for Nepal — BS/AD date, NEA electricity, EMI, land units, salary & tax, fuel cost, BMI and more.",
};

const TOOLS = [
  {
    title: "Date Converter",
    desc:  "BS/AD conversion, age calc, time difference",
    href:  "/date-converter",
    icon:  Calendar,
    color: "text-violet-600",
    bg:    "bg-violet-100 dark:bg-violet-900/30",
    grad:  "from-violet-500 to-purple-600",
    tags:  ["BS↔AD", "Age", "Time Diff"],
  },
  {
    title: "Salary & Payroll",
    desc:  "Tax calculator, SSF deductions, net pay",
    href:  "/salary-payroll",
    icon:  Briefcase,
    color: "text-emerald-600",
    bg:    "bg-emerald-100 dark:bg-emerald-900/30",
    grad:  "from-emerald-500 to-green-600",
    tags:  ["Tax", "SSF", "Net Pay"],
  },
  {
    title: "Construction",
    desc:  "Concrete, brickwork, rebar, BOQ generator",
    href:  "/construction",
    icon:  Building2,
    color: "text-orange-600",
    bg:    "bg-orange-100 dark:bg-orange-900/30",
    grad:  "from-orange-500 to-red-500",
    tags:  ["Concrete", "Rebar", "BOQ"],
  },
  {
    title: "Land Units",
    desc:  "Ropani, Aana, Bigha, Kattha, Dhur",
    href:  "/land-units",
    icon:  MapPin,
    color: "text-teal-600",
    bg:    "bg-teal-100 dark:bg-teal-900/30",
    grad:  "from-teal-500 to-cyan-600",
    tags:  ["Hilly", "Terai", "All units"],
  },
  {
    title: "Financial",
    desc:  "EMI, VAT 13%, break-even analysis",
    href:  "/financial",
    icon:  CreditCard,
    color: "text-blue-600",
    bg:    "bg-blue-100 dark:bg-blue-900/30",
    grad:  "from-blue-500 to-indigo-600",
    tags:  ["EMI", "VAT", "Break-Even"],
  },
  {
    title: "Unit Converter",
    desc:  "Length, weight, temperature, speed, data",
    href:  "/unit-converter",
    icon:  ArrowLeftRight,
    color: "text-pink-600",
    bg:    "bg-pink-100 dark:bg-pink-900/30",
    grad:  "from-pink-500 to-rose-600",
    tags:  ["Length", "Weight", "Temp"],
  },
  {
    title: "Electricity Bill",
    desc:  "NEA slab calculator with service charges",
    href:  "/electricity-bill",
    icon:  Zap,
    color: "text-amber-600",
    bg:    "bg-amber-100 dark:bg-amber-900/30",
    grad:  "from-amber-500 to-yellow-500",
    tags:  ["NEA Slabs", "Direct", "By Amount"],
  },
  {
    title: "Fuel Cost",
    desc:  "Petrol & diesel journey cost calculator",
    href:  "/fuel-cost",
    icon:  Fuel,
    color: "text-red-600",
    bg:    "bg-red-100 dark:bg-red-900/30",
    grad:  "from-red-500 to-rose-600",
    tags:  ["Petrol", "Diesel", "Routes"],
  },
  {
    title: "Health & Lifestyle",
    desc:  "BMI, expiry date checker, percentage",
    href:  "/health-lifestyle",
    icon:  Heart,
    color: "text-green-600",
    bg:    "bg-green-100 dark:bg-green-900/30",
    grad:  "from-green-500 to-emerald-600",
    tags:  ["BMI", "Expiry", "Percentage"],
  },
];

function ToolCard({ tool }: { tool: typeof TOOLS[0] }) {
  const Icon = tool.icon;
  return (
    <Link href={tool.href}>
      <div className={cn(
        "group bg-card rounded-2xl border border-border/60 p-5",
"hover:border-violet-300/60 dark:hover:border-violet-700",
"hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
      )}>
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
  "w-10 h-10 rounded-xl flex items-center justify-center",
  "bg-gradient-to-br", tool.grad
)}>
            <Icon className={cn("w-5 h-5", tool.color)} />
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all mt-1" />
        </div>
        <h3 className="font-display text-sm sm:text-[15px] tracking-tight font-semibold text-foreground mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {tool.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
          {tool.desc}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary/70 text-muted-foreground backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Hero */}
<div className="mb-10 sm:mb-12 relative">
  <div className="absolute -top-10 -left-10 w-72 h-72 bg-violet-500/10 blur-3xl rounded-full" />
  
      <div className="relative z-10 max-w-xl">
    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3">
      Smart Calculators
      <br />
      <span className="text-primary">for Every Need</span>
    </h1>
    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
      From BS/AD date conversion to NEA electricity bills — all the calculators
      Nepalis actually use, in one clean place.
    </p>
  </div>
</div>

      {/* Tool grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.href} tool={tool} />
        ))}
      </div>

      {/* Bottom feature strip */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: "⚡", label: "Instant results",    sub: "Real-time calculation" },
          { icon: "📱", label: "Mobile friendly",    sub: "Works on all devices"  },
          { icon: "🆓", label: "Completely free",    sub: "No signup required"    },
          { icon: "🇳🇵", label: "Nepal-specific",   sub: "NEA, BS/AD, SSF, VAT"  },
        ].map((f) => (
          <div key={f.label} className="bg-white dark:bg-white/5 rounded-xl border border-border/60 p-4 text-center">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="text-sm font-semibold text-foreground">{f.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{f.sub}</p>
          </div>
        ))}
      </div>
    </div>
  
  );
}