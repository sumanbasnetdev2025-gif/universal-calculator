
import { LandCalculator } from "@/components/ui/calculators/other-calculators";
import Sidebar from "@/components/ui/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepal Land Unit Converter — Ropani, Aana, Bigha, Kattha, Dhur",
  description: "Convert Nepal land units: Ropani, Aana, Bigha, Kattha, Dhur to sq ft, sq metres and more.",
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><LandCalculator /></div>
      </div>
    </div>
  );
}