export interface NEASlab {
  min: number;
  max: number | null;
  rate: number;
  label: string;
}

// NEA residential tariff slabs (Rs per unit)
export const NEA_RESIDENTIAL_SLABS: NEASlab[] = [
  { min: 1, max: 20, rate: 3.0, label: "1–20 units" },
  { min: 21, max: 30, rate: 6.5, label: "21–30 units" },
  { min: 31, max: 50, rate: 8.0, label: "31–50 units" },
  { min: 51, max: 100, rate: 9.5, label: "51–100 units" },
  { min: 101, max: 150, rate: 9.5, label: "101–150 units" },
  { min: 151, max: 250, rate: 9.5, label: "151–250 units" },
  { min: 251, max: null, rate: 11.0, label: "251+ units" },
];

export const NEA_SERVICE_CHARGES = {
  "5A": 30,
  "15A": 50,
  "30A": 75,
  "60A": 100,
  "100A": 150,
};

export function calculateNEABill(units: number, ampere: keyof typeof NEA_SERVICE_CHARGES = "5A") {
  let energyCharge = 0;
  const slabBreakdown: { slab: string; units: number; rate: number; amount: number }[] = [];
  let remaining = units;

  for (const slab of NEA_RESIDENTIAL_SLABS) {
    if (remaining <= 0) break;
    const slabMax = slab.max ?? Infinity;
    const slabUnits = Math.min(remaining, slabMax - slab.min + 1);
    if (slabUnits > 0 && remaining > 0) {
      const usedInSlab = Math.min(remaining, slab.max ? slab.max - slab.min + 1 : remaining);
      const amount = usedInSlab * slab.rate;
      energyCharge += amount;
      slabBreakdown.push({ slab: slab.label, units: usedInSlab, rate: slab.rate, amount });
      remaining -= usedInSlab;
    }
  }

  const serviceCharge = NEA_SERVICE_CHARGES[ampere];
  const rebate = units <= 20 ? energyCharge * 0.1 : 0;
  const total = energyCharge + serviceCharge - rebate;

  return { units, energyCharge, serviceCharge, rebate, total, slabBreakdown };
}