// Nepal Land Units - Hilly/Pahadi system
export const LAND_CONVERSIONS_HILLY = {
  ropani: 1,
  aana: 16,
  paisa: 64,
  daam: 256,
  sqft: 5476,
  sqm: 508.72,
  sqyard: 608.44,
  hectare: 0.050872,
  bigha: 0.190735,
};

// Nepal Land Units - Terai system
export const LAND_CONVERSIONS_TERAI = {
  bigha: 1,
  kattha: 20,
  dhur: 400,
  sqft: 72900,
  sqm: 6772.63,
  sqyard: 8100,
  hectare: 0.677263,
  ropani: 13.31,
};

export function convertLandUnit(
  value: number,
  from: string,
  to: string,
  system: "hilly" | "terai"
): number {
  const conversions = system === "hilly" ? LAND_CONVERSIONS_HILLY : LAND_CONVERSIONS_TERAI;
  const fromRate = conversions[from as keyof typeof conversions];
  const toRate = conversions[to as keyof typeof conversions];
  if (!fromRate || !toRate) return 0;
  // Convert to base unit (ropani or bigha), then to target
  const inBase = value / fromRate;
  return inBase * toRate;
}

export const HILLY_UNITS = ["ropani", "aana", "paisa", "daam", "sqft", "sqm", "sqyard", "hectare"];
export const TERAI_UNITS = ["bigha", "kattha", "dhur", "sqft", "sqm", "sqyard", "hectare"];