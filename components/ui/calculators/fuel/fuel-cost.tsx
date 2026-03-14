"use client";
import { useState } from "react";
import { Fuel, MapPin, TrendingDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, nepaliNumberFormat } from "@/lib/utils";

// Nepal fuel prices (approx, update as needed)
const FUEL_TYPES = [
  { key: "petrol",       label: "Petrol",         price: 179,  icon: "⛽", color: "from-red-500 to-rose-500"    },
  { key: "diesel",       label: "Diesel",          price: 163,  icon: "🛢️", color: "from-orange-500 to-amber-500" },
  { key: "kerosene",     label: "Kerosene",        price: 163,  icon: "🪔", color: "from-yellow-500 to-amber-400" },
  { key: "lpg_cylinder", label: "LP Gas (14.2kg)", price: 1375, icon: "🔥", color: "from-blue-500 to-indigo-500"  },
];

const VEHICLE_PRESETS = [
  { label: "Motorcycle",      mileage: 45, icon: "🏍️" },
  { label: "Car (Hatchback)", mileage: 15, icon: "🚗" },
  { label: "Car (Sedan)",     mileage: 13, icon: "🚙" },
  { label: "SUV / Jeep",      mileage: 10, icon: "🚐" },
  { label: "Microbus",        mileage: 8,  icon: "🚌" },
  { label: "Truck",           mileage: 5,  icon: "🚛" },
];

interface FuelResult {
  distance:       number;
  mileage:        number;
  fuelNeeded:     number;
  fuelPrice:      number;
  totalCost:      number;
  costPerKm:      number;
  returnCost?:    number;
  returnFuel?:    number;
}

