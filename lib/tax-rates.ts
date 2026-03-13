// Nepal Income Tax FY 2081/82
export const INCOME_TAX_SLABS_INDIVIDUAL = [
  { min: 0, max: 600000, rate: 0.01, label: "Up to Rs 6 Lakh" },
  { min: 600000, max: 800000, rate: 0.10, label: "Rs 6–8 Lakh" },
  { min: 800000, max: 1100000, rate: 0.20, label: "Rs 8–11 Lakh" },
  { min: 1100000, max: 2000000, rate: 0.30, label: "Rs 11–20 Lakh" },
  { min: 2000000, max: null, rate: 0.36, label: "Above Rs 20 Lakh" },
];

export const SSF_EMPLOYEE_RATE = 0.11; // 11%
export const SSF_EMPLOYER_RATE = 0.20; // 20%
export const CIT_RATE = 0.25; // 25%
export const VAT_RATE = 0.13; // 13%

export function calculateIncomeTax(annualIncome: number): number {
  let tax = 0;
  for (const slab of INCOME_TAX_SLABS_INDIVIDUAL) {
    if (annualIncome <= slab.min) break;
    const taxable = slab.max ? Math.min(annualIncome, slab.max) - slab.min : annualIncome - slab.min;
    tax += taxable * slab.rate;
  }
  return tax;
}

export function calculateSSF(basicSalary: number) {
  return {
    employee: basicSalary * SSF_EMPLOYEE_RATE,
    employer: basicSalary * SSF_EMPLOYER_RATE,
    total: basicSalary * (SSF_EMPLOYEE_RATE + SSF_EMPLOYER_RATE),
  };
}

export function calculateNetSalary(grossMonthly: number) {
  const annualGross = grossMonthly * 12;
  const ssf = calculateSSF(grossMonthly);
  const taxableAnnual = annualGross - ssf.employee * 12;
  const annualTax = calculateIncomeTax(taxableAnnual);
  const monthlyTax = annualTax / 12;
  const netSalary = grossMonthly - ssf.employee - monthlyTax;
  return { grossMonthly, ssfEmployee: ssf.employee, ssfEmployer: ssf.employer, monthlyTax, netSalary };
}