
import { HealthCalculator } from "@/components/ui/calculators/other-calculators";
import Sidebar from "@/components/ui/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Lifestyle Calculator — BMI, Expiry Date, Percentage",
  description: "Calculate BMI, check product expiry status and shelf life, use percentage calculator for marks and discounts.",
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><HealthCalculator /></div>
      </div>
    </div>
  );
}