
import ConstructionCalculator from "@/components/ui/calculators/construction/construction-calculator";
import Sidebar from "@/components/ui/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Calculator Nepal — Concrete, Brickwork, Rebar, BOQ",
  description: "Calculate concrete materials, brickwork, plastering, rebar weight and generate BOQ for Nepal construction.",
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><ConstructionCalculator /></div>
      </div>
    </div>
  );
}