import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNPR(amount: number): string {
  return new Intl.NumberFormat("ne-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 2): string {
  return num.toFixed(decimals);
}

export function parseNumber(value: string): number {
  return parseFloat(value.replace(/,/g, "")) || 0;
}

export function nepaliNumberFormat(num: number): string {
  if (isNaN(num)) return "0.00";
  const fixed = Math.abs(num).toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const formatted =
    rest.length > 0
      ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      : lastThree;
  return (num < 0 ? "-" : "") + formatted + "." + decPart;
}