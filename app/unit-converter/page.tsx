
import UnitConverter from "@/components/ui/calculators/unit-converter/unit-converter";
import Sidebar from "@/components/ui/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Converter — Length, Weight, Temperature, Speed, Volume",
  description: "Convert length, weight, temperature, speed, volume, area and data units. Includes Tola (Nepal gold unit).",
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><UnitConverter /></div>
      </div>
    </div>
  );
}