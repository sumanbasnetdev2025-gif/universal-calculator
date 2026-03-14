
"use client";
import DateConverter from "@/components/ui/calculators/date-converter/date-converter";
import Sidebar from "@/components/ui/layout/sidebar";

 
export default function DateConverterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0"><DateConverter /></div>
      </div>
    </div>
  );
}