export default function FuelCostCalculator() {
  const [distance,      setDistance]      = useState("");
  const [mileage,       setMileage]       = useState("");
  const [fuelType,      setFuelType]      = useState("petrol");
  const [customPrice,   setCustomPrice]   = useState("");
  const [useCustom,     setUseCustom]     = useState(false);
  const [roundTrip,     setRoundTrip]     = useState(false);
  const [passengers,    setPassengers]    = useState("1");
  const [result,        setResult]        = useState<FuelResult | null>(null);
  const [error,         setError]         = useState<string | null>(null);

  const selectedFuel = FUEL_TYPES.find((f) => f.key === fuelType)!;

  const handleCalculate = () => {
    setError(null);
    const dist = parseFloat(distance);
    const mil  = parseFloat(mileage);
    const price = useCustom
      ? parseFloat(customPrice)
      : selectedFuel.price;

    if (!dist || dist <= 0)  return setError("Enter a valid distance.");
    if (!mil  || mil  <= 0)  return setError("Enter a valid mileage.");
    if (!price || price <= 0) return setError("Enter a valid fuel price.");

    const fuelNeeded  = dist / mil;
    const totalCost   = fuelNeeded * price;
    const costPerKm   = totalCost / dist;
    const returnFuel  = roundTrip ? fuelNeeded * 2 : undefined;
    const returnCost  = roundTrip ? totalCost * 2  : undefined;

    setResult({ distance: dist, mileage: mil, fuelNeeded, fuelPrice: price,
      totalCost, costPerKm, returnCost, returnFuel });
  };

  const handleReset = () => {
    setDistance(""); setMileage(""); setCustomPrice("");
    setResult(null); setError(null);
  };

  const perPersonCost = result
    ? result.totalCost / (parseInt(passengers) || 1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input card */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
          <h2 className="font-display text-lg font-semibold mb-5">Journey Details</h2>

          <div className="space-y-5">
            {/* Fuel type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Fuel Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {FUEL_TYPES.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => { setFuelType(f.key); setUseCustom(false); }}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border text-left transition-all",
                      fuelType === f.key && !useCustom
                        ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                        : "border-border bg-secondary/30 hover:border-red-300"
                    )}
                  >
                    <span className="text-xl">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.label}</p>
                      <p className="text-xs text-muted-foreground">Rs. {f.price}/L</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom price */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Fuel Price</Label>
                  <button
                    onClick={() => setUseCustom(!useCustom)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    {useCustom ? "Use preset price" : "Custom price"}
                  </button>
                </div>
                {useCustom ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">Rs.</span>
                    <Input
                      type="number"
                      placeholder="Enter price per litre"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="rounded-xl pl-10"
                      min={0}
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400">
                    Rs. {selectedFuel.price} / litre (Current Nepal price)
                  </div>
                )}
              </div>
            </div>

            {/* Distance */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Distance (km)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <Input
                  type="number"
                  placeholder="e.g. 300"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="rounded-xl pl-10"
                  min={0}
                />
              </div>
            </div>

            {/* Mileage */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Vehicle Mileage (km/L)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 15"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="rounded-xl"
                min={1}
              />
              {/* Vehicle presets */}
              <div className="flex flex-wrap gap-2 mt-2">
                {VEHICLE_PRESETS.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => setMileage(v.mileage.toString())}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{v.icon}</span>
                    {v.label} (~{v.mileage})
                  </button>
                ))}
              </div>
            </div>

            {/* Options row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Round trip */}
              <div
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 cursor-pointer"
                onClick={() => setRoundTrip(!roundTrip)}
              >
                <span className="text-sm font-medium">Round Trip</span>
                <div className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  roundTrip ? "bg-red-500" : "bg-secondary border border-border"
                )}>
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                    roundTrip ? "left-5" : "left-0.5"
                  )} />
                </div>
              </div>

              {/* Passengers */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Passengers</Label>
                <Input
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="rounded-xl h-11"
                  min={1}
                  max={50}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-5">
            <Button
              onClick={handleCalculate}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
            >
              <Fuel className="w-4 h-4 mr-2" />
              Calculate Cost
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-xl px-4"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Result */}
        <div className={cn(
          "rounded-2xl border border-border/60 p-6",
          result
            ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800"
            : "bg-white dark:bg-white/5"
        )}>
          <h2 className="font-display text-lg font-semibold mb-4">Cost Breakdown</h2>

          {result ? (
            <div className="space-y-3">
              {/* Main cost */}
              <div className="bg-red-500 text-white rounded-xl p-5 text-center">
                <p className="text-sm opacity-80 mb-1">
                  Total Fuel Cost {roundTrip ? "(One Way)" : ""}
                </p>
                <p className="font-display text-4xl font-bold">
                  Rs. {nepaliNumberFormat(result.totalCost)}
                </p>
                <p className="text-sm opacity-70 mt-1">
                  {result.fuelNeeded.toFixed(2)} litres needed
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Distance",      value: `${result.distance} km`                },
                  { label: "Fuel Needed",   value: `${result.fuelNeeded.toFixed(2)} L`    },
                  { label: "Cost / km",     value: `Rs. ${result.costPerKm.toFixed(2)}`   },
                  { label: "Fuel Price",    value: `Rs. ${result.fuelPrice}/L`            },
                ].map((s) => (
                  <div key={s.label}
                    className="bg-white dark:bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="font-mono text-sm font-bold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Round trip */}
              {roundTrip && result.returnCost && (
                <div className="bg-white dark:bg-white/10 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Round Trip Total
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Fuel</p>
                      <p className="font-mono font-bold text-foreground">
                        {result.returnFuel!.toFixed(2)} L
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                      <p className="font-display text-2xl font-bold text-red-600 dark:text-red-400">
                        Rs. {nepaliNumberFormat(result.returnCost)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Per person */}
              {parseInt(passengers) > 1 && (
                <div className="bg-white dark:bg-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Cost per person
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Split among {passengers} passengers
                      </p>
                    </div>
                  </div>
                  <p className="font-display text-xl font-bold text-green-600 dark:text-green-400">
                    Rs. {nepaliNumberFormat(perPersonCost)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                  <Fuel className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter journey details to calculate fuel cost
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular routes reference */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h3 className="font-display text-base font-semibold mb-4">
          🗺️ Popular Nepal Routes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { from: "Kathmandu", to: "Pokhara",    km: 200 },
            { from: "Kathmandu", to: "Chitwan",    km: 150 },
            { from: "Kathmandu", to: "Biratnagar", km: 400 },
            { from: "Kathmandu", to: "Butwal",     km: 270 },
            { from: "Pokhara",   to: "Chitwan",    km: 120 },
            { from: "Kathmandu", to: "Dharan",     km: 370 },
            { from: "Kathmandu", to: "Nepalgunj",  km: 530 },
            { from: "Kathmandu", to: "Janakpur",   km: 225 },
          ].map((r) => (
            <button
              key={r.from + r.to}
              onClick={() => setDistance(r.km.toString())}
              className="text-left p-3 rounded-xl border border-border bg-secondary/30 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <p className="text-xs text-muted-foreground">{r.from} → {r.to}</p>
              <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                ~{r.km} km
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}