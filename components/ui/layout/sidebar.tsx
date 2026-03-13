"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar, Briefcase, Building2, MapPin,
  CreditCard, ArrowLeftRight, Zap, Fuel, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarTools = [
  { label: "Date Converter", href: "/date-converter", icon: Calendar, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { label: "Salary & Payroll", href: "/salary-payroll", icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { label: "Construction", href: "/construction", icon: Building2, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { label: "Land Units", href: "/land-units", icon: MapPin, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20" },
  { label: "Financial", href: "/financial", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Unit Converter", href: "/unit-converter", icon: ArrowLeftRight, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
  { label: "Electricity Bill", href: "/electricity-bill", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { label: "Fuel Cost", href: "/fuel-cost", icon: Fuel, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  { label: "Health & Lifestyle", href: "/health-lifestyle", icon: Heart, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden xl:block">
      <div className="sticky top-24 glass rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-2">
          All Tools
        </p>
        <nav className="space-y-1">
          {sidebarTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", tool.bg)}>
                  <Icon className={cn("w-4 h-4", tool.color)} />
                </span>
                {tool.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}