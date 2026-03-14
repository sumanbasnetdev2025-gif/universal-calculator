
import NEACalculator from "@/components/ui/calculators/electricity/nea-calculator";
import Sidebar from "@/components/ui/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEA Electricity Bill Calculator Nepal — Slab Rates 2081",
  description: "Calculate Nepal electricity bill using NEA slab rates. Supports direct units, meter readings, and reverse calculation by amount.",
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><NEACalculator /></div>
      </div>
    </div>
  );
}