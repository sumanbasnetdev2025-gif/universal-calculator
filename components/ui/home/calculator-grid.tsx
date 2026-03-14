"use client";
import {
  Calendar, Briefcase, Building2, MapPin,
  CreditCard, ArrowLeftRight, Zap, Fuel, Heart,
} from "lucide-react";
import CalculatorCard from "./calculator-card";

const tools = [
  {
    title:       "Date Converter",
    description: "AD ↔ BS conversion, age calculator, date & time differences",
    href:        "/date-converter",
    icon:        Calendar,
    gradient:    "bg-gradient-to-br from-violet-400 to-purple-500",
    iconBg:      "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    title:       "Salary & Payroll",
    description: "Hourly to salary, Nepal tax calculator, net pay",
    href:        "/salary-payroll",
    icon:        Briefcase,
    gradient:    "bg-gradient-to-br from-emerald-400 to-green-500",
    iconBg:      "bg-gradient-to-br from-emerald-500 to-green-600",
  },
  {
    title:       "Construction",
    description: "Concrete, brickwork, plastering, BOQ generator",
    href:        "/construction",
    icon:        Building2,
    gradient:    "bg-gradient-to-br from-orange-400 to-red-400",
    iconBg:      "bg-gradient-to-br from-orange-500 to-red-500",
  },
  {
    title:       "Land Units",
    description: "Ropani, Aana, Kattha, Dhur, Bigha converter",
    href:        "/land-units",
    icon:        MapPin,
    gradient:    "bg-gradient-to-br from-teal-400 to-cyan-500",
    iconBg:      "bg-gradient-to-br from-teal-500 to-cyan-600",
  },
  {
    title:       "Financial",
    description: "EMI, VAT, profit margin, break-even analysis",
    href:        "/financial",
    icon:        CreditCard,
    gradient:    "bg-gradient-to-br from-blue-400 to-indigo-500",
    iconBg:      "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    title:       "Unit Converter",
    description: "Length, weight, temperature, speed, volume",
    href:        "/unit-converter",
    icon:        ArrowLeftRight,
    gradient:    "bg-gradient-to-br from-pink-400 to-rose-500",
    iconBg:      "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    title:       "Electricity Bill",
    description: "NEA slab-based calculator with service charges",
    href:        "/electricity-bill",
    icon:        Zap,
    gradient:    "bg-gradient-to-br from-amber-400 to-yellow-500",
    iconBg:      "bg-gradient-to-br from-amber-500 to-yellow-600",
  },
  {
    title:       "Fuel Cost",
    description: "Calculate fuel costs for any Nepal journey",
    href:        "/fuel-cost",
    icon:        Fuel,
    gradient:    "bg-gradient-to-br from-red-400 to-rose-500",
    iconBg:      "bg-gradient-to-br from-red-500 to-rose-600",
  },
  {
    title:       "Health & Lifestyle",
    description: "BMI, expiry date, percentage calculator",
    href:        "/health-lifestyle",
    icon:        Heart,
    gradient:    "bg-gradient-to-br from-green-400 to-emerald-500",
    iconBg:      "bg-gradient-to-br from-green-500 to-emerald-600",
  },
];

export default function CalculatorGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {tools.map((tool) => (
        <CalculatorCard key={tool.href} {...tool} />
      ))}
    </div>
  );
}