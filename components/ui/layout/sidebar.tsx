"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar, Briefcase, Building2, MapPin,
  CreditCard, ArrowLeftRight, Zap, Fuel, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLS = [
  { label: "Date Converter",    href: "/date-converter",   icon: Calendar,       color: "text-violet-400", bg: "bg-violet-500/15"  },
  { label: "Salary & Payroll",  href: "/salary-payroll",   icon: Briefcase,      color: "text-emerald-400",bg: "bg-emerald-500/15" },
  { label: "Construction",      href: "/construction",     icon: Building2,      color: "text-orange-400", bg: "bg-orange-500/15"  },
  { label: "Land Units",        href: "/land-units",       icon: MapPin,         color: "text-teal-400",   bg: "bg-teal-500/15"    },
  { label: "Financial",         href: "/financial",        icon: CreditCard,     color: "text-blue-400",   bg: "bg-blue-500/15"    },
  { label: "Unit Converter",    href: "/unit-converter",   icon: ArrowLeftRight, color: "text-pink-400",   bg: "bg-pink-500/15"    },
  { label: "Electricity Bill",  href: "/electricity-bill", icon: Zap,            color: "text-amber-400",  bg: "bg-amber-500/15"   },
  { label: "Fuel Cost",         href: "/fuel-cost",        icon: Fuel,           color: "text-red-400",    bg: "bg-red-500/15"     },
  { label: "Health & Lifestyle",href: "/health-lifestyle", icon: Heart,          color: "text-green-400",  bg: "bg-green-500/15"   },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 hidden xl:block">
      <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">
          All Tools
        </p>
        <nav className="space-y-0.5">
          {TOOLS.map(({ label, href, icon: Icon, color, bg }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all",
                  active
                    ? "bg-violet-500/20 text-violet-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <span className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0", bg)}>
                  <Icon className={cn("w-3.5 h-3.5", color)} />
                </span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}