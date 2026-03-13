export interface CalculatorTool {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  category: string;
}

export interface ConversionResult {
  value: number | string;
  unit?: string;
  label: string;
}

// Date Types
export interface NepaliDateObj {
  year: number;
  month: number;
  day: number;
}

export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

// Salary Types
export interface SalaryBreakdown {
  basic: number;
  ssf: number;
  taxableIncome: number;
  incomeTax: number;
  netSalary: number;
}

// Financial Types
export interface EMIResult {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  schedule: EMIScheduleRow[];
}

export interface EMIScheduleRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

// Electricity Types
export interface ElectricityResult {
  units: number;
  energyCharge: number;
  serviceCharge: number;
  rebate: number;
  total: number;
  slabBreakdown: SlabBreakdown[];
}

export interface SlabBreakdown {
  slab: string;
  units: number;
  rate: number;
  amount: number;
}

// Construction Types
export interface ConcreteResult {
  cement: number;
  sand: number;
  aggregate: number;
  water: number;
  cementBags: number;
}

// Health Types
export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  healthyWeightRange: { min: number; max: number };
}