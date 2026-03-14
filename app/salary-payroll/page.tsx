
import SalaryCalculator from "@/components/ui/calculators/date-converter/salary/salary-calculator";
import Sidebar from "@/components/ui/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary & Payroll Calculator Nepal — Tax, SSF, Net Pay",
  description: "Calculate Nepal salary, income tax FY 2081/82, SSF deductions and net take-home pay.",
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><SalaryCalculator /></div>
      </div>
    </div>
  );
}