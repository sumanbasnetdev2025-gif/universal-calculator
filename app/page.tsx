import CalculatorGrid from "@/components/ui/home/calculator-grid";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-12 max-w-2xl opacity-0 animate-fade-up stagger-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Built for Nepal
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4">
          Smart Calculators<br />
          <span className="text-violet-500">for Every Need</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          From BS/AD date conversion to NEA electricity bills — all the calculators
          Nepalis actually need, in one place.
        </p>
      </div>

      {/* Grid */}
      <CalculatorGrid />
    </div>
  );
}