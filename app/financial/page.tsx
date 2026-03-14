
import FinancialCalculator from "@/components/ui/calculators/financial/financial-calculator";
import Sidebar from "@/components/ui/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Calculator Nepal — EMI, VAT 13%, Break-Even",
  description: "Calculate loan EMI for Nepal banks, add/extract 13% VAT, and run break-even analysis.",
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><FinancialCalculator /></div>
      </div>
    </div>
  );
}