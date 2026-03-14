
import { FuelCalculator } from "@/components/ui/calculators/other-calculators";
import Sidebar from "@/components/ui/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuel Cost Calculator Nepal — Petrol & Diesel Journey Cost",
  description: "Calculate petrol and diesel fuel costs for any Nepal journey. Includes popular routes and vehicle mileage presets.",
};

export default function FuelPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><FuelCalculator /></div>
      </div>
    </div>
  );
}