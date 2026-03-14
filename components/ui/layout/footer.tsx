import Link from "next/link";
import { Calculator, Heart } from "lucide-react";

const LINKS = [
  {
    heading: "Calculators",
    links: [
      { label: "Date Converter",   href: "/date-converter"   },
      { label: "Salary & Payroll", href: "/salary-payroll"   },
      { label: "Construction",     href: "/construction"     },
      { label: "Land Units",       href: "/land-units"       },
    ],
  },
  {
    heading: "More Tools",
    links: [
      { label: "Financial",        href: "/financial"        },
      { label: "Unit Converter",   href: "/unit-converter"   },
      { label: "Electricity Bill", href: "/electricity-bill" },
      { label: "Fuel Cost",        href: "/fuel-cost"        },
    ],
  },
  {
    heading: "Health",
    links: [
      { label: "BMI Calculator",   href: "/health-lifestyle" },
      { label: "Expiry Date",      href: "/health-lifestyle" },
      { label: "Percentage Calc",  href: "/health-lifestyle" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/[0.02] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">
                Calc<span className="text-violet-400">Nepal</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Smart calculators built for Nepal. From BS/AD conversion to NEA electricity bills.
            </p>
          </div>

          {/* Link columns */}
          {LINKS.map((section) => (
            <div key={section.heading}>
              <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-widest mb-3">
                {section.heading}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-violet-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CalcNepal. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}