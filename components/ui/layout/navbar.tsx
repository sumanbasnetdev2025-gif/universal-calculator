"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Menu, X, Calculator } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Date",         href: "/date-converter"   },
  { label: "Salary",       href: "/salary-payroll"   },
  { label: "Construction", href: "/construction"     },
  { label: "Land",         href: "/land-units"       },
  { label: "Financial",    href: "/financial"        },
  { label: "Units",        href: "/unit-converter"   },
  { label: "Electricity",  href: "/electricity-bill" },
  { label: "Fuel",         href: "/fuel-cost"        },
  { label: "Health",       href: "/health-lifestyle" },
];

export default function Navbar() {
  const pathname                    = usePathname();
  const { theme, setTheme }         = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible,    setVisible]    = useState(true);
  const lastY                       = useRef(0);

  // Scroll-hide behavior
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if      (y < 10)              setVisible(true);
          else if (y > lastY.current + 6) { setVisible(false); setMobileOpen(false); }
          else if (y < lastY.current - 6)   setVisible(true);
          lastY.current = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
        "glass border-b border-white/10",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-display text-lg sm:text-xl font-bold">
              Calc<span className="text-violet-400">Nepal</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors whitespace-nowrap",
                  pathname === link.href
                    ? "bg-violet-500/20 text-violet-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              aria-label="Toggle theme"
            >
              <Sun  className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            <button
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 glass">
          <nav className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-2 py-2.5 rounded-xl text-xs font-medium text-center transition-colors",
                  pathname === link.href
                    ? "bg-violet-500/20 text-violet-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